var db=require('./../libs/db');
var bcrypt=require('bcrypt-nodejs');
var status=new db.Schema({
    status:{type:String},
    date:{type:Date,default:Date.now}
});
var message=new db.Schema({
  message:{type:String},
  to:{type:String}
});
var UserSchema=new db.Schema({
  id:{type:Number,default:0},
  username:{type:String,unique:true},
  password:{type:String},
  primaryEmail:{type:String,unique:true},
  first_name:{type:String},
  last_name:{type:String},
  dob:{type:Date},
  mobiles:{type:String},
  gender:{type:String},
  address:{type:String},
  city:{type:String},
  country:{type:String},
  branch:{type:String},
  entryYear:{type:String},
  passingYear:{type:String},
  designation:{type:String},
  emails:{type:String},
  company:{type:String},
  facebook_id:{type:String},
  google_plus_id:{type:String},
  linkedin_id:{type:String},
  status:[status],
  message:[message],
  avatar_url:{type:String},
  active:{type:Boolean},
  activationCode:{type:String,select:false},
  created_at:{type:Date,default:Date.now}

});

var CounterSchema = new db.Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});
var counter = db.mongoose.model('counter', CounterSchema);

UserSchema.pre('save',function(next){
    console.log("Encrypting password!");
  var user=this;

  counter.findByIdAndUpdate({_id:'vikash'}, {$inc: { seq: 1} }, function(error, counter)   {
        if(error)
            return next(error);
            console.log(counter);
        user.id = counter.seq;
        if(!user.isModified('password')) return next();
        bcrypt.hash(user.password,null,null,function(err,hash){
          if(err) return next(err);
          user.password=hash;
          next();
      });
    });
});

UserSchema.methods.comparePassword=function(password){
  var user=this;
  return bcrypt.compareSync(password,user.password);
};
var user=db.mongoose.model("user",UserSchema);

var User=function(){
};

User.prototype={
  login:function(model,callback){
    user.findOne(model,function(err,instance){
      if(err){
        callback(err);
      }else{
        callback(null,instance);
      }
    });
  },
  addUser:function(model,callback){
    var instance = new user(model);
    instance.save(function(err,instance){
      if(err){
        console.log(err);
        callback(err);
      }else{
        console.log(instance);
        callback(null,instance);
      }
    });
  },
  getUser:function(model,callback){
    user.findOne(model,function(err,instance){
      if(err){
        callback(err);
      }else{
        callback(null,instance);
        //console.log(instance);
      }
    });
  },
  activateUser:function(model,callback){
    user.findOne(model,function(err,instance){
      if(err || !instance){
        console.log(instance+"aaa");
        console.log(err+"bbb");
        callback(err);
      }else{
        instance.active=true;
        //instance.activationCode=null;
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
  updateUserInfo:function(username,info,callback){
    user.findOneAndUpdate({username:username},info,{new:true},function(err,instance){
      if(err){
        callback(err);
      }else{
        callback(null,instance);
      }
    });
  },
  getUsers:function(model,skip,callback){
    console.log(model);
    user.find({$or:model},'first_name last_name entryYear designation company branch city country username avatar_url created_at id')
        .sort({id:1})
        .skip(skip)
        .limit(5)
        //.select("first_name last_name designation company city country")
        .exec(callback);

  },
  getStatistics:function(callback){
    user.find({},'branch')
        .sort({branch:1})
        .exec(callback);
  },
  updateStatus:function(){

  },
  updateAptitudeTest:function(){

  }
};

module.exports=User;
