import React from 'react';
import { connect } from 'react-redux';
import { actionUserInfo } from '&/redux/info.redux';

// @connect(state => state, {
//     actionUserInfo
// });

export default class Home extends React.Component {
    componentDidMount() {
        console.log('componentDidMount');
    }
    render() {
        return (
            <div class="home-page"></div>
        );
    }
}