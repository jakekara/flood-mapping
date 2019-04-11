
function RecenterControl(map, callback){
    GenericControl.call(
	this,
	'<button type="button" class="mapboxgl-ctrl-icon">'
	    + '<i class="fa fa-crosshairs" aria-hidden="true"></i>'
	    + '</button>');

    this.map = map;
    this.callback = callback;
}

RecenterControl.prototype = Object.create(GenericControl.prototype);

RecenterControl.prototype.handleClick = function(){
    this.callback();
}
