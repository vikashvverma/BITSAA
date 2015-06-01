var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports.mongoose = mongoose;
module.exports.Schema = Schema;


// mongoose.connect('mongodb://localhost/etest');

var db = function() {
  this.ip_addr = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
  this.port = process.env.OPENSHIFT_NODEJS_PORT || '8080';
  //this.address="@ds043329.mongolab.com:43329/bitsaablr";
  this.address = "@process.env.OPENSHIFT_MONGODB_DB_HOST:process.env.OPENSHIFT_MONGODB_DB_PORT/etest"
};

db.prototype = {
  connect: function() {
    //var url="mongodb://"+this.username+":"+this.password+this.address;
    // default to a 'localhost' configuration:
    var connection_string = '127.0.0.1:27017/etest';
    // if OPENSHIFT env variables are present, use the available connection info:
    if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD ) {
      connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;

    }else{
         //connection_string="admin:sBpy8GH5P4ly@"+connection_string;
    }
    //mongoose.connect('mongodb://localhost:27017/etest');
    mongoose.connect("mongodb://"+connection_string);
  },
  disconnect: function() {
    mongoose.disconnect();
  }
};

new db().connect();
