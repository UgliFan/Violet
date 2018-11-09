import React, { Component } from 'react';
import './header.less';
import { throttle } from 'throttle-debounce';
import { getScrollTop } from '~public/utils';

export default class HeaderNav extends Component {
    constructor() {
        super();
        this.state = {
            opacity: 0
        };
        this.scrollHander = throttle(16, false, () => {
            let scrollTop = getScrollTop(window.document.querySelector('.home-page'));
            if (scrollTop > 600) {
                this.setState({
                    opacity: 1
                });
            } else {
                this.setState({
                    opacity: Number(scrollTop / 600).toFixed(3)
                });
            }
        });
    }
    bindEvents() {
        window.document.querySelector('.home-page').addEventListener('scroll', this.scrollHander, false);
    }
    unBindEvents() {
        window.document.querySelector('.home-page').removeEventListener('scroll', this.scrollHander, false);
    }
    componentDidMount() {
        this.bindEvents();
    }
    componentWillUnmount() {
        this.unBindEvents();
    }
    render() {
        return (
            <div className="header-nav">
                <div className="highlight" style={{opacity: this.state.opacity}}></div>
            </div>
        );
    }
};