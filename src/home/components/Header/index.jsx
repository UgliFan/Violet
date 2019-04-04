import React, { Component } from 'react';
import axios from 'axios';
import './header.less';

export default class HeaderNav extends Component {
    constructor() {
        super();
        this.state = {
            opacity: 0,
            pv: 0,
            uv: 0
        };
    }
    componentDidMount() {
        axios({
            url: 'https://uglifan.cn/api/common/puv'
        }).then(response => {
            let res = response.statusCode === 200 && response.data ? response.data : {};
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
            clearTimeout(timer);
        }, 200);
    }
    render() {
        return (
            <div className="header-nav">
                <div className="logo"></div>
                <div className="highlight" style={{opacity: this.state.opacity}}>首页</div>
                <div className="view-count">浏览：{this.state.uv}</div>
            </div>
        );
    }
};