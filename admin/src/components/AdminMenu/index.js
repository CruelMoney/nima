import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import HomeIcon from '../../assets/icons/Home';
import InventoryIcon from '../../assets/icons/Inventory';
import OrdersIcon from '../../assets/icons/Orders';

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
      </ul>
    )
  }
};
