import React, { Component } from 'react';
import BagItems from './BagItems'
import * as priceCalc from './priceCalculator';

class Bag extends Component {

  calculateTotal = (init, coupon) => {
    const {items} = this.props;
    return priceCalc.getTotalPrice({
      items,
      coupon,
      initial: init
    });
  }

  render() {
    const {items, shipping, coupon} = this.props;

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
                  {this.calculateTotal(0)} DKK
                </p>
              </div>
              {
                !!coupon ?
                <div className="checkout-bag-section">
                  <p className="inline float-left text-left">
                    Discount
                  </p>
                  <p className="inline float-right text-right">
                    {coupon.discount} {
                      coupon.type === "Percentage" ? "%" : "DKK"
                    }
                  </p>
                </div>
               : null
              }
              
              <div className="checkout-bag-section">
                <p className="inline float-left text-left">
                  {shipping.name}
                </p>
                <p className="inline float-right text-right">
                  {shipping.price === 0 ? 'FREE' : shipping.price + " DKK"}
                </p>
              </div>
              <hr/>
              <div className="checkout-bag-section">
                <p className="inline float-left text-left">
                  Total (incl. taxes)
                </p>
                <p className="inline float-right text-right">
                  {this.calculateTotal(shipping.price, coupon)} DKK
                </p>
              </div>
          </React.Fragment>
    );
  }
}

export default Bag;