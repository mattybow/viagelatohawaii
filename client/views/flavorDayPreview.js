Template.flavorDayPreview.helpers({
	getFlavorName:function(){
		var id = Template.instance().data;
		var flavorName = '';
		var doc = Flavors.findOne({_id:id});
		if(doc){
			flavorName = doc.flavorName;
		}
		return flavorName;
	}
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