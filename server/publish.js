Meteor.publish('instagramFeed', function () {
  return InstagramData.latest();
});

Meteor.publish('allFlavors', function () {
  return Flavors.getAll();
});

Meteor.publish('frames', function () {
  return Frames.get();
});

Meteor.publish('flavorsOfTheDay', function () {
  return Flavors.getFlavorsOfDay();
});

Meteor.publish("userAuth", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId},
                             {fields: {'authorizations':1}});
  } else {
    this.ready();
  }
});

Meteor.publish('slideshowMedia',function(){
	return SiteMedia.getSlideshowMedia();
});

Meteor.publish('pressMedia',function(){
  return SiteMedia.getPressMedia();
});

Meteor.publish('hours',function(){
  return Hours.getHours();
});

Meteor.publish('existingUsers',function(){
  return Meteor.users.find({},{fields:{username:1, createdAt:1, authorizations:1}});
});