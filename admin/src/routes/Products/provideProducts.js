import React, { Component } from 'react';

let domain = process.env.REACT_APP_PUBLIC_URL;
domain = !!domain ? domain : 'https://nimacph.dk';

export default (WrappedComponent) => {
  return class ProductsProvider extends Component {
    state={
      products:[],
      error: null
    }

    addProduct = (product, additional = {}) => {
      this.setState(state=>{
        return{
          ...additional,
          products: [...state.products.filter(p => p._id !== product._id), product]
        }
      });
    }

    inventoryToDescription = (inventory) => {
      const val = inventory.reduce((acc, v) => {
        if (!v.used) return acc;
        return {
          ts: acc.ts + parseInt(v.inventory),
          tv: acc.tv + 1
        }
      },{ts: 0, tv: 0});

      return `${val.ts} in stock over ${val.tv} variants`;
    }
    
    inventoryToStatus = (inventory) => {
      const lowest = inventory.reduce((acc, v) => {
        if (!v.used) return acc;
        return v.inventory < acc ? parseInt(v.inventory) : acc;
      }, Number.POSITIVE_INFINITY);

      if (lowest === 0) {
          return 'empty variant'; 
      }else if(lowest <= 5){
        return 'low variant';      
      }else{
        return 'stocked up';
      }
    } 


    parseProduct = (product) => {
     
      const inv = !!product.variants ? JSON.parse(product.variants) : [];
      const options = !!product.options ? JSON.parse(product.options) : {};

      return {
        ...product,
        inventoryDescription: this.inventoryToDescription(inv),
        inventoryStatus: this.inventoryToStatus(inv),
        salesVolume: 'Not available',
        options: options,
        variants: inv,
        save : this.saveProduct
      };
    }
  
    fetchProducts = async ({page, perPage, sort}) => {
      try {
        this.setState({
          loading:true
        });
        let data = await fetch(domain+`/api/admin/products?page=${page}&perPage=${perPage}&sort=${sort}`);
        data = await data.json();
        const {results, ...rest} = data.products;
        this.setState({
          ...rest,
          products: results.map(this.parseProduct),
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
      this.fetchProducts({page:1,perPage:10});
    }

    saveProduct = async (product) => {
      try {

        const {
          _id,
          createdAt,
          inventory,
          updatedAt,
          ...cleanedProduct
        } = product;

        this.setState({
          loading: true,
        });
        let data = await fetch(domain+`/api/admin/products/${product._id}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...cleanedProduct,
            options: JSON.stringify(product.options),
            variants: JSON.stringify(product.variants),
          })
        });
        data = await data.json();
        this.addProduct(this.parseProduct(data.product), {
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

  
    render() {
      return (
        <WrappedComponent 
          {...this.props}
          {...this.state}
          fetchProducts={this.fetchProducts}
          />
      )
    }
  };
}


