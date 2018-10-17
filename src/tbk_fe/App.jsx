import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import './App.less';

const mapStatesToProps = ({ user }) => ({ user });
const mapDispatchToProps = dispatch => ({
    setUserInfo(params) { setUserInfo(params)(dispatch) }
});

@connect(mapStatesToProps, mapDispatchToProps)
export default class App extends Component {
    render() {
        const pageTitle = `Welcome to demo page. Powered by ${this.props.poweredBy}.`;
        return (
            <div className="demo">
                <Helmet>
                    <title>{ pageTitle }</title>
                </Helmet>
                <p className="message"> { this.props.message } </p>
                <p className="footer"> { this.props.poweredBy } </p>
            </div>
        );
    }
};
