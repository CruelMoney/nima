import React, { Component } from 'react';
import Input from '../Input';
import SubmitButton from '../SubmitButton';
import Form from 'react-validation/build/form';
import * as vl from '../../utils/validators';
import { signup } from '../../actions/newsletter';

class NewsletterSignup extends Component {
  state={
    signedUp:false,
    err: null
  }

  submit = async () => {
    this.form.validateAll();
    const values = this.form.getValues();

    try {
      await signup(values);
      this.setState({
        err: null,
        signedUp: true
      });
      setTimeout(this.props.hideNewsletter, 1000);
    } catch (error) {
      console.log(error)
      this.setState({
        err: "Something went wrong"
      })
    }
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
                disabled={this.state.signedUp}
                onClick={this.submit}
                onErrors={this.onErrors}
                className={`active border-2 p-3 border-black w-1/5 mx-2`}>
                 {
                   this.state.signedUp ? 
                   "ADDED"
                   :
                   "SIGN UP"
                }
            </SubmitButton>
          </div>
          <div className="error">
            {this.state.err}
          </div>
        </Form>
      </div>
      </div>
    );
  }
}

export default NewsletterSignup;