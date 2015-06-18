Template.editDash.onCreated(function(){
	this.showInputCtrls = new ReactiveVar(false);
	this.usernameInput = new ReactiveVar(false);
	this.passwordInput = new ReactiveVar(false);
});

Template.editDash.helpers({
	showInputCtrls:function(){
		return Template.instance().showInputCtrls.get() ? 'show-inputs' : '';
	},
	showUsernameInput:function(){
		return Template.instance().usernameInput.get() ? 'input-filled' : '';
	},
	showPasswordInput:function(){
		return Template.instance().passwordInput.get() ? 'input-filled' : '';
	}
});

Template.editDash.events({
	'click #show-login-ctrls-button':function(e){
		e.preventDefault();
		e.stopPropagation();
		var oldState = Template.instance().showInputCtrls.get();
		Template.instance().showInputCtrls.set(!oldState);
	},
	'click #username-field':function(e,tmpl){
		Template.instance().usernameInput.set(true);
		tmpl.$('input[name="username-input"]').focus();
	},
	'focus input[name="username-input"]':function(){
		Template.instance().usernameInput.set(true);
	},
	'blur input[name="username-input"], change input[name="username-input"]':function(e){
		if(!e.target.value){
			Template.instance().usernameInput.set(false);
		}
	},
	'click #password-field':function(e,tmpl){
		Template.instance().passwordInput.set(true);
		tmpl.$('input[name="password-input"]').focus();
	},
	'focus input[name="password-input"]':function(){
		Template.instance().passwordInput.set(true);
	},
	'blur input[name="password-input"], change input[name="password-input"]':function(e){
		if(!e.target.value){
			Template.instance().passwordInput.set(false);
		}
	},
	'click #login-submit':function(e,tmpl){
		e.preventDefault();
		e.stopPropagation();
		var user = tmpl.find('input[name="username-input"]').value;
		var pass = tmpl.find('input[name="password-input"]').value;
		var _self = Template.instance();
		if(user && pass){
			Meteor.loginWithPassword(user,pass,function(err,res){
				if(err){
					console.log(err);
				} else {
					_self.showInputCtrls.set(false);
				}

			});
		}
	},
	'click #logout-button':function(e){
		e.stopPropagation();
		e.preventDefault();
		Meteor.logout();
	}
});