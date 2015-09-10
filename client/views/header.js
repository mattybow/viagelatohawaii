Template.header.helpers({
	menuOpen:function(){
		return Session.get('isMenuOpen') ? 'opened' : 'closed';
	},
	navHidden:function(){
		return Session.get('isNavHidden') ? 'minimized' : '';
	}
});

Template.header.events({
	'click .burger-touch-area, click .mobile-nav-text':function(){
		var state = !Session.get('isMenuOpen');
		Session.set('isMenuOpen',state);
		
		if(state){
			$('#mobile-nav .mobile-nav-text').velocity('upAndInNav',{stagger:50, delay:100});
		} else {
			$('#mobile-nav .mobile-nav-text').velocity('byeByeNav',{stagger:50, backwards:true});
		}
	},
	'click .desktop-nav-link':function(){
		Session.set('isNavHidden',true);
	},
	'touchmove .mobile-nav-contents>ul':function(e){
		e.stopPropagation();
	}
});

Template.header.onCreated(function(){
	Session.setDefault('isMenuOpen',false);
	this.autorun(function(){
		var isMenuOpen = Session.get('isMenuOpen');
		if(isMenuOpen){
			$('body').addClass('modal-open').on('touchmove',bodyNoScroll);
		} else {
			$('body').removeClass('modal-open').off('touchmove',bodyNoScroll);
		}
	})
});

function bodyNoScroll(e){
	e.preventDefault();
}

Template.header.onRendered(function(){
	scrollIntervalID = Meteor.setInterval(updatePage, 1000/60);
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
		updateLocation(scrollDir);
	}
}

function updateLocation(dir){
	var sections = ['#flavorsDay','#story','#location','#hours','#contact','#press'];
	var bodyTop = document.body.scrollTop;
	//var winHeight = window.innerHeight;
	var hash = _.find(sections.reverse(),function(selector){
			return $(selector).offset().top < bodyTop ;
		}) || "/";
	if(hash !== (window.location.hash || '/')){
		if (history && history.replaceState) {
			history.replaceState({}, "", hash);
		}
	}
}

$.Velocity.RegisterEffect('upAndInNav', {
    defaultDuration: 1200,
    calls: [ 
        [ { translateY: 0, opacity:1 }, 0.16]
    ]
});
$.Velocity.RegisterEffect('byeByeNav', {
    defaultDuration: 1200,
    calls: [ 
        [ {translateY:50, opacity:0}, 0.16]
    ]
});