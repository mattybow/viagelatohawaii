Template.libraryModal.onCreated(function(){
	console.log('here');
	this.subscribe('allFlavors',function(){
		console.log('FLAVORS',Flavors.getAll().count());
	});
});

Template.libraryModal.helpers({
	getAllFlavors:function(){
		return Flavors.getAll();
	},
});

Template.libraryModal.events({
	'click .modal-close-icon, click #libraryModal':function(e){
		e.stopPropagation();
		Session.set('activeModal','');
	},
	'click .lib-flavor-item':function(e){
		e.stopPropagation();
	}
});
