Hours = new Mongo.Collection('hours');

Hours.getHours = function(){
	return Hours.find({type:'rule'});
}

Hours.getExceptions = function(){
	return Hours.find({type:'exception'},{sort:{date:-1}});
}

Hours.getAllHours = function(){
	return Hours.find({});
}