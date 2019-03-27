import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { Provider } from 'react-redux';

import createApp from './index';
import AsyncDataRouter from '&public/AsyncDataRouter';
import { hot } from 'react-hot-loader';

const run = async (initState) => {
    const { routes, store } = createApp({ initState });
    const reduxApp = () => (
        <Provider store={store}>
            <BrowserRouter>
                <Suspense fallback={null}>
                    <Switch>
                        {/* <Route path={'/'} component={routes[0].component}></Route> */}
                        <AsyncDataRouter initState={initState} routes={routes} store={store}>
                            {renderRoutes(routes)}
                        </AsyncDataRouter>
                    </Switch>
                </Suspense>
            </BrowserRouter>
        </Provider>
    );
    return hot(module)(reduxApp);
};

if (typeof window !== 'undefined' && window.__INITIAL_STATE__) {
    run(window.__INITIAL_STATE__).then(app => {
        ReactDOM.hydrate(app, document.getElementById('server-app'))
    });
} else {
    run().then(app => {
        ReactDOM.render(app, document.getElementById('app'))
    });
}
