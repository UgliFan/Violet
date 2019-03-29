import React, { Component } from 'react';
import HeaderNav from '&/components/Header';
import { AnimeBackground } from '&/utils';
import './App.less';

export default class App extends Component {
    componentDidMount() {
        const h5Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
        var isH5 = false;
        for (var i = 0; i < h5Agents.length; i++) {
            if (window.navigator.userAgent.indexOf(h5Agents[i]) > -1) {
                isH5 = true; break;
            }
        }
        if (!isH5) {
            let bgAnime = new AnimeBackground();
            bgAnime.runAnime();
        }
    }
    componentWillUnmount() {
        // bgAnime.destroy();
    }
    render() {
        return (
            <div className="home-page">
                <HeaderNav></HeaderNav>
                <div className="page-body"><canvas id="cas"></canvas><span>Amazing.</span></div>
            </div>
        );
    }
}
