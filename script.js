const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const finishBtn = document.getElementById("finishBtn");
const downloadReportBtn = document.getElementById("downloadReportBtn");
const voiceBtn = document.getElementById("voiceBtn");
const saveConfigBtn = document.getElementById("saveConfigBtn");
const sendBtn = document.getElementById("sendBtn");
const interviewPanel = document.getElementById("interviewPanel");
const chatBox = document.getElementById("chatBox");
const sceneStage = document.getElementById("sceneStage");
const seatLayer = document.getElementById("seatLayer");
const speakerBubble = document.getElementById("speakerBubble");
const answerForm = document.getElementById("answerForm");
const answerInput = document.getElementById("answerInput");
const statusLine = document.getElementById("statusLine");
const voiceHint = document.getElementById("voiceHint");

const trackSelect = document.getElementById("trackSelect");
const baseUrlInput = document.getElementById("baseUrlInput");
const modelInput = document.getElementById("modelInput");
const apiKeyInput = document.getElementById("apiKeyInput");

const configStorageKey = "historyInterviewConfig_v1";
const defaultConfig = {
  baseUrl: "/api/chat",
  model: "llama-3.1-8b-instant",
  apiKey: "",
};

const committeeMembers = [
  { id: "chief", name: "主考官李教授(男·资深)", skin: "#f2c7a5", hair: "#2f2f2f", jacket: "#8b5a3c", cls: "chief" },
  { id: "t1", name: "王老师(女·青年)", skin: "#e8b992", hair: "#3f342d", jacket: "#4f6478" },
  { id: "t2", name: "陈老师(男·中年)", skin: "#edc3a1", hair: "#4e3d2f", jacket: "#7a4f4f" },
  { id: "t3", name: "赵老师(女·资深)", skin: "#dca77f", hair: "#262626", jacket: "#516f53" },
  { id: "t4", name: "周老师(男·青年)", skin: "#f0cfb4", hair: "#5b4434", jacket: "#5e5f82" },
  { id: "t5", name: "刘老师(女·中年)", skin: "#e6b38e", hair: "#434343", jacket: "#7d5a3d" },
  { id: "t6", name: "孙老师(男·资深)", skin: "#e9bc98", hair: "#513e32", jacket: "#486d76" },
  { id: "t7", name: "张老师(女·青年)", skin: "#f1c8ac", hair: "#2e2b29", jacket: "#6d5e4d" },
  { id: "t8", name: "杨老师(男·中年)", skin: "#d9a27a", hair: "#3d322d", jacket: "#5b4f83" },
  { id: "t9", name: "徐老师(女·资深)", skin: "#f3d2b8", hair: "#45413f", jacket: "#5a6f4f" },
];

const studentMember = {
  id: "student",
  name: "考生（你）",
  skin: "#f1c9ab",
  hair: "#242424",
  jacket: "#0f766e",
  cls: "student",
};

const committeeSeatLayout = [
  { id: "t1", x: 27, y: 33 },
  { id: "t2", x: 38, y: 25 },
  { id: "t3", x: 50, y: 22 },
  { id: "t4", x: 62, y: 25 },
  { id: "t5", x: 73, y: 33 },
  { id: "t6", x: 77, y: 46 },
  { id: "t7", x: 66, y: 58 },
  { id: "t8", x: 34, y: 58 },
  { id: "t9", x: 23, y: 46 },
  { id: "chief", x: 50, y: 66 },
];

const fallbackFollowUps = {
  中国史: [
    "老师：你提到了经济变化，请补充一个制度层面的例证。",
    "老师：如果从社会结构角度分析，这一变革带来了哪些长期影响？",
  ],
  世界史: [
    "老师：请你比较英国与法国在工业化起步条件上的差异。",
    "老师：工业革命对世界体系形成有哪些关键影响？",
  ],
};

const fallbackSpecialQuestions = {
  明清史: [
    "老师：请你谈谈明中后期“一条鞭法”的历史背景与影响。",
    "老师：如何理解清前中期的“盛世”与社会矛盾并存？",
    "老师：请比较张居正改革与雍正改革在治理思路上的异同。",
  ],
  近代史: [
    "老师：请分析洋务运动“自强”与“求富”路径的局限。",
    "老师：你如何评价清末新政在制度转型中的作用与边界？",
    "老师：从社会结构角度看，辛亥革命后中国政治转型的困难在哪里？",
  ],
};

const speechGlossary = {
  张居正: ["张居正", "章居正", "张居政"],
  一条鞭法: ["一条鞭法", "一条编法", "一条便法", "一条边法"],
  洋务运动: ["洋务运动", "杨务运动", "洋务运洞"],
  雍正改革: ["雍正改革", "雍正改格"],
  辛亥革命: ["辛亥革命", "新海革命", "辛害革命"],
  鸦片战争: ["鸦片战争", "压片战争"],
  工业革命: ["工业革命", "公业革命"],
  明清: ["明清", "名清"],
  晚清: ["晚清", "晚青"],
  民国: ["民国", "明国"],
};

const interviewState = {
  started: false,
  track: "中国史",
  round: 0,
  history: [],
  transcript: [],
  fallbackCursor: 0,
  reportGenerated: false,
  finalReportText: "",
  phase: "intro",
  specialization: "",
  examinerCursor: 0,
  sceneReady: false,
  speakingId: "",
};

const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
let speechActive = false;
let mediaRecorder = null;
let mediaStream = null;
let recordedChunks = [];
let liveDraftRecognition = null;
let liveDraftBaseText = "";
let liveDraftText = "";

function setStatus(text, warn = false) {
  statusLine.textContent = `状态：${text}`;
  statusLine.classList.toggle("warn", warn);
}

function appendMessage(role, text) {
  const msg = document.createElement("div");
  msg.className = `msg ${role}`;
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function buildSeatNode(member, position) {
  const seat = document.createElement("div");
  seat.className = `avatar-seat ${member.cls || ""}`.trim();
  seat.dataset.memberId = member.id;
  seat.style.left = `${position.x}%`;
  seat.style.top = `${position.y}%`;

  const head = document.createElement("div");
  head.className = "avatar-head";
  head.style.background = `linear-gradient(180deg, ${member.hair} 0 38%, ${member.skin} 38% 100%)`;

  const body = document.createElement("div");
  body.className = "avatar-body";
  body.style.background = member.jacket;

  const name = document.createElement("div");
  name.className = "seat-name";
  name.textContent = member.name;

  seat.appendChild(head);
  seat.appendChild(body);
  seat.appendChild(name);
  return seat;
}

function renderSceneSeats() {
  if (!seatLayer || interviewState.sceneReady) return;
  seatLayer.innerHTML = "";

  committeeSeatLayout.forEach((seatPos) => {
    const member = committeeMembers.find((item) => item.id === seatPos.id);
    if (!member) return;
    seatLayer.appendChild(buildSeatNode(member, seatPos));
  });

  seatLayer.appendChild(buildSeatNode(studentMember, { x: 50, y: 87 }));
  interviewState.sceneReady = true;
}

function clearSpeaking() {
  if (!seatLayer) return;
  seatLayer.querySelectorAll(".avatar-seat.speaking").forEach((node) => node.classList.remove("speaking"));
}

function showSceneSpeech(memberId, rawText) {
  if (!seatLayer || !speakerBubble || !sceneStage) return;
  const text = String(rawText || "").replace(/^老师：?/, "").trim();
  const seat = seatLayer.querySelector(`.avatar-seat[data-member-id="${memberId}"]`);
  if (!seat || !text) {
    speakerBubble.classList.add("hidden");
    return;
  }

  clearSpeaking();
  seat.classList.add("speaking");
  interviewState.speakingId = memberId;

  speakerBubble.textContent = text;
  speakerBubble.classList.remove("hidden");

  const rootRect = sceneStage.getBoundingClientRect();
  const seatRect = seat.getBoundingClientRect();
  const bubbleWidth = memberId === "student" ? 240 : 300;
  let left = seatRect.left - rootRect.left - bubbleWidth / 2 + seatRect.width / 2;
  let top = seatRect.top - rootRect.top - 78;
  if (memberId === "student") {
    top = seatRect.top - rootRect.top - 92;
  }
  left = Math.max(10, Math.min(left, rootRect.width - bubbleWidth - 10));
  top = Math.max(20, top);

  speakerBubble.style.width = `${bubbleWidth}px`;
  speakerBubble.style.left = `${left}px`;
  speakerBubble.style.top = `${top}px`;
}

function pickExaminer(mode) {
  if (mode === "intro") {
    return committeeMembers.find((m) => m.id === "chief") || committeeMembers[0];
  }
  const member = committeeMembers[interviewState.examinerCursor % committeeMembers.length];
  interviewState.examinerCursor += 1;
  return member;
}

function formatTeacherLine(member, text) {
  const content = String(text || "").replace(/^老师：?/, "").trim();
  return `${member.name}：${content}`;
}

function getConfig() {
  const baseUrlValue = baseUrlInput.value.trim() || defaultConfig.baseUrl;
  const modelValue = modelInput.value.trim() || defaultConfig.model;
  return {
    baseUrl: baseUrlValue,
    model: modelValue,
    apiKey: apiKeyInput.value.trim(),
  };
}

function saveConfig() {
  const config = getConfig();
  localStorage.setItem(configStorageKey, JSON.stringify(config));
  setStatus("配置已保存", false);
}

function loadConfig() {
  baseUrlInput.value = defaultConfig.baseUrl;
  modelInput.value = defaultConfig.model;
  apiKeyInput.value = defaultConfig.apiKey;

  const raw = localStorage.getItem(configStorageKey);
  if (!raw) return;

  try {
    const config = JSON.parse(raw);
    if (config.baseUrl) baseUrlInput.value = config.baseUrl;
    if (config.model) modelInput.value = config.model;
    if (config.apiKey) apiKeyInput.value = config.apiKey;
  } catch {
    setStatus("配置读取失败，已使用默认值", true);
  }
}

function setInputDisabled(disabled) {
  answerInput.disabled = disabled;
  sendBtn.disabled = disabled;
  if (voiceBtn) {
    voiceBtn.disabled = disabled && !speechActive;
  }
}

function resizeAnswerInput() {
  answerInput.style.height = "auto";
  const nextHeight = Math.min(answerInput.scrollHeight, 180);
  answerInput.style.height = `${Math.max(46, nextHeight)}px`;
}

function setDownloadDisabled(disabled) {
  downloadReportBtn.disabled = disabled;
}

function setVoiceHint(text, warn = false) {
  voiceHint.textContent = `语音：${text}`;
  voiceHint.classList.toggle("warn", warn);
}

function setVoiceButtonLabel() {
  voiceBtn.classList.toggle("listening", speechActive);
  voiceBtn.title = speechActive ? "停止语音输入" : "语音输入";
}

function punctuateSpeechText(rawText, finalize = false) {
  let text = (rawText || "")
    .replace(/\s+/g, "")
    .replace(/,+/g, "，")
    .replace(/\.+/g, "。")
    .replace(/\?+/g, "？")
    .replace(/!+/g, "！");

  text = text
    .replace(/([^\u3002\uff01\uff1f\uff1b\uff0c])(但是|不过|因此|所以|同时|另外|此外|然后|其次|最后)/g, "$1，$2")
    .replace(/，{2,}/g, "，");

  if (finalize && text && !/[。！？]$/.test(text)) {
    if (/(吗|么|呢|如何|为什么|是否|是不是|能否|可否|怎么|何以|何故|哪|什么)$/.test(text)) {
      text += "？";
    } else {
      text += "。";
    }
  }

  return text;
}

function detectSpecialization(answer) {
  if (/明清|晚明|清代|明代/.test(answer)) return "明清史";
  if (/近代|晚清|民国|近现代|辛亥|洋务/.test(answer)) return "近代史";
  return "";
}

function isNoAnswerIntent(answer) {
  return /(不会|不太会|答不上来|没学过|不清楚|不了解|不知道怎么答|这题不会)/.test(answer);
}

function isTeacherPremiseError(answer) {
  return /(老师.*(有误|说错|不对)|史实错误|时间线.*不对|年代.*不对|清初.*没有.*鸦片战争|清初.*不可能.*鸦片战争)/.test(
    answer
  );
}

function buildFocusLabel() {
  return interviewState.specialization || interviewState.track;
}

function syncVoiceHint() {
  if (speechActive) return;
  const { apiKey, baseUrl } = getConfig();
  const canUseServerProxy = !apiKey && baseUrl.startsWith("/api/");
  if (apiKey || canUseServerProxy) {
    setVoiceHint("未开启（点击麦克风开始高精度语音输入）", false);
    return;
  }
  setVoiceHint("未开启（请填写 API Key，或把接口地址改为 /api/chat）", true);
}

function getTranscriptionUrl() {
  const { baseUrl, apiKey } = getConfig();
  if (!apiKey && baseUrl.startsWith("/api/")) {
    return "/api/transcribe";
  }
  if (baseUrl.includes("/chat/completions")) {
    return baseUrl.replace("/chat/completions", "/audio/transcriptions");
  }
  return "https://api.groq.com/openai/v1/audio/transcriptions";
}

async function transcribeByWhisper(audioBlob) {
  const { apiKey } = getConfig();
  const transcriptionUrl = getTranscriptionUrl();

  const form = new FormData();
  form.append("file", audioBlob, "voice.webm");
  form.append("model", "whisper-large-v3-turbo");
  form.append("language", "zh");
  form.append("response_format", "verbose_json");
  form.append("temperature", "0");
  form.append("prompt", buildAsrPrompt());

  const headers = {};
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const response = await fetch(transcriptionUrl, {
    method: "POST",
    headers,
    body: form,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`转写失败(${response.status})：${errText.slice(0, 140)}`);
  }

  const data = await response.json();
  return (data?.text || "").trim();
}

function buildAsrPrompt() {
  const terms = Object.keys(speechGlossary).join("、");
  return `以下是历史学术语，请优先按这些术语转写：${terms}。`;
}

function applyGlossaryCorrections(inputText) {
  let text = inputText || "";
  Object.entries(speechGlossary).forEach(([standard, aliases]) => {
    aliases.forEach((alias) => {
      if (alias === standard) return;
      text = text.replaceAll(alias, standard);
    });
  });
  return text;
}

function stopLiveDraftAssist() {
  if (!liveDraftRecognition) return;
  try {
    liveDraftRecognition.stop();
  } catch {
    // Ignore repeated stop calls from browser engines.
  }
}

function startLiveDraftAssist() {
  if (!SpeechRecognitionCtor) return false;
  liveDraftText = "";

  liveDraftRecognition = new SpeechRecognitionCtor();
  liveDraftRecognition.lang = "zh-CN";
  liveDraftRecognition.continuous = true;
  liveDraftRecognition.interimResults = true;

  liveDraftRecognition.onresult = (event) => {
    let finalText = "";
    let interimText = "";
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalText += transcript;
      } else {
        interimText += transcript;
      }
    }

    liveDraftText = punctuateSpeechText(`${liveDraftText}${finalText}`, false);
    const preview = punctuateSpeechText(`${liveDraftText}${interimText}`, false);
    answerInput.value = `${liveDraftBaseText} ${preview}`.trim();
    resizeAnswerInput();
  };

  liveDraftRecognition.onerror = () => {
    liveDraftRecognition = null;
  };

  liveDraftRecognition.onend = () => {
    liveDraftRecognition = null;
  };

  try {
    liveDraftRecognition.start();
    return true;
  } catch {
    liveDraftRecognition = null;
    return false;
  }
}

async function startWhisperRecording() {
  const { apiKey, baseUrl } = getConfig();
  const canUseServerProxy = !apiKey && baseUrl.startsWith("/api/");
  if (!apiKey && !canUseServerProxy) {
    throw new Error("请填写 API Key，或把接口地址设置为 /api/chat");
  }

  mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  recordedChunks = [];
  liveDraftBaseText = answerInput.value.trim();
  liveDraftText = "";
  mediaRecorder = new MediaRecorder(mediaStream);

  mediaRecorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.onstart = () => {
    speechActive = true;
    setVoiceButtonLabel();
    const liveEnabled = startLiveDraftAssist();
    setVoiceHint(liveEnabled ? "录音中（实时草稿）..." : "录音中...", false);
  };

  mediaRecorder.onerror = () => {
    speechActive = false;
    setVoiceButtonLabel();
    setVoiceHint("录音失败，请重试", true);
  };

  mediaRecorder.onstop = async () => {
    try {
      stopLiveDraftAssist();
      const blob = new Blob(recordedChunks, { type: "audio/webm" });
      setVoiceHint("正在高精度转写...", false);
      const text = await transcribeByWhisper(blob);
      if (text) {
        const corrected = applyGlossaryCorrections(text);
        const merged = `${liveDraftBaseText} ${corrected}`.trim();
        answerInput.value = punctuateSpeechText(merged, true);
      } else if (answerInput.value.trim()) {
        answerInput.value = punctuateSpeechText(answerInput.value, true);
      }
      resizeAnswerInput();
      syncVoiceHint();
    } catch (error) {
      setVoiceHint(error.message, true);
    } finally {
      speechActive = false;
      setVoiceButtonLabel();
      stopLiveDraftAssist();
      if (mediaStream) {
        mediaStream.getTracks().forEach((t) => t.stop());
      }
      mediaStream = null;
      mediaRecorder = null;
      recordedChunks = [];
      liveDraftBaseText = "";
      liveDraftText = "";
    }
  };

  mediaRecorder.start();
}

function stopCurrentVoiceInput() {
  if (!speechActive) return;
  if (mediaRecorder) {
    mediaRecorder.stop();
  }
}

function toggleVoiceInput() {
  if (speechActive) {
    stopCurrentVoiceInput();
    return;
  }

  startWhisperRecording().catch((error) => {
    speechActive = false;
    setVoiceButtonLabel();
    setVoiceHint(error.message || "无法开启高精度识别", true);
  });
}

function onAnswerInputKeydown(event) {
  if (event.isComposing) return;
  if (event.key !== "Enter") return;
  if (event.shiftKey) return;
  event.preventDefault();
  answerForm.requestSubmit();
}

function nextFallbackFollowUp(track) {
  const focus = interviewState.specialization || track;
  const list = fallbackSpecialQuestions[focus] || fallbackFollowUps[track] || fallbackFollowUps["中国史"];
  const item = list[interviewState.fallbackCursor % list.length];
  interviewState.fallbackCursor += 1;
  return item;
}

function makeFallbackFollowUp() {
  return {
    follow_up: nextFallbackFollowUp(interviewState.track),
  };
}

function makeFallbackFirstQuestion() {
  const focus = buildFocusLabel();
  if (fallbackSpecialQuestions[focus]) {
    return { follow_up: nextFallbackFollowUp(interviewState.track) };
  }
  return { follow_up: nextFallbackFollowUp(interviewState.track) };
}

function makeFallbackSwitchQuestion() {
  return {
    follow_up: `老师：这道题先略过。我们换一道${buildFocusLabel()}相关问题：${nextFallbackFollowUp(interviewState.track).replace(/^老师：?/, "")}`,
  };
}

function makeFallbackFixAndSwitchQuestion() {
  return {
    follow_up: `老师：你提醒得对，刚才那道题的史实前提不准确。我们换一道${buildFocusLabel()}相关问题：${nextFallbackFollowUp(interviewState.track).replace(/^老师：?/, "")}`,
  };
}

function makeFallbackReport() {
  const answerCount = interviewState.transcript.filter((i) => i.role === "student").length;
  const score = Math.max(4, Math.min(9, 5 + Math.floor(answerCount / 2)));
  const report = [
    "面试总结（降级模式）",
    `方向：${interviewState.track}`,
    `作答轮次：${answerCount}`,
    `总评建议分：${score}/10`,
    "优点：具备基础作答框架，能够围绕问题组织观点。",
    "不足：史实细节和时间线不够扎实，论证链条可进一步加强。",
    "改进建议：每题用“结论-依据-影响”三段式回答，并补充至少1个具体史实。",
  ];
  return report.join("\n");
}

async function askTeacherByAPI({ mode, userAnswer = "" }) {
  const { baseUrl, model, apiKey } = getConfig();
  const useServerProxy = !apiKey && baseUrl.startsWith("/api/");

  if (!apiKey && !useServerProxy) {
    if (mode === "first_topic_question") return makeFallbackFirstQuestion();
    if (mode === "switch_question") return makeFallbackSwitchQuestion();
    if (mode === "fix_and_switch_question") return makeFallbackFixAndSwitchQuestion();
    return makeFallbackFollowUp();
  }

  const messages = [
    {
      role: "system",
      content:
        [
          "你是历史学考研复试老师，风格严谨、简洁、口语化。",
          "规则1：整场第一问固定是“请介绍你自己”。",
          "规则2：如果考生自述报考方向为明清史或近代史，后续围绕该方向展开提问。",
          "规则3：如果考生明确表示“这题不会/答不上来”，不要追问不会原因，直接换一道同方向新题。",
          "规则4：如果考生指出你的题目存在史实错误或时间线错误，先一句话承认并更正，再换一道同方向新题。",
          "规则5：明清史提问必须严格校验时间线，不要把鸦片战争(1840-)放在清初。",
          "规则6：不要评分，只提问。",
        ].join(" "),
    },
    {
      role: "system",
      content: `当前大方向：${interviewState.track}。当前聚焦方向：${buildFocusLabel()}。`,
    },
  ];

  if (mode === "first_topic_question") {
    messages.push({
      role: "user",
      content: [
        `考生刚做完自我介绍：${userAnswer}`,
        "请给出第一道专业题，默认与其自述方向一致；若未明确方向，则按当前大方向出题。",
        '严格只输出JSON：{"follow_up":"..."}',
      ].join("\n"),
    });
  } else if (mode === "switch_question") {
    messages.push({
      role: "user",
      content: [
        `考生回答：${userAnswer}`,
        "考生表示这道题不会，请直接换一道同方向新题，不要追问不会的原因。",
        '严格只输出JSON：{"follow_up":"..."}',
      ].join("\n"),
    });
  } else if (mode === "fix_and_switch_question") {
    messages.push({
      role: "user",
      content: [
        `考生反馈：${userAnswer}`,
        "考生指出你的题目前提有误，请先一句话承认并更正，再换一道同方向新题。",
        '严格只输出JSON：{"follow_up":"..."}',
      ].join("\n"),
    });
  } else {
    messages.push({
      role: "user",
      content: [
        `考生回答：${userAnswer}`,
        "请基于该回答继续追问。",
        '严格只输出JSON，格式：{"follow_up":"..."}',
      ].join("\n"),
    });
  }

  const headers = {
    "Content-Type": "application/json",
  };
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const response = await fetch(baseUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API请求失败(${response.status})：${errText.slice(0, 200)}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("API返回为空");
  }

  const jsonText = extractJSON(content);
  return JSON.parse(jsonText);
}

async function generateReportByAPI() {
  const { baseUrl, model, apiKey } = getConfig();
  const useServerProxy = !apiKey && baseUrl.startsWith("/api/");
  if (!apiKey && !useServerProxy) {
    return makeFallbackReport();
  }

  const transcript = interviewState.transcript
    .map((item, idx) => `${idx + 1}. ${item.role === "teacher" ? "老师" : "考生"}：${item.content}`)
    .join("\n");

  const messages = [
    {
      role: "system",
      content:
        "你是历史学考研复试评委。请根据完整对话给出整场复试报告，内容客观、可执行。",
    },
    {
      role: "user",
      content: [
        `方向：${interviewState.track}`,
        "请输出简洁报告，包含以下5部分：",
        "1) 总体评价（2-3句）",
        "2) 总评建议分（满分10分）",
        "3) 优势（3条）",
        "4) 主要问题（3条）",
        "5) 7天提升建议（3条）",
        "以下是完整面试记录：",
        transcript,
      ].join("\n"),
    },
  ];

  const headers = {
    "Content-Type": "application/json",
  };
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const response = await fetch(baseUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`报告生成失败(${response.status})：${errText.slice(0, 200)}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("报告返回为空");
  }
  return content;
}

function extractJSON(text) {
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first === -1 || last === -1 || last < first) {
    throw new Error("返回内容不是JSON");
  }
  return text.slice(first, last + 1);
}

function makeReportFileName(ext) {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const dateText = [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    "-",
    pad(now.getHours()),
    pad(now.getMinutes()),
  ].join("");
  return `历史学复试报告-${dateText}.${ext}`;
}

function downloadReportAsText(reportText) {
  const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = makeReportFileName("txt");
  link.click();
  URL.revokeObjectURL(link.href);
}

async function downloadReportAsPDF(reportText) {
  const jsPDFCtor = window.jspdf?.jsPDF;
  if (!jsPDFCtor) {
    throw new Error("jsPDF库未加载");
  }

  const mount = document.createElement("div");
  mount.style.position = "fixed";
  mount.style.left = "-100000px";
  mount.style.top = "0";
  mount.style.width = "820px";
  mount.style.zIndex = "-1";

  const wrapper = document.createElement("div");
  wrapper.style.padding = "28px 32px";
  wrapper.style.fontFamily = "\"Noto Serif SC\", \"Source Han Serif SC\", \"Songti SC\", serif";
  wrapper.style.fontSize = "14px";
  wrapper.style.lineHeight = "1.8";
  wrapper.style.color = "#1a1a1a";
  wrapper.style.background = "#ffffff";
  wrapper.style.width = "794px";
  wrapper.style.boxSizing = "border-box";
  wrapper.style.overflow = "visible";

  const title = document.createElement("h1");
  title.textContent = "历史学考研复试报告";
  title.style.margin = "0 0 12px 0";
  title.style.fontSize = "24px";

  const meta = document.createElement("p");
  meta.textContent = `生成时间：${new Date().toLocaleString("zh-CN", { hour12: false })} ｜ 方向：${interviewState.track}`;
  meta.style.margin = "0 0 16px 0";
  meta.style.color = "#6b7280";

  const body = document.createElement("div");
  body.style.margin = "0";
  body.style.padding = "0";

  reportText.split("\n").forEach((line) => {
    const p = document.createElement("p");
    p.style.margin = "0 0 10px 0";
    p.style.wordBreak = "break-word";
    p.textContent = line || " ";
    body.appendChild(p);
  });

  wrapper.appendChild(title);
  wrapper.appendChild(meta);
  wrapper.appendChild(body);
  mount.appendChild(wrapper);
  document.body.appendChild(mount);

  try {
    const pdf = new jsPDFCtor({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    await pdf.html(wrapper, {
      x: 10,
      y: 10,
      width: 190,
      windowWidth: 794,
      autoPaging: "text",
      html2canvas: {
        scale: 1.6,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: 794,
      },
    });

    pdf.save(makeReportFileName("pdf"));
  } finally {
    mount.remove();
  }
}

async function startInterview() {
  renderSceneSeats();
  interviewState.started = true;
  interviewState.track = trackSelect.value;
  interviewState.round = 0;
  interviewState.history = [];
  interviewState.transcript = [];
  interviewState.fallbackCursor = 0;
  interviewState.reportGenerated = false;
  interviewState.finalReportText = "";
  interviewState.phase = "intro";
  interviewState.specialization = "";
  interviewState.examinerCursor = 1;
  interviewState.speakingId = "";

  interviewPanel.classList.remove("hidden");
  chatBox.innerHTML = "";
  clearSpeaking();
  speakerBubble.classList.add("hidden");
  speakerBubble.textContent = "";
  startBtn.disabled = true;
  finishBtn.disabled = false;
  setDownloadDisabled(true);
  setInputDisabled(true);
  setStatus("面试进行中（场景已就位，请先自我介绍）", false);
  const chief = pickExaminer("intro");
  const introQuestion = "请介绍你自己。";
  showSceneSpeech(chief.id, introQuestion);
  appendMessage("teacher", formatTeacherLine(chief, introQuestion));
  interviewState.history.push({ role: "teacher", content: introQuestion });
  interviewState.transcript.push({ role: "teacher", content: introQuestion });
  setInputDisabled(false);
  answerInput.focus();
}

function resetInterview() {
  if (speechActive) {
    stopCurrentVoiceInput();
  }
  interviewState.started = false;
  interviewState.round = 0;
  interviewState.history = [];
  interviewState.transcript = [];
  interviewState.fallbackCursor = 0;
  interviewState.reportGenerated = false;
  interviewState.finalReportText = "";
  interviewState.phase = "intro";
  interviewState.specialization = "";
  interviewState.examinerCursor = 0;
  interviewState.speakingId = "";
  startBtn.disabled = false;
  finishBtn.disabled = false;
  setDownloadDisabled(true);
  interviewPanel.classList.add("hidden");
  chatBox.innerHTML = "";
  clearSpeaking();
  if (speakerBubble) {
    speakerBubble.classList.add("hidden");
    speakerBubble.textContent = "";
  }
  answerInput.value = "";
  resizeAnswerInput();
  setInputDisabled(false);
  setStatus("未开始", false);
  syncVoiceHint();
}

async function onAnswerSubmit(event) {
  event.preventDefault();
  if (!interviewState.started) return;
  if (speechActive) {
    stopCurrentVoiceInput();
    await new Promise((resolve) => setTimeout(resolve, 180));
  }
  answerInput.value = punctuateSpeechText(answerInput.value, true);
  resizeAnswerInput();

  const answer = answerInput.value.trim();
  if (!answer) return;

  showSceneSpeech("student", answer);
  appendMessage("student", `考生：${answer}`);
  interviewState.transcript.push({ role: "student", content: answer });
  answerInput.value = "";
  resizeAnswerInput();
  setInputDisabled(true);
  setStatus("老师思考中...", false);

  try {
    let mode = "follow_up";
    if (interviewState.phase === "intro") {
      const detected = detectSpecialization(answer);
      if (detected) interviewState.specialization = detected;
      mode = "first_topic_question";
    } else if (isTeacherPremiseError(answer)) {
      mode = "fix_and_switch_question";
    } else if (isNoAnswerIntent(answer)) {
      mode = "switch_question";
    }

    const result = await askTeacherByAPI({ mode, userAnswer: answer });
    const followUp = String(result.follow_up || "请你补充一个更具体的史实依据。").replace(/^老师：?/, "").trim();
    const examiner = pickExaminer(interviewState.phase === "intro" ? "first_question" : "follow_up");
    showSceneSpeech(examiner.id, followUp);
    appendMessage("teacher", formatTeacherLine(examiner, followUp));

    interviewState.round += 1;
    interviewState.history.push({ role: "student", content: answer });
    interviewState.history.push({ role: "teacher", content: followUp });
    interviewState.transcript.push({ role: "teacher", content: followUp });
    if (interviewState.phase === "intro") {
      interviewState.phase = "qa";
    }
    setStatus(`面试进行中（${buildFocusLabel()}，第 ${interviewState.round} 轮）`, false);
  } catch (error) {
    const fallbackMode =
      interviewState.phase === "intro"
        ? makeFallbackFirstQuestion()
        : isTeacherPremiseError(answer)
          ? makeFallbackFixAndSwitchQuestion()
        : isNoAnswerIntent(answer)
          ? makeFallbackSwitchQuestion()
          : makeFallbackFollowUp();
    const fallbackResult = fallbackMode;
    const fallbackText = String(fallbackResult.follow_up || "我们继续下一题。").replace(/^老师：?/, "").trim();
    const examiner = pickExaminer(interviewState.phase === "intro" ? "first_question" : "follow_up");
    showSceneSpeech(examiner.id, fallbackText);
    appendMessage("teacher", formatTeacherLine(examiner, fallbackText));
    interviewState.transcript.push({ role: "teacher", content: fallbackText });
    if (interviewState.phase === "intro") {
      const detected = detectSpecialization(answer);
      if (detected) interviewState.specialization = detected;
      interviewState.phase = "qa";
    }
    setStatus(`AI接口异常，已降级：${error.message}`, true);
  } finally {
    setInputDisabled(false);
    answerInput.focus();
  }
}

async function finishInterview() {
  if (!interviewState.started) return;
  if (interviewState.reportGenerated) return;

  setInputDisabled(true);
  finishBtn.disabled = true;
  setStatus("正在生成整场复试报告...", false);

  try {
    const report = await generateReportByAPI();
    appendMessage("score", `整场复试报告\n${report}`);
    interviewState.reportGenerated = true;
    interviewState.finalReportText = report;
    setDownloadDisabled(false);
    setStatus("复试已结束，报告已生成", false);
  } catch (error) {
    const fallbackReport = `${makeFallbackReport()}\n\n提示：AI报告生成失败，已使用降级报告。\n原因：${error.message}`;
    appendMessage("score", `整场复试报告\n${fallbackReport}`);
    interviewState.reportGenerated = true;
    interviewState.finalReportText = fallbackReport;
    setDownloadDisabled(false);
    setStatus("复试已结束（降级报告）", true);
  } finally {
    answerInput.disabled = true;
    sendBtn.disabled = true;
  }
}

async function downloadReport() {
  if (!interviewState.reportGenerated || !interviewState.finalReportText) {
    setStatus("请先结束复试并生成报告", true);
    return;
  }

  setStatus("正在下载PDF报告...", false);
  try {
    await downloadReportAsPDF(interviewState.finalReportText);
    setStatus("PDF报告下载完成", false);
  } catch (error) {
    downloadReportAsText(interviewState.finalReportText);
    setStatus(`PDF下载失败，已降级为TXT：${error.message}`, true);
  }
}

saveConfigBtn.addEventListener("click", saveConfig);
startBtn.addEventListener("click", startInterview);
resetBtn.addEventListener("click", resetInterview);
finishBtn.addEventListener("click", finishInterview);
downloadReportBtn.addEventListener("click", downloadReport);
voiceBtn.addEventListener("click", toggleVoiceInput);
answerForm.addEventListener("submit", onAnswerSubmit);
answerInput.addEventListener("input", resizeAnswerInput);
answerInput.addEventListener("keydown", onAnswerInputKeydown);

loadConfig();
setVoiceButtonLabel();
setStatus("未开始", false);
resizeAnswerInput();
syncVoiceHint();
apiKeyInput.addEventListener("input", syncVoiceHint);
baseUrlInput.addEventListener("input", syncVoiceHint);
