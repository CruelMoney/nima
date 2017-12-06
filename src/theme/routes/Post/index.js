import React, { Component } from 'react';
import { withRouter } from 'react-router'

class Post extends Component {
  render() {
    const { match, location, history } = this.props

    return (
      <div>You are now at {location.pathname}</div>
    );
  }
}

export default withRouter(Post);