import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/cart';
import ButtonOptions from '../../../components/Options';

class ProductAdder extends Component {
  state={productAdded: false}

  onAddBag = () => {
    const {selectedVariation} = this.state

    if(!selectedVariation){
      alert("Please choose size first");
    }else{
      this.setState({
        productAdded:true
      })
      this.props.addToCart({
        ...this.props.product,
        variation: selectedVariation
      })
    }
  }

  render() {
    const { product, editMode } = this.props;
    const { productAdded } = this.state;

    return (
      <React.Fragment>
        <h1 className="xl:text-6xl text-5xl">
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
          disabled={productAdded}
          className={"add-to-bag bg-transparent font-medium mt-6"}>
          {productAdded ? "ADDED" : "ADD TO BAG"}
        </button>
      </React.Fragment>
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