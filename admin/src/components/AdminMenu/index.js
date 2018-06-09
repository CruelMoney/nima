import React, { Component } from 'react';
import {Link} from 'react-router-dom';

export default class AdminMenu extends Component {
  render() {
    return (
      <ul className="menu">
        <li>
          <Link to={'/admin'}>Home</Link>
        </li>
        <li>
          <Link to={'/admin/orders'}>Orders</Link>
        </li>
        <li>
          <Link to={'/admin/inventory'}>Inventory</Link>
        </li>
      </ul>
    )
  }
};
