var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//plugin za lakse upravljanje userima
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username: String,
    password: String,
    OauthId: String,
    OauthToken: String,
    firstname: {
      type: String,
        default: ''
    },
    lastname: {
      type: String,
        default: ''
    },
    admin:   {
        type: Boolean,
        default: false
    }
});

//metoda vraca ime + prezime 
User.methods.getName = function() {
    return (this.firstname + ' ' + this.lastname);
};


User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
