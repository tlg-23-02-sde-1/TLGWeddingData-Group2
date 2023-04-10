
// middleware to see whats in the html form
const bodyParser = require('body-parser')

//express uses Node.js to write serverside stuff in js
const express = require('express')
const app = express()
const endpoint = "/"
const callback = app.get('/',(req,res) => {
    res.sendFile('C:/Users/Shigetomi/desktop/nellyClass/TLGWeddingPage/' + '/RSVP/rsvp.html')
})

//MongoDB
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://justinshigetomi:Subaru2018@weddingguestinfo.ndnuvg6.mongodb.net/?retryWrites=true&w=majority";

MongoClient.connect(uri,{useUnifiedTopology: true})
    .then(client => {
        console.log('connected to Database')
        const db = client.db('guest-info')
        const quotesCollection = db.collection('rsvp-form')
    
        app.use(bodyParser.urlencoded({extended:true}))
        app.get(endpoint, callback)
        app.post('/guestInfo',(req,res)=> {
            quotesCollection
                .insertOne(req.body)
                .then(result => {
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })

        app.listen(process.env.PORT || 3000, ()=>{console.log(`listening on ${process.env.PORT||3000}`)})
    })
    .catch(error => console.error(error))

console.log('May the node be with you')