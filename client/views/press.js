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
	var _self = this;
	Meteor.setTimeout(function(){
		_self.imageLightbox = $( 'a.press-lightbox-img' ).imageLightbox({
			quitOnDocClick: false,
			onEnd:function(){
				Session.set('showLightboxOverlay',false);
			}
		});
	},2000);
});

Template.press.events({
	'click #imageLightbox-overlay':function(e){
		e.stopPropagation();
		console.log('accidental click');
		Template.instance().imageLightbox.quitImageLightbox();
	}
})