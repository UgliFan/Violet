import React, { Component } from 'react';
import HeaderNav from '&/components/Header';
import { AnimeBackground } from '&/utils';
import './App.less';

export default class App extends Component {
    componentDidMount() {
        let bgAnime = new AnimeBackground();
        bgAnime.runAnime();
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
