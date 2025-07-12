$(document).ready(function(){
    $('.slider.loading').slick({
        arrows: true,
        prevArrow: '<button type="button" class="slick-prev">❮</button>',
        nextArrow: '<button type="button" class="slick-next">❯</button>',

        // Настройки точек
        dots: true,
        dotsClass: 'slick-dots',

        // Оптимизированные настройки для свайпа
        touchThreshold: 15,
        swipeToSlide: true,
        draggable: true,
        edgeFriction: 0.05,
        waitForAnimate: false,
        touchMove: true,
        swipe: true,

        // Автопрокрутка
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        pauseOnFocus: false,
        pauseOnDotsHover: true,

        // Анимация
        fade: false,
        speed: 600,
        cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)',

        // Адаптивные настройки
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    touchThreshold: 10,
                    swipe: true,
                    centerMode: false,
                    variableWidth: false
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    touchThreshold: 8
                }
            }
        ]
    }).on('init', function(){
        $(this).removeClass('loading');
    });
});