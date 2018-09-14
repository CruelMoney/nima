import React, { Component } from 'react';
import Form from 'react-validation/build/form';
import SubmitButton from '../../../components/SubmitButton';
import Input from '../../../components/Input';
import * as vl from '../../../utils/validators';

class Information extends Component {
  state={
    optEmail: false,
    country: null,
    zoneID: null,
    errors: {},
    countryID: ''
  }

  continue = () => {
    const {country, zoneID} = this.state;
    const conuntryValid = this.validateCountry();
    this.form.validateAll();
    if(conuntryValid){
      const values = this.form.getValues();
      this.props.onSubmit && this.props.onSubmit({
        ...values,
        country,
        zoneID,
        newsletter_subscribe : values.newsletter_subscribe === "true"
      });
    }
  }

  validateCountry = () => {
    const {country, zoneID} = this.state;
    if(!country || !zoneID){
      this.setState(state => ({
        errors : {
          ...state.errors,
          country: "Påkrævet"
        }
      }));
      return false;
    }
    return true;
  }

  onErrors = () => {
    this.form.validateAll();
    this.validateCountry();
  }

  toggleOptEmail = () => {
    this.setState({
      optEmail: !this.state.optEmail
    })
  }

  selectCountry = (e) => {
    const {availableCountries} = this.props;
    const country = availableCountries.find(c => c.id === e.target.value);
    this.setState({
      country: country.name,
      zoneID: country.zone,
      countryID: country.id
    });
  }

  render() {
    const { optEmail, errors, countryID } = this.state;
    const { active, availableCountries } = this.props;

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
                  <label htmlFor="subscribe">Tilmeld nyhedsbrev</label>
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
              <select 
              onChange={this.selectCountry}
              value={countryID} >
                <option disabled value="">Land</option>
                {availableCountries.sort((x,y) => (x.name.localeCompare(y.name))).map(c => (
                  <option 
                    key={c.id}
                    value={c.id}
                  >
                    {c.name}
                  </option>
                ))}
              </select>
              <span className="error">{errors.country && errors.country}</span>
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