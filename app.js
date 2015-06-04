//Setup App
var express=require('express');
var etest=require('./server/routes/etest');
var serveStatic=require('serve-static');
var cookieParser=require('cookie-parser');
var bodyParser=require('body-parser');
var session=require('express-session');
var morgan = require('morgan');
var imp=require('./import');

//imp.import();

var app=function(){
  self=this;

  self.setupVariables=function(){
    self.ipaddress=process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
    self.port=process.env.OPENSHIFT_NODEJS_PORT || '3000';
  };

  self.initailizeServer=function(){
    self.app=express();
    self.app.use(express.static(__dirname+"/public"));
    self.app.use(cookieParser());
    self.app.use(bodyParser.urlencoded({extended:true}));
    self.app.use(bodyParser.json());
    self.app.use(session({secret:"http://www.programminggeek.in/",resave:true,saveUninitialized:true}))
    self.app.use(morgan('dev'));
    new etest(self.app);
    self.app.get('*',function(req,res){
      console.log(req.url);
      res.sendFile(__dirname+"/public/index.html");
    });
  };

  self.initialize=function(){
    self.setupVariables();
    self.initailizeServer();
  };

  self.start=function(){
    self.app.listen(self.port,self.ipaddress,function(){
      console.log("Node Server Started on  %s:%d",self.ipaddress,self.port);
    });
  };
};

var application=new app();
application.initialize();
application.start();
