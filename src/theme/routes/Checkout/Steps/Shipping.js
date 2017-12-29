import React, { Component } from 'react';

class Information extends Component {
  render() {
    return (
      <React.Fragment>
            <div className="flex my-4">
              <input type="address" placeholder="Address" className="w-full"/>
            </div>
            <div className="flex my-4">
              <input type="city" placeholder="City" className="w-1/2 mr-2"/>
              <input type="zip" placeholder="Zip code" className="w-1/2 ml-2"/>
            </div>
            <div className="flex my-4">
              <input type="country" placeholder="Country" className="w-full"/>
            </div>
      </React.Fragment>
    );
  }
}

export default Information;