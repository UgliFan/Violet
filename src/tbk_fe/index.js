import App from '&/App';
import initRedux from '&/redux';

export default function createApp(context) {
    const store = initRedux(context.initState)
    const routes = [{
        path: '/',
        component: App,
        exact: true,
    }];
    return { routes, store };
};
