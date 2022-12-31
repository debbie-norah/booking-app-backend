const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userdetails = require("../models/UserDetails");
const axios = require("axios");
const XMLHttpRequest = require("xhr2");
const xhttp = new XMLHttpRequest();
const jwt = require("jsonwebtoken")
const { deleteOne } = require("../models/UserDetails");
const { findOneAndUpdate } = require("../models/City");
const saltrounds = 10;

async function notification(name){
    const url = "https://slack.com/api/chat.postMessage";
    const resp = await axios.post(url,{
        channel: "#general",
        text: name + " logged in "
    },{headers: {authorization: "Bearer "+process.env.SLACK_TOKEN}});
}

router.get("/oauth",function(req,res){
    const code = req.query.code
    var accesstk ;
    var name;
    if(req.query.error){
      return res.status(500).json({ message: "Something went wrong..." });
    }
    return new Promise(function(resolve,reject){
      xhttp.open("POST","https://www.googleapis.com/oauth2/v4/token",true);
      xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
      xhttp.send("code="+code+"&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Foauth&client_id="+process.env.CLIENT_ID+"&client_secret="+process.env.CLIENT_SECRET+"&scope=&grant_type=authorization_code");
      xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
          const accesstoken = JSON.parse(this.responseText);
          accesstk = accesstoken.access_token;
          resolve("ok");
        }
      }
           
    }).then(function(){
      return new Promise(function(resolve,reject){
        xhttp.open("GET","https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token="+accesstk);
        xhttp.setRequestHeader("Authorization","Bearer "+accesstk);
        xhttp.send();
        xhttp.onreadystatechange = function(){
          if(this.readyState == 4 && this.status == 200){
            name = (JSON.parse(this.response)).name;
            req.session.name = name;
            req.session.id = (JSON.parse(this.response)).id;
            req.session.picture = (JSON.parse(this.response)).picture;
            resolve("ok");
          }
        }
      })
    }).then(function(){
        notification(req.session.name);
        return res.redirect("http://localhost:3000/userprofile?name="+req.session.name+"&picture="+req.session.picture);
    })

})

router.get("/userprofile",function(req,res){
    console.log(req.session.name)
    res.status(200).json({"name":req.session.name,"picture":req.session.picture})
})

router.post("/login", async (req,res) => {
    if(req.body.foroauth == "yes"){
        console.log(req.body.foroauth)
        return res.redirect("https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Foauth&prompt=consent&response_type=code&client_id="+process.env.CLIENT_ID+"&scope=https://www.googleapis.com/auth/userinfo.profile&access_type=offline")
    }
    else{
    console.log(req.body.foroauth)
    const username = req.body.username;
    const password = req.body.password;
    const user = await userdetails.findOne({userName: username})
    if(user){
        bcrypt.compare(password,user.password,function(err,resu){
            if(resu){
                const token = jwt.sign(
                    { user_id: user._id, email: user.email},
                    process.env.TOKEN_KEY,
                    {
                      expiresIn: "2h",
                    }
                );
                xhttp.open("POST","http://localhost:5000/auth/welcome");
                xhttp.setRequestHeader("Authorization","Bearer "+token);
                xhttp.onreadystatechange = function(){
                  if(this.readyState==4 && this.status == 200){
                    console.log("ok");
                  }
                }
                xhttp.send();
                return res.redirect("http://localhost:3000/userprofile?name="+username+"&picture=data:image/jpeg;base64,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")
                
            }
            else{
                res.redirect("http://localhost:3000/login")
            }
        })
            
            
        
    }
    else{
        res.send("user didn't exist")
    }
}
    
    
})



router.post("/register",async (req,res) => {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const username = req.body.username;
    console.log(username);
    const pass = req.body.password;
    const email = req.body.email;
    const user = await userdetails.findOne({userName: username});
    
    if(user){
        return res.status(200).json("user already exists");
    }
    else{
        const p = "";
        bcrypt.genSalt(10,async (err,salt) => {
            bcrypt.hash(pass,salt,async (err,hash) => {
                console.log(hash);
                const token = jwt.sign(
                    { user_id: username, email:email },
                    process.env.TOKEN_KEY,
                    {
                      expiresIn: "2h",
                    }
                  );
                  
                  const user = await userdetails.insertMany([{
                    firstName: fname,
                    lastName: lname,
                    userName: username,
                    email: email,
                    password: hash,
                    token: token
                  }],function(err){
                    if(!err){
                        return "done";
                    }
                  });
                  res.redirect("http://localhost:3000/login");
            })
            
        })
        
      
          
    }
})

router.post("/welcome",(req,res) => {
    const token = ((req.headers["authorization"]).split(" "))[1];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = decoded;
        res.redirect("hi")
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    notification(req.session.name);
    console.log("verified");
    
})


    

module.exports = router;