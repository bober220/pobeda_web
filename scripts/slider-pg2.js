$(document).ready(function(){
    $('.slider.loading').slick({
        arrows: true, // Включаем кнопки навигации
        prevArrow: '<button type="button" class="slick-prev">❮</button>',
        nextArrow: '<button type="button" class="slick-next">❯</button>',

        // Отключаем точки (счетчик слайдов)
        dots: false,

        // Настройки свайпа
        touchThreshold: 15,
        swipeToSlide: true,
        draggable: true,
        edgeFriction: 0.03,
        waitForAnimate: true,
        touchMove: true,
        swipe: true,
        mobileFirst: true,

        // Настройки скорости и плавности
        speed: 400,
        cssEase: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        useTransform: true,

        // Отключаем автопрокрутку
        autoplay: false,

        // Адаптивные настройки
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: true,
                    touchThreshold: 12,
                    swipe: true,
                    centerMode: false,
                    variableWidth: false,
                    speed: 350
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: true,
                    touchThreshold: 10,
                    speed: 300
                }
            }
        ]
    }).on('init', function(){
        $(this).removeClass('loading');
    });
});