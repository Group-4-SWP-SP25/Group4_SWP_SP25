const platform = new H.service.Platform({
    'apikey': 'qn4R3GW87CxbHZJ6qJBdSj6QwyqmYNjaUcH2vnz7J6Q'
});
const defaultLayers = platform.createDefaultLayers();
const map = new H.Map(document.getElementById('map'),
    defaultLayers.vector.normal.map, {
    zoom: 13,
    center: { lat: 10.7769, lng: 106.7009 },
    pixelRatio: window.devicePixelRatio || 1
});

// Thêm khả năng tương tác như zoom, pan
const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
const ui = H.ui.UI.createDefault(map, defaultLayers);

// Thêm marker có thể kéo thả
let marker = new H.map.Marker({ lat: 10.7769, lng: 106.7009 }, { volatility: true });
marker.draggable = true;
map.addObject(marker);

// Sự kiện kéo thả marker
map.addEventListener("dragend", function (evt) {
    if (evt.target instanceof H.map.Marker) {
        let position = evt.target.getGeometry();
        console.log("Vị trí được chọn:", position.lat, position.lng);
    }
});

// Sự kiện click trên bản đồ để chọn vị trí
map.addEventListener("tap", function (evt) {
    let coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
    marker.setGeometry(coord);
    console.log("Vị trí được chọn:", coord.lat, coord.lng);
});