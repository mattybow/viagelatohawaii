var getInputData;
var resetInputForm;

Template.recaptcha.onCreated(function(){
	//set up parent method bindings
	getInputData = this.data.parent.getInputData;
	resetInputForm = this.data.parent.resetInputForm;
});


function prepareInputData(inputData, response){
	return {
		address:inputData.email,
		name:inputData.name,
		text:inputData.comment,
		recaptchaResponse:response
	};
}

function reset(){
	Meteor.setTimeout(function(){
						Session.set('showRecaptcha',false);
						grecaptcha.reset();
						resetInputForm();
					},2000);
}

window.onloadcaptcha = function() { 
	$( "#recaptcha-container" ).empty();
	grecaptcha.render('recaptcha-container', {
    	sitekey: '6Lc5WwsTAAAAANmx-UcC2Qe1_g8k3EYt0YCabIoY',
        theme: 'light',
        callback: function () {
        	var response = grecaptcha.getResponse();
        	if(response){
        		Meteor.call('sendEmail',
        					prepareInputData(getInputData(),response),
        					function(err,res){
        						if(res.ok){
        							Session.set('submissionFeedback',{type:'success',message:"Thanks! We'll be in touch shortly"});
        							reset();
        						} else {
        							Session.set('submissionFeedback',{type:'error',message:'Eeek, something went wrong, please try again'});
									Session.set('showRecaptcha',false);
									grecaptcha.reset();
        						}
        					}
        		);
        	}
        	return;
    	}
    });
};