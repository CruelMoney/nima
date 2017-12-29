import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class BagItems extends Component {
  render() {
    const {items} = this.props;

    return (
      <div className="bag-items">
                {items.map((item, idx)=>{
                  return(
                    <div key={'bag-item-'+idx} className="bag-item">
                      <Link to={`/${item.slug}`} className="flex items-center justify-between text-black hover:text-grey-dark">
                          <div className="flex items-center ">
                          <div className="fixed-ratio w-1/3">
                            <img 
                            className={`object-fit-cover h-full w-full`}
                            src={`/uploads/files/${item.thumbnail.file.filename}`} 
                            alt={item.thumbnail.alt1}/>
                          </div>
                          <p className="ml-3 mb-0">
                            {item.title}
                            <span className="block text-xs">
                              Size: {item.variation}
                            </span>
                          </p>
                        </div>
                        <p className="text-right w-2/5 mb-0">
                        {item.price} DKK
                        </p>
                      </Link>
                    </div>
                  )
                })}
              </div>
    );
  }
}

export default BagItems;