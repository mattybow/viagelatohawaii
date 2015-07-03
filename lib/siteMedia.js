SiteMedia = new Mongo.Collection('siteMedia');

SiteMedia.getSlideshowMedia = function(){
	return SiteMedia.find({assetType:'slideshowMedia'});
};

SiteMedia.getPressMedia = function(){
  return SiteMedia.find({assetType:'pressMedia',active:true});
}

Meteor.startup(function() {
  if (Meteor.isServer && SiteMedia.find().count() === 0) {
  	var time = new Date().valueOf();
    var defaultPictures = [
        'https://s3-us-west-2.amazonaws.com/viagelato/images/storefront-12345.jpeg',
        'https://s3-us-west-2.amazonaws.com/viagelato/images/5cones-12345.jpeg',
        'https://s3-us-west-2.amazonaws.com/viagelato/images/conemaking-12345.jpeg',
        'https://s3-us-west-2.amazonaws.com/viagelato/images/espresso-12345.jpeg'
      ];
    lodash.each(defaultPictures,function(pic){
      var slide = {
        assetType:'slideshowMedia',
        assetAlias: 'Slideshow Media',
        imgPath:pic,
        created:time
      }
      SiteMedia.insert(slide);
    });
  }
});
