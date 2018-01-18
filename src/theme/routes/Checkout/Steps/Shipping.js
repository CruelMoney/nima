import React, { Component } from 'react';
import Form from 'react-validation/build/form';
import SubmitButton from '../../../components/SubmitButton';
import {fetcher} from 'cude-cms';

class Shipping extends Component {
  state = {
    shipping: null,
    error: null
  }

  continue = () => {
    if(!this.state.shipping){
      this.setState({
        error: "Please select shipping method."
      })
    }else{
      this.props.onSubmit && this.props.onSubmit({
        shipping: this.state.shipping
      });
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
    this.setState({shipping: shipping})
    this.props.onChange && this.props.onChange({shipping: shipping});
  }

  render() {
    const { error, shipping } = this.state; 
    const { active, data } = this.props;

    const deliveryOptions = data.results;

    return (
      <Form
        className={!!active ? 'active' : ''}
        ref={c => { this.form = c }}
      >     
            {
              deliveryOptions.map(option => {

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
                      {option.price === 0 ? "FREE" : option.price + ' DKK'}
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

            <div className="flex">
             <button
                onClick={this.back}
                className={`w-full border-2 p-3 border-black mr-2`}>
                  BACK
              </button>
              <SubmitButton
                onClick={this.continue}
                onErrors={this.onErrors}
                className={`w-full border-2 p-3 border-black ml-2`}>
                  CONTINUE
              </SubmitButton>
             
            </div>
      </Form>
    );
  }
}

export default fetcher(Shipping, '/api/shipping', false, <div>Loading...</div>);