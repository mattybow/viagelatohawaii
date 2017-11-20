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
				return '//www.google.com/maps/place/Via+Gelato/@21.2929114,-157.8521765,15z/data=!4m5!3m4!1s0x0:0x58a52d7570978229!8m2!3d21.2929114!4d-157.8521765?hl=en';
		}
	}
});
