function setMapSize(element, maxHeight){
    var bbox = element.getBoundingClientRect();
    var maxHeight = maxHeight || 500;
    var width = maxHeight;
    if (bbox.width < maxHeight){ width = bbox.width; }
    // bbox.width = width;
    // bbox.height = width;

    // element.style.width = width + "px";
    // element.style.height = (width * 1) + "px";    
}

setMapSize(document.getElementById("map"), 400);

mapboxgl.accessToken =
    'pk.eyJ1IjoiYm9yemVjaG93c2tpIiwiYSI6Ik41S1pqVVkifQ.BuVnOmOsPKj5wStdRCCxrw';

var map = new mapboxgl.Map({
    container: 'map',
    // style: 'mapbox://styles/mapbox/streets-v9',
    style:"mapbox://styles/borzechowski/cjndcq79y1gqe2spt6j7aej6w",
    // style:"mapbox://styles/borzechowski/cjndjah7t194f2so4z0gkmu8f",
    zoom: 13,
    // center: [-72.7575, 41.5178],
    center:[-73.2,41.16],
    interactive: false
});

var bridgeportBounds = [[-73.22145767211903,41.14384307322598],
			[-73.17854232788326,41.17615294478452]]


var floodLevels = [
    {
	feet: 6,
	url:'mapbox://borzechowski.5yth1s3m',
	layer:"ct_slr_6ft-cbqhj5",
    },
    {
	feet: 5,
	url:"mapbox://borzechowski.29t008b4",
	layer:"ct_slr_5ft-ddyrve",
    },
    {
	feet: 4,
	url:'mapbox://borzechowski.8rh1nnna',
	layer:"ct_slr_4ft-65vhru",
    },
    {
	feet: 3,
	url:"mapbox://borzechowski.2k5ehn2q",
	layer:"ct_slr_3ft-0r9n0z"
    },
    {
	feet: 2,
	url:"mapbox://borzechowski.1euh68zg",
	layer:"ct_slr_2ft-8315e3",
    },
    {
	feet: 1,
	url:"mapbox://borzechowski.aidm87nz",
	layer:"ct_slr_1ft-8c0g6o"
    },
    {
	feet: 0,
	url:"mapbox://borzechowski.11yryp78",
	layer:"ct_slr_0ft-4oof2c"
    },
    
];

function layerId(x){
    return "flooding-" + x.feet;
}

map.on('load', function () {

    function addPoints(x, props){
	
	map.addLayer(Object.assign({
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

	map.on('click', x.id,function (e) {
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
	

    function addLayer(x, props){

	var props = props || {};
	
	map.addLayer(Object.assign({
            'id': layerId(x),
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
		// "fill-outline-color":"indianred",		
		'fill-color':"rgba(129,193,238,0.7)",
		// 'fill-color':"rgba(120,0,0,0.25)",
		// "fill-color":"rgba(0,0,0,0.75)",
		// "fill-color":"rgba(49, 117, 165,0.75)",		
		// "fill-color":"rgba(240,240,240,0.75)",
		// "fill-color":"rgba(240,240,100,0.75)"
		
            }
	}, props));
    }

    var i;
    for ( i in floodLevels.reverse()){
	var level = floodLevels[i];
	addLayer(level);
    }

    map.addControl(new mapboxgl.ScaleControl({
	unit: 'imperial',
    }));

    map.addControl(new mapboxgl.FullscreenControl());
    map.dragPan.enable();
    
    var nav = new mapboxgl.NavigationControl({
	"showCompass":false,
    });
    map.addControl(nav, 'top-left');

    map.fitBounds(bridgeportBounds);
    // map.addControl(new mapboxgl.Scale({position: 'bottom-right'}));

    // add power plant points
    addPoints({
	id:"power-plants",
	layer:"PowerPlants_US_EIA-5w7j2e",
	url:"mapbox://borzechowski.9sf3lhbl",
	description:function(e){
	    return 	    "<div>" + e.features[0].properties.Plant_Name + "</div>" 
		+ "<div>" + e.features[0].properties.Utility_Na + "</div>"
		+ "<div><div>" + e.features[0].properties.source_des.split(", ").join("</div><div>") + "</div></div>";

	},
    });


    // add power petroleum points
    addPoints({
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
	    // "circle-stroke-color":"black"
	}
    });

});

// var toggleableLayerIds = [ 'contours', 'flooding' ];
var toggleableLayerIds = floodLevels.slice(0,floodLevels.length).map(layerId);


var slider = document.getElementById("level-slider");
var animateButton = document.getElementById("animate-button");

function hideFloodLevel(n){
    if (n < 0 || n > 6) { return };     
    map.setLayoutProperty("flooding-" + n, 'visibility', 'none');    
}

function hideAllFloodLevels(except){
    var except = except || -100;
    var i;
    for (i = 0; i < 7; i++){
	if (i === Number(except)) {
	    console.log("Not hiding", i, except);
	    continue;
	}
	hideFloodLevel(i);
    }
}

function showFloodLevel(n){
    if (n < 0 || n > 6) { return }; 
    map.setLayoutProperty("flooding-" + n, 'visibility', 'visible');    
}

var interval;

function animate(){
    interval = setInterval(function(){
	var nextVal = ((Number(slider.value) + 1) % 7);
	slider.value = nextVal;
	updateFloodLevelFromSlider();
    }, 1500);

    animateButton.innerHTML = "stop" ;

}

function stop(){
    clearInterval(interval);

    animateButton.innerHTML ="start";
    
}

function setFloodLevelTo(n){
    // hide all flood levels
    showFloodLevel(n);
    hideAllFloodLevels(n);    
}

function updateFloodLevelFromSlider(){
    setFloodLevelTo(document.getElementById("level-slider").value);
}

var slider = document.getElementById("level-slider");

function toggleAnimation(){
    if (animateButton.innerHTML === "start") { animate(); }
    else { stop() };
}

if (slider.addEventListener) {
    slider.addEventListener("change", updateFloodLevelFromSlider, false);
    animateButton.addEventListener("click", toggleAnimation);
}
else if (slider.attachEvent) {
    slider.attachEvent('change', updateFloodLevelFromSlider);
    animateButton.attachEvent("click", toggleAnimation);
}



