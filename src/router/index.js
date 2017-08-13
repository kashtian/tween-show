import Vue from 'vue';
import Router from 'vue-router';
import pages from '../pages';

Vue.use(Router);

function generateRoutes(pages) {
    let routes = [];
    for (let key in pages) {
        routes.push({
            path: pages[key].route.path,
            component: pages[key],
            meta: {
                title: pages[key].route.title
            }
        })
    }
    return routes;
}

export default new Router({
    mode: 'history',
    routes: generateRoutes(pages)
});