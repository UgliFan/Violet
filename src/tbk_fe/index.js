import App from '~/App';
import store from '~/redux/store';

export default function createApp(context) {
    const routes = [{
        path: '/',
        component: App,
        exact: true,
    }];
    return { routes, store };
};
