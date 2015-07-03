MEDIA_BREAK_POINTS = {
	mobile:414,
	tablet:768,
	laptop:1200,
	desktop:1600 
}

Template.slideshow.onCreated(function(){
	var self = this;
	this.subscribe('slideshowMedia');
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
		var suffix = self.initialDevice;
		var records = SiteMedia.getSlideshowMedia().fetch();
		var regex = /\-(12345)\./;
		var replacementVal = '-' + suffix + '.';
		var imgs = [];

		if(records){
			imgs = lodash.map(records,function(record){
				return record.imgPath.replace(regex,replacementVal);
			});
		}
		self.slideshowImgs.set(imgs);
		Tracker.afterFlush(function(){							//disgusting hack need to find better way of tapping into lifecycle
			if(self.findAll('.slide').length){
				self.$('#slickSlides').slick({
					dots:true,
					prevArrow:'#slideshow-prev-arrow',
					nextArrow:'#slideshow-next-arrow'
				});
			}
		});
		
	});
});


Template.slideshow.helpers({
	getSlideshowImgs:function(){
		return Template.instance().slideshowImgs.get();
	}
})