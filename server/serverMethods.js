Meteor.methods({
  checkInstagram: function () {
    this.unblock();
    try {
      var url = process.env.INSTAGRAM_KEY;
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
  },
  createNewPress:function(data){
    this.unblock();
    try{
      var docId;
      if(checkAuth('press')){
        var time = new Date().valueOf();
        var newDoc = lodash.assign(data,{
          lastUpdated:time,
          created:time,
          assetType:'pressMedia',
          assetAlias: 'Press Media'
        });

        docId = SiteMedia.insert(newDoc);
      } else {
        console.log('NOT AUTHORIZED');
      }
      return docId;
    } catch (e){
      console.error(e);
      return false;
    }
  },
  sendEmail: function (data) {
    var fromAddress = data.address;
    var name = data.name;
    var text = data.text;
    var to = 'mattybow@gmail.com';
    check([fromAddress, text], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();
    var subjectLine = name + ' writes from viagelatohawaii.com';
    var email = {
      to: to,
      from: fromAddress,
      subject: subjectLine,
      text: text
    };
    console.log('attempting to send email',email);
    Email.send(email);
  }
});

function checkAuth(cred){
  var userData = Meteor.user();
  if(userData && userData.authorizations.indexOf(cred) >= 0){
    return true;
  }
  return false;
}