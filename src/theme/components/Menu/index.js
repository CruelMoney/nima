import React, {Component} from 'react';
import {fetcher} from 'cude-cms'
import {Link} from 'react-router-dom';
import Logo from '../Logo';
import './index.css';

class Menu extends Component {
  render() {
    const {data} = this.props;
    const {results} = data;
    const menu = results && results.find(menu => menu.name === "Header menu");
    const menuItems = menu
      ? menu.pages
      : [];

    return (
      <div className="header-menu absolute pin-t w-full ">
        <div className="container mx-auto h-16 flex">
          <div className="w-16 h-full logo">
            <Link to="/">
              <Logo color={"#111111"} className="h-full w-full"/>
            </Link>
          </div>
          <nav className="w-full h-full">
            <ul
              className="list-reset flex items-center justify-around flex-wrap w-full h-full">
              {!!menuItems && !!menuItems.map
                ? menuItems.map(link => {
                  return (
                    <li key={`menu-link-${link.slug}`}>
                      <Link to={`/${link.slug}`} className="text-black hover:text-grey-dark">
                        {link.title}
                      </Link>
                    </li>
                  )
                })
                : null}

            </ul>
          </nav>
          <div className="w-16 bag-button"></div>
        </div>
      </div>
    );
  }
}

export default fetcher(Menu, '/api/menus');