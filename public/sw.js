self.addEventListener('push', function(event) {    
    console.log('push time: ', new Date());
    event.waitUntil(
        self.registration.showNotification('test', {
            body: event.data.text()
        })
    )
})