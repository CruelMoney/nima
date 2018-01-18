import React, { Component } from 'react';

class Confirmation extends Component {

  render() {
    return (
      <div className="checkout-page confirmation">
        <div className="container mx-auto  mt-16">
            <hr/>
            <div className="mt-10 mb-16 flex">
              <article className="text-center mx-auto w-1/2 checkout-flow">

                <h1>Thank you</h1>
                <p>
                  You will receive a confirmation email right away. <br />
                  When the order is shipped you will receive an email containing the tracking number of the package.
                  <br />
                  <span className="mt-6 block font-bold">NIMA COPENHAGEN</span>
                </p>
              
              </article>
          </div>
        </div>
      </div>
    );
  }
}

export default Confirmation;