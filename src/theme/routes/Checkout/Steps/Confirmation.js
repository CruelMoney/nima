import React, { Component } from 'react';

class Confirmation extends Component {

  render() {
    return (
      <div className="checkout-page confirmation">
        <div className="container mx-auto  mt-16">
            <hr/>
            <div className="mt-10 mb-16 flex">
              <article className="text-center mx-auto lg:w-1/2 checkout-flow">

                <h1>Tak</h1>
                <p>
                  Du vil modtage en bekræftelsesmail med det samme. <br />
                  Når din ordre er afsendt, modtager du en mail med trackingnummeret.
                  <br />
                  <span className="mt-6 block font-bold">nimacph.</span>
                </p>
              
              </article>
          </div>
        </div>
      </div>
    );
  }
}

export default Confirmation;