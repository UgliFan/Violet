import React, { Component } from 'react';
import HeaderNav from '&/components/Header';
import Articles from '&/components/Articles';
import { AnimeBackground } from '&/utils';
import './App.less';

export default class App extends Component {
    componentDidMount() {
        window.uglifan = {};
        window.uglifan.bgAnime = new AnimeBackground();
    }
    render() {
        return (
            <div className="home-page">
                <HeaderNav></HeaderNav>
                <div className="page-body">
                    <canvas id="cas"></canvas>
                    <Articles />
                </div>
            </div>
        );
    }
}
