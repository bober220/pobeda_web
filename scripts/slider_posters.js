$(document).ready(function () {
    loadImages();

    function loadImages() {
        $.ajax({
            url: "http://localhost:3000/api/images",
            method: "GET",
            success: function (data) {
                if (!data._embedded || !data._embedded.items) {
                    console.error("❌ В папке нет файлов");
                    finishLoading();
                    return;
                }

                const slider = $(".slider");
                slider.empty();

                const imageFiles = data._embedded.items.filter(item =>
                    item.type === "file" && item.mime_type.startsWith("image/")
                );

                const promises = imageFiles.map(item => {
                    return new Promise((resolve, reject) => {
                        $.ajax({
                            url: item.file,
                            method: "GET",
                            xhrFields: { responseType: "blob" },
                            success: function (blob) {
                                const url = URL.createObjectURL(blob);
                                resolve({ name: item.name, url });
                            },
                            error: reject
                        });
                    });
                });

                Promise.all(promises).then(results => {
                    results.forEach(img => {
                        slider.append(`
                            <div class="slider__item">
                                <img src="${img.url}" alt="${img.name}">
                            </div>
                        `);
                    });

                    initSlick(slider);
                    finishLoading();
                }).catch(err => {
                    console.error("❌ Ошибка загрузки изображений:", err);
                    finishLoading();
                });
            },
            error: function (err) {
                console.error("❌ Ошибка при загрузке списка файлов:", err.responseText);
                finishLoading();
            }
        });
    }

    function initSlick(slider) {
        slider.slick({
            arrows: true,
            prevArrow: '<button type="button" class="slick-prev">❮</button>',
            nextArrow: '<button type="button" class="slick-next">❯</button>',
            dots: true,
            autoplay: true,
            autoplaySpeed: 5000,
            speed: 400
        });
    }

    function finishLoading() {
        $("body").removeClass("loading").addClass("loaded");
    }
});