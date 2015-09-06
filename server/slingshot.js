var slingshotDirective = 'viaImgUpload'

Slingshot.fileRestrictions(slingshotDirective, {
  allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
  maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited)
});

Slingshot.createDirective(slingshotDirective, Slingshot.S3Storage, {

	AWSAccessKeyId: process.env.AWS_S3_ID,
  	AWSSecretAccessKey: process.env.AWS_S3_KEY,
  	region: "us-west-2",
	bucket: "viagelato",
	acl: "public-read",
	cacheControl: "max-age=604800",

	authorize: function () {
	//Deny uploads if user is not logged in.
		if (!this.userId) {
		  var message = "Please login before posting files";
		  throw new Meteor.Error("Login Required", message);
		}

		return true;
	},

	key: function (file,metaContext) {
		//Store file into a directory by the user's username.
		//var user = Meteor.users.findOne(this.userId);
		var origFileName = file.name;
		var ext = origFileName.split('.').pop();
		var index = origFileName.lastIndexOf('.');
		var newFileName = metaContext.newFileName || origFileName.slice(0,index);		//uses the new file name if passed
		var fullFileName = (newFileName + '.' + ext).toLowerCase();
		console.log(fullFileName);
		return metaContext.s3Folder + '/' + fullFileName;
	}
});