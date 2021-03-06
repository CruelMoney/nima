import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/cart";
import * as themeActions from "../../actions/theme";
import { StripeProvider, Elements } from "react-stripe-elements";
import Bag from "./Bag";
import Information from "./Steps/Information";
import Shipping from "./Steps/Shipping";
import Payment from "./Steps/Payment";
import Confirmation from "./Steps/Confirmation";
import { configurationProvider } from "cude-cms";
import withTracker from "../../utils/withTracker";
import ReactGA from "react-ga";
import ReactPixel from "react-facebook-pixel";
import * as tracker from "../../components/WithAnalytics/ProductTracker";
import "./index.css";
import { NotificationDecider } from "../../components/Menu/Notification";
import * as priceCalc from "./priceCalculator";

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      error: null,
      shipping: {
        rateAmount: 0,
        name: "Levering"
      },
      order: {
        items: props.cart.items
      },
      paymentSuceeded: false,
      availableCountries: []
    };
  }

  componentDidMount = async () => {
    const { cart } = this.props;

    const order = priceCalc.itemsToOrder(cart.items);
    ReactGA.pageview("/checkout#step1");
    ReactPixel.track("InitiateCheckout", {
      content_ids: order.map(i => i.SKU),
      contents: order.map(i => ({
        id: i.SKU,
        quantity: i.quantity,
        item_price: i.price
      })),
      content_type: "product",
      value: priceCalc.getTotalPrice({
        items: order,
        coupon: false,
        initial: 0
      }),
      currency: "DKK"
    });
    const data = await actions.getAvailableCountries();
    this.setState({
      availableCountries: data.results
    });
  };

  continueStep = values => {
    let error = null;
    const { step } = this.state;
    if (this.props.cart.items.length === 0) {
      error = "Din kurv er tom";
    }

    this.setState(
      {
        step: error ? step : step + 1,
        error: error,
        order: {
          ...this.state.order,
          ...values,
          items: this.props.cart.items
        }
      },
      _ => window.scrollTo(0, 0)
    );
    if (!error) {
      tracker.addProducts(this.props.cart.items);
      tracker.setCheckoutStepComplete({ step: step });
      ReactGA.pageview("/checkout#step" + (step + 1).toString());
    }
  };

  continueShippingStep = values => {
    const { step } = this.state;
    tracker.setCheckoutOption({
      step: step,
      option: values.shipping.name
    });
    this.continueStep(values);
  };

  updateState = values => {
    this.setState({
      ...values
    });
  };

  stepBack = () => {
    this.setState({ step: this.state.step - 1 });
  };

  paymentSuceeded = order => {
    const { emptyCart } = this.props;
    this.setState({ paymentSuceeded: true });
    emptyCart();
  };

  addCoupon = ({ coupon }) => {
    this.setState({
      coupon: coupon
    });
  };

  render() {
    const {
      step,
      shipping,
      error,
      order,
      paymentSuceeded,
      coupon,
      availableCountries
    } = this.state;
    const { beginLoading, endLoading, cart, configuration } = this.props;
    const { items } = cart;
    const keys =
      configuration && !!configuration.APIs ? configuration.APIs.key : {};
    const { stripePublic } = !!keys ? keys : {};

    if (paymentSuceeded) {
      return <Confirmation />;
    }

    return (
      <div className="checkout-page">
        <div className="container mx-auto  mt-16">
          <hr />
          <div className="mt-10 mb-10 flex flex-col lg:flex-row">
            <article className="lg:w-1/2 w-full checkout-flow mb-12">
              <h1 className="mb-4">Checkout</h1>
              <div className="checkout-progress relative flex justify-between">
                <hr className="absolute pin-x my-2" />
                <span
                  className={`pr-3 pl-1 bg-white relative ${step === 1 &&
                    "active"}`}
                >
                  INFORMATION
                </span>
                <span
                  className={`px-3 bg-white relative ${step === 2 && "active"}`}
                >
                  FORSENDELSE
                </span>
                <span
                  className={`pl-3 bg-white relative ${step === 3 && "active"}`}
                >
                  BETALING
                </span>
              </div>
              <hr className="my-6" />

              <Information
                active={step === 1}
                onSubmit={this.continueStep}
                availableCountries={availableCountries}
              />

              <Shipping
                order={order}
                items={items}
                active={step === 2}
                stepBack={this.stepBack}
                onSubmit={this.continueShippingStep}
                onChange={this.updateState}
              />

              {// stripeprovider cant be server rendered, so only render on active step
              step === 3 ? (
                <StripeProvider apiKey={stripePublic}>
                  <Elements>
                    <Payment
                      active={step === 3}
                      stepBack={this.stepBack}
                      beginLoading={beginLoading}
                      endLoading={endLoading}
                      orderValues={order}
                      items={items}
                      coupon={coupon}
                      addCoupon={this.addCoupon}
                      onPaymentSuceeded={this.paymentSuceeded}
                    />
                  </Elements>
                </StripeProvider>
              ) : null}

              {error ? <span className="error">{error}</span> : null}
            </article>

            <article
              id="checkout-bag"
              className="lg:w-1/2 w-full lg:ml-12 checkout-bag"
            >
              <div className="lg:p-12 p-6">
                <Bag coupon={coupon} shipping={shipping} items={items} />
              </div>
            </article>
          </div>
        </div>

        <NotificationDecider page={false} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    cart: state.cart
  };
};

const mapDispatchToProps = dispatch => {
  return {
    emptyCart: () => dispatch(actions.emptyCart()),
    beginLoading: (transparent, text) =>
      dispatch(themeActions.beginLoading(transparent, text)),
    endLoading: () => dispatch(themeActions.endLoading())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  configurationProvider(
    withTracker(Checkout) // need to do it here due to some weird bug lol
  )
);
