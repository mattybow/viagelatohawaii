var imgUploaderDirective = 'viaImgUpload';
FLAVOR_PHOTO_STATUSES = {
	0:'none',
	1:'uploading',
	2:'success',
	3:'error'
}
Session.setDefault('flavorPhotoUploadStatus',0);

Template.imgUploader.onCreated(function(){
	Slingshot.fileRestrictions(imgUploaderDirective, {				//only allow images to upload
	  allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
	  maxSize: 10 * 1024 * 1024 									// 10 MB (use null for unlimited).
	});
	var _self = this;
	this.data.parent.uploadImage = function(fileName){
		return new Promise(function(resolve,reject){
			if(Meteor.userId()){									//user is AUTHORIZED
				var file = _self.stagedFile;
				if(!file){
					resolve(null);  								//case when user did not upload file
				} else {
					Session.set('flavorPhotoUploadStatus',1);
					var metaContext = {s3Folder: _self.data.s3Folder, newFileName:fileName};
					console.log(metaContext);
					var uploader = new Slingshot.Upload(imgUploaderDirective, metaContext);
					_self.showProgress.set(true);

					uploader.send(file,function(err,downloadUrl){
						if (err) {
							// Log service detailed response.
							console.error(err);
							console.error('Error uploading', uploader.xhr.response);
							Session.set('flavorPhotoUploadStatus',3);
						} else {
							Session.set('flavorPhotoUploadStatus',2);				//success updates icon to checkmark
							resolve(downloadUrl);
						}
					});

					var hideProgress = function(){
						_self.showProgress.set(false);
						_self.isDragEnter.set(false);
						Meteor.setTimeout(function(){
							_self.progress.set(0);
						},200);
					};

					var checkProgress = Meteor.setInterval(function(){
						var updatedProgress = Math.round(uploader.progress()* 100);
						var prevProgress = _self.progress.get();
						if(updatedProgress !== prevProgress){
							_self.progress.set(updatedProgress);
						}
						if(updatedProgress === 100){
							Meteor.clearInterval(checkProgress);
							Meteor.clearTimeout(cancelCheckProgress);
							hideProgress();
						}
					},16);

					var cancelCheckProgress = Meteor.setTimeout(function(){
						Meteor.clearInterval(checkProgress);
						Session.set('flavorPhotoUploadStatus',3);
					},10000);
				}
			} else {
				reject('asdf');
				// _self.isDragEnter.set(false);
				// toastr.error('please login to perform this transaction','TRANSACTION DENIED');
			}
		});
	}

	this.data.parent.resetUploader = function(){
		Session.set('flavorPhotoUploadStatus',0);
		_self.base64Url.set('');
		_self.stagedFile = '';
	}

	//INITIALIZE REACTIVE VARIABLES
	this.isDragEnter = new ReactiveVar(false);
	this.base64Url = new ReactiveVar('');
	this.progress = new ReactiveVar(0);
	this.showProgress = new ReactiveVar(false);
	
});

Template.imgUploader.helpers({
	isDragEnter:function(){
		return Template.instance().isDragEnter.get() ? 'dragenter' : '';
	},
	getStatus:function(){
		var index = Session.get('flavorPhotoUploadStatus');
		return FLAVOR_PHOTO_STATUSES[index];
	},
	displayDefaultMsg:function(){
		return Session.get('flavorPhotoUploadStatus')>0 ? "hidden" : "";
	},
	getStatusIcon:function(){
		var index = Session.get('flavorPhotoUploadStatus');
		switch (index){
			case 0:
				return '';
			case 1:
				return 'icon-upload';
			case 2:
				return 'icon-check-mark';
			case 3:
				return 'icon-notifications';
		}
	},
	getRemaining:function(){
		return 100 - Template.instance().progress.get();
	},
	displayProgress:function(){
		return Template.instance().showProgress.get() ? '' : 'transparent';
	},
	hasImagePreview:function(){
		var result = Template.instance().base64Url.get() ? 'selection-made' : '';
		console.log(result);
		return result;
	},
	getImagePreview:function(){
		return Template.instance().base64Url.get();
	}
})

Template.imgUploader.events({
	'click .flavor-upload-preview-holder':function(e){		//remove file preview
		preventAndStop(e);
		var _self = Template.instance();
		_self.base64Url.set('');
		_self.find('#hidden-file-input').value = '';
		Session.set('newFileExt','');
	},
	'click #addFlavorPhotoDropzone':function(e){
		preventAndStop(e);
		Template.instance().$('#hidden-file-input').click();
	},
	'click #hidden-file-input':function(e){
		e.stopPropagation();
	},
	'change #hidden-file-input':function(e){
		var _self = Template.instance();
		processDrop(e,_self);
	},
	'dragenter #addFlavorPhotoDropzone':function(e){
		preventAndStop(e);
		Template.instance().isDragEnter.set(true);
	},
	'dragover #addFlavorPhotoDropzone':function(e){
		preventAndStop(e);
	},
	'dragleave #addFlavorPhotoDropzone':function(){
		Template.instance().isDragEnter.set(false);
	},
	'drop #addFlavorPhotoDropzone':function(e){
		preventAndStop(e);
		Template.instance().isDragEnter.set(false);
		var _self = Template.instance();
		processDrop(e,_self);
	}
});

function processDrop(e,context){
	console.log(e);
	var files = e.currentTarget.files || e.originalEvent.dataTransfer.files;
	if(files.length === 1){
		var file = files[0];
		context.stagedFile = file;
		var fileReader = new FileReader();
		fileReader.onload = function(){
			handleLoad(file,fileReader.result,context)
		}
		fileReader.readAsDataURL(file);
	} else if(files.length > 1) {
		console.log('only one file allowed');
	} else {
		console.log('no files supplied');
	}
}

function handleLoad(file,imgUrl,context){
	context.base64Url.set(imgUrl);
	var ext = file.name.split('.').pop();
	Session.set('newFileExt',ext);
}

function preventAndStop(e){
	e.preventDefault();
	e.stopPropagation();
}