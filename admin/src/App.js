import React, { Component } from 'react';
import './App.css';
import Layout from './components/Layout';
import { BrowserRouter, Route } from 'react-router-dom'
import Orders from './routes/Orders';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Route path="/admin/orders" component={(Orders)}/>
        </Layout>
      </BrowserRouter>
    );
  }
}

export default App;
