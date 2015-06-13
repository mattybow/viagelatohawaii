Template.flavorsDay.onCreated(function(){
	this.subscribe('flavorsOfTheDay');
});

Template.flavorsDay.helpers({
	getFlavors:function(){
		return Flavors.getFlavorsOfDay();
	}
})