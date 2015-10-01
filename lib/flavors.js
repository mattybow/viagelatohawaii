Flavors = new Mongo.Collection('flavors');

Flavors.getFlavorsOfDay = function(){
	return Flavors.find({active:true, day:true}, {sort: {flavorName: 1}});
}

Flavors.getAll = function(){
	return Flavors.find({active:true}, {sort: {flavorName: 1}});
}

Flavors.getFlavorById = function(id){
	return Flavors.findOne({_id:id});
}

Meteor.startup(function() {
  if (Meteor.isServer && Flavors.find().count() === 0) {
    _.each(defaultFlavorData, function(record){
    	Flavors.insert(record);
	});
  }
});
