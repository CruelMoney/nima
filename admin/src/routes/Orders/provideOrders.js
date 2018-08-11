import React, { Component } from 'react';

let domain = process.env.REACT_APP_PUBLIC_URL;
domain = !!domain ? domain : 'https://nimacph.dk';

export default (WrappedComponent) => {
  return class OrdersProvider extends Component {
    state={
      orders:[],
      payments:{},
      shipments:{},
      error: null
    }

    fetchShipment =  async (order) => {
      if(!!order.parcelID){
        let status = false;
        try {
          const response = await fetch(domain+`/api/shipment/${order.parcelID}`).then(r => r.json());
          if(!response.error && response.status){
            status = {
              status: response.status,
              ...response.statusText,
              events: response.items[0].events
            };
          }
        } catch (error) {
          console.log(error)
        }
        return this.setState({
          shipments:{
            ...this.state.shipments,
            [order._id]: status
          }
        });
      }
    }

    fetchPayment =  async (order) => {
      if(order.stripeID){
        let status = "Not available";
        try {
          const response = await fetch(domain+`/api/payment/${order.stripeID}`).then(r => r.json());
          if(!response.error && typeof response === 'string'){
            status = response;
          }
        } catch (error) {
          console.log(error)
        }
        return this.setState({
          payments:{
            ...this.state.payments,
            [order._id]: status
          }
        });
      }
    }

    parseOrder = (order) => {
      this.fetchPayment(order);
      this.fetchShipment(order);
      order.fetchPayment = () => this.fetchPayment(order);
      order.fetchShipment = () => this.fetchShipment(order);
      order.fetchUpdate = () => this.fethcOrder(order._id);
      return order;
    }
  
    fetchOrders = async ({page, perPage, sort}) => {
      try {
        this.setState({
          loading:true
        });
        let data = await fetch(domain+`/api/admin/orders?page=${page}&perPage=${perPage}&sort=${sort}`);
        data = await data.json();
        const {results, ...rest} = data;
        this.setState({
          ...rest,
          orders: results.map(this.parseOrder),
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

    fethcOrder = async ({orderID}) => {
      try {
        this.setState({
          loading:true
        });
        let data = await fetch(domain+`/api/admin/orders/${orderID}`);
        const order = await data.json();
        this.setState(state=>({
          orders: state.orders.map(o => {
            if(o._id === order._id) return this.parseOrder(order);
            return o;
          }),
          error: null,
          loading: false
        }));
      } catch (error) {
        this.setState({
          loading: false,
          error: !!error.message ? error.message : error
        });
      }
    }
  
    componentWillMount(){
      this.fetchOrders({page:1,perPage:10});
    }


    getData = () => {
      const {orders, payments, shipments} = this.state;
      return orders.map(o => {
        return {
          ...o,
          paymentStatus:payments[o._id],
          shippingStatus:shipments[o._id],
        }
      })
    }
  
    render() {
      return (
        <WrappedComponent 
          {...this.props}
          {...this.state}
          orders={this.getData()}
          fetchOrders={this.fetchOrders}
          fethcOrder={this.fethcOrder}
          />
      )
    }
  };
}


