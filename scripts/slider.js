document.addEventListener('DOMContentLoaded', function() {
    $('.slider').slick({
        slidesToShow: 1, // Показываем только 1 слайд
        slidesToScroll: 1,
        infinite: true,
        centerMode: false, // Отключаем центральный режим
        focusOnSelect: false,
        arrows: true,
        speed: 300,
        cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        prevArrow: '<button type="button" class="slick-prev">❮</button>',
        nextArrow: '<button type="button" class="slick-next">❯</button>',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false // На мобильных убираем стрелки
                }
            }
        ]
    });
});