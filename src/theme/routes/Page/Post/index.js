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
            className="content-wrapper"
            dbKey={`${page.slug}-wysiwyg-content`}
            wrapperClassName="wysiwyg"
            editorClassName="content-wrapper"
            toolbarClassName="wysiwyg-toolbar"
          />
        </article>
        <hr className="mb-0 sm:mb-16 mobile-hide"/>

      </div>
      </div>
    );
  }
}

export default Post;