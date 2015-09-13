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
          var images = data.images;
          var time = new Date().valueOf();
          var seasonal = data.seasonal ? true : false;
          var descript = data.description ? data.description : null;
          var newDoc = {
            flavorName:data.flavorName,
            description:descript,
            new:true,
            active:true,
            images:images,
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
    } else {
      return {errMsg:'you did not specify a flavor name'};
    }
  },

  saveFlavorChanges:function(data){
    this.unblock();
    if(data._id){
      try{
        var userData = Meteor.user();
        var doc;
        if(userData && userData.authorizations.indexOf('flavors') >= 0){
          var images = data.images;
          var time = new Date().valueOf();
          var seasonal = data.seasonal ? true : false;
          var descript = data.description ? data.description : null;
          var updateData = {
            flavorName:data.flavorName,
            description:descript,
            images:images,
            lastUpdated:time,
            seasonal:seasonal
          };
          doc = Flavors.update({_id:data._id}, {$set:updateData});
        }
        return doc;
      } catch (e){
        console.error(e);
        return false;
      }
    } else {
      return {errMsg:'save did not execute, not enough data'};
    }
  },

  deleteFlavor:function(id){
    this.unblock();
    if(id){
      var result = Flavors.remove({_id:id});
      return result;
    }
    return {errMsg:'you did not specify a flavor id'};
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
    var to = 'viagelatohawaii@gmail.com';
    check([fromAddress, text], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();
    var verifyCaptchaResponse = verifyCaptcha(this.connection.clientAddress, data.recaptchaResponse);
    //console.log(verifyCaptchaResponse);
    if(verifyCaptchaResponse.data.success === false){
      return {ok:false, err:'could not verify captcha response'};
    }
    var subjectLine = 'TESTING: '+ name + ' writes from via-dev.viagelatohawaii.com';
    var emailToVia = {
      to: to,
      from: fromAddress,
      subject: subjectLine,
      text: text
    };

    var confirmationSubjectLine = 'Thanks for contacting Via Gelato Hawaii'
    var confirmationText = '<div style="font-size:2em; font-weight:300;">Hi ' + name + ',</div><p>Thanks for contacting Via Gelato Hawaii.</p><p>If you made an inquiry, we will get back to you shortly.</p><br><br><br><hr><div class="footer" style="display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-flex-flow: row nowrap; -ms-flex-flow: row nowrap; flex-flow: row nowrap; -webkit-box-pack: start; -webkit-justify-content: flex-start; -ms-flex-pack: start; justify-content: flex-start; -webkit-box-align: center; -webkit-align-items: center; -ms-flex-align: center; align-items: center; width: 100%; "><img style="max-height:70px;" src="https://s3-us-west-2.amazonaws.com/viagelato/images/via-logo-sm.png" alt=""> <div class="via-info"><div>Via Gelato Hawaii</div><div>1142 12th Ave Honolulu, HI 96816</div><div>808-732-2800</div><div><a href="http://viagelatohawaii.com/">viagelatohawaii.com</a></div></div></div>';
    var confirmationEmail = {
      to: fromAddress,
      from: to,
      subject: confirmationSubjectLine,
      html: confirmationText
    };
    console.log('attempting to send email',emailToVia);
    Email.send(emailToVia);
    console.log('attempting to send email',confirmationEmail);
    Email.send(confirmationEmail);
    return {ok:true};
  }
});

function checkAuth(cred){
  var userData = Meteor.user();
  if(userData && userData.authorizations.indexOf(cred) >= 0){
    return true;
  }
  return false;
}

function verifyCaptcha(clientIP, response) {
  var captcha_data = {
      privatekey: process.env.RECAPTCHA_KEY,
      remoteip: clientIP,
      response: response
  };

  var serialized_captcha_data =
      'secret=' + captcha_data.privatekey +
      '&remoteip=' + captcha_data.remoteip +
      '&response=' + captcha_data.response;
      
  var captchaVerificationResult = null;

  try {
      captchaVerificationResult = HTTP.call("POST", "https://www.google.com/recaptcha/api/siteverify", {
          content: serialized_captcha_data.toString('utf8'),
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': serialized_captcha_data.length
          }
      });
  } catch (e) {
      console.log(e);
      return {
          'success': false,
          'error-codes': 'reCaptcha service not available'
      };
  }

  return captchaVerificationResult;
}