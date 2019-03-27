import React, { Component } from 'react';
import HeaderNav from '&/components/Header'

import './App.less'

export default class App extends Component {
    render() {
        return (
            <div className="home-page">
                <HeaderNav></HeaderNav>
                <div className="page-body"></div>
            </div>
        )
    }
}
