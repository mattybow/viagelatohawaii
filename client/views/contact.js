Template.contact.helpers({
	showRecaptcha:function(){
		return Session.get('showRecaptcha') ? 'show-recaptcha' : 'show-submit'
	}
})

Template.contact.events({
	"keyup #input-email":function(e){
		console.log(e.currentTarget.value);
		//validateEmail()
	},
	"click #email-submit":function(e){
		e.preventDefault();
		Session.set('showRecaptcha',true);
		/*Meteor.call('sendEmail',{
			address:'melissab888@gmail.com',
			name:'matt bow',
			text:'this is a test email'
		});*/
	}
});

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}