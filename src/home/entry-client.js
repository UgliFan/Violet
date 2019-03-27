import React from 'react';
import ReactDOM from 'react-dom';
import Home from '&/App';
import { hot } from 'react-hot-loader';

const run = async () => {
    const app = () => (<Home/>);
    return hot(module)(app);
};
run().then(App => {
    ReactDOM.render(<App/>, document.getElementById('app'));
});
