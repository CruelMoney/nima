/*
 * action types
 */

export const ADD_TO_CART = 'ADD_TO_CART'
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART'

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
      console.log(data)
      if(!!data.error){
        throw data.error;
      }else{
        return data
      }
    })
    .catch((error)=>{
      throw error
    })
}