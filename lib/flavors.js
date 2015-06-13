Flavors = new Mongo.Collection('flavors');

Flavors.getFlavorsOfDay = function(){
	return Flavors.find({active:true}, {sort: {created: -1}});
}

Meteor.startup(function() {
  if (Meteor.isServer && Flavors.find().count() === 0) {
    _.each(defaultFlavorData, function(record){
    	Flavors.insert(record);
	});
  }
});
