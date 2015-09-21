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
	}
});

Template.header.onCreated(function(){
	Session.setDefault('isMenuOpen',false);
	this.autorun(function(){
		var isMenuOpen = Session.get('isMenuOpen');
		if(isMenuOpen){
			$('body').addClass('modal-open');
		} else {
			$('body').removeClass('modal-open');
		}
	})
});

function bodyNoScroll(e){
	//e.stopPropagation();
	e.preventDefault();
}

Template.header.onRendered(function(){
	scrollIntervalID = Meteor.setInterval(updatePage, 1000/60);
});

var prevScrollPos = 0;
Session.setDefault('drawLocation',false);

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
			var locationDrawn = Tracker.nonreactive(function(){
				return Session.get('drawLocation');
			});
			if((hash === '#story' || hash === '#location') && !locationDrawn){
				Session.set('drawLocation',true);
			}
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