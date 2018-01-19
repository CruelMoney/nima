import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/cart'
import * as themeActions from '../../actions/theme'
import {
  StripeProvider,
  Elements} from 'react-stripe-elements';
import Bag from './Bag';
import Information from './Steps/Information';
import Shipping from './Steps/Shipping';
import Payment from './Steps/Payment';
import Confirmation from './Steps/Confirmation';
import {configurationProvider} from 'cude-cms';
import './index.css';


class Checkout extends Component {
  state={
    step: 1,
    error: null,
    shipping: {
      price: 0,
      name: "Delivery"
    },
    order: {},
    paymentSuceeded: false
  }
  
  continueStep = (values) => {
    let error = null;

    if(this.props.cart.items.length === 0){
      error = "Your bag is empty";
    }

    this.setState({
      step: error ? this.state.step : this.state.step+1,
      error: error,
      order: {
        ...this.state.order,
        ...values,
        items: this.props.cart.items
      }
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

  paymentSuceeded = (order) => {
    const { emptyCart } = this.props;
    this.setState({paymentSuceeded: true});
    emptyCart();
  }

  render() {
    const { step, shipping, error, order, paymentSuceeded} =  this.state;
    const { beginLoading, endLoading, cart, configuration } = this.props;
    const { items } = cart;
    const keys = !!configuration.APIs ? configuration.APIs.key : { };
    const { stripePublic } = keys;

    if(paymentSuceeded){
      return <Confirmation />
    }

    return (
      <div className="checkout-page">
      <div className="container mx-auto  mt-16">
        <hr/>
        <div className="mt-10 mb-16 flex flex-col lg:flex-row-reverse">

          <article className="lg:w-1/2 w-full mb-12 lg:ml-12 checkout-bag">
            <div className="lg:p-12 p-6">
              <Bag 
                shipping={shipping}
                items={items}
              />
            </div>
          </article>

          <article className="lg:w-1/2 w-full checkout-flow ">
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
            

            { // stripeprovider cant be server rendered, so only render on active step
              step === 3 ?
              <StripeProvider apiKey={stripePublic}>
              <Elements>
                <Payment 
                active={step === 3} 
                stepBack={this.stepBack} 
                beginLoading={beginLoading}
                endLoading={endLoading}
                orderValues={order} 
                items={items}
                onPaymentSuceeded={this.paymentSuceeded}
                />
              </ Elements>
            </ StripeProvider> 
              : null
            }
         

            {error?
            <span className="error">
              {error}
            </span>
            : null}

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

const mapDispatchToProps = (dispatch) => {
  return {
    emptyCart: () => dispatch(actions.emptyCart()),
    beginLoading: (transparent, text) => dispatch(themeActions.beginLoading(transparent, text)),
    endLoading: () => dispatch(themeActions.endLoading())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  configurationProvider(Checkout)
)