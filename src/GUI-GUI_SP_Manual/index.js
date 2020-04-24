import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';
import Point from 'ol/geom/Point';
import {transform} from 'ol/proj';
import Circle from 'ol/geom/Circle';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {click, pointerMove, altKeyOnly} from 'ol/events/condition';
import Select from 'ol/interaction/Select';

// import GreenwichLayer from "./Greenwich_nodes_3857.geojson";
// import NodesLayer from "./Nodes_3857.geojson";
import boundaries_geojson from './area_boundaries.geojson';

import axios from 'axios';

// const axios = require('axios');

var startPoint = []
var destPoint = []

function get_points_backend(){
  axios.get('http://localhost:5000/getsourcedestinationmanual').then(resp => {
      console.log(resp.data['result']['source'][0], "Axios");
      console.log(resp.data['result']['destination'][0]);
      startPoint = resp.data['result']['source'][0];
      destPoint = resp.data['result']['destination'][0];
      console.log(startPoint, destPoint, "Points1");
      setPoint();
});
};
// ===============================================================
// Area-wise Split
var styles_area= {
  'MultiLineString': new Style({
    stroke: new Stroke({
      color: 'yellow',
      width: 2
    })
  })
};

var styleFunction_area = function(feature) {
  // console.log(feature.getGeometry(), "HI");
  return styles_area[feature.getGeometry().getType()];
};

var vectorLayer_area = new VectorLayer({
  source: new VectorSource({
    url: boundaries_geojson,
    format: new GeoJSON()
  }),
  style: styleFunction_area 
});

// ===============================================================
// MAIN MAP TO DISPLAY

const map = new Map({
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    vectorLayer_area
    // new VectorLayer({
    //   source: new VectorSource({
    //     url: GreenwichLayer,
    //     format: new GeoJSON()
    //   }),
    //   style: styleFunction 
    // })
  ],
  target: 'map',
  view: new View({
    center: [-13833.6035, 6711384.4043],
    zoom: 8,
    minZoom: 2,
    extent: [-56937.92, 6671958.72, 37340.68, 6744884.15]
  })
});


// ===============================================================
//TO GET PATH

// ===============================================================
//TO SELECT START AND END NODES

var image_start_dest = new CircleStyle({
    radius: 7,
    fill: new Fill({
      color: 'rgba(255, 255, 255, 1)'
    }),
    stroke: new Stroke({color: 'dodgerblue', width: 5})
  });
  
var styles_start_dest = {
  'Point': new Style({
    image: image_start_dest
  })
};

var styleFunction_start_dest = function(feature) {
    console.log(feature.getGeometry(), "HI");
    return styles_start_dest[feature.getGeometry().getType()];
};

// ==================TODO GET NODES HERE==============

get_points_backend();

// From backend lat, lon of stuff, These are hard-coded
function setPoint(){
  console.log(startPoint, destPoint, "Points2");

  var startPoint_3857 = new Feature();
  startPoint_3857.setGeometry(new Point(startPoint));
  var startCoord_3857 = transform(startPoint_3857.getGeometry().getCoordinates(), 'EPSG:4326', 'EPSG:3857');

  var destPoint_3857 = new Feature();
  destPoint_3857.setGeometry(new Point(destPoint));
  var destCoord_3857 = transform(destPoint_3857.getGeometry().getCoordinates(), 'EPSG:4326', 'EPSG:3857');


  console.log(startPoint, "StartPoint");
  console.log(destPoint);

  var geojsonObject_2Nodes = {
  'type': 'FeatureCollection',
  'crs': {
    'type': 'name',
    'properties': {
      'name': 'EPSG:3857'
    }
  },
  'features': [{
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': startCoord_3857
    }
  }, {
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': destCoord_3857
    }
  }]
  };

  var vectorSource_2Nodes = new VectorSource({
  features: (new GeoJSON()).readFeatures(geojsonObject_2Nodes)
  });

  var vectorLayer_2Nodes = new VectorLayer({
  source: vectorSource_2Nodes,
  style: styleFunction_start_dest
  });

  map.addLayer(vectorLayer_2Nodes);

  const coordinates = {
  x1 : startPoint[0],
  y1 : startPoint[1],
  x2 : destPoint[0],
  y2 : destPoint[1],
  };

  console.log(coordinates);
}

// Clear Button

var clearButton = document.getElementById('clear');

clearButton.addEventListener('click', function(e) {
    // Reset the "start" and "destination" features.
    startPoint.setGeometry(null);
    destPoint.setGeometry(null);
    // Remove the result layer.
    console.log("Reset");
    console.log("params", viewparams);
    select = Select();
    map.removeLayer(vectorLayer_2Nodes);
});

// Submit Button

var SubmitButton = document.getElementById('submit');

SubmitButton.addEventListener('click', function(e) {
  // var startCoord = transform(startPoint.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
  // var destCoord = transform(destPoint.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
  console.log(startPoint, destPoint, "Points3");
  const coordinates = {
    x1 : startPoint[0],
    y1 : startPoint[1],
    x2 : destPoint[0],
    y2 : destPoint[1],
  }
      console.log(coordinates)
      axios.post('http://127.0.0.1:5000/shortestpath', coordinates)
         .then(response => {
            console.log(response.data, "Backend");
            
            // map.removeLayer(vectorLayer_2Nodes);
            // map.removeLayer(vectorLayer);
            console.log("removed");
          
            
            var styles_sp = {
              'LineString': new Style({
                stroke: new Stroke({
                  color: 'blue',
                  width: 8
                })
              }),
              'MultiLineString': new Style({
                stroke: new Stroke({
                  color: 'blue',
                  width: 8
                })
              })
            };
            
            var styleFunction_sp = function(feature) {
              console.log(feature.getGeometry().getType());
              return styles_sp[feature.getGeometry().getType()];
            };

            
            var path_length = new Array(response.data["sp_length"]);
            // var path_length = response.data["result"];
            console.log(path_length, "path_length");

            var geojsonObject_length = {
              'type': 'FeatureCollection',
              'features': path_length
            };
            console.log((new GeoJSON()).readFeatures(geojsonObject_length) +"GJ");
            
            var vectorSource_sp = new VectorSource({
              features: (new GeoJSON()).readFeatures(geojsonObject_length)
            });
            // console.log(vectorSource_sp);
            
            var vectorLayer_sp = new VectorLayer({
              source: vectorSource_sp,
              style: styleFunction_sp
            });
            // console.log(vectorLayer_sp);

            map.addLayer(vectorLayer_sp);

            // for shortest path by cfp
            var styles_sp_cfp = {
              'LineString': new Style({
                stroke: new Stroke({
                  color: 'red',
                  width: 8
                })
              }),
              'MultiLineString': new Style({
                stroke: new Stroke({
                  color: 'red',
                  width: 8
                })
              })
            };
            
            var styleFunction_sp_cfp = function(feature) {
              console.log(feature.getGeometry().getType());
              return styles_sp_cfp[feature.getGeometry().getType()];
            };

            
            var path_length_cfp = new Array(response.data["sp_cfp"]);
            // var path_length = response.data["result"];
            console.log(path_length_cfp, "path_length_cfp");

            var geojsonObject_length_cfp = {
              'type': 'FeatureCollection',
              'features': path_length_cfp
            };
            console.log((new GeoJSON()).readFeatures(geojsonObject_length_cfp) +"GJ");
            
            var vectorSource_sp_cfp = new VectorSource({
              features: (new GeoJSON()).readFeatures(geojsonObject_length_cfp)
            });
            // console.log(vectorSource_sp);
            
            var vectorLayer_sp_cfp = new VectorLayer({
              source: vectorSource_sp_cfp,
              style: styleFunction_sp_cfp
            });
            // console.log(vectorLayer_sp);

            map.addLayer(vectorLayer_sp_cfp);
         })
         
});
