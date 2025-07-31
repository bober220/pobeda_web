$(document).ready(function(){
    $('.slider-pg2.loading').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        fade: false, // ← Отключаем fade-эффект
        speed: 500,
        cssEase: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
        infinite: true,
        prevArrow: '<button type="button" class="slick-prev">❮</button>',
        nextArrow: '<button type="button" class="slick-next">❯</button>',
    }).on('init', function(){
        $(this).removeClass('loading');
    });
});