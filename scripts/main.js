import Header from "./Header.js";
new Header();

document.addEventListener("DOMContentLoaded", () => {
    /* === Панель версии для слабовидящих === */
    const panel = document.getElementById("vision-panel");
    const toggleBtn = document.getElementById("toggle-vision");
    const resetBtn = document.getElementById("reset-vision");

    if (toggleBtn && panel) {
        toggleBtn.addEventListener("click", () => {
            panel.classList.toggle("hidden");
        });
    }

    // Размер шрифта
    document.querySelectorAll("[data-font]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const action = btn.dataset.font;
            const body = document.body;
            let size = parseInt(window.getComputedStyle(body).fontSize, 10);

            if (action === "increase") size += 2;
            if (action === "decrease" && size > 10) size -= 2;

            body.style.fontSize = size + "px";
            localStorage.setItem("fontSize", size);
        });
    });

    // Цветовые схемы
    document.querySelectorAll("[data-theme]").forEach((btn) => {
        btn.addEventListener("click", () => {
            document.body.dataset.theme = btn.dataset.theme;
            localStorage.setItem("theme", btn.dataset.theme);
        });
    });

    // Изображения (показать / скрыть / ч/б)
    document.querySelectorAll("[data-images]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const imgs = document.querySelectorAll("img");
            const mode = btn.dataset.images;
            if (mode === "off") {
                imgs.forEach((img) => (img.style.display = "none"));
            } else if (mode === "grayscale") {
                imgs.forEach((img) => {
                    img.style.display = "";
                    img.classList.add("grayscale");
                });
            } else {
                imgs.forEach((img) => {
                    img.style.display = "";
                    img.classList.remove("grayscale");
                });
            }
            localStorage.setItem("images", mode);
        });
    });

    // Межстрочный интервал
    document.querySelectorAll("[data-line]").forEach((btn) => {
        btn.addEventListener("click", () => {
            let lineHeight = "1.5";
            if (btn.dataset.line === "medium") lineHeight = "1.75";
            if (btn.dataset.line === "large") lineHeight = "2";
            document.body.style.lineHeight = lineHeight;
            localStorage.setItem("lineHeight", lineHeight);
        });
    });

    // Межбуквенный интервал
    document.querySelectorAll("[data-letter]").forEach((btn) => {
        btn.addEventListener("click", () => {
            let spacing = "normal";
            if (btn.dataset.letter === "wide") spacing = "0.1em";
            if (btn.dataset.letter === "extra") spacing = "0.2em";
            document.body.style.letterSpacing = spacing;
            localStorage.setItem("letterSpacing", spacing);
        });
    });

    // Шрифт
    document.querySelectorAll("[data-fonttype]").forEach((btn) => {
        btn.addEventListener("click", () => {
            if (btn.dataset.fonttype === "serif") {
                document.body.style.fontFamily = "serif";
            } else {
                document.body.style.fontFamily = "Arial, sans-serif";
            }
            localStorage.setItem("fontType", btn.dataset.fonttype);
        });
    });

    /* === 🎤 СИНТЕЗ РЕЧИ ТОЛЬКО ПО НАВЕДЕНИЮ (после нажатия кнопки) === */
    const toggleSpeechBtn =
        document.getElementById("speak-btn") ||
        document.getElementById("toggle-speech"); // поддержка обоих id

    let speechEnabled = false;
    let voices = [];
    let ruVoice = null;
    let lastSpokenEl = null;

    function loadVoices() {
        voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
        ruVoice =
            voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("ru")) ||
            null;
    }
    if ("speechSynthesis" in window) {
        speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();
    }

    function speak(text) {
        if (!("speechSynthesis" in window)) return;
        if (!text) return;
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "ru-RU";
        if (ruVoice) u.voice = ruVoice;
        u.rate = 1;
        u.pitch = 1;
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
    }

    function getReadableText(el) {
        if (!el || el.nodeType !== 1) return "";

        // 1) Прямой текст
        let text = (el.innerText || el.textContent || "").trim();

        // 2) Альтернативные источники
        if (!text) {
            const aria = el.getAttribute("aria-label");
            if (aria) text = aria.trim();
        }
        if (!text) {
            const title = el.getAttribute("title");
            if (title) text = title.trim();
        }
        if (!text && (el.tagName === "IMG" || el.tagName === "AREA")) {
            const alt = el.getAttribute("alt");
            if (alt) text = alt.trim();
        }
        if (!text && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) {
            const val = el.value?.toString().trim();
            const ph = el.getAttribute("placeholder")?.trim();
            text = val || ph || "";
            if (!text && el.id) {
                const lbl = document.querySelector(`label[for="${el.id}"]`);
                if (lbl) text = (lbl.innerText || lbl.textContent || "").trim();
            }
        }
        if (!text && el.tagName === "BUTTON") {
            const v = el.value?.toString().trim();
            if (v) text = v;
        }

        // 3) Если у текущего нет текста — поднимаемся вверх до 3 уровней
        let level = 0;
        let cur = el;
        while ((!text || text.length < 2) && cur && cur.parentElement && level < 3) {
            cur = cur.parentElement;
            const t = (cur.innerText || cur.textContent || "").trim();
            if (t && t.length > 1) {
                text = t;
                break;
            }
            level++;
        }

        // Защита от чтения всего документа
        if (text && text.length > 1500) text = text.slice(0, 1500);
        return text || "";
    }

    if (toggleSpeechBtn) {
        // Переключатель режима
        toggleSpeechBtn.addEventListener("click", () => {
            speechEnabled = !speechEnabled;
            if ("speechSynthesis" in window) speechSynthesis.cancel();

            // Озвучим состояние
            speak(speechEnabled ? "Синтез речи включен" : "Синтез речи выключен");

            // (опционально) визуальное состояние кнопки
            toggleSpeechBtn.classList.toggle("active", speechEnabled);
            if (!toggleSpeechBtn.dataset.staticLabel) {
                toggleSpeechBtn.textContent = speechEnabled ? "🔊" : "👁";
            }
        });

        // Чтение по наведению — делегирование на весь документ
        document.body.addEventListener(
            "pointerover",
            (e) => {
                if (!speechEnabled) return;
                const el = e.target;
                if (el === lastSpokenEl) return;

                const text = getReadableText(el);
                if (text) {
                    lastSpokenEl = el;
                    speak(text);
                }
            },
            true
        );

        // Прерываем чтение, когда уходим курсором с элемента
        document.body.addEventListener(
            "pointerover",
            (e) => {
                if (!speechEnabled) return;
                const el = e.target;
                if (el === lastSpokenEl) return;

                const text = getReadableText(el);
                if (text) {
                    lastSpokenEl = el;
                    // сразу прерываем и сразу же говорим
                    speechSynthesis.cancel();

                    const u = new SpeechSynthesisUtterance(text);
                    u.lang = "ru-RU";
                    if (ruVoice) u.voice = ruVoice;
                    u.rate = 1;
                    u.pitch = 1;

                    speechSynthesis.speak(u);
                }
            },
            true
        );
    }

    // Сброс
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            localStorage.clear();
            if ("speechSynthesis" in window) speechSynthesis.cancel();
            location.reload();
        });
    }

    // Восстановление настроек
    const savedFont = localStorage.getItem("fontSize");
    if (savedFont) document.body.style.fontSize = savedFont + "px";
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) document.body.dataset.theme = savedTheme;
    const savedImages = localStorage.getItem("images");
    if (savedImages === "off") {
        document.querySelectorAll("img").forEach((img) => (img.style.display = "none"));
    } else if (savedImages === "grayscale") {
        document.querySelectorAll("img").forEach((img) => img.classList.add("grayscale"));
    }
    const savedLH = localStorage.getItem("lineHeight");
    if (savedLH) document.body.style.lineHeight = savedLH;
    const savedLS = localStorage.getItem("letterSpacing");
    if (savedLS) document.body.style.letterSpacing = savedLS;
    if (localStorage.getItem("fontType") === "serif") {
        document.body.style.fontFamily = "serif";
    }
});