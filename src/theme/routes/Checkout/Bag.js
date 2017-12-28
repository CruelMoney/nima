import React, { Component } from 'react';
import BagItems from './BagItems'

class Bag extends Component {
  render() {
    const {items} = this.props;

    return (
      <React.Fragment>
                <h2>
                BAG
              </h2>
              <hr/>
              {
                items.length > 0 ?
                <BagItems items={items} />
                : 
                <p className="empty-message my-4">
                  Your bag is empty.
                </p>
              }
               
              <hr/>
              <div className="checkout-bag-section">
                <p className="inline float-left text-left">
                  Subtotal
                </p>
                <p className="inline float-right text-right">
                  {items.reduce((acc, i)=>acc+i.price, 0)} DKK
                </p>
              </div>
              <div className="checkout-bag-section">
                <p className="inline float-left text-left">
                  Shipping
                </p>
                <p className="inline float-right text-right">
                  0 DKK
                </p>
              </div>
              <hr/>
              <div className="checkout-bag-section">
                <p className="inline float-left text-left">
                  Total (incl. taxes)
                </p>
                <p className="inline float-right text-right">
                  {items.reduce((acc, i)=>acc+i.price, 0)} DKK
                </p>
              </div>
          </React.Fragment>
    );
  }
}

export default Bag;