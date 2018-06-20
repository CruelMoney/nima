import React, { Component } from 'react';
import './index.css';
import OrderItems from '../OrderItems';

export default class OrderDetails extends Component {
  render() {
    const {order} = this.props;
    const {
      delivery,
      email,
      phone
    } = order; 
    const createdAt = new Date(order.createdAt);
    console.log(order)
    return (
      <div className="order-details-modal">
        <h3>Order #{order.orderID} <span>{createdAt.toLocaleDateString() + " " + createdAt.toLocaleTimeString()}</span></h3>

          <div className="form-group">
            <label>Delivery</label>
            <div>
            <address>
                {`${delivery.firstName} ${delivery.lastName}`}<br/>
                {`${delivery.address}`}<br/>
                {`${delivery.city}, ${delivery.zip}`}<br/>
                {`${delivery.country}`}<br/>
              </address>
            </div>
          </div>

          <div className="form-group">
            <label>Contact</label>
            <div>
              <a href={`mailto: ${email}`}>{email}</a>
              <br/>
              <a href={`tel:${phone}`}>{phone}</a>
            </div>
          </div>


          <div className="form-group">
            <label>Items</label>
            <OrderItems order={order} />
          </div>

          <div className="form-group">
            <label>Used coupon</label>
            <p>
            {order.usedCouponCode}
            </p>
          </div>

        
         
      </div>
    )
  }
};
