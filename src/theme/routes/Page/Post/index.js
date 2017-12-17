import React, { Component } from 'react';
import { DBWysiwyg } from 'cude-cms'
import './index.css'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


class Post extends Component {
  render() {
    const { page } = this.props
    return (
      <div className="post-page">
      <div className="container mx-auto  mt-16">
        <hr/>
        <article className="mt-10 mb-16">
          <h1>
          {page.title}  
          </h1>
          <DBWysiwyg 
            dbKey={`${page.slug}-wysiwyg-content`}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
          />
        </article>
      </div>
      </div>
    );
  }
}

export default Post;