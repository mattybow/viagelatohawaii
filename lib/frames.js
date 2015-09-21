Frames = new Mongo.Collection('frames');

Frames.get = function(){
	return Frames.find({});
}