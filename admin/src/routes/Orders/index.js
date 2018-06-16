import React, { Component } from 'react';
import DataTable from '../../components/DataTable';
import provideOrders from './provideOrders';
import ActionDropdown from './actionDropdown';
import './index.css';

const columns = [{
  Header: 'Order',
  accessor: 'orderID' // String-based value accessors!
}, {
  Header: 'Date',
  accessor: 'createdAt',
  Cell: props => {
    const date = new Date(props.value);
    return <span className='date'>{date.toLocaleDateString()}</span>
} // Custom cell components!
}, {
  id: 'delivery.firstName', // Required because our accessor is not a string
  Header: 'Customer',
  accessor: d => `${d.delivery.firstName} ${d.delivery.lastName}`  // Custom value accessors!
},{
  Header: 'Shipping status',
  accessor: 'shippingStatus', // String-based value accessors!
  Cell: props => {
    const val = !!props.value ? props.value.toLowerCase() : "";
    return <span className='status' data-status={val}>{val}</span>
} 
},
{
  Header: 'Payment status',
  accessor: 'paymentStatus', // String-based value accessors!,
  Cell: props => {
    const val = !!props.value ? props.value.toLowerCase() : "";
    return <span className='status' data-status={val}>{val}</span>
} 
},
{
  id: 'totalPrice', // Required because our accessor is not a string
  Header: 'Total',
  accessor: d => `${d.totalPrice} DKK` 
},
{
  Header: 'Actions',
  accessor: '_id', // String-based value accessors!
  Cell: props => {
    console.log(props);
    return <ActionDropdown />
  }
},]

class Orders extends Component {
  fetchData = (state, instance) =>{
    const {fetchOrders} = this.props;
    let sort = !!state.sorted ? state.sorted[0] : {};
    sort = !!sort ? sort : {};
    fetchOrders({
      page:state.page+1,
      perPage: state.pageSize,
      sort: `${sort.desc ? '-' : ''}${sort.id}`
    })
  }
  
  render() {
    const {orders, totalPages} = this.props;
    return (
      <div>
        <h1>
          Orders
        </h1>
        <DataTable
          manual
          noDataText="Not available"
          data={orders}
          columns={columns}
          defaultPageSize={10}
          pages={totalPages}
          onFetchData={this.fetchData}
        />
      </div>
    )
  }
};

export default provideOrders(Orders);