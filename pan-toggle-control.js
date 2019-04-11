function PanToggleControl (map){
    // GenericControl.call(this,'<i class="fa fa-hand-pointer-o" aria-hidden="true"></i>');
    GenericControl.call(
	this,
	'<button type="button" class="mapboxgl-ctrl-icon">' 
	    + '<i class="fa fa-hand-pointer-o" aria-hidden="true"></i>'
	    + '</button>');

    

    this.map = map;
    this.enabled = false;
    this.map.dragPan.disable();
}

PanToggleControl.prototype = Object.create(GenericControl.prototype);

PanToggleControl.prototype.handleClick = function(){
    if (this.enabled){
	this.map.dragPan.disable();
	this.enabled = false;
	this.container.classList.remove("active");

	this.container.classList.remove("on");
	this.container.classList.add("off");			
    }
    else if (!this.enabled){
	this.map.dragPan.enable();
	this.enabled = true;
	this.container.classList.add("active");

	this.container.classList.remove("off");
	this.container.classList.add("on");			

    }
}
