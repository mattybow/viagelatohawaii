Template.libraryModal.onCreated(function(){
	this.subscribe('allFlavors');
});

Template.libraryModal.helpers({
	getAllFlavors:function(){
		return Flavors.getAll();
	},
})