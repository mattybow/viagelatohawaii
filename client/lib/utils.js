utils = {
	isMobile:function(){
		var THRESHOLD = 768;
		var w = window.innerWidth;
		if(w < THRESHOLD){
			return true;
		}
		return false;
	},
	getMobileOperatingSystem:function() {
	  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

	  if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
	  {
	    return 'iOS';

	  }
	  else if( userAgent.match( /Android/i ) )
	  {

	    return 'Android';
	  }
	  else
	  {
	    return 'unknown';
	  }
	}
}
