
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
  return { type: ADD_TO_CART, item:product }
}

export function removeFromCart(product) {
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
        return JSON.parse(data);
      }
    })
    .catch((error)=>{
      throw error
    })
}