function GenericControl (buttonContent, clickHandler){
    this.buttonContent = buttonContent;
}

GenericControl.prototype.handleClick = function(){
    console.error("No click handler defined");
}

GenericControl.prototype.onRemove = function(){
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
}

GenericControl.prototype.onAdd = function(map){
    // console.log("Calling Generic onAdd ");
    this.interaction = false;
    this.map = map;
    this.container = document.createElement("div");
    // this.container.className = "toggle-control controls"; 
    this.container.className = "mapboxgl-ctrl mapboxgl-ctrl-group controls";
    this.container.innerHTML = this.buttonContent;

    var ctx = this;

    if ( this.container.addEventListener){
	this.container.addEventListener(
	    "click", function(){
		ctx.handleClick.call(ctx);
	    },
	    false);
    }
    else if (this.container.attachEvent){
	this.container.attachEvent(
	    "click",
	    function(){ctx.handleClick.call(ctx);});
    }

    // console.log("Added", this.container);

    return this.container;
    
}
