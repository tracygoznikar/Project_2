// Choropleth layer summarizing meteorites by country

// Creating map object
var myMap = L.map("map", {
  center: [0, 0],
  zoom: 3
   
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
var pointData = urlbase + "/api/v1.0/map";
// initialize variables
var chorodata;
var pointcollection = []
var pointlist = []


// Grab data with d3
d3.json(geoData, function(data1){
  
// Create turf point feature collection 
d3.json(pointData, function(data2){
  for (let i = 0; i < data2.length; i++) {
    var point = turf.point([data2[i]['reclong'],data2[i]['reclat']], {id:data2[i].id, name:data2[i].name, mass: data2[i].mass });
    pointlist.push(point);
    pointcollection = turf.featureCollection(pointlist)
  };
// Find landing country for each meteorite
  // For each country
  for (let i= 0; i< data1.features.length; i++) {
    data1.features[i].properties.count = 0
    data1.features[i].properties.TotMass = 0
    data1.features[i].properties.largeName = ""
    data1.features[i].properties.largeMass = 0
    data1.features[i].properties.largeCoord = []
      // For each meteorite  
      for( let j = 0; j<pointlist.length; j++){
          var ptTest = turf.booleanPointInPolygon(pointlist[j], data1.features[i])
          // If meteorite is in country
          if (ptTest){
            // add meteorite to country's count and mass sum
            data1.features[i].properties.count += 1;
            data1.features[i].properties.TotMass += pointlist[j].properties.mass
            // if the meteorite is larger the the current largest meteorite in the country
            if(pointlist[j].properties.mass>data1.features[i].properties.largeMass){
             // replace largest meteorite with new largest
              data1.features[i].properties.largeName = pointlist[j].properties.name
              data1.features[i].properties.largeMass = pointlist[j].properties.mass
              data1.features[i].properties.largeCoord = pointlist[j].geometry.coordinates
            }
          }
          
 }
}
// Create array of meteorite counts to use in creating color scale
var countArr = []
for (let i= 0; i< data1.features.length; i++) {
  countArr.push(data1.features[i].properties.count)
}

  // Create a new choropleth layer
  // Based on https://leafletjs.com/examples/choropleth/
  // and https://github.com/schnerd/d3-scale-cluster

  //setup choropleth 
  function style(feature) {
    return {
        fillColor: scale(feature.properties.count),
        weight: .8,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7

}
    };

// Set color scale and breaks using Ckmeans
  var scale = d3
  .scaleCluster()
  .domain(countArr)
  .range(["#f5fdff", "#c8e2ed","#9ec7df","#78abd2","#598ec4","#4470b4","#3b51a1","#3c3088","#3f006b"]);

  // Add to map
  chorodata = L.geoJson(data1, {style: style,
    // Add popup on click
    onEachFeature: function(feature, layer) {
      layer.bindPopup( feature.properties.ADMIN + "<br>Meteorite Count: " +
        feature.properties.count + "<br>Largest Meteorite: " + feature.properties.largeName +
        "<br> Mass: " + feature.properties.largeMass/1000 + " Kg");
    }}
      ).addTo(myMap)
  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = scale.clusters();
    var colors = scale.range();
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Meteorite Landings</h1>" +
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

})
});



