import {
  theme as actions
} from '../actions';

const initialState = {
  loading: false,
  transparentLoading: false
}

function theme(state = initialState, action) {
  switch (action.type) {
    case actions.BEGIN_LOADING:
      return {
        loading: true,
        transparentLoading: action.transparentLoading
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