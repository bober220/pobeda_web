function init(){
    let map = new ymaps.Map('map', {
        center: [54.91159598661001,71.26765408090164],
        zoom: 17
    });

    let placemark = new ymaps.Placemark([54.911741775104126,71.26765056687246], {}, {

    });

    map.geoObjects.add(placemark)
}



ymaps.ready(init);