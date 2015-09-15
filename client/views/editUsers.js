Template.editUsers.onCreated(function(){
	this.subscribe('existingUsers');
})

Template.editUsers.helpers({
	existingUsers:function(){
		return Meteor.users.find({});
	}
})