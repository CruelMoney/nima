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
                KURV
              </h2>
              <hr/>
              {
                items.length > 0 ?
                <BagItems items={items} />
                : 
                <p className="empty-message my-4">
                  Din kurv er tom.
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
                <div className="checkout-bag-section text-green">
                  <p className="inline float-left text-left">
                    Rabat
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
                  {shipping.rateAmount === 0 ? 'FREE' : shipping.rateAmount + " DKK"}
                </p>
              </div>
              <hr/>
              <div className="checkout-bag-section">
                <p className="inline float-left text-left">
                  Total (inkl. moms)
                </p>
                <p className="inline float-right text-right">
                  {this.calculateTotal(shipping.rateAmount, coupon)} DKK
                </p>
              </div>
          </React.Fragment>
    );
  }
}

export default Bag;