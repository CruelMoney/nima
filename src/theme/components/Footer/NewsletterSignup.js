import React, { Component } from 'react';
import Input from '../Input';
import SubmitButton from '../SubmitButton';
import Form from 'react-validation/build/form';
import * as vl from '../../utils/validators';

class NewsletterSignup extends Component {
  
  submit = () => {
    this.form.validateAll();
    const values = this.form.getValues();

    console.log(values);
  }
  
  onErrors = () => {
    this.form.validateAll();
  }

  render() {
    return (
      <div className="newsletter-signup">
      <div className="container mx-auto">
        <h3>
          THE NIMA NEWSLETTER
        </h3>

        <p>
          Sign up for the NIMA newsletter to receive news on collaborations, exclusive offers and new arrivals.
        </p>
        
        <Form ref={c => { this.form = c }}>
          <div className="flex">
            <Input validations={[vl.required]} name="name" type="text" placeholder="Name" className="w-2/5 mx-2 relative"/>
            <Input validations={[vl.required, vl.email]} name="email" type="text" placeholder="Email" className="w-2/5 mx-2 relative"/>
            <SubmitButton
                onClick={this.submit}
                onErrors={this.onErrors}
                className={`active border-2 p-3 border-black w-1/5 mx-2`}>
                  SIGN UP
            </SubmitButton>
          </div>
        </Form>
      </div>
      </div>
    );
  }
}

export default NewsletterSignup;