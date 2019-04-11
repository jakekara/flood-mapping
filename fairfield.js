// var ne =  { lng: -73.16827610775258, lat: 41.15276828077705 },
//     sw = {lng: -73.34693013432226, lat: 41.11532190225492 }

var ne = { lng: -73.23527136772559, lat: 41.149130930413634 },
    sw = { lng: -73.27993487436534, lat: 41.118961127646344 };


var cityBounds = [[ne.lng, ne.lat], [sw.lng, sw.lat]]; 
var city = (new FloodMap(cityBounds)).drawIn("map");

