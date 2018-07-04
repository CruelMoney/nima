import React, { Component } from 'react';
import ClickOutside from '../ClickOutside';
import './index.css';

export default class ActionDropdown extends Component {
  state={
    active:false
  }

  toggle = () => {
    this.state.active ? this.close() : this.open();
  }
  open = () => {
    this.setState({
      active: true
    });
  }
  close = () => {
    this.setState({
      active: false
    });
  }

  render() {
    return (
      <ClickOutside 
        action={this.close}
        className="dropdown">
        <button className="transparent" onClick={this.toggle}>...</button>
        <div
        className={`popup ${this.state.active ? 'active' : ''}`}>
         {this.props.children}
        </div>
      </ClickOutside> 
    )
  }
};
