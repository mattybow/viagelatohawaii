Template.editFlavorLibrary.onCreated(function(){
	FlavorEdits._collection.remove({});
	this.subscribe('allFlavors', function(){
		console.log('setting session var')
		var data = Flavors.getFlavorsOfDay().fetch();
		var ids = _.pluck(data,'_id');
		Session.set('dayFlavors',ids);
		Session.set('originalFlavors',ids);
	});
	Session.setDefault('dayFlavors',[]);
	
});

Template.editFlavorLibrary.helpers({
	allFlavors:function(){
		var data = Flavors.find({},{flavorName:1,sort:{flavorName:1}});
		return data;
	},
	flavorEditsCursor:function(){
		var id = Template.instance.data._id;
		return FlavorEdits.findOne({id:_id});
	},
	isDisabled:function(){
		return Session.get('dayFlavors').length ? '' : 'disabled-button'
	}
});

Template.editFlavorLibrary.events({
	'click #new-flavor-button': function(){
		console.log(utils.isMobile());
		Session.set('flavorFormOpened',{opened:true,_id:''});
	},
	'click #clear-all-selected-flavors':function(){
		Session.set('dayFlavors',[]);
	}
});

