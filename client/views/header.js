Template.header.helpers({
	menuOpen:function(){
		return Session.get('isMenuOpen') ? 'opened' : 'closed';
	},
	navHidden:function(){
		return Session.get('isNavHidden') ? 'minimized' : '';
	}
});

Template.header.events({
	'click .burger-container':function(){
		var state = !Session.get('isMenuOpen');
		Session.set('isMenuOpen',state);
		if(state){
			$('#mobile-nav .mobile-nav-text').velocity('upAndInNav',{stagger:50, delay:100});
		} else {
			$('#mobile-nav .mobile-nav-text').velocity('byeByeNav',{stagger:50, backwards:true});
		}
	}
});

Template.header.onRendered(function(){
	scrollIntervalID = Meteor.setInterval(updatePage, 10);
});

var prevScrollPos = 0;

function updatePage(){
	var scrollPos = window.scrollY;
	if(scrollPos !== prevScrollPos){								//only go thru logic if the scroll pos is different
		var scrollDir = scrollPos > prevScrollPos ? 'DOWN' : 'UP';
		if(scrollPos > 300 && scrollDir === 'DOWN'){
			Session.set('isNavHidden',true);
		} else if (scrollDir === 'UP'){
			Session.set('isNavHidden',false);
		}
		prevScrollPos = scrollPos;
	}
}

$.Velocity.RegisterEffect('upAndInNav', {
    defaultDuration: 1200,
    calls: [ 
        [ { top: 0, opacity:1 }, 0.16]
    ]
});
$.Velocity.RegisterEffect('byeByeNav', {
    defaultDuration: 1200,
    calls: [ 
        [ {top:50, opacity:0}, 0.16]
    ]
});