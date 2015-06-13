defaultFlavorData={};
var flavorStr = 'black sesame,butter pecan,peanut butter,fierce chocolate,cotton candy,green tea,guava,lilikoi,pb and j,ube sweet potato,strawberries and cream,fluorescent frosting,salted caramel coffee crumble,snickerdoodle,strawberry lemonade,fudge swirl,milk tea';
var flavors = flavorStr.split(',');
_.each(flavors,function(flavor){
	var dateVal = new Date().valueOf();
	defaultFlavorData[flavor]={
		flavorName:flavor,
		new:true,
		active:true,
		imgPath:'/images/'+flavor+'.png',
		lastUpdated:dateVal,
		created:dateVal
	}
});