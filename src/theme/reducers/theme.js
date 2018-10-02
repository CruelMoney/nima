import { theme as actions } from "../actions";

const initialState = {
	loading: false,
	transparentLoading: false,
	text: false,
	showNewsletter: false,
	notificationActive: false
};

function theme(state = initialState, action) {
	switch (action.type) {
		case actions.BEGIN_LOADING:
			return {
				loading: true,
				transparentLoading: !!action.transparentLoading,
				loadingText: action.text
			};
		case actions.END_LOADING:
			return {
				...state,
				loading: false
			};
		case actions.SHOW_NEWSLETTER:
			return {
				...state,
				showNewsletter: true
			};
		case actions.HIDE_NEWSLETTER:
			return {
				...state,
				showNewsletter: false
			};
		case actions.TOGGLE_NOTIFICATION:
			return {
				...state,
				notificationActive: action.value
			};
		default:
			return state;
	}
}

export default theme;
