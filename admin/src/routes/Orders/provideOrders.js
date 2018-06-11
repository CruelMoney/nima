import React, { Component } from 'react';

export default (WrappedComponent) => {
  const parseOrder = (order) => {
    return order
  }

  return class OrdersProvider extends Component {
    state={
      orders:[],
      error: null
    }
  
    fetchOrders = async ({page, perPage, sort}) => {
      try {
        let data = await fetch(`http://0.0.0.0:3001/api/admin/orders?page=${page}&perPage=${perPage}&sort=${sort}`);
        data = await data.json();
        console.log(data);
        const {results, ...rest} = data.orders;
        this.setState({
          ...rest,
          orders: results.map(parseOrder),
          error: null
        });
      } catch (error) {
        this.setState({
          error: !!error.message ? error.message : error
        });
      }
    }
  
    componentWillMount(){
      this.fetchOrders({page:1,perPage:10});
    }
  
    render() {
      return (
        <WrappedComponent 
          {...this.props}
          {...this.state}
          fetchOrders={this.fetchOrders}
          />
      )
    }
  };
}


