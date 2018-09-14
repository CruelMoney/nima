import React, { Component } from 'react';

let domain = process.env.REACT_APP_PUBLIC_URL;
domain = !!domain ? domain : 'https://nimacph.dk';

export default (WrappedComponent) => {
  return class ShippingProvider extends Component {
    state={
      shippingMethods:[],
      shippingZones:[],
      shippingRates:[],
      loading: false,
      error: null
    }

    addItem = async ({item, key}) => {
     this.setState(state=>({
      [key] : [...state[key].filter(i => i._id !== item._id), item]
     }));
    }

    getApiObject = (values) => {
      if(values.method){
        return {endpoint: "/api/shipping/method", key: 'shippingMethods', item: values.method};
      }else if(values.zone){
        return {endpoint: "/api/shipping/zone", key: 'shippingZones', item: values.zone}
      }else if(values.rate){
        return {endpoint: "/api/shipping/rate", key: 'shippingRates', item: values.rate}
      }
    }

    saveItem = async (values) => {
      return await this.fetch(this.getApiObject(values));
    }

    deleteItem = async (values) => {
      return await this.delete(this.getApiObject(values));
    }

    fetchShippingZones = async ({page, perPage, sort}) => {
      await this.fetch({
        page, perPage, sort,
        endpoint: "/api/shipping/zone",
        key: 'shippingZones'
      });
    }

    fetchShippingRates = async ({page, perPage, sort}) => {
      await this.fetch({
        page, perPage, sort,
        endpoint: "/api/shipping/rate",
        key: 'shippingRates'
      });
    }
  
    fetchShippingMethods = async ({page, perPage, sort}) => {
      await this.fetch({
        page, perPage, sort,
        endpoint: "/api/shipping/method",
        key: 'shippingMethods'
      });
    }

    fetchShippingZones = async ({page, perPage, sort}) => {
      await this.fetch({
        page, perPage, sort,
        endpoint: "/api/shipping/zone",
        key: 'shippingZones'
      });
    }

    fetchShippingRates = async ({page, perPage, sort}) => {
      await this.fetch({
        page, perPage, sort,
        endpoint: "/api/shipping/rate",
        key: 'shippingRates'
      });
    }
    
    fetch = async ({endpoint, key, page, perPage, sort}) => {
      try {
        this.setState({
          loading:true
        });
        let data = await fetch(domain+`${endpoint}?page=${page}&perPage=${perPage}&sort=${sort}`);
        data = await data.json();
        const {results, ...rest} = data;
        this.setState({
          ...rest,
          [key]: results,
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

    delete = async ({endpoint, item, key}) => {
      try {
        this.setState({
          loading:true
        });
        await fetch(domain+`${endpoint}/${item._id}`,{
          method: 'DELETE'
        });
        this.setState(state=>({
          ...state,
          [key]: state[key].filter(e => e._id !== item._id),
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
      this.fetchShippingMethods({page:1,perPage:100});
      this.fetchShippingZones({page:1,perPage:100});
      this.fetchShippingRates({page:1,perPage:100});
    }

    saveItem = async ({item, endpoint, key}) => {
      try {
        const {
          _id,
        } = item;

        const update = !!_id;

        this.setState({
          loading: true,
        });
        let data = await fetch(domain+`${endpoint}/${update ? _id : ''}`, {
          method: update ? 'PATCH' : 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(item)
        });
        data = await data.json();
        this.addItem({ item: data, key});
      } catch (error) {
        this.setState({
          loading: false,
          error: !!error.message ? error.message : error
        });
      }
    }

  
    render() {
      return (
        <WrappedComponent 
          {...this.props}
          {...this.state}
          saveItem={this.saveItem}
          deleteItem={this.deleteItem}
          />
      )
    }
  };
}


