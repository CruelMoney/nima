import React, { Component } from "react";
import Icon from './icon.js';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import './index.css';

class Bag extends Component{
  state = {
    bulge: false
  }

  animateAddProduct = (nextprops) => {
    if(this.props.cart.items && nextprops.cart.items && this.props.cart.items.length < nextprops.cart.items.length){
      this.setState({
        bulge:true
      })
      setTimeout(()=>{
        this.setState({
          bulge:false
        })
      }, 250);
    }
  }

  componentWillReceiveProps(nextprops){
    this.animateAddProduct(nextprops);
  }

  toggleDropdown = (state) => {
    setTimeout(()=>{
      this.setState({dropdown: state})
    },100)
  }

  render(){
    const { items } = this.props.cart

    return(
      <div
        className="relative bag-wrapper"
        onBlur={() => this.toggleDropdown(false)}
        onFocus={() => this.toggleDropdown(true)}
        tabIndex='0'
      >
        {this.state.dropdown  ? 
          <div
            className="absolute bag-dropdown"
          >
            {
              items.length === 0 ? 
              <div className="text-center">Your bag is empty.</div> 
              : 
              <div>
                <h4>BAG</h4>
                <hr/>
                {
                  items.map((i, idx) => {
                    return(
                      <Link to={`/${i.slug}`} key={'bag-item-'+idx} className="bag-section text-black hover:text-grey-dark">
                        <p className="inline float-left text-left">
                          {i.title} ({i.variation})
                        </p>
                        <p className="inline float-right text-right">
                        {i.price} DKK
                        </p>
                      </Link>
                    )
                  })
                }
                <hr/>
                  <div className="bag-section">
                    <p className="inline float-left text-left">
                      Shipping
                    </p>
                    <p className="inline float-right text-right">
                      0 DKK
                    </p>
                  </div>  
                <hr/>
                <div className="bag-section">
                  <p className="inline float-left text-left">
                    Total
                  </p>
                  <p className="inline float-right text-right">
                    {items.reduce((acc, i)=>acc+i.price, 0)} DKK
                  </p>
                </div> 
                <div className="flex justify-center w-full mt-4">
                  <Link 
                  onClick={()=>this.toggleDropdown(false)}
                  to={`/checkout`} className="text-2xl text-black hover:text-grey-dark text-center">
                    Checkout
                  </Link>
                </div>
              
              </div>
            }
          </div>  
        : null}
        <Icon
          className="cursor-pointer"
          bulge={this.state.bulge}
          itemsCount={items.length}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart
  }
}

export default connect(mapStateToProps)(Bag)