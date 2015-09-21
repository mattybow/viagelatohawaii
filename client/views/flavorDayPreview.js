Template.flavorDayPreview.helpers({
	getFlavorName:function(){
		var id = Template.instance().data;
		var flavorName = '';
		var doc = Flavors.findOne({_id:id});
		if(doc){
			flavorName = doc.flavorName;
		}
		return flavorName;
	},
	getFlavorImg:function(){
		var id = Template.instance().data;
		var placeholderPath = 'https://s3-us-west-2.amazonaws.com/viagelato/flavors/cone.png';
		var doc = Flavors.findOne({_id:id});
		if(doc){
			return doc.images.thumbnail.url || placeholderPath;
		}
		return placeholderPath;
	},
	isPlaceholder:function(){
		var id = Template.instance().data;
		var doc = Flavors.findOne({_id:id});
		if(doc){
			return doc.images.thumbnail.url ? '' : 'placeholder';
		}
		return 'placeholder';
	},
});

Template.flavorDayPreview.events({
	'click':function(){
		var id = Template.instance().data;
		var session = Session.get('dayFlavors');
		if(session.indexOf(id) >= 0){
			Session.set('dayFlavors',lodash.pull(session,id)); //remove from array
		} 
	}
})