import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import GeoJSON from "ol/format/GeoJSON";
import { Heatmap as HeatmapLayer, Tile as TileLayer } from "ol/layer";
import Stamen from "ol/source/Stamen";
import VectorSource from "ol/source/Vector";

import cfp_geojson from './cfpGeoJSON_rte.geojson';

var blur = document.getElementById("blur");
var radius = document.getElementById("radius");

// Read contents of geojson file
var content
var rawFile = new XMLHttpRequest();
rawFile.open("GET", cfp_geojson, false);
rawFile.onreadystatechange = function ()
{
    if(rawFile.readyState === 4)
    {
        if(rawFile.status === 200 || rawFile.status == 0)
        {
            content = rawFile.responseText;
            // console.log(content, "content");
        }
    }
}
rawFile.send(null);

//convert content to dictionary
var obj_content = JSON.parse(content);
// console.log(obj_content, "obj_content");

var min = 100000000;
var max = 0;

// TODO: Field will be catenation 2 strings : 1. Vehicle and 2. Year
var YearText = document.getElementById("year").value;
var v = document.getElementById("vehicle").value;

console.log(v)
console.log(YearText)

var field = v.concat(YearText);
// var field="motorcycles2010"
console.log(field)

for(var k in obj_content["features"]){
  if(obj_content["features"][k] instanceof Object){
    // console.log(obj_content["features"][k]["properties"][field]);
    if(obj_content["features"][k]["properties"][field]>=max){
      max = obj_content["features"][k]["properties"][field];
    }
    if(obj_content["features"][k]["properties"][field]<=min){
      min = obj_content["features"][k]["properties"][field];
    }

  }
}
console.log(min, max);
// console.log(obj_content["features"], "HI");

var vector = new HeatmapLayer({
  source: new VectorSource({
    url: cfp_geojson,
    format: new GeoJSON()
  }),
  blur: parseInt(blur.value, 10),
  radius: parseInt(radius.value, 10)
});

vector.getSource().on("addfeature", function(event) {

  console.log(event.feature.get(field));
  event.feature.set("weight", (event.feature.get(field)-min)/(max-min));
});

var raster = new TileLayer({
  source: new Stamen({
    layer: "toner"
  })
});

var map = new Map({
  layers: [raster, vector],
  target: "map",
  view: new View({
    center: [-13833.6035, 6711384.4043],
    zoom: 8,
    minZoom: 2,
    extent: [-56937.92, 6671958.72, 37340.68, 6744884.15]
  })
});

var blurHandler = function() {
  vector.setBlur(parseInt(blur.value, 10));
};
blur.addEventListener("input", blurHandler);
blur.addEventListener("change", blurHandler);

var radiusHandler = function() {
  vector.setRadius(parseInt(radius.value, 10));
};
radius.addEventListener("input", radiusHandler);
radius.addEventListener("change", radiusHandler);


var BackButton = document.getElementById('back');
BackButton.addEventListener('click', function(e) {
  // alert("clicked")
  // window.history.back();
  window.history.go(-3);
});

var SubmitButton = document.getElementById('submit');
SubmitButton.addEventListener('click', function(e) {
location.reload();
});
