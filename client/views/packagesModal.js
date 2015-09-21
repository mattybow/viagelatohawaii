Template.packagesModal.rendered=function(){
	//this.$('#packagesModal').addClass('open');
}

Template.packagesModal.helpers({
	isActive:function(tab){
		return Session.get('packageModalTab') === tab ? 'active' : '';
	},
	activePackage:function(){
		return Session.get('packageModalTab');
	}
})

Template.packagesModal.events({
	'click .modal-close-icon':function(){
		Session.set('activeModal','');
		$('body').removeClass('modal-open');
	},
	'click #basic-package-button':function(){
		Session.set('packageModalTab','basic')
	},
	'click #deluxe-package-button':function(){
		Session.set('packageModalTab','deluxe')
	}
})