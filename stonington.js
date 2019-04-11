var ne = { lng: -71.88595266195439, lat: 41.37286119000649 },
    sw ={ lng: -71.97871350139803, lat: 41.310494028221456 };


var cityBounds = [[ne.lng, ne.lat], [sw.lng, sw.lat]]; 
var city = (new FloodMap(cityBounds)).drawIn("map");

