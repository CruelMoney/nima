import React, { Component } from 'react';
import Form from 'react-validation/build/form';
import SubmitButton from '../../../components/SubmitButton';
import Input from '../../../components/Input';
import * as vl from '../../../utils/validators';

class Payment extends Component {

  continue = () => {
    this.form.validateAll();
    this.props.onSubmit && this.props.onSubmit(this.form.getValues());
  }
  back = (e) => {
    e.preventDefault();
    this.props.stepBack && this.props.stepBack();
  }

  onErrors = () => {
    this.form.validateAll();
  }

  render() {
    const { active, stepBack } = this.props;

    return (
      <Form
        className={!!active ? 'active' : ''}
        ref={c => { this.form = c }}
      >
            <div className="flex">
              <Input validations={[vl.required]} name="card-owner" type="text" placeholder="Card owner" className="w-full"/>
            </div>
            <div className="flex  my-4">
              <Input validations={[vl.required]} name="card-number" type="number" placeholder="Card number" className="w-full"/>
            </div>
            <div className="flex my-4">
              <Input validations={[vl.required]} name="card-cvv" type="number" placeholder="CVV" className="w-1/3 mr-2"/>
              <Input validations={[vl.required]} name="card-expiry-month" type="number" placeholder="Expiry month" className="w-1/3 mx-2"/>
              <Input validations={[vl.required]} name="card-expiry-year" type="number" placeholder="Expiry year" className="w-1/3 ml-2"/>
            </div>
            <hr className="my-6" />

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
                  PLACE ORDER
              </SubmitButton>
            </div>
      </Form>
    );
  }
}

export default Payment;