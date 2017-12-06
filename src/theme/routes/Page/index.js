import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router'
import LoadingPage from '../Loading';
import { fetcher } from 'cude-cms'

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
      <div className="container mx-auto  mt-16">
        <h1>
        {page.title}
        </h1>
      You are now at {location.pathname}
      </div>
    );
  }
}

export default withRouter(fetcher(Page, '/api/pages', true, <div>Loading...</div>));