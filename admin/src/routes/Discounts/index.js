import React, { Component } from 'react';
import DataTable from '../../components/DataTable';
import ActionDropdown from './actionDropdown';
import './index.css';
import APIProvider from '../../components/APIProvider';

const columns = [{
  Header: 'Name',
  id: 'name',
  accessor: "name" 
},
{
  Header: 'Discount',
  id: 'discount',
  accessor: o => o,
  Cell: props => {
    return <span>{props.value.discount + " " + (props.value.type === "Value" ? "DKK" : "%")}</span>
  }
},
{
  Header: 'Code',
  id: 'code',
  accessor: "code" 
},
{
  Header: 'Redeems',
  id: 'used',
  accessor: o => o.used,
  Cell: props => {
    return <span>{props.value + " times"}</span>
  }
},
{
  Header: 'Remaining redeems',
  id: 'remaining',
  accessor: o => o,
  Cell: props => {
    return <span>{(props.value.uses === -1 ? "Infinite" : (props.value.uses - props.value.used)) + " times"}</span>
  }
},
{
  Header: 'Is valid',
  id: 'valid',
  accessor: o => o.valid, 
  Cell: props => {
    return <span>{props.value ? "Yes" : "No"}</span>
  }
}]

class Discounts extends Component {

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
    let {data, totalPages, loading} = this.props;
    data = data.filter(d => !d.isAutoCreated);
    return (
      <div>
        <h1>
          Discounts
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

export default APIProvider(Discounts, '/api/admin/discounts');