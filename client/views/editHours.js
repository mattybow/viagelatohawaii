Template.editHours.onCreated(function(){
	this.subscribe('allHours');
	this.newException = new ReactiveVar({
		open:true,
		openHr:11,
		closeHr:10
	});
	this.newExceptionDate = new ReactiveVar('');
	var _self = this;
	this.setNewExceptionStatus = function(newData){
		var oldData = _self.newException.get();
		_self.newException.set(lodash.assign(oldData,newData));
	}
});

Template.editHours.helpers({
	getRegularHours:function(){
		return Hours.getHours();
	},
	getExceptions:function(){
		return Hours.getExceptions();
	},
	noExceptionsFound:function(){
		return Hours.getExceptions().count() ? false : true;
	},
	isNewOpen:function(){
		return Template.instance().newException.get().open ? 'checked' : '';
	},
	isNewClosed:function(){
		return Template.instance().newException.get().open ? '' : 'checked';
	},
	formValid:function(){
		var openData = Template.instance().newException.get();
		var hasTime = false;
		if((openData.open && openData.openHr && openData.closeHr) || !openData.open){
			hasTime = true;
		}
		var hasDate = Template.instance().newExceptionDate.get() ? true : false;
		var valid = hasDate && hasTime;
		return valid ? 'enabled' : 'disabled';
	},
	getNewOpenHr:function(){
		return Template.instance().newException.get().openHr;
	},
	getNewCloseHr:function(){
		return Template.instance().newException.get().closeHr;
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
	},
	humanDate:function(dateStr){
		return moment(new Date(dateStr)).format('MMM D YYYY');
	},
	humanWkDay:function(dateStr){
		return moment(new Date(dateStr)).format('dddd');
	},
	openOrClose:function(type){
		var isOpen = this.openHour && this.closeHour ? true : false;
		switch (type){
			case 'icon':
				return isOpen ? 'icon-check-mark' : 'icon-close';
			case 'color':
				return isOpen ? '' : 'close-color';
			default:
				return isOpen;
		}	
	},
	exceptionApplicationStatus:function(){
		var now = moment(new Date());
		var date = moment(new Date(this.date));
		var diff = date.diff(now,'days',true);
		if(diff > -1 && diff < 0){
			return 'APPLYING';
		} else if (diff >0) {
			return 'WILL APPLY';
		} else {
			return 'APPLIED';
		}
	}
});

Template.editHours.events({
	'click #open-checkbox-container': function(){
		Template.instance().setNewExceptionStatus({open:true});
	},
	'click #closed-checkbox-container': function(){
		Template.instance().setNewExceptionStatus({open:false});
	},
	'change #exception-input-date':function(e){
		var dateStr = e.currentTarget.value;
		var date = new Date(dateStr);
		if(date){
			Template.instance().newExceptionDate.set(date);
		}
	},
	"change #exception-input-open-hour":function(e){
		var hour = parseInt(e.currentTarget.value) || '';
		Template.instance().setNewExceptionStatus({openHr:hour});
	},
	"change #exception-input-close-hour":function(e){
		var hour = parseInt(e.currentTarget.value) || '';
		Template.instance().setNewExceptionStatus({closeHr:hour});
	},
	'click #add-exception':function(e){
		e.preventDefault();
		var openHour=null;
		var closeHour=null;
		var dateInput = Template.instance().find('#exception-input-date').value;
		var dateVal = new Date(dateInput).setUTCHours(10);
		var utcDate = new Date(dateVal).toISOString();
		var openData = Template.instance().newException.get();
		if(openData.open){
			openHour = openData.openHr,
			closeHour = openData.closeHr + 12;
		}

		var data = {
			type:'exception',
			openHour:openHour,
			closeHour:closeHour,
			date:utcDate
		}

		Meteor.call('createException',data,function(err,res){
			if(err){
				Growler.fail('Exception Not Created', 'Failure!');
				console.log(err);
			} else {
				if(lodash.isNumber(res)){
					Growler.success('Updated Existing Exception', 'Success!');
				} else {
					Growler.success('Created Exception', 'Success!');
				}
			}
		});
	},
	'click #delete-exception':function(){
		Meteor.call('deleteException',this._id,function(err,res){
			if(err){
				console.log(err);
			}
		});
	}
})