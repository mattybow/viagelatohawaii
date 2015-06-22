Router.configure({
  notFoundTemplate: 'notFound'
});
Router.route('/',function(){
	this.render('Via');
});
Router.route('/edit',function(){
	this.render('editDash');
});
Router.route('/edit/:tab',function(){
	var tab = this.params.tab;
	this.render('editDash',{data:{tab:tab}});
});
