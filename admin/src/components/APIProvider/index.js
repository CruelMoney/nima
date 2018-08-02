import React, { Component } from 'react';

let domain = process.env.REACT_APP_PUBLIC_URL;
domain = !!domain ? domain : 'https://nimacph.dk';

export default (WrappedComponent, endpoint, parser = (s=>s)) => {
  return class Provider extends Component {
    state={
      data:[],
      error: null
    }

    fetchData = async ({page, perPage, sort}) => {
      try {
        this.setState({
          loading:true
        });
        let data = await fetch(domain+endpoint+`?page=${page}&perPage=${perPage}&sort=${sort}`);
        data = await data.json();
        const {results, ...rest} = data;
        this.setState({
          ...rest,
          data: results.map(parser),
          error: null,
          loading: false
        });
      } catch (error) {
        this.setState({
          loading: false,
          error: !!error.message ? error.message : error
        });
      }
    }
  
    componentWillMount(){
      this.fetchData({page:1,perPage:10});
    }

    render() {
      return (
        <WrappedComponent 
          {...this.props}
          {...this.state}
          data={this.state.data}
          fetchData={this.fetchData}
          />
      )
    }
  };
}


