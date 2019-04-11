"use strict";
(function(){
    console.log("Drawing legend");
    var legend = document.getElementById("legend");
    legend.classList.add("legend");

    var items = [
	{
	    "label":"power plant",
	    "class":["power-plant","legend-circle"]
	},{
	    "label":"petroleum terminal",
	    "class":["petroleum-terminal","legend-circle"]
	},{

	    "label":"house elevation",
	    "class":["house-elevation","legend-circle"]
	},	
	{
	    "label":'click the <i class="fa fa-hand-pointer-o" aria-hidden="true"></i> icon to enable navigation',
	    "class":["legend-control"],
	    // "html":'<i class="fa fa-hand-pointer-o" aria-hidden="true"></i>'
	}
    ].reverse();

    items.forEach(function(x){
	var item = document.createElement("div");
	legend.appendChild(item);
	item.classList.add("legend-item")
	var icon = document.createElement("div");
	item.appendChild(icon);
	icon.classList.add("legend-item-icon");
	var label = document.createElement("div");
	item.append(label);
	label.classList.add("legend-item-label");

	if (x["html"]){
	    icon.innerHTML = x["html"];
	}

	label.innerHTML = x["label"];
	
	x["class"].forEach(function(c){
	    icon.classList.add(c);
	});
    });
    
})();
