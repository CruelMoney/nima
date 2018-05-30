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
        err: "Noget gik galt"
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
          NIMA NYHEDSBREV
        </h3>

        <p>
          Tilmeld dig NIMA nyhedsbrevet for at modtage nyheder om collaborations, tilbud og nye produkter.
        </p>
        
        <Form ref={c => { this.form = c }}>
          <div className="flex flex-col sm:flex-row mb-2 sm:mb-16">
            <Input validations={[vl.required]} name="name" type="text" placeholder="Navn" className="sm:w-2/5 sm:mx-2 my-2 relative"/>
            <Input validations={[vl.required, vl.email]} name="email" type="text" placeholder="Email" className="sm:w-2/5 my-2 sm:mx-2 relative"/>
            <SubmitButton
                disabled={this.state.signedUp}
                onClick={this.submit}
                onErrors={this.onErrors}
                className={`active border-2 p-3 border-black sm:w-1/5 sm:mx-2 my-2`}>
                 {
                   this.state.signedUp ? 
                   "TILMELDT"
                   :
                   "TILMELD"
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