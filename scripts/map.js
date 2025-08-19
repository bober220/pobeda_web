async function loadMap() {
    try {
        const res = await fetch("http://localhost:3000/api/map-key");
        const data = await res.json();

        if (!data.key) throw new Error("Ключ карты не получен");

        // Динамически создаём <script> с api-key
        const script = document.createElement("script");
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${data.key}&lang=ru_RU`;
        script.onload = () => {
            ymaps.ready(initMap);
        };
        document.head.appendChild(script);

    } catch (err) {
        console.error("❌ Ошибка загрузки ключа карты:", err);
    }
}

function initMap() {
    let map = new ymaps.Map("map", {
        center: [54.91159598661001, 71.26765408090164],
        zoom: 17
    });

    let placemark = new ymaps.Placemark([54.911741775104126, 71.26765056687246], {}, {});
    map.geoObjects.add(placemark);
}

loadMap();