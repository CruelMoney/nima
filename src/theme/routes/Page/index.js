import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router'
import { fetcher } from 'cude-cms'
import Post from './Post';
import Overview from './OverviewPage';
import Product from './Product';
import NotFound from './NotFound';
import Loading from '../Loading';
import {Helmet} from 'react-helmet';

class Page extends Component {
  render() {
    const { match, location, history, data } = this.props
    const pages  = data.results;
    let page = !!pages ? pages.find(page => '/'+page.slug === location.pathname) : false;
    let PageComponent = null;
    
    if(!page){
      PageComponent = NotFound;
      page = { title: "Not Found", description: "The page could not be found." };
    }else if(page.__t === 'Overview'){
      PageComponent = Overview;
    }else if(page.__t === 'Product'){
      PageComponent = Product;
    }else{
      PageComponent = Post;
    }

    return (
      <React.Fragment>
         <Helmet>
          <title>NIMA | {page.title || "CPH"}</title>
          <meta name="description" content={page.description || "NIMA COPENHAGEN"} />
        </Helmet>
        <PageComponent
          page={page}
        />
      </React.Fragment>
    )
  }
}

export default withRouter(
  fetcher(
    Page, 
    '/api/pages', 
    true, 
    <Loading 
      text={"NIMA COPENHAGEN"}
      active />
  )
);