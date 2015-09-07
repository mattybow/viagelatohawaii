Template.press.onCreated(function(){
	this.subscribe('pressMedia');
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
	Meteor.setTimeout(function(){
		$( 'a.press-lightbox-img' ).imageLightbox({
			onEnd:function(){
				Session.set('showLightboxOverlay',false);
			}
		});
	},500);
});
