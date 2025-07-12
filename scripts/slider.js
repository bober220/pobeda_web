$(document).ready(function(){
    $('.slider').slick({
        arrows: true,
        prevArrow: '<button type="button" class="slick-prev">❮</button>',
        nextArrow: '<button type="button" class="slick-next">❯</button>',

        // Настройки точек
        dots: true,
        dotsClass: 'slick-dots',

        // Автопрокрутка
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        pauseOnFocus: false,

        // Анимация
        fade: false,
        speed: 5000,

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