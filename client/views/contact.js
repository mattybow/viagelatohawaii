Template.contact.onCreated(function(){
	this.isEmailValid = new ReactiveVar(true);
	this.isNameValid = new ReactiveVar(true);
	this.isCommentValid = new ReactiveVar(true);
	this.nameError = new ReactiveVar('');
	this.emailError = new ReactiveVar('');
	this.commentError = new ReactiveVar('');
	this.submissionFeedback = new ReactiveVar("Thanks! We'll be in touch shortly.");
	this.grecaptchaLoaded = false;
	Session.setDefault('submissionFeedback',{type:'success',message:''});

	this.inputData = {};
	this.getInputData = function(){
		return this.inputData;
	}.bind(this);
	this.resetInputForm = function(){
		//reset inputs
		$('#input-name').val('');
		$('#input-email').val('');
		$('#input-comment').val('');
	}.bind(this);
})

Template.contact.helpers({
	showRecaptcha:function(){
		return Session.get('showRecaptcha') ? 'show-recaptcha' : 'show-submit'
	},
	nameValid:function(){
		return Template.instance().isNameValid.get() ? "input-ok" : "input-not-ok";
	},
	emailValid:function(){
		return Template.instance().isEmailValid.get() ? "input-ok" : "input-not-ok";
	},
	commentValid:function(){
		return Template.instance().isCommentValid.get() ? "input-ok" : "input-not-ok";
	},
	nameError:function(){
		return Template.instance().nameError.get();
	},
	emailError:function(){
		return Template.instance().emailError.get();
	},
	commentError:function(){
		return Template.instance().commentError.get();
	},
	submissionFeedback:function(){
		return Session.get('submissionFeedback').message;
	},
	hasFeedback:function(){
		return Session.get('submissionFeedback').message ? 'show' : '';
	},
	feedbackType:function(){
		return Session.get('submissionFeedback').type;
	},
	passParentRef:function(){
		return Template.instance();
	}
})

Template.contact.events({
	"focus #input-name":function(){
		if(!Template.instance().grecaptchaLoaded){
			Template.instance().grecaptchaLoaded = true;
			$.getScript('//www.google.com/recaptcha/api.js?onload=onloadcaptcha&render=explicit');
		}
	},
	"focus input, focus textarea":function(){
		Session.set('submissionFeedback',{type:'success',message:""});
	},
	"blur #input-email":function(e){
		if(!validateEmail(e.currentTarget.value)){
			Template.instance().isEmailValid.set(false);
			Template.instance().emailError.set("this doesn't look like a valid email");
		}
	},
	"keyup #input-email":function(e){
		Template.instance().isEmailValid.set(true);
		Template.instance().emailError.set("");
	},
	"keyup #input-name":function(e){
		Template.instance().isNameValid.set(true);
		Template.instance().nameError.set("");
	},
	"keyup #input-comment":function(e){
		Template.instance().isCommentValid.set(true);
		Template.instance().commentError.set("");
	},
	"click #email-submit":function(e){
		e.preventDefault();
		Session.set('submissionFeedback',{type:'success',message:""});
		var emailOk = false;
		var nameOk = false;
		var commentOk = false;
		var connectionOk = false;

		//EMAIL check
		var email = $('#input-email').val()
		var isValidEmail = validateEmail(email);

		if(email && isValidEmail){
			emailOk = true;
		} else {
			Template.instance().isEmailValid.set(false);
			Template.instance().emailError.set("this doesn't look like a valid email");
		}

		//NAME check
		var name = $('#input-name').val();

		if(name){
			nameOk = true;
		} else {
			Template.instance().isNameValid.set(false);
			Template.instance().nameError.set("let us know how to address you");
		}


		//COMMENT check
		var comment = $('#input-comment').val();
		if(comment){
			commentOk = true;
		} else {
			Template.instance().isCommentValid.set(false);
			Template.instance().commentError.set("please leave us a message");
		}

		//CONNECTION check
		var connection = Meteor.status().connected;
		if(connection){
			connectionOk = true;
		} else {
			Session.set('submissionFeedback',{type:'error',message:"Disconnected from server. Please try again when you have a connection"});
		}

		//all ok?
		if (emailOk && nameOk && commentOk && connectionOk){
			Session.set('showRecaptcha',true);
			Template.instance().inputData={
				email:email,
				name:name,
				comment:comment
			};
		}
	}
});

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}
