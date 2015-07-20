Template.feed.onCreated(function(){
	this.subscribe('instagramFeed',function(){
		this.slyFeed = initializeSly(this);
		this.slyFeed.init();
		this.slyPos = 0;
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
		if(width > TABLET_LANDSCAPE){
			return this.images.standard_resolution.url;
		}
		return this.images.thumbnail.url;
	}
});

Template.feed.events({
	"click #feed-nav-forward":function(){
		var sly = Template.instance().slyFeed;
		var pos = ++Template.instance().slyPos;
		//console.log(pos);
		sly.slideTo(sly.items[pos].start);
	}
})

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