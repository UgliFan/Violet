import React, { Component } from 'react'
import './header.less'

export default class HeaderNav extends Component {
    constructor() {
        super();
        this.state = {
            opacity: 0
        }
    }
    componentDidMount() {
        let timer = setTimeout(() => {
            this.setState({
                opacity: 1
            })
            clearTimeout(timer)
        }, 200)
    }
    render() {
        return (
            <div className="header-nav">
                <div className="logo"></div>
                <div className="highlight" style={{opacity: this.state.opacity}}>首页</div>
            </div>
        );
    }
};