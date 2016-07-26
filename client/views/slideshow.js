MEDIA_BREAK_POINTS = {
	mobile:414,
	tablet:768,
	laptop:1420,
	desktop:1600
}

Template.slideshow.onCreated(function(){
	var self = this;
	this.subscribe('allHours');
	this.subscribe('slideshowMedia',function(){
		Tracker.afterFlush(function(){
				self.$('#slickSlides').slick({
					dots:true,
					prevArrow:'#slideshow-prev-arrow',
					nextArrow:'#slideshow-next-arrow',
					autoplay: true,
  					autoplaySpeed: 5000,
  					cssEase:'ease-in-out',
  					pauseOnDotsHover:true
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
	this.timeChecked = new ReactiveVar(0);
	Meteor.setInterval(function(){
		this.timeChecked.set(new Date().valueOf());
	}.bind(this),60000);
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
		if(!hours) return '';
		return hours.openHour ? 'Open today!' : 'Closed today';
	},
	getHours:function(){
		var time = Template.instance().timeChecked.get();	//hack to get time to change
		var hours = getTodaysHours();
		if(hours && hours.openHour){
			return hours.openHour+':00 AM - '+(hours.closeHour-12)+':00 PM';
		} else {
			return '';
		}
	}
});

function getTodaysHours(){
	var exception = getTodaysException();
	if(exception){
		return exception;
	}
	var dayIndex = getDateInHawaii().getDay();
	var hours = Hours.findOne({dayIndex:dayIndex});
	return hours;
}

function getTodaysException(){
	var todayDate = getDateInHawaii().toISOString();
	var exception = Hours.find({$and:[
		{date:{$lte:todayDate}},
		{type:'exception'}
		]},
		{sort:{date:-1},
		limit:1}).fetch();
	if(!lodash.isEmpty(exception)){
		var exceptionRecord = exception[0];
		var exceptionDate = moment(new Date(exceptionRecord.date));
		var diff = moment(todayDate).diff(exceptionDate,'days',true);
		if(diff >= 0 && diff < 1){
			return exceptionRecord;
		}
	}
	return null;
}

function getDateInHawaii(){
	var dateNum = new Date().setUTCHours(-10);
	return new Date(dateNum);
}
