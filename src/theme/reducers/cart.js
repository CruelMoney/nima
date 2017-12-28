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
      return {
        items: state.items.filter(item => item._id !== action.item._id)
      }
    default:
      return state
  }
}

export default cart;