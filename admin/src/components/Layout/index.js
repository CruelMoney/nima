import React, { Component } from 'react';
import SiteMenu from '../SiteMenu';
import AdminMenu from '../AdminMenu';
import './index.css';


export default class Layout extends Component {
  render() {
    return (
      <div className="layout">
        <header>
          <span>
            NIMA
          </span>
          <SiteMenu />
        </header>
        <section>
          <AdminMenu/>
        </section>
        <main>
          {this.props.children}
        </main>
      </div>
    )
  }
};