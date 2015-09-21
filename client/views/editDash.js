var tabNames = {
	flavors:{templateName:'editFlavors'},
	press:{templateName:'editPress'},
	hours:{templateName:'editHours'},
	users:{templateName:'editUsers'}
};

Template.editDash.onCreated(function(){
	var initialTab = 'flavors';
	var routeData = this.data;
	if(routeData) initialTab = routeData.tab || initialTab;
	this.showInputCtrls = new ReactiveVar(false);
	this.usernameInput = new ReactiveVar(false);
	this.passwordInput = new ReactiveVar(false);
	this.activeTab = new ReactiveVar(initialTab);
	Meteor.subscribe("userAuth");
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
	},
	getTabs:function(){
		var user = Meteor.user();
		if('authorizations' in user.profile){
			return user.profile.authorizations.map(function(auth){
				return {
					tabName:auth,
					templateName:tabNames[auth].templateName
				};
			});
		} else {
			return [];
		}
		
	},
	isLoggedIn:function(){
		return Meteor.userId() ? 'logged-in' : '';
	},
	isActiveTabClass:function(a){
		return this.tabName===Template.instance().activeTab.get() ? 'active-tab' : ''
	},
	getTabTemplate:function(){
		var activeTabName = Template.instance().activeTab.get();
		return tabNames[activeTabName].templateName;
	},
	authorizedToView:function(){
		var tab = Template.instance().activeTab.get();
		var auths = Meteor.user().profile.authorizations;
		if(auths.indexOf(tab) >= 0){
			return true;
		}
		return false;
	}
});

Template.editDash.events({
	'click #login-touch-area':function(e){
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
	},
	'click .tab':function(e){
		var currentActiveTemplate = Template.instance().activeTab.get();
		if(this.tabName !== currentActiveTemplate){
			Template.instance().activeTab.set(this.tabName);
		}
	},
	'click .freak-button':function(){
		console.log('omg');
	}
});
