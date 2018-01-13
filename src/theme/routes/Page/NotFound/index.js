import React, { Component } from 'react';
import './index.css';

class NotFound extends Component {
  render() {
    return (
      <div className="container mx-auto  mt-16">
      <hr/>
      <div className="page-not-found flex justify-center items-center">
        <div className="lg:w-1/2 text-center">
        <h1>
          The page could not be found.
          <span className="block mt-6">404</span>
        </h1>
        </div>     
      </div>
      </div>
    );
  }
}

export default NotFound;