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
    step: 1
  }

  render() {
    const { step } =  this.state;
    const { items } = this.props.cart;
    const disabled = items.length === 0

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
              <span className={`pr-3 pl-1 bg-white relative ${step === 1 && "active"}`}>INFORMATION</span>
              <span className={`px-3 bg-white relative ${step === 2 && "active"}`}>SHIPPING</span>
              <span className={`pl-3 bg-white relative ${step === 3 && "active"}`}>PAYMENT</span>
            </div>
            <hr className="my-6" />

            { step === 1 && <Information />}
            { step === 2 && <Shipping />}
            { step === 3 && <Payment />}


            <hr className="my-6" />

            <div className="flex">
            {step > 1 ? 
               <button 
               onClick={()=>this.setState({step: step-1})}
               className={`w-1/2 border-2 p-3 border-black mr-2`}>
                 BACK
               </button>
              : null}

            <button
            disabled={disabled}
            onClick={()=>this.setState({step: step+1})}
            className={`${step === 1 ? "w-full" : 'w-1/2 ml-2'} border-2 p-3 border-black`}>
              {step === 3 ? "PLACE ORDER" : "CONTINUE"}
            </button>
            </div>
          </article>

          <article className="w-1/2 ml-12 checkout-bag">
            <div className="p-12">
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