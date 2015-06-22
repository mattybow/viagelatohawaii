Template.newFlavorForm.helpers({
	showNewForm:function(){
		return Session.get('newFormOpened') ? 'opened' : '';
	}
})