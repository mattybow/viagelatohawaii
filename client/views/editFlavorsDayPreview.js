Template.editFlavorsDayPreview.helpers({
	getSelectedFlavors:function(){
		return Session.get('dayFlavors');
	},
	isDisabled:function(){
		var current = Session.get('dayFlavors');
		var original = Session.get('originalFlavors');
		return lodash.isEqual(current, original) ? 'disabled-button' : '';
	}
	/*,
	getSortableOptions:function(){
		return {
			handle:'.day-flavor',
			animation: 150,
			scroll: true, // or HTMLElement
		    scrollSensitivity: 30, // px, how near the mouse must be to an edge to start scrolling.
		    scrollSpeed: 10, // px
		    onDrop:function(ev){
		    	console.log('DROP',ev);
		    },
		    onMove:function(ev){
		    	console.log(ev);
		    },
		    onUpdate:function(ev){
		    	console.log('UPDATE',ev);
		    }
		}
	}*/
});

Template.editFlavorsDayPreview.events({
	'click .apply-changes':function(){
		var data = Session.get('dayFlavors');
		Meteor.call('updateFlavorsOfTheDay',{data:data},function(err,res){
			//console.log(err, res);
			if(!err){
				var newOrig = Session.get('dayFlavors');
				Session.set('originalFlavors',newOrig);
			}
		});
	}
})