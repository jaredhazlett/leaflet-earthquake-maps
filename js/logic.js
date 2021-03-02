// Store our API endpoint as queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  console.log(data);
  // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map
});

function createMap(earthquakes) {
	//create the tile layer that will be the background of our map
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the streetmap layer
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Light Map": lightmap
  };

  // Create an overlayMaps object to hold the bikeStations layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create the map object with options
  var myMap = L.map("mapid", {
    center: [40.73, -74.0059],
    zoom: 12,
    layers: [streetmap, darkmap, lightmap, earthquakes]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
};

function createMarkers(response) {

  // Pull the "stations" property off of response.data
  console.log(response.features[0].geometry.coordinates[0]);
  // Initialize an array to hold bike markers
  var earthquakeMarkers = [];
  // Loop through the stations array
  for (var i = 0; i < response.features.length; i++) {
    var quakelat = response.features[i].geometry.coordinates[1];
    var quakelon = response.features[i].geometry.coordinates[0];
    // For each station, create a marker and bind a popup with the station's name
    var earthquakeMarker = L.marker([quakelat, quakelon])
      .bindPopup("<h3>Time: " + response.features[i].properties.time + "</h3><h3>Magnitude: " + response.features[i].properties.mag + "</h3>");
    // Add the marker to the bikeMarkers array
    earthquakeMarkers.push(earthquakeMarker);
  // Create a layer group made from the bike markers array, pass it into the createMap function
  }
  createMap(L.layerGroup(earthquakeMarkers));
}
// Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
d3.json(queryUrl, createMarkers);
