import React, { Component } from 'react';
import { Form, Text, Checkbox, TextArea, Select } from 'react-form';
import currencyFormatter from 'currency-formatter';
import './index.css';

const domain = process.env.REACT_APP_PUBLIC_URL;

const refundReasons = [
  {
    label: 'Duplicate',
    value: 'duplicate',
  },
  {
    label: "Fraudulent",
    value: 'fraudulent',
  },
  {
    label: "Requested by customer",
    value: 'requested_by_customer',
  },
  {
    label: "Other",
    value: 'other',
  },
]

export default class RefundForm extends Component {
  state={
    error: null,
    submitting:false,
    success: false
  }

  refundOrder = async (refund) => { 
    this.setState({
      submitting:true
    });
    const {order} = this.props;
    return await fetch(domain+'/api/admin/refund', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...refund,
        order:order
      })
    })
    .then(result => result.json())
    .then( res => {
      if(res.error){
        throw new Error(res.error)
      }
      this.setState({
        error: null,
        success: "Order refunded"
      });
      order.fetchPayment();
    })
    .catch(error=>{
      error = error.message || error;

      this.setState({
        error
      });
    })
    .finally(()=>{
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
      <h3>Refund payment</h3>
      <p>
        Refunds take 5-10 days to appear on a customer's statement.
      </p>
        <Form
        onSubmit={this.refundOrder}>
          {formApi => (
            <form onSubmit={formApi.submitForm} id="refund-form" >
              <div className="form-group">
                <label htmlFor="text-input-amount">Refund</label>
                <Text 
                defaultValue={order.totalPrice}
                type="number" field="amount" id="text-input-amount" />
              </div>
              
              <div className="form-group">
                <label htmlFor="select-input-reason">Reason</label>
                <Select field="reason" id="select-input-reason" options={refundReasons} />
              </div>
              
              <div className="form-group">
                <label htmlFor="textarea-extended-reason">Details</label>
                <TextArea field="extendedReason" id="textarea-extended-reason" placeholder={"Add more details about this refund..."}/> 
              </div>

              <div className="form-group">
                <label>
                  Items are returned to stock:
                </label>
                <Checkbox
                    field="updateStock"
                />
              </div>
             
              <div className="form-group">
                <button 
                onClick={this.props.reset}
                type="reset">
                  Cancel
                </button>
                <button 
                disabled={submitting || !!success}
                type="submit">
                {submitting ? "Refunding..." : ("Refund " + currencyFormatter.format(formApi.values.amount, { code: 'DKK' }))}
                </button>
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
