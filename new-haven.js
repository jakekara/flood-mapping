var ne = { lng: -72.90070759386289,
	   lat: 41.316586010958815 };
var se = { lng: -72.95599272510451,
	   lat: 41.279390474682884 }

var cityBounds = [[ne.lng, ne.lat], [se.lng, se.lat]]; 
var city = (new FloodMap(cityBounds)).drawIn("map");

