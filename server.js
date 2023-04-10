//express uses Node.js to write serverside stuff in js
const express = require('express')
const app = express()

//MongoDB
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://justinshigetomi:Subaru2018@weddingguestinfo.ndnuvg6.mongodb.net/?retryWrites=true&w=majority";

MongoClient.connect(uri,{useUnifiedTopology: true})
    .then(client => {
        console.log('connected to Database')
        const db = client.db('guest-info')
        const quotesCollection = db.collection('rsvp-form')
    
        app.use(express.urlencoded({extended:true}))

        // done on front end
        // app.get('/',(req,res) => {
        //     res.sendFile('C:/Users/Shigetomi/desktop/nellyClass/TLGWeddingPage/' + '/RSVP/rsvp.html')
        // })

        app.post('/guests',(req,res)=> {
            //make sure I get was I expect
            console.log(req.body);
            
            //let fname = req.body.fname;
            let {fname,lname,email,headCount} = req.body;

            // data validate server side
            if(!fname || !lname || !email || !headCount) {
                return res.status(400).send({msg:"form incomplete"});
            }
            quotesCollection
                .insertOne({
                    guest: req.body
                })
                .then(result => {
                    res.send({msg:"success"})
                })
                .catch(error => console.error(error))
        })

        app.listen(process.env.PORT || 3000, ()=>{console.log(`listening on ${process.env.PORT||3000}`)})
    })
    .catch(error => console.error(error))

console.log('May the node be with you')