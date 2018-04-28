import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class PageThumb extends Component {
  render() {
    const { page } = this.props;

    return (
      <Link to={page.slug}>
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