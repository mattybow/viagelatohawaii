SiteMedia = new Mongo.Collection('siteMedia');

SiteMedia.getSlideshowMedia = function(){
	return SiteMedia.find({assetName:'slideshowMedia'});
};

Meteor.startup(function() {
  if (Meteor.isServer && SiteMedia.find().count() === 0) {
  	var time = new Date().valueOf();
  	var record = {
  		assetName:'slideshowMedia',
  		assetAlias: 'Slideshow Media',
  		values:[
  			'https://s3-us-west-2.amazonaws.com/viagelato/images/storefront-12345.jpeg',
  			'https://s3-us-west-2.amazonaws.com/viagelato/images/5cones-12345.jpeg',
    		'https://s3-us-west-2.amazonaws.com/viagelato/images/conemaking-12345.jpeg',
    		'https://s3-us-west-2.amazonaws.com/viagelato/images/espresso-12345.jpeg'
  		],
  		lastUpdated:time,
  		created:time
  	}
    SiteMedia.insert(record);
  }
});
