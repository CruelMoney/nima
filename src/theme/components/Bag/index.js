import React, { Component } from "react";
import Icon from './icon.js';
import {connect} from 'react-redux';

class Bag extends Component{
  render(){
    const { items } = this.props.cart
    const hasItems = items.length > 0;

    return(
      <Icon 
        showCircle={hasItems}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart
  }
}

export default connect(mapStateToProps)(Bag)