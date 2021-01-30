const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const app = express()
const fetch = require('node-fetch');
require('dotenv').config()

app.use(bodyParser.json())

// set Static path 
app.use(express.static(path.join(__dirname, "client")))

webPush.setVapidDetails(
    'mailto:test@test.com',
    process.env.public_key,
    process.env.private_key, 
)


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
    res.status(201).json({})
    
    const payload = JSON.stringify(data)

    // pass object into sendNotification function
    webPush
        .sendNotification(sub, payload)
        .catch(err=>console.error(err))
})

// for development 
const port = process.env.PORT || 5000 
app.listen(port, () => console.log("server run port 5000"))
// for production 