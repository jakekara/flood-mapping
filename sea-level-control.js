function ToggleLayerControl(layerId, map, label, callback){

    GenericControl.call(this, label, function(){console.log("LOL"); });
    
    this.layerId = layerId;
    this.map = map;
    this.label = label;
    this.callback = callback || function(){};
}

ToggleLayerControl.prototype = Object.create(GenericControl.prototype);

ToggleLayerControl.prototype.showLayer = function(){
    this.map.setLayoutProperty(this.layerId, 'visibility', 'visible');
    this.container.classList.add("active");
    this.visible = true;
}

ToggleLayerControl.prototype.hideLayer = function(){
    this.map.setLayoutProperty(this.layerId, 'visibility', 'none');
    this.container.classList.remove("active");
    this.visible = false;
}

ToggleLayerControl.prototype.handleClick = function(){
    // toggle layer on and off
    this.callback();	
    if ( this.visible === true ){ this.hideLayer(); }
    else { this.showLayer(); }
}

// ToggleLayerControl.prototype.onAdd = function(map){
//     // console.log("calling parent function");
//     // GenericControl.prototype.onAdd(this, map);
//     // console.log("Done with parent function", this.map);
//     // this.container.className += "toggle-control"
// }


// ToggleLayerControl.prototype.onAdd = function(map){
//     this.map = map;
//     this.container = document.createElement('div');
//     this.container.className = 'toggle-control controls';
//     this.container.textContent = this.label;

//     var ctx = this;

//     if (this.container.addEventListener) {
// 	this.container.addEventListener(
// 	    "click",
// 	    function(){
// 		ctx.toggleLayer.call(ctx);
// 	    },
// 	    false);
//     }
//     else if (this.container.attachEvent) {
// 	this.container.attachEvent('click',
// 				   function(){ctx.toggleLayer.call(this);});
//     }
    
//     return this.container;
// }

// ToggleLayerControl.prototype.onRemove = function(){
//     this.container.parentNode.removeChild(this.container);
//     this.map = undefined;
// }

// function Person(name){
//     this.name = name;
// }

// Person.prototype.greeting = function(){
//     return "Hello, I'm " + String(this.name) + ".";
// }

// Teacher.prototype = Object.create(Person.prototype);

// function Teacher(name){
//     Person.call(this, name);
// }
