import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router'
import LoadingPage from '../Loading';
import { fetcher, DBWysiwyg } from 'cude-cms'
import { Editor } from 'react-draft-wysiwyg';
import './index.css'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


class Page extends Component {
  render() {
    const { match, location, history, data } = this.props
    const pages  = data.results;
    const page = !!pages ? pages.find(page => '/'+page.slug === location.pathname) : false;

    if(!page){
      return (
        <Redirect to="/not-found"/>
      )
    }
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

export default withRouter(fetcher(Page, '/api/pages', true, <div>Loading...</div>));