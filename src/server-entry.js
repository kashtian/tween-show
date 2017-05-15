import {app, router, store} from './main';

/**
 * 服务端渲染时传入context
 */
export default context => {
    router.push(context.path);

    return Promise.all(router.getMatchedComponents().map(component => {
        if (component.preFetch) {
            return component.preFetch(store);
        }
    })).then(() => {
        context.initialState = store.state;
        return app;
    })
}