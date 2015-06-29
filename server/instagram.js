Meteor.methods({
  checkInstagram: function () {
    this.unblock();
    try {
      var url = "https://api.instagram.com/v1/users/20072241/media/recent/?access_token=20072241.912429c.a8acdc2815e2429a80b8d5addae810b1"
      var result = HTTP.get(url);
      return result;
    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      return false;
    }
  },
  updateFlavorsOfTheDay:function(data){
    console.log(data);
    try {
      var userData = Meteor.user();
      var docs;
      if(userData && userData.authorizations.indexOf('flavors') >= 0){
        console.log('ok');
        Flavors.update({},{$set:{day:false}},{multi:true});
        docs = Flavors.update({_id:{$in:data.data}},
                              {$set:{day:true}},
                              {multi:true});
      }
      return docs;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
});