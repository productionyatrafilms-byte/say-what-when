(() => {
  const DEFAULT_LANG = "English";
  const LANG_KEY = "selectedLanguage";
  let translations = null;

  document.documentElement.style.visibility = "hidden";

  const langButtonMap = {
    English: ".english-button",
    Hindi: ".hindi-button",
    Gujarati: ".gujrati-button",
  };

  function getSavedLanguage() {
    return localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
  }

  async function loadTranslations() {
    if (translations) return translations;

    try {
      const res = await fetch("assets/json/data.json", { cache: "no-store" });
      if (!res.ok) throw new Error("JSON not found");
      translations = await res.json();
    } catch (err) {
      console.warn("Translation load failed:", err);
      translations = {};
    }

    return translations;
  }

  function setActiveLanguageButton(lang) {
    document
      .querySelectorAll(".english-button, .hindi-button, .gujrati-button")
      .forEach((btn) => btn.classList.remove("active"));

    const activeBtn = document.querySelector(langButtonMap[lang]);
    if (activeBtn) {
      activeBtn.classList.add("active");
    }
  }

  function applyTranslations(lang) {
    if (!translations || !translations[lang]) return;

    const langData = translations[lang];

    document.documentElement.lang =
      lang === "Hindi" ? "hi" : lang === "Gujarati" ? "gu" : "en";

    document.body.setAttribute(
      "data-lang",
      lang === "Hindi" ? "hi" : lang === "Gujarati" ? "gu" : "en"
    );

    document.querySelectorAll("[data-lang-key]").forEach((element) => {
      const key = element.getAttribute("data-lang-key");
      const value = langData[key];

      if (value === undefined) return;

      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        element.placeholder = value;
      } else if (element.tagName === "TITLE") {
        document.title = value;
        element.textContent = value;
      } else {
        element.textContent = value;
      }
    });
  }

  function changeLanguage(lang) {
    localStorage.setItem(LANG_KEY, lang);
    setActiveLanguageButton(lang);
    applyTranslations(lang);
  }

  async function initLanguageSystem() {
    await loadTranslations();

    const savedLang = getSavedLanguage();
    const selectedLang = translations[savedLang] ? savedLang : DEFAULT_LANG;

    changeLanguage(selectedLang);

    const englishBtn = document.querySelector(".english-button");
    const hindiBtn = document.querySelector(".hindi-button");
    const gujratiBtn = document.querySelector(".gujrati-button");

    if (englishBtn) {
      englishBtn.addEventListener("click", () => changeLanguage("English"));
    }

    if git (hindiBtn) {
      hindiBtn.addEventListener("click", () => changeLanguage("Hindi"));
    }

    if (gujratiBtn) {
      gujratiBtn.addEventListener("click", () => changeLanguage("Gujarati"));
    }

    document.documentElement.style.visibility = "visible";
  }

  document.addEventListener("DOMContentLoaded", initLanguageSystem);
})();