import {app, store} from './main';

store.replaceState(window.__INITIAL_STATE__);

app.$mount('#app');