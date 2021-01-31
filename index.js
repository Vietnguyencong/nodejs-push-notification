const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const app = express()
const fetch = require('node-fetch');
const session = require("express-session");
const { render } = require('ejs');
require('dotenv').config()

app.use(bodyParser.json())

// set Static path 
app.use('/client', express.static(path.join(__dirname, "client")))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set("trust proxy",1) // trust proxy one 
app.use(session({
    secret:"secret-key",
    resave:false, 
    saveUninitialized:false,
    // cookie:{secure:false}
}))

if(app.get('env') === 'production'){
    app.set('trust proxy',1)
    // session.cookie.securgite = true
}

webPush.setVapidDetails(
    'mailto:test@test.com',
    process.env.public_key,
    process.env.private_key, 
)
// HOME PAGE
app.get("/", (req,res, next)=>{
    // console.log("sesssion:", req.session)
    // let status
    if (!req.session.status){
        req.session.status = "stopping"
    }
    else{
        status = req.session.status
    }
    res.render('index',{ status: req.session.status })
})

app.get("/getimage", async (req,res)=>{
    const url = 'https://api.unsplash.com/search/photos?'
    const query = "vietnam"
    const viet = await fetch(url + `query=${query}`,{
        method:"GET", 
        headers:{
            Authorization: 'Client-ID H4omZ7vkNKxVOly_B6COajPhUtDpWHNPa_z475pEC54'
        }
    } )
    const json = await viet.json()
    res.json(json)    
})


// send the subcribe route 
app.post('/subscribe',  (req,res)=>{
    // get pushSubscription object
    const subscription = req.body
    // resource is created 
    const sub = subscription['sub']
    const data = subscription['data']
 
    req.session.status = data.status
    req.session.data = data
    res.status(201).json({})
    const payload = JSON.stringify(data)
    webPush
        .sendNotification(sub, payload)
        .catch(err=>console.error(err))

})

const port = process.env.PORT || 5000 
app.listen(port, () => console.log("server run port 5000"))
// for production 