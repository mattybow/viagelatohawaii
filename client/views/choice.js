Template.choice.onCreated(function(){
	this.originalState = Template.parentData().selected;
	this.isSelected = new ReactiveVar(this.originalState);
});

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
		var authRef = Template.parentData(2).userAuths;
		var auths = authRef.get();

		if(newState){
			auths.push(this.name);
			authRef.set(auths);
		} else {
			lodash.pull(auths,this.name);
			authRef.set(auths);
		}
	}
})