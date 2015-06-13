Template.catering.events({
	'click #basic-catering':function(){
		Session.set({
			activeModal:'packages',
			packageModalTab:'basic'
		});
	},
	'click #deluxe-catering':function(){
		Session.set({
			activeModal:'packages',
			packageModalTab:'deluxe'
		});
	}
})