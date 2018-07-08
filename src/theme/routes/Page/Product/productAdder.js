import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/cart';
import ButtonOptions from '../../../components/Options';
import Accordion from './accordion'
import {
  FacebookShareButton
} from 'react-share';
import intersect from 'lodash.intersection';
import difference from 'lodash.difference';

const getPossibleOptionCombinations = ({variants}) => {
  return variants.filter(v => v.used && v.inventory > 0).map(v => v.combinationIds);
}

class ProductAdder extends Component {
  state={
    productAdded: false,
    selectedOptions: {}
  }


  onAddBag = () => {
    const {product} = this.props;
    const {selectedOptions, chosenVariation} = this.state;

    if(!chosenVariation){
      const a1 = Object.keys(product.options); 
      const a2 = Object.keys(selectedOptions); 
      const dif = difference(a1,a2);

      alert(`Vælg ${dif.join(' og ')} først.`);
    }else{
      this.setState({
        productAdded:true
      })
      this.props.addToCart({
        ...this.props.product,
        variation: chosenVariation
      })
      setTimeout(() => {
        this.setState({
          productAdded:false
        })
      }, 1000);
    }
  }

  selectOption = (optionName, optionValue) => {
    this.setState(state=>({
        selectedOptions:{
          ...state.selectedOptions,
          chosenVariation: null,
          [optionName] : optionValue
        }
      }), ()=>{
        const {product} = this.props;
        let {selectedOptions} = this.state;
        const a1 = Object.keys(product.options); 
        const a2 = Object.keys(selectedOptions); 
        const dif = difference(a1,a2);
        if (dif.length === 0){
          // set new variation as selected
          selectedOptions = Object.values(selectedOptions);
          const variation = product.variants.find(v => {
            return intersect(v.combinationIds, selectedOptions).length === a1.length;
          })
          this.setState({
            chosenVariation : variation
          })
        }
      }
    );
  }

  optionIsPossible = (option) => {
    const { product } = this.props;
    const possibleVariants = getPossibleOptionCombinations(product);
    let { selectedOptions } = this.state;
    selectedOptions = [...Object.values(selectedOptions), option.id];
    const isPossible = possibleVariants.some(c => intersect(c, selectedOptions).length > 0);

    return isPossible;
  }

  render() {
    const { product, editMode, publicURL } = this.props;
    const { productAdded, chosenVariation } = this.state;
    const soldOut = product.stock.every(o => o.stock <= 0);
    const url = publicURL + "/" + product.slug;
    const price = !chosenVariation ? product.price : chosenVariation.price;
    const options = Object.values(product.options);
    return (
      <React.Fragment>
        <h1 className="xl:text-6xl text-5xl">
        {product.title}
        </h1>
        <p>
          {product.description}
        </p>
        <p>
          <strong>
          Pris: { price } DKK
          </strong>
        </p>
        <ul className="alternate-actions">
          <li>
            <Accordion 
              label={"FORSENDELSE"}
            />
          </li>
          <li><FacebookShareButton 
            url={url}
           >
            DEL
            </FacebookShareButton>
          </li>
        </ul>
        {
         !!options && options.map(o =>(
           <React.Fragment>
             <h4>
               {o.name}:
             </h4>
            <ButtonOptions
              editMode={editMode}
              options={o.variants.map(option => ({
                ...option,
                disabled: !this.optionIsPossible(option)
              }))}
              onChange={oVal => this.selectOption(o.name, oVal.id)}
            />
          </React.Fragment>
         ))
        }
        
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