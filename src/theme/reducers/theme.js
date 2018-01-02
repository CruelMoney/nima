import {
  theme as actions
} from '../actions';

const initialState = {
  loading: false
}

function theme(state = initialState, action) {
  switch (action.type) {
    case actions.BEGIN_LOADING:
      return {
        loading: true
      }
    case actions.END_LOADING:
      return {
        loading: false
      }
    default:
      return state
  }
}

export default theme;