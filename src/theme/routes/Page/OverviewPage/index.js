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
      <div className="overview-page">
      <div className="container mx-auto  mt-16">
        <div className="flex">
          {
            children && children.map(page => {
              return(
                <div className="w-1/3">
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