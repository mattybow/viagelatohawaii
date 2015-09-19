Template.location.helpers({
	getLocationLink:function(){
		switch (utils.getMobileOperatingSystem()){
			case 'iOS':
				return 'maps://maps.apple.com/?q=Via+Gelato+Hawaii&center=21.2821321,-157.7992884';
			/*case 'Android':
				return 'comgooglemaps://?q=Via+Gelato+Hawaii&center=21.2821321,-157.7992884';*/
			default:
				return 'http://maps.google.com/?q=Via+Gelato+Hawaii&center=21.2821321,-157.7992884';
		}
	},
	getViewbox:function(){
		var mediaWidth = window.innerWidth;
		if(mediaWidth <= MEDIA_BREAK_POINTS.mobile){
			return '50 0 640 612';
		} else if (mediaWidth <= MEDIA_BREAK_POINTS.tablet){
			return '25 0 700 612';
		} else {
			return '0 0 792 612'
		}
	}
});

