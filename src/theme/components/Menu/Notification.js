import React, { PureComponent } from "react";
import { connect } from "react-redux";
import * as themeActions from "../../actions/theme";

function mapStateToProps(state) {
	return {
		active: state.theme.notificationActive
	};
}

class Notification extends PureComponent {
	render() {
		const { active, children } = this.props;
		return (
			<div className={`notification ${active ? "active" : ""}`}>{children}</div>
		);
	}
}

export default connect(mapStateToProps)(Notification);

class DumbNotificationDecider extends PureComponent {
	componentDidMount() {
		const { page, toggleNotification } = this.props;
		let show = false;
		if (!page) {
			show = false;
		} else if (page.__t === "Overview") {
			show = true;
		} else if (page.__t === "Product") {
			show = true;
		}

		toggleNotification(show);
	}

	render() {
		return null;
	}
}

const mapDispatchToProps = dispatch => ({
	toggleNotification: value => dispatch(themeActions.toggleNotification(value))
});

const NotificationDecider = connect(
	state => state,
	mapDispatchToProps
)(DumbNotificationDecider);

export { NotificationDecider };
