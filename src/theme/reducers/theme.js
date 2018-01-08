import {
  theme as actions
} from '../actions';

const initialState = {
  loading: false,
  transparentLoading: false,
  text: false
}

function theme(state = initialState, action) {
  switch (action.type) {
    case actions.BEGIN_LOADING:
      return {
        loading: true,
        transparentLoading: !!action.transparentLoading,
        loadingText: action.text
      }
    case actions.END_LOADING:
      return {
        ...state,
        loading: false
      }
    default:
      return state
  }
}

export default theme;