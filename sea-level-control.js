class toggleLayerControl {

    constructor(layerId, map, label, callback){
	this.layerId = layerId;
	this.map = map;
	this.label = label;
	this.callback = callback || function(){};

    }

    showLayer(){
	this.map.setLayoutProperty(this.layerId, 'visibility', 'visible');
	this.container.classList.add("active");
	this.visible = true;
	console.log("this.visible", this.visible, this);
    }

    hideLayer(){
	this.map.setLayoutProperty(this.layerId, 'visibility', 'none');
	this.container.classList.remove("active");
	this.visible = false;
    }

    toggleLayer(){
	this.callback();	
	console.log("toggling layer", this.visible, this);
	console.log(this.visible);
	if ( this.visible === true ){ this.hideLayer(); }
	else { this.showLayer(); }

    }

    onAdd(map){
    	this.map = map;
    	this.container = document.createElement('div');
    	this.container.className = 'toggle-control controls';
    	this.container.textContent = this.label;

	var ctx = this;

	if (this.container.addEventListener) {
	    
	    console.log("Adding event listener");
	    
	    this.container.addEventListener(
		"click",
		function(){
		    console.log("click");
		    ctx.toggleLayer.call(ctx);
		},
		false);
	}
	else if (this.container.attachEvent) {
	    this.container.attachEvent('click',
				       function(){ctx.toggleLayer.call(this);});
	}
	
    	return this.container;
    }

    onRemove(){
    	this.container.parentNode.removeChild(this.container);
    	this.map = undefined;
    }

}
