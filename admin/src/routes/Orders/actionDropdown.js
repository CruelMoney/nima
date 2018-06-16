import React, { Component } from 'react';

export default class ActionDropdown extends Component {
  state={
    active:false
  }

  toggle = () => {
    this.setState({
      active: !this.state.active
    });
  }

  render() {
    const {order} = this.props;

    return (
      <div className="action-dropdown">
        <button onClick={this.toggle}>...</button>
        <div
        onFocusCapture={console.log}
        onBlurCapture={()=>{this.setState({active:false})}}
        className={`popup ${this.state.active ? 'active' : ''}`}>
          <ul>
            <li>Ship order</li>
            <li>Contact customer</li>
            <li>Refund</li>
          </ul>
        </div>
      </div>
      
    )
  }
};
