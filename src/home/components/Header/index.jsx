import React, { Component } from 'react';
import axios from 'axios';
import './header.less';

export default class HeaderNav extends Component {
    constructor() {
        super();
        this.state = {
            opacity: 0,
            pv: 0,
            uv: 0,
            switchCls: 'canvas-switch'
        };
    }
    componentDidMount() {
        axios({
            url: 'https://uglifan.cn/api/common/puv'
        }).then(response => {
            let res = response.status === 200 && response.data ? response.data : {};
            if (res.code === 0) {
                this.setState({
                    pv: res.result.pv,
                    uv: res.result.uv
                });
            }
        });
        let timer = setTimeout(() => {
            this.setState({
                opacity: 1
            });
            if (window.uglifan && window.uglifan.bgAnime && window.uglifan.bgAnime.running) {
                this.toggleSwitch();
            }
            clearTimeout(timer);
        }, 200);
    }
    toggleSwitch() {
        const switchCls = this.state.switchCls.split(' ');
        if (switchCls.indexOf('actived') > 0) {
            switchCls.splice(switchCls.indexOf('actived'), 1);
            window.uglifan.bgAnime.stop();
        } else {
            switchCls.push('actived');
            window.uglifan.bgAnime.runAnime();
        }
        this.setState({
            switchCls: switchCls.join(' ')
        });
    }
    render() {
        return (
            <div className="header-nav">
                <div className="logo"></div>
                <div className="highlight" style={{opacity: this.state.opacity}}>首页</div>
                <div className={this.state.switchCls} onClick={e => this.toggleSwitch(e)}><div className="switch-btn"></div></div>
                <div className="view-count">浏览：{this.state.uv}</div>
            </div>
        );
    }
};