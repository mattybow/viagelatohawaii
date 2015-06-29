Template.newFlavorForm.helpers({
	showNewForm:function(){
		return Session.get('newFormOpened') ? 'opened' : '';
	}
});

Template.newFlavorForm.events({
	'click .cancel-create-flavor':function(){
		Session.set('newFormOpened',false);
	},
	'click #create-flavor':function(){
		console.log('save logic');
	}
});