$(document).ready(function(){
    $('.slider').slick({
        arrows: true,
        prevArrow: '<button type="button" class="slick-prev">❮</button>',
        nextArrow: '<button type="button" class="slick-next">❯</button>',

        // Настройки точек
        dots: true,
        dotsClass: 'slick-dots',

        // Настройки для тач-устройств
        touchThreshold: 5, // Уменьшаем порог срабатывания свайпа
        swipeToSlide: true, // Позволяет "дотягивать" слайд пальцем
        draggable: true, // Включает перетаскивание
        edgeFriction: 0.15, // Уменьшает "прилипание" при свайпе у краёв
        waitForAnimate: false, // Позволяет быстро свайпать без ожидания анимации

        // Автопрокрутка
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        pauseOnFocus: false,
        pauseOnDotsHover: true, // Пауза при наведении на точки

        // Анимация
        fade: false,
        speed: 600,
        cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)', // Плавная анимация

        // Адаптивные настройки
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    touchThreshold: 3, // Ещё более чувствительный свайп на мобильных
                    swipe: true,
                    centerMode: false, // Можно включить для эффекта "предпросмотра"
                    variableWidth: false
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    touchThreshold: 2 // Максимальная чувствительность для маленьких экранов
                }
            }
        ]
    });
});