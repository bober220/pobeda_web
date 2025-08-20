$(document).ready(function () {
    const TOKEN = "y0__xCi8e8zGNbWOSDwwKORFBpqBdv8HDBYdkGDLVszdNHj3O1Q";
    const FOLDER = "disk:/СЛАЙДЫ";

    let finished = false;

    function finishLoading() {
        if (!finished) {
            $("body").addClass("loaded");
            finished = true;
        }
    }

    // --- страховочный таймер ---
    setTimeout(finishLoading, 10000); // увеличил до 10 сек, чтобы реально дождаться

    // Проверка токена
    $.ajax({
        url: "https://cloud-api.yandex.net/v1/disk/",
        headers: { Authorization: `OAuth ${TOKEN}` },
        success: function () {
            loadImages();
        },
        error: function (err) {
            console.error("❌ Ошибка авторизации:", err);
            finishLoading();
        }
    });

    function loadImages() {
        $.ajax({
            url: "https://cloud-api.yandex.net/v1/disk/resources",
            method: "GET",
            data: { path: FOLDER, limit: 100 },
            headers: { Authorization: `OAuth ${TOKEN}` },
            success: function (data) {
                const slider = $(".slider");
                slider.empty();

                if (!data._embedded || !data._embedded.items) {
                    console.error("❌ В папке нет файлов");
                    finishLoading();
                    return;
                }

                const imageFiles = data._embedded.items.filter(item =>
                    item.type === "file" && item.mime_type.startsWith("image/")
                );

                if (imageFiles.length === 0) {
                    finishLoading();
                    return;
                }

                const promises = imageFiles.map(item => {
                    return new Promise((resolve, reject) => {
                        $.ajax({
                            url: item.file,
                            method: "GET",
                            headers: { Authorization: `OAuth ${TOKEN}` },
                            xhrFields: { responseType: "blob" },
                            success: function (blob) {
                                const url = URL.createObjectURL(blob);
                                resolve({ name: item.name, url });
                            },
                            error: function (err) {
                                reject(err);
                            }
                        });
                    });
                });

                Promise.all(promises).then(results => {
                    results.forEach(img => {
                        slider.append(`
                            <div class="slider__item">
                                <img src="${img.url}" alt="${img.name}" />
                            </div>
                        `);
                    });

                    initSlick(slider);

                    // ⬇️ ДОЖИДАЕМСЯ загрузки всех <img> в слайдере
                    const imgs = slider.find("img");
                    let loadedCount = 0;

                    imgs.each(function () {
                        if (this.complete) {
                            loadedCount++;
                            if (loadedCount === imgs.length) finishLoading();
                        } else {
                            $(this).on("load error", function () {
                                loadedCount++;
                                if (loadedCount === imgs.length) finishLoading();
                            });
                        }
                    });
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
            arrows: true, // включаем стрелки
            prevArrow: '<button type="button" class="slick-prev">❮</button>',
            nextArrow: '<button type="button" class="slick-next">❯</button>',
            dots: true,
            dotsClass: 'slick-dots',
            adaptiveHeight: false,
            autoplay: true,
            autoplaySpeed: 5000,
            speed: 400,
            mobileFirst: true,
            responsive: [
                { breakpoint: 768, settings: { arrows: true, speed: 350 } },
                { breakpoint: 480, settings: { arrows: true, speed: 300 } },
                { breakpoint: 1024, settings: { arrows: true } }
            ]
        });
    }
});