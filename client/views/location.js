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
	}
});

