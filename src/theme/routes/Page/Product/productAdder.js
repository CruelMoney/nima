import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/cart';
import ButtonOptions from '../../../components/Options';

class ProductAdder extends Component {
  state={productAdded: false}

  onAddBag = () => {
    const {selectedVariation} = this.state

    if(!selectedVariation){
      alert("Vælg størrelse først");
    }else{
      this.setState({
        productAdded:true
      })
      this.props.addToCart({
        ...this.props.product,
        variation: selectedVariation
      })
      setTimeout(() => {
        this.setState({
          productAdded:false
        })
      }, 1000);
    }
  }

  render() {
    const { product, editMode } = this.props;
    const { productAdded } = this.state;
    const soldOut = product.stock.every(o => o.stock <= 0);

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
          disabled={productAdded || soldOut}
          className={`add-to-bag bg-transparent font-medium mt-6 active`}>
          {
            soldOut ? "UDSOLGT" :
            productAdded ? "TILFØJET" : "TILFØJ TIL KURV" 
          }
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