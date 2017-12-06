import React, { Component } from 'react';
import './assets/css/theme.css'
import Landing from './routes/Landing'
import Shop from './routes/Shop'
import NotFound from './routes/NotFound'
import Footer from './components/Footer'
import LoadingPage from './routes/Loading';
import { Route, Switch } from 'react-router-dom'
import Loadable from 'react-loadable';

const AsyncPage = Loadable({
  loader: () => import('./routes/Page'),
  loading: LoadingPage
});

class Index extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route path="/shop" component={Shop} />
          <Route path="/not-found" component={NotFound} />
          <Route component={AsyncPage} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default Index;