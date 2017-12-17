import React, { Component } from 'react';
import { DBWysiwyg } from 'cude-cms'
import './index.css'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class Product extends Component {
  render() {
    const { page } = this.props;

    return (
      <div className="product">
       <div className="container mx-auto  mt-16">
        <header>
        <h1>
          {page.title}
        </h1>
        </header>
        <DBWysiwyg 
          dbKey={`${page.slug}-wysiwyg-content`}
          wrapperClassName="wrapper-class"
          editorClassName="editor-class"
          toolbarClassName="toolbar-class"
        />
        </div>
      </div>
    );
  }
}

export default Product;