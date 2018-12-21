//Links
var quakeLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(quakeLink, function(data) {
    features(data.features);
  });

function features(earthquakeData) {       
  var earthquakes = L.geoJson(earthquakeData, {
    onEachFeature: function (feature, layer){
      layer.bindPopup(feature.properties.place + "<br>Magnitude: " + feature.properties.mag +
      "<p>" + new Date(feature.properties.time) + "</p>");
    },
    pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: radius(feature.properties.mag),
          fillColor: color(feature.properties.mag),
          fillOpacity: .75,
          stroke: true,
          color: "black",
          weight: .5
      })
    }
  });
  createMap(earthquakes)
}

function createMap(earthquakes) {
  // map layers
  var satelliteMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 19,
      id: 'mapbox.satellite',
      accessToken: API_KEY
        }); 
 
  var lightMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 19,
      id: 'mapbox.light',
      accessToken: API_KEY
        }); 

  // Define baseMaps object to hold layers
  var baseMaps = {
    "Satellite Map": satelliteMap,
    "Light Map": lightMap
  };

  // Create overlay object to hold overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
  };

  // Create map
  var myMap = L.map("map", {
    center: [32.0, -8.00],
    zoom: 2.5,
    layers: [satelliteMap, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Create legend
  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
              grades = [0, 1, 2, 3, 4, 5],
              labels = [];

  // loop through and create label
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + color(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap);
}

function color(d) {
  return d > 5 ? 'red':
  d > 4  ? 'darkorange':
  d > 3  ? 'orange':
  d > 2  ? 'gold':
  d > 1   ? 'yellow':
            'limegreen';
}

function radius(value){
  return value*35000
}