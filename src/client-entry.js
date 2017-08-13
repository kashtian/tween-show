import {app, store, router} from './main';

router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    next();
})

store.replaceState(window.__INITIAL_STATE__);

app.$mount('#app');