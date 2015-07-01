MEDIA_BREAK_POINTS = {
	mobile:414,
	tablet:768,
	laptop:1200,
	desktop:1600 
}

Template.slideshow.onCreated(function(){
	var self = this;
	this.subscribe('slideshowMedia',function(){
		console.log('subscribe complete');
	});
	this.initialDevice = 'desktop';
	if(Meteor.isClient){
		var mediaWidth = window.innerWidth;
		if(mediaWidth <= MEDIA_BREAK_POINTS.mobile){
			this.initialDevice = 'mobile';
		} else if (mediaWidth <= MEDIA_BREAK_POINTS.tablet){
			this.initialDevice = 'tablet';
		} else if (mediaWidth <= MEDIA_BREAK_POINTS.laptop){
			this.initialDevice = 'laptop';
		} else if (mediaWidth <= MEDIA_BREAK_POINTS.desktop){
			this.initialDevice = 'desktop';
		}
	}
	this.slideshowImgs = new ReactiveVar([]);
	
});

Template.slideshow.onRendered(function(){
	var self = this;
	this.autorun(function(){
		console.log('autorun slideshow');
		var suffix = self.initialDevice;
		var records = SiteMedia.getSlideshowMedia().fetch()[0];
		var regex = /\-(12345)\./;
		var replacementVal = '-' + suffix + '.';
		var imgs = [];

		if(records){
			imgs = lodash.map(records.values,function(url){
				return url.replace(regex,replacementVal);
			});
		}
		self.slideshowImgs.set(imgs);
		Meteor.setTimeout(function(){							//disgusting hack need to find better way of tapping into lifecycle
			self.$('#slickSlides').slick({
				dots:true,
				prevArrow:'#slideshow-prev-arrow',
				nextArrow:'#slideshow-next-arrow'
			});
		},100);
		
	});
});


Template.slideshow.helpers({
	getSlideshowImgs:function(){
		return Template.instance().slideshowImgs.get();
	}
})