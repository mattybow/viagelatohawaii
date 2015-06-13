Template.transitionLeft.rendered=function(){
	ONSCREEN_CLASS = 'open'
	EVENTS = 'webkitTransitionEnd oTransitionEnd transitionEnd msTransitionEnd transitionend'
	 
	hooks = {
	  insertElement: function(node, next){	
		console.log($(node));
	    Tracker.afterFlush(function(){
			$(node).addClass(ONSCREEN_CLASS);
	    }.bind(this));
	  },
	 
	  removeElement: function(node){
	    $(node)
	      .removeClass(ONSCREEN_CLASS)
	      .on(EVENTS,function(){
	      	$(node).remove()
	      })
	    }
	}
	this.firstNode.parentNode._uihooks = hooks;
}