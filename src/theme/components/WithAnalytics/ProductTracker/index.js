import ReactGA from 'react-ga'

const addProduct = ({product, quantity}) =>
  ReactGA.plugin.execute(
    'ec',
    'addProduct',
    {
      id: product._id,
      name: product.title,
      price: product.price,
      quantity: quantity,
    }
  );

const addProducts = products => {
  const aggregated = products.reduce((acc, p) => {
      return {
        ...acc,
        [p._id]: {
          product: p,
          quantity: p._id in acc ? acc[[p._id]].quantity+1 : 1
        }
      }
  }, {});
  Object.values(aggregated).forEach(addProduct);
}

const click = () => {
  ReactGA.plugin.execute(
    'ec',
    'setAction',
    'click',
    {
      list: "Overview"
    }
  );
  ReactGA.event({
    category: 'UX',
    action: 'Click'
  });
}

const detailView = () => {
  ReactGA.plugin.execute(
    'ec',
    'setAction',
    'detail'
  );
}

const addToCart = () => {
  ReactGA.plugin.execute(
    'ec',
    'setAction',
    'add'
  );
}

const removeFromCart = () => {
  ReactGA.plugin.execute(
    'ec',
    'setAction',
    'remove'
  );
}

const setCheckoutStepComplete = (options) => {
  ReactGA.plugin.execute(
    'ec',
    'setAction',
    'checkout',
    options
  );
}
const setCheckoutOption = (options) => {
  ReactGA.plugin.execute(
    'ec',
    'setAction',
    'checkout_option',
    options
  );
}

const purchase = (order) => {
  ReactGA.plugin.execute(
    'ec',
    'setAction',
    'purchase',
    {
      id: order._id,
      revenue: order.total_price,
      tax: order.total_price*0.2,
      shipping: order.shipping.price,
      coupon: !!order.coupon_code ? order.coupon_code : null,
      step: 3
    }
  );
}

export {
  addProduct,
  addProducts,
  click,
  detailView,
  addToCart,
  removeFromCart,
  setCheckoutStepComplete,
  setCheckoutOption,
  purchase
}