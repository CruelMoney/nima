import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { fetcher } from 'cude-cms'
import './index.css';

class Footer extends Component {
  toggleNewsletter = (e) =>{
    e.preventDefault();


    const { 
      showNewsletterActive,
      showNewsletter,
      hideNewsletter
    } = this.props;

    if(showNewsletterActive){
      hideNewsletter();
    }else{
      showNewsletter();
    }
  }

  render() {
    const { data } = this.props;
    const { results } = data;
    const menu = results && results.find(menu => menu.name === "Footer menu");
    const menuItems = menu ? menu.pages : [];
    return (
      <footer className="relative lg:absolute pin-b w-full mb-8 lg:m-0">
        <div className="container mx-auto font-sans lg:h-16 ">
          <hr className="mobile-only mb-6"/>
          <ul className="list-reset flex flex-col lg:flex-row items-center justify-center flex-wrap h-full text-xs">

            { !!menuItems && !!menuItems.map ?
              menuItems.map(link=>{
                return(
                  <li 
                  className={`lg:mx-4 w-full lg:w-auto text-center`}
                  key={`footer-link-${link.slug}`}>
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

              <li 
              className={`lg:mx-4 w-full lg:w-auto text-center`}>
                <a 
                onClick={this.toggleNewsletter}
                className="text-black hover:text-grey-dark">Nyhedsbrev</a>
              </li>
            {/* <li className="lg:mx-4 w-full lg:w-auto text-center">
              <a className="text-black hover:text-grey-dark" href="https://cude.io">WEBSITE BY CUDEIO</a>
            </li> */}
          </ul>
        </div>
            

      </footer>
    );
  }
}

export default fetcher(Footer, '/api/menus');