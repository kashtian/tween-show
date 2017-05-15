import Vue from 'vue';
import App from './app';
import router from './router';
import store from './store';
import { sync } from 'vuex-router-sync';

sync(store, router);

const app = new Vue({
    router,
    store,
    ...App
})

export { app, router, store }