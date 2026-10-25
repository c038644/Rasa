const copy = {
  en: {
    languageLabel: "Language",
    storyAlt: "A quiet path through the forest",
    imageAlt: "A sunlit path winding through a green forest",
    imageCredit: "Photo: Unsplash",
    private: "Your answers stay on this device",
    storyEyebrow: "A better starting point",
    storyQuote: "A little clarity can change the whole path.",
    storyCaption: "Take a moment. We’ll find a useful next step together.",
    introEyebrow: "A short check-in · about 1 minute",
    heading: "Let’s find your next step.",
    intro: "A few thoughtful questions will help us understand what matters to you right now.",
    back: "Back",
    continue: "Continue",
    footer: "Your responses are private and never leave this page.",
    completeEyebrow: "Your starting point",
    completeTitle: "Thanks for sharing.",
    completePrefix: "You’re looking to focus on",
    completeSuffix: "Your answers give us a clearer picture of what would help.",
    restart: "Start again",
    selectError: "Choose an answer to continue.",
    stepLabel: "Question",
    firstQuestion: "What would you like to focus on?",
    firstHint: "Choose the one that feels closest.",
    branches: {
      career: {
        question: "What kind of growth matters most to you?",
        hint: "We’ll tailor the next step to your priorities.",
        answers: ["Build confidence in my current role", "Explore a new role or career", "Learn a specific skill"]
      },
      project: {
        question: "When are you hoping to get started?",
        hint: "A rough sense of timing is enough.",
        answers: ["As soon as possible", "In the next few months", "I’m still exploring"]
      },
      support: {
        question: "What would be most helpful right now?",
        hint: "Pick the kind of support you would value most.",
        answers: ["Practical advice", "Useful resources", "A conversation with someone"]
      }
    },
    lastQuestions: ["What would a good outcome look like for you?", "How much time can you set aside each week?", "Anything else you’d like us to keep in mind?"],
    lastAnswers: ["A clear plan I can act on", "A few options to consider", "More confidence about what comes next"],
    lastHints: ["Think about what would make this worthwhile.", "A realistic estimate is perfect.", "Choose the answer that feels most useful."],
    firstAnswers: ["Grow my career", "Plan a project", "Find support"],
    summaryLabels: ["Your focus", "Your next step", "What would help"],
    finalAnswerFor: (index) => [
      ["A clear plan I can act on", "A few options to consider", "More confidence about what comes next"][index],
      ["A realistic rhythm", "Room to make progress", "A little space to explore"][index],
      ["Practical direction", "Helpful resources", "A fresh perspective"][index]
    ]
  },
  lt: {
    languageLabel: "Kalba",
    storyAlt: "Ramus miško takas",
    imageAlt: "Saulės nušviestas takas žaliame miške",
    imageCredit: "Nuotrauka: Unsplash",
    private: "Jūsų atsakymai lieka šiame įrenginyje",
    storyEyebrow: "Gera pradžia",
    storyQuote: "Šiek tiek aiškumo gali pakeisti visą kelią.",
    storyCaption: "Skirkite akimirką. Kartu rasime tinkamą kitą žingsnį.",
    introEyebrow: "Trumpa apklausa · apie 1 min.",
    heading: "Atraskime kitą jūsų žingsnį.",
    intro: "Keli klausimai padės suprasti, kas jums šiuo metu svarbiausia.",
    back: "Atgal",
    continue: "Tęsti",
    footer: "Jūsų atsakymai yra privatūs ir nepalieka šio puslapio.",
    completeEyebrow: "Jūsų pradžios taškas",
    completeTitle: "Ačiū, kad pasidalijote.",
    completePrefix: "Norite susitelkti į sritį",
    completeSuffix: "Jūsų atsakymai padeda geriau suprasti, kas jums būtų naudinga.",
    restart: "Pradėti iš naujo",
    selectError: "Norėdami tęsti, pasirinkite atsakymą.",
    stepLabel: "Klausimas",
    firstQuestion: "Kam norėtumėte skirti dėmesio?",
    firstHint: "Pasirinkite artimiausią variantą.",
    branches: {
      career: {
        question: "Kokio profesinio augimo labiausiai siekiate?",
        hint: "Kitas žingsnis priklausys nuo jūsų prioritetų.",
        answers: ["Labiau pasitikėti savimi dabartiniame darbe", "Atrasti naują darbą ar karjeros kryptį", "Išmokti konkretų įgūdį"]
      },
      project: {
        question: "Kada norėtumėte pradėti?",
        hint: "Užtenka apytiksliai įvertinti laiką.",
        answers: ["Kuo greičiau", "Per artimiausius kelis mėnesius", "Kol kas tik domiuosi galimybėmis"]
      },
      support: {
        question: "Kas jums šiuo metu būtų naudingiausia?",
        hint: "Pasirinkite labiausiai vertinamą pagalbos būdą.",
        answers: ["Praktinis patarimas", "Naudingi ištekliai", "Pokalbis su kitu žmogumi"]
      }
    },
    lastQuestions: ["Kaip atrodytų jums tinkamas rezultatas?", "Kiek laiko galėtumėte skirti per savaitę?", "Į ką dar norėtumėte atkreipti dėmesį?"],
    lastAnswers: ["Aiškus planas, kurio galėčiau imtis", "Keletas galimų variantų", "Daugiau užtikrintumo dėl tolesnių žingsnių"],
    lastHints: ["Pagalvokite, kas šią patirtį paverstų prasminga.", "Tiks ir apytikslis įvertinimas.", "Pasirinkite naudingiausią variantą."],
    firstAnswers: ["Tobulinti karjerą", "Planuoti projektą", "Rasti pagalbą"],
    summaryLabels: ["Jūsų tikslas", "Kitas žingsnis", "Kas padėtų"],
    finalAnswerFor: (index) => [
      ["Aiškus veiksmų planas", "Keletas variantų apsvarstymui", "Daugiau pasitikėjimo dėl tolesnių žingsnių"][index],
      ["Realistiškas tempas", "Galimybė daryti pažangą", "Laiko galimybėms patyrinėti"][index],
      ["Praktinė kryptis", "Naudingi ištekliai", "Naujas požiūris"][index]
    ]
  }
};

const paths = {
  career: ["career", 0, 0],
  project: ["project", 1, 1],
  support: ["support", 2, 2]
};

const state = { language: "en", step: 0, answers: [] };
const form = document.querySelector("#survey-form");
const answerList = document.querySelector("#answer-list");
const questionTitle = document.querySelector("#question-title");
const questionHint = document.querySelector("#question-hint");
const errorMessage = document.querySelector("#form-error");
const progress = document.querySelector(".progress-track");

function currentCopy() {
  return copy[state.language];
}

function renderStaticCopy() {
  const languageCopy = currentCopy();
  document.documentElement.lang = state.language;
  document.title = state.language === "lt" ? "Bendra kryptis | Kitas žingsnis" : "Common Ground | Find your next step";
  document.querySelector(".language-switch").setAttribute("aria-label", languageCopy.languageLabel);
  document.querySelector(".story-panel").setAttribute("aria-label", languageCopy.storyAlt);
  document.querySelector(".story-panel img").alt = languageCopy.imageAlt;
  document.querySelector(".image-credit").textContent = languageCopy.imageCredit;
  document.querySelectorAll("[data-copy]").forEach((element) => {
    const value = languageCopy[element.dataset.copy];
    if (typeof value === "string") element.textContent = value;
  });
  document.querySelectorAll("[data-language]").forEach((button) => {
    const active = button.dataset.language === state.language;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  progress.setAttribute("aria-label", languageCopy.stepLabel);
  if (state.step < 3) renderQuestion();
  else renderCompletion();
}

function questionForStep(step) {
  const languageCopy = currentCopy();
  if (step === 0) {
    return { title: languageCopy.firstQuestion, hint: languageCopy.firstHint, answers: languageCopy.firstAnswers, keys: ["career", "project", "support"] };
  }
  const branchKey = state.answers[0]?.key;
  const branch = languageCopy.branches[branchKey];
  if (step === 1) {
    return { title: branch.question, hint: branch.hint, answers: branch.answers, keys: ["first", "second", "third"] };
  }
  const path = paths[branchKey];
  return {
    title: languageCopy.lastQuestions[path[1]],
    hint: languageCopy.lastHints[path[1]],
    answers: languageCopy.lastAnswers,
    keys: ["first", "second", "third"]
  };
}

function renderQuestion() {
  const languageCopy = currentCopy();
  const question = questionForStep(state.step);
  questionTitle.textContent = question.title;
  questionHint.textContent = question.hint;
  answerList.replaceChildren();
  question.answers.forEach((answer, index) => {
    const label = document.createElement("label");
    label.className = "answer-option";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = `question-${state.step}`;
    input.value = question.keys[index];
    input.checked = state.answers[state.step]?.key === question.keys[index];
    const text = document.createElement("span");
    text.textContent = answer;
    const arrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    arrow.setAttribute("viewBox", "0 0 20 20");
    arrow.setAttribute("aria-hidden", "true");
    const arrowPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arrowPath.setAttribute("d", "M4 10h11m-4-4 4 4-4 4");
    arrow.append(arrowPath);
    label.append(input, text, arrow);
    answerList.append(label);
  });
  document.querySelector("#step-current").textContent = String(state.step + 1).padStart(2, "0");
  document.querySelector("#step-total").textContent = "03";
  progress.setAttribute("aria-valuenow", String(state.step + 1));
  progress.querySelector(".progress-fill").style.width = `${((state.step + 1) / 3) * 100}%`;
  document.querySelector("#back-button").disabled = state.step === 0;
  document.querySelector("#continue-button span").textContent = state.step === 2 ? (state.language === "lt" ? "Peržiūrėti" : "See summary") : languageCopy.continue;
  errorMessage.hidden = true;
}

function answerForStep(step) {
  const languageCopy = currentCopy();
  if (step === 0) return languageCopy.firstAnswers[paths[state.answers[0].key][1]];
  const branchKey = state.answers[0].key;
  if (step === 1) return languageCopy.branches[branchKey].answers[languageCopy.branches[branchKey].answers.findIndex((_, index) => ["first", "second", "third"][index] === state.answers[1].key)];
  return languageCopy.finalAnswerFor(paths[branchKey][2])[ ["first", "second", "third"].indexOf(state.answers[2].key) ];
}

function renderCompletion() {
  const languageCopy = currentCopy();
  const focusAnswer = answerForStep(0);
  document.querySelector("#completion-copy").textContent = `${languageCopy.completePrefix} „${focusAnswer}“. ${languageCopy.completeSuffix}`;
  const summary = document.querySelector("#answer-summary");
  summary.replaceChildren();
  state.answers.forEach((answer, index) => {
    const row = document.createElement("div");
    row.className = "summary-row";
    const label = document.createElement("span");
    label.className = "summary-question";
    label.textContent = languageCopy.summaryLabels[index];
    const value = document.createElement("span");
    value.className = "summary-answer";
    value.textContent = answerForStep(index);
    row.append(label, value);
    summary.append(row);
  });
  form.hidden = true;
  document.querySelector(".intro-row").hidden = true;
  progress.hidden = true;
  document.querySelector("#completion").hidden = false;
  document.querySelector("#step-current").textContent = "03";
  document.querySelector("#step-total").textContent = "03";
}

function showSurvey() {
  form.hidden = false;
  document.querySelector(".intro-row").hidden = false;
  progress.hidden = false;
  document.querySelector("#completion").hidden = true;
  renderQuestion();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const selected = answerList.querySelector("input:checked");
  if (!selected) {
    errorMessage.textContent = currentCopy().selectError;
    errorMessage.hidden = false;
    return;
  }
  state.answers[state.step] = { key: selected.value };
  state.answers.length = state.step + 1;
  if (state.step === 2) {
    state.step = 3;
    renderCompletion();
  } else {
    state.step += 1;
    renderQuestion();
  }
});

document.querySelector("#back-button").addEventListener("click", () => {
  if (state.step > 0) {
    state.step -= 1;
    renderQuestion();
  }
});

document.querySelector("#restart-button").addEventListener("click", () => {
  state.step = 0;
  state.answers = [];
  showSurvey();
});

document.querySelectorAll("[data-language]").forEach((button) => {
  button.addEventListener("click", () => {
    state.language = button.dataset.language;
    renderStaticCopy();
  });
});

renderStaticCopy();
