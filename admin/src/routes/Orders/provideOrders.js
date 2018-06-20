import React, { Component } from 'react';

export default (WrappedComponent) => {
  return class OrdersProvider extends Component {
    state={
      orders:[],
      payments:{},
      shipments:{},
      error: null
    }

    fetchShipment =  async (order) => {
      if(order.shippingID){
        let status = await fetch(`/api/shipment/${order.shippingID}`).then(r => r.json());
        if(!status.error){
          return this.setState({
            shipments:{
              ...this.state.shipments,
              [order._id]: status
            }
          });
        }
      }

      this.setState({
        shipments:{
          ...this.state.shipments,
          [order._id]: 'Not available'
        }
      });
    }

    fetchPayment =  async (order) => {
      let status = await fetch(`/api/payment/${order.stripeID}`).then(r => r.json());
      this.setState({
        payments:{
          ...this.state.payments,
          [order._id]: status
        }
      });
    }

    parseOrder = (order) => {
      this.fetchPayment(order);
      this.fetchShipment(order);
      order.fetchPayment = () => this.fetchPayment(order);
      order.fetchShipment = () => this.fetchShipment(order);
      return order;
    }
  
    fetchOrders = async ({page, perPage, sort}) => {
      try {
        this.setState({
          loading:true
        });
        let data = await fetch(`/api/admin/orders?page=${page}&perPage=${perPage}&sort=${sort}`);
        data = await data.json();
        const {results, ...rest} = data.orders;
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
          />
      )
    }
  };
}


