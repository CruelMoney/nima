import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router'
import { fetcher } from 'cude-cms'
import Post from './Post';
import Overview from './OverviewPage';
import Product from './Product';
import NotFound from '../NotFound'


class Page extends Component {
  render() {
    const { match, location, history, data } = this.props
    const pages  = data.results;
    const page = !!pages ? pages.find(page => '/'+page.slug === location.pathname) : false;

    if(!page){
      return (
        <NotFound />
      )
    } 

    if(page.__t === 'Overview'){
      return(
        <Overview page={page} />
      );
    }else if(page.__t === 'Product'){
      return(
        <Product page={page} />
      );
    }else{
      return(
        <Post page={page} />
      );
    }
  }
}

export default withRouter(fetcher(Page, '/api/pages', true, <div>Loading...</div>));