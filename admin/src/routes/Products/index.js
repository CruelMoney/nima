import React, { Component } from 'react';
import DataTable from '../../components/DataTable';
import provideProducts from './provideProducts';
import ActionDropdown from './actionDropdown';
import currencyFormatter from 'currency-formatter';
import './index.css';

const columns = [{
  Header: 'SKU',
  id: 'sku',
  width: 80,
  accessor: 'SKU' // String-based value accessors!
}, {
  Header: 'Name',
  id: 'name',
  accessor: 'title',
}, {
  Header: 'Sales',
  accessor: 'salesVolume'
},{
  Header: 'Categories',
  id: 'categories',
  accessor: d => (d.tags.map(t => t.name).join(', '))  // Custom value accessors!
},
{
  Header: 'Inventory',
  accessor: 'inventoryDescription', // String-based value accessors!,
},
{
  Header: 'Status',
  id: 'status',
  accessor: 'inventoryStatus',
  Cell: props => {
    const val = !!props.value ? props.value : "Not available";
    return <span className='status' data-status={val}>{val}</span>
  } 
},

{
  Header: 'Actions',
  id: '_id',
  width: 100,
  accessor: o=>o, // String-based value accessors!
  Cell: props => {
    return <ActionDropdown product={props.value} />
  }
},]

class Products extends Component {
  fetchData = (state, instance) =>{
    const {fetchProducts} = this.props;
    let sort = !!state.sorted ? state.sorted[0] : {};
    sort = !!sort ? sort : {};
    fetchProducts({
      page:state.page+1,
      perPage: state.pageSize,
      sort: `${sort.desc ? '-' : ''}${sort.id}`
    })
  }
  
  render() {
    const {products, totalPages, loading} = this.props;
    const pageSize = products.length >= 10 ? 10 : products.length;
    return (
      <div>
        <h1>
          Products
        </h1>
        <DataTable
          manual
          defaultSorted={[{
            id   : 'name',
          }]}
          loading={loading}
          noDataText="Not available"
          data={products}
          columns={columns}
          defaultPageSize={pageSize}
          pages={totalPages}
          onFetchData={this.fetchData}
        />
      </div>
    )
  }
};

export default provideProducts(Products);