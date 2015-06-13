InstagramData = new Mongo.Collection('instagramData');

InstagramData.latest= function(){
	return InstagramData.find({}, {sort: {created_time: -1}, limit: 10});
}

Meteor.startup(function() {
  if (Meteor.isServer && InstagramData.find().count() === 0) {
    Meteor.call('checkInstagram',function(err,res){
    	var data = res.data.data;
    	_.each(data, function(record){
    		record._id = record.id;
    		delete record.id;
    		InstagramData.insert(record);
    	});
	});
  }
});