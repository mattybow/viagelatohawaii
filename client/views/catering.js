Template.catering.events({
	'click #basic-catering':function(){
		Session.set({
			activeModal:'packages',
			packageModalTab:'basic'
		});
		$('body').addClass('modal-open');
	},
	'click #deluxe-catering':function(){
		Session.set({
			activeModal:'packages',
			packageModalTab:'deluxe'
		});
		$('body').addClass('modal-open');
	}
});

Template.catering.helpers({
	getBackgroundImage:function(){
		var width = window.innerWidth;
		if (width <= MEDIA_BREAK_POINTS.mobile){
			return "https://s3-us-west-2.amazonaws.com/viagelato/images/catering-background-mobile-sm.jpeg"
		} else if (width <= MEDIA_BREAK_POINTS.tablet){
			return "https://s3-us-west-2.amazonaws.com/viagelato/images/catering-background-mobile-lg.jpeg"
		} else {
			return "https://s3-us-west-2.amazonaws.com/viagelato/images/catering-background-desktop.JPG"
		}
	}
})