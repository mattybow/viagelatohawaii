Template.newFlavorForm.onCreated(function(){
	this.newFlavorName = new ReactiveVar('');
	this.newFlavorFileName = new ReactiveVar('');
	this.highlightNameField = new ReactiveVar(false);
	this.createStatus = new ReactiveVar('create');
	this.errorMsg = new ReactiveVar('');

	this.getFileName = function(){
		var ext = Session.get('newFileExt');
		if(ext){
			var filename = this.newFlavorFileName.get();
			if(filename){
				return  filename + '.' + ext.toLowerCase();
			}
			
		}
		return '';
	}
});

Template.newFlavorForm.onRendered(function(){
});

Template.newFlavorForm.helpers({
	showNewForm:function(){
		return Session.get('newFormOpened') ? 'opened' : '';
	},
	getFlavorFileName:function(){
		return Template.instance().getFileName();
	},
	getFlavorName:function(){
		var flavorName = Template.instance().newFlavorName.get();
		return flavorName ? flavorName : 'New Flavor';
	},
	passParentRef:function(){
		return Template.instance();
	},
	getUploadStatus:function(){
		var index = Session.get('flavorPhotoUploadStatus');
		return FLAVOR_PHOTO_STATUSES[index];
	},
	getCreateStatus:function(){
		return Template.instance().createStatus.get();
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
		var _self = Template.instance();
		var flavorName = _self.newFlavorName.get();
		if(!flavorName){
			_self.highlightNameField.set(true);
			_self.errorMsg.set('flavor name is required');
			return false;
		}
		if(isDuplicate(flavorName)){
			_self.highlightNameField.set(true);
			_self.errorMsg.set('duplicate flavor name');
			return false
		}
		_self.createStatus.set('creating');

		_self.uploadImage().then(function(assetUrl){
			var imgPath = assetUrl ? assetUrl : null;
			var data = {
				flavorName:_self.find('input[name="new-flavor-name"]').value,
				imgPath:imgPath,
				seasonal:false,
				description:_self.find('textarea[name="new-flavor-descript"]').value
			};
			return new Promise(function(resolve,reject){
				Meteor.call('createNewFlavor',data,function(err,res){
					if(err){
						console.log('ERROR',err);
						reject(err);
					} else {
						_self.createStatus.set('created');
						console.log('SUCCESS',res);
						resolve();
					}
				});
			});
		}).then(function(){
			Meteor.setTimeout(function(){					//RESET METHOD
				_self.createStatus.set('create');			//reset create button
				_self.resetUploader();						//child created this
				_self.$('form')[0].reset();					//reset input fields
				_self.newFlavorName.set('');
				_self.newFlavorFileName.set('');
			},1500);
		}).catch(function(err){
			_self.createStatus.set('error');
		});
	},
	'keyup [name="new-flavor-name"]':function(e){
		var dirtyVal = e.currentTarget.value;
		Template.instance().newFlavorName.set(dirtyVal);
		var regex = /\W+/g;
		var cleanVal = dirtyVal.replace(regex,'');
		Template.instance().newFlavorFileName.set(cleanVal.toLowerCase());
	},
	'focus #flavor-name-field':function(){
		Template.instance().highlightNameField.set(false);
	}
});

function isDuplicate(flavorName){
	var result = Flavors.findOne({flavorName:flavorName});
	return result ? true : false;
}