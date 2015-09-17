var PASSWORD_MATCH_ERR_MSG = 'passwords do not match';
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
	this.clearAuthChoices = function(){
		var updatedChoices = _.map(_self.authChoices.get(),function(choice){
			return {
				name:choice.name,
				selected:false
			};
		});
		_self.authChoices.set(updatedChoices);
	}
	this.setUserInput = function(value){
		var data = {
			username:value,
			isOk:false,
			errMsg:''
		};
		var isUnique = Meteor.users.findOne({username:value}) ? false : true;
		if(isUnique){
			data.isOk = true;
		} else {
			data.errMsg = 'this username already exists';
		}
		_self.usernameInput.set(data);
	}
	this.setPasswordInput = function(value){
		var prevDataCopy = _self.passwordInput.get();
		prevDataCopy.password = value;
		_self.passwordInput.set(checkPassEquality(prevDataCopy));
	}
	this.setConfirmInput = function(value, final){
		var prevDataCopy = _self.passwordInput.get();
		prevDataCopy.confirm = value;
		if(!final && value.length !== prevDataCopy.password.length){
			var startsWith = new RegExp('^'+value);
			var matches = prevDataCopy.password.match(startsWith);
			if(!matches){
				prevDataCopy.isOk = false;
				prevDataCopy.errMsg = PASSWORD_MATCH_ERR_MSG;
				
			} else {
				prevDataCopy.isOk = true;
				prevDataCopy.errMsg = '';
			}
			
			_self.passwordInput.set(prevDataCopy);
		} else {
			_self.passwordInput.set(checkPassEquality(prevDataCopy));
		}
	}
	this.passwordInput = new ReactiveVar({
		password:'',
		confirm:'',
		isOk:false,
		errMsg:''
	});
	this.usernameInput = new ReactiveVar({
		username:'',
		isOk:false,
		errMsg:''
	});
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
		return mo.format('MMM DD YYYY h:mm a');
	},
	getAuthorizations:function(){
		var auths = this.profile.authorizations;
		return lodash.map(['flavors','hours','press','users'],function(auth){
			var data = {
				name:auth,
				selected:false  //put reference to reactive var in here?
			}
			if(auths.indexOf(auth) >= 0){
				data.selected=true;
			}
			return data;
		});
	},
	isDirty:function(){
		var isDirty = false;
		if(!('userAuths' in this)){
			this.userAuths = new ReactiveVar(this.profile.authorizations.slice());
		}
		var originalData = this.profile.authorizations;
		var updatedData = this.userAuths.get()
		if(originalData.length !== updatedData.length){
			isDirty = true;
		} else {
			isDirty = lodash.reduce(this.updatedData,function(acc, auth){
				if(auth.indexOf(originalData) >= 0){
					return acc;
				}
				return ++acc;
			}, 0);
		}

		return isDirty ? 'enabled' : 'disabled';
	},
	passwordsOk:function(){
		var passwordInput = Template.instance().passwordInput.get();
		var confirm = passwordInput.confirm;
		if((confirm && !passwordInput.isOk) || (confirm && (passwordInput.password.length === passwordInput.confirm.length))) {
			return passwordInput.isOk ? 'ok' : 'not-ok';
		}
		return '';
	},
	passwordIconStatus:function(){
		return Template.instance().passwordInput.get().isOk ? 'icon-check-mark' : 'icon-close';
	},
	passwordError:function(){
		return Template.instance().passwordInput.get().errMsg;
	},
	usernameOk:function(){
		var usernameInput = Template.instance().usernameInput.get();
		var username = usernameInput.username;
		if(username){
			return usernameInput.isOk ? 'ok' : 'not-ok';
		}
		return '';
	},
	usernameIconStatus:function(){
		return Template.instance().usernameInput.get().isOk ? 'icon-check-mark' : 'icon-close';
	},
	usernameError:function(){
		return Template.instance().usernameInput.get().errMsg;
	},
	formIsValid:function(){
		var passData = Template.instance().passwordInput.get();
		var passwordOk = passData.isOk && passData.password.length === passData.confirm.length;
		var usernameData = Template.instance().usernameInput.get();
		var usernameOk = usernameData.isOk && usernameData.username;
		return usernameOk && passwordOk ? '' : 'disabled';
	}
});

Template.editUsers.events({
	'click .auth-item':function(){
		Template.instance().updateAuthChoice(this.name, !this.selected);
	},
	'change #input-new-username':function(e){
		Template.instance().setUserInput(e.currentTarget.value);
	},
	'keyup #input-new-password':function(e){
		Template.instance().setPasswordInput(e.currentTarget.value);
	},
	'keyup #input-confirm-password':function(e){
		Template.instance().setConfirmInput(e.currentTarget.value,false);
	},
	'change #input-confirm-password':function(e){
		Template.instance().setConfirmInput(e.currentTarget.value,true);
	},
	'click .delete-username':function(){
		if (this.username === 'master') {
			Growler.fail('You cannot delete the master','SORRY!');
		} else if (this._id === Meteor.user()._id){
			Growler.fail('You cannot delete yourself','SORRY!');
		} else {
			Meteor.call('deleteUser', this._id);
		}
	},
	'click .update-user':function(){
		if(this.username==='master'){
			Growler.fail('You cannot make changes to master', 'FAILURE!');
			return false;
		}
		var data = {
			id:this._id,
			authorizations: this.userAuths.get().sort()
		}
		Meteor.call('updateUserAuths', data, function(err, res){
			if(err){
				Growler.fail('User was not updated', 'FAILURE!');
			} else {
				Growler.success('Updated User Info', 'SUCCESS!');
			}
		});
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
			username:temp.usernameInput.get().username,
			password:temp.password.get(),
			profile:{
				authorizations:authorizations
			}
		}
		options.password = Accounts._hashPassword(options.password);
		Meteor.call('createNewUser',options,function(err,result){
			if(err){
				Growler.fail('User was not created', 'FAILURE!');
			} else {
				Growler.success('User Created', 'SUCCESS!');
				temp.clearAuthChoices();
			}
		});
	}
});

var checkPassEquality = function(data){
	var newData = {};
	if(!data.confirm){		//escape check if there's no confirm input
		return lodash.assign(data,{errMsg:''});
	}
	if(data.confirm === data.password){
		newData.isOk = true;
		newData.errMsg = '';
	} else {
		newData.isOk = false;
		newData.errMsg = PASSWORD_MATCH_ERR_MSG;
	}
	return lodash.assign(data,newData);
}