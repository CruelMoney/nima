import React, { Component } from 'react';
import Form from 'react-validation/build/form';
import SubmitButton from '../../../components/SubmitButton';
import Input from '../../../components/Input';
import * as vl from '../../../utils/validators';

class Information extends Component {
  state={
    optEmail: false
  }

  continue = () => {
    this.form.validateAll();
    const values = this.form.getValues();
    this.props.onSubmit && this.props.onSubmit({
      ...values,
      newsletter_subscribe : values.newsletter_subscribe === "true"
    });
  }

  onErrors = () => {
    this.form.validateAll();
  }

  toggleOptEmail = () => {
    this.setState({
      optEmail: !this.state.optEmail
    })
  }

  render() {
    const { optEmail } = this.state;
    const { active } = this.props;

    return (
      <Form
        className={!!active ? 'active' : ''}
        ref={c => { this.form = c }}
      >
        <div className="flex">
              <Input validations={[vl.required]} name="first_name" type="text" placeholder="Fornavn" className="w-1/2 mr-2"/>
              <Input validations={[vl.required]} name="last_name" type="text" placeholder="Efternavn" className="w-1/2 ml-2"/>
            </div>
            <div className="flex my-4">
              <Input validations={[vl.required, vl.email]} name="email" type="email" placeholder="Email" className="w-1/2 mr-2"/>
              <Input validations={[vl.required]} name="phone" type="tel" placeholder="Telefon" className="w-1/2 ml-2"/>
            </div>
            <div className="flex">
              <p className="m-0">
                <Input 
                  onChange={this.toggleOptEmail}
                  value={optEmail}
                  name="newsletter_subscribe" type="checkbox" id="subscribe" >
                  <label for="subscribe">Tilmeld nyhedsbrev</label>
                </Input>
              </p>
            </div>
            <div className="flex my-4">
              <Input validations={[vl.required]} name="address" type="address" placeholder="Adresse" className="w-full"/>
            </div>
            <div className="flex my-4">
              <Input validations={[vl.required]} name="city" type="city" placeholder="By" className="w-1/2 mr-2"/>
              <Input validations={[vl.required]} name="zip" type="zip" placeholder="Postnummer" className="w-1/2 ml-2"/>
            </div>
            <div className="flex my-4">
              <Input validations={[vl.required]} name="country" type="country" placeholder="Land" className="w-full"/>
            </div>
            <hr className="my-6 mobile-hide" />

            <div className="flex">
              <SubmitButton
                onClick={this.continue}
                onErrors={this.onErrors}
                className={`w-full border-2 p-3 border-black`}>
                  FORTSÆT
            </SubmitButton>
            </div>
      </Form>
    );
  }
}

export default Information;