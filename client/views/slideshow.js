MEDIA_BREAK_POINTS = {
	mobile:414,
	tablet:768,
	laptop:1200,
	desktop:1600 
}

Template.slideshow.onCreated(function(){
	var self = this;
	this.subscribe('hours');
	this.subscribe('slideshowMedia',function(){
		Tracker.afterFlush(function(){
				console.log('slick init');
				self.$('#slickSlides').slick({
					dots:true,
					prevArrow:'#slideshow-prev-arrow',
					nextArrow:'#slideshow-next-arrow'
				});
			});
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
	//this.slideshowImgs = new ReactiveVar([]);
	
});


Template.slideshow.helpers({
	getSlideshowImgs:function(){
		var self = Template.instance();
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
		
		return imgs;
	},
	openOrClosed:function(){
		var hours = getTodaysHours();
		return hours.openHour ? 'Open today!' : 'Closed today';
	},
	getHours:function(){
		var hours = getTodaysHours();
		if(hours.openHour){
			return hours.openHour+':00 AM - '+(hours.closeHour-12)+':00 PM';
		} else {
			return '';
		}
	}
});

function getTodaysHours(){
	var dayIndex = new Date().getDay();
	var hours = Hours.findOne({dayIndex:dayIndex});
	return hours;
}







