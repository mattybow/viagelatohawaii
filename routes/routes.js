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
		var hash = window.location.hash;
		Meteor.setTimeout(function(){
			viaScrollTo(hash);
		});
		this.next();
	},
	onAfterAction: function(){
		setAdminTitle('Via Gelato Hawaii')
	},
	action:function(){
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

Router.route('/test',function(){
	this.render('test');
});

if(Meteor.isClient){
	Router._scrollToHash = viaScrollTo;
}
function setAdminTitle(title){
	document.title = title;
}
function viaScrollTo(hash) {
  var section = $(hash);
  if (section.length) {
    var sectionTop = section.offset().top + 5;
    $("html, body").animate({
      scrollTop: sectionTop
    }, 350,function(){
    	Meteor.setTimeout(function(){
    		Session.set('isNavHidden',true);
    	},10);
    });
  }
};
