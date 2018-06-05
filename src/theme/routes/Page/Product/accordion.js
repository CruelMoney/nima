import React, { Component } from 'react';

export default class accordion extends Component {
  state={
    active: false
  }

  toggle = () => {
    this.setState({
      active: !this.state.active
    });
  }

  render() {
    const {active} = this.state;

    return (
      <div className={`${active ? "active" : ""} accordion`}>
        <span onClick={this.toggle}>{this.props.label}</span>
        <ul>
          <li>Til pickup point 35 DKK.</li>
          <li>Til døren 50 DKK.</li>
        </ul>
      </div>
    )
  }
};
