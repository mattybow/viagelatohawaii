Template.flavorsDay.onCreated(function(){
	this.subscribe('flavorsOfTheDay');
	this.autorun(function(){
		var isModalOpen = Session.get('activeModal');
		if(isModalOpen){
			$('body').addClass('modal-open');
		} else {
			$('body').removeClass('modal-open');
		}
	});
});

Template.flavorsDay.helpers({
	getFlavors:function(){
		return Flavors.getFlavorsOfDay();
	},
	getFlavorImg:function(data){
		var imgPath = data && data.images.thumbnail.url;
		return imgPath || 'https://s3-us-west-2.amazonaws.com/viagelato/flavors/cone.png';
	}
});

Template.flavorsDay.events({
	'click #read-only-flavor-library':function(){
		Session.set('activeModal','library');
	}
});


function bodyNoScroll(e){
	e.stopPropagation();
	e.preventDefault();
}