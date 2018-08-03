import React, { Component } from 'react';
import { DBWysiwyg } from 'cude-cms'
import './index.css'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {connect} from 'react-redux';

class Lookbook extends Component {
  componentDidMount(){
    document.addEventListener('mousewheel', this.scrollHandler);
    document.addEventListener("DOMMouseScroll", this.scrollHandler, false);
  }
  componentWillUnmount(){
    document.removeEventListener('mousewheel', this.scrollHandler);
    document.removeEventListener("DOMMouseScroll", this.scrollHandler, false);
  }

  scrollHandler = (e) => {
    
    e.preventDefault();
    if(!!this.scroller){
      this.scroller.scrollLeft += e.deltaX + e.deltaY;
    }
  }

  render() {
    console.log(this.props)
    const { page } = this.props
    return (
      <div className="lookbook-page">
     
        <div className="vertical-text-wrapper">
        <div className="container mx-auto">
        <div className="vertical-text">
          <h1>
          {page.title}
          <span>{page.description}</span>
          </h1>
        </div>
        </div>
        </div>
        <div 
        ref={r => {
          console.log(r)
          this.scroller = r}}
        className="horizontal-scroll">
          <DBWysiwyg 
            className="content-wrapper"
            dbKey={`${page._id}-wysiwyg-content`}
            wrapperClassName="wysiwyg"
            editorClassName="content-wrapper"
            toolbarClassName="wysiwyg-toolbar"
          />
          </div>  
      </div>
    );
  }
}

const getState = (state) => ({
  editmode : state.adminOverlay.editMode
})

export default connect(getState)(
  Lookbook
);