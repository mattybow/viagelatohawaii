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

	this.getAssetInfo = function(){
		var editId = Session.get('flavorFormOpened')._id;
		var info = Flavors.findOne({_id:editId});
		return info || {_id:''};
	}

	Session.setDefault('flavorFormOpened',{opened:false,_id:''});

});

Template.newFlavorForm.onRendered(function(){
	this.autorun(function(){
		var editId = Session.get('flavorFormOpened')._id;
		if(editId){
			this.isDirty.set(false);
			this.createStatus.set('save');
			var flavorData = Flavors.getFlavorById(editId);
			this.$('#new-flavor-name-input').val(flavorData.flavorName).change();
			var descript = flavorData.description || '';
			this.$('#new-flavor-descript').val(descript).change();
			this.injectS3Data(flavorData.images);
		} else {
			this.$('#new-flavor-name-input').val('').change();
			this.$('#new-flavor-descript').val('').change();
			this.createStatus.set('create');
			this.resetUploader();
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
	getCreateStatus:function(){
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
		var isNewForm = Session.get('flavorFormOpened')._id ? false : true;
		var _self = Template.instance();
		var flavorName = _self.newFlavorName.get();
		if(!flavorName){
			_self.highlightNameField.set(true);
			_self.errorMsg.set('flavor name is required');
			return false;
		}
		if(isNewForm && isDuplicate(flavorName)){
			_self.highlightNameField.set(true);
			_self.errorMsg.set('duplicate flavor name');
			return false
		}
		if(isNewForm){
			_self.createStatus.set('creating');
		} else {
			_self.createStatus.set('saving');
		}

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
					description:_self.find('textarea[name="new-flavor-descript"]').value,
					_id:Session.get('flavorFormOpened')._id
				};
				if(isNewForm){
					return new Promise(function(resolve,reject){
						Meteor.call('createNewFlavor',data,function(err,res){
							if(err){
								console.log('ERROR',err);
								reject(err);
							} else {
								_self.createStatus.set('created');
								console.log('SUCCESS',res);
								resolve('create');
								Growler.success("New Flavor Created",'Success!');
							}
						});
					});
				} else {
					if(!_self.imgUploaderisDirty()){
						data.images = _self.getAssetInfo().images;
					}
					return new Promise(function(resolve,reject){
						Meteor.call('saveFlavorChanges',data,function(err,res){
							if(err){
								console.log('ERROR',err);
								reject(err);
							} else {
								_self.createStatus.set('saved');
								_self.isDirty.set(false);
								console.log('SUCCESS',res);
								Growler.success("Changes Saved",'Success!');
								resolve('save');
							}
						});
					});
				}
				
		}).then(function(returnStatus){
			switch(returnStatus){
				case 'create':
					Meteor.setTimeout(function(){					//RESET METHOD
						_self.createStatus.set(returnStatus);		//reset create or save button
						_self.resetUploader();						//child created this
						_self.$('form')[0].reset();					//reset input fields
						_self.newFlavorName.set('');
						_self.newFlavorFileName.set('');
					},1000);
					break;
				case 'save':
					Meteor.setTimeout(function(){					//RESET METHOD
						_self.createStatus.set(returnStatus);		//reset create or save button
					},500);
			}
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
	'keyup #new-flavor-name-input, keyup #new-flavor-descript':function(){
		Template.instance().isDirty.set(true);
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