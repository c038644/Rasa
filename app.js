const copy = {
  en: {
    languageLabel: "Language",
    storyAlt: "London street at golden hour",
    imageAlt: "A lively London street in the evening",
    imageCredit: "Photo: Unsplash",
    private: "No sign-up needed",
    storyEyebrow: "Make a London day of it",
    storyQuote: "Good plans are better when shared.",
    storyCaption: "Pick a mood. We’ll find your kind of get-together.",
    introEyebrow: "A quick activity finder · about 1 minute",
    heading: "What sounds fun in London?",
    intro: "Choose an idea and we’ll help shape it into a good outing with your people.",
    back: "Back",
    continue: "Continue",
    footer: "When you finish, your choices are emailed to the survey organiser.",
    completeEyebrow: "Your London plan",
    completeTitle: "That sounds like a good time.",
    completeSuffix: "Here’s your idea. Check with the venue for current details before you go.",
    recommendationEyebrow: "Your activity idea",
    venueLink: "Visit venue website",
    emailSending: "Emailing your choices to the organiser…",
    emailSent: "Your choices have been emailed to the organiser.",
    emailFailed: "We couldn’t send your choices. Please try again.",
    emailApiUrlMissing: "The email API URL is missing. Set this page’s survey-api-base-url to your Render service URL.",
    emailOriginRejected: "Render rejected this website’s origin. Set FRONTEND_ORIGIN to your GitHub Pages origin.",
    emailServerNotConfigured: "Render is missing email configuration. Check its environment settings.",
    emailMissingVariables: "Render is missing these settings: {variables}. Add them under the Web Service’s Environment settings.",
    emailInvalidVariables: "These Render settings need correction: {variables}.",
    emailResendFailed: "Resend could not deliver your choices. Check the Resend configuration.",
    emailResendApiKey: "Resend rejected RESEND_API_KEY. Check that the key is valid and active.",
    emailResendPermission: "Resend denied this API key’s permissions. Check its access settings.",
    emailResendTestRecipient: "Resend’s test sender can only deliver to the Resend account owner. Verify a sender domain to send to your Yahoo inbox.",
    emailResendDomain: "The domain in RESEND_FROM_EMAIL is not verified in Resend. Verify it, then use a sender address on that domain.",
    emailResendApiKeyInactive: "This Resend API key is inactive. Create or activate a key in the Resend dashboard.",
    emailResendApiKeySuspended: "Resend suspended this API key. Check the Resend dashboard or contact Resend support.",
    emailResendSender: "Resend rejected the sender or recipient. Verify the sender domain; test accounts can only send to the account owner’s address.",
    emailResendRate: "Resend rate-limited the request. Check your account quota and retry later.",
    emailResendUnavailable: "Resend is temporarily unavailable. Retry later.",
    emailResendConnection: "Render could not reach Resend over HTTPS. Check the API endpoint and outbound HTTPS access.",
    emailResendRejected: "Resend rejected the request. Check the sender address and Resend account configuration.",
    emailProviderStatus: "Resend HTTP status: {status}.",
    emailProviderErrorType: "Resend error type: {type}.",
    emailBadSubmission: "The API rejected these choices. Check that GitHub Pages and Render are using matching app versions.",
    emailApiUnreachable: "The email API could not be reached. Check the Render URL and CORS settings.",
    emailHttpError: "The email API returned HTTP {status}. Check the Render logs.",
    emailRetry: "Try email again",
    restart: "Start again",
    selectError: "Choose an answer to continue.",
    stepLabel: "Question",
    firstQuestion: "Which London outing would you choose?",
    firstHint: "Pick the plan you’d be most excited to do.",
    branches: {
      bounce: {
        question: "What would make game night most fun?",
        hint: "We’ll tune the plan to your group.",
        answers: ["Easygoing games and a catch-up", "A little friendly competition", "Add food and drinks"]
      },
      camden: {
        question: "What sounds best for your Camden wander?",
        hint: "There’s room to make this your own.",
        answers: ["Sample a few food stalls", "Browse the market together", "Take a canal-side stroll"]
      },
      draughts: {
        question: "What kind of board-game night are you after?",
        hint: "Draughts has games for first-timers and enthusiasts alike.",
        answers: ["Light, easy-to-learn games", "A strategic challenge", "Try something completely new"]
      }
    },
    lastQuestion: "When would you like to go?",
    lastHint: "Choose a time that works for your group.",
    lastAnswers: ["A weekday evening", "A weekend", "I’m flexible"],
    firstAnswers: ["Ping-pong and games at Bounce", "Food, stalls and a canal walk at Camden Market", "Board games at Draughts"],
    summaryLabels: ["Your outing", "Your vibe", "When"],
    recommendations: {
      bounce: { title: "Ping-pong at Bounce", location: "Farringdon or Old Street, London", description: "Book a table, pick up a paddle and turn a catch-up into a friendly rally. Check the venue for sessions and food options.", url: "https://www.bouncepingpong.com/" },
      camden: { title: "A Camden Market food-and-canal wander", location: "Camden Town, London", description: "Pick a few bites from the market, browse the stalls, then stretch the outing with a walk beside Regent’s Canal.", url: "https://camdenmarket.com/" },
      draughts: { title: "Board-game night at Draughts", location: "Waterloo or Hackney Wick, London", description: "Settle in with a board-game collection, order something to eat and let the staff help your group find a game.", url: "https://www.draughtslondon.com/" }
    }
  },
  lt: {
    languageLabel: "Kalba",
    storyAlt: "Londono gatvė vakaro šviesoje",
    imageAlt: "Gyva Londono gatvė vakare",
    imageCredit: "Nuotrauka: Unsplash",
    private: "Registruotis nereikia",
    storyEyebrow: "Praleiskite dieną Londone",
    storyQuote: "Geri planai dar geresni, kai jais dalijatės.",
    storyCaption: "Pasirinkite nuotaiką. Rasime jums tinkamą veiklą.",
    introEyebrow: "Greita veiklų paieška · apie 1 min.",
    heading: "Ką smagaus nuveikti Londone?",
    intro: "Pasirinkite idėją, o mes padėsime suplanuoti puikią išvyką su artimaisiais.",
    back: "Atgal",
    continue: "Tęsti",
    footer: "Baigus apklausą, jūsų pasirinkimai bus išsiųsti organizatoriui el. paštu.",
    completeEyebrow: "Jūsų planas Londone",
    completeTitle: "Skamba kaip puiki idėja.",
    completeSuffix: "Štai jūsų idėja. Prieš vykdami patikrinkite naujausią informaciją paslaugos teikėjo svetainėje.",
    recommendationEyebrow: "Jums skirta veiklos idėja",
    venueLink: "Apsilankyti svetainėje",
    emailSending: "Jūsų pasirinkimai siunčiami organizatoriui el. paštu…",
    emailSent: "Jūsų pasirinkimai išsiųsti organizatoriui el. paštu.",
    emailFailed: "Nepavyko išsiųsti pasirinkimų. Bandykite dar kartą.",
    emailApiUrlMissing: "Nenurodytas el. pašto API adresas. Nustatykite survey-api-base-url į savo Render paslaugos adresą.",
    emailOriginRejected: "Render atmetė šios svetainės kilmės adresą. Nustatykite FRONTEND_ORIGIN į savo GitHub Pages adresą.",
    emailServerNotConfigured: "Render trūksta el. pašto konfigūracijos. Patikrinkite aplinkos nustatymus.",
    emailMissingVariables: "Render trūksta šių nustatymų: {variables}. Įtraukite juos į Web Service aplinkos nustatymus.",
    emailInvalidVariables: "Reikia pataisyti šiuos Render nustatymus: {variables}.",
    emailResendFailed: "Resend nepavyko išsiųsti jūsų pasirinkimų. Patikrinkite Resend konfigūraciją.",
    emailResendApiKey: "Resend atmetė RESEND_API_KEY. Patikrinkite, ar raktas galiojantis ir aktyvus.",
    emailResendPermission: "Resend neleido naudoti šio API rakto. Patikrinkite jo prieigos teises.",
    emailResendTestRecipient: "Resend bandomuoju siuntėju gali siųsti tik paskyros savininkui. Norėdami siųsti į Yahoo paštą, patvirtinkite siuntėjo domeną.",
    emailResendDomain: "RESEND_FROM_EMAIL domenas Resend nepatvirtintas. Patvirtinkite jį ir naudokite siuntėjo adresą iš šio domeno.",
    emailResendApiKeyInactive: "Resend API raktas neaktyvus. Resend skydelyje sukurkite arba aktyvinkite raktą.",
    emailResendApiKeySuspended: "Resend sustabdė šį API raktą. Patikrinkite Resend skydelį arba susisiekite su Resend pagalba.",
    emailResendSender: "Resend atmetė siuntėją arba gavėją. Patvirtinkite siuntėjo domeną; bandomoji paskyra gali siųsti tik paskyros savininko adresu.",
    emailResendRate: "Resend apribojo užklausų dažnį. Patikrinkite paskyros limitą ir bandykite vėliau.",
    emailResendUnavailable: "Resend laikinai nepasiekiamas. Bandykite vėliau.",
    emailResendConnection: "Render nepavyko pasiekti Resend per HTTPS. Patikrinkite API adresą ir išeinančio HTTPS ryšio prieigą.",
    emailResendRejected: "Resend atmetė užklausą. Patikrinkite siuntėjo adresą ir Resend paskyros konfigūraciją.",
    emailProviderStatus: "Resend HTTP būsena: {status}.",
    emailProviderErrorType: "Resend klaidos tipas: {type}.",
    emailBadSubmission: "API atmetė šiuos pasirinkimus. Patikrinkite, ar GitHub Pages ir Render naudoja suderintas programos versijas.",
    emailApiUnreachable: "Nepavyko pasiekti el. pašto API. Patikrinkite Render adresą ir CORS nustatymus.",
    emailHttpError: "El. pašto API grąžino HTTP {status} klaidą. Patikrinkite Render žurnalus.",
    emailRetry: "Siųsti dar kartą",
    restart: "Pradėti iš naujo",
    selectError: "Norėdami tęsti, pasirinkite atsakymą.",
    stepLabel: "Klausimas",
    firstQuestion: "Kuri išvyka Londone jums patiktų?",
    firstHint: "Pasirinkite planą, kuris labiausiai vilioja.",
    branches: {
      bounce: {
        question: "Kas žaidimų vakarą paverstų smagiausiu?",
        hint: "Pritaikysime planą jūsų kompanijai.",
        answers: ["Ramus žaidimas ir pokalbiai", "Draugiškos varžybos", "Maistas ir gėrimai"]
      },
      camden: {
        question: "Kas labiausiai vilioja pasivaikščiojime po Camdeną?",
        hint: "Išvyką galite susikurti pagal savo skonį.",
        answers: ["Paragauti kelių patiekalų", "Kartu apžiūrėti turgų", "Pasivaikščioti palei kanalą"]
      },
      draughts: {
        question: "Kokio stalo žaidimų vakaro norėtumėte?",
        hint: "„Draughts“ rasite žaidimų ir naujokams, ir entuziastams.",
        answers: ["Lengvų, greitai perprantamų žaidimų", "Strateginio iššūkio", "Išbandyti dar nežaistą žaidimą"]
      }
    },
    lastQuestion: "Kada norėtumėte apsilankyti?",
    lastHint: "Pasirinkite laiką, tinkantį jūsų kompanijai.",
    lastAnswers: ["Darbo dienos vakarą", "Savaitgalį", "Laikas nėra svarbus"],
    firstAnswers: ["Stalo tenisas ir žaidimai „Bounce“", "Maistas, turgus ir kanalas Camden turguje", "Stalo žaidimai „Draughts“"],
    summaryLabels: ["Jūsų išvyka", "Jūsų nuotaika", "Kada"],
    recommendations: {
      bounce: { title: "Stalo tenisas „Bounce“ klube", location: "Farringdon arba Old Street, Londonas", description: "Rezervuokite stalą, čiupkite raketę ir paverskite susitikimą draugiškomis varžybomis. Dėl seansų ir maisto pasirinkimų teiraukitės vietos.", url: "https://www.bouncepingpong.com/" },
      camden: { title: "Maisto ir pasivaikščiojimo prie kanalo išvyka Camden turguje", location: "Camden Town, Londonas", description: "Paragaukite kelių patiekalų turguje, apžiūrėkite prekystalius, o tada pasivaikščiokite palei Regent kanalą.", url: "https://camdenmarket.com/" },
      draughts: { title: "Stalo žaidimų vakaras „Draughts“ klube", location: "Waterloo arba Hackney Wick, Londonas", description: "Rinkitės iš daugybės stalo žaidimų, užsisakykite užkandžių ir paprašykite darbuotojų padėti išsirinkti žaidimą.", url: "https://www.draughtslondon.com/" }
    }
  }
};

const paths = {
  bounce: 0,
  camden: 1,
  draughts: 2
};

const state = { language: "en", step: 0, answers: [], emailStatus: "idle", emailFailureKey: null, emailFailureStatus: null, emailFailureVariables: [], emailProviderStatus: null, emailProviderError: null };
const apiBaseUrl = document.querySelector('meta[name="survey-api-base-url"]').content.trim().replace(/\/$/, "");
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
    return { title: languageCopy.firstQuestion, hint: languageCopy.firstHint, answers: languageCopy.firstAnswers, keys: ["bounce", "camden", "draughts"] };
  }
  const branchKey = state.answers[0]?.key;
  const branch = languageCopy.branches[branchKey];
  if (step === 1) {
    return { title: branch.question, hint: branch.hint, answers: branch.answers, keys: ["first", "second", "third"] };
  }
  return {
    title: languageCopy.lastQuestion,
    hint: languageCopy.lastHint,
    answers: languageCopy.lastAnswers,
    keys: ["weekday", "weekend", "flexible"]
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
  const activityIndex = paths[state.answers[0].key];
  if (step === 0) return languageCopy.firstAnswers[activityIndex];
  const branchKey = state.answers[0].key;
  const answerIndex = step === 1
    ? ["first", "second", "third"].indexOf(state.answers[step].key)
    : ["weekday", "weekend", "flexible"].indexOf(state.answers[step].key);
  if (step === 1) return languageCopy.branches[branchKey].answers[answerIndex];
  return languageCopy.lastAnswers[answerIndex];
}

function renderCompletion() {
  const languageCopy = currentCopy();
  document.querySelector("#completion-copy").textContent = languageCopy.completeSuffix;
  const recommendation = languageCopy.recommendations[state.answers[0].key];
  document.querySelector("#recommendation-title").textContent = recommendation.title;
  document.querySelector("#recommendation-location").textContent = recommendation.location;
  document.querySelector("#recommendation-description").textContent = recommendation.description;
  document.querySelector("#recommendation-link").href = recommendation.url;
  renderEmailStatus();
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

function renderEmailStatus() {
  const failureTemplate = currentCopy()[state.emailFailureKey] || currentCopy().emailFailed;
  const failedText = state.emailFailureKey === "emailHttpError"
    ? failureTemplate.replace("{status}", String(state.emailFailureStatus))
    : ["emailMissingVariables", "emailInvalidVariables"].includes(state.emailFailureKey)
      ? failureTemplate.replace("{variables}", state.emailFailureVariables.join(", "))
      : failureTemplate;
  const providerStatus = state.emailProviderStatus
    ? ` ${currentCopy().emailProviderStatus.replace("{status}", String(state.emailProviderStatus))}`
    : "";
  const providerError = state.emailProviderError
    ? ` ${currentCopy().emailProviderErrorType.replace("{type}", state.emailProviderError)}`
    : "";
  const statusText = {
    idle: "",
    sending: currentCopy().emailSending,
    sent: currentCopy().emailSent,
    failed: `${failedText}${providerStatus}${providerError}`
  };
  document.querySelector("#email-status").textContent = statusText[state.emailStatus];
  document.querySelector("#email-retry").hidden = state.emailStatus !== "failed";
}

async function sendSurveyEmail() {
  if (state.emailStatus === "sending" || state.emailStatus === "sent") return;
  state.emailStatus = "sending";
  state.emailFailureKey = null;
  state.emailFailureStatus = null;
  state.emailFailureVariables = [];
  state.emailProviderStatus = null;
  state.emailProviderError = null;
  renderEmailStatus();
  try {
    if (!apiBaseUrl && location.hostname.endsWith("github.io")) {
      state.emailFailureKey = "emailApiUrlMissing";
      state.emailStatus = "failed";
      renderEmailStatus();
      return;
    }
    const response = await fetch(`${apiBaseUrl}/api/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: state.language,
        activity: state.answers[0].key,
        preference: state.answers[1].key,
        timing: state.answers[2].key
      })
    });
    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      state.emailProviderStatus = errorPayload.provider_status || null;
      state.emailProviderError = errorPayload.provider_error || null;
      state.emailFailureKey = {
        400: "emailBadSubmission",
        403: "emailOriginRejected",
        404: "emailApiUrlMissing",
        405: "emailApiUrlMissing",
        502: "emailResendFailed",
        503: "emailServerNotConfigured"
      }[response.status] || "emailHttpError";
      if (response.status === 503 && errorPayload.missing_variables?.length) {
        state.emailFailureKey = "emailMissingVariables";
        state.emailFailureVariables = errorPayload.missing_variables;
      } else if (response.status === 503 && errorPayload.invalid_variables?.length) {
        state.emailFailureKey = "emailInvalidVariables";
        state.emailFailureVariables = errorPayload.invalid_variables;
      } else if (errorPayload.error_code) {
        state.emailFailureKey = {
          resend_api_key_rejected: "emailResendApiKey",
          resend_permission_denied: "emailResendPermission",
          resend_test_recipient_restricted: "emailResendTestRecipient",
          resend_domain_unverified: "emailResendDomain",
          resend_api_key_inactive: "emailResendApiKeyInactive",
          resend_api_key_suspended: "emailResendApiKeySuspended",
          resend_sender_unverified: "emailResendSender",
          resend_rate_limited: "emailResendRate",
          resend_service_unavailable: "emailResendUnavailable",
          resend_connection_failed: "emailResendConnection",
          resend_request_rejected: "emailResendRejected",
          resend_unexpected_response: "emailResendUnavailable"
        }[errorPayload.error_code] || "emailResendFailed";
      }
      state.emailProviderStatus = errorPayload.provider_status || null;
      state.emailFailureStatus = response.status;
      state.emailStatus = "failed";
      renderEmailStatus();
      return;
    }
    state.emailStatus = "sent";
  } catch {
    state.emailStatus = "failed";
    state.emailFailureKey = "emailApiUnreachable";
  }
  renderEmailStatus();
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
    sendSurveyEmail();
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
  state.emailStatus = "idle";
  state.emailFailureKey = null;
  state.emailFailureStatus = null;
  state.emailFailureVariables = [];
  state.emailProviderStatus = null;
  state.emailProviderError = null;
  showSurvey();
});

document.querySelector("#email-retry").addEventListener("click", sendSurveyEmail);

document.querySelectorAll("[data-language]").forEach((button) => {
  button.addEventListener("click", () => {
    state.language = button.dataset.language;
    renderStaticCopy();
  });
});

renderStaticCopy();
