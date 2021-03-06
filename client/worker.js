
console.log("Service Worker Loaded...");

const cachName = 'v2'


self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open(cachName).then((cache) =>  {
        console.log("Service worker caching files")
        return cache.addAll([
        '/',
        '/client.js',
        '/style.css',
        '/nature_bg.jpg', 
     ])
   })
   
 );
});

self.addEventListener('activate', e => {
    console.log('Service worker activated')
    e.waitUntil(
        caches.keys().then( cacheNames =>{
            return Promise.all(
                cacheNames.map(cache =>{
                    if (cache !== cachName) {
                        console.log("Service worker: clearing cache")
                        return caches.delete(cache)
                    }
                })
            )
        })
    )
})
self.addEventListener('fetch', (e) => {
    console.log("service worker: Fetching")
    e.respondWith(
         fetch(e.request)
            .catch((err)=>{
                // if fail to connect -> load from the cache 
                const cachesRespond = caches.match(e.request)
                return cachesRespond
            })
        )
});

// push the neofication 
let timeId ; 

self.addEventListener("push", e => {
    const data = e.data.json();
    console.log("data",  data)
    if (data.sending == true){
        timeId = setInterval(() =>{
            if (data.message == ""){
                send_notification("Hello, how are you today? ")
            console.log("sent default push ");

            }else{
                send_notification(data.message)
        console.log("sent LAST push ");
            }
        }, data.interval);
        console.log("time id", timeId)
        
        setTimeout(() => {
            console.log
            clearInterval(timeId)
            // send_notification("This is your last reminder")
        }, data.time);
    }
    else if (data.sending == false){
        console.log("time id", timeId)
        if (timeId){
            clearInterval(timeId)
        }
        send_notification("Manually stop the Notification!!")
        console.log("stoped the push")

    }
    console.log("------------------------")
})

   

const send_notification = (data) =>{
    // console.log(data)
    self.registration.showNotification("From viet", {
        body: data,
        icon: "http://image.ibb.co/frYOFd/tmlogo.png"
    })
}