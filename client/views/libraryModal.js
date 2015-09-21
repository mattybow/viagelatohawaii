Template.libraryModal.onCreated(function(){
	this.subscribe('allFlavors');
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
