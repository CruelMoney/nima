import React, { Component } from "react";
import Form from "react-validation/build/form";
import {
  injectStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement
} from "react-stripe-elements";
import throttle from "lodash.throttle";
import { checkout, getCoupon } from "../../../actions/cart";
import SubmitButton from "../../../components/SubmitButton";
import Input from "../../../components/Input";
import * as vl from "../../../utils/validators";
import * as priceCalc from "../priceCalculator";

const inputStyle = {
  style: {
    base: {
      fontSize: "16px",
      letterSpacing: "1px",
      fontFamily: "PierSans-Regular, sans-serif"
    },
    invalid: {
      color: "#8D0E20"
    }
  }
};

class Payment extends Component {
  constructor(props) {
    super(props);
    const { coupon } = props;

    this.state = {
      error: null,
      couponError: null,
      loading: false,
      coupon
    };
  }

  submit = async () => {
    const {
      orderValues,
      onPaymentSuceeded,
      beginLoading,
      items,
      stripe
    } = this.props;
    const { coupon } = this.state;
    const startTime = new Date().getTime();

    beginLoading(false, "Bestiller");

    this.setState({
      error: null,
      loading: true
    });

    const { name } = this.form.getValues();
    const totalPrice = priceCalc.getTotalPrice({
      items,
      coupon,
      initial: orderValues.shipping.rateAmount
    });

    try {
      // create paymentmethod
      const { paymentMethod, error } = await stripe.createPaymentMethod(
        "card",
        {
          billing_details: { name }
        }
      );

      if (error) {
        throw error;
      }

      // first checkout
      const order = await checkout({
        ...orderValues,
        coupon_code: !!coupon ? coupon.code : false,
        total_price: totalPrice,
        payment_method_id: paymentMethod.id,
        items: priceCalc.itemsToOrder(items)
      });

      let {
        paymentIntent,
        requires_action,
        payment_intent_client_secret
      } = order;

      if (order.error) {
        throw order.error;
      }

      if (requires_action) {
        // Use Stripe.js to handle required card action
        const result = await stripe.handleCardAction(
          payment_intent_client_secret
        );
        if (result.error) {
          throw result.error;
        }
      }

      // The card action has been handled
      // The PaymentIntent can be confirmed again on the server
      const order2 = await checkout({
        ...orderValues,
        coupon_code: !!coupon ? coupon.code : false,
        total_price: totalPrice,
        paymentIntent,
        items: priceCalc.itemsToOrder(items)
      });

      if (order2.error) {
        throw order2.error;
      }

      this.handleCheckout(false, startTime);
      onPaymentSuceeded && onPaymentSuceeded(order);
    } catch (error) {
      console.log({ error });
      const err = error.message || error;
      this.handleCheckout(err, startTime);
    }
  };

  handleCheckout = (error, startTime) => {
    const dur = new Date().getTime() - startTime;
    const delay = dur < 3000 ? 3000 - dur : 0;
    setTimeout(() => {
      this.setState({
        error,
        loading: false
      });
      this.props.endLoading();
    }, delay);
  };

  back = e => {
    e.preventDefault();
    this.props.stepBack && this.props.stepBack();
  };

  onErrors = () => {
    this.form.validateAll();
  };

  checkCoupon = throttle(event => {
    const code = event.target.value;

    if (!code) {
      this.setState({
        couponError: null,
        coupon: null
      });
      this.props.addCoupon && this.props.addCoupon({ coupon: null });
      return null;
    }
    getCoupon({
      coupon_code: code,
      coupon: null
    })
      .then(coupon => {
        this.props.addCoupon && this.props.addCoupon({ coupon });
        this.setState({
          couponError: null,
          coupon
        });
        this.scrollToBag();
      })
      .catch(err => {
        this.props.addCoupon && this.props.addCoupon({ coupon: null });
        this.setState({
          couponError: err,
          coupon: null
        });
      });
  }, 1000);

  scrollToBag = () => {
    const x = window.matchMedia("(max-width: 462px)");

    if (x.matches) {
      const scrolltop = document.body.scrollHeight;
      window.scroll({ top: scrolltop, left: 0, behavior: "smooth" });
    }
  };

  render() {
    const { error, couponError, loading } = this.state;
    const { active, coupon } = this.props;
    const couponcode = coupon ? coupon.code : null;

    return (
      <Form
        className={active ? "active" : ""}
        ref={c => {
          this.form = c;
        }}
      >
        <div className="flex">
          <Input
            value={couponcode}
            onChange={this.checkCoupon}
            name="coupon"
            type="text"
            placeholder="Har du rabatkode?"
            className="w-full"
          />
        </div>
        <div className="flex mb-4">
          <span className="error">{couponError}</span>
        </div>
        <hr className="my-6" />
        <div className="flex mb-4">
          <Input
            validations={[vl.required]}
            name="name"
            type="text"
            placeholder="Kortholder navn"
            className="w-full"
          />
        </div>

        <div className="flex mt-2">
          <div className="w-full input-box">
            <CardNumberElement placeholder="Kort nummer" {...inputStyle} />
          </div>
        </div>
        <div className="flex my-4">
          <div className="w-1/2 mr-2 input-box">
            <CardCVCElement placeholder="CVC" {...inputStyle} />
          </div>
          <div className="w-1/2 ml-2 input-box">
            <CardExpiryElement placeholder="Kort udløb MM/YY" {...inputStyle} />
          </div>
        </div>

        <hr className="my-6 mobile-hide" />

        <div className="flex">
          <button
            onClick={this.back}
            className="w-full border-2 p-3 border-black mr-2"
          >
            TILBAGE
          </button>
          <SubmitButton
            disabled={loading}
            onClick={this.submit}
            onErrors={this.onErrors}
            className="w-full border-2 p-3 border-black ml-2"
          >
            {loading ? "BESTILLER..." : "BESTIL"}
          </SubmitButton>
        </div>
        <div className="flex my-2">
          <span className="error w-full">{error}</span>
        </div>
      </Form>
    );
  }
}

export default injectStripe(Payment);
