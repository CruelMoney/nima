import React, { Component } from 'react';
import './App.css';
import Layout from './components/Layout';
import { BrowserRouter, Route } from 'react-router-dom'
import Orders from './routes/Orders';
import Products from './routes/Products';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Route path="/admin/orders" component={(Orders)}/>
          <Route path="/admin/inventory" component={(Products)}/>
        </Layout>
      </BrowserRouter>
    );
  }
}

export default App;
