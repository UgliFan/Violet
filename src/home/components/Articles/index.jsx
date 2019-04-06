import React, { Component } from 'react';
import axios from 'axios';
import './article.less';

export default class ArticleList extends Component {
    constructor() {
        super();
        this.state = {
            list: []
        };
    }
    componentDidMount() {
        axios({
            url: 'https://uglifan.cn/api/spider/list',
            params: {
                ps: 40
            }
        }).then(response => {
            let res = response.status === 200 && response.data ? response.data : {};
            if (res.code === 0) {
                this.setState({
                    list: res.result || []
                });
            }
        });
    }
    renderList() {
        const { list } = this.state;
        return (list.map(item =>
            <a className="article-item" key={item.id} href={item.link} target="_blank">
                <div className="article-info">
                    <div className="title">{item.title}</div>
                    <div className="evaluate">{item.evaluate}</div>
                    <div className="other">
                        <div className="source">{item.source}</div>
                        <div className="tags">{item.tags}</div>
                        <div className="score">{item.hot}</div>
                        <div className="date">{item.create_at.substr(0, 16).replace('T', ' ')}</div>
                    </div>
                </div>
                { item.cover ? <img className="article-cover" src={item.cover}/> : '' }
            </a>
        ));
    }
    render() {
        return (
            <div className="articles-wrapper">
                <div className="wrapper-title">精选文章</div>
                <div className="article-list">{this.renderList()}</div>
            </div>
        );
    }
};