let map = L.map('map',{
    center: [40.7, -94.5],
    zoom: 2.5
});

/// Title Layer
// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://opentopomap.org/">OpenTopoMap</a>'
}).addTo(map);


let response = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"



/// initialize response to get data
d3.json(response).then(function(data){



    /// define style of the markers
    function styleInfo(feature){
        return{
            opacity: 1,
            fillOpacity: 0.6,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: getColor(feature.geometry.coordinates[2]),
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    };

    /// define color of the markers
    function getColor(depth){

        /// switch statement to define color of the markers by depth of the earthquake
        switch(true){
            case depth > 100:
                return "#000000";
            case depth > 90:
                return "#4B0082";
            case depth > 80:
                return "#9400D3";
            case depth > 70:
                return "#4169E1";
            case depth > 60:
                return "#FF0000";
            case depth > 50:
                return "#FF4500";
            case depth > 40:
                return "#FFA500";
            case depth > 30:
                return "#FFFF00";
            case depth > 20:
                return "#00FF00";
            case depth > 10:
                return "#7CFC00";
            default:
                return "#ADFF2F";
                
        };
    };



    /// define radius of the markers
    function getRadius(magnitude){
        if (magnitude === 0){
            return 1;
        }
        return magnitude * 6;
    };


    /// add GeoJSON layer to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function(feature, layer){
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + " KM" + "<br>Location: " + feature.properties.place);
        }
    }).addTo(map);



    /// create legend
    let legend = L.control({
        position: "bottomright"
    });



    /// add details to the legend by depht of the earthquake
    legend.onAdd = function(){
        let div = L.DomUtil.create("div", "info legend");

        div.innerHTML = '<h4>Earthquake Depth (Km)</h4>';

        let grades = [-10, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        let colors = [
            "#ADFF2F",
            "#7CFC00",
            "#00FF00",
            "#FFFF00",
            "#FFA500",
            "#FF4500",
            "#FF0000",
            "#4169E1",
            "#9400D3",
            "#4B0082",
            "#000000"   
        ];
        
        /// loop through the intervals to generate a label with a colored square for each interval of the legend
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
              '<i style="background:' + colors[i] + '; width: 10px; height: 10px; display: inline-block;  "></i>  '  +
              grades[i] + (grades[i + 1] ? " &ndash; " + grades[i + 1] + " <br>  " : " + ");
          }




          /// return the div with the legend
        return div;


    };


    /// add legend to the map
    legend.addTo(map);


});