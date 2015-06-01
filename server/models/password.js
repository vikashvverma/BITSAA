var db=require('./../libs/db');
var passwordSchema=new db.Schema({
    uuid:{type:String,unique:true},
    primaryEmail:{type:String},
    date:{type:Date,default:Date.now},
    active:{type:Boolean,default:true}
});

var password=db.mongoose.model('resetpassword',passwordSchema);
var Password=function(){

};

Password.prototype={
    activate:function(obj,callback){
        console.log(obj);
        var instance=new password(obj);
        instance.save(function(err,instance){
            if(err){
                callback(err);
            }else{
                callback(null,instance);
            }
        });
    },
    deactivate:function(obj,callback){
        password.findOne(obj,function(err,instance){
            if(err){
                callback(err);
            }else{
                instance.active=false;
                instance.save(function(err,instance){
                    if(err){
                        callback(err);
                    }else{
                        callback(null,instance);
                    }
                });
            }
        });
    },
    exists:function(obj,callback){
        password.findOne(obj,function(err,instance){
            if(err){
                callback(err);
            }else{
                callback(null,instance);
            }
        });
    }

};

module.exports=Password;
