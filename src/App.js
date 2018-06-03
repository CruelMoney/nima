import React, { Component } from 'react';
import {AdminOverlay} from 'cude-cms';
import Theme from './theme';
import './index.css'; //tailwind style
import 'cude-cms/build/index.css'; //cms style
import WithAnalytics from './theme/components/WithAnalytics'
import './theme/assets/css/theme.css'


class App extends Component {
  render() {
    return (
      <AdminOverlay>
        <WithAnalytics>
          <Theme />
        </WithAnalytics>
      </AdminOverlay>
    );
  }
}

export default App;