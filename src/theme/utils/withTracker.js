/**
 * From ReactGA Community Wiki Page https://github.com/react-ga/react-ga/wiki/React-Router-v4-withTracker
 */

import React, { Component } from 'react';
import ReactGA from 'react-ga'

export default function withTracker(WrappedComponent, options = {}) {
  const trackPage = (page) => {
    ReactGA.set({
      page,
      ...options
    });
    ReactGA.pageview(page);
  };

  const HOC = class extends Component {
    componentDidMount() {
      const {pathname} = this.props.location ? this.props.location : {};
      pathname && trackPage(pathname);
    }

    componentWillReceiveProps(nextProps) {
      const getPathName = (location) => {
        const { pathname } = location ? location : {};
        return pathname;
      }
      const currentPage = getPathName(this.props.location);
      const nextPage =  getPathName(nextProps.location);

      if (!!nextPage && !!currentPage && currentPage !== nextPage) {
        trackPage(nextPage);
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  return HOC;
}