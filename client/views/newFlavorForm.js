Template.newFlavorForm.onCreated(function(){
	this.newFlavorName = new ReactiveVar('');
	this.highlightNameField = new ReactiveVar(false);
	this.errorMsg = new ReactiveVar('');
});

Template.newFlavorForm.onRendered(function(){
});

Template.newFlavorForm.helpers({
	showNewForm:function(){
		return Session.get('newFormOpened') ? 'opened' : '';
	},
	getFlavorFileName:function(){
		var ext = Session.get('newFileExt');
		if(ext){
			var filename = Template.instance().newFlavorName.get();
			if(filename){
				return  filename + '.' + ext;
			}
			
		}
		return '';
	},
	passParentRef:function(){
		return Template.instance();
	},
	getUploadStatus:function(){
		var index = Session.get('flavorPhotoUploadStatus');
		return FLAVOR_PHOTO_STATUSES[index];
	},
	isInvalid:function(fieldName){
		return Template.instance().highlightNameField.get() ? 'invalid' : '';
	},
	getErrorMsg:function(){
		return Template.instance().highlightNameField.get() ? Template.instance().errorMsg.get() : '';
	}
});

Template.newFlavorForm.events({
	'click .cancel-create-flavor':function(){
		Session.set('newFormOpened',false);
	},
	'click #create-flavor':function(){
		var flavorName = Template.instance().newFlavorName.get();
		if(!flavorName){
			Template.instance().highlightNameField.set(true);
			Template.instance().errorMsg.set('flavor name is required');
			return false;
		}
		/*if(!checkUniqueness(flavorName)){
			Template.instance().highlightNameField.set(true);
			Template.instance().errorMsg.set('duplicate flavor name');
			return false
		}*/
		Template.instance().uploadImage().then(function(val){
			console.log('PARENT',val);
		});
	},
	'keyup [name="new-flavor-name"]':function(e){
		var dirtyVal = e.currentTarget.value;
		var regex = /\W+/g;
		var cleanVal = dirtyVal.replace(regex,'');
		Template.instance().newFlavorName.set(cleanVal.toLowerCase());
	},
	'focus #flavor-name-field':function(){
		Template.instance().highlightNameField.set(false);
	}
});

function checkUniqueness(flavorName){
	var result = Flavors.findOne({flavorName:flavorName});
	return result ? true : false;
}