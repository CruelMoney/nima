import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/theme'
import { checkout } from '../../../actions/cart'
import Form from 'react-validation/build/form';
import SubmitButton from '../../../components/SubmitButton';
import Input from '../../../components/Input';
import {
  injectStripe,
  CardNumberElement, 
  CardExpiryElement,
  CardCVCElement,
  } from 'react-stripe-elements';
import * as vl from '../../../utils/validators';

const itemsToOrder = (items) => {
    const itemsView = {};

    for (const item of items) {
      const key = item.title+item.variation;
      const viewItem = itemsView[key];
      itemsView[key] = !!viewItem ? {...viewItem, amount: viewItem.amount + 1} : { ...item, amount: 1 };
    }

    return Object.values(itemsView);
}

const getTotalPrice = (items) => {
  return items.reduce((acc, i)=>acc+i.price, 0);
}

const inputStyle = {
    style: {
      base: {
        fontSize: '16px',
        letterSpacing: '1px',
        fontFamily: 'PierSans-Regular, sans-serif'
      },
      invalid: {
        color: '#8D0E20',
      },
    },
};

class Payment extends Component {
  state = {
    error: null,
  }

  submit = () => {
    const {orderValues, onPaymentSuceeded, beginLoading, items} = this.props;
    const startTime = new Date().getTime(); 
    
    beginLoading();

    this.setState({
      error: null,
    });


    const { name } = this.form.getValues();
    const totalPrice = getTotalPrice(items) + orderValues.shipping.price;

    this.props.stripe.createToken({name})
    .then(({token, error}) => {
      if(error){ 
        console.log(error)
        throw error;
      }
      else{
        return checkout({
          ...orderValues,
          total_price: totalPrice,
          card_token: "tok_visa", 
          items: itemsToOrder(items),
        });
      }
    })
    .then(order => {
      this.handleCheckout(false, startTime);
      onPaymentSuceeded && onPaymentSuceeded(order);
    })
    .catch(error => {
      const err = error.message || error;
      this.handleCheckout(err, startTime);
    });
  }

  handleCheckout = (error, startTime) => {
    const dur = new Date().getTime() - startTime;
    const delay = (dur < 3000) ? 3000 - dur : 0;
    setTimeout(() => {
      this.setState({
        error: error
      });
      this.props.endLoading();
    }, delay);
  } 

  back = (e) => {
    e.preventDefault();
    this.props.stepBack && this.props.stepBack();
  }

  onErrors = () => {
    this.form.validateAll();
  }

  render() {
    const { error } = this.state; 
    const { active, stepBack } = this.props;

    return (
        <Form
          className={!!active ? 'active' : ''}
          ref={c => { this.form = c }}
        >     
              <div className="flex mb-4">
                    <Input validations={[vl.required]} name="name" type="text" placeholder="Card owner name" className="w-full"/>
                  </div>
                  
                <div className="flex mt-2">
                  <div className="w-full input-box">
                      <CardNumberElement
                        placeholder={"Card number"}
                       {...inputStyle}
                      />
                  </div>
                </div>
                <div className="flex my-4">
                  <div className="w-1/2 mr-2 input-box">
                    <CardCVCElement
                        placeholder={"CVC"}
                       {...inputStyle}
                      />
                  </div>
                  <div className="w-1/2 ml-2 input-box">
                    <CardExpiryElement
                        placeholder={"Card expiry MM/YY"}
                       {...inputStyle}
                      />
                  </div>
                </div>
           
            <hr className="my-6" />

            <div className="flex">
            <button
                onClick={this.back}
                className={`w-full border-2 p-3 border-black mr-2`}>
                  BACK
              </button>
              <SubmitButton
                onClick={this.submit}
                onErrors={this.onErrors}
                className={`w-full border-2 p-3 border-black ml-2`}>
                  PLACE ORDER
              </SubmitButton> 
            </div>
            <div className="flex my-2">
                <span className="error w-full">
                {error}
                </span>
            </div>
      </Form>
    );
  }
};


export default injectStripe(Payment);