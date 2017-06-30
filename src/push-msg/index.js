import { pushHost } from '../../config/sys.config';

export default {
    init(appKeyFn) {
        window.addEventListener('load', () => {
            if ('serviceWorker' in navigator) {
                this.register('./sw.js').then(() => this.initState(appKeyFn));
                //this.unregister();
            }
        });
    },

    register(filePath) {
        if ('serviceWorker' in navigator) {
            return navigator.serviceWorker.register(filePath)
                .catch(err => {
                    console.log('Register error: ', err);
                })
        }
        return Promise.reject('No serviceWorker');
    },

    unregister() {
        if ('serviceWorker' in navigator) {
            return navigator.serviceWorker.getRegistration()
                .then(registration => {
                    if (!registration) {
                        return;
                    }
                    registration.pushManager.getSubscription()
                        .then(subscription => {                            
                            registration.unregister();
                            subscription && this.deleteSubscriptionToServer(subscription.endpoint);
                        })
                })
        }
        return Promise.reject('No serviceWorker');
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
            return;
        }

        navigator.serviceWorker.ready.then(registration => {
            registration.pushManager.getSubscription()
                .then(subscription => {
                    console.log('get pushSubscription: ', subscription);
                    if (!subscription) {
                        console.log('user subscribe now');
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
                this.updateSubscriptionToServer(subscription);
                console.log('subscription: ', subscription.toJSON());
            }).catch(err => {
                console.log('subscribe error:　', err);
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
                        this.deleteSubscriptionToServer(subscription.endpoint);
                        console.log('unsubscribe success', subscription);
                    })
                }).catch(err => {
                    console.log(err);
                })
        })
    },

    updateSubscriptionToServer(pushSubscription) {
        fetch(`//${pushHost}/push/saveSubscription`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pushSubscription: pushSubscription.toJSON()
            })
        }).then(result => result.json())
            .then(result => {
                if (result.code == 200) {
                    console.log('send endpoint to server success');
                }
            })
    },

    deleteSubscriptionToServer(endpoint) {
        fetch(`//${pushHost}/push/delSubscription`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                endpoint: endpoint
            })
        }).then(result => result.json())
            .then(result => {
                if (result.code == 200) {
                    console.log(result.msg);
                }
            })
    }
}