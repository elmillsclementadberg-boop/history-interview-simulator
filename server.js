const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || "0.0.0.0";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_CHAT_URL = process.env.GROQ_CHAT_URL || "https://api.groq.com/openai/v1/chat/completions";
const GROQ_TRANSCRIBE_URL = process.env.GROQ_TRANSCRIBE_URL || "https://api.groq.com/openai/v1/audio/transcriptions";

const RATE_LIMIT_PER_MINUTE = Number(process.env.RATE_LIMIT_PER_MINUTE || 20);
const DAILY_CAP_PER_IP = Number(process.env.DAILY_CAP_PER_IP || 200);
const DAILY_GLOBAL_CAP = Number(process.env.DAILY_GLOBAL_CAP || 5000);
const JSON_BODY_LIMIT_BYTES = Number(process.env.JSON_BODY_LIMIT_BYTES || 512 * 1024);
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL || "";
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || "";
const REDIS_LIMITING_ENABLED = Boolean(UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN);

const STATIC_ROOT = __dirname;

const minuteBuckets = new Map();
const dayBuckets = new Map();
let globalDay = dateKey();
let globalDayCount = 0;

function dateKey() {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function resetDailyCountersIfNeeded() {
  const today = dateKey();
  if (today !== globalDay) {
    globalDay = today;
    globalDayCount = 0;
    dayBuckets.clear();
  }
}

function clientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length > 0) {
    return xff.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "unknown";
}

function checkRateLimit(ip) {
  resetDailyCountersIfNeeded();

  const now = Date.now();
  const minute = minuteBuckets.get(ip);
  if (!minute || now - minute.start >= 60_000) {
    minuteBuckets.set(ip, { start: now, count: 1 });
  } else {
    minute.count += 1;
    if (minute.count > RATE_LIMIT_PER_MINUTE) {
      return { ok: false, code: 429, message: "请求过于频繁，请稍后再试" };
    }
  }

  const day = dayBuckets.get(ip) || { day: globalDay, count: 0 };
  if (day.day !== globalDay) {
    day.day = globalDay;
    day.count = 0;
  }
  day.count += 1;
  dayBuckets.set(ip, day);

  if (day.count > DAILY_CAP_PER_IP) {
    return { ok: false, code: 429, message: "今日请求次数已用完，请明天再试" };
  }

  globalDayCount += 1;
  if (globalDayCount > DAILY_GLOBAL_CAP) {
    return { ok: false, code: 503, message: "今日体验名额已满，请明天再来" };
  }

  return { ok: true };
}

function secondsUntilUtcTomorrow() {
  const now = new Date();
  const tomorrowUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 10);
  return Math.max(60, Math.floor((tomorrowUtc - now.getTime()) / 1000));
}

function sanitizeKeyPart(raw) {
  return String(raw || "unknown").replace(/[^a-zA-Z0-9:._-]/g, "_");
}

async function upstashPipeline(commands) {
  const response = await fetch(`${UPSTASH_REDIS_REST_URL}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Upstash请求失败(${response.status}): ${text.slice(0, 120)}`);
  }

  const result = await response.json();
  if (!Array.isArray(result)) {
    throw new Error("Upstash返回格式异常");
  }

  return result;
}

async function upstashIncrWithExpire(key, ttlSeconds) {
  const pipeline = await upstashPipeline([
    ["INCR", key],
    ["EXPIRE", key, String(ttlSeconds)],
  ]);
  const incrResult = pipeline[0];
  if (incrResult?.error) {
    throw new Error(`Upstash INCR失败: ${incrResult.error}`);
  }
  return Number(incrResult?.result || 0);
}

async function checkRateLimitRedis(ip) {
  resetDailyCountersIfNeeded();

  const safeIp = sanitizeKeyPart(ip);
  const minuteSlice = Math.floor(Date.now() / 60_000);
  const today = dateKey();
  const dayTtl = secondsUntilUtcTomorrow() + 3600;

  const minuteKey = `rl:minute:${safeIp}:${minuteSlice}`;
  const dayIpKey = `rl:day:ip:${today}:${safeIp}`;
  const dayGlobalKey = `rl:day:global:${today}`;

  const minuteCount = await upstashIncrWithExpire(minuteKey, 120);
  if (minuteCount > RATE_LIMIT_PER_MINUTE) {
    return { ok: false, code: 429, message: "请求过于频繁，请稍后再试" };
  }

  const dayIpCount = await upstashIncrWithExpire(dayIpKey, dayTtl);
  if (dayIpCount > DAILY_CAP_PER_IP) {
    return { ok: false, code: 429, message: "今日请求次数已用完，请明天再试" };
  }

  const dayGlobalCount = await upstashIncrWithExpire(dayGlobalKey, dayTtl);
  if (dayGlobalCount > DAILY_GLOBAL_CAP) {
    return { ok: false, code: 503, message: "今日体验名额已满，请明天再来" };
  }

  return { ok: true };
}

async function checkRateLimitSafe(ip) {
  if (!REDIS_LIMITING_ENABLED) {
    return checkRateLimit(ip);
  }

  try {
    return await checkRateLimitRedis(ip);
  } catch (error) {
    // Redis不可用时兜底到内存限流，避免服务整体不可用。
    return checkRateLimit(ip);
  }
}

function sendJson(res, status, payload) {
  const data = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(data);
}

function sendText(res, status, text) {
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(text);
}

function contentTypeByExt(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".js":
      return "application/javascript; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

function serveStatic(req, res, pathname) {
  const safePath = pathname === "/" ? "/index.html" : pathname;
  const fullPath = path.normalize(path.join(STATIC_ROOT, safePath));
  if (!fullPath.startsWith(STATIC_ROOT)) {
    sendText(res, 403, "Forbidden");
    return;
  }

  fs.stat(fullPath, (err, stats) => {
    if (err || !stats.isFile()) {
      sendText(res, 404, "Not Found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": contentTypeByExt(fullPath),
      "Cache-Control": "public, max-age=300",
    });
    fs.createReadStream(fullPath).pipe(res);
  });
}

async function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let total = 0;
    const chunks = [];

    req.on("data", (chunk) => {
      total += chunk.length;
      if (total > JSON_BODY_LIMIT_BYTES) {
        reject(new Error("请求体过大"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf-8");
        resolve(JSON.parse(raw || "{}"));
      } catch {
        reject(new Error("JSON 格式错误"));
      }
    });

    req.on("error", reject);
  });
}

async function proxyChat(req, res) {
  if (!GROQ_API_KEY) {
    sendJson(res, 500, { error: "服务端未配置 GROQ_API_KEY" });
    return;
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (error) {
    sendJson(res, 400, { error: error.message || "请求无效" });
    return;
  }

  const payload = {
    model: body.model || "llama-3.1-8b-instant",
    messages: Array.isArray(body.messages) ? body.messages : [],
    temperature: typeof body.temperature === "number" ? body.temperature : 0.7,
  };

  try {
    const upstream = await fetch(GROQ_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const text = await upstream.text();
    res.writeHead(upstream.status, {
      "Content-Type": upstream.headers.get("content-type") || "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    });
    res.end(text);
  } catch (error) {
    sendJson(res, 502, { error: `上游请求失败: ${error.message}` });
  }
}

async function proxyTranscribe(req, res) {
  if (!GROQ_API_KEY) {
    sendJson(res, 500, { error: "服务端未配置 GROQ_API_KEY" });
    return;
  }

  const contentType = req.headers["content-type"] || "";
  if (!String(contentType).includes("multipart/form-data")) {
    sendJson(res, 400, { error: "仅支持 multipart/form-data" });
    return;
  }

  try {
    const upstream = await fetch(GROQ_TRANSCRIBE_URL, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: req,
      duplex: "half",
    });

    const text = await upstream.text();
    res.writeHead(upstream.status, {
      "Content-Type": upstream.headers.get("content-type") || "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    });
    res.end(text);
  } catch (error) {
    sendJson(res, 502, { error: `上游转写失败: ${error.message}` });
  }
}

const server = http.createServer(async (req, res) => {
  const method = req.method || "GET";
  const reqUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const pathname = reqUrl.pathname;

  if (pathname === "/api/health") {
    sendJson(res, 200, {
      ok: true,
      date: globalDay,
      limits: {
        minutePerIp: RATE_LIMIT_PER_MINUTE,
        dailyPerIp: DAILY_CAP_PER_IP,
        dailyGlobal: DAILY_GLOBAL_CAP,
        backend: REDIS_LIMITING_ENABLED ? "redis" : "memory",
      },
    });
    return;
  }

  if (pathname === "/api/chat" && method === "POST") {
    const ip = clientIp(req);
    const pass = await checkRateLimitSafe(ip);
    if (!pass.ok) {
      sendJson(res, pass.code, { error: pass.message });
      return;
    }
    await proxyChat(req, res);
    return;
  }

  if (pathname === "/api/transcribe" && method === "POST") {
    const ip = clientIp(req);
    const pass = await checkRateLimitSafe(ip);
    if (!pass.ok) {
      sendJson(res, pass.code, { error: pass.message });
      return;
    }
    await proxyTranscribe(req, res);
    return;
  }

  if (pathname.startsWith("/api/")) {
    sendJson(res, 404, { error: "API Not Found" });
    return;
  }

  serveStatic(req, res, pathname);
});

server.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://${HOST}:${PORT}`);
});
