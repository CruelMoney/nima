import React, { Component } from 'react';
import { configurationProvider } from 'cude-cms';
import ReactGA from 'react-ga';
import ReactPixel from 'react-facebook-pixel';

class WithGoogleAnalytics extends Component {

  componentDidMount(){
    const {configuration} = this.props;
    const keys = !!configuration.APIs ? configuration.APIs.key : { };
    const { analytics, facebookPixel } = keys;
    console.log(keys)

    if(!!analytics){
      ReactGA.initialize(analytics,  {
        testMode: process.env.NODE_ENV === 'development'
      });
    }

    const advancedMatching = { }; 
    const options = {
        autoConfig: true, 
        debug: process.env.NODE_ENV === 'development', 	
    };
    if(!!facebookPixel){
      ReactPixel.init(facebookPixel, advancedMatching, options);
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