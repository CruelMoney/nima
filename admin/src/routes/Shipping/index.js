import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import ShippingMethods from './ShippingMethods';
import ShippingZones from './ShippingZones';

import './index.css';
import provideShipping from './provideShipping';

class index extends PureComponent {
  render() {
    return (
      <Fragment>
        <ShippingMethods {...this.props} />
        <ShippingZones {...this.props} />
      </Fragment>
    );
  }
}

export default provideShipping(index);