const copy = {
  en: {
    languageLabel: "Language",
    storyAlt: "A relaxed moment shared by a couple",
    imageAlt: "A couple sharing a quiet moment together",
    imageCredit: "Photo: Unsplash",
    private: "No account needed",
    storyEyebrow: "A little date planning",
    storyQuote: "Make room for a good conversation.",
    storyCaption: "Choose a mood. Add the details that make it yours.",
    introEyebrow: "A thoughtful date planner · about 1 minute",
    heading: "Plan something lovely with Rasa.",
    intro: "Choose a date idea, then add a few personal touches before sending the plan.",
    back: "Back",
    continue: "Continue",
    reviewDate: "Add date notes",
    footer: "Your choices and optional notes will be emailed to the organiser.",
    completeEyebrow: "Your date idea",
    completeTitle: "A lovely plan is taking shape.",
    completeSuffix: "Review your choices and add any notes before sending.",
    recommendationEyebrow: "A date suggestion",
    venueLink: "Explore this idea",
    commentsTitle: "Add a few personal touches",
    commentsHint: "All three fields are optional. Your notes will be emailed with your choices.",
    commentOneLabel: "What helps you feel comfortable on a date?",
    commentTwoLabel: "Any interests or conversation starters to include?",
    commentThreeLabel: "Anything else to keep in mind?",
    commentPlaceholder: "Add a note (optional)",
    sendDatePlan: "Send date plan",
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
    emailResendKeyDomain: "The API key is restricted to a different domain. Set its domain restriction to the verified domain used in RESEND_FROM_EMAIL, or create a Sending access key for that domain.",
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
    emailProviderMessage: "Resend details: {message}",
    emailBadSubmission: "The API rejected these choices. Check that GitHub Pages and Render are using matching app versions.",
    emailApiUnreachable: "The email API could not be reached. Check the Render URL and CORS settings.",
    emailHttpError: "The email API returned HTTP {status}. Check the Render logs.",
    emailRetry: "Try email again",
    restart: "Start again",
    selectError: "Choose an answer to continue.",
    stepLabel: "Question",
    firstQuestion: "What kind of first date sounds like you?",
    firstHint: "Choose one idea and we’ll tailor the details.",
    branches: {
      drinks: {
        question: "What would make an after-work date feel right?",
        hint: "Pick the pace that feels comfortable.",
        answers: ["A relaxed drink and easy conversation", "A riverside stroll", "A little of both"]
      },
      badminton: {
        question: "What kind of badminton date sounds fun?",
        hint: "Keep it playful; the score is optional.",
        answers: ["Keep it relaxed and learn together", "Friendly competition", "Winner picks the next stop"]
      },
      citybreak: {
        question: "Which city would you choose for a weekend away?",
        hint: "A daydream for now; plan the details together.",
        answers: ["London", "Paris", "Brussels"]
      }
    },
    lastQuestion: "When would you like to meet?",
    lastHint: "Choose a time that works for you both.",
    lastAnswers: ["A weekday evening", "A weekend", "I’m flexible"],
    firstAnswers: ["After-work drinks and a riverside stroll", "A friendly one-on-one badminton match", "Peter’s wildcard: a weekend city break"],
    summaryLabels: ["Date idea", "Your preference", "When"],
    cityBreakTitle: "A weekend city-break date in {city}",
    recommendations: {
      drinks: { title: "After-work drinks and a riverside stroll", location: "South Bank, London", description: "Meet for a relaxed drink, then take a walk along the Thames and let the conversation set the pace.", url: "https://www.google.com/maps/search/?api=1&query=bars+South+Bank+London" },
      badminton: { title: "A friendly singles badminton date", location: "Find a court in London", description: "Book a court, have a playful match, and let the winner choose your next stop.", url: "https://www.google.com/maps/search/?api=1&query=badminton+courts+London" },
      citybreak: { title: "A weekend city-break date", location: "Choose a city together", description: "Pick one neighbourhood, one shared activity, and leave room for a few spontaneous moments.", url: "https://www.google.com/maps/search/?api=1&query=weekend+city+break" }
    }
  },
  lt: {
    languageLabel: "Kalba",
    storyAlt: "Jauki poros akimirka",
    imageAlt: "Pora kartu leidžia ramią akimirką",
    imageCredit: "Nuotrauka: Unsplash",
    private: "Paskyros kurti nereikia",
    storyEyebrow: "Truputis pasimatymo planavimo",
    storyQuote: "Palikime vietos geram pokalbiui.",
    storyCaption: "Pasirinkite nuotaiką ir pridėkite asmeniškų detalių.",
    introEyebrow: "Pasimatymų planuoklis · apie 1 min.",
    heading: "Suplanuokime gražų pasimatymą su Rasa.",
    intro: "Pasirinkite pasimatymo idėją ir prieš išsiųsdami planą pridėkite kelias asmeniškas detales.",
    back: "Atgal",
    continue: "Tęsti",
    reviewDate: "Pridėti pastabų",
    footer: "Jūsų pasirinkimai ir pastabos el. paštu bus išsiųsti organizatoriui.",
    completeEyebrow: "Jūsų pasimatymo idėja",
    completeTitle: "Planą jau dėliojame.",
    completeSuffix: "Peržiūrėkite pasirinkimus ir prieš siųsdami pridėkite pastabų.",
    recommendationEyebrow: "Pasimatymo pasiūlymas",
    venueLink: "Peržiūrėti idėją",
    commentsTitle: "Pridėkite kelias asmeniškas detales",
    commentsHint: "Visi trys laukai neprivalomi. Pastabos bus išsiųstos kartu su jūsų pasirinkimais.",
    commentOneLabel: "Kas padėtų pasimatymo metu jaustis patogiai?",
    commentTwoLabel: "Kokios temos ar veiklos jums patinka?",
    commentThreeLabel: "Ar yra dar kas nors, į ką reikėtų atsižvelgti?",
    commentPlaceholder: "Pridėkite pastabą (neprivaloma)",
    sendDatePlan: "Išsiųsti pasimatymo planą",
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
    emailResendKeyDomain: "Šis API raktas apribotas kitu domenu. Nustatykite jo apribojimą pagal patvirtintą RESEND_FROM_EMAIL domeną arba sukurkite to domeno siuntimo prieigos raktą.",
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
    emailProviderMessage: "Resend informacija: {message}",
    emailBadSubmission: "API atmetė šiuos pasirinkimus. Patikrinkite, ar GitHub Pages ir Render naudoja suderintas programos versijas.",
    emailApiUnreachable: "Nepavyko pasiekti el. pašto API. Patikrinkite Render adresą ir CORS nustatymus.",
    emailHttpError: "El. pašto API grąžino HTTP {status} klaidą. Patikrinkite Render žurnalus.",
    emailRetry: "Siųsti dar kartą",
    restart: "Pradėti iš naujo",
    selectError: "Norėdami tęsti, pasirinkite atsakymą.",
    stepLabel: "Klausimas",
    firstQuestion: "Koks pirmasis pasimatymas jums patiktų?",
    firstHint: "Pasirinkite idėją, o mes pritaikysime detales.",
    branches: {
      drinks: {
        question: "Koks pasimatymas po darbo jums patiktų?",
        hint: "Pasirinkite jums patogų tempą.",
        answers: ["Ramus gėrimas ir lengvas pokalbis", "Pasivaikščiojimas palei upę", "Ir viena, ir kita"]
      },
      badminton: {
        question: "Koks badmintono pasimatymas skambėtų smagiai?",
        hint: "Svarbiausia žaismingumas, ne rezultatas.",
        answers: ["Ramus žaidimas ir mokymasis kartu", "Draugiškos varžybos", "Pralaimėjęs išrenka kitą vietą"]
      },
      citybreak: {
        question: "Kuriame mieste norėtumėte praleisti savaitgalį?",
        hint: "Kol kas tik svajonė; planą galėsite kurti kartu.",
        answers: ["Londone", "Paryžiuje", "Briuselyje"]
      }
    },
    lastQuestion: "Kada norėtumėte susitikti?",
    lastHint: "Pasirinkite laiką, tinkantį jums abiem.",
    lastAnswers: ["Darbo dienos vakarą", "Savaitgalį", "Laikas nėra svarbus"],
    firstAnswers: ["Gėrimai po darbo ir pasivaikščiojimas palei upę", "Draugiškas badmintono mačas vienas prieš vieną", "Peterio staigmena: savaitgalio išvyka į kitą miestą"],
    summaryLabels: ["Pasimatymo idėja", "Jūsų pageidavimai", "Kada"],
    cityBreakTitle: "Savaitgalio pasimatymas mieste: {city}",
    recommendations: {
      drinks: { title: "Gėrimai po darbo ir pasivaikščiojimas palei upę", location: "South Bank, Londonas", description: "Susitikite jaukiam gėrimui, o tada pasivaikščiokite palei Temzę ir leiskite pokalbiui pakrypti savaime.", url: "https://www.google.com/maps/search/?api=1&query=bars+South+Bank+London" },
      badminton: { title: "Draugiškas badmintono mačas vienetais", location: "Pasirinkite aikštelę Londone", description: "Rezervuokite aikštelę, pažaiskite smagų mačą, o nugalėtojas tegul išrenka kitą sustojimą.", url: "https://www.google.com/maps/search/?api=1&query=badminton+courts+London" },
      citybreak: { title: "Savaitgalio pasimatymas kitame mieste", location: "Pasirinkite miestą kartu", description: "Išsirinkite vieną rajoną, vieną bendrą veiklą ir palikite vietos spontaniškoms akimirkoms.", url: "https://www.google.com/maps/search/?api=1&query=weekend+city+break" }
    }
  }
};

const paths = {
  drinks: 0,
  badminton: 1,
  citybreak: 2
};

const state = { language: "en", step: 0, answers: [], comments: ["", "", ""], emailStatus: "idle", emailFailureKey: null, emailFailureStatus: null, emailFailureVariables: [], emailProviderStatus: null, emailProviderError: null, emailProviderMessage: null };
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
  document.title = state.language === "lt" ? "Bendra kryptis | Pasimatymų planuoklis" : "Common Ground | Date planner";
  document.querySelector(".language-switch").setAttribute("aria-label", languageCopy.languageLabel);
  document.querySelector(".story-panel").setAttribute("aria-label", languageCopy.storyAlt);
  document.querySelector(".story-panel img").alt = languageCopy.imageAlt;
  document.querySelector(".image-credit").textContent = languageCopy.imageCredit;
  document.querySelectorAll("[data-copy]").forEach((element) => {
    const value = languageCopy[element.dataset.copy];
    if (typeof value === "string") element.textContent = value;
  });
  document.querySelectorAll("[data-copy-placeholder]").forEach((element) => {
    const value = languageCopy[element.dataset.copyPlaceholder];
    if (typeof value === "string") element.placeholder = value;
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
    return { title: languageCopy.firstQuestion, hint: languageCopy.firstHint, answers: languageCopy.firstAnswers, keys: ["drinks", "badminton", "citybreak"] };
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
  document.querySelector("#continue-button span").textContent = state.step === 2 ? languageCopy.reviewDate : languageCopy.continue;
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
  const activityKey = state.answers[0].key;
  const recommendation = { ...languageCopy.recommendations[activityKey] };
  if (activityKey === "citybreak") {
    const cityIndex = ["first", "second", "third"].indexOf(state.answers[1].key);
    const city = languageCopy.branches.citybreak.answers[cityIndex];
    recommendation.title = languageCopy.cityBreakTitle.replace("{city}", city);
    recommendation.location = city;
    recommendation.url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(city)}`;
  }
  document.querySelector("#recommendation-title").textContent = recommendation.title;
  document.querySelector("#recommendation-location").textContent = recommendation.location;
  document.querySelector("#recommendation-description").textContent = recommendation.description;
  document.querySelector("#recommendation-link").href = recommendation.url;
  document.querySelectorAll("[data-comment-index]").forEach((field) => {
    const index = Number(field.dataset.commentIndex);
    field.value = state.comments[index] || "";
  });
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
  const providerMessage = state.emailProviderMessage
    ? ` ${currentCopy().emailProviderMessage.replace("{message}", state.emailProviderMessage)}`
    : "";
  const statusText = {
    idle: "",
    sending: currentCopy().emailSending,
    sent: currentCopy().emailSent,
    failed: `${failedText}${providerStatus}${providerError}${providerMessage}`
  };
  document.querySelector("#email-status").textContent = statusText[state.emailStatus];
  document.querySelector("#email-retry").hidden = state.emailStatus !== "failed";
  document.querySelector("#send-survey-button").hidden = state.emailStatus === "failed" || state.emailStatus === "sent";
  document.querySelector("#send-survey-button").disabled = state.emailStatus === "sending";
}

async function sendSurveyEmail() {
  if (state.emailStatus === "sending" || state.emailStatus === "sent") return;
  state.emailStatus = "sending";
  state.emailFailureKey = null;
  state.emailFailureStatus = null;
  state.emailFailureVariables = [];
  state.emailProviderStatus = null;
  state.emailProviderError = null;
  state.emailProviderMessage = null;
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
        timing: state.answers[2].key,
        comments: state.comments
      })
    });
    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      state.emailProviderStatus = errorPayload.provider_status || null;
      state.emailProviderError = errorPayload.provider_error || null;
      state.emailProviderMessage = errorPayload.provider_message || null;
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
          resend_api_key_domain_mismatch: "emailResendKeyDomain",
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
  state.comments = ["", "", ""];
  state.emailStatus = "idle";
  state.emailFailureKey = null;
  state.emailFailureStatus = null;
  state.emailFailureVariables = [];
  state.emailProviderStatus = null;
  state.emailProviderError = null;
  state.emailProviderMessage = null;
  showSurvey();
});

document.querySelector("#email-retry").addEventListener("click", sendSurveyEmail);
document.querySelector("#send-survey-button").addEventListener("click", sendSurveyEmail);

document.querySelectorAll("[data-comment-index]").forEach((field) => {
  field.addEventListener("input", () => {
    state.comments[Number(field.dataset.commentIndex)] = field.value;
  });
});

document.querySelectorAll("[data-language]").forEach((button) => {
  button.addEventListener("click", () => {
    state.language = button.dataset.language;
    renderStaticCopy();
  });
});

renderStaticCopy();
