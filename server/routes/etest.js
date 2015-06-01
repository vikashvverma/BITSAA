var User = require('./../models/user');
var multer = require('multer');
var emailTemplates = require('email-templates');
var path = require('path');
var templateDir = path.resolve(__dirname, '..', 'templates/');
var util = require('./../models/util');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var debug = require('debug');
var Password = require('./../models/password');

var etest = function(exp) {
  this.app = exp;

  this.app.get('/test',function(req,res){
      setTimeout(function(){
          res.end('Hello, Vikash!');
      },500000);

  });
  this.app.post('/sendResetLink', function(req, res) {
    var model = req.body;
    console.log(model);
    if (!model.primaryEmail) {
      res.status(403).send({
        status: false,
        info: 'Primary Email address is necessary!'
      });
    } else {
        var user=new User();
        user.getUser(model,function(err,instance){
            if(err){
                return res.status(500).send({status:false,info:'Some error occured, please try again later!'});
            }else{
                if(!instance){
                    return res.status(500).send({status:false,info:'Email Id does not exist!'});
                }else{
                    var password = new Password();
                    console.log(password.activate);
                    console.log(model);
                    model['uuid'] = util.generateUUID();
                    password.activate(model, function(err, instance) {
                      if (err) {
                        res.satatus(500).send({
                          status: false,
                          info: 'We are facing some issues, please try again later!'
                        });
                      } else {
                        setTimeout(function() {
                          instance.active = false;
                          instance.save();
                        }, 3600000);
                        emailTemplates(templateDir, function(err, template) {
                          if (err) {
                            console.log(err);
                            res.status(500).send({
                              status: false,
                              info:"Unable to send password reset link, please try again later!"
                            });
                          } else {
                            var nodemailer = require('nodemailer');
                            //var transporter = nodemailer.createTransport();
                            var transporter = nodemailer.createTransport({
                              service: 'SendGrid',
                              auth: {
                                user: 'vikashverma',
                                pass: 'vikash@123'
                              }
                            });
                            // Send a single email
                            template('reset-email', {
                              token: instance.uuid,
                              primaryEmail:instance.primaryEmail
                            }, function(err, html, text) {
                              if (err) {
                                console.log(err);
                              } else {
                                transporter.sendMail({
                                  from: 'BITSAA Bangalore Chapter <no-reply@bitsindri.in>',
                                  to: instance.primaryEmail,
                                  subject: 'Reset Password!',
                                  html: html,
                                  // generateTextFromHTML: true,
                                  text: text
                                }, function(err, responseStatus) {
                                  if (err) {
                                    console.log(err);
                                    res.status(500).send({
                                      status: false,
                                      info: "Unable to send reset link, please try again later!"
                                    });
                                  } else {
                                    console.log("success!");
                                    res.status(200).send({
                                      status: true,
                                      info: 'Check your email for password reset link!'
                                    });
                                  }
                                });
                              }
                            });
                          }
                        })
                      }
                    });
                }
            }
        });


    }
  });

  this.app.post('/resetPassword', function(req, res) {
    var model = req.body;
    if (!Object.keys(model).length || !(model.hasOwnProperty('token') || model.hasOwnProperty('password'))) {
      return res.status(400).send({
        status: false,
        info: 'insufficient information!'
      });
    } else {
        var password=new Password();
        password.exists({uuid:model.token},function(err,passwordInstance){
            if(err){
                res.status(500).send({status:false,info:"Some error occured, please try again later!"});
            }else{
                if(passwordInstance.active){
                    var user=new User();
                    user.getUser({primaryEmail:passwordInstance.primaryEmail},function(err,instance){
                        if(err){
                            return res.status(500).send({status:false,info:"Some error occured, please try again later!"});
                        }else{
                            console.log(instance.password);
                            instance.password=model.password;
                            console.log(instance.password);
                            instance.save(function(err,instance){
                                if(err){
                                    return res.status(500).send({status:false,info:"Unable to reset password, please try again later!"});
                                }else{
                                    passwordInstance.active=false;
                                    passwordInstance.save();
                                    return res.status(200).send({status:true,info:"Password changes successfully, You can login now with new password!"});
                                }
                            });
                        }
                    });
                }else{
                    res.status(403).send({status:false,info:'The link has expired!'})
                }
            }
        });
    }
  });
  this.app.post('/login', function(req, res) {
    var model = req.body;
    console.log(model);
    if (!Object.keys(model).length || !(model.hasOwnProperty('username') || model.hasOwnProperty('primaryEmail')) || !model.hasOwnProperty('password')) {
      res.status(400).send({
        status: false,
        info: 'Username/email and password required!'
      });
      return;
    } else {
      var obj = {};
      if (!!model.username) {
        obj.username = model.username;
      } else {
        obj.primaryEmail = model.primaryEmail;
      }
      var user = new User();
      user.login(obj, function(err, instance) {
        if (err || !instance) {
          res.status(500).send({
            status: false,
            info: 'User not found!'
          });
        } else {
          if (!instance.active) {
            res.status(403).send({
              status: false,
              info: 'Account Inactive!'
            });
          } else if (instance.comparePassword(model.password)) {
            var token = jwt.sign({
              name: instance.first_name,
              username: instance.username,

            }, util.secret, {
              expiresInMinutes: 1440
            });
            // req.session.user = {};
            // req.session.user.username = instance.username;
            var data = JSON.parse(JSON.stringify(instance));
            delete data['password'];
            delete data['_id'];
            delete data['__v'];
            delete data['activationCode'];
            data.token = token;
            data.status = true;
            res.status(200).send(data);
          } else {
            res.status(500).send({
              status: false,
              info: 'Invalid Password!'
            })
          }

        }
      });
    }
  });

  this.app.use(function(req, res, next) {
    var handler = multer({
      dest: './public/images/avatar/',
      rename: function(fieldname, filename, req, res, next) {
        var newName = Date.now();
        req.avatarName = newName + JSON.parse(req.body.user).username;
        return JSON.parse(req.body.user).username;//req.avatarName;
      },
      onParseEnd: function(req, next) {
        console.log('Done parsing!');
    //     var fs = require('fs');
    //     var imagemin = require('image-min');
    //     var path = require('path');
    //     var src = fs.createReadStream(this.dest+req.avatarName+"."+JSON.parse(req.body.user).avatar_url.split('.').reverse()[0]);
    //     console.log(src.path);
    //     var ext = path.extname(src.path);
    //     src
    // .pipe(imagemin({ ext: ext }))
    // .pipe(fs.createWriteStream(this.dest+JSON.parse(req.body.user).username+ext));
    // fs.unlink(src.path);
        next();
      },
      onError: function(req, next) {
        if (e) {
          console.log(e.stack);
        }
        next();
      }
    });
    handler(req, res, next);
  });

  this.app.post('/addUser', function(req, res) {
    //`console.log(req.query.user);
    //`` console.log(req.body.user);
    console.log('Add user!');
    var model = JSON.parse(req.body.user);
    if (Object.keys(model).length < 17) {
      res.status(500).end({
        success: false,
        message: 'Invalid Data'
      });
      return;
    }
    model['active'] = false;
    model['activationCode'] = util.generateUUID();
    var user = new User();
    user.addUser(model, function(err, instance) {
      if (err) {
        fs.unlink(__dirname + "/../../public/images/avatar/" + req.avatarName, function(err) {
          res.status(500).send({
            status: false
          });
        });
      } else {
        fs.rename(__dirname + "/../../public/images/avatar/" + req.avatarName, __dirname + "/../../public/images/avatar/" + instance.avatar_url, function(err) {

        });
        emailTemplates(templateDir, function(err, template) {
            if (err) {
              console.log(err);
              res.status(200).send({
                status: false
              });
            } else {
              var nodemailer = require('nodemailer');
              //var transporter = nodemailer.createTransport();
              var transporter = nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                  user: 'vikashverma',
                  pass: 'vikash@123'
                }
              });
              // Send a single email
              template('verification-email', {
                token: instance.activationCode
              }, function(err, html, text) {
                if (err) {
                  console.log(err);
                } else {
                  transporter.sendMail({
                    from: 'BITSAA Bangalore Chapter <no-reply@bitsindri.in>',
                    to: instance.primaryEmail,
                    subject: 'Confirm Your Account!',
                    html: html,
                    // generateTextFromHTML: true,
                    text: text
                  }, function(err, responseStatus) {
                    if (err) {
                      console.log(err);
                      res.status(200).send({
                        status: false
                      });
                    } else {
                      console.log(responseStatus.message + "success!");
                      res.status(200).send({
                        status: true
                      });
                    }
                  });
                }
              });
            }
          })
          // console.log(instance);

        // transporter.sendMail({
        //   from: 'vikash@programminggeek.in',
        //   to: instance.primaryEmail,
        //   subject: 'BITSAA Bangalore Chapter : Confirm Your Account!',
        //   text: 'hello world!'
        // });

      }
    });
  });
  this.app.post('/user/activateAccount/:token', function(req, res) {
    var user = new User();
    console.log(req.params.token + "\t" + req.body.token + "\t" + req.query.token);
    var token = req.params.token || req.body.token || req.query.token;
    console.log(token + "\taaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    user.activateUser({
      activationCode: token
    }, function(err, instance) {
      if (err || !instance) {
        res.status(500).send({
          status: false,
          info: "Activation Failed!"
        });
      } else {
        //req.session.user = {};
        //req.session.user.username = instance.username;
        debug(instance);
        var data = JSON.parse(JSON.stringify(instance));
        delete data['password'];
        delete data['_id'];
        delete data['__v'];
        delete data['activationCode'];
        res.status(200).send({
          status: true,
          info: 'Account activated!'
        });
      }
    });
  });

  this.app.get('/checkUser', function(req, res) {

    var model = req.query;
    if (!Object.keys(model).length) {
      res.status(400).send('error');
      return;
    }
    console.log(model);
    var user = new User();
    user.getUser(model, function(err, instance) {
      if (err) {
        res.status(500).send(err);
      } else {
        if (instance && instance.username) {
          res.status(200).send({
            exists: true
          });
        } else {
          res.status(200).send({
            exists: false
          });
        }
      }
    });
  });

  this.app.post('/logout', function(req, res) {
    req.session.destroy(function(err) {
      if (err) {
        res.send(400).send("Bad Request!");
      } else {
        try {
          res.status(200).send({
            username: null
          });
        } catch (msg) {
          console.log(msg);
        }
      }
    });
  });

  this.app.use(function(req, res, next) {
    var token = req.body.token || req.params.token || req.query.token || req.headers['x-access-token'];
    console.log("Token :" + token);

    if (token) {
      jwt.verify(token, util.secret, function(err, decoded) {

        if (err) return res.status(403).send({
          status: false,
          info: 'Failed to authenticate!'
        });
        req.decoded = decoded;
        next();
      });
    } else {
       if(req.method=='GET'){
         //res.sendFile(__dirname+"/../../public/index.html");
         //res.redirect('/');
         req.url="/";
         next();
       }else{
         res.status(403).send({
          status: false,
          info: 'Session expired, login again!'
        });
       }
    }
  });
  this.app.post('/getLoggedInUser', function(req, res) {

    var username = req.body.username || req.params.username;
    debug(req.body.username + "\t" + req.params.username + "\t" + req.query.username);
    if (!username) {
      res.status(403).send({
        status: false,
        info: 'Username Required!'
      });
    } else {
      var user = new User();
      user.getUser({
        username: username
      }, function(err, instance) {
        if (err) {
          res.status(500).send({
            status: false,
            info: 'User not found!'
          });
        } else {
          var data = JSON.parse(JSON.stringify(instance));
          try{
            delete data['password'];
            delete data['_id'];
            delete data['__v'];
            delete data['activationCode'];
            data.token = req.body.token || req.params.token || req.query.token || req.headers['x-access-token'];
          res.status(200).send(data);
          }catch(msg){
            console.log(msg);
            return res.status(500).send({status:false,info:'Unable to process your request, please try again later!'});
          }

        }
      });
      //res.status(200).send({username:req.session.user.username});
    }
  });

  this.app.post('/user/update', function(req, res) {
    var model = req.body;
    if (!model.username || !model.token) {
      return res.status(403).send({
        status: false,
        info: "Insufficient Data!"
      });
    }
    var user = new User();

    user.updateUserInfo(model.username, model, function(err, instance) {
      if (err) {
        res.status(500).send({
          status: false,
          info: "Some Error occured, try again later!"
        });
      } else {
        var data = JSON.parse(JSON.stringify(instance));
        console.log(instance);
          try{
            delete data['password'];
            delete data['_id'];
            delete data['__v'];
            delete data['activationCode'];
            data.status=true;
            data.info="Your changes have been saved!";
            data.token = req.body.token || req.params.token || req.query.token || req.headers['x-access-token'];
          res.status(200).send(data);
          }catch(msg){
            console.log(msg);
            return res.status(500).send({status:false,info:'Unable to process your request, please try again later!'});
          }
//        res.status(200).send({
//          status: true,
//          info: "Your changes have been saved!"
//        });
      }
    });
  });
  this.app.post('/user/updatePassword', function(req, res) {
    var model = req.body;
    if (!model.username || !model.password || !model.new_password) {
      return res.status(403).send({
        status: false,
        info: "Insufficient Data!"
      });
    }
    var user = new User();

    user.getUser({
      username: model.username
    }, function(err, instance) {
      if (err) {
        res.status(500).send({
          status: false,
          info: "Some Error occured, try again later!"
        });
      } else {
        if (!instance.active) {
          res.status(403).send({
            status: false,
            info: 'Account Inactive!'
          });
        } else if (instance.comparePassword(model.password)) {
          //instance.password=util.hashPassword(model.new_password);
          instance.password = model.new_password;
          instance.save(function(err, instance) {
            if (err) {
              res.status(500).send({
                status: false,
                info: 'Unable to update password, try again later!'
              });
            } else {
              res.status(200).send({
                status: true,
                info: 'Password updated successfully!'
              });
            }
          })

        } else {
          res.status(500).send({
            status: false,
            info: 'Invalid Current Password!'
          })
        }
      }
    });
  });
  this.app.post('/user/updateUsernameOrPrimaryEmail', function(req, res) {
    //console.log(req.body);
    var model = req.body;
    var key = model.key;
    if (!model[key] || !(key == 'username' || key == 'primaryEmail') || !model['new_' + key]) {
      return res.status(403).send({
        status: false,
        info: "Insufficient Data!"
      });
    }
    //console.log(key + "\t" + model[key]);
    var obj = {};
    obj[key] = model[key];
    var user = new User();

    user.getUser(obj, function(err, instance) {
      if (err || !instance) {
        res.status(500).send({
          status: false,
          info: "Some Error occured, try again later!"
        });
      } else {
        if (!instance.active) {
          res.status(403).send({
            status: false,
            info: 'Account Inactive!'
          });
        } else {
          //instance.password=util.hashPassword(model.new_password);
          console.log(instance);
          instance[key+""] = model['new_' + key];
          console.log(instance);
          instance.save(function(err, instance) {
            if (err) {
              console.log(err);
              res.status(500).send({
                status: false,
                info: 'Unable to update ' + key + ', try again later!'
              });
            } else {
              res.status(200).send({
                status: true,
                info: key + ' updated successfully!'
              });
            }
          })

        }
      }
    });
  });

  this.app.post('/user',function(req,res){
    var model=req.body;
    if(!model.username){
      return res.status(400).send({status:false,info:'Insufficient Data!'})
    }

    var user=new User();
    user.getUser({username:model.username},function(err,instance){
      if(err){
        return res.status(500).send({status:false,info:"No user found, try with different inputs!"});
      }else{
        if(!instance){
          return res.status('400').send({status:false,info:"No User found!"});
        }
        var data = JSON.parse(JSON.stringify(instance));
        delete data['password'];
        delete data['_id'];
        delete data['__v'];
        delete data['activationCode'];
        return res.status(200).send(data);
      }
    });

  });
  this.app.post('/users',function(req,res){
    var obj=req.body;
    var model=[];
    if(!!obj.name){
      model.push({first_name:new RegExp(obj.name, "i")});
      model.push({last_name:new RegExp(obj.name, "i")});
    }
    if(!!obj.branch){
      model.push({branch:obj.branch});
    }
    if(!!obj.any){
      model.push({first_name:new RegExp(obj.any, "i")});
      model.push({last_name:new RegExp(obj.any, "i")});
      model.push({branch:new RegExp(obj.any, "i")});
      model.push({city:new RegExp(obj.any, "i")});
      model.push({country:new RegExp(obj.any, "i")});
      model.push({primaryEmail:new RegExp(obj.any, "i")});
      model.push({entryYear:new RegExp(obj.any, "i")});
      model.push({passingYear:new RegExp(obj.any, "i")});
      model.push({mobiles:new RegExp(obj.any, "i")});
      model.push({designation:new RegExp(obj.any, "i")});
      model.push({company:new RegExp(obj.any, "i")});
    }
    if(!model.length){
      model.push({first_name:new RegExp("")});
    }
    var user=new User();
    user.getUsers(model,obj.skip,function(err,instance){
      if(err){
        return res.status(500).send({status:false,info:"No user found, try with different inputs!"});
      }else{
        return res.status(200).send(instance);
      }
    });


  });

  this.app.post('/statistics',function(req,res){
    var user=new User();
        user.getStatistics(function(err,arr){
          if(err){
            return res.status(500).send({status:false,info:"Data not available currently!"});
          }else{
            var obj={};
            for(var i=arr.length;i--;){
              if(obj.hasOwnProperty(arr[i].branch)){
                obj[arr[i].branch]+=1;
              }else{
                obj[arr[i].branch]=1;
              }
            }
            return res.status(200).send(obj);
          }
        })
  });
  this.app.post('/updateStatus', function(req, res) {
    var model=req.body;
    if(!model.username){
      return res.status(401).send({status:false,info:"User not available!"});
    }
    var user=new User();
    user.getUser({username:model.username},function(err,instance){
      if(err){
        return res.status(500).send({status:false,info:"User not found!"});
      }else{
        if(!instance){
          return res.status('400').send({status:false,info:"No User found!"});
        }
        console.log(instance);
        instance['status'].push({status:model.status});
        console.log(instance);
        instance.save(function(err,instance){
          if(err){
            console.log(err);
            return res.status(500).send({status:false,info:"Unable to update!"});
          }
          return res.status(200).send({status:true,info:"Status successfully updated!"});
        })

      }
    });

  });

  this.app.post('/updateAptitude', function() {

  });

  this.app.post('/getAptitudeQuestions', function(req, res) {

  });

  this.app.post('/getVerbalQuestions', function(req, res) {

  });

};

module.exports = etest;
