var jwt=require('jsonwebtoken');

var token=jwt.sign({user:'vikash'},'vikash');
console.log(jwt.verify(token,'vikash',function(err,decoded){
  console.log(err);
  console.log(decoded);
}));
