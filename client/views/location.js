Template.location.helpers({
	getLink:function(){
		switch (utils.getMobileOperatingSystem()){
			case 'iOS':
				return 'maps://maps.apple.com/?q=Via+Gelato+Hawaii&center=21.2821321,-157.7992884';
			/*case 'Android':
				return 'comgooglemaps://?q=Via+Gelato+Hawaii&center=21.2821321,-157.7992884';*/
			default:
				return 'http://maps.google.com/?q=Via+Gelato+Hawaii&center=21.2821321,-157.7992884';
		}
	},
	getWardLink:function(){
		switch (utils.getMobileOperatingSystem()){
			case 'iOS':
				return 'maps://maps.apple.com/?ll=21.292944,-157.852250';
			/*case 'Android':
				return 'comgooglemaps://?q=Via+Gelato+Hawaii&center=21.2821321,-157.7992884';*/
			default:
				return '//goo.gl/maps/bRgurwEXBeK2';
		}
	}
});
