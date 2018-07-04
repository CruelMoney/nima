import React, { Component } from 'react';
import Form from 'react-validation/build/form';
import SubmitButton from '../../../components/SubmitButton';
import {fetcher} from 'cude-cms';


class Shipping extends Component {
  state = {
    shipping: null,
    error: null,
    fetching:false,
    servicePoints:[]
  }

  fetchDeliveryPoints = (e) => {
    e.preventDefault();

    this.setState({
      fetching: true
    });

    const {
      city,
      zip,
      address
    } = this.props.order;
    return fetch('/api/deliveryPoints', {
      method: 'POST',
      credentials: 'include',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        zip:zip,
        city:city,
        street:address
      })
    }).then(res => {
      this.setState({
        fetching: false
      });
      return res.json();
    }).then(data => {
      const places = data.servicePointInformationResponse.servicePoints
      if (places.length === 0) throw Error("No pickup points found.")
      this.setState({
        servicePoints: places
      });
    }).catch(err => 
      this.setState({
      error: err.message || err
    }))
  }

  continue = () => {
    if(!this.state.shipping || !!this.state.error){
      this.setState({
        error: "Vælg venligst afsendelsesmetode."
      })
    }else{
      const order = {
        shipping: this.state.shipping
       }
      if(this.state.shipping.pickupPoint){
        const {visitingAddress} = this.state.shipping;
        order.address = visitingAddress.name + " " + visitingAddress.streetName + " " + visitingAddress.streetNumber
        order.city = visitingAddress.city
        order.zip = visitingAddress.postalCode
      }
      this.props.onSubmit && this.props.onSubmit(order);
    }
  }
  back = (e) => {
    e.preventDefault();
    this.props.stepBack && this.props.stepBack();
  }

  onErrors = () => {
    this.form.validateAll();
  }

  setShipping = (e, shipping) => {
    e.preventDefault();
    this.setState({shipping: shipping, error:null})
    this.props.onChange && this.props.onChange({shipping: shipping});
  }

  render() {
    const { error, shipping, fetching, servicePoints} = this.state; 
    const { active, data } = this.props;
    const deliveryOptions = !!data.results ? data.results : [];

    return (
      <Form
        className={!!active ? 'active' : ''}
        ref={c => { this.form = c }}
      >     
            {
              deliveryOptions.map(option => {
                
                if(option.pickupPoint){
                  return(
                    <React.Fragment>
                    <button 
                    className={`${shipping && shipping.name===option.name ? "active" : ""} ${fetching ? "loading" : ""} delivery-option service-point-chooser text-left my-2`}
                    onClick={(e)=>{this.fetchDeliveryPoints(e)}}
                    >
                    <div className="flex flex-col">
                        <header className="flex justify-between">
                          <h4 className="w-3/5 mb-2">{option.name}
                            <span className="block text-sm font-normal">
                            {option.deliveryDescription}
                            </span>
                          </h4>
                          <h4>
                            {option.price === 0 ? "GRATIS" : option.price + ' DKK'}
                          </h4>
                        </header>
                        <p className="mb-0  text-sm font-normal">
                        {option.description}
                        </p>
                      </div>
                    </button>
                    {
                      servicePoints.map(sp => {
        
                      return(
                        <button 
                        key={'servicepoint-'+sp.servicePointId} 
                        className={`${shipping && shipping.servicePointId===sp.servicePointId ? "active" : ""} delivery-option pickup-point  text-left my-2`}
                        onClick={(e)=>{this.setShipping(e, {
                          ...sp, 
                          ...option, 
                          visitingAddress:{
                            ...sp,
                            ...sp.visitingAddress
                          }
                        })}}
                        >
                        <div className="flex flex-col">
                          <header className="flex justify-between">
                            <h4 className="w-3/5 mb-2">{sp.name}
                              <span className="block text-sm font-normal">
                                {sp.visitingAddress.streetName + " " + sp.visitingAddress.streetNumber + ", " + sp.visitingAddress.postalCode}
                              </span>
                            </h4>
                            <h4>
                              {sp.routeDistance + ' meter væk'}
                            </h4>
                          </header>
                        </div>
                      </button>
                      ) 
                      })
                    }
                    </React.Fragment>
                  )
                }

               return(
                <button 
                key={'delivery-'+option.name} 
                className={`${shipping && shipping.name===option.name ? "active" : ""} delivery-option text-left my-2`}
                onClick={(e)=>{this.setShipping(e, option)}}
                >
                <div className="flex flex-col">
                  <header className="flex justify-between">
                    <h4 className="w-3/5 mb-2">{option.name}
                      <span className="block text-sm font-normal">
                        {option.deliveryDescription}
                      </span>
                    </h4>
                    <h4>
                      {option.price === 0 ? "GRATIS" : option.price + ' DKK'}
                    </h4>
                  </header>
                  <p className="mb-0  text-sm font-normal">
                    {option.description}
                  </p>
                </div>
              </button>
               ) 
              })
            }

          

            

            {
              !!error ? 
              <span className="error">
                {error}
              </span>
              : null
            }
          
            <hr className="my-6 mobile-hide" />

            <div className="flex mt-2">
             <button
                onClick={this.back}
                className={`w-full border-2 p-3 border-black mr-2`}>
                  TILBAGE
              </button>
              <SubmitButton
                onClick={this.continue}
                onErrors={this.onErrors}
                className={`w-full border-2 p-3 border-black ml-2`}>
                  FORTSÆT
              </SubmitButton>
             
            </div>
      </Form>
    );
  }
}

export default fetcher(Shipping, '/api/shipping', false, <div>Loading...</div>);