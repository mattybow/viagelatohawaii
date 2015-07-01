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
    this.unblock();
    try {
      var userData = Meteor.user();
      var docs;
      if(userData && userData.authorizations.indexOf('flavors') >= 0){
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
  },
  createNewFlavor:function(data){
    this.unblock();
    if(data.flavorName){
      try{
        var userData = Meteor.user();
        var doc;
        if(userData && userData.authorizations.indexOf('flavors') >= 0){
          var imgPath = data.imgPath ? data.imgPath : null;
          var time = new Date().valueOf();
          var seasonal = data.seasonal ? true : false;
          var descript = data.description ? data.description : null;
          var newDoc = {
            flavorName:data.flavorName,
            description:descript,
            new:true,
            active:true,
            imgPath:imgPath,
            lastUpdated:time,
            created:time,
            day:false,
            seasonal:seasonal
          };
          doc = Flavors.insert(newDoc);
        }
        return doc;
      } catch (e){
        console.error(e);
        return false;
      }
    }
  }
});