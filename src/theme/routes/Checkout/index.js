import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import Bag from './Bag';
import './index.css';
import Information from './Steps/Information';
import Shipping from './Steps/Shipping';
import Payment from './Steps/Payment';

class Checkout extends Component {
  state={
    step: 1,
    error: null,
    shipping: {
      price: 0,
      name: "Delivery"
    }
  }
  
  continueStep = (values) => {
    let error = null;

    if(this.props.cart.items.length === 0){
      error = "Your bag is empty";
    }

    this.setState({
      step: error ? this.state.step : this.state.step+1,
      error: error,
      ...values
    });
  }

  updateState = (values) => {
    this.setState({
      ...values
    });
  }

  stepBack = () => {
    this.setState({step: this.state.step-1});
  }

  render() {
    const { step, shipping, error} =  this.state;
    const { items } = this.props.cart;
    const disabled = items.length === 0

    return (
      <div className="container mx-auto  mt-16">
        <hr/>
        <div className="mt-10 mb-16 flex">
          
          <article className="w-1/2 checkout-flow">
            <h1 className="mb-4">
              Checkout
            </h1>
            <div className="checkout-progress relative flex justify-between">
              <hr className="absolute pin-x my-2"/>
              <span className={`pr-3 pl-1 bg-white relative ${step === 1 && "active"}`}>INFORMATION</span>
              <span className={`px-3 bg-white relative ${step === 2 && "active"}`}>SHIPPING</span>
              <span className={`pl-3 bg-white relative ${step === 3 && "active"}`}>PAYMENT</span>
            </div>
            <hr className="my-6" />

            <Information active={step === 1} onSubmit={this.continueStep} />
            <Shipping active={step === 2} stepBack={this.stepBack} onSubmit={this.continueStep} onChange={this.updateState}/>
            <Payment active={step === 3}  stepBack={this.stepBack} />


            {error?
            <span className="error">
              {error}
            </span>
            : null}

          </article>

          <article className="w-1/2 ml-12 checkout-bag">
            <div className="p-12">
              <Bag 
                shipping={shipping}
                items={items}
              />
            </div>
          </article>
         
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