import {app, store, router} from './main';

// import VConsole from 'vconsole';

// let cs = new VConsole();

router.beforeEach((to, from, next) => {
  if (window.__INITIAL_STATE__) {
    return;
  }
    document.title = to.meta.title;
    next();
})

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}

delete window.__INITIAL_STATE__;

app.$mount('#app');