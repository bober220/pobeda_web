document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('accessibility-toggle');
    const body = document.body;

    // Проверяем, был ли режим уже включен
    if (localStorage.getItem('accessibilityMode') === 'on') {
        body.classList.add('accessibility-mode');
        btn.textContent = '👁️ Обычная версия';
    }

    // Обработчик клика
    btn.addEventListener('click', function() {
        body.classList.toggle('accessibility-mode');

        if (body.classList.contains('accessibility-mode')) {
            localStorage.setItem('accessibilityMode', 'on');
            btn.textContent = '👁️ Обычная версия';
        } else {
            localStorage.removeItem('accessibilityMode');
            btn.textContent = '👁️ Версия для слабовидящих';
        }
    });

    // Горячая клавиша (Alt + A)
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key.toLowerCase() === 'a') {
            btn.click();
        }
    });
    function changeFontSize(step) {
        const html = document.documentElement;
        const currentSize = parseFloat(window.getComputedStyle(html).fontSize);
        html.style.fontSize = (currentSize + step) + 'px';
        localStorage.setItem('fontSize', currentSize + step);
    }
    function speakText(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ru-RU';
            window.speechSynthesis.speak(utterance);
        }
    }
});