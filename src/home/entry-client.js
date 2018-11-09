import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import AsyncDataRouter from '~public/AsyncDataRouter';
import App from '~/App';

const run = async () => {
    const routes = [{
        path: '/',
        component: App,
        exact: true,
    }]
    return (
        <BrowserRouter>
            <Switch>
                <AsyncDataRouter routes={routes}>
                    {renderRoutes(routes)}
                </AsyncDataRouter>
            </Switch>
        </BrowserRouter>
    );
};

run().then(app => {
    ReactDOM.render(app, document.getElementById('app'))
});
