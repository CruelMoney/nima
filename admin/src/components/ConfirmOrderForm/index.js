import React, { Component } from 'react';
import { Form, Text, Checkbox, TextArea, Select } from 'react-form';
import OrderItems from '../OrderItems';
import './index.css';

export default class RefundForm extends Component {
  state={
    error: null,
    submitting:false,
    success: false
  }

  confirmOrder = async (charge) => { 
    this.setState({
      submitting:true
    });
    const {order} = this.props;
    return await fetch('http://0.0.0.0:3001/api/confirm', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        charge,
        order:order
      })
    })
    .then(result => result.json())
    .then(res => {
      if(res.error){
        throw new Error(res.error)
      }
      this.setState({
        error: null,
        success: "Order confirmed"
      });
      order.fetchPayment();
      order.fetchShipment();
    })
    .catch(error => {
        error = error.message || error;
        
        this.setState({
          error
        });
    })
    .finally( _ =>{
      this.setState({
        submitting:false
      });
    })
  }

  render() {
    const {order} = this.props;
    const {submitting, success} = this.state;

    return (
      <div>
      <h3>Confirm order</h3>
      <p>
        Confirm the order to charge the money from the customers card, and get the shipping label for the order package. 
        You can specify a smaller amount to charge the customer, than the original price.
      </p>
      <p>
      The customer will be notified that the order is on the way, when you confirm.
      </p>
        <Form
        onSubmit={this.confirmOrder}>
          {formApi => (
            <form onSubmit={formApi.submitForm} id="confirm-order-form" >
              
              <div className="form-group">
                <label>Items</label>
                <OrderItems order={order} />                
              </div>

              <div className="form-group">
                <label htmlFor="text-input-amount">Charge</label>
                <Text 
                defaultValue={order.totalPrice}
                type="number" field="amount" id="text-input-amount" />
              </div>


             
              <div className="form-group">
                <button 
                onClick={this.props.reset}
                type="reset">
                  Cancel
                </button>
                {
                  success ? 
                    <a className="button-look" target={'_blank'} href={order.shippingLabel}>Shipping label</a>
                  :
                  <button 
                  disabled={submitting}
                  type="submit">
                  {submitting ? "Confirming..." : ("Confirm order")}
                  </button>
                }
               
              </div>
            </form>
          )}
        </Form>
        <span className="error">
          {this.state.error}
        </span>
        <span className="success">
          {success}
        </span>
      </div>
    )
  }
};
