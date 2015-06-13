Template.packagesModal.rendered=function(){
	//this.$('#packagesModal').addClass('open');
}

Template.packagesModal.helpers({
	isActive:function(tab){
		return Session.get('packageModalTab') === tab ? 'active' : '';
	}
})