import React, { Component } from 'react';
import './App.css';
import Layout from './components/Layout';
import { BrowserRouter, Route } from 'react-router-dom'
import Orders from './routes/Orders';
import Products from './routes/Products';
import Customers from './routes/Customers';
import Discounts from './routes/Discounts';
import Shipping from './routes/Shipping';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Route path="/admin/orders" component={(Orders)}/>
          <Route path="/admin/inventory" component={(Products)}/>
          <Route path="/admin/customers" component={(Customers)}/>
          <Route path="/admin/discounts" component={(Discounts)}/>
          <Route path="/admin/shipping" component={(Shipping)}/>
        </Layout>
      </BrowserRouter>
    );
  }
}

export default App;
