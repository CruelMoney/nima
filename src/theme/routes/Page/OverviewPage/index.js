import React, { Component } from 'react';
import { fetcher, DBWysiwyg } from 'cude-cms'
import PageThumb from './pageThumbnail';
import './index.css'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


class Overview extends Component {
  render() {
    const { page, data } = this.props;
    const { children } = data;


    return (
      <div className="overview-page mb-16 mt-16">

      <div className="container mx-auto">
      <hr/>

        <div className="flex flex-wrap overview">
          {
            children && children.map((page, idx) => {
              return(
                  <div className="w-1/3 page-thumb-wrapper">
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