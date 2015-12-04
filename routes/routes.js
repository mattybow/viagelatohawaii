var LEGACY_ROUTES = {
  flavors:'flavorsDay',
  about:'story',
  contact: 'contact',
  locations: 'location',
  press:'press'
}

var newHash;
var scrollPending = false;

Router.configure({
  notFoundTemplate: 'notFound'
});
Router.route('/',{
	name:'home',
	fastRender:true,
	waitOn: function(){
		return [Meteor.subscribe('flavorsOfTheDay'),
				Meteor.subscribe('slideshowMedia'),
				Meteor.subscribe('allHours')
		];
	},
	onRun:function(){						//on initial load, will scrollTo hash
    if(getUrlFragment()){
      scrollPending = true;
    }
		this.next();
	},
	onAfterAction: function(){
		setAdminTitle('Via Gelato Hawaii');
    console.log('after action');
    var hash = getUrlFragment();
    if(scrollPending){
      Meteor.setTimeout(function(){
        viaScrollTo(hash);
      });
    }
	},
	action:function(){
    console.log('run VIA route');
		this.render('Via');
	}
});

Router.route('/edit',{
	onAfterAction: function(){
		setAdminTitle('Via Admin')
	},
	action:function(){
		this.render('editDash');
	}
});
Router.route('/edit/:tab',{
	onAfterAction: function(){
		setAdminTitle('Via Admin')
	},
	action:function(){
		var tab = this.params.tab;
		this.render('editDash',{data:{tab:tab}});
	}
});

Router.route('/:legacyRoute',{
	action:function(){
    console.log('detect legacy route');
    var htmlRoute = this.params.legacyRoute;
    var htmlRegex = /\.html/;
    if(htmlRoute.match(htmlRegex)){
      var route = htmlRoute.replace(htmlRegex,'');
      if (route in LEGACY_ROUTES){
        newHash = '#' + LEGACY_ROUTES[route];
        this.redirect('/'+ newHash);
      }
    }
    this.render('notFound');
	}
});

Router.route('/test',function(){
	this.render('test');
});

if(Meteor.isClient){
	Router._scrollToHash = viaScrollTo;
}
function setAdminTitle(title){
	document.title = title;
}

function getUrlFragment(){
  return 	window.location.hash || newHash;
}

function viaScrollTo(hash) {
  var section = $(hash);
  console.log(hash, section.length, document.getElementById('flavorsDay'));
  if (section.length) {
    var sectionTop = section.offset().top + 5;
    scrollPending = false;
    console.log(sectionTop);
    $("html, body").animate({
      scrollTop: sectionTop
    }, 350,function(){
    	Meteor.setTimeout(function(){
    		Session.set('isNavHidden',true);
    	},10);
    });
  }
};
