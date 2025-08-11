$(document).ready(function() {
    // Функция для изменения разметки
    function updateSliderLayout() {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const $sliderItems = $('.slider__item-pg2');

        $sliderItems.each(function() {
            const $item = $(this);
            const $slideContent = $item.find('.slide-content');
            const $slideImage = $item.find('.slide-image');
            const $slideText = $item.find('.slide-text');

            if (isMobile) {
                if (!$slideContent.find('.slide-text').first().hasClass('mobile-modified')) {
                    const $titleText = $slideText.clone();
                    $titleText.addClass('mobile-modified');
                    $titleText.find('p').remove();

                    const $descText = $slideText.clone();
                    $descText.addClass('mobile-modified');
                    $descText.find('h1').remove();

                    $slideContent.empty()
                        .append($titleText)
                        .append($slideImage)
                        .append($descText);
                }
            } else {
                if ($slideContent.find('.slide-text').first().hasClass('mobile-modified')) {
                    const $originalText = $slideContent.find('.slide-text').first();
                    $originalText.removeClass('mobile-modified');
                    $originalText.find('p').remove();

                    if (!$originalText.find('h1').length) {
                        const h1Text = $slideContent.find('.slide-text').last().find('h1').text();
                        $originalText.prepend(`<h1>${h1Text}</h1>`);
                    }

                    if (!$originalText.find('p').length) {
                        const pText = $slideContent.find('.slide-text').last().find('p').text();
                        $originalText.append(`<p>${pText}</p>`);
                    }

                    $slideContent.find('.slide-text').not(':first').remove();
                    $slideContent.prepend($slideImage);
                    $slideContent.append($originalText);
                }
            }
        });
    }

    // Инициализация слайдера
    const $slider = $('.slider-pg2.loading').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        fade: false,
        speed: 500,
        cssEase: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
        infinite: true,
        prevArrow: '<button type="button" class="slick-prev" aria-label="Previous">❮</button>',
        nextArrow: '<button type="button" class="slick-next" aria-label="Next">❯</button>',
    }).on('init', function() {
        $(this).removeClass('loading');
        updateSliderLayout();
    });

    // Обработчик для снятия фокуса с кнопок
    $(document).on('touchstart click', '.slick-prev, .slick-next', function(e) {
        e.preventDefault();
        $(this).blur();
        // Небольшая задержка для гарантированного срабатывания на мобильных
        setTimeout(() => $(this).blur(), 200);
    });

    // Обновляем layout при изменении размера окна
    $(window).on('resize', function() {
        updateSliderLayout();
        $slider.slick('refresh');
    });

    updateSliderLayout();
});