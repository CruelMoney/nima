import React, { Component } from 'react';
import { checkout, getCoupon } from '../../../actions/cart'
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
import throttle from 'lodash.throttle';
import * as priceCalc from '../priceCalculator';
import scrolltoElement from 'scrollto-element'

const itemsToOrder = (items) => {
    const itemsView = {};

    for (const item of items) {
      const key = item.title+item.variation;
      const viewItem = itemsView[key];
      itemsView[key] = !!viewItem ? {...viewItem, quantity: viewItem.quantity + 1} : { ...item, quantity: 1 };
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
    couponError: null,
    loading: false
  }

  constructor(props){
    super(props);
    const { coupon } = props;

    this.setState({
      coupon: coupon
    })
  }

  submit = () => {
    const {orderValues, onPaymentSuceeded, beginLoading, items} = this.props;
    const { coupon } = this.state;
    const startTime = new Date().getTime(); 
    
    beginLoading(false, "PLACING ORDER");

    this.setState({
      error: null,
      loading: true
    });


    const { name } = this.form.getValues();
    const totalPrice = priceCalc.getTotalPrice({
      items,
      coupon: coupon,
      initial: orderValues.shipping.price
    });

    this.props.stripe.createToken({name})
    .then(({token, error}) => {
      if(error){ 
        console.log(error)
        throw error;
      }
      else{
        return checkout({
          ...orderValues,
          coupon_code: !!coupon ? coupon.code : false,
          total_price: totalPrice,
          card_token: token.id,
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
        error: error,
        loading: false
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

  checkCoupon = throttle((event) => {
    let code = event.target.value;

    if(!code){
      this.setState({
        couponError: null,
        coupon: null
      });
      this.props.addCoupon && this.props.addCoupon({coupon: null});
      return null;
    };
    getCoupon({
      coupon_code: code,
      coupon: null
    })
    .then(coupon => {
      this.props.addCoupon && this.props.addCoupon({coupon: coupon});
      this.setState({
        couponError: null,
        coupon: coupon
      });
      this.scrollToBag();
    })
    .catch(err => {
      this.props.addCoupon && this.props.addCoupon({coupon: null});
      this.setState({
        couponError: err,
        coupon: null
      });
    });
  }, 1000)

  scrollToBag = () => {
    const x = window.matchMedia("(max-width: 462px)")

    if(x.matches){
      const scrolltop = document.body.scrollHeight;
      window.scroll({top: scrolltop, left:0, behavior: "smooth"});
    }
  }

  render() {
    const { error, couponError, loading } = this.state; 
    const { active, coupon } = this.props;
    const couponcode = !!coupon ? coupon.code : null;

    return ( 
        <Form
          className={!!active ? 'active' : ''}
          ref={c => { this.form = c }}
        >     

              <div className="flex">
                    <Input value={couponcode} onChange={this.checkCoupon} name="coupon" type="text" placeholder="Have coupon code?" className="w-full" />   
                </div>
                <div className="flex mb-4">
                <span className="error">{couponError}</span>
                </div>
                <hr className="my-6" />
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
           
            <hr className="my-6 mobile-hide" />

            <div className="flex">
            <button
                onClick={this.back}
                className={`w-full border-2 p-3 border-black mr-2`}>
                  BACK
              </button>
              <SubmitButton
                disabled={loading}
                onClick={this.submit}
                onErrors={this.onErrors}
                className={`w-full border-2 p-3 border-black ml-2`}>
                  {loading ? "ORDERING..." : "PLACE ORDER"}
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


export default injectStripe(Payment)
