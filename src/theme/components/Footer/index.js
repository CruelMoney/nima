import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { fetcher } from 'cude-cms'

class Footer extends Component {
  render() {
    const { data } = this.props;
    return (
      <footer className="absolute pin-b w-full ">
        <div className="container mx-auto px-64 font-sans h-16">
          <ul className="list-reset flex items-center justify-between flex-wrap h-full text-xs">

            { !!data && !!data.map ?
              this.props.data.map(link=>{
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

export default fetcher(Footer, '/api/pages');