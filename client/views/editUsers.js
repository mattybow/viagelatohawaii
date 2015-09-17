Template.editUsers.onCreated(function(){
	var _self = this;
	this.subscribe('existingUsers');
	this.authChoices = new ReactiveVar([
	{	name:'flavors',
		selected:false
	},
	{	name:'hours',
		selected:false
	},
	{	name:'press',
		selected:false
	},
	{ 	name:'users',
		selected:false
	}]);
	this.updateAuthChoice = function(name, selected){
		var updatedChoices = _.map(_self.authChoices.get(),function(choice){
			if(choice.name===name && choice.selected !== selected){
				return {
					name:name,
					selected:selected
				}
			}
			return choice;
		});
		_self.authChoices.set(updatedChoices);
	}
	this.username = new ReactiveVar('');
	this.password = new ReactiveVar('');
	this.confirmPass = new ReactiveVar('');
})

Template.editUsers.helpers({
	existingUsers:function(){
		return Meteor.users.find({});
	},
	authItems:function(){
		return Template.instance().authChoices.get();
	},
	checked:function(name){
		return this.selected ? 'checked' : 'not-checked';
	},
	createdReadable:function(){
		var mo = moment(new Date(this.createdAt));
		return mo.format('MMM DD, YYYY h:mm a');
	},
	getAuthorizations:function(){
		var auths = this.profile.authorizations;
		console.log(auths);
		return lodash.map(['flavors','hours','press','users'],function(auth){
			var data = {
				name:auth,
				selected:false
			}
			if(auths.indexOf(auth) >= 0){
				data.selected=true;
			}
			return data;
		});
	},
	passwordsMatch:function(){
		var inst = Template.instance();
		var pass = inst.password.get();
		var conf = inst.confirmPass.get();
		if(pass && conf){
			return  pass === conf ? 'matches' : 'no-match';
		}
		return 'no-match';
	}
});

Template.editUsers.events({
	'click .auth-item':function(){
		Template.instance().updateAuthChoice(this.name, !this.selected);
	},
	'keyup #input-new-username':function(e){
		Template.instance().username.set(e.currentTarget.value);
	},
	'keyup #input-new-password':function(e){
		Template.instance().password.set(e.currentTarget.value);
	},
	'keyup #input-confirm-password':function(e){
		Template.instance().confirmPass.set(e.currentTarget.value);
	},
	'click .delete-username':function(){
		if (this.username === 'master') {
			Growler.fail('You cannot the master','SORRY!');
		} else if (this._id === Meteor.user()._id){
			Growler.fail('You cannot delete yourself','SORRY!');
		} else {
			Meteor.call('deleteUser', this._id);
		}
	},
	'click #create-user':function(){
		var temp = Template.instance();
		var authorizations = lodash.reduce(temp.authChoices.get(),function(acc,choice){
			if(choice.selected){
				acc.push(choice.name);
			}
			return acc;
		},[]);
		var options = {
			username:temp.username.get(),
			password:temp.password.get(),
			profile:{
				authorizations:authorizations
			}
		}
		options.password = Accounts._hashPassword(options.password);
		Meteor.call('createNewUser',options,function(err,result){
			if(err){
				console.log('ERROR',err);
			} else {
				console.log('SUCCESS',result);
			}
		});
	}
})