import React, { Component } from 'react';

class PageThumb extends Component {
  render() {
    const { page } = this.props;

    return (
      <div className="page-thumb fixed-ratio">
        <img 
        className={`object-fit-cover h-full w-full`}
        src={`/uploads/files/${page.thumbnail.file.filename}`} 
        alt={page.thumbnail.alt1}/>
      </div>
    );
  }
}

export default PageThumb;