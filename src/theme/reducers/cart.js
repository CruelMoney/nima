import {
  cart as cartActions
} from '../actions';

const initialState = {
  items: []
}

function cart(state = initialState, action) {
  switch (action.type) {
    case cartActions.ADD_TO_CART:
      return {
        items: [...state.items, action.item]
      }
    case cartActions.REMOVE_FROM_CART:
      let removed = false;
      return {
        items: state.items.filter(item => {
          if(!removed && item._id === action.item._id){
            removed = true;
            return false;
          }
          return true;
        })
      }
    default:
      return state
  }
}

export default cart;