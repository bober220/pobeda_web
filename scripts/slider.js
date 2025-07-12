$(document).ready(function(){
    $('.slider').slick({
        // Настройки для стрелок
        arrows: true,
        prevArrow: '<button type="button" class="slick-prev">←</button>',
        nextArrow: '<button type="button" class="slick-next">→</button>',

        // Настройки точек
        dots: true,
        dotsClass: 'slick-dots',

        // Автопрокрутка
        autoplay: true,
        autoplaySpeed: 5000, // 5 секунд
        pauseOnHover: true,
        pauseOnFocus: false,

        // Анимация
        fade: false,
        speed: 500,

        // Адаптивные настройки
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false
                }
            }
        ]
    });
});