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
  if(Meteor.isServer){
    var interval = 1000 * 60 * 60 * 6;  //4x a day
    Meteor.setInterval(function(){
      Meteor.call('checkInstagram',function(err,res){
        var data = res.data.data;
        _.each(data, function(record){
          var exists = InstagramData.findOne({_id:record.id});
          if(!exists){
            record._id = record.id;
            delete record.id;
            InstagramData.insert(record);
          }
        });
      });
    },interval);
  }
});