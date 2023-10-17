let map = L.map('map',{
    center: [40.7, -94.5],
    zoom: 3
});

/// Title Layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let response = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

d3.json(response).then(function(data){

    function styleInfo(feature){
        return{
            opacity: 0.5,
            fillOpacity: 0.8,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: getColor(feature.geometry.coordinates[2]),
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    };


    function getColor(depth){
        switch(true){
            case depth > 100:
                return "#000000";
            case depth > 90:
                return "#8B0000";
            case depth > 80:
                return "#B22222";
            case depth > 70:
                return "#CD5C5C";
            case depth > 60:
                return "#DC143C";
            case depth > 50:
                return "#FF4500";
            case depth > 40:
                return "#FF6347";
            case depth > 30:
                return "#FF7F50";
            case depth > 20:
                return "#FFA07A";
            case depth > 10:
                return "#ADFF2F";
            default:
                return "#98FB98";
                
        };
    };




    function getRadius(magnitude){
        if (magnitude === 0){
            return 1;
        }
        return magnitude * 6;
    };



    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function(feature, layer){
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + "<br>Location: " + feature.properties.place);
        }
    }).addTo(map);


    let legend = L.control({
        position: "bottomright"
    });


    legend.onAdd = function(){
        let div = L.DomUtil.create("div", "info legend");

        let grades = [-10, 10, 20, 30, 50, 70, 90];
        let colors = [
            "#98FB98",
            "#ADFF2F",
            "#FFA07A",
            "#FF7F50",
            "#FF4500",
            "#CD5C5C",
            "#8B0000"
        ];
        

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
            "<i style='background: " + colors[i] + "'></i> " +
            grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;


    };



    legend.addTo(map);


});