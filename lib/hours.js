Hours = new Mongo.Collection('hours');

Hours.getHours = function(){
	return Hours.find({});
}