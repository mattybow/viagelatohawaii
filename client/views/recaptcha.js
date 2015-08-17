Template.recaptcha.onRendered(function(){
	$.getScript('//www.google.com/recaptcha/api.js?onload=onloadcaptcha&render=explicit');
});

window.onloadcaptcha = function() { 
	$( "#recaptcha-container" ).empty();
	grecaptcha.render('recaptcha-container', {
        	sitekey: '6Lc5WwsTAAAAANmx-UcC2Qe1_g8k3EYt0YCabIoY',
            theme: 'light',
            callback: function () {
            	console.log(arguments);
            	console.log(grecaptcha.getResponse());
            return;
        }
    });
};