Template.choice.onCreated(function(){
	this.isSelected = new ReactiveVar(Template.parentData().selected);
	console.log(Template.parentData().selected);
})

Template.choice.helpers({
	typeCheck:function(type){
		return type === this.type;
	},
	isSelected:function(){
		return Template.instance().isSelected.get() ? 'selected' : 'unselected';
	}
});

Template.choice.events({
	'click':function(){
		var newState = !Template.instance().isSelected.get();
		Template.instance().isSelected.set(newState);
	}
})