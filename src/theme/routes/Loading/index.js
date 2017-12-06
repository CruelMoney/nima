import React, { Component } from 'react';
import Logo from '../../components/Logo'
import './index.css'

class Loading extends Component {
  render() {
    return (
      <div className={`fixed justify-center items-center flex pin loading-screen ${this.props.active && 'active'}`}>
       <Logo 
        color="#111111"
       />
      </div>
    );
  }
}

export default Loading;