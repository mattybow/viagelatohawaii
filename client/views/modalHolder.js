Template.modalHolder.helpers({
	isModal:function(modalName){
		return Session.get('activeModal')===modalName;
	},
	isActive:function(){
		return Session.get('activeModal') ? 'active' : '';
	},
	nothing:function(){
		return '';
	}
});

Template.modalHolder.events({
	'click':function(){
		Session.set('activeModal','');
	}
})

Template.modalHolder.rendered=function(){
	ONSCREEN_CLASS = 'open'
	EVENTS = 'webkitTransitionEnd oTransitionEnd transitionEnd msTransitionEnd transitionend'
	 
	hooks = {
	  insertElement: function(node, next){	
	  	$(node).insertBefore(next);
	    Tracker.afterFlush(function(){
			Meteor.setTimeout(function(){			//for some reason, this gets called sooner than the rendering engine can add it to the dom, so the css transition doesn't work without this timeout
				$(node).addClass(ONSCREEN_CLASS);
			}.bind(this),1);

	    });
	  },
	 
	  removeElement: function(node){
	    $(node)
	      .removeClass(ONSCREEN_CLASS)
	      .on(EVENTS,function(){
	      	$(node).remove()
	      })
	    }
	}
	this.firstNode._uihooks = hooks;
}