import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNav from '~/components/Header';

import './App.less';

export default class App extends Component {
    render() {
        const pageTitle = `Welcome to demo page. Powered by ${this.props.message}.`;
        return (
            <div className="home-page">
                <Helmet>
                    <title>{ pageTitle }</title>
                </Helmet>
                <HeaderNav></HeaderNav>
                <div className="page-body"><span>Welcome</span></div>
            </div>
        );
    }
};
