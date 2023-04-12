//express uses Node.js to write serverside stuff in js
const express = require('express')
const app = express()


//MongoDB
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://justinshigetomi:Subaru2018@weddingguestinfo.ndnuvg6.mongodb.net/?retryWrites=true&w=majority";

//passport local and mongoose
const mongoose = require("mongoose");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./model/User.js");

//CORS
const cors = require('cors')



mongoose.connect(uri)
.then(()=>console.log('connected'))
.catch(e=>console.log(e))

MongoClient.connect(uri,{useUnifiedTopology: true})
    .then(client => {
        console.log('connected to Database')
        const rsvpDB = client.db('guest-info')
        const guestInfo = rsvpDB.collection('rsvp-form')
        
        app.use(express.json())
        app.use(cors())

        app.post('/guests',(req,res)=>{
            console.log(req.body);
                    
            //let fname = req.body.fname;
            let {fname,lname,email,headCount} = req.body;
        
            // data validate server side
            if(!fname || !lname || !email || !headCount) {
                return res.status(400).send({msg:"form incomplete"});
            }
            guestInfo
                .insertOne({
                    guest: req.body
                })
                .then(result => {
                    res.send({msg:"success"})
                })
                .catch(error => console.error(error))
        })

        app.post('/login',async (req,res)=>{
            console.log("login server connected")
            try {
                const user = await User.findOne({username:req.body.username})
                if(user) {
                    //check pass
                    const result = req.body.password === user.password;
                    if(result) {
                        console.log("user accepted");
                        //go to profile page ask nelly
                        res.send({
                            success: "success",
                            url: "./profile.html",
                        })
                    }
                    else{
                        res.status(400).send({error: "password doesn't match"});
                    }
                }
                else {
                    res.status(400).send({error: "user doesn't exist"});
                }
            }
            catch (error) {
                res.status(400).send({error:"error"});
            }
        })

        app.post('/register',async (req,res)=>{
            let {username,password} = req.body;
            if(!username || !password) {
                return res.status(400).send({msg:"form incomplete"});
            }
            const user = await User.create({
                username: req.body.username,
                password: req.body.password
            })
            return res.status(200).json(user);
        })

        app.listen(process.env.PORT || 3000, ()=>{console.log(`listening on ${process.env.PORT||3000}`)})
    })
    .catch(error => console.error(error))



function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()) return next();
    res.redirect("/login");
}