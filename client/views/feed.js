Template.feed.onCreated(function(){
	this.slyPos = new ReactiveVar(0);
	this.subscribe('instagramFeed',function(){
		this.slyFeed = initializeSly(this);
		this.slyFeed.init();
		this.slyFeed.on('moveEnd', function(ev){
			this.slyFeed.pos.cur
		}.bind(this));
	}.bind(this));

});

Template.feed.onRendered(function(){
	/*Meteor.call('checkInstagram',function(err,res){
		console.log(err,res);
	});*/

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
		var width = window.innerWidth;
		if(width >= MEDIA_BREAK_POINTS.tablet){
			return this.images.low_resolution.url;
		}
		return this.images.thumbnail.url;
	},
	getIgUrl:function(){
		switch (getMobileOperatingSystem()){
			case 'iOS':
				return 'instagram://media?id=' + this.id;
			case 'Android':
				return 'instagram://media?id=' + this.id;
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
		var newPos = Math.min(oldPos+1, sly.items.length-4);
		if(oldPos !== newPos){
			//console.log(newPos, sly.items.map(function(item){return item.start;}));
			self.slyPos.set(newPos)
			sly.slideTo(sly.items[newPos].start + 4*newPos);
		}
	},
	"click #feed-nav-backward":function(){
		var self = Template.instance();
		var sly = self.slyFeed;
		var oldPos = self.slyPos.get();
		var newPos = Math.max(oldPos-1, 0);
		if(oldPos !== newPos){
			self.slyPos.set(newPos)
			sly.slideTo(sly.items[newPos].start + 4*newPos);
		}
	}
});

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

function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
  {
    return 'iOS';

  }
  else if( userAgent.match( /Android/i ) )
  {

    return 'Android';
  }
  else
  {
    return 'unknown';
  }
}