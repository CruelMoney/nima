import React, { Component } from 'react';
let domain = process.env.REACT_APP_PUBLIC_URL;
domain = !!domain ? domain : 'https://nimacph.dk';

export default class SiteMenu extends Component {
  render() {
    return (
      <ul className="menu">
        <li>
          <a href={domain}>Shop</a>
        </li>
        <li>
          <a href={domain+"/keystone"}>CMS</a>
        </li>
        <li>
          <a href={domain+"/keystone/signout"}>Logout</a>
        </li>
      </ul>
    )
  }
};
