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
const interviewTitle = document.querySelector("#interviewPanel .panel-header h2");

const modeRegularBtn = document.getElementById("modeRegularBtn");
const modeDrawBtn = document.getElementById("modeDrawBtn");
const sidebarRegularBtn = document.getElementById("sidebarRegularBtn");
const sidebarDrawBtn = document.getElementById("sidebarDrawBtn");
const modeTip = document.getElementById("modeTip");
const drawPanel = document.getElementById("drawPanel");
const drawResetBtn = document.getElementById("drawResetBtn");
const drawDownloadReportBtn = document.getElementById("drawDownloadReportBtn");
const drawEnglishBtn = document.getElementById("drawEnglishBtn");
const drawMajorBtn = document.getElementById("drawMajorBtn");
const drawEnglishPrompt = document.getElementById("drawEnglishPrompt");
const drawEnglishText = document.getElementById("drawEnglishText");
const drawEnglishAnswerInput = document.getElementById("drawEnglishAnswerInput");
const drawEnglishSubmitBtn = document.getElementById("drawEnglishSubmitBtn");
const drawEnglishAnswerStatus = document.getElementById("drawEnglishAnswerStatus");
const drawMajorPrompt = document.getElementById("drawMajorPrompt");
const drawMajorList = document.getElementById("drawMajorList");
const drawMajorHint = document.getElementById("drawMajorHint");
const drawLogBox = document.getElementById("drawLogBox");
const drawNotesInput = document.getElementById("drawNotesInput");
const saveDrawNotesBtn = document.getElementById("saveDrawNotesBtn");
const drawNextRoundBtn = document.getElementById("drawNextRoundBtn");
const drawTimerMinutes = document.getElementById("drawTimerMinutes");
const drawTimerStartBtn = document.getElementById("drawTimerStartBtn");
const drawTimerResetBtn = document.getElementById("drawTimerResetBtn");
const drawCountdownClock = document.getElementById("drawCountdownClock");
const drawTimerHint = document.getElementById("drawTimerHint");

const trackSelect = document.getElementById("trackSelect");
const baseUrlInput = document.getElementById("baseUrlInput");
const modelInput = document.getElementById("modelInput");
const apiKeyInput = document.getElementById("apiKeyInput");

const configStorageKey = "historyInterviewConfig_v1";
const modeStorageKey = "historyInterviewMode_v1";
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
  mode: "regular",
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

const drawState = {
  englishQuestion: "",
  englishAnswer: "",
  englishSubmitted: false,
  majorQuestions: [],
  selectedMajorIndexes: new Set(),
  submitted: false,
  reportGenerated: false,
  finalReportText: "",
  recentEnglishQuestions: [],
  recentMajorQuestions: [],
};

const REFERENCE_SPLITTER = "===参考答案===";
const REGULAR_REFERENCE_SPLITTER = "|||参考思路|||";
const ENGLISH_TRANSLATION_SPLITTER = "|||参考译文|||";

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
let drawCountdownSeconds = 5 * 60;
let drawCountdownTicker = null;

function setStatus(text, warn = false) {
  statusLine.textContent = `状态：${text}`;
  statusLine.classList.toggle("warn", warn);
}

function updateModeButtons() {
  const isRegular = interviewState.mode === "regular";
  [modeRegularBtn, sidebarRegularBtn].forEach((btn) => btn?.classList.toggle("is-active", isRegular));
  [modeDrawBtn, sidebarDrawBtn].forEach((btn) => btn?.classList.toggle("is-active", !isRegular));
  if (modeTip) {
    modeTip.textContent = isRegular
      ? "当前模式：常规互动模式（自我介绍 + AI追问）"
      : "当前模式：抽题模式（英语抽题 + 专业课四选三 + 计时记录）";
  }
  if (startBtn) {
    startBtn.textContent = isRegular ? "我已经准备好了，开始复试" : "我已经准备好了，进入抽题模式";
  }
}

function saveMode() {
  localStorage.setItem(modeStorageKey, interviewState.mode);
}

function loadMode() {
  const mode = localStorage.getItem(modeStorageKey);
  if (mode === "draw" || mode === "regular") {
    interviewState.mode = mode;
  }
  updateModeButtons();
}

function switchMode(nextMode) {
  if (nextMode !== "regular" && nextMode !== "draw") return;
  if (nextMode === interviewState.mode) return;
  if (interviewState.started) {
    const ok = window.confirm("切换模式会清空当前进度，是否继续？");
    if (!ok) return;
    resetAll();
  }
  interviewState.mode = nextMode;
  saveMode();
  updateModeButtons();
  setStatus(nextMode === "regular" ? "已切换到常规互动模式" : "已切换到抽题模式（盲抽制）", false);
}

function appendDrawLog(text, role = "teacher") {
  if (!drawLogBox) return;
  const msg = document.createElement("div");
  msg.className = `msg ${role}`;
  msg.textContent = text;
  drawLogBox.appendChild(msg);
  drawLogBox.scrollTop = drawLogBox.scrollHeight;
}

function clearDrawState(options = {}) {
  const { preserveLog = false } = options;
  drawState.englishQuestion = "";
  drawState.englishAnswer = "";
  drawState.englishSubmitted = false;
  drawState.majorQuestions = [];
  drawState.selectedMajorIndexes.clear();
  drawState.submitted = false;
  drawState.reportGenerated = false;
  drawState.finalReportText = "";
  if (!preserveLog) {
    drawState.recentEnglishQuestions = [];
    drawState.recentMajorQuestions = [];
  }

  if (drawEnglishPrompt) drawEnglishPrompt.classList.add("hidden");
  if (drawEnglishText) {
    drawEnglishText.classList.add("hidden");
    drawEnglishText.textContent = "";
  }
  if (drawMajorPrompt) drawMajorPrompt.classList.add("hidden");
  if (drawMajorList) drawMajorList.innerHTML = "";
  if (drawMajorHint) drawMajorHint.textContent = "已选择 0 / 3";
  if (drawEnglishBtn) drawEnglishBtn.disabled = false;
  if (drawNotesInput) {
    drawNotesInput.value = "";
    drawNotesInput.disabled = true;
  }
  if (drawEnglishAnswerInput) {
    drawEnglishAnswerInput.value = "";
    drawEnglishAnswerInput.disabled = true;
  }
  if (drawEnglishSubmitBtn) {
    drawEnglishSubmitBtn.disabled = true;
  }
  if (drawEnglishAnswerStatus) {
    drawEnglishAnswerStatus.textContent = "尚未提交英语作答。";
  }
  if (drawLogBox && !preserveLog) drawLogBox.innerHTML = "";
  if (drawMajorBtn) drawMajorBtn.disabled = true;
  if (saveDrawNotesBtn) saveDrawNotesBtn.disabled = false;
  if (drawNextRoundBtn) drawNextRoundBtn.disabled = true;
  if (drawDownloadReportBtn) drawDownloadReportBtn.disabled = true;
}

function ensureModelAvailable(strictPurpose) {
  const { baseUrl, apiKey } = getConfig();
  const useServerProxy = !apiKey && baseUrl.startsWith("/api/");
  if (apiKey || useServerProxy) return;
  throw new Error(`未配置可用大模型接口，无法${strictPurpose}。请填写 API Key，或将接口地址设置为可用的聊天补全接口。`);
}

async function drawByModel(messages) {
  const { baseUrl, model, apiKey } = getConfig();
  ensureModelAvailable("执行该步骤");

  const headers = { "Content-Type": "application/json" };
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const response = await fetch(baseUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`大模型请求失败(${response.status})：${text.slice(0, 160)}`);
  }
  const data = await response.json();
  const content = String(data?.choices?.[0]?.message?.content || "").trim();
  if (!content) {
    throw new Error("大模型返回为空");
  }
  return content;
}

async function fetchDrawEnglishQuestion() {
  const recent = drawState.recentEnglishQuestions.slice(-5).join("\n- ");
  const content = await drawByModel([
    {
      role: "system",
      content:
        "你是历史学复试命题老师。请生成1段用于朗读+口译的英文学术段落，120-170英文词，主题为历史研究方法或史学解释，表达清晰，不要分点。",
    },
    {
      role: "user",
      content: [
        "请输出严格JSON：{\"question\":\"...\"}",
        "要求：与以往抽题风格明显不同，避免重复表达。",
        `最近已出题（避免相似）：${recent ? `\n- ${recent}` : "无"}`,
      ].join("\n"),
    },
  ]);
  const parsed = JSON.parse(extractJSON(content));
  const question = String(parsed?.question || "").trim();
  if (!question) throw new Error("英语抽题结果为空");
  return question;
}

async function fetchDrawMajorQuestions() {
  const recent = drawState.recentMajorQuestions.slice(-8).join("\n- ");
  const content = await drawByModel([
    {
      role: "system",
      content:
        "你是历史学考研复试命题老师。请一次生成4道高质量历史学论述题，覆盖不同维度（政治、经济、社会、史学方法或比较史）。每题必须可独立作答，不可重复。",
    },
    {
      role: "user",
      content: [
        "请输出严格JSON：{\"questions\":[\"题1\",\"题2\",\"题3\",\"题4\"]}",
        "要求：四题互不重复；不要与最近题目相似；题目具体、可评分。",
        `最近已出题（避免相似）：${recent ? `\n- ${recent}` : "无"}`,
      ].join("\n"),
    },
  ]);
  const parsed = JSON.parse(extractJSON(content));
  const questions = Array.isArray(parsed?.questions)
    ? parsed.questions.map((item) => String(item || "").trim()).filter(Boolean)
    : [];
  const unique = Array.from(new Set(questions));
  if (unique.length < 4) {
    throw new Error("专业课抽题结果不足4道或存在重复");
  }
  return unique.slice(0, 4);
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
  startSelectedMode();
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

function appendTeacherMessageWithReference(text, referenceText = "") {
  const msg = document.createElement("div");
  msg.className = "msg teacher";

  const main = document.createElement("div");
  main.className = "teacher-main";
  main.textContent = text;
  msg.appendChild(main);

  const reference = String(referenceText || "").trim();
  if (reference) {
    const details = document.createElement("details");
    details.className = "teacher-reference-details";

    const summary = document.createElement("summary");
    summary.textContent = "💡 思路提示";
    details.appendChild(summary);

    const body = document.createElement("pre");
    body.className = "teacher-reference-body";
    body.textContent = reference;
    details.appendChild(body);

    msg.appendChild(details);
  }

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sanitizeFollowUpText(text) {
  let cleaned = String(text || "").trim();
  cleaned = cleaned.replace(/^[\s【\[].{0,8}(点评|追问|反馈|回复|下一个追问).{0,4}[】\]]\s*/i, "");
  cleaned = cleaned.replace(/^(点评|追问|反馈|回复|下一个追问|点评与追问)[:：]\s*/i, "");
  cleaned = cleaned.replace(/您/g, "你");
  cleaned = cleaned.replace(/(^|[，。！？\s])([^\s，。！？]{1,4})(老师|教授)(?=[，。！？:：]|$)/g, "$1这位同学");
  return cleaned.trim();
}

function splitRegularReply(text) {
  const raw = String(text || "");
  const parts = raw.split(REGULAR_REFERENCE_SPLITTER);
  const followUpText = sanitizeFollowUpText(String(parts[0] || ""));
  const referenceText = String(parts.slice(1).join(REGULAR_REFERENCE_SPLITTER) || "").trim();
  return { followUpText, referenceText };
}

function normalizeReferenceBullets(text) {
  const raw = String(text || "").trim();
  if (!raw) return "";
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const hasBullet = lines.some((line) => /^[-*•]/.test(line));
  if (hasBullet) return lines.join("\n");
  const chunks = raw
    .split(/[。；;\n]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);
  if (!chunks.length) return raw;
  return chunks.map((item) => `- ${item}`).join("\n");
}

function buildFallbackReference(currentQuestionText, mode = "follow_up") {
  const question = String(currentQuestionText || "").replace(/^老师[:：]?\s*/, "").trim() || "上一问";
  if (shouldUseInterviewTips(mode, "", question)) {
    return [
      "- 先讲“研究兴趣 + 报考方向”，控制在30-40秒。",
      "- 补一个可验证经历（如论文题目、时间范围、研究方法）。",
      "- 结尾给出可追问点，方便老师进入专业问题。",
    ].join("\n");
  }
  return [
    "- 时间锚点：先明确关键时段（如1840-1911晚清变局）。",
    "- 史实举证：至少点出1-2个事件（如洋务运动、戊戌变法）并说明作用。",
    "- 史学概念：用“国家治理转型/社会结构变动”串联因果。",
  ].join("\n");
}

function buildFallbackRegularReply(mode, userAnswer = "") {
  const fallback =
    mode === "first_topic_question"
      ? makeFallbackFirstQuestion()
      : mode === "fix_and_switch_question"
        ? makeFallbackFixAndSwitchQuestion()
      : mode === "switch_question"
        ? makeFallbackSwitchQuestion()
        : makeFallbackFollowUp();
  const followUp = String(fallback?.follow_up || "我们继续下一题。").trim();
  const reference = shouldUseInterviewTips(mode, userAnswer)
    ? [
        "- 结构：我是谁、研究兴趣、报考方向，按30-40秒组织。",
        "- 证据：补1个具体学术经历（论文/史料训练/课程项目）。",
        "- 衔接：最后抛出一个研究问题，引导老师继续追问。",
      ].join("\n")
    : buildFallbackReference(currentQuestion?.textContent || userAnswer, mode);
  return `${followUp}\n${REGULAR_REFERENCE_SPLITTER}\n${reference}`;
}

function splitEvaluationAndReference(fullText) {
  const text = String(fullText || "");
  const index = text.indexOf(REFERENCE_SPLITTER);
  if (index === -1) {
    return {
      reviewText: text.trim(),
      referenceText: "",
    };
  }
  const reviewText = text.slice(0, index).trim();
  const referenceText = text.slice(index + REFERENCE_SPLITTER.length).trim();
  return { reviewText, referenceText };
}

function buildEvaluationReportNode(title, fullText) {
  const { reviewText, referenceText } = splitEvaluationAndReference(fullText);
  const box = document.createElement("div");
  box.className = "report-block";

  const titleEl = document.createElement("div");
  titleEl.className = "report-title";
  titleEl.textContent = title;
  box.appendChild(titleEl);

  const reviewEl = document.createElement("pre");
  reviewEl.className = "report-review";
  reviewEl.textContent = reviewText || "（点评为空）";
  box.appendChild(reviewEl);

  if (referenceText) {
    const details = document.createElement("details");
    details.className = "report-details";

    const summary = document.createElement("summary");
    summary.textContent = "💡 查看参考答题思路与要点";
    details.appendChild(summary);

    const answer = document.createElement("pre");
    answer.className = "report-reference";
    answer.textContent = referenceText;
    details.appendChild(answer);

    box.appendChild(details);
  }
  return box;
}

function appendEvaluationReportToChat(title, fullText) {
  const msg = document.createElement("div");
  msg.className = "msg score";
  msg.appendChild(buildEvaluationReportNode(title, fullText));
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendEvaluationReportToDrawLog(title, fullText) {
  if (!drawLogBox) return;
  const msg = document.createElement("div");
  msg.className = "msg score";
  msg.appendChild(buildEvaluationReportNode(title, fullText));
  drawLogBox.appendChild(msg);
  drawLogBox.scrollTop = drawLogBox.scrollHeight;
}

function splitEnglishEvaluationAndReference(fullText) {
  const text = String(fullText || "");
  const index = text.indexOf(ENGLISH_TRANSLATION_SPLITTER);
  if (index === -1) {
    return { reviewText: text.trim(), referenceText: "" };
  }
  return {
    reviewText: text.slice(0, index).trim(),
    referenceText: text.slice(index + ENGLISH_TRANSLATION_SPLITTER.length).trim(),
  };
}

function appendDrawEnglishEvaluation(fullText) {
  if (!drawLogBox) return;
  const { reviewText, referenceText } = splitEnglishEvaluationAndReference(fullText);
  const msg = document.createElement("div");
  msg.className = "msg score";

  const box = document.createElement("div");
  box.className = "draw-english-eval";

  const review = document.createElement("pre");
  review.className = "report-review";
  review.textContent = reviewText || "英语评估为空。";
  box.appendChild(review);

  if (referenceText) {
    const details = document.createElement("details");
    details.className = "reference-details";

    const summary = document.createElement("summary");
    summary.textContent = "💡 查看参考译文与核心词汇";
    details.appendChild(summary);

    const body = document.createElement("pre");
    body.className = "reference-body";
    body.textContent = referenceText;
    details.appendChild(body);

    box.appendChild(details);
  }

  msg.appendChild(box);
  drawLogBox.appendChild(msg);
  drawLogBox.scrollTop = drawLogBox.scrollHeight;
}

async function evaluateDrawEnglishAnswerByAPI(englishQuestion, englishAnswer) {
  const { baseUrl, model, apiKey } = getConfig();
  const useServerProxy = !apiKey && baseUrl.startsWith("/api/");
  if (!apiKey && !useServerProxy) {
    throw new Error("未配置可用大模型接口");
  }

  const headers = { "Content-Type": "application/json" };
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const messages = [
    {
      role: "system",
      content: [
        "你是历史学复试英语翻译阅卷老师。",
        "请严格输出两部分，中间必须用分隔符：|||参考译文|||。",
        "第一部分（评分与点评）：",
        "- 给出具体评分（满分10分）。",
        "- 用1-2句极精炼点评，直接指出漏译、错译、史学术语翻译准确性（如 historiography/narrative/primary sources）。",
        "- 禁止客套修辞，保持学术严谨。",
        "第二部分（标准示范）：",
        "- 针对英文原文给出高质量中文学术参考译文。",
        "- 最后补“核心词汇对照：”并列出3-5个关键词英汉对应。",
      ].join("\n"),
    },
    {
      role: "user",
      content: ["【英文原文】", englishQuestion, "【考生翻译/口述】", englishAnswer].join("\n"),
    },
  ];

  const response = await fetch(baseUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`英语评估失败(${response.status})：${errText.slice(0, 160)}`);
  }
  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("英语评估返回为空");
  return content;
}

function buildRegularMarkdownReportNode(title, markdownText) {
  const box = document.createElement("div");
  box.className = "report-block regular-report-block";

  const titleEl = document.createElement("div");
  titleEl.className = "report-title";
  titleEl.textContent = title;
  box.appendChild(titleEl);

  const container = document.createElement("div");
  container.className = "regular-report-md";
  const lines = String(markdownText || "")
    .replace(/\r\n?/g, "\n")
    .split("\n");

  let ul = null;
  let ol = null;
  const closeLists = () => {
    ul = null;
    ol = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      closeLists();
      continue;
    }

    if (/^【.+】$/.test(line)) {
      closeLists();
      const h = document.createElement("h4");
      h.className = "regular-report-heading";
      h.textContent = line;
      container.appendChild(h);
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      if (!ul) {
        ul = document.createElement("ul");
        ul.className = "regular-report-list";
        container.appendChild(ul);
      }
      const li = document.createElement("li");
      li.textContent = line.replace(/^[-*]\s+/, "");
      ul.appendChild(li);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      if (!ol) {
        ol = document.createElement("ol");
        ol.className = "regular-report-list";
        container.appendChild(ol);
      }
      const li = document.createElement("li");
      li.textContent = line.replace(/^\d+\.\s+/, "");
      ol.appendChild(li);
      continue;
    }

    closeLists();
    const p = document.createElement("p");
    p.className = "regular-report-paragraph";
    p.textContent = line;
    container.appendChild(p);
  }

  box.appendChild(container);
  return box;
}

function appendRegularMarkdownReportToChat(title, markdownText) {
  const msg = document.createElement("div");
  msg.className = "msg score";
  msg.appendChild(buildRegularMarkdownReportNode(title, markdownText));
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
    node.classList.remove("speaking-active");
    node.querySelector(".avatar-head")?.classList.remove("speaking-active");
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
      card.classList.add("speaking-active");
      card.querySelector(".avatar-head")?.classList.add("speaking-active");
    } else {
      card.classList.remove("is-active");
      card.classList.add("is-muted");
      card.classList.remove("speaking-active");
      card.querySelector(".avatar-head")?.classList.remove("speaking-active");
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

  const minCenterX = bubbleWidth / 2 + 14;
  const maxCenterX = sectionRect.width - bubbleWidth / 2 - 14;
  const minCenterY = bubbleHeight / 2 + 14;
  const maxCenterY = sectionRect.height - bubbleHeight / 2 - 14;
  const defaultCenterX = sectionRect.width / 2;
  const defaultCenterY = sectionRect.height / 2;
  let activeCenterX = defaultCenterX;
  let activeCenterY = defaultCenterY;

  const activeCard = activeRoleId
    ? committeeGrid.querySelector(`.committee-card[data-role-id="${activeRoleId}"]`)
    : null;
  let hasActive = false;
  if (activeCard) {
    const activeRect = activeCard.getBoundingClientRect();
    activeCenterX = activeRect.left - sectionRect.left + activeRect.width / 2;
    activeCenterY = activeRect.top - sectionRect.top + activeRect.height / 2;
    hasActive = true;
  }
  const tableRect = roundTable ? roundTable.getBoundingClientRect() : null;
  const tableCenterX = tableRect ? tableRect.left - sectionRect.left + tableRect.width / 2 : defaultCenterX;
  const tableCenterY = tableRect ? tableRect.top - sectionRect.top + tableRect.height / 2 : defaultCenterY;
  const tableInnerLeft = tableRect ? tableRect.left - sectionRect.left + 42 : minCenterX;
  const tableInnerRight = tableRect ? tableRect.right - sectionRect.left - 42 : maxCenterX;
  const tableInnerTop = tableRect ? tableRect.top - sectionRect.top + 20 : minCenterY;
  const tableInnerBottom = tableRect ? tableRect.bottom - sectionRect.top - 20 : maxCenterY;

  const candidateRect = candidateZone ? candidateZone.getBoundingClientRect() : null;
  let safeMaxCenterY = maxCenterY;
  if (candidateRect) {
    const candidateTop = candidateRect.top - sectionRect.top;
    safeMaxCenterY = Math.min(safeMaxCenterY, candidateTop - bubbleHeight / 2 - 20);
  }

  let finalX = tableCenterX;
  let finalY = tableCenterY + 10;
  if (hasActive) {
    // Bias toward the speaking teacher, but keep bubble pulled into table interior.
    finalX = tableCenterX + (activeCenterX - tableCenterX) * 0.12;
    finalY = tableCenterY + (activeCenterY - tableCenterY) * 0.1 + 8;
  }
  finalX = Math.max(minCenterX, Math.min(maxCenterX, finalX));
  finalY = Math.max(minCenterY, Math.min(safeMaxCenterY, finalY));
  finalX = Math.max(tableInnerLeft, Math.min(tableInnerRight, finalX));
  finalY = Math.max(tableInnerTop, Math.min(tableInnerBottom, finalY));

  speechBubble.style.left = `${finalX}px`;
  speechBubble.style.top = `${finalY}px`;

  const bubbleLeft = finalX - bubbleWidth / 2;
  const bubbleTop = finalY - bubbleHeight / 2;
  const bubbleCenterX = finalX;
  const bubbleCenterY = finalY;
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

function shouldUseInterviewTips(mode, userAnswer = "", currentPromptText = "") {
  if (mode === "first_topic_question") return true;
  const text = `${String(userAnswer || "").trim()} ${String(currentPromptText || "").trim()}`.trim();
  if (!text) return false;
  return /(自我介绍|介绍你自己|报考动机|为什么报考|本科经历|个人经历|研究兴趣|学习经历)/.test(text);
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

function readDrawTimerSeconds() {
  const minutes = Number(drawTimerMinutes?.value || 5);
  const clampedMinutes = Math.max(1, Math.min(120, Number.isFinite(minutes) ? minutes : 5));
  if (drawTimerMinutes) {
    drawTimerMinutes.value = String(clampedMinutes);
  }
  return clampedMinutes * 60;
}

function renderDrawCountdown() {
  if (!drawCountdownClock) return;
  drawCountdownClock.textContent = formatCountdown(drawCountdownSeconds);
  drawCountdownClock.classList.toggle("is-warning", drawCountdownSeconds > 0 && drawCountdownSeconds <= 60);
  drawCountdownClock.classList.toggle("is-timeout", drawCountdownSeconds <= 0);
}

function stopDrawCountdown() {
  if (!drawCountdownTicker) return;
  window.clearInterval(drawCountdownTicker);
  drawCountdownTicker = null;
}

function resetDrawCountdown() {
  stopDrawCountdown();
  drawCountdownSeconds = readDrawTimerSeconds();
  renderDrawCountdown();
  if (drawTimerHint) drawTimerHint.textContent = "计时器已重置。";
}

function startDrawCountdown() {
  if (drawCountdownTicker) return;
  if (drawCountdownSeconds <= 0) {
    drawCountdownSeconds = readDrawTimerSeconds();
    renderDrawCountdown();
  }
  if (drawTimerHint) drawTimerHint.textContent = "计时中...";
  drawCountdownTicker = window.setInterval(() => {
    if (!interviewState.started || interviewState.mode !== "draw") return;
    drawCountdownSeconds = Math.max(0, drawCountdownSeconds - 1);
    renderDrawCountdown();
    if (drawCountdownSeconds === 0) {
      stopDrawCountdown();
      if (drawTimerHint) drawTimerHint.textContent = "本题计时结束，请进入下一题。";
      setStatus("抽题模式：当前题目计时结束", true);
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

function hasEnglishReviewSection(text) {
  const source = String(text || "");
  return /英语作答核对与批改/.test(source) && /理解准确度评分/.test(source) && /翻译忠实度评分/.test(source);
}

async function generateDrawEnglishReviewSection(englishQuestion, englishAnswer) {
  const { baseUrl, model, apiKey } = getConfig();
  const useServerProxy = !apiKey && baseUrl.startsWith("/api/");
  if (!apiKey && !useServerProxy) {
    throw new Error("未配置可用大模型接口");
  }

  const headers = { "Content-Type": "application/json" };
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const messages = [
    {
      role: "system",
      content: [
        "你是复试英语考核老师。",
        "只输出“英语作答核对与批改”这个小节，不要输出其他部分。",
        "格式必须严格为：",
        "英语作答核对与批改",
        "理解准确度评分：X.X/10（1句理由）",
        "翻译忠实度评分：X.X/10（1句理由）",
        "语言表达建议：",
        "- 建议1",
        "- 建议2",
      ].join("\n"),
    },
    {
      role: "user",
      content: ["【英语抽题原文】", englishQuestion, "【英语作答】", englishAnswer].join("\n"),
    },
  ];

  const response = await fetch(baseUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.3,
    }),
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`英语核对生成失败(${response.status})：${errText.slice(0, 120)}`);
  }
  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("英语核对返回为空");
  return content;
}

function buildFallbackEnglishReviewSection(englishAnswer = "") {
  const answer = String(englishAnswer || "").trim();
  const len = answer.length;
  const comprehension = len >= 120 ? 6.5 : len >= 60 ? 5.5 : len >= 20 ? 4.5 : 3.0;
  const fidelity = len >= 120 ? 6.0 : len >= 60 ? 5.0 : len >= 20 ? 4.0 : 2.5;
  return [
    "英语作答核对与批改",
    `理解准确度评分：${comprehension.toFixed(1)}/10（回答覆盖了部分原文主旨，但关键信息复现不完整。）`,
    `翻译忠实度评分：${fidelity.toFixed(1)}/10（译述存在省略与泛化，细节对应关系偏弱。）`,
    "语言表达建议：",
    "- 先按“主旨句-论证句-结论句”复述，再进入翻译，避免遗漏逻辑连接词。",
    "- 每次翻译后回看是否包含时间、对象、因果三类关键信息。",
  ].join("\n");
}

async function ensureDrawEnglishReview(reportText, englishQuestion, englishAnswer) {
  if (hasEnglishReviewSection(reportText)) return reportText;
  try {
    const englishSection = await generateDrawEnglishReviewSection(englishQuestion, englishAnswer);
    return `${englishSection}\n\n${reportText}`;
  } catch {
    const fallbackSection = buildFallbackEnglishReviewSection(englishAnswer);
    return `${fallbackSection}\n\n${reportText}`;
  }
}

async function generateDrawReportByAPI({ englishQuestion, englishAnswer, selectedQuestions, majorAnswer }) {
  const messages = [
    {
      role: "system",
      content:
        [
          "你是历史学考研复试评委，请严格执行评分规则，先核查切题度再评分。",
          "【一票否决/偏题重罚】若回答仅为空泛史学理论、模板背诵，或未提供与题目直接相关的历史事件、时间节点、具体史实论证，即判定为严重偏题或论证缺失。",
          "一旦判定严重偏题或论证缺失，总分最高不得超过3/10；即使文笔好、结构完整也不得上调。",
          "评分必须证据化：所有判断都要引用回答中的具体信息（或明确指出缺失）。",
          "不得打压考生，但也不得虚高给分。",
        ].join(" "),
    },
    {
      role: "user",
      content: [
        "请严格按以下Rubric评分（总分10分）：",
        "A. 题目切合度与史实准确性（60%）",
        "B. 史学思维与问题分析（20%）",
        "C. 逻辑结构与学术表达（20%）",
        "规则：若A项极差（严重偏题/缺乏具体史实论证），总分直接不及格，且最高3/10。",
        "",
        "输出必须按以下顺序：",
        "1) 英语作答核对与批改（必须包含：理解准确度评分X.X/10、翻译忠实度评分X.X/10、语言表达建议2条）",
        "2) 考生回答与题目的对应关系检查",
        "3) 分项评分（A/B/C，各项必须写成“X.X/10”，并给理由）",
        "4) 总评建议分（满分10分）",
        "5) 总体评价（2-3句）",
        "6) 优势（3条）",
        "7) 主要问题（3条，若偏题需明确写出“答非所问”或“缺乏具体史实论证”）",
        "8) 3天改进建议（3条，需可执行、可量化、与本次偏差直接对应）",
        "校验要求：总评建议分必须等于加权分=A*0.6+B*0.2+C*0.2（允许误差±0.1）。",
        `最后必须输出分隔符：${REFERENCE_SPLITTER}`,
        "分隔符后输出【参考答案】时，必须按“第1题/第2题/第3题”逐题作答，三题都必须出现，禁止只写一题或合并成一题。",
        "每一题都必须包含：",
        "1) 核心破题思路",
        "2) 必备史实要点（3-4个关键历史事件、时间或概念）",
        "最后单独写“学术总结陈词”：只能总结上述三题参考答案的共性方法与史学表达，不得评价考生作答。",
        "",
        "【英语抽题原文】",
        englishQuestion,
        "【英语作答】",
        englishAnswer,
        "【专业课已选3题】",
        `1) ${selectedQuestions[0] || ""}`,
        `2) ${selectedQuestions[1] || ""}`,
        `3) ${selectedQuestions[2] || ""}`,
        "【专业课统一作答】",
        majorAnswer,
      ].join("\n"),
    },
  ];
  const report = await generateValidatedEvaluation(messages, 0.4);
  return ensureDrawEnglishReview(report, englishQuestion, englishAnswer);
}

async function askTeacherByAPI({ mode, userAnswer = "", targetQuestionStyle = "analysis" }) {
  const { baseUrl, model, apiKey } = getConfig();
  const useServerProxy = !apiKey && baseUrl.startsWith("/api/");

  if (!apiKey && !useServerProxy) {
    return buildFallbackRegularReply(mode, userAnswer);
  }

  const messages = [
    {
      role: "system",
      content:
        [
          "【史实绝对红线｜System Override】以下规则优先级最高，必须先执行。",
          "1) 强制时空坐标核查（Anti-Hallucination）：在生成任何追问与思路提示前，先核对事件的绝对时间（年份/世纪）、所属朝代/政权、核心人物；绝对禁止跨朝代时空错乱。",
          "2) 严禁因果倒置与逻辑编造：历史前因后果必须符合客观史实；不得为迎合方向而拼凑不相关事件。",
          "3) 强化过渡时期精确度：处理魏晋南北朝、明清交替、晚清民国等阶段时，必须明确小政权与时间节点（如明末/南明/清初）。",
          `4) 思路提示史实底线：${REGULAR_REFERENCE_SPLITTER} 后只给教科书级准确要点；若不确定精确年份或影响，宁可给宏观分析视角，也不得编造具体史实。`,
          "你是历史学考研复试老师，风格严谨、简洁、口语化。",
          "角色设定：你是研究生复试考官（导师），对话对象是参加复试的本科生/考生。",
          "称呼禁令：绝对禁止称呼对方为“老师”“教授”或“您”。只能用“这位同学”“考生”或“你”。",
          "语气要求：保持大学导师面试学生的权威感和引导性，不要过度客气和奉承。",
          "口语限制：绝对禁止使用“探索”“领域”“让我们”“很高兴认识你”等机器味或客套词。",
          "提问风格必须直接、干练、口语化；可用‘刚才你提到…那你怎么看…’‘关于这一点，我追问一下…’这类真实导师表达。",
          "禁止书面宣讲腔、排比、比喻和花哨修辞。",
          "规则1：整场第一问固定是“请介绍你自己”。",
          "规则2：如果考生自述报考方向为明清史或近代史，后续围绕该方向展开提问。",
          "规则3：如果考生明确表示“这题不会/答不上来”，不要追问不会原因，直接换一道同方向新题。",
          "规则4：如果考生指出你的题目存在史实错误或时间线错误，先一句话承认并更正，再换一道同方向新题。",
          "规则5：明清史提问必须严格校验时间线，不要把鸦片战争(1840-)放在清初。",
          "规则5.1：严禁出“某事件发生在哪一年”这类纯年份死记硬背题。",
          "规则5.2：可穿插文献/制度基础考查（如《通典》作者、两税法核心内容），但不得连续只问基础题。",
          "规则5.3：基础识记题与深度分析题必须交替，持续引导考生展示史学思维。",
          `规则6：输出顺序不可破坏，必须是“自然口语反馈+下一问”${REGULAR_REFERENCE_SPLITTER}“思路提示”。`,
          `严禁把“下一问”放在 ${REGULAR_REFERENCE_SPLITTER} 之后。`,
          "分隔符前必须是自然连贯口语，绝对禁止任何标签、括号或前缀（如“点评：”“追问：”“【点评】”）。",
          "分隔符后给2-3条要点（bullet points），每条都要包含具体史实：历史事件、时间节点或核心史学概念。",
          "不要长篇大论，保持平实、客观的学术指导语气。",
          "语气客观清晰，像导师复盘，不使用浮夸修辞。",
          "不要输出JSON，不要加额外标题，不要遗漏分隔符。",
        ].join(" "),
    },
    {
      role: "system",
      content: `当前大方向：${interviewState.track}。当前聚焦方向：${buildFocusLabel()}。`,
    },
    {
      role: "system",
      content: shouldUseInterviewTips(mode, userAnswer, currentQuestion?.textContent)
        ? `当前属于自我介绍/闲聊语境。${REGULAR_REFERENCE_SPLITTER} 后给2-3条面试技巧要点（结构、重点、表达），不要捏造历史知识点。`
        : `当前属于专业问答语境。${REGULAR_REFERENCE_SPLITTER} 后给2-3条带具体史实的要点（事件/时间/概念）。`,
    },
    {
      role: "system",
      content:
        targetQuestionStyle === "foundation"
          ? "本轮下一问优先采用基础文献/制度题（非纯年份题），并在后续切回分析题。"
          : "本轮下一问优先采用分析题（评价影响、因果机制、史学解释），避免停留在记忆问答。",
    },
  ];

  if (mode === "first_topic_question") {
    messages.push({
      role: "user",
      content: [
        `考生刚做完自我介绍：${userAnswer}`,
        "请给出第一道专业题，默认与其自述方向一致；若未明确方向，则按当前大方向出题。",
        `严格按“自然口语反馈+下一问${REGULAR_REFERENCE_SPLITTER}2-3条要点”输出。`,
      ].join("\n"),
    });
  } else if (mode === "switch_question") {
    messages.push({
      role: "user",
      content: [
        `考生回答：${userAnswer}`,
        "考生表示这道题不会，请直接换一道同方向新题，不要追问不会的原因。",
        `严格按“自然口语反馈+下一问${REGULAR_REFERENCE_SPLITTER}2-3条要点”输出。`,
      ].join("\n"),
    });
  } else if (mode === "fix_and_switch_question") {
    messages.push({
      role: "user",
      content: [
        `考生反馈：${userAnswer}`,
        "考生指出你的题目前提有误，请先一句话承认并更正，再换一道同方向新题。",
        `严格按“自然口语反馈+下一问${REGULAR_REFERENCE_SPLITTER}2-3条要点”输出。`,
      ].join("\n"),
    });
  } else {
    messages.push({
      role: "user",
      content: [
        `考生回答：${userAnswer}`,
        "请基于该回答继续追问。",
        `严格按“自然口语反馈+下一问${REGULAR_REFERENCE_SPLITTER}2-3条要点”输出。`,
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
  const parsed = splitRegularReply(content);
  if (!parsed.followUpText) {
    throw new Error("API返回缺少追问内容");
  }
  if (!parsed.referenceText) {
    return `${parsed.followUpText}\n${REGULAR_REFERENCE_SPLITTER}\n${buildFallbackReference(currentQuestion?.textContent, mode)}`;
  }
  return `${parsed.followUpText}\n${REGULAR_REFERENCE_SPLITTER}\n${normalizeReferenceBullets(parsed.referenceText)}`;
}

async function generateReportByAPI() {
  const transcript = interviewState.transcript
    .map((item, idx) => `${idx + 1}. ${item.role === "teacher" ? "老师" : "考生"}：${item.content}`)
    .join("\n");

  const { baseUrl, model, apiKey } = getConfig();
  const useServerProxy = !apiKey && baseUrl.startsWith("/api/");
  if (!apiKey && !useServerProxy) {
    throw new Error("未配置可用大模型接口，无法生成整场综合复试报告。");
  }

  const messages = [
    {
      role: "system",
      content:
        [
          "你是历史学复试的导师组组长。",
          "请基于完整面试对话做全局评估，给出客观、学术、具有指导意义的综合复试报告。",
          "绝对禁止逐句检查“是否切合题目”，禁止套用逐题机械打分表。",
          "拒绝浮夸修辞和空话，保持学术严肃、表达克制。",
        ].join(" "),
    },
    {
      role: "user",
      content: [
        `方向：${interviewState.track}`,
        "请严格按以下Markdown结构输出：",
        "【综合评分】",
        "（百分制，例如 85/100）",
        "",
        "【导师组总评】",
        "（一段总结整体表现）",
        "",
        "【面试表现剖析】",
        "史学素养与专业知识：",
        "学术表达与研究视野：",
        "临场应变与沟通互动：",
        "",
        "【冲刺提升建议】",
        "（给出3条具体、可执行、硬核建议）",
        "以下是完整面试记录：",
        transcript,
      ].join("\n"),
    },
  ];

  const headers = { "Content-Type": "application/json" };
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const requiredHeadings = ["【综合评分】", "【导师组总评】", "【面试表现剖析】", "【冲刺提升建议】"];
  let correctionNote = "";

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const finalMessages = correctionNote
      ? [
          ...messages,
          {
            role: "user",
            content: `你上一版缺少或错排以下结构：${correctionNote}。请完整重写，并严格使用四个标题。`,
          },
        ]
      : messages;

    const response = await fetch(baseUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages: finalMessages,
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`综合报告生成失败(${response.status})：${errText.slice(0, 200)}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("综合报告返回为空");
    }

    const missing = requiredHeadings.filter((h) => !content.includes(h));
    if (!missing.length) {
      return content;
    }
    correctionNote = missing.join("、");
  }

  throw new Error("综合报告结构不完整，请重试");
}

function extractJSON(text) {
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first === -1 || last === -1 || last < first) {
    throw new Error("返回内容不是JSON");
  }
  return text.slice(first, last + 1);
}

function parseSuggestedScore(reportText) {
  const scoped = /总评建议分[^0-9]{0,20}([0-9](?:\.\d+)?)\s*\/\s*10/.exec(reportText);
  if (scoped) return Number(scoped[1]);
  const fallback = /([0-9](?:\.\d+)?)\s*\/\s*10/.exec(reportText);
  if (fallback) return Number(fallback[1]);
  return null;
}

function parseRubricScore(reportText, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`${escaped}[^\\n\\d]{0,20}([0-9](?:\\.\\d+)?)\\s*/\\s*10`),
    new RegExp(`${escaped}[^\\n\\d]{0,20}([0-9](?:\\.\\d+)?)\\s*分`),
  ];
  for (const regex of patterns) {
    const hit = regex.exec(reportText);
    if (hit) return Number(hit[1]);
  }
  return null;
}

function hasReferenceQuestionSection(referenceText, n) {
  const patterns = [
    new RegExp(`第\\s*${n}\\s*题`),
    new RegExp(`题\\s*${n}`),
    new RegExp(`${n}\\s*[\\)）]\\s*`),
  ];
  return patterns.some((regex) => regex.test(referenceText));
}

function validateEvaluationReport(reportText) {
  const errors = [];
  const text = String(reportText || "");
  const score = parseSuggestedScore(text);
  const scoreA = parseRubricScore(text, "A");
  const scoreB = parseRubricScore(text, "B");
  const scoreC = parseRubricScore(text, "C");
  const split = splitEvaluationAndReference(text);

  if (!/对应关系检查/.test(text)) {
    errors.push("缺少“考生回答与题目的对应关系检查”");
  }
  if (!/英语作答核对与批改/.test(text)) {
    errors.push("缺少“英语作答核对与批改”部分");
  }
  if (!/理解准确度评分[^0-9]{0,20}[0-9](?:\.\d+)?\s*\/\s*10/.test(text)) {
    errors.push("英语核对缺少“理解准确度评分X.X/10”");
  }
  if (!/翻译忠实度评分[^0-9]{0,20}[0-9](?:\.\d+)?\s*\/\s*10/.test(text)) {
    errors.push("英语核对缺少“翻译忠实度评分X.X/10”");
  }
  if (!/分项评分/.test(text)) {
    errors.push("缺少“分项评分”部分");
  }
  if (!/总评建议分/.test(text)) {
    errors.push("缺少“总评建议分”字段");
  }
  if (!text.includes(REFERENCE_SPLITTER)) {
    errors.push(`缺少参考答案分隔符：${REFERENCE_SPLITTER}`);
  }
  if (!split.referenceText) {
    errors.push("缺少参考答案文本");
  } else {
    if (!/核心破题思路/.test(split.referenceText)) {
      errors.push("参考答案缺少“核心破题思路”");
    }
    if (!/必备史实要点/.test(split.referenceText)) {
      errors.push("参考答案缺少“必备史实要点”");
    }
    if (!/学术总结陈词/.test(split.referenceText)) {
      errors.push("参考答案缺少“学术总结陈词”");
    }
    if (!hasReferenceQuestionSection(split.referenceText, 1)) {
      errors.push("参考答案缺少第1题作答");
    }
    if (!hasReferenceQuestionSection(split.referenceText, 2)) {
      errors.push("参考答案缺少第2题作答");
    }
    if (!hasReferenceQuestionSection(split.referenceText, 3)) {
      errors.push("参考答案缺少第3题作答");
    }
    if (/学术总结陈词[\s\S]{0,120}(考生|作答|你的回答|本次回答|学生)/.test(split.referenceText)) {
      errors.push("学术总结陈词应总结参考答案，不应评价考生回答");
    }
  }
  if (score === null || Number.isNaN(score)) {
    errors.push("未解析到有效的10分制总分");
  }
  if (scoreA === null || Number.isNaN(scoreA)) {
    errors.push("未解析到A项10分制分数");
  }
  if (scoreB === null || Number.isNaN(scoreB)) {
    errors.push("未解析到B项10分制分数");
  }
  if (scoreC === null || Number.isNaN(scoreC)) {
    errors.push("未解析到C项10分制分数");
  }

  if (scoreA !== null && scoreB !== null && scoreC !== null && score !== null) {
    if (scoreA < 0 || scoreA > 10) errors.push("A项分数超出0-10范围");
    if (scoreB < 0 || scoreB > 10) errors.push("B项分数超出0-10范围");
    if (scoreC < 0 || scoreC > 10) errors.push("C项分数超出0-10范围");
    if (score < 0 || score > 10) errors.push("总评分数超出0-10范围");

    const weighted = scoreA * 0.6 + scoreB * 0.2 + scoreC * 0.2;
    const delta = Math.abs(weighted - score);
    if (delta > 0.1) {
      errors.push(`分项加权不一致：A*0.6+B*0.2+C*0.2=${weighted.toFixed(2)}，总评=${score.toFixed(2)}`);
    }
  }

  const severeOffTopic = /答非所问|严重偏题|缺乏具体史实论证|论证缺失/.test(text);
  if (severeOffTopic && score !== null && score > 3) {
    errors.push("已判定偏题/论证缺失但总分超过3/10");
  }

  return { ok: errors.length === 0, errors, score, scoreA, scoreB, scoreC, severeOffTopic };
}

function buildRecoveredEvaluationReport(reportText, checked) {
  const raw = String(reportText || "").trim();
  const hasABC =
    Number.isFinite(checked?.scoreA) &&
    Number.isFinite(checked?.scoreB) &&
    Number.isFinite(checked?.scoreC);
  const weighted = hasABC ? checked.scoreA * 0.6 + checked.scoreB * 0.2 + checked.scoreC * 0.2 : 0;
  const capped = checked?.severeOffTopic ? Math.min(weighted, 3) : weighted;
  const recoveredScore = Math.max(0, Math.min(10, Number(capped.toFixed(1))));
  const issueText = (checked?.errors || [])
    .slice(0, 6)
    .map((item, idx) => `${idx + 1}. ${item}`)
    .join("\n");
  const appendix = [
    "",
    "【系统兜底评分】",
    "检测到报告格式/校验异常，已自动降级处理，不再中断生成。",
    `兜底总评建议分：${recoveredScore}/10`,
    issueText ? "触发原因：" : "",
    issueText,
  ]
    .filter(Boolean)
    .join("\n");
  return raw ? `${raw}\n${appendix}` : appendix.trim();
}

async function generateValidatedEvaluation(messages, temperature = 0.4) {
  const { baseUrl, model, apiKey } = getConfig();
  const useServerProxy = !apiKey && baseUrl.startsWith("/api/");
  if (!apiKey && !useServerProxy) {
    throw new Error("未配置可用大模型接口，无法生成客观评价报告。");
  }

  const headers = {
    "Content-Type": "application/json",
  };
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  let correctionNote = "";
  let lastErrors = [];
  let lastChecked = null;
  let lastContent = "";
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const finalMessages = correctionNote
      ? [
          ...messages,
          {
            role: "user",
            content: `你上一版输出不合规：${correctionNote}。请完整重写报告，严格遵守格式与评分约束。`,
          },
        ]
      : messages;

    const response = await fetch(baseUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages: finalMessages,
        temperature,
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
    lastContent = content;

    const checked = validateEvaluationReport(content);
    lastChecked = checked;
    if (checked.ok) {
      return content;
    }
    lastErrors = checked.errors;
    correctionNote = checked.errors.join("；");
  }

  if (lastContent) {
    return buildRecoveredEvaluationReport(lastContent, lastChecked);
  }
  throw new Error(`报告后处理校验未通过：${lastErrors.join("；")}`);
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
  const activePanel = interviewState.mode === "draw" ? drawPanel : interviewPanel;
  if (!activePanel || activePanel.classList.contains("hidden")) return;
  requestAnimationFrame(() => {
    activePanel.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function startSelectedMode() {
  if (interviewState.mode === "draw") {
    startDrawMode();
    return;
  }
  startInterview();
}

function startDrawMode() {
  interviewState.started = true;
  interviewPanel.classList.add("hidden");
  drawPanel?.classList.remove("hidden");
  startBtn.disabled = true;
  clearDrawState();
  if (drawEnglishBtn) drawEnglishBtn.disabled = false;
  resetDrawCountdown();
  if (drawDownloadReportBtn) drawDownloadReportBtn.disabled = true;
  if (drawTimerHint) drawTimerHint.textContent = "计时器未启动。";
  appendDrawLog("系统：已进入抽题模式。请先点击“抽取英语考题”。");
  setStatus("抽题模式进行中：请先完成英语阅读与翻译", false);
  scrollToInterviewPanel();
}

async function startInterview() {
  drawPanel?.classList.add("hidden");
  if (interviewTitle) {
    interviewTitle.textContent = "模拟面试进行中";
  }
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
  if (interviewTitle) {
    interviewTitle.textContent = "模拟面试进行中";
  }
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

function resetDrawMode() {
  stopDrawCountdown();
  clearDrawState();
  drawPanel?.classList.add("hidden");
  interviewState.started = false;
  startBtn.disabled = false;
  if (drawDownloadReportBtn) drawDownloadReportBtn.disabled = true;
  setStatus("未开始", false);
}

function resetAll() {
  resetInterview();
  resetDrawMode();
}

function renderDrawMajorList() {
  if (!drawMajorList) return;
  drawMajorList.innerHTML = "";
  drawState.majorQuestions.forEach((question, index) => {
    const li = document.createElement("li");
    const wrapper = document.createElement("label");
    wrapper.className = "draw-major-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.index = String(index);
    checkbox.checked = drawState.selectedMajorIndexes.has(index);

    const content = document.createElement("span");
    content.textContent = question;

    wrapper.appendChild(checkbox);
    wrapper.appendChild(content);
    li.appendChild(wrapper);
    drawMajorList.appendChild(li);
  });
}

function updateDrawMajorHint() {
  const selectedCount = drawState.selectedMajorIndexes.size;
  if (drawMajorHint) {
    drawMajorHint.textContent = `已选择 ${selectedCount} / 3`;
    drawMajorHint.classList.toggle("warn", selectedCount !== 3);
  }
}

async function onDrawEnglish() {
  if (!interviewState.started || interviewState.mode !== "draw") return;
  drawEnglishBtn.disabled = true;
  setStatus("正在抽取英语考题...", false);
  try {
    const question = await fetchDrawEnglishQuestion();
    drawState.englishQuestion = question;
    drawState.recentEnglishQuestions.push(question);
  } catch (error) {
    setStatus(`英语抽题失败：${error.message}`, true);
    drawEnglishBtn.disabled = false;
    return;
  } finally {
    drawEnglishBtn.disabled = false;
  }

  if (drawEnglishText) {
    drawEnglishText.textContent = drawState.englishQuestion;
    drawEnglishText.classList.remove("hidden");
  }
  drawState.englishSubmitted = false;
  drawState.englishAnswer = "";
  if (drawEnglishAnswerInput) {
    drawEnglishAnswerInput.disabled = false;
    drawEnglishAnswerInput.value = "";
    drawEnglishAnswerInput.focus();
  }
  if (drawEnglishSubmitBtn) {
    drawEnglishSubmitBtn.disabled = false;
  }
  if (drawEnglishAnswerStatus) {
    drawEnglishAnswerStatus.textContent = "请先填写并提交英语作答。";
    drawEnglishAnswerStatus.classList.add("warn");
  }
  if (drawMajorBtn) drawMajorBtn.disabled = true;
  if (drawMajorPrompt) drawMajorPrompt.classList.add("hidden");
  if (drawMajorList) drawMajorList.innerHTML = "";
  if (drawMajorHint) drawMajorHint.textContent = "已选择 0 / 3";
  drawState.majorQuestions = [];
  drawState.selectedMajorIndexes.clear();

  drawEnglishPrompt?.classList.remove("hidden");
  appendDrawLog(`英语抽题：${drawState.englishQuestion}\n提示：请先提交英语作答，再进入专业课抽题。`, "teacher");
  setStatus("英语抽题完成：请先提交英语作答", false);
}

async function onSubmitEnglishAnswer() {
  if (!interviewState.started || interviewState.mode !== "draw") return;
  if (!drawState.englishQuestion) {
    setStatus("请先抽取英语考题", true);
    return;
  }
  const answer = String(drawEnglishAnswerInput?.value || "").trim();
  if (!answer) {
    setStatus("请先填写英语作答内容", true);
    return;
  }

  drawState.englishAnswer = answer;
  drawState.englishSubmitted = true;
  if (drawEnglishAnswerInput) {
    drawEnglishAnswerInput.disabled = true;
  }
  if (drawEnglishSubmitBtn) {
    drawEnglishSubmitBtn.disabled = true;
  }
  if (drawEnglishAnswerStatus) {
    drawEnglishAnswerStatus.textContent = "英语作答已提交，正在进行英语评估...";
    drawEnglishAnswerStatus.classList.remove("warn");
  }
  if (drawMajorBtn) drawMajorBtn.disabled = true;
  appendDrawLog(`英语作答：${answer}`, "student");

  try {
    setStatus("英语评估中...", false);
    const englishEval = await evaluateDrawEnglishAnswerByAPI(drawState.englishQuestion, answer);
    appendDrawEnglishEvaluation(englishEval);
    if (drawEnglishAnswerStatus) {
      drawEnglishAnswerStatus.textContent = "英语作答评估完成。";
    }
    if (drawMajorBtn) drawMajorBtn.disabled = false;
    setStatus("英语评估完成：现在可抽取专业课考题", false);
  } catch (error) {
    appendDrawEnglishEvaluation(
      [
        "英语作答评分：5.0/10",
        "点评：已完成作答，但系统未能生成细化批改，请重点检查术语与句间逻辑对应。",
        ENGLISH_TRANSLATION_SPLITTER,
        "参考译文暂时生成失败。建议点击“提交英语作答”重试获取标准译文。",
      ].join("\n")
    );
    if (drawEnglishAnswerStatus) {
      drawEnglishAnswerStatus.textContent = "英语评估未完整生成（已给出临时反馈）。";
      drawEnglishAnswerStatus.classList.add("warn");
    }
    if (drawMajorBtn) drawMajorBtn.disabled = false;
    setStatus(`英语评估异常：${error.message}；已允许进入专业课`, true);
  }
}

async function onDrawMajor() {
  if (!interviewState.started || interviewState.mode !== "draw") return;
  if (!drawState.englishSubmitted) {
    setStatus("请先提交英语作答，再抽取专业课考题", true);
    return;
  }
  drawMajorBtn.disabled = true;
  drawState.selectedMajorIndexes.clear();
  setStatus("正在抽取专业课考题...", false);
  try {
    const questions = await fetchDrawMajorQuestions();
    drawState.majorQuestions = questions.slice(0, 4);
    drawState.recentMajorQuestions.push(...drawState.majorQuestions);
  } catch (error) {
    setStatus(`专业课抽题失败：${error.message}`, true);
    drawMajorBtn.disabled = false;
    return;
  } finally {
    drawMajorBtn.disabled = false;
  }
  drawMajorPrompt?.classList.remove("hidden");
  renderDrawMajorList();
  updateDrawMajorHint();
  if (drawNotesInput) {
    drawNotesInput.disabled = false;
    drawNotesInput.focus();
  }
  appendDrawLog(
    `专业课抽题：\n1) ${drawState.majorQuestions[0]}\n2) ${drawState.majorQuestions[1]}\n3) ${drawState.majorQuestions[2]}\n4) ${drawState.majorQuestions[3]}`,
    "teacher"
  );
  setStatus("专业课抽题完成：请从4题中选择3题作答", false);
}

function onDrawMajorListChange(event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || input.type !== "checkbox") return;
  const index = Number(input.dataset.index);
  if (!Number.isInteger(index)) return;

  if (input.checked) {
    if (drawState.selectedMajorIndexes.size >= 3) {
      input.checked = false;
      setStatus("最多只能选择3道题", true);
      return;
    }
    drawState.selectedMajorIndexes.add(index);
  } else {
    drawState.selectedMajorIndexes.delete(index);
  }
  updateDrawMajorHint();
}

async function onSaveDrawNotes() {
  if (!interviewState.started || interviewState.mode !== "draw") return;
  if (!drawState.englishSubmitted) {
    setStatus("请先提交英语作答", true);
    return;
  }
  const selected = Array.from(drawState.selectedMajorIndexes)
    .sort((a, b) => a - b)
    .map((idx) => drawState.majorQuestions[idx]);
  const notes = (drawNotesInput?.value || "").trim();

  if (selected.length !== 3) {
    setStatus("请先从4道题中准确选择3道", true);
    return;
  }
  if (!notes) {
    setStatus("请先填写专业课统一作答内容", true);
    return;
  }

  const record = [
    "英语作答：",
    drawState.englishAnswer,
    "",
    "专业课已选题：",
    `1) ${selected[0]}`,
    `2) ${selected[1]}`,
    `3) ${selected[2]}`,
    "",
    "专业课统一作答：",
    notes,
  ].join("\n");
  appendDrawLog(record, "student");
  drawState.submitted = true;
  if (drawEnglishBtn) drawEnglishBtn.disabled = true;
  if (drawMajorBtn) drawMajorBtn.disabled = true;
  if (drawEnglishAnswerInput) drawEnglishAnswerInput.disabled = true;
  if (drawEnglishSubmitBtn) drawEnglishSubmitBtn.disabled = true;
  if (drawNotesInput) drawNotesInput.disabled = true;
  if (saveDrawNotesBtn) saveDrawNotesBtn.disabled = true;
  if (drawMajorList) {
    drawMajorList.querySelectorAll('input[type="checkbox"]').forEach((node) => {
      node.disabled = true;
    });
  }
  if (drawNextRoundBtn) drawNextRoundBtn.disabled = false;
  setStatus("抽题模式答案已提交，正在生成评价报告...", false);

  try {
    const report = await generateDrawReportByAPI({
      englishQuestion: drawState.englishQuestion,
      englishAnswer: drawState.englishAnswer,
      selectedQuestions: selected,
      majorAnswer: notes,
    });
    drawState.reportGenerated = true;
    drawState.finalReportText = report;
    if (drawDownloadReportBtn) drawDownloadReportBtn.disabled = false;
    appendEvaluationReportToDrawLog("抽题模式评价报告", report);
    setStatus("抽题模式评价报告已生成", false);
  } catch (error) {
    drawState.reportGenerated = false;
    drawState.finalReportText = "";
    if (drawDownloadReportBtn) drawDownloadReportBtn.disabled = true;
    appendDrawLog(`抽题模式评价报告生成失败：${error.message}`, "score");
    if (saveDrawNotesBtn) saveDrawNotesBtn.disabled = false;
    if (drawNextRoundBtn) drawNextRoundBtn.disabled = true;
    setStatus("报告生成失败，请检查大模型接口配置后重试", true);
  }
}

function onDrawNextRound() {
  if (!interviewState.started || interviewState.mode !== "draw") return;
  if (!drawState.submitted) {
    setStatus("请先提交本轮答案，再进入下一轮", true);
    return;
  }
  stopDrawCountdown();
  clearDrawState({ preserveLog: true });
  resetDrawCountdown();
  if (drawDownloadReportBtn) drawDownloadReportBtn.disabled = true;
  appendDrawLog("系统：已进入下一轮，请先抽取英语考题。", "teacher");
  setStatus("已进入下一轮抽题", false);
}

async function downloadDrawReport() {
  if (interviewState.mode !== "draw") return;
  if (!drawState.reportGenerated || !drawState.finalReportText) {
    setStatus("请先提交并生成抽题评价报告", true);
    return;
  }
  setStatus("正在下载抽题报告...", false);
  downloadReportAsText(`抽题模式评价报告\n${drawState.finalReportText}`);
  setStatus("抽题报告下载完成", false);
}

async function onAnswerSubmit(event) {
  event.preventDefault();
  if (interviewState.mode !== "regular") return;
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

    const targetQuestionStyle = interviewState.round % 2 === 0 ? "analysis" : "foundation";
    const rawReply = await askTeacherByAPI({ mode, userAnswer: answer, targetQuestionStyle });
    const parsed = splitRegularReply(rawReply);
    const followUp = String(parsed.followUpText || "请你补充一个更具体的史实依据。").replace(/^老师：?/, "").trim();
    const referenceText = parsed.referenceText;
    const examiner = pickExaminer(interviewState.phase === "intro" ? "first_question" : "follow_up");
    showSceneSpeech(examiner.id, followUp);
    appendTeacherMessageWithReference(formatTeacherLine(examiner, followUp), referenceText);

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
        ? "first_topic_question"
        : isTeacherPremiseError(answer)
          ? "fix_and_switch_question"
          : isNoAnswerIntent(answer)
            ? "switch_question"
            : "follow_up";
    const fallbackRaw = buildFallbackRegularReply(fallbackMode, answer);
    const fallbackParsed = splitRegularReply(fallbackRaw);
    const fallbackText = String(fallbackParsed.followUpText || "我们继续下一题。").replace(/^老师：?/, "").trim();
    const examiner = pickExaminer(interviewState.phase === "intro" ? "first_question" : "follow_up");
    showSceneSpeech(examiner.id, fallbackText);
    appendTeacherMessageWithReference(formatTeacherLine(examiner, fallbackText), fallbackParsed.referenceText);
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
  if (interviewState.mode !== "regular") return;
  if (!interviewState.started) return;
  if (interviewState.reportGenerated) return;

  setInputDisabled(true);
  finishBtn.disabled = true;
  stopCountdown();
  setStatus("正在生成整场复试报告...", false);

  try {
    const report = await generateReportByAPI();
    appendRegularMarkdownReportToChat("整场复试报告", report);
    interviewState.reportGenerated = true;
    interviewState.finalReportText = report;
    setDownloadDisabled(false);
    setStatus("复试已结束，报告已生成", false);
  } catch (error) {
    appendMessage("score", `整场复试报告生成失败：${error.message}`);
    interviewState.reportGenerated = false;
    interviewState.finalReportText = "";
    setDownloadDisabled(true);
    setStatus("报告生成失败，请检查大模型接口配置后重试", true);
    finishBtn.disabled = false;
    answerInput.disabled = false;
    sendBtn.disabled = false;
  } finally {
    if (interviewState.reportGenerated) {
      answerInput.disabled = true;
      sendBtn.disabled = true;
    }
  }
}

async function downloadReport() {
  if (interviewState.mode !== "regular") return;
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
resetBtn.addEventListener("click", resetAll);
finishBtn.addEventListener("click", finishInterview);
downloadReportBtn.addEventListener("click", downloadReport);
voiceBtn.addEventListener("click", toggleVoiceInput);
answerForm.addEventListener("submit", onAnswerSubmit);
answerInput.addEventListener("input", resizeAnswerInput);
answerInput.addEventListener("keydown", onAnswerInputKeydown);
modeRegularBtn?.addEventListener("click", () => switchMode("regular"));
modeDrawBtn?.addEventListener("click", () => switchMode("draw"));
sidebarRegularBtn?.addEventListener("click", () => switchMode("regular"));
sidebarDrawBtn?.addEventListener("click", () => switchMode("draw"));
drawResetBtn?.addEventListener("click", resetAll);
drawDownloadReportBtn?.addEventListener("click", downloadDrawReport);
drawEnglishBtn?.addEventListener("click", onDrawEnglish);
drawEnglishSubmitBtn?.addEventListener("click", onSubmitEnglishAnswer);
drawMajorBtn?.addEventListener("click", onDrawMajor);
drawMajorList?.addEventListener("change", onDrawMajorListChange);
saveDrawNotesBtn?.addEventListener("click", onSaveDrawNotes);
drawNextRoundBtn?.addEventListener("click", onDrawNextRound);
drawTimerStartBtn?.addEventListener("click", startDrawCountdown);
drawTimerResetBtn?.addEventListener("click", resetDrawCountdown);
drawTimerMinutes?.addEventListener("change", resetDrawCountdown);
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
loadMode();
setVoiceButtonLabel();
setStatus("未开始", false);
resizeAnswerInput();
renderCommitteeGrid();
resetCountdown();
renderDrawCountdown();
setCurrentQuestion("请点击“开始复试”进入第一题。");
syncVoiceHint();
apiKeyInput.addEventListener("input", syncVoiceHint);
baseUrlInput.addEventListener("input", syncVoiceHint);
window.addEventListener("resize", () => {
  positionSpeechBubble(interviewState.activeRoleId);
});
