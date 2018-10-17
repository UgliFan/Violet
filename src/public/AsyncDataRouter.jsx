import React, { Component } from 'react';
import { withRouter, Route } from 'react-router';
import { matchRoutes } from 'react-router-config';

const loadBranchData = (store, routes, location) => {
    const branch = matchRoutes(routes, location.pathname);

    const promises = branch.map(({ route, match }) => {
        return route.component.loadData
            ? route.component.loadData(store, match, location)
            : Promise.resolve(null);
    })
    return Promise.all(promises);
}

class LocationChangeRouter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            previousLocation: null,
            showChildren: false,
        }
    }
    // only support react 16 ?
    UNSAFE_componentWillMount() {
        const { initState, routes, store, location } = this.props

        if (!initState) {
            // only active at  window.__INITIAL_STATE__ is not defined
            loadBranchData(store, routes, location).then(data => {
                this.setState({
                    previousLocation: null,
                    showChildren: true
                });
            });
        } else {
            this.setState({
                showChildren: true
            });
        }
    }
    componentWillReceiveProps(nextProps) {
        const navigated = nextProps.location !== this.props.location
        const { routes, store } = this.props
        if (navigated) {
            this.setState({
                previousLocation: this.props.location
            });

            loadBranchData(store, routes, location).then(data => {
                this.setState({
                    previousLocation: null,
                });
            });
        }
    }
    render() {
        const { children, location } = this.props;
        const { previousLocation, showChildren } = this.state;
        return (
            <Route location={previousLocation || location} render={()=> { if (showChildren) { return children } else { return null } }} />
        );
    }
}

export default withRouter(LocationChangeRouter);
