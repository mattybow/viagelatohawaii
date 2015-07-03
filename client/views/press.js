Template.press.onCreated(function(){
	this.subscribe('pressMedia');
});

Template.press.helpers({
	getPressMedia:function(){
		return SiteMedia.getPressMedia();
	}
})