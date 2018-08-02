import React, { Component } from 'react';
import { DBWysiwyg } from 'cude-cms'
import './index.css'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


class Lookbook extends Component {
  render() {
    const { page } = this.props
    return (
      <div className="lookbook-page">
      <div className="container mx-auto  mt-16">
        <hr/>
        <article className="mt-10 mb-16">
        <div className="vertical-text">
          <h1>
          {page.title}
          </h1>
        </div>
        
          <DBWysiwyg 
            className="content-wrapper"
            dbKey={`${page._id}-wysiwyg-content`}
            wrapperClassName="wysiwyg"
            editorClassName="content-wrapper"
            toolbarClassName="wysiwyg-toolbar"
          />
        </article>
      </div>
      </div>
    );
  }
}

export default Lookbook;