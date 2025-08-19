function initSlick(slider) {
    slider.slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        dots: true,
        autoplay: true,
        autoplaySpeed: 3000,
        prevArrow: '<button type="button" class="slick-prev">❮</button>',
        nextArrow: '<button type="button" class="slick-next">❯</button>',
    });
}

function finishLoading() {
    document.body.classList.add("loaded");
}

document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:3000/api/images")
        .then((res) => res.json())
        .then((images) => {
            const slider = $(".slider");
            slider.empty();

            if (!images || images.length === 0) {
                slider.append(`<p>Нет изображений для отображения</p>`);
                finishLoading();
                return;
            }

            let loadedCount = 0;

            images.forEach((img) => {
                const imgElement = document.createElement("img");
                imgElement.src = `http://localhost:3000${img.url}`;
                imgElement.alt = img.name;

                imgElement.onload = () => {
                    loadedCount++;
                    if (loadedCount === images.length) {
                        initSlick(slider);
                        finishLoading();
                    }
                };

                imgElement.onerror = () => {
                    console.error(`❌ Ошибка загрузки изображения: ${img.name}`);
                    loadedCount++;
                    if (loadedCount === images.length) {
                        initSlick(slider);
                        finishLoading();
                    }
                };

                const wrapper = document.createElement("div");
                wrapper.classList.add("slider__item");
                wrapper.appendChild(imgElement);

                slider.append(wrapper);
            });
        })
        .catch((err) => {
            console.error("❌ Ошибка при загрузке списка файлов:", err);
            finishLoading();
        });
});