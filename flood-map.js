"use strict";

mapboxgl.accessToken =
    'pk.eyJ1IjoiYm9yemVjaG93c2tpIiwiYSI6Ik41S1pqVVkifQ.BuVnOmOsPKj5wStdRCCxrw';

function FloodMap( initialBounds, maxBounds, zoom ){

    this.zoom = zoom || 13;
    this.bounds = initialBounds;
    this.maxBounds = maxBounds || this.shorelineBounds;
    this.toggleControls = [];

    this.center = [(initialBounds[0][0] + initialBounds[1][0]) / 2,
		   (initialBounds[0][1] + initialBounds[1][1]) / 2,]
}

FloodMap.prototype.shorlineBounds = function(){
    var coast = {
	"north_lat": 42.05,
	"south_lat": 40.9,
	"east_lon": -71.7,
	"west_lon": -73.7
    };

    var ne = { "lng": -73.13589520455609, "lat": 41.1761529447902 }
    var sw = { "lng": -73.26410479545885, "lat": 41.14384307323357 }

    return [
	[coast.west_lon, coast.south_lat],
	[coast.east_lon, coast.north_lat]
    ]
    
}

FloodMap.prototype.addLayer = function(properties){
    this.map.addLayer(properties);
}

FloodMap.prototype.addPoints = function(x, props){
    this.addLayer(Object.assign({
        'id': x.id,
        'type': 'circle',
        'source': {
	    'type':'vector',
	    'url':x.url,
	},
        'source-layer': x.layer,
        'layout': {
	    'visibility': 'visible',
        },
        'paint': {
	    'circle-radius': 6,
	    // "circle-stroke-color":"black",
	    // 'circle-stroke-width':2,
	    'circle-color': 'gold'
	}
    }, props));

    var map = this.map;
    
    this.map.on('click', x.id, function (e) {
	if (! x.description){ return }
	var coordinates = e.features[0].geometry.coordinates.slice();
	var description = x.description(e);

	// Ensure that if the map is zoomed out such that multiple
	// copies of the feature are visible, the popup appears
	// over the copy being pointed to.
	while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
	    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
	}

	new mapboxgl.Popup()
	    .setLngLat(coordinates)
	    .setHTML(description)
	    .addTo(map);
    });
    
    
}

FloodMap.prototype.addFloodLayers = function(){

    var i;
    // for (i in floodLevels.reverse()){
    for (i in floodLevels){// .reverse()){	
	this.addToggleLayer(floodLevels[i]);
    }
    this.toggleControls[0].showLayer();
}

FloodMap.prototype.addToggleLayer = function(x){

    var ctx = this;

    function callback(){
	var i;
	for (i in ctx.toggleControls){
	    var ctrl = ctx.toggleControls[i];
	    ctrl.hideLayer.call(ctrl);
	}
    }
    
    var properties = this.floodLayerProperties(x);

    this.addLayer(properties);
    
    var ctrl = new ToggleLayerControl(
	properties.id,
	this.map,	    
	floodLayerLabel(x),
	callback
    );


    
    this.toggleControls.push(ctrl);
    
    this.map.addControl(ctrl, "top-left");
    
    ctrl.container.classList.add("toggle-control");	
}

FloodMap.prototype.floodLayerProperties = function(x){

    return{
        'id': floodLayerId(x),
        'type': 'fill',
        'source': {
	    'type':'vector',
	    'url':x.url,
	},
        'source-layer': x.layer,
        'layout': {
	    'visibility': 'none',
        },
        'paint': {
	    "fill-antialias":true,
	    "fill-outline-color":"black",
	    // "fill-outline-color":"orange",		
	    'fill-color':"rgba(129,193,238,0.7)",
        }
    };
    
}

FloodMap.prototype.finishDrawing = function(){
    // set the bounds
    if (this.bounds) { this.map.fitBounds(this.bounds);}

    // add the flood layers
    this.addFloodLayers();

    // add re-center control
    var that = this;    
    this.map.addControl(new RecenterControl(this.map,
					    function(){ that.recenter.call(that);},
					   ),"top-right");

    // add the interactivity toggle control
    var panCtrl = new PanToggleControl(this.map);
    this.map.addControl( panCtrl, "top-right");
    panCtrl.container.classList.add("off");



    // // add the full screen button
    // this.map.addControl(new mapboxgl.FullscreenControl(),
    // 			"bottom-right");

    // add the zoom controlsn
    this.map.addControl(
	new mapboxgl.NavigationControl({"showCompass":false,}),
	"top-right"
    );	

    // add power plant points
    this.addPoints({
	id:"power-plants",
	layer:"PowerPlants_US_EIA-5w7j2e",
	url:"mapbox://borzechowski.9sf3lhbl",
	description:function(e){
	    return "<div><strong>Power plant</strong></div>"
		+ "<div>" + e.features[0].properties.Plant_Name + "</div>" 
		+ "<div>" + e.features[0].properties.Utility_Na + "</div>"
		+ "<div><div>" + e.features[0].properties.source_des.split(", ").join("</div><div>") + "</div></div>";
	},
    },{
	"paint":{
	    "circle-color":"gold",
	    "circle-radius":6,
	    "circle-stroke-color":"black",
	    "circle-stroke-width":1
	}	    
    });

    this.map.setFilter('power-plants', ['==', 'StateName', 'Connecticut']);    

    // add power petroleum points
    this.addPoints({
	id:"petrol",
	layer:"PetroleumProduct_Terminals_US-1wef9u",
	url:"mapbox://borzechowski.43r5vjss",
	description:function(e){
	    return "<div><h6>Petroleum terminal</h6></div>"
	    + "<div>" + e.features[0].properties.Company + "</div>" 
	}
    },{
	"paint":{
	    "circle-color":"tomato",
	    "circle-radius":6,
	    "circle-stroke-color":"black",
	    "circle-stroke-width":1
	}
    });

    this.map.setFilter('petrol', ['==', 'State', 'CT']);
    

    // add raised houses
    this.addPoints({
	id:"lifts",
	layer:"Houselifts-4ljsh3",
	url:"mapbox://borzechowski.6wn1cc21",
	description:function(e){
	    return "<div>House lifted in "
		+ e.features[0].properties.YEAR
		+ "</div>" ;
	}
    },{
	"paint":{
	    "circle-color":"magenta",
	    "circle-radius":6,
	    "circle-stroke-color":"black",
	    "circle-stroke-width":1
	}
    });
    
    // add the flood controls

    // this.map.dragPan.enable();
    // this.map.doubleClickZoom.enable();	
}

FloodMap.prototype.recenter = function(){
    this.map.setCenter(this.center);
    // this.map.setMaxBounds(this.maxBounds);
    this.map.setZoom(this.zoom);
}

FloodMap.prototype.drawIn = function(container){

    // add chatter and
    var explainer = document.getElementById("explainer");
    explainer.textContent = "This map shows flood inundation at various levels of sea level rise based on National Oceanic and Atmospheric Assoication data."

    var ctx = this;

    // draw the map
    this.map = new mapboxgl.Map({
	container: 'map',
	style:"mapbox://styles/borzechowski/cjndcq79y1gqe2spt6j7aej6w",
	zoom: this.zoom,
	center: this.center || [-73.2,41.16],
	interactive: false,
	maxBounds:this.maxBounds
    });


    this.map.on("load", function(){
	ctx.finishDrawing.call(ctx);
    })

    // this.recenter();

    return this;
}

