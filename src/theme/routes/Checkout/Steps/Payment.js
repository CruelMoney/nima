import React, { Component } from 'react';

class Information extends Component {
  render() {
    return (
      <React.Fragment>
            <div className="flex">
              <input type="text" placeholder="Card owner" className="w-full mr-2"/>
            </div>
            <div className="flex  my-4">
              <input type="text" placeholder="Card number" className="w-full mr-2"/>
            </div>
            <div className="flex my-4">
              <input type="text" placeholder="CVV" className="w-1/3 mr-2"/>
              <input type="text" placeholder="Expiry month" className="w-1/3 mx-2"/>
              <input type="text" placeholder="Expiry year" className="w-1/3 ml-2"/>
            </div>
      </React.Fragment>
    );
  }
}

export default Information;