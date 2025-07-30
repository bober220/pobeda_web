$(document).ready(function(){
    $('.slider-pg2.loading').slick({
        centerMode: true,
        centerPadding: '0',
        slidesToShow: 3,
        focusOnSelect: true,
        variableWidth: true,

        // Навигация
        arrows: true,
        prevArrow: '<button type="button" class="slick-prev">❮</button>',
        nextArrow: '<button type="button" class="slick-next">❯</button>',

        // Анимация и поведение
        speed: 800,
        cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        infinite: true,
        useTransform: true,
        waitForAnimate: false,

        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    centerMode: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    centerMode: true,
                    centerPadding: '20px',
                    variableWidth: false,
                    speed: 600,
                    arrows: true
                }
            }
        ]
    }).on('beforeChange', function(event, slick, currentSlide, nextSlide) {
        $('.slick-slide', this).css('transition', 'none');
        void this.offsetWidth;
        $('.slick-slide', this).css({
            'transition': 'transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1), ' +
                'opacity 0.8s cubic-bezier(0.645, 0.045, 0.355, 1), ' +
                'filter 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)'
        });
    }).on('init', function(){
        $(this).removeClass('loading');
    });
});