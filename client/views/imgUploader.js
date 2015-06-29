var imgUploaderDirective = 'candidateImgUpload';
var STATUSES = {
	0:'none',
	1:'uploading',
	2:'success',
	3:'error'
}

Template.imgUploader.onCreated(function(){
	Slingshot.fileRestrictions(imgUploaderDirective, {					//only allow images to upload
	  allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
	  maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited).
	});
	this.uploader = new Slingshot.Upload(imgUploaderDirective);

	//INITIALIZE REACTIVE VARIABLES
	this.isDragEnter = new ReactiveVar(false);
	this.uploadStatus = new ReactiveVar(0);
	this.previewFileName = new ReactiveVar('');
	this.progress = new ReactiveVar(0);
	this.showProgress = new ReactiveVar(false);
	this.s3Url = new ReactiveVar('');
	
});

Template.imgUploader.helpers({
	isDragEnter:function(){
		return Template.instance().isDragEnter.get() ? 'dragenter' : '';
	},
	getFileName:function(){
		return Template.instance().previewFileName.get();
	},
	getStatus:function(){
		var index = Template.instance().uploadStatus.get();
		return STATUSES[index];
	},
	displayDefaultMsg:function(){
		return Template.instance().uploadStatus.get()>0 ? "hidden" : "";
	},
	getStatusIcon:function(){
		var index = Template.instance().uploadStatus.get();
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
		return Template.instance().showProgress.get() ? '' : 'hidden';
	},
	getS3Url:function(){
		return Template.instance().s3Url.get();
	}
})

Template.imgUploader.events({
	'click #addFlavorPhotoDropzone':function(e){
		preventAndStop(e);
		console.log(Template.instance());
		return Template.instance().$('#hidden-file-input').click();
	},
	'click #hidden-file-input':function(e){
		e.stopPropagation();
	},
	'change #hidden-file-input':function(e){
		//console.log('hidden input changed');
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
		var _self = Template.instance();
		if(Meteor.userId()){
			var file = e.originalEvent.dataTransfer.files[0];
			_self.previewFileName.set(file.name);
			_self.uploadStatus.set(1);
			showProgress();

			_self.uploader.send(file,function(err,downloadUrl){
				if (err) {
					// Log service detailed response.
					console.error(err);
					console.error('Error uploading', _self.uploader.xhr.response);
					_self.uploadStatus.set(3);
				} else {
					_self.s3Url.set(downloadUrl);			//give parent s3 url
					_self.uploadStatus.set(2);				//success updates icon to checkmark
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
				var updatedProgress = Math.round(_self.uploader.progress()* 100);
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
				_self.uploadStatus.set(3);
			},10000);
		} else {
			_self.isDragEnter.set(false);
			toastr.error('please login to perform this transaction','TRANSACTION DENIED');
		}
	}
});

function showProgress(){
	Template.instance().showProgress.set(true);
}

function preventAndStop(e){
	e.preventDefault();
	e.stopPropagation();
}