
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


const send = async()=>{
    if ('serviceWorker' in navigator){
        // add onlick function for sending the puhs 
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

        const stopBtn = document.getElementById("stop_push")
        const sendingBtn = document.getElementById("sendingBtn") 

        pushForm.addEventListener("submit",async(event)=>{
            event.preventDefault()
            const {data,session_data} = get_user_input('sending'); 
            console.log(data)
            var subscription  = {
                'data': data, 
                'sub':sub, 
                'session_data':session_data
            }
            console.log(data)
            // set the sending button disabel
            sendingBtn.disabled = true
            sendingBtn.innerHTML = "Sending the push ... Click stop to stop"
            // set the stopping btn undisable
            stopBtn.disabled = false
            stopBtn.innerHTML = "Stop"
            document.get
            sendNoti(subscription)  
            // location.reload()

        })
        stopBtn.addEventListener("click", ()=>{
            const {data,session_data} = get_user_input('stopping')
            data['sending'] = false
            var subscription  = {
                'data': data, 
                'sub':sub, 
                'session_data': session_data
            }
            console.log(data)
             // set the sending button disabel
            sendingBtn.disabled = false
            sendingBtn.innerHTML = "Send Me"
            // set the stopping btn undisable
            stopBtn.disabled = true
            stopBtn.innerHTML = "Stop Disabled"
            sendNoti(subscription)
            console.log("stopping the push")
            // location.reload()
        })
    }
}

send()

const get_user_input = (status) =>{
    var time = parseInt(pushForm.elements[1].value)
    const time_unit = pushForm.elements[2].value
    var interval = parseInt(pushForm.elements[3].value)
    const interval_unit = pushForm.elements[4].value
    const message = pushForm.elements[5].value
    const session_data = {
        'time':time,
        'interval': (interval),
        'message': message,
        'time_unit':  time_unit,
        'interval_unit': interval_unit
    }
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
        interval = interval**60*1000
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
            'status': status, 
        }
    }
    catch{
        alert("Invalid input")
        return; 
    }
    return {
        data: data, 
        session_data: session_data
    }
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