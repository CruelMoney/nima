import React, { Component } from 'react';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import './index.css'

export default class DataTable extends Component {
  render() {
    return (
      <ReactTable {...this.props}/>
    )
  }
};
