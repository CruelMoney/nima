import React, { Component } from 'react';
import DataTable from '../../components/DataTable';
import ActionDropdown from './actionDropdown';
import './index.css';
import APIProvider from '../../components/APIProvider';

const columns = [{
  Header: 'Customer',
  id: 'name',
  accessor: d => `${d.name.first} ${d.name.last}` 
},
{
  Header: 'Email',
  id: 'email',
  accessor: `email` 
},
{
  Header: 'Is customer',
  id: 'customer',
  accessor: o => o.isCustomer,
  Cell: props => {
    return <span>{props.value ? "Yes" : "No"}</span>
  }
},
{
  Header: 'Receives newsletter',
  id: 'newsletter',
  accessor: o => o.receivesNewsletter, 
  Cell: props => {
    return <span>{props.value ? "Yes" : "No"}</span>
  }
}]

class Customers extends Component {

  fetchData = (state, instance) =>{
    const {fetchData} = this.props;
    let sort = !!state.sorted ? state.sorted[0] : {};
    sort = !!sort ? sort : {};
    fetchData({
      page:state.page+1,
      perPage: state.pageSize,
      sort: `${sort.desc ? '-' : ''}${sort.id}`
    });
  }
  
  render() {
    const {data, totalPages, loading} = this.props;
    return (
      <div className="card">
        <h1 className="padding">
          Customers
        </h1>
        <DataTable
          manual
          loading={loading}
          noDataText="Not available"
          data={data}
          columns={columns}
          defaultPageSize={10}
          pages={totalPages}
          onFetchData={this.fetchData}
        />
      </div>
    )
  }
};

export default APIProvider(Customers, '/api/admin/customers');