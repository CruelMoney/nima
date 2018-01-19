import React, { Component } from 'react';
import { configurationProvider } from 'cude-cms';
import ReactGA from 'react-ga';

class WithGoogleAnalytics extends Component {

  componentDidMount(){
    const {configuration} = this.props;
    const keys = !!configuration.APIs ? configuration.APIs.key : { };
    const { analytics } = keys;
    if(!!analytics){
      ReactGA.initialize(analytics,  {
        debug: process.env.NODE_ENV !== 'production',
        gaOptions:{
          'name': process.env.NODE_ENV
        }
      });
      ReactGA.pageview('test-init-page');
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.props.children}
      </React.Fragment>
    );
  }
}

export default configurationProvider(WithGoogleAnalytics);