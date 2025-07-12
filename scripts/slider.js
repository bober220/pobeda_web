$(document).ready(function(){
    $('.slider.loading').slick({
        arrows: false, // По умолчанию отключаем кнопки
        prevArrow: '<button type="button" class="slick-prev">❮</button>',
        nextArrow: '<button type="button" class="slick-next">❯</button>',

        // Настройки точек
        dots: true,
        dotsClass: 'slick-dots',

        // Оптимизированные настройки для свайпа
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

        // Автопрокрутка
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        pauseOnFocus: false,
        pauseOnDotsHover: true,

        // Адаптивные настройки
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false, // Остается выключенным
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
                    arrows: false,
                    touchThreshold: 10,
                    speed: 300
                }
            },
            // Добавляем новый breakpoint для десктопов
            {
                breakpoint: 1024,
                settings: {
                    arrows: true // Включаем кнопки только на десктопах
                }
            }
        ]
    }).on('init', function(){
        $(this).removeClass('loading');
    });
});