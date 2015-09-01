Template.libraryModal.onCreated(function(){
	this.subscribe('allFlavors');
});

Template.libraryModal.helpers({
	getAllFlavors:function(){
		return Flavors.getAll();
	},
})

Template.libraryModal.events({
	'click .modal-close-icon':function(){
		Session.set('activeModal','');
		$('body').removeClass('modal-open');
	}
})