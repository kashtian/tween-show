export default {
    init(appKeyFn) {
        window.addEventListener('load', () => {
            if ('serviceWorker' in navigator) {
                // navigator.serviceWorker.getRegistration()
                //     .then(e => {
                //         e.unregister();
                //     })
                navigator.serviceWorker.register('./sw.js')
                    .then(() => this.initState(appKeyFn));
            }
        })
    },

    initState(appKeyFn) {
        if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
            console.log('Notification are not supported.');
            return;
        }

        if (Notification.permission == 'denied') {
            console.log('The user has blocked notification.');
            return;
        }

        if (!('PushManager' in window)) {
            console.log('Push messaging is not supported.');
            return ;
        }

        navigator.serviceWorker.ready.then(registration => {
            registration.pushManager.getSubscription()
                .then(subscription => {
                    console.log('get pushSubscription: ', subscription);
                    if (!subscription) {
                        console.log('user can not subscribed');
                        this.subscribe(appKeyFn);
                        return;
                    }
                    //this.unsubscribe();
                }).catch(err => {
                    console.log('Error during getSubscription()', err);
                })
        })
    },

    subscribe(appKeyFn) {
        navigator.serviceWorker.ready.then(async registration => {
            let keyInfo = await appKeyFn();
            registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: Uint8Array.from(keyInfo.publicKey.data)
            }).then(subscription => {
                fetch('http://localhost:3010/crypto/endPoint', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
			            'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        pushSubscription: subscription.toJSON()
                    })
                }).then(result => result.json())
                .then(result => {
                    if (result.code == 200) {
                        console.log('send endpoint to server success');
                    } 
                })
                console.log('subscription: ', subscription.toJSON());
                console.log('p256dh: ', subscription.getKey('p256dh'));
                console.log('p256dh: ', subscription.getKey('auth'));
            })
        })
    },

    unsubscribe() {
        navigator.serviceWorker.ready.then(registration => {
            registration.pushManager.getSubscription()
                .then(subscription => {
                    if (!subscription) {
                        return;
                    }
                    subscription.unsubscribe().then(() => {
                        console.log('unsubscribe success');
                    })
                }).catch(err => {
                    console.log(err);
                })
        })
    }
}