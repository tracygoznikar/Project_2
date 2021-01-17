// Choropleth layer summarizing meteorites by country

// Creating map object
var myMap = L.map("map", {
  center: [0, 0],
  zoom: 2
   
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: MapKey
}).addTo(myMap);

// Load in geojson data
var urlbase = "http://127.0.0.1:5000/";
var geoData = "static/data/countries.geojson"
var pointData = urlbase + "/api/v1.0/bubbles";
var geojson;
var pointlayer;
d3.json(geoData, function(data){
  console.log(data.features[1]["properties"]["ADMIN"])
})

d3.json(pointData, function(data){
  console.log(data[1]["name"])
})
// Tabulate meteorite data for countries
// Example of join by location (from polygons to point)
/*var pt1 = turf.point([-77, 44]);
var pt2 = turf.point([-77, 38]);
var poly1 = turf.polygon([[
  [-81, 41],
  [-81, 47],
  [-72, 47],
  [-72, 41],
  [-81, 41]
]], {pop: 3000});
var poly2 = turf.polygon([[
  [-81, 35],
  [-81, 41],
  [-72, 41],
  [-72, 35],
  [-81, 35]
]], {pop: 1000});

var points = turf.featureCollection([pt1, pt2]);
var polygons = turf.featureCollection([poly1, poly2]);

var tagged = turf.tag(points, polygons, 'pop', 'population');
*/
// Grab data with d3
d3.json(geoData, function(data) {

  // Create a new choropleth layer
  geojson = L.choropleth(data, {

    // Define what  property in the features to use
    valueProperty: "count",

    // Set color scale
    scale: ["#ebf0f2", "#04517a"],

    // Number of breaks in step range
    steps: 7,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },

    // Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup(feature.properties.ADMIN);
    }
    

  });
  myMap.addLayer(geojson);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Median Income</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
  // Add the layer control to the map
L.control.layers(baseMaps, overlayMaps).addTo(myMap);
});