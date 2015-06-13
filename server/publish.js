Meteor.publish('instagramFeed', function () {
  return InstagramData.latest();
});


Meteor.publish('flavorsOfTheDay', function () {
  return Flavors.getFlavorsOfDay();
});