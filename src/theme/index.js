import React, { Component } from 'react';
import './assets/css/theme.css'
import Landing from './routes/Landing'
import Shop from './routes/Shop'
import Footer from './components/Footer'
import { Route, Switch } from 'react-router-dom'

class Index extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/shop" component={Shop} />
          <Route component={Landing} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default Index;