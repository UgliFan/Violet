import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { renderRoutes, matchRoutes } from 'react-router-config';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';

import createApp from './index';

export default async (context) => {
    const { routes, store } = createApp(context);
    const matchComponents = matchRoutes(routes, context.url);
    if (!matchComponents.length) {
        const err = new Error('404 NotFound');
        err.status = 404;
        throw err;
    }

    const ps = matchComponents.map(({ route, match }) => {
        return route.component.loadData
            ? route.component.loadData(store, match)
            : Promise.resolve(null);
    });

    await Promise.all(ps);

    // set state for window.__INITIAL_STATE__
    context.state = store.getState();
    context.helmet = Helmet;

    return (
        <Provider store={store}>
            <StaticRouter location={context.url} context={context}>
                {renderRoutes(routes)}
            </StaticRouter>
        </Provider>
    );
};
