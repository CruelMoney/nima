import React, { Component } from 'react';

class NotFound extends Component {
  render() {
    return (
      <div className="absolute pin flex justify-center items-center my-16">
        <div className="w-1/2 text-center">
        <h1>
          The page could not be found.
          <span className="block mt-6">404</span>
        </h1>
        </div>
      </div>
    );
  }
}

export default NotFound;