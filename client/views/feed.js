Template.feed.onCreated(function(){
	this.subscribe('instagramFeed',function(){
		initializeSly(this);
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
	}
})

function initializeSly(template){
	var scroller = new Sly(template.$('#feed-scroller'),{
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
    }).init();
}