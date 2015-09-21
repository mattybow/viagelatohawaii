FLAVOR_PHOTO_STATUSES = {
	0:'none',
	1:'uploading',
	2:'success',
	3:'error'
}

Template.uploaderFileProgress.helpers({
	getRemaining:function(){
		return 100 - this.progress;
	},
	showProgressClass:function(){
		return this.isUploading ? '' : 'progress-hidden';
	},
	statusIconClass:function(){
		if(this.isUploading){
			return 'icon-upload';
		} else {
			switch (this.uploadResult){
				case 'success':
					return 'icon-check-mark';
				case 'error':
					return 'icon-notifications';
				default:
					return '';
			}
		}
	},
	filenameFromUrl:function(url){
		return url.replace(/^.*\//,'');
	}
})