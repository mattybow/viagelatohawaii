Router.configure({
  notFoundTemplate: 'notFound'
});
Router.route('/',function(){
	this.render('Via');
},{name:'home'});
Router.route('/edit',function(){
	this.render('editDash');
});
Router.route('/edit/:tab',function(){
	var tab = this.params.tab;
	this.render('editDash',{data:{tab:tab}});
});
Router.route('test',function(){
	this.render('test');
});
if(Meteor.isClient){
	Router._scrollToHash = function(hash) {
	  var section = $(hash);
	  if (section.length) {
	    var sectionTop = section.offset().top;
	    $("html, body").animate({
	      scrollTop: sectionTop
	    }, "slow");
	  }
	};
}