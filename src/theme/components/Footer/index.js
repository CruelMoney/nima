import React, { Component } from 'react';

class Footer extends Component {
  render() {
    return (
      <footer className="absolute pin-b w-full h-16 px-64 font-sans">
        <ul className="list-reset flex items-center justify-between flex-wrap h-full text-xs">
          <li>
            <a className="text-black hover:text-grey-dark" href="#">CONTACT</a>
          </li>
          <li>
            <a className="text-black hover:text-grey-dark" href="#">SHIPPING</a>
          </li>
          <li>
            <a className="text-black hover:text-grey-dark" href="#">TERMS & CONDITIONS</a>
          </li>
          <li>
            <a className="text-black hover:text-grey-dark" href="#">NEWSLETTER</a>
          </li>
          <li>
            <a className="text-black hover:text-grey-dark" href="https://cude.io">WEBSITE BY CUDEIO</a>
          </li>
        </ul>
      </footer>
    );
  }
}

export default Footer;