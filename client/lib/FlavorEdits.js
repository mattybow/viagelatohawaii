/*FlavorEdits = new Mongo.Collection('flavorEdits');

FlavorEdits.getAll = function(){
	return FlavorEdits.find({});
};

FlavorEdits.getDayVal = function(id){
	var doc = FlavorEdits.findOne({_id:id}, {fields:{_id:0, day:1}});
	return doc ? doc.day : null;
}

FlavorEdits.toggleDay = function(id){
	var day = FlavorEdits.getDayVal(id);
	if(day){
		FlavorEdits._collection.update({_id:id},{$set:{day:!doc.day}});  //toggle day flag
	} else {
		console.log('could not find flavor id:%s please reload page and try again', id);
	}
	
};

FlavorEdits.allow({
	insert:function(){
		return true;
	}
})*/