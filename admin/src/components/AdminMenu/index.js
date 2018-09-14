import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import HomeIcon from '../../assets/icons/Home';
import InventoryIcon from '../../assets/icons/Inventory';
import OrdersIcon from '../../assets/icons/Orders';
import CustomersIcon from '../../assets/icons/Customers';
import DiscountsIcon from '../../assets/icons/Discounts';
import ShippingIcon from '../../assets/icons/Shipping';

export default class AdminMenu extends Component {
  render() {
    return (
      <ul className="menu">
        <li>
          <NavLink exact to={'/admin'}>
          <span className="icon"><HomeIcon /></span>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to={'/admin/orders'}>
          <span className="icon"><OrdersIcon /></span>
            Orders
          </NavLink>
        </li>
        <li>
          <NavLink to={'/admin/inventory'}>
          <span className="icon"><InventoryIcon /></span>
            Inventory
          </NavLink>
        </li>
        <li>
          <NavLink to={'/admin/customers'}>
          <span className="icon"><CustomersIcon /></span>
            Customers
          </NavLink>
        </li>
        <li>
          <NavLink to={'/admin/discounts'}>
          <span className="icon"><DiscountsIcon /></span>
            Discounts
          </NavLink>
        </li>
        <li>
          <NavLink to={'/admin/shipping'}>
          <span className="icon"><ShippingIcon /></span>
            Shipping
          </NavLink>
        </li>
      </ul>
    )
  }
};
