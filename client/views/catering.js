Template.catering.events({
	'click #basic-catering':function(){
		Session.set({
			activeModal:'packages',
			packageModalTab:'basic'
		});
		$('body').addClass('modal-open');
	},
	'click #deluxe-catering':function(){
		Session.set({
			activeModal:'packages',
			packageModalTab:'deluxe'
		});
		$('body').addClass('modal-open');
	}
})