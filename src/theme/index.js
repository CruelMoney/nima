import React, { Component } from 'react';
import './assets/css/theme.css'
import Landing from './routes/landing'
import Footer from './components/Footer'

class Index extends Component {
  render() {
    return (
      <div>
        <Landing />
        <Footer />
      </div>
    );
  }
}

export default Index;