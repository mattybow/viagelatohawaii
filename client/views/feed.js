Template.feed.onCreated(function(){
	this.slyPos = new ReactiveVar(0);
	this.subscribe('instagramFeed',function(){
		this.slyFeed = initializeSly(this);
		this.slyFeed.init();
		this.slyFeed.on('moveEnd', function(ev){
			this.slyFeed.pos.cur
		}.bind(this));
	}.bind(this));

	this.reloadSly = function(){
		this.slyFeed.reload();
	}.bind(this);

});

Template.feed.onRendered(function(){
	window.addEventListener("orientationchange", this.reloadSly, false);
	window.addEventListener("resize", this.reloadSly, false);

});

Template.feed.onDestroyed(function(){
	window.removeEventListener("orientationchange", this.reloadSly, false);
	window.removeEventListener("resize", this.reloadSly, false);
});

Template.feed.helpers({
	getFeedPhotos:function(){
		return InstagramData.latest();
	},
	getTime:function(valueStr){
		var value = parseInt(valueStr+'000');
		if(!value){
			return null;
		}
		return moment(value).format('dddd, MMM D');
	},
	getPhotoUrl:function(){
		/*var width = window.innerWidth;
		if(width >= MEDIA_BREAK_POINTS.tablet){
			return this.images.low_resolution.url;
		}*/
		return this.images.low_resolution.url;
	},
	getIgUrl:function(){
		switch (utils.getMobileOperatingSystem()){
			case 'iOS':
				return 'instagram://media?id=' + this._id;
			case 'Android':
				return 'instagram://media?id=' + this._id;
			default:
				return this.link;
		}
	},
	showBack:function(){
		return Template.instance().slyPos.get() > 0 ? 'opaque' : 'transparent';
	},
	showForward:function(){
		return Template.instance().slyPos.get() === 6 ? 'transparent' : 'opaque';
	},
});

Template.feed.events({
	"click #feed-nav-forward":function(){
		var self = Template.instance();
		//self.slyFeed.reload();
		var sly = self.slyFeed;
		var oldPos = self.slyPos.get();
		var newPos = Math.min(oldPos+1, sly.items.length-getNumberOfSlidesViewable());
		if(oldPos !== newPos){
			//console.log(newPos, sly.items.map(function(item){return item.start;}));
			self.slyPos.set(newPos)
			sly.slideTo(sly.items[newPos].start);
		}
	},
	"click #feed-nav-backward":function(){
		var self = Template.instance();
		var sly = self.slyFeed;
		var oldPos = self.slyPos.get();
		var newPos = Math.max(oldPos-1, 0);
		if(oldPos !== newPos){
			self.slyPos.set(newPos)
			sly.slideTo(sly.items[newPos].start);
		}
	},
	"touchend .feed-slides":function(){
		var self = Template.instance();
		var newPos = self.slyFeed.rel.firstItem;
		var oldPos = self.slyPos.get();
		if(oldPos !== newPos){
			self.slyPos.set(newPos);
		}
	}
});

function getNumberOfSlidesViewable(){
	var containerWidth = $('.feed-slides').width();
	var slideWidth = $('.slide_holder').outerWidth();
	return Math.round(containerWidth/slideWidth);
}

function initializeSly(template){
	return new Sly(template.$('#feed-scroller'),{
		horizontal: 1,
		itemNav: 'basic',
		smart: 1,
		startAt: 0,
		mouseDragging: 1,
		touchDragging: 1,
		releaseSwing: 1,
		scrollBy: 1,
		speed: 300,
		elasticBounds: 1
    })
}
