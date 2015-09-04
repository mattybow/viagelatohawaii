Template.libFlavorListView.onCreated(function(){
});

Template.libFlavorListView.helpers({
	addOrRemove:function(){
		var id = Template.instance().data ? Template.instance().data._id : null;
		var session = Session.get('dayFlavors');
		return session.indexOf(id) >= 0 ? 'remove' : '';
	},
	getImgPath:function(){
		return Template.instance().data ? this.imgPath  || this.images.thumbnail.url : 'https://s3-us-west-2.amazonaws.com/viagelato/flavors/cone.png';
	},
	getMobileEditClass:function(){
		if(window.innerWidth <= 414){
			return "edit-flavor-button";
		}
		return '';
	}
});

Template.libFlavorListView.events({
	'click .btn-line':function(ev){
		var id = this._id;
		var session = Session.get('dayFlavors');
		if(session.indexOf(id) >= 0){
			Session.set('dayFlavors',lodash.pull(session,id)); //remove from array
		} else {
			session.unshift(id);
			var orderedSet = Flavors.find({_id:{$in:session}},{fields:{_id:1},sort:{flavorName:1}}).fetch();
			var newSessionData = lodash.pluck(orderedSet,'_id');
			Session.set('dayFlavors',newSessionData);
		}
		
	},
	'click .edit-flavor-button':function(){
		Session.set('flavorFormOpened',{opened:true,_id:this._id});
	}
});