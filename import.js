var User=require('./server/models/user');
var fs = require('fs');
var obj={};
var user={};
var a={};
var collection=[];
var object = JSON.parse(fs.readFileSync('user.json', 'utf8')).data;
var branches = [
	'Mechanical Engineering',
	'Electrical Engineering',
	'Production Engineering',
	'Metallurgical Engineering',
	'Chemical Engineering',
	'Civil Engineering',
	'Electronics & Communication Engineering',
	'Mining Engineering',
	'Computer Science & Engineering',
	'Information Technology',
	'Others'
];

var importData={};
importData.import=function(){
	for(var i =object.length;i--;){
		user=JSON.parse(JSON.stringify(object[i]));
		obj={};
		obj['username']=user['emailAddress'];
		obj['password']=user['password'];
		obj['primaryEmail']=user['emailAddress'];
		obj['first_name']=user['name'].split(" ")[0];
		obj['last_name']=user['name'].split(" ")[1];
		obj['dob']=new Date(user['dateOfBirth']);
		obj['mobiles']=user['mobileNumbers'];
		obj['gender']=user['gender'];
		obj['address']=user['address'];
		obj['city']=user['city'];
		obj['country']=user['country'];
		obj['branch']=branches[parseInt(user['departmentId'])>10?10:(parseInt(user['departmentId'])-1)];
		obj['entryYear']=user['entryYear'];
		obj['passingYear']=user['passoutYear'];
		obj['designation']=user['designation'];
		obj['emails']=user['otherEmailAddress'];
		obj['company']=user['companyName'];
		obj['facebook_id']=user['facebookUserId'];
		obj['created_at']=new Date(user['registeredOn']);
		obj['active']=true;
		collection.push(obj);

		//console.log(obj);
	}
	collection=collection.sort(function(prev,next){
		return next.entryYear-prev.entryYear;	
	});

	var add=function(index){
		if(index<0) return;
			a=new User();
		a.addUser(collection[index],function(err,instance){
			if(err){
				console.log(err);
			}else{
				//console.log(instance);
				add(index-1);
			}
		});
	};
	add(collection.length-1);
};
module.exports=importData;
