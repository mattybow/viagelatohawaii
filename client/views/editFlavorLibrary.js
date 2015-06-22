Template.editFlavorLibrary.helpers({
	allFlavors:function(){
		var testData = "butter pecan,vanilla,chocolate,almond cookie,fluorescent frosting,fierce chocolate,li hing mango".split(',');
		return testData;
	}
});

Template.editFlavorLibrary.events({
	'click #new-flavor-button': function(){
		Session.set('newFormOpened',true);
	}
})