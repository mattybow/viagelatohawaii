Growler = {
	success:function(msg,title){
		setGrowler(msg,title,'success');
	},
	fail:function(msg,title){
		setGrowler(msg,title, 'fail');
	},
	warn:function(msg,title){
		setGrowler(msg,title, 'warn');
	}
};

var ICON_TYPE = {
	success:'icon-check-mark',
	warn:'icon-notifications',
	fail:'icon-close'
};

function setGrowler(msg,title,type){
	Session.set({
		growlerType:type,
		growlerTitle:title,
		growlerMessage:msg,
		showGrowler:true
	});
	unsetGrowler();
}

function unsetGrowler(){
	Meteor.setTimeout(function(){
		Session.set('showGrowler',false);
	},3000);
	Meteor.setTimeout(function(){
		Session.set({
			growlerType:'',
			growlerTitle:'',
			growlerMessage:''
		});
	},3300);
}

Template.growler.helpers({
	showGrowler:function(){
		return Session.get('showGrowler') ? 'show' : '';
	},
	getGrowlerTitle:function(){
		return Session.get('growlerTitle');
	},
	getGrowlerMessage:function(){
		return Session.get('growlerMessage');
	},
	getIconType:function(){
		return ICON_TYPE[Session.get('growlerType')];
	}
});