Template.newFlavorForm.onCreated(function(){
	this.newFlavorName = new ReactiveVar('');
	this.newFlavorFileName = new ReactiveVar('');
	this.highlightNameField = new ReactiveVar(false);
	this.createStatus = new ReactiveVar('create');
	this.errorMsg = new ReactiveVar('');
	this.isDirty = new ReactiveVar(false);

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
	Session.setDefault('flavorFormOpened',{opened:false,_id:''});

});

Template.newFlavorForm.onRendered(function(){
	this.autorun(function(){
		var editId = Session.get('flavorFormOpened')._id;
		if(editId){
			this.isDirty.set(false);
			var flavorData = Flavors.getFlavorById(editId);
			this.$('#new-flavor-name-input').val(flavorData.flavorName).change();
		} else {
			this.$('#new-flavor-name-input').val('').change();
		}
	}.bind(this));
});

Template.newFlavorForm.helpers({
	showNewForm:function(){
		return Session.get('flavorFormOpened').opened ? 'opened' : '';
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
		if(Session.get('flavorFormOpened')._id){
			return 'save';
		}
		return Template.instance().createStatus.get();
	},
	isInEditMode:function(){
		return Session.get('flavorFormOpened')._id ? 'is-editing' : 'is-new';
	},
	isDirty:function(){
		if(Session.get('flavorFormOpened')._id){
			return Template.instance().isDirty.get() ? 'enabled' : 'disabled';
		}
	},
	isInvalid:function(fieldName){
		return Template.instance().highlightNameField.get() ? 'invalid' : '';
	},
	getErrorMsg:function(){
		return Template.instance().highlightNameField.get() ? Template.instance().errorMsg.get() : '';
	},
	getResolutions:function(){
		return [
			{key:'thumbnail', size:130, square:true},
			{key:'standard_resolution', size:200, square:true}
		];
	}
});

Template.newFlavorForm.events({
	'click .cancel-create-flavor':function(){
		Session.set('flavorFormOpened',{opened:false,_id:''});
	},
	'click #submit-flavor-form':function(){
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

		var newFileName = _self.newFlavorFileName.get();
		_self.uploadImage(newFileName).then(function(assets){
			var images = lodash.reduce(assets,function(prev,next){
				prev[next.key] = lodash.omit(next,'key');
				return prev;
			},{})
			var data = {
				flavorName:_self.find('#new-flavor-name-input').value,
				images:images || {},
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
			console.log(err);
			_self.createStatus.set('error');
		});
	},
	'keyup #new-flavor-name-input, change #new-flavor-name-input':function(e){
		var dirtyVal = e.currentTarget.value;
		Template.instance().newFlavorName.set(dirtyVal);
		var specialCharRegex = /\W+/g;
		var cleanVal = dirtyVal.replace(/\s/g,'_').replace(specialCharRegex,'');
		Template.instance().newFlavorFileName.set(cleanVal.toLowerCase());
	},
	'focus #flavor-name-field':function(){
		Template.instance().highlightNameField.set(false);
	},
	'click #delete-flavor':function(e){
		e.preventDefault();
		e.stopPropagation();
		var id = Session.get('flavorFormOpened')._id;
		if(id){
			Meteor.call('deleteFlavor',id,function(err,res){
				if(err){
					console.log('DELETE ERROR',err);
				} else {
					Session.set('flavorFormOpened',{opened:true,_id:''});
				}
			});
		}
	}
});

function isDuplicate(flavorName){
	var result = Flavors.findOne({flavorName:flavorName});
	return result ? true : false;
}