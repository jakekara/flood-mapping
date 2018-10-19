mapboxgl.accessToken =
    'pk.eyJ1IjoiYm9yemVjaG93c2tpIiwiYSI6Ik41S1pqVVkifQ.BuVnOmOsPKj5wStdRCCxrw';

class FloodMap {
    constructor ( bounds ){
	this.bounds = bounds;
	this.toggleControls = [];
    }

    addLayer(properties){
	this.map.addLayer(properties);
    }

    addPoints(x, props){
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

    addFloodLayers(){
	console.log("this.addFloodLayers", this);
	var i;
	for (i in floodLevels.reverse()){
	    this.addToggleLayer(floodLevels[i]);
	}
	this.toggleControls[0].showLayer();
    }

    addToggleLayer(x){

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
	
	var ctrl = new toggleLayerControl(
	    properties.id,
	    this.map,	    
	    floodLayerLabel(x),
	    callback
	);
	
	this.toggleControls.push(ctrl);
	
	this.map.addControl(ctrl, "top-left");
    }

    floodLayerProperties(x){

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
		'fill-color':"rgba(129,193,238,0.7)",
            }
	};
	
    }

    finishDrawing(){
	// set the bounds
	if (this.bounds) { this.map.fitBounds(this.bounds);}

	// add the flood layers
	this.addFloodLayers();

	// add the full screen button
	this.map.addControl(new mapboxgl.FullscreenControl(),
			    "bottom-right");

	// add the zoom controls
	this.map.addControl(
	    new mapboxgl.NavigationControl({"showCompass":false,}),
	    "bottom-right"
	);	

	// add power plant points
	this.addPoints({
	    id:"power-plants",
	    layer:"PowerPlants_US_EIA-5w7j2e",
	    url:"mapbox://borzechowski.9sf3lhbl",
	    description:function(e){
		return "<div>" + e.features[0].properties.Plant_Name + "</div>" 
		    + "<div>" + e.features[0].properties.Utility_Na + "</div>"
		    + "<div><div>" + e.features[0].properties.source_des.split(", ").join("</div><div>") + "</div></div>";
	    },
	});

	// add power petroleum points
	this.addPoints({
	    id:"petrol",
	    layer:"PetroleumProduct_Terminals_US-1wef9u",
	    url:"mapbox://borzechowski.43r5vjss",
	    description:function(e){
		return "<div>" + e.features[0].properties.Company + "</div>" 
	    }
	},{
	    "paint":{
		"circle-color":"black",
		"circle-radius":6,
	    }
	});
	
	

	// add the flood controls

	this.map.dragPan.enable();
	this.map.doubleClickZoom.enable();	
	
	
    }

    drawIn(container){

	var ctx = this;

	// draw the map
	this.map = new mapboxgl.Map({
	    container: 'map',
	    style:"mapbox://styles/borzechowski/cjndcq79y1gqe2spt6j7aej6w",
	    zoom: 13,
	    center:[-73.2,41.16],
	    interactive: false
	});

	this.map.on("load", function(){
	    ctx.finishDrawing.call(ctx);
	})
    }
}
