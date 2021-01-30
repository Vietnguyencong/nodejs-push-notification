const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const app = express()
app.use(bodyParser.json())
const public_key = 'BMnatDbIVtcS42bMxhpWgQjRJlyQuMxGIx4dU6J9neItwSnJ71ZPq79tvuv90Oqfvr-6pjxeuYNWs84VjWX7Ge8'
const private_key = 'ju6iAB70um95vZmojT1gUr4T_ortSZLk75aBA70-vzc'
const axios = require('axios')

const fetch = require('node-fetch');


// set Static path 
app.use(express.static(path.join(__dirname, "client")))

webPush.setVapidDetails(
    'mailto:test@test.com',
    public_key,
    private_key, 
)

const get_image = axios.create({
    baseURL: 'https://api.unsplash.com',
    headers: {
        Authorization: 'Client-ID H4omZ7vkNKxVOly_B6COajPhUtDpWHNPa_z475pEC54'
    }
})

app.get("/getimage", async (req,res)=>{

    // const viet = await get_image.get('/search/photos', {
    //     params: {query: "vietnam"},
    // })
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

// send teh subcribe route 
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


const port = 5000 
app.listen(port, () => console.log("server run port 5000"))