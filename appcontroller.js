
const mongoose = require('mongoose');
const User = require('../models/User');

const bcrypt = require('bcrypt');
var jwt = require('jwt-simple');
const saltRounds = 10;



const sendError = (err, res) => 
{
  response.status = 501;    
  response.message = typeof err == 'object' ? err.message : err;
  res.status(501).json(response);
};

let response = 
{
  status: 200,
  data: [],
  message: null
};

// APIs : Supplier + Customer 

exports.signup = function(req,res)
{
  console.log(req.body);
 
  bcrypt.genSalt(saltRounds, function (err, salt)
  {
    if (err)
    {
      throw err
    } 
    else 
    {
      bcrypt.hash(req.body.password, salt, function(err, hash)
      {
        if (err)
        {
          throw err
        } 
        else
        {
          if (!req.body.email || !req.body.password)
          {
            res.json({success: false, msg: 'Please pass email and password.'});
          }
          // passowrdsave = hash;
          console.log(hash)
          //$2a$10$FEBywZh8u9M0Cec/0mWep.1kXrwKeiWDba6tdKvDfEBjyePJnDT7K
          var newuser = new User(
            {
              email_id: req.body.email,
              password: hash,
              
              name: req.body.name,
              phoneNumber: req.body.phoneno
            });
      
          newuser.save(function (err1,result)
          {
           if(!err1)
           {
            res.json({success:true,data:result});
           }
           else
           {
             res.json({success:false,err:err1});
           }
         });
        }
      })
    }
  })
};



exports.login = function(req,res)
{
  console.log(req.body.email);
  console.log(req.body.password);
  User.findOne(
  {
    email_id: req.body.email,
    
  }, 
  function(err,user)
  {
    console.log(user);  
      if(err) throw err;
      if(!user)
      {
        res.send({success: false, msg: 'Authentication failed. User not found.'})
      }
      
      else
      {
        console.log(user);
        bcrypt.compare(req.body.password,user.password, function (err, isMatch)
        {
          console.log(isMatch);
          if (isMatch && !err )
          { 
            // if user is found and password is right create a token
            var token = jwt.encode(user, "secretkey");
            // return the information including token as JSON 
            res.json({success: true, token: 'JWT ' + token});
          } 
          else
          {
            res.send({success: false, msg: 'Authentication failed. Wrong password.'});
          }
      });
      }
    });
};
exports.edit = function(req,res){
  console.log(req.body);
  var token1 = getToken(req.headers);
  if (token1)
  {
    var decoded = jwt.decode(token1, "secretkey");
    console.log(decoded);
    User.findOne(
    {
      email_id: decoded.email_id,
     
    }, 
    function(err, user)
    {
      if(err)
      {
        res.send({msg:"Sorry Your account doesnot exist with this email id"});
      }
      else
      {
        let id = mongoose.Types.ObjectId(req.body.body.userid);
       User.findByIdAndUpdate({_id:id},{name:req.body.body.name,email_id:req.body.body.email,phoneNumber:req.body.body.phoneno}, function(err,result){
          if(err) throw err;
          else{
            res.send({msg:"added"});
          }
        })
      }
    });
  }
  else
  {
    res.send({msg:"no token provided"});
  }

}
exports.deletedata = function(req,res){
  console.log(req.body);
  var token1 = getToken(req.headers);
  if (token1)
  {
    var decoded = jwt.decode(token1, "secretkey");
    console.log(decoded);
    User.findOne(
    {
      email_id: decoded.email_id,
     
    }, 
    function(err, user)
    {
      if(err)
      {
        res.send({msg:"Sorry Your account doesnot exist with this email id"});
      }
      else
      { id1 = req.body.body.userid;
        let id  = mongoose.Types.ObjectId(id1);
        User.findOneAndRemove({_id:id},function(err,result)
        {
            if(err)
            {
              res.send({msg:"User not found"});
            }
            else
            {
              res.send({msg:"deleted"});
            }
        })
      }
    });
  }
  else
  {
    res.send({msg:"no token provided"});
  }
}
exports.getdata = function(req,res){
User.find({},function(err,user){
  if(!err){
    res.send({user});
  }
})
}
exports.adduser = function(req,res){
  console.log(req.body);
  var token1 = getToken(req.headers);
  if (token1)
  {
    var decoded = jwt.decode(token1, "secretkey");
    console.log(decoded);
    User.findOne(
    {
      email_id: decoded.email_id,
     
    }, 
    function(err, user)
    {
      if(err)
      {
        res.send({msg:"Sorry Your account doesnot exist with this email id"});
      }
      else
      {
        user = new User({
          name:req.body.name,
          email_id:req.body.email,
          phoneNumber:req.body.phoneno

        });
        user.save( function(err,result){
          if(err) throw err;
          else{
            res.send({msg:"added"});
          }
        })
      }
    });
  }
  else
  {
    res.send({msg:"no token provided"});
  }
}







getToken = function (headers) 
{
  if (headers && headers.authorization) 
  {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) 
    {
      return parted[1];
    } 
    else 
    {
      return null;
    }
  } 
  else 
  {
    return null;
  }
};

