import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import * as tracker from '../../../components/WithAnalytics/ProductTracker';

class PageThumb extends Component {
  
  trackProductClick = () => {
    const { page } = this.props;
    tracker.addProduct({
      product:page,
      quantity:1
    });
    tracker.click();
  }

  render() {
    const { page } = this.props;
    return (
      <Link onClick={this.trackProductClick} to={page.slug}>
        <div className="page-thumb fixed-ratio">
          <img 
          className={`object-fit-cover h-full w-full fixed-ratio-content`}
          src={`/uploads/files/${page.thumbnail.file.filename}`} 
          alt={page.thumbnail.alt1}/>
        </div>
        <h4 className="page-thumb">
          {page.title}
          <span>
            {page.price} DKK
          </span>
        </h4>
      </Link>
    );
  }
}

export default PageThumb;