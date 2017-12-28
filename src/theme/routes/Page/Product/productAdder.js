import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/cart';
import ButtonOptions from '../../../components/Options';

class ProductAdder extends Component {
  state={}

  onAddBag = () => {
    const {selectedVariation} = this.state

    if(!selectedVariation){
      alert("Please choose size first");
    }else{
      this.props.addToCart({
        ...this.props.product,
        variation: selectedVariation
      })
    }
  }

  render() {
    const { product, editMode } = this.props;

    return (
      <div>
        <h1>
        {product.title}
        </h1>
        <p>
          {product.description}
        </p>
        <p>
          Price: { product.price } DKK
        </p>
        <ButtonOptions
          editMode={editMode}
          options={product.stock}
          onChange={v => this.setState({selectedVariation: v})}
        />
        <button
          onClick={this.onAddBag}
          className={"bg-transparent border hover:border-transparent hover:text-white font-bold py-4 px-12 mt-6"}>
          ADD TO BAG
        </button>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: product => {
      dispatch(actions.addToCart(product))
    }
  }
}

export default connect(state=>state, mapDispatchToProps)(ProductAdder);