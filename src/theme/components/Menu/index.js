import React, {Component} from 'react';
import {fetcher} from 'cude-cms'
import {NavLink, Link} from 'react-router-dom';
import Logo from '../Logo';
import Bag from '../Bag'
import './index.css';
import Socials from './Socials';

class Menu extends Component {
  render() {
    const {data, indicateActive} = this.props;
    const {results} = data;
    const menu = results && results.find(menu => menu.name === "Header menu");
    const menuItems = menu
      ? menu.pages
      : [];

    return (
      <div className={`header-menu fixed pin-t w-full`}>
        <div className="container mx-auto h-16 flex">
          <div className="w-16 h-full logo relative">
            <Link to="/">
              <Logo color={"#111111"} className="h-full w-full"/>
              <span className="logo-text">
              nimacph.
            </span>
            </Link>
           
          </div>
          <nav className={`${indicateActive ? "indicate-active" : ""} w-full h-full`}>
            <ul
              className="list-reset flex items-center justify-center flex-wrap w-full h-full">
              {!!menuItems && !!menuItems.map
                ? menuItems.map(link => {
                  return (
                    <li key={`menu-link-${link.slug}`} className="mx-2 sm:mx-4">
                      <NavLink to={`/${link.slug}`} activeClassName="active" className="text-black">
                        {link.title}
                      </NavLink>
                    </li>
                  )
                })
                : null}

                <li key={`menu-link-social`} className="mx-2 sm:mx-4">
                  <Socials />
                </li>
            </ul>
          </nav>
          <div className="w-16 flex items-center justify-center">
            <Bag />
          </div>
        </div>
      </div>
    );
  }
}

export default fetcher(Menu, '/api/menus');