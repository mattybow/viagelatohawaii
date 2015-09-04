Template.editPress.onCreated(function(){
	this.subscribe('frames');
	this.newPressName = new ReactiveVar('');
	this.newPressFileName = new ReactiveVar('');
	this.chosenFrame = new ReactiveVar('');
	this.frameInvalid = new ReactiveVar(false);
	this.publicationInvalid = new ReactiveVar(false);
	this.createStatus = new ReactiveVar('create');
	this.data={};
})


Template.editPress.helpers({
	passParentRef:function(){
		return Template.instance();
	},
	getUploadStatus:function(){
		return Template.instance().createStatus.get();
	},
	getNewPressFileName:function(){
		var ext = Session.get('newFileExt');
		var fileName = Template.instance().newPressFileName.get();
		if(!ext || !fileName){
			return '';
		}
		return fileName + '.' + ext;
	},
	frames:function(){
		return Frames.get();
	},
	chosen:function(id){
		return Template.instance().chosenFrame.get() === id ? 'chosen' : '';
	},
	pubInvalid:function(){
		return Template.instance().publicationInvalid.get() ? 'invalid' : '';
	},
	frameInvalid:function(){
		return Template.instance().frameInvalid.get() ? 'invalid' : '';
	},
	getResolutions:function(){
		return [
			{key:'thumbnail', size:150},
			{key:'low_resolution', size:360 },
			{key:'standard_resolution', size:800}
		];
	}
});

Template.editPress.events({
	'keyup #input-press-title':function(e){
		var dirtyVal = e.currentTarget.value;
		Template.instance().newPressName.set(dirtyVal);
		var regex = /\W+/g;
		var cleanVal = dirtyVal.replace(regex,'');
		Template.instance().newPressFileName.set(cleanVal.toLowerCase());
	},
	'click .frame-choice':function(e){
		e.stopPropagation();
		Template.instance().chosenFrame.set(this._id);
		Template.instance().frameInvalid.set(false);
	},
	'focus input[name="input-press-publication"]':function(e){
		Template.instance().publicationInvalid.set(false);
	},
	'click #create-press':function(e){
		var _self = Template.instance();
		var frame = Frames.findOne({_id:_self.chosenFrame.get()});
		var publication = _self.find('input[name="input-press-publication"]').value || null;
		if(frame && publication){
			var newFileName = _self.newPressFileName.get();
			console.log(newFileName);
			_self.createStatus.set('error');
			_self.uploadImage(newFileName).then(function(assetUrl){
				var data = {
					title: _self.find('#input-press-title').value || null,
					publication: publication,
					author: _self.find('input[name="input-press-author"]').value || null,
					caption: _self.find('input[name="input-press-caption"]').value || null,
					link: _self.find('input[name="input-press-link"]').value || null,
					date: _self.find('input[name="input-press-date"]').value || null,
					active:true,
					svgId: frame.svgId,
					frame:frame.url,
					imgPath:assetUrl || null
				};
				console.log(data);

				return new Promise(function(resolve,reject){
					Meteor.call('createNewPress',data,function(err,res){
						if(err){
							console.log('ERROR',err);
							reject(err);
						} else if (!res) {
							reject('document was not inserted');
						} else {
							_self.createStatus.set('created');
							console.log('SUCCESS',res);
							resolve();
						}
					});
				});
			}).then(function(){
				Growler.success("It's in the bag",'Got it!');
				Meteor.setTimeout(function(){					//RESET METHOD
					_self.createStatus.set('create');			//reset create button
					_self.resetUploader();						//child created this
					_self.$('form')[0].reset();					//reset input fields
					_self.newPressName.set('');
					_self.newPressFileName.set('');
					_self.chosenFrame.set('');
				},1500);
			}).catch(function(err){
				Growler.fail(err,'Something is Wrong');
				_self.createStatus.set('error');
			});
		} else {
			if(!frame) _self.frameInvalid.set(true);
			if(!publication) _self.publicationInvalid.set(true);
		}
	} 
})