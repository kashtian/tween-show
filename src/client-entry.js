import {app, store, router} from './main';

// import VConsole from 'vconsole';

// let cs = new VConsole();

router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    next();
})

store.replaceState(window.__INITIAL_STATE__);

app.$mount('#app');