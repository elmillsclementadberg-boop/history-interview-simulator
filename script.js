const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const finishBtn = document.getElementById("finishBtn");
const downloadReportBtn = document.getElementById("downloadReportBtn");
const voiceBtn = document.getElementById("voiceBtn");
const saveConfigBtn = document.getElementById("saveConfigBtn");
const sendBtn = document.getElementById("sendBtn");
const interviewPanel = document.getElementById("interviewPanel");
const chatBox = document.getElementById("chatBox");
const committeeGrid = document.getElementById("committeeGrid");
const currentQuestion = document.getElementById("currentQuestion");
const speechBubble = currentQuestion ? currentQuestion.closest(".speech-bubble") : null;
const committeeSection = document.querySelector(".committee-section");
const candidateZone = document.querySelector(".candidate-zone");
const roundTable = document.querySelector(".round-table");
const countdownClock = document.getElementById("countdownClock");
const historyAccordion = document.getElementById("historyAccordion");
const answerForm = document.getElementById("answerForm");
const answerInput = document.getElementById("answerInput");
const statusLine = document.getElementById("statusLine");
const voiceHint = document.getElementById("voiceHint");
const examNoticeModal = document.getElementById("examNoticeModal");
const noticeCancelBtn = document.getElementById("noticeCancelBtn");
const noticeAgreeBtn = document.getElementById("noticeAgreeBtn");

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

const committeeDisplayRoles = [
  { id: "t1", title: "考官" },
  { id: "t2", title: "考官" },
  { id: "t3", title: "考官" },
  { id: "chief", title: "主考官" },
  { id: "t4", title: "考官" },
  { id: "t5", title: "考官" },
  { id: "t6", title: "考官" },
  { id: "t7", title: "考官" },
  { id: "t8", title: "考官" },
];

const examinerRotationIds = ["chief", "t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8"];

const fallbackFollowUps = {
  历史学: [
    "老师：请你说明史料、史观与史法三者在历史研究中的关系。",
    "老师：请结合一个案例，谈谈如何在历史解释中平衡结构因素与个人作用。",
  ],
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
  track: "历史学",
  round: 0,
  history: [],
  transcript: [],
  fallbackCursor: 0,
  reportGenerated: false,
  finalReportText: "",
  phase: "intro",
  specialization: "",
  examinerCursor: 0,
  activeRoleId: "chief",
};

const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
let speechActive = false;
let mediaRecorder = null;
let mediaStream = null;
let recordedChunks = [];
let liveDraftRecognition = null;
let liveDraftBaseText = "";
let liveDraftText = "";
let noticeModalCloseTimer = null;
let countdownSeconds = 15 * 60;
let countdownTicker = null;

function setStatus(text, warn = false) {
  statusLine.textContent = `状态：${text}`;
  statusLine.classList.toggle("warn", warn);
}

function openExamNoticeModal() {
  if (!examNoticeModal) {
    startInterview();
    return;
  }

  window.clearTimeout(noticeModalCloseTimer);
  examNoticeModal.classList.remove("hidden");
  examNoticeModal.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => {
    examNoticeModal.classList.add("is-open");
    if (noticeAgreeBtn) {
      noticeAgreeBtn.focus();
    }
  });
  document.body.classList.add("modal-open");
}

function closeExamNoticeModal(options = {}) {
  if (!examNoticeModal) return;

  const { restoreFocus = true } = options;
  window.clearTimeout(noticeModalCloseTimer);
  examNoticeModal.classList.remove("is-open");
  examNoticeModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  noticeModalCloseTimer = window.setTimeout(() => {
    examNoticeModal.classList.add("hidden");
    if (restoreFocus && startBtn && !interviewState.started) {
      startBtn.focus();
    }
  }, 280);
}

function onStartButtonClick() {
  if (interviewState.started) return;
  openExamNoticeModal();
}

function onNoticeCancel() {
  closeExamNoticeModal();
}

function onNoticeAgree() {
  if (interviewState.started) return;
  closeExamNoticeModal({ restoreFocus: false });
  startInterview();
}

function onNoticeOverlayClick(event) {
  if (!examNoticeModal) return;
  if (event.target !== examNoticeModal) return;
  closeExamNoticeModal();
}

function onDocumentEscape(event) {
  if (event.key !== "Escape") return;
  if (!examNoticeModal || examNoticeModal.classList.contains("hidden")) return;
  closeExamNoticeModal();
}

function appendMessage(role, text) {
  const msg = document.createElement("div");
  msg.className = `msg ${role}`;
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function buildCommitteeCard(role, index) {
  const member = committeeMembers.find((item) => item.id === role.id);
  const node = document.createElement("div");
  node.className = `committee-card slot-${index + 1}`;
  node.dataset.roleId = role.id;

  const head = document.createElement("div");
  head.className = "avatar-head";
  head.style.background = `linear-gradient(180deg, ${
    member?.hair || "#3a2f2a"
  } 0 38%, ${member?.skin || "#edc3a1"} 38% 100%)`;

  const body = document.createElement("div");
  body.className = "avatar-body";
  body.style.background = member?.jacket || "#6a5d52";

  const roleLabel = document.createElement("span");
  roleLabel.className = "role-label";
  roleLabel.textContent = member?.name || role.title;

  node.appendChild(head);
  node.appendChild(body);
  node.appendChild(roleLabel);
  return node;
}

function renderCommitteeGrid() {
  if (!committeeGrid) return;
  committeeGrid.innerHTML = "";
  committeeDisplayRoles.forEach((role, index) => {
    committeeGrid.appendChild(buildCommitteeCard(role, index));
  });
  setActiveRole(interviewState.activeRoleId);
  requestAnimationFrame(() => {
    positionSpeechBubble(interviewState.activeRoleId);
  });
}

function clearSpeaking() {
  if (!committeeGrid) return;
  committeeGrid.querySelectorAll(".committee-card").forEach((node) => {
    node.classList.remove("is-active");
    node.classList.remove("is-muted");
  });
}

function setActiveRole(roleId) {
  if (!committeeGrid) return;
  const cards = Array.from(committeeGrid.querySelectorAll(".committee-card"));
  if (!cards.length) return;

  let found = false;
  cards.forEach((card) => {
    const isActive = card.dataset.roleId === roleId;
    if (isActive) {
      found = true;
      card.classList.add("is-active");
      card.classList.remove("is-muted");
    } else {
      card.classList.remove("is-active");
      card.classList.add("is-muted");
    }
  });

  if (!found) {
    clearSpeaking();
  }
  interviewState.activeRoleId = found ? roleId : "";
}

function setCurrentQuestion(text) {
  if (!currentQuestion) return;
  currentQuestion.textContent = String(text || "").trim() || "请等待考官提问。";
  requestAnimationFrame(() => {
    positionSpeechBubble(interviewState.activeRoleId);
  });
}

function rectIntersects(a, b, padding = 0) {
  return !(
    a.right + padding <= b.left ||
    a.left - padding >= b.right ||
    a.bottom + padding <= b.top ||
    a.top - padding >= b.bottom
  );
}

function overlapArea(a, b, padding = 0) {
  const left = Math.max(a.left - padding, b.left);
  const right = Math.min(a.right + padding, b.right);
  const top = Math.max(a.top - padding, b.top);
  const bottom = Math.min(a.bottom + padding, b.bottom);
  if (right <= left || bottom <= top) return 0;
  return (right - left) * (bottom - top);
}

function positionSpeechBubble(activeRoleId = interviewState.activeRoleId) {
  if (!speechBubble || !committeeSection || !committeeGrid) return;
  if (getComputedStyle(speechBubble).position !== "absolute") {
    speechBubble.style.left = "";
    speechBubble.style.top = "";
    return;
  }

  const sectionRect = committeeSection.getBoundingClientRect();
  const cards = Array.from(committeeGrid.querySelectorAll(".committee-card"));
  if (!cards.length) return;

  const bubbleWidth = speechBubble.offsetWidth;
  const bubbleHeight = speechBubble.offsetHeight;
  if (!bubbleWidth || !bubbleHeight) return;

  const minCenter = bubbleWidth / 2 + 16;
  const maxCenter = sectionRect.width - bubbleWidth / 2 - 16;
  const defaultCenterX = sectionRect.width / 2;
  let activeCenterX = defaultCenterX;
  let activeCenterY = 120;

  const activeCard = activeRoleId
    ? committeeGrid.querySelector(`.committee-card[data-role-id="${activeRoleId}"]`)
    : null;
  if (activeCard) {
    const activeRect = activeCard.getBoundingClientRect();
    activeCenterX = activeRect.left - sectionRect.left + activeRect.width / 2;
    activeCenterY = activeRect.top - sectionRect.top + activeRect.height / 2;
  }
  activeCenterX = Math.max(minCenter, Math.min(maxCenter, activeCenterX));

  const tableRect = roundTable ? roundTable.getBoundingClientRect() : null;
  const tableBottom = tableRect ? tableRect.bottom - sectionRect.top : 320;
  const preferredTop = tableBottom + 10;
  let minTop = Math.max(176, preferredTop);
  let maxTop = sectionRect.height - bubbleHeight - 14;
  const candidateRect = candidateZone ? candidateZone.getBoundingClientRect() : null;
  if (candidateRect) {
    const candidateTop = candidateRect.top - sectionRect.top;
    maxTop = Math.min(maxTop, candidateTop - bubbleHeight - 20);
  }
  if (maxTop < minTop) {
    minTop = Math.max(140, maxTop - 16);
  }

  // Keep bubble horizontally aligned with the speaking examiner first.
  const primaryX = Math.max(minCenter, Math.min(maxCenter, activeCenterX));
  const xCandidatesRaw = [
    primaryX,
    primaryX - 24,
    primaryX + 24,
    primaryX - 48,
    primaryX + 48,
    defaultCenterX,
  ];
  const xCandidates = Array.from(
    new Set(xCandidatesRaw.map((x) => Math.round(Math.max(minCenter, Math.min(maxCenter, x)))))
  );

  const yCandidates = [];
  // Prefer placing bubble lower first (closer to candidate side) to avoid upper examiner labels.
  for (let y = maxTop; y >= minTop; y -= 8) {
    yCandidates.push(y);
  }
  if (!yCandidates.length) {
    yCandidates.push(Math.max(140, Math.min(sectionRect.height - bubbleHeight - 8, preferredTop)));
  }

  const cardRects = cards.map((card) => {
    const rect = card.getBoundingClientRect();
    return {
      left: rect.left - sectionRect.left,
      right: rect.right - sectionRect.left,
      top: rect.top - sectionRect.top,
      bottom: rect.bottom - sectionRect.top,
    };
  });
  if (candidateRect) {
    cardRects.push({
      left: candidateRect.left - sectionRect.left,
      right: candidateRect.right - sectionRect.left,
      top: candidateRect.top - sectionRect.top,
      bottom: candidateRect.bottom - sectionRect.top,
      isCandidate: true,
    });
  }

  const getBubbleRect = (centerX, top) => ({
    left: centerX - bubbleWidth / 2,
    right: centerX + bubbleWidth / 2,
    top,
    bottom: top + bubbleHeight,
  });

  let best = null;
  for (const y of yCandidates) {
    for (const x of xCandidates) {
      const bubbleRect = getBubbleRect(x, y);
      let overlapScore = 0;
      for (const rect of cardRects) {
        const area = overlapArea(bubbleRect, rect, rect.isCandidate ? 8 : 3);
        if (!area) continue;
        overlapScore += rect.isCandidate ? area * 10 : area;
      }
      const distanceScore = Math.abs(x - activeCenterX) * 1.2 + Math.abs(y - preferredTop) * 0.2;
      const totalScore = overlapScore * 1000 + distanceScore;
      if (!best || totalScore < best.score) {
        best = { x, y, score: totalScore, overlapScore };
      }
      if (overlapScore === 0 && Math.abs(x - activeCenterX) <= 24) {
        best = { x, y, score: totalScore, overlapScore: 0 };
        break;
      }
    }
    if (best && best.overlapScore === 0) break;
  }

  const finalX = best ? best.x : defaultCenterX;
  const finalY = best ? best.y : preferredTop;
  speechBubble.style.left = `${finalX}px`;
  speechBubble.style.top = `${finalY}px`;

  const bubbleLeft = finalX - bubbleWidth / 2;
  const bubbleTop = finalY;
  const bubbleCenterX = finalX;
  const bubbleCenterY = bubbleTop + bubbleHeight / 2;
  const dx = activeCenterX - bubbleCenterX;
  const dy = activeCenterY - bubbleCenterY;

  let tailDir = "top";
  if (Math.abs(dx) > 72) {
    tailDir = dx < 0 ? "left" : "right";
  } else if (Math.abs(dy) >= Math.abs(dx)) {
    tailDir = dy < 0 ? "top" : "bottom";
  } else {
    tailDir = dx < 0 ? "left" : "right";
  }

  if (tailDir === "top" || tailDir === "bottom") {
    const tailLeftPx = Math.max(18, Math.min(bubbleWidth - 18, activeCenterX - bubbleLeft));
    speechBubble.style.setProperty("--tail-left", `${tailLeftPx}px`);
  } else {
    const tailTopPx = Math.max(18, Math.min(bubbleHeight - 18, activeCenterY - bubbleTop));
    speechBubble.style.setProperty("--tail-top", `${tailTopPx}px`);
  }
  speechBubble.dataset.tailDir = tailDir;
}

function showSceneSpeech(memberId, rawText) {
  const text = String(rawText || "").replace(/^老师：?/, "").trim();
  if (!text) return;
  setActiveRole(memberId);
  setCurrentQuestion(text);
}

function formatCountdown(seconds) {
  const safe = Math.max(0, seconds);
  const minutes = String(Math.floor(safe / 60)).padStart(2, "0");
  const secs = String(safe % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
}

function renderCountdown() {
  if (!countdownClock) return;
  countdownClock.textContent = formatCountdown(countdownSeconds);
  countdownClock.classList.toggle("is-warning", countdownSeconds > 0 && countdownSeconds <= 120);
  countdownClock.classList.toggle("is-timeout", countdownSeconds <= 0);
}

function stopCountdown() {
  if (!countdownTicker) return;
  window.clearInterval(countdownTicker);
  countdownTicker = null;
}

function resetCountdown() {
  countdownSeconds = 15 * 60;
  renderCountdown();
}

function startCountdown() {
  stopCountdown();
  resetCountdown();
  countdownTicker = window.setInterval(() => {
    if (!interviewState.started) return;
    countdownSeconds = Math.max(0, countdownSeconds - 1);
    renderCountdown();
    if (countdownSeconds === 0) {
      stopCountdown();
      setStatus("倒计时结束，请尽快结束复试并提交。", true);
    }
  }, 1000);
}

function pickExaminer(mode) {
  if (mode === "intro") {
    return committeeMembers.find((m) => m.id === "chief") || committeeMembers[0];
  }
  const nextId = examinerRotationIds[interviewState.examinerCursor % examinerRotationIds.length];
  const member = committeeMembers.find((m) => m.id === nextId) || committeeMembers[0];
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

function getStudentAnswers() {
  return interviewState.transcript
    .filter((item) => item.role === "student")
    .map((item) => String(item.content || "").trim())
    .filter(Boolean);
}

function analyzeParticipation() {
  const answers = getStudentAnswers();
  const answerCount = answers.length;
  const noAnswerCount = answers.filter((text) => isNoAnswerIntent(text)).length;
  const meaningfulCount = answers.filter((text) => text.length >= 18 && !isNoAnswerIntent(text)).length;
  return { answers, answerCount, noAnswerCount, meaningfulCount };
}

function makeLowParticipationReport() {
  const { answerCount, noAnswerCount, meaningfulCount } = analyzeParticipation();
  if (answerCount === 0) {
    return [
      "总体评价：考生未进行有效作答，无法展示基础知识与表达能力。",
      "总评建议分（满分10分）：1/10",
      "优势：",
      "1) 已进入模拟流程。",
      "2) 面试礼仪流程有初步了解。",
      "3) 具备继续训练空间。",
      "主要问题：",
      "1) 未进行任何有效作答。",
      "2) 无法评估史实掌握程度。",
      "3) 无法评估论证与表达能力。",
      "7天提升建议：",
      "1) 每天完成至少5道基础题的口头作答。",
      "2) 每题按“结论-史实-影响”三段式回答。",
      "3) 每晚复盘并纠正1个高频知识盲点。",
    ].join("\n");
  }

  if (noAnswerCount === answerCount || (meaningfulCount === 0 && answerCount <= 2)) {
    return [
      "总体评价：考生有效作答极少，面试表现未达到基本答题要求。",
      "总评建议分（满分10分）：2/10",
      "优势：",
      "1) 能进入并完成部分流程。",
      "2) 具有继续练习意愿。",
      "3) 可在短期训练内快速改善。",
      "主要问题：",
      "1) 多次出现“不会/答不上来”。",
      "2) 缺少可评分的史实论证内容。",
      "3) 作答连续性不足。",
      "7天提升建议：",
      "1) 先打牢中国史与世界史基础框架。",
      "2) 先背熟30个高频考点的标准答案框架。",
      "3) 每天至少进行15分钟限时口述练习。",
    ].join("\n");
  }

  return "";
}

function makeFallbackReport() {
  const lowParticipation = makeLowParticipationReport();
  if (lowParticipation) return lowParticipation;

  const answerCount = getStudentAnswers().length;
  const score = Math.max(3, Math.min(8, 4 + Math.floor(answerCount / 2)));
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
        [
          "你是历史学考研复试评委。请根据完整对话给出整场复试报告，内容客观、可执行。",
          "若考生几乎未作答，或多次明确表示不会/答不上来，总评建议分必须为1-3分，不得高评。",
        ].join(" "),
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

function scrollToInterviewPanel() {
  if (!interviewPanel || interviewPanel.classList.contains("hidden")) return;
  requestAnimationFrame(() => {
    interviewPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

async function startInterview() {
  renderCommitteeGrid();
  interviewState.started = true;
  interviewState.track = trackSelect?.value || "历史学";
  interviewState.round = 0;
  interviewState.history = [];
  interviewState.transcript = [];
  interviewState.fallbackCursor = 0;
  interviewState.reportGenerated = false;
  interviewState.finalReportText = "";
  interviewState.phase = "intro";
  interviewState.specialization = "";
  interviewState.examinerCursor = 1;
  interviewState.activeRoleId = "chief";

  interviewPanel.classList.remove("hidden");
  chatBox.innerHTML = "";
  clearSpeaking();
  setCurrentQuestion("考官准备提问中...");
  startBtn.disabled = true;
  finishBtn.disabled = false;
  setDownloadDisabled(true);
  setInputDisabled(true);
  setStatus("面试进行中（倒计时已开始，请先自我介绍）", false);
  if (historyAccordion) {
    historyAccordion.open = false;
  }
  startCountdown();
  const chief = pickExaminer("intro");
  const introQuestion = "请介绍你自己。";
  showSceneSpeech(chief.id, introQuestion);
  appendMessage("teacher", formatTeacherLine(chief, introQuestion));
  interviewState.history.push({ role: "teacher", content: introQuestion });
  interviewState.transcript.push({ role: "teacher", content: introQuestion });
  setInputDisabled(false);
  answerInput.focus();
  scrollToInterviewPanel();
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
  interviewState.activeRoleId = "chief";
  startBtn.disabled = false;
  finishBtn.disabled = false;
  setDownloadDisabled(true);
  interviewPanel.classList.add("hidden");
  chatBox.innerHTML = "";
  clearSpeaking();
  setCurrentQuestion("请点击“开始复试”进入第一题。");
  stopCountdown();
  resetCountdown();
  answerInput.value = "";
  resizeAnswerInput();
  setInputDisabled(false);
  if (historyAccordion) {
    historyAccordion.open = false;
  }
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
  stopCountdown();
  setStatus("正在生成整场复试报告...", false);

  try {
    const lowParticipation = makeLowParticipationReport();
    if (lowParticipation) {
      appendMessage("score", `整场复试报告\n${lowParticipation}`);
      interviewState.reportGenerated = true;
      interviewState.finalReportText = lowParticipation;
      setDownloadDisabled(false);
      setStatus("复试已结束（作答不足，低分处理）", true);
      return;
    }

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

  setStatus("正在下载TXT报告...", false);
  downloadReportAsText(interviewState.finalReportText);
  setStatus("TXT报告下载完成", false);
}

saveConfigBtn.addEventListener("click", saveConfig);
startBtn.addEventListener("click", onStartButtonClick);
resetBtn.addEventListener("click", resetInterview);
finishBtn.addEventListener("click", finishInterview);
downloadReportBtn.addEventListener("click", downloadReport);
voiceBtn.addEventListener("click", toggleVoiceInput);
answerForm.addEventListener("submit", onAnswerSubmit);
answerInput.addEventListener("input", resizeAnswerInput);
answerInput.addEventListener("keydown", onAnswerInputKeydown);
if (noticeCancelBtn) {
  noticeCancelBtn.addEventListener("click", onNoticeCancel);
}
if (noticeAgreeBtn) {
  noticeAgreeBtn.addEventListener("click", onNoticeAgree);
}
if (examNoticeModal) {
  examNoticeModal.addEventListener("click", onNoticeOverlayClick);
}
document.addEventListener("keydown", onDocumentEscape);

loadConfig();
setVoiceButtonLabel();
setStatus("未开始", false);
resizeAnswerInput();
renderCommitteeGrid();
resetCountdown();
setCurrentQuestion("请点击“开始复试”进入第一题。");
syncVoiceHint();
apiKeyInput.addEventListener("input", syncVoiceHint);
baseUrlInput.addEventListener("input", syncVoiceHint);
window.addEventListener("resize", () => {
  positionSpeechBubble(interviewState.activeRoleId);
});
