Template.editHours.onCreated(function(){
	this.subscribe('hours');
})

Template.editHours.helpers({
	getRegularHours:function(){
		return Hours.getHours();
	},
	dayConverter:function(day){
		switch (day){
			case 'MON':
				return 'MONDAY';
			case 'TUE':
				return 'TUESDAY';
			case 'WED':
				return 'WEDNESDAY';
			case 'THU':
				return 'THURSDAY';
			case 'FRI':
				return 'FRIDAY';
			case 'SAT':
				return 'SATURDAY';
			case 'SUN':
				return 'SUNDAY';
		}
	},
	hourConverter:function(hr){
		if(!hr) return '-';
		var hrNum = hr;
		if(hr===0){
			hrNum = 12;
		} else if (hr > 12) {
			hrNum = hr % 12;
		}
		return hrNum;
	},
	ampmConverter:function(hr){
		if(!hr) return '';
		var ampm = 'AM';

		if (hr >= 12) {
			ampm = 'PM';
		}

		return ampm;
	}
});