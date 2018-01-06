import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/theme'
import { checkout } from '../../../actions/cart'
import LoadingPage from '../../Loading';
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
    loading: false
  }

  submit = () => {
    const {orderValues} = this.props;
    const startTime = new Date().getTime(); 

    this.setState({
      error: null,
      loading: true
    });

    const { name } = this.form.getValues();

    this.props.stripe.createToken({name})
    .then(({token, error}) => {
      if(error){ 
        console.log(error)
        throw error;
      }
      else{
        return checkout({
          ...orderValues,
          card_token: token, 
          items: itemsToOrder(orderValues.items),
        });
      }
    })
    .then(order => {
      const dur = new Date().getTime() - startTime;
      const delay = (dur < 3000) ? 3000 - dur : 0;
      setTimeout(() => {
        this.setState({
          loading: false
        });
      }, delay);
    })
    .catch(error => {
      const dur = new Date().getTime() - startTime;
      const delay = (dur < 3000) ? 3000 - dur : 0;
      setTimeout(() => {
        this.setState({
          error: error.message || error,
          loading: false
        });
      }, delay);
    });
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
      <div>
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
      <LoadingPage 
        transparent
        active={this.state.loading} 
      />
      </div>

    );
  }
};


export default injectStripe(Payment);