import React, { Component } from 'react';
import {AdminOverlay} from 'cude-cms';
import Theme from './theme';
import './index.css'; //tailwind style
import 'cude-cms/build/index.css'; //cms style

class App extends Component {
  render() {
    return (
      <AdminOverlay>
        <Theme />
      </AdminOverlay>
    );
  }
}

export default App;