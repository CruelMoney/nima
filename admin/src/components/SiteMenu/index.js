import React, { Component } from 'react';

export default class SiteMenu extends Component {
  render() {
    const domain = process.env.PUBLIC_URL;

    return (
      <ul className="menu">
        <li>
          <a href={domain}>Shop</a>
        </li>
        <li>
          <a href={domain+"/keystone"}>CMS</a>
        </li>
        <li>
          <a href={domain+"/logout"}>Logout</a>
        </li>
      </ul>
    )
  }
};
