var bcrypt=require('bcrypt-nodejs');
var util={};
util.generateUUID=function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    uuid = 'a' + uuid.replace(/-/g, "");
    return uuid;
};

util.hashPassword=function(password){
  bcrypt.hash(password,null,null,function(err,hash){
    return hash;
  })
};

util.secret="bitsaablrchapter";

module.exports=util;
