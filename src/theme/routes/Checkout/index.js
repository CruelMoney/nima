import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import Bag from './Bag';
import './index.css';

class Checkout extends Component {

  render() {
    const { items } = this.props.cart

    return (
      <div className="">
      <div className="container mx-auto  mt-16">
        <hr/>
        <div className="mt-10 mb-16 flex">
          
          <article className="w-1/2">
            <h1 className="mb-4">
              Checkout
            </h1>
            <div className="checkout-progress relative flex justify-between">
              <hr className="absolute pin-x my-2"/>
              <span className="pr-3 pl-1 bg-white relative active">INFORMATION</span>
              <span className="px-3 bg-white relative">SHIPPING</span>
              <span className="pl-3 bg-white relative">PAYMENT</span>
            </div>
            <hr className="my-6" />
            <div className="flex">
              <input type="text" placeholder="First name" className="w-1/2 mr-2"/>
              <input type="text" placeholder="Last name" className="w-1/2 ml-2"/>
            </div>
            <div className="flex my-4">
              <input type="email" placeholder="Email" className="w-1/2 mr-2"/>
              <input type="tel" placeholder="Phone" className="w-1/2 ml-2"/>
            </div>
            <div className="flex">
              <p className="m-0">
                <input type="checkbox" id="subscribe" />
                <label for="subscribe">Subscribe to newsletter</label>
              </p>
            </div>
            <div className="flex my-4">
              <input type="address" placeholder="Address" className="w-full"/>
            </div>
            <div className="flex my-4">
              <input type="city" placeholder="City" className="w-1/2 mr-2"/>
              <input type="zip" placeholder="Zip code" className="w-1/2 ml-2"/>
            </div>
            <div className="flex my-4">
              <input type="country" placeholder="Country" className="w-full"/>
            </div>
          </article>

          <article className="w-1/2 ml-12 checkout-bag">
            <div className="p-6">
              <Bag 
                items={items}
              />
            </div>
          </article>
         
        </div>
      </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart
  }
}

export default connect(mapStateToProps)(Checkout)