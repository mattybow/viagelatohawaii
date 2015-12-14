Template.giftCards.helpers({
  getImgUrl:function(){
    var url = "https://s3-us-west-2.amazonaws.com/viagelato/images/via_gift_cards_v2";
    var ext = '.jpg';
    var resolution = '';
    if(Meteor.isClient){
  		var mediaWidth = window.innerWidth;
  		if(mediaWidth <= MEDIA_BREAK_POINTS.mobile){
  			resolution = "-mobile";
        if(window.devicePixelRatio === 2){
          resolution += "-retina";
        }
  		}
  	}
    return url + resolution + ext;
  }
})
