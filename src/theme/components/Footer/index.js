import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { fetcher } from 'cude-cms'
import './index.css';

class Footer extends Component {
  render() {
    const { data } = this.props;
    const { results } = data;
    const menu = results && results.find(menu => menu.name === "Footer menu");
    const menuItems = menu ? menu.pages : [];
    return (
      <footer className="absolute pin-b w-full ">
        <div className="container mx-auto px-64 font-sans h-16">
          <ul className="list-reset flex items-center justify-between flex-wrap h-full text-xs">

            { !!menuItems && !!menuItems.map ?
              menuItems.map(link=>{
                return(
                  <li key={`footer-link-${link.slug}`}>
                    <Link 
                    to={`/${link.slug}`}
                    className="text-black hover:text-grey-dark"
                    >
                    {link.title}
                    </Link>
                  </li>
                )
              })
             : null}
            <li>
              <a className="text-black hover:text-grey-dark" href="https://cude.io">WEBSITE BY CUDEIO</a>
            </li>
          </ul>
        </div>
      </footer>
    );
  }
}

export default fetcher(Footer, '/api/menus');