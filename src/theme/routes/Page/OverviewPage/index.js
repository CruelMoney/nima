import React, { Component } from 'react';
import { fetcher } from 'cude-cms'
import PageThumb from './pageThumbnail';
import './index.css'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


class Overview extends Component {
  render() {
    const { data } = this.props;
    const { children } = data;


    return (
      <div className="overview-page mb-16 mt-16">

      <div className="container mx-auto">
      <hr/>

        <div className="flex flex-wrap overview">
          {
            children && children.map((page, idx) => {
              return(
                  <div 
                  key={`overview-item-${idx}`}
                  className="sm:w-1/2 page-thumb-wrapper">
                    <PageThumb page={page} />
                  </div>
              )
            })
          }
        </div>
      </div>
      </div>
    );
  }
}

export default (props)=>{
  const {page} = props;
  return fetcher(Overview, `/api/overviews/${page._id}`, true)(props);
};