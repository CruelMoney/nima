import ReactGA from 'react-ga'
import ReactPixel from 'react-facebook-pixel';
 
/*
 * action types
 */

export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const EMPTY_CART = 'EMPTY_CART';

/*
 * other constants
 */


/*
 * action creators
 */

export function addToCart(product) {
  ReactGA.event({
    category: 'User',
    action: 'Add to cart'
  });
  ReactPixel.track('AddToCart');
  return { type: ADD_TO_CART, item:product }
}

export function removeFromCart(product) {
  ReactGA.event({
    category: 'User',
    action: 'Remove from cart'
  });
  return { type: REMOVE_FROM_CART, item:product }
}

export function emptyCart() {
  return { type: EMPTY_CART }
}

export function checkout(order) {
  return fetch('/api/checkout',{
      method: 'POST',
      credentials: 'include',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(order)
    })
    .then(result => result.json())
    .then(data => {
      if(!!data.error){
        throw data.error;
      }else{
        ReactGA.event({
          category: 'User',
          action: 'Checkout complete',
          value: order.total_price
        });
        ReactPixel.track(
          'Purchase', {
          value: 1,
          currency: 'DKK',
        })
        return data;
      }
    })
    .catch((error)=>{
      throw error
    })
}

export function getCoupon({coupon_code}) {
  return fetch('/api/coupon/'+coupon_code,{
      method: 'GET',
      credentials: 'include',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    .then(result => result.json())
    .then(data => {
      if(!!data.error){
        throw data.error;
      }else{
        ReactGA.event({
          category: 'User',
          action: 'Entered coupon'
        });
        return JSON.parse(data);
      }
    })
    .catch((error)=>{
      throw error
    })
}