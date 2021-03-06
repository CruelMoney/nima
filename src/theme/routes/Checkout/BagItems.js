import React, { Component } from 'react';
import { connect } from 'react-redux'; 
import * as actions from '../../actions/cart';
import {Link} from 'react-router-dom';

class BagItems extends Component {

  addItem = (e, item) =>{
    e.preventDefault();
    this.props.addItem(item);
  }

  removeItem = (e, item) =>{
    e.preventDefault();
    this.props.removeItem(item);
  }

  render() {
    const {items} = this.props;
    let itemsView = {}

    // Mapping items to render multiple items on same line
    for (const item of items) {
      const key = item.variation.sku;
      const viewItem = itemsView[key];
      itemsView[key] = !!viewItem ? {...viewItem, quantity: viewItem.quantity + 1} : { ...item, quantity: 1 };
    }

   

    return (
      <div className="bag-items">
                {Object.values(itemsView).map((item, idx)=>{
                  
                  return(
                    <div key={'bag-item-'+idx} className="bag-item">
                      <Link to={`/${item.slug}`} className="flex items-center justify-between text-black hover:text-grey-dark">
                          <div className="flex items-center w-3/5 ">
                          <div className="fixed-ratio w-3/5">
                            <div className="absolute pin bag-editor flex items-center justify-center">
                              <button onClick={(e)=>this.removeItem(e, item)}>-</button><button onClick={(e)=>this.addItem(e, item)}>+</button>
                            </div>
                            <img 
                              className={`object-fit-cover h-full w-full fixed-ratio-content`}
                              src={`/uploads/files/${item.thumbnail.file.filename}`} 
                              alt={item.thumbnail.alt1}
                            />
                          </div>
                          <p className="text-sm ml-3 mb-0 w-4/5">
                            {item.quantity > 1 ? item.quantity + "x" : ""} {item.title}
                            <span className="capitalize block text-xs">
                              {item.variation.combination.map(c => c.label).join(', ')}
                            </span>
                          </p>
                        </div>
                        <p className="text-right w-1/5 md:w-2/5 mb-0">
                        {item.quantity > 1 ? item.quantity + "x" : ""} {item.salePrice || item.variation.price} DKK
                        </p>
                      </Link>
                    </div>
                  )
                })}
              </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    removeItem: (item) => dispatch(actions.removeFromCart(item)),
    addItem: (item) => dispatch(actions.addToCart(item))
  }
}

export default connect(state=>state, mapDispatchToProps)(BagItems);