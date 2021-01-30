
const vapidPublicKey = 'BMnatDbIVtcS42bMxhpWgQjRJlyQuMxGIx4dU6J9neItwSnJ71ZPq79tvuv90Oqfvr-6pjxeuYNWs84VjWX7Ge8'
const pushForm = document.getElementById("send-push__form")
// const call_api = async () =>{
//     const api_url = "/getimage"
//     const response = await fetch(api_url)
//     const json = await response.json()
//     const image_list =  json.results[0].urls.full
//     document.getElementById("bg").src = image_list;

// }

// call_api()


if ('serviceWorker' in navigator){
    // add onlick function for sending the puhs 
    pushForm.addEventListener("submit",async(event)=>{
        event.preventDefault()
        var time = parseInt(pushForm.elements[1].value)
        const time_unit = pushForm.elements[2].value
        var interval = parseInt(pushForm.elements[3].value)
        const interval_unit = pushForm.elements[4].value
        const message = pushForm.elements[5].value
        if (time_unit == "Hours"){
            time = time*60*60*1000
        }
        else if(time_unit == "Minute") {
            time = time*60*1000
        }else{
            time = time* 1000
        }
        if (interval_unit == "Hours"){
            interval = interval*60*60*1000
        }
        else if (interval_unit == "Minute") {
            internval = internval**60*1000
        }
        else {
            interval = interval * 1000
        }
        try{
            data = {
                'time':time,
                'interval': (interval),
                'message': message,
                'time_unit':  time_unit,
                'interval_unit': interval_unit, 
                'sending': true, 
            }
        }
        catch{
            alert("Invalid input")
            return; 
        }
        
        console.log(data)
        send(data)
        

        
       
    })
}
// Register the service worker , register push , send the push 
async function send(data){
    console.log("register the service worker")
    const resgister = await navigator.serviceWorker.register('/worker.js', {
        scope:'/'
    })
    console.log('Service worker registered ')
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
    
    // register the worker to  the push 
    const sub = await resgister.pushManager.subscribe({
        userVisibleOnly: true, 
        applicationServerKey: convertedVapidKey, 
    })
    console.log("push registered")

    var subscription  = {
        'data': data, 
        'sub':sub, 
    }
    sendNoti(subscription)
    document.getElementById("sendingBtn").innerHTML = "Sending the push to your computer ... Click 'stop' to STOP"
    const stop_btn = document.getElementById("stop_push")
    stop_btn.addEventListener("click", ()=>{
        data['sending'] = false
        subscription['data'] = data
        sendNoti(subscription)
        document.getElementById("sendingBtn").innerHTML = "Send Me"
        console.log("stopping the push")
    })
}
const sendNoti = async(subscription) => {
    await fetch('/subscribe',{
        method: 'POST',
        body: JSON.stringify(subscription), 
        headers:{
            'content-type': 'application/json'
        }
    })
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length); 
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }