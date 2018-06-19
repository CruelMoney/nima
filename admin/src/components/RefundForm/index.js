import React, { Component } from 'react';
import { Form, Text, Checkbox, TextArea, Select } from 'react-form';
import currencyFormatter from 'currency-formatter';
import './index.css';

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
  render() {
    const {order} = this.props;

    return (
      <div>
      <h3>Refund payment</h3>
      <p>
        Refunds take 5-10 days to appear on a customer's statement.
      </p>
        <Form
        onSubmit={console.log}>
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
                  Items are put back in stock:
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
                <button type="submit">
                  Refund {currencyFormatter.format(formApi.values.amount, { code: 'DKK' })}
                </button>
              </div>
              
            </form>
          )}
        </Form>
      </div>
    )
  }
};
