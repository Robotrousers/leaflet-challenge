//store api endpoint as url
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

//get request
d3.json(url).then(function(data){
    createFeatures(data.features)
});

// create a map centered on the US
let myMap = L.map("map", {
    center: [37.0902, -95.7129],
    zoom: 5
  });


// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// markers should reflect the magnitude of the earthquake by their size
// and the depth of the earthquake by color - depth is 3rd coord
// https://colorbrewer2.org/#type=diverging&scheme=RdYlGn&n=6

// marker size and made it bigger for easier viewing
function markerSize(mag) {
    return mag * 5;
}

function markerColor(depth) {
    return depth > 90 ? "#d73027" :
           depth > 70 ? "#fc8d59" :
           depth > 50 ? "#fee08b" :
           depth > 30 ? "#d9ef8b" :
           depth > 10 ? "#91cf60" :
                        "#1a9850";
}

// features
function createFeatures(quakeData) {
    quakeData.forEach(feature => {
        let size = feature.properties.mag;
        let depth = feature.geometry.coordinates[2];
        let time = feature.properties.time;
        let url= feature.properties.url;
        let latlng = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];

        L.circleMarker(latlng, {
            radius: markerSize(size),
            fillColor: markerColor(depth),
            color: "#000",
            weight: .5,
            fillOpacity: .75
        }).bindPopup(
            "<h3>Location: " + feature.properties.place + "</h3>" +
            "<hr>" +
            "<p>Magnitude: " + size + "</p>" +
            "<p>Depth: " + depth + "km</p>" +
            "<p>Date: " + new Date(time) + "</p>" +
            "<p>Link: <a href='" + url + "' target='_blank'>More Info on This Quake</a></p>"
        ).addTo(myMap);
    });
    
    // add legend for depth color scale
    addLegend();
}

// add legend to the map
function addLegend() {
    let legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "legend");
        let depthValue = [-10, 10, 30, 50, 70, 90];
        let colors = ["#1a9850", "#91cf60", "#d9ef8b", "#fee08b", "#fc8d59", "#d73027"];

        // style block as the legend bars
        let style = document.createElement('style');
        style.innerHTML = `
            .legend i {
                display: inline-block;
                width: 20px;
                height: 10px;
            }
        `;
        document.head.appendChild(style);

        for (let i = 0; i < depthValue.length; i++) {
            div.innerHTML += "<i style='background: " + colors[i] + "'></i> " + depthValue[i] + (depthValue[i + 1] ? " - " + depthValue[i + 1] : "+") + "<br>";
          }

        return div;
    };

    // add legend to map
    legend.addTo(myMap);
}











// check reference of the data:
// {"type":"FeatureCollection","metadata":
//     {"generated":1727203630000,
//     "url":"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson",
//     "title":"USGS All Earthquakes, Past Month",
//     "status":200,
//     "api":"1.10.3",
//     "count":9708},
//     "features":
//     [{"type":"Feature","properties":
//         {"mag":1.32,
//         "place":"24 km SW of Ocotillo Wells, CA",
//         "time":1727202579540,
//         "updated":1727202946902,"tz":null,
//         "url":"https://earthquake.usgs.gov/earthquakes/eventpage/ci40744351",
//         "detail":"https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/ci40744351.geojson",
//         "felt":null,
//         "cdi":null,
//         "mmi":null,
//         "alert":null,
//         "status":"automatic",
//         "tsunami":0,"sig":27,
//         "net":"ci",
//         "code":"40744351",
//         "ids":",ci40744351,",
//         "sources":",ci,",
//         "types":",nearby-cities,origin,phase-data,scitech-link,",
//         "nst":58,
//         "dmin":0.03061,
//         "rms":0.19,
//         "gap":38,"magType":"ml",
//         "type":"earthquake",
//         "title":"M 1.3 - 24 km SW of Ocotillo Wells, CA"},
//         "geometry":
//             {"type":"Point","coordinates":[-116.3138333,32.984,8.2]},
//         "id":"ci40744351"},