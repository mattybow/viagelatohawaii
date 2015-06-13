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
  }
});