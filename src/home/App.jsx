import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNav from '&/components/Header';

import './App.less';

export default class App extends Component {
    render() {
        return (
            <div className="home-page">
                <Helmet>
                    <title>VIOLET</title>
                </Helmet>
                <HeaderNav></HeaderNav>
                <div className="page-body"><span></span></div>
            </div>
        );
    }
};
