Template.flavorsDay.onCreated(function(){
	this.subscribe('flavorsOfTheDay');
});

Template.flavorsDay.helpers({
	getFlavors:function(){
		return Flavors.getFlavorsOfDay();
	},
	getFlavorImg:function(data){
		var imgPath = data ? data.imgPath : 'https://s3-us-west-2.amazonaws.com/viagelato/flavors/cone.png';
		return imgPath;
	}
});

Template.flavorsDay.events({
	'click #read-only-flavor-library':function(){
		Session.set('activeModal','library');
		$('body').addClass('modal-open');
	}
})