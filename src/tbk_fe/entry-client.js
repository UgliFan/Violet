import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { Provider } from 'react-redux';

import createApp from './index';
import AsyncDataRouter from 'g-public/AsyncDataRouter';

const run = async (initState) => {
    const { routes, store } = createApp({ initState });

    return (
        <Provider store={store}>
            <BrowserRouter>
                <Switch>
                    <AsyncDataRouter initState={initState} routes={routes} store={store}>
                        {renderRoutes(routes)}
                    </AsyncDataRouter>
                </Switch>
            </BrowserRouter>
        </Provider>
    );
};

if (typeof window !== 'undefined' && window.__INITIAL_STATE__) {
    run(window.__INITIAL_STATE__).then(app => {
      ReactDOM.hydrate(app, document.getElementById('server-app'))
    });
} else {
    run().then(app => {
      ReactDOM.render(app, document.getElementById('demo-app'))
    });
}
