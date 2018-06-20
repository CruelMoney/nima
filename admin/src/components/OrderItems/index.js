import React, { Component } from 'react';

export default class Items extends Component {
  
  render() {
    const {order} = this.props;
    const items = JSON.parse(order.items);

    return (
      <div className="order-items">
      {items.map(item=>{
        return (
          <span key={item.SKU} className="pill">{item.quantity+"x"+item.SKU}</span>
        )
      })}
      </div>
    )
  }
};
