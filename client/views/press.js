Template.press.onCreated(function(){
	var _self = this;
	this.subscribe('pressMedia',function(){
		var media = SiteMedia.getPressMedia().fetch();
		_self.imageLightbox = $( 'a.press-lightbox-img' ).imageLightbox({
			selector: 'id="imageLightbox"',
			appendSelector: '#lightbox-image-holder',
			quitOnDocClick: false,
			onEnd:function(){
				console.log('end event', arguments);
				Session.set('showLightboxOverlay',false);
			}
		});
	});
	this.subscribe('frames');
});

Template.press.helpers({
	getPressMedia:function(){
		return SiteMedia.getPressMedia();
	},
	showOverlay:function(){
		return Session.get('showLightboxOverlay') ? 'show-overlay' : '';
	}
});

Template.press.events({
	'click #imageLightbox-overlay':function(e){
		e.stopPropagation();
		Template.instance().imageLightbox.quitImageLightbox();
	}
})