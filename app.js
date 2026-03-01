const STORAGE_KEY = "solides-volume-9e-progress";
const ADMIN_SESSION_KEY = "solides-volume-9e-admin-session";
const PREVIEW_CONFIG_KEY = "solides-volume-9e-preview-config";
const MODULE_IDS = [
  "01-vocabulaire",
  "02-polyedres",
  "03-patrons",
  "04-volume",
  "05-prismes",
  "evaluation",
];

const DEFAULT_CONFIG = {
  teacherCode: "CHANGE-MOI-9E",
  releaseDates: {
    "01-vocabulaire": "2026-03-02",
    "02-polyedres": "2026-03-03",
    "03-patrons": "2026-03-04",
    "04-volume": "2026-03-05",
    "05-prismes": "2026-03-06",
    evaluation: "2026-03-09",
  },
  moduleLabels: {
    "01-vocabulaire": "Module 1 : Vocabulaire des solides",
    "02-polyedres": "Module 2 : Polyedres",
    "03-patrons": "Module 3 : Patrons",
    "04-volume": "Module 4 : Volume",
    "05-prismes": "Module 5 : Prismes droits",
    evaluation: "Evaluation finale",
  },
};

function createDefaultState() {
  const modules = {};
  MODULE_IDS.forEach((id) => {
    modules[id] = {
      bestScore: 0,
      rawScore: 0,
      totalQuestions: 0,
      validated: false,
      homework: false,
      completedAt: "",
      lastAttemptAt: "",
    };
  });

  return {
    student: {
      name: "",
      className: "",
    },
    modules,
    updatedAt: "",
  };
}

function deepMergeConfig(base, extra) {
  return {
    ...base,
    ...extra,
    releaseDates: {
      ...base.releaseDates,
      ...(extra?.releaseDates || {}),
    },
    moduleLabels: {
      ...base.moduleLabels,
      ...(extra?.moduleLabels || {}),
    },
  };
}

function loadPreviewConfig() {
  try {
    const saved = localStorage.getItem(PREVIEW_CONFIG_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    return {};
  }
}

function getConfig() {
  if (!window.__solidesConfig) {
    const baseConfig = deepMergeConfig(DEFAULT_CONFIG, window.SOLIDES_CONFIG || {});
    window.__solidesConfig = deepMergeConfig(baseConfig, loadPreviewConfig());
  }
  return window.__solidesConfig;
}

function savePreviewConfig(configPatch) {
  localStorage.setItem(PREVIEW_CONFIG_KEY, JSON.stringify(configPatch));
  window.__solidesConfig = null;
}

function clearPreviewConfig() {
  localStorage.removeItem(PREVIEW_CONFIG_KEY);
  window.__solidesConfig = null;
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return createDefaultState();
    }
    const parsed = JSON.parse(saved);
    const merged = createDefaultState();
    return {
      ...merged,
      ...parsed,
      student: {
        ...merged.student,
        ...(parsed.student || {}),
      },
      modules: Object.fromEntries(
        MODULE_IDS.map((id) => [id, { ...merged.modules[id], ...(parsed.modules?.[id] || {}) }]),
      ),
    };
  } catch (error) {
    return createDefaultState();
  }
}

function saveState(state) {
  state.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatDate(dateString) {
  if (!dateString) return "Pas encore";
  return new Intl.DateTimeFormat("fr-CH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateString));
}

function formatReleaseDate(dateString) {
  if (!dateString) return "Date non definie";
  const [year, month, day] = dateString.split("-").map(Number);
  return new Intl.DateTimeFormat("fr-CH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeNumber(value) {
  const sanitized = String(value).trim().replace(",", ".");
  if (!sanitized) return null;
  const parsed = Number(sanitized);
  return Number.isFinite(parsed) ? parsed : null;
}

function getState() {
  if (!window.__solidesState) {
    window.__solidesState = loadState();
  }
  return window.__solidesState;
}

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isModuleUnlocked(moduleId) {
  const config = getConfig();
  const releaseDate = config.releaseDates[moduleId];
  if (!releaseDate) return true;
  return getTodayKey() >= releaseDate;
}

function getFirstUnlockedModule() {
  return MODULE_IDS.find((moduleId) => isModuleUnlocked(moduleId)) || MODULE_IDS[0];
}

function setStudentProfile() {
  const state = getState();
  const nameField = document.querySelector("#student-name");
  const classField = document.querySelector("#student-class");
  const nameDisplay = document.querySelector("[data-student-name-display]");
  const classDisplay = document.querySelector("[data-student-class-display]");

  if (nameField) {
    nameField.value = state.student.name;
  }

  if (classField) {
    classField.value = state.student.className;
  }

  if (nameDisplay) {
    nameDisplay.textContent = state.student.name || "Pas encore renseigne";
  }

  if (classDisplay) {
    classDisplay.textContent = state.student.className || "Pas encore renseignee";
  }
}

function hasStudentProfile() {
  const state = getState();
  return Boolean(state.student.name && state.student.className);
}

function updateLandingUI() {
  if (document.body.dataset.page !== "home") return;
  const landingScreen = document.querySelector("[data-landing-screen]");
  const homeContent = document.querySelector("[data-home-content]");
  if (!landingScreen || !homeContent) return;
  const ready = hasStudentProfile();
  landingScreen.hidden = ready;
  homeContent.hidden = !ready;
}

function setupLandingForm() {
  if (document.body.dataset.page !== "home") return;
  const form = document.querySelector("[data-landing-form]");
  const feedback = document.querySelector("[data-landing-feedback]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const nameField = form.querySelector("#student-name");
    const classField = form.querySelector("#student-class");
    const name = nameField?.value.trim() || "";
    const className = classField?.value.trim() || "";

    if (!name || !className) {
      if (feedback) {
        feedback.textContent = "Merci d'indiquer ton prenom et ta classe.";
      }
      return;
    }

    const state = getState();
    state.student.name = name;
    state.student.className = className;
    saveState(state);
    setStudentProfile();
    updateLandingUI();
  });
}

function updateProgressUI() {
  const state = getState();
  const config = getConfig();
  const completed = MODULE_IDS.filter((id) => state.modules[id].validated).length;
  document.querySelectorAll("[data-progress-count]").forEach((node) => {
    node.textContent = `${completed}/6`;
  });

  document.querySelectorAll("[data-last-update]").forEach((node) => {
    node.textContent = formatDate(state.updatedAt);
  });

  document.querySelectorAll("[data-module-card]").forEach((card) => {
    const id = card.dataset.moduleCard;
    const moduleState = state.modules[id];
    if (!moduleState) return;
    const unlocked = isModuleUnlocked(id);
    card.hidden = !unlocked;

    const statusNode = card.querySelector("[data-card-status]");
    const scoreNode = card.querySelector("[data-card-score]");
    const dateNode = card.querySelector("[data-card-date]");
    if (statusNode) {
      statusNode.textContent = moduleState.validated ? "Valide" : "Disponible";
      statusNode.className = `status-chip ${moduleState.validated ? "validated" : "pending"}`;
    }
    if (scoreNode) {
      scoreNode.textContent = moduleState.totalQuestions
        ? `${moduleState.rawScore}/${moduleState.totalQuestions}`
        : "Pas de score";
    }
    if (dateNode) {
      dateNode.textContent = moduleState.lastAttemptAt
        ? `Dernier essai : ${formatDate(moduleState.lastAttemptAt)}`
        : "Pas encore de tentative";
    }
  });

  const availableGrid = document.querySelector("[data-modules-grid]");
  const emptyNode = document.querySelector("[data-no-modules]");
  if (availableGrid && emptyNode) {
    const visibleCards = [...availableGrid.querySelectorAll("[data-module-card]")].filter((card) => !card.hidden);
    emptyNode.hidden = visibleCards.length > 0;
  }

  const bodyModuleId = document.body.dataset.module;
  if (bodyModuleId && state.modules[bodyModuleId]) {
    const moduleState = state.modules[bodyModuleId];
    const statusNode = document.querySelector("[data-module-status]");
    if (statusNode) {
      if (!isModuleUnlocked(bodyModuleId)) {
        statusNode.textContent = `Disponible le ${formatReleaseDate(config.releaseDates[bodyModuleId])}`;
      } else if (moduleState.validated) {
        statusNode.textContent = bodyModuleId === "evaluation" ? "Evaluation validee" : "Module valide";
      } else {
        statusNode.textContent =
          bodyModuleId === "evaluation"
            ? "Validation : 14/20 minimum"
            : "Validation : 70% au quiz ou devoir ludique";
      }
    }
    const scoreNode = document.querySelector("[data-module-score]");
    if (scoreNode) {
      scoreNode.textContent = moduleState.totalQuestions
        ? `${moduleState.rawScore}/${moduleState.totalQuestions} (${Math.round(moduleState.bestScore)}%)`
        : "Pas encore de score";
    }
    const homeworkButton = document.querySelector("[data-homework-toggle]");
    if (homeworkButton) {
      homeworkButton.textContent = moduleState.homework
        ? "Devoir ludique enregistre"
        : "J'ai fait le devoir ludique";
      homeworkButton.setAttribute("aria-pressed", moduleState.homework ? "true" : "false");
    }
  }

  const startLink = document.querySelector("[data-start-link]");
  if (startLink) {
    const firstUnlocked = getFirstUnlockedModule();
    startLink.href = firstUnlocked === "evaluation" ? "evaluation.html" : `lessons/${firstUnlocked}.html`;
  }
}

function populateSchedule() {
  const container = document.querySelector("[data-schedule-list]");
  if (!container) return;
  const config = getConfig();
  container.innerHTML = "";
  MODULE_IDS.forEach((moduleId) => {
    const note = document.createElement("div");
    note.className = "note-box";
    const stateLabel = isModuleUnlocked(moduleId) ? "Ouvert" : "A venir";
    note.innerHTML = `<strong>${config.moduleLabels[moduleId]}</strong><br />${formatReleaseDate(
      config.releaseDates[moduleId],
    )} <span class="muted">(${stateLabel})</span>`;
    container.appendChild(note);
  });
}

function guardLockedModuleAccess() {
  const moduleId = document.body.dataset.module;
  if (!moduleId || isModuleUnlocked(moduleId)) return;
  const main = document.querySelector("main");
  const hero = main?.querySelector(".hero");
  if (!main || !hero) return;

  const lockSection = document.createElement("section");
  lockSection.className = "card";
  lockSection.innerHTML = `
    <p class="eyebrow">Module verrouille</p>
    <h2>Pas encore disponible</h2>
    <div class="warning-box">
      <p>Ce contenu s'ouvre le <strong>${formatReleaseDate(getConfig().releaseDates[moduleId])}</strong>.</p>
      <p>Reviens a la date prevue ou retourne a l'accueil pour voir les modules deja ouverts.</p>
    </div>
    <div class="module-actions">
      <a class="btn" href="${document.body.dataset.page === "evaluation" ? "index.html" : "../index.html"}">Retour a l'accueil</a>
    </div>
  `;
  hero.insertAdjacentElement("afterend", lockSection);

  [...main.querySelectorAll(":scope > section")].forEach((section) => {
    if (section !== hero && section !== lockSection) {
      section.hidden = true;
    }
  });
}

function setHomeworkToggle() {
  const moduleId = document.body.dataset.module;
  if (!moduleId || moduleId === "evaluation" || !isModuleUnlocked(moduleId)) return;
  const button = document.querySelector("[data-homework-toggle]");
  if (!button) return;
  button.addEventListener("click", () => {
    const state = getState();
    const moduleState = state.modules[moduleId];
    moduleState.homework = !moduleState.homework;
    moduleState.validated = moduleState.homework || moduleState.bestScore >= 70;
    moduleState.completedAt = moduleState.validated ? new Date().toISOString() : "";
    saveState(state);
    updateProgressUI();
  });
}

function revealSummary(target, message, isSuccess) {
  target.innerHTML = `<div class="status-chip ${isSuccess ? "validated" : "pending"}">${message}</div>`;
}

function getSingleAnswer(question) {
  const checked = question.querySelector('input[type="radio"]:checked');
  return checked ? checked.value : "";
}

function getTextAnswer(question) {
  const input = question.querySelector("input[type='text'], input[type='number'], textarea");
  return input ? input.value : "";
}

function getAnswerDisplay(question) {
  if (question.dataset.answerDisplay) {
    return question.dataset.answerDisplay;
  }
  if (question.dataset.type === "single") {
    const correctInput = question.querySelector(`input[value="${question.dataset.answer}"]`);
    if (correctInput) {
      const label = correctInput.closest("label");
      return label ? label.textContent.trim() : question.dataset.answer;
    }
  }
  return question.dataset.answer.replaceAll("|", " ou ");
}

function checkQuestion(question) {
  const type = question.dataset.type;
  const expected = question.dataset.answer;
  let isCorrect = false;
  let userAnswer = "";

  if (type === "single") {
    userAnswer = getSingleAnswer(question);
    isCorrect = userAnswer === expected;
  }

  if (type === "number") {
    userAnswer = getTextAnswer(question);
    const expectedValue = normalizeNumber(expected);
    const givenValue = normalizeNumber(userAnswer);
    const tolerance = normalizeNumber(question.dataset.tolerance) ?? 0.0001;
    isCorrect = givenValue !== null && expectedValue !== null && Math.abs(givenValue - expectedValue) <= tolerance;
  }

  if (type === "text") {
    userAnswer = getTextAnswer(question);
    const expectedAnswers = expected.split("|").map((item) => normalizeText(item));
    isCorrect = expectedAnswers.includes(normalizeText(userAnswer));
  }

  question.classList.remove("correct", "incorrect");
  question.classList.add(isCorrect ? "correct" : "incorrect");
  const feedback = question.querySelector(".feedback");
  if (feedback) {
    feedback.textContent = isCorrect
      ? "Correct."
      : `A revoir. Reponse attendue : ${getAnswerDisplay(question)}.`;
  }
  return isCorrect;
}

function setupQuizzes() {
  document.querySelectorAll("[data-quiz]").forEach((quiz) => {
    const form = quiz.querySelector(".quiz-form");
    const summary = quiz.querySelector("[data-quiz-summary]");
    const moduleId = quiz.dataset.moduleId;
    const passScore = normalizeNumber(quiz.dataset.passScore) ?? 70;
    if (!form || !summary || !moduleId || !isModuleUnlocked(moduleId)) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const state = getState();
      const questions = [...form.querySelectorAll(".quiz-question")];
      let correct = 0;
      questions.forEach((question) => {
        if (checkQuestion(question)) correct += 1;
      });

      const percent = questions.length ? (correct / questions.length) * 100 : 0;
      const moduleState = state.modules[moduleId];
      moduleState.rawScore = Math.max(moduleState.rawScore, correct);
      moduleState.totalQuestions = questions.length;
      moduleState.bestScore = Math.max(moduleState.bestScore, percent);
      moduleState.lastAttemptAt = new Date().toISOString();
      moduleState.validated = moduleState.homework || moduleState.bestScore >= passScore;
      if (moduleState.validated && !moduleState.completedAt) {
        moduleState.completedAt = new Date().toISOString();
      }
      saveState(state);

      const label = moduleId === "evaluation" ? `${correct}/20` : `${correct}/${questions.length}`;
      const message = moduleState.validated
        ? `Score : ${label}. Validation obtenue.`
        : `Score : ${label}. Il faut encore atteindre ${Math.ceil(passScore)}%.`;
      revealSummary(summary, message, moduleState.validated);
      updateProgressUI();
    });

    const resetButton = quiz.querySelector("[data-reset-quiz]");
    if (resetButton) {
      resetButton.addEventListener("click", () => {
        form.reset();
        form.querySelectorAll(".quiz-question").forEach((question) => {
          question.classList.remove("correct", "incorrect");
          const feedback = question.querySelector(".feedback");
          if (feedback) feedback.textContent = "";
        });
        summary.innerHTML = "";
      });
    }
  });
}

function isAdminPage() {
  return ["teacher", "settings"].includes(document.body.dataset.page || "");
}

function isAdminAuthorized() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
}

function setupAdminGate() {
  if (!isAdminPage()) return true;
  const gate = document.querySelector("[data-admin-gate]");
  const content = document.querySelector("[data-admin-content]");
  if (!gate || !content) return true;

  const authorized = isAdminAuthorized();
  gate.hidden = authorized;
  content.hidden = !authorized;

  const form = gate.querySelector("form");
  const feedback = gate.querySelector("[data-admin-feedback]");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const codeField = form.querySelector("input");
      const code = codeField?.value.trim() || "";
      if (code === getConfig().teacherCode) {
        sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
        gate.hidden = true;
        content.hidden = false;
        if (document.body.dataset.page === "settings") {
          setupSettingsPage();
        }
      } else if (feedback) {
        feedback.textContent = "Code incorrect.";
      }
    });
  }
  return authorized;
}

function buildConfigSnippet(config) {
  return `window.SOLIDES_CONFIG = ${JSON.stringify(config, null, 2)};`;
}

function setupSettingsPage() {
  if (document.body.dataset.page !== "settings" || !isAdminAuthorized()) return;
  const config = getConfig();
  const form = document.querySelector("[data-settings-form]");
  const codeBox = document.querySelector("[data-config-preview]");
  const status = document.querySelector("[data-settings-status]");
  const resetButton = document.querySelector("[data-reset-settings]");
  if (!form || !codeBox || !status) return;

  form.querySelectorAll("input[type='date']").forEach((input) => {
    input.value = config.releaseDates[input.name] || "";
  });

  const teacherCodeField = form.querySelector("input[name='teacherCode']");
  if (teacherCodeField) {
    teacherCodeField.value = config.teacherCode || "";
  }

  codeBox.textContent = buildConfigSnippet(config);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const updatedConfig = {
      teacherCode: teacherCodeField?.value.trim() || DEFAULT_CONFIG.teacherCode,
      releaseDates: Object.fromEntries(
        [...form.querySelectorAll("input[type='date']")].map((input) => [input.name, input.value]),
      ),
    };
    savePreviewConfig(updatedConfig);
    const merged = getConfig();
    codeBox.textContent = buildConfigSnippet(merged);
    status.textContent =
      "Apercu local mis a jour. Pour les eleves sur GitHub Pages, recopiez ces valeurs dans config.js puis republiez.";
    populateSchedule();
    updateProgressUI();
  });

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      clearPreviewConfig();
      window.location.reload();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  getConfig();
  getState();
  const adminReady = setupAdminGate();
  setStudentProfile();
  setupLandingForm();
  updateLandingUI();
  populateSchedule();
  guardLockedModuleAccess();
  setHomeworkToggle();
  setupQuizzes();
  updateProgressUI();
  if (adminReady) {
    setupSettingsPage();
  }
});
