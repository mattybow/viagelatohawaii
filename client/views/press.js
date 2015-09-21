Template.press.onCreated(function(){
	this.subscribe('pressMedia');
	this.subscribe('frames');
});

Template.press.helpers({
	getPressMedia:function(){
		return SiteMedia.getPressMedia();
	},
	showOverlay:function(){
		return Session.get('showLightboxOverlay') ? 'show-overlay' : '';
	}
})

Template.press.onRendered(function(){
	var _self = this;
	this.autorun(function(c){
		var media = SiteMedia.getPressMedia().fetch();
		if(!lodash.isEmpty(media)){
			_self.imageLightbox = $( 'a.press-lightbox-img' ).imageLightbox({
				quitOnDocClick: false,
				onEnd:function(){
					Session.set('showLightboxOverlay',false);
				}
			});
			c.stop();
		}
		
	});
});

Template.press.events({
	'click #imageLightbox-overlay':function(e){
		e.stopPropagation();
		Template.instance().imageLightbox.quitImageLightbox();
	}
})