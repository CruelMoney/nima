import React, { PureComponent } from 'react';
import { Formik, Form, Field, FastField } from 'formik';
import Modal from 'react-responsive-modal';
import {continents, countries as countriesJSON} from 'countries-list';
import removeAt from 'sugar/array/removeAt'
import insertAt from 'sugar/array/insert'

class ShippingZones extends PureComponent {

  state={
    modal : false
  }

  toggleModal = (open, m) => {
    this.setState({
      modal: open,
      activeMethod: m
    });
  }

  render() {
    const {modal, activeMethod} = this.state;
    const {shippingZones, saveItem, shippingMethods} = this.props;
    return (
      <div className="card padding">
        <h2>Shipping zones</h2>
        <div className="flex-items">
          {shippingZones.map(m => (
             <button 
             onClick={_ => this.toggleModal(true, m)} 
             className="add transparent item">
              <h4>{m.name}</h4>
              <p>{m.description}</p>
              <p>{m.deliveryDescription}</p>
            </button>
          ))}
          <button 
          onClick={_ => this.toggleModal(true)} 
          className="add transparent">
            <span>+</span>
          </button>
        </div>
        <Modal 
          classNames={{
            modal: 'modal shipping-modal',
            overlay: 'modal-background'
          }}
          open={modal}
          onClose={_ => this.toggleModal(false)} 
          center>
          <ShippingZoneDetail 
            items={shippingZones}
            saveItem={saveItem}
            method={activeMethod}
            shippingMethods={shippingMethods}
          />
        </Modal>
      </div>
    );
  }
}


export default ShippingZones;



class ShippingZoneDetail extends PureComponent{


  updateOrCreate = async ({values, setSubmitting}) => {
    const { saveItem } = this.props;
    try {
      await saveItem({method: values});
    } catch (error) {
      console.log(error);
    }
    setSubmitting(false);
  }


  render(){
    let { zone, shippingMethods } = this.props;
    zone = zone ? zone : {
      id: null,
      name: '', 
      shippingRates: [],
      countries: {},
      continents: {},
    };

    return (
    <div>
        <h1>Add shipping zone</h1>
        <Formik
          initialValues={zone}
          validate={values => {
            let errors = {};
            // if (!values.name) {
            //   errors.name = 'Required';
            // } else if (
            //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            // ) {
            //   errors.email = 'Invalid email address';
            // }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            this.updateOrCreate({
              values, setSubmitting
            });
          }}
        >
          {({ values, errors, touched, isSubmitting, setValues, setSubmitting }) => {
            return(
            <Form className="nima-form">
              <label htmlFor="name">
                Name
                <Field type="text" name="name" />
              </label>
              {errors.name && touched.name && errors.name}
              
              <Countries values={values} setValues={setValues}/>
              <ShippingRates 
              values={values} 
              setValues={setValues}
              shippingMethods={shippingMethods}
              />

                <div className="buttons">
                <button 
                  type="button" 
                  className="warning" 
                  disabled={isSubmitting}
                  onClick={_ => this.delete({setSubmitting})}
                  >
                  Delete zone
                </button>

                <button type="submit" disabled={isSubmitting}>
                  Save zone
                </button>
              </div>
            </Form>
          )}}
        </Formik>
      </div>
    )}
} 




function resizeGridItem(item){
  const grid = document.getElementsByClassName("masonry")[0];
  const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
  const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
  const rowSpan = Math.ceil((item.querySelector('.content').getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
  item.style.gridRowEnd = "span "+rowSpan;
}

function resizeAllGridItems(){
  const allItems = document.getElementsByClassName("masonry-item");
  for(let x=0;x<allItems.length;x++){
     resizeGridItem(allItems[x]);
  }
}


class Countries extends PureComponent{
  state={
    search: "",
    countries: Object.keys(countriesJSON).map(c => ({
      ...countriesJSON[c],
      id: c,
      selected: false
    }))
  }

  componentDidMount(){
    resizeAllGridItems();
    window.addEventListener("resize", resizeAllGridItems);
  }

  componentWillUnmount(){
    window.removeEventListener("resize", resizeAllGridItems);
  }

  search = (e) => {
    this.setState({
      search: e.target.value
    }, resizeAllGridItems);
  }

  toggleCountry = (e, id) => {
    const checked = e.target.checked;
    this.setState(state => ({
    ...state,
    countries: state.countries.map(c => c.id === id ? {...c, selected: checked} : c)
  }))};

  continentIsToggled = (continent) => {
    const { countries } = this.state;
    return countries.every(c => c.continent === continent ? c.selected : true);
  }
  continentIsSome = (continent) => {
    const { countries } = this.state;
    return countries.some(c => c.continent === continent ? c.selected : false);


  } 
  setContinentState = (r, continent) => {
    
    const all = this.continentIsToggled(continent);
    if(all && r){
      r.indeterminate = false;
      r.checked = true;
      return
    }
    const some = this.continentIsSome(continent);
    if(some && r){
      r.checked = false;
      r.indeterminate = true;
      return;
    }
    if(r){
      r.indeterminate = false;
      r.checked = false;
    }
    return;
  }

  toggleContinent = (e, continent) => {
    const checked = e.target.checked;
    this.setState(state => ({
    ...state,
    countries : state.countries.map(c => c.continent === continent ? {...c, selected : checked} : c)
  }))};

  render(){ 
    const { search, countries } = this.state;
    const {values, setValues} = this.props;

    return (
      <div className="continents-wrapper">
        <h2>
          Countries
        </h2>

        <div className="search">
          <input type="text" placeholder="Search" onChange={this.search}/>
        </div>
      <div className="continents">


      <ol className="masonry">
        {Object.keys(continents).map(con => {
          return(
            <li className="masonry-item" key={con}>
              <div className="content">
              <label htmlFor={`continents.${con}`}> 
                <input
                  ref={r => this.setContinentState(r, con)}
                  name={`continents.${con}`}
                  id={`continents.${con}`}
                  component="input" 
                  type="checkbox"
                  onChange={e => this.toggleContinent(e, con)}
                  />
                  <h3>{continents[con]}</h3>
              </label>
             
              <ol>
                {countries
                .filter(c => c.continent === con)
                .filter(c => c.name.toLowerCase().indexOf(search.toLowerCase()) !== -1)
                .map(c => {
                  return(
                    <li key={c.id}>
                      <label htmlFor={`countries.${c.id}`}> 
                        <input 
                          name={`countries.${c.id}`}
                          id={`countries.${c.id}`}
                          component="input" 
                          type="checkbox"
                          checked={c.selected}
                          onChange={e => this.toggleCountry(e, c.id)}
                          />
                          <span>{c.emoji}</span> 
                          <span>{c.name}</span> 
                      </label>
                    </li>
                  )
                })}
              </ol>
              </div>
            </li>
        )})}
      </ol>
      </div>
      </div>
  )}
}



class ShippingRates extends PureComponent{

  addNew = () => {
    const { values, setValues } = this.props;
    setValues({
      ...values,
      shippingRates : [...values.shippingRates, {
        name: "",
        shippingMethod: null,
        deliveryDescription: "",
        description: "",
        minimumSpend: 0,
        rateAmount: 0
      }]
    });
  }

  setShippingMethod = (idx, shippingMethodID) => {
    const { values, setValues, shippingMethods } = this.props;
    const rate = values.shippingRates[idx];
    const method = shippingMethods.find(s => s._id === shippingMethodID);
    const newRate = {
      ...rate,
      name: method.name,
      shippingMethod: method._id,
      description: method.description,
      deliveryDescription: method.deliveryDescription,
    };

    let newShippingRates = removeAt(values.shippingRates, idx);
    newShippingRates = insertAt(newShippingRates, newRate, idx);

    setValues({
      ...values,
      shippingRates : newShippingRates
    });
  }


  removeRate = (idx) => {
    const { values, setValues } = this.props;

    setValues({
      ...values,
      shippingRates : removeAt(values.shippingRates, idx)
    });
  }



  render(){ 
    const { values, setValues, shippingMethods } = this.props;

    return (
      <div>
        <h2>
          Available shipping rates
        </h2>
      
      <ol className="shipping-rates">
        
        {values.shippingRates.map((s, idx) => {
         return(
            <li key={`shippingRates[${idx}]`}>
              <hr/>
                <ShippingRate 
                  {...s}
                  shippingMethods={shippingMethods}
                  setShippingMethod={methodID => this.setShippingMethod(idx, methodID)}
                  removeRate={this.removeRate}
                  entity={{
                    idx,
                    key: `shippingRates[${idx}]`
                }}
              />
            </li>  
          )        
        })}

      
      </ol>
        
      <hr/>

        <button  type="button" className="transparent" onClick={this.addNew}>
        +
        </button>

      </div>
  )}
}

class ShippingRate extends PureComponent{

  onShippingMethodSelected = (e) => {
    const {setShippingMethod} = this.props;
    const methodID = e.target.value;
    setShippingMethod(methodID);
  }

  render(){
    const { 
      name,
      shippingMethod,
      deliveryDescription,
      description,
      minimumSpend,
      rateAmount,
      entity,
      shippingMethods,
      removeRate
    } = this.props;

    return( 
    <div className="shipping-rate">
    <div className="row space-between">
      <h3>
        {entity.idx + 1}. {name}
      </h3>
      <button 
        type="button" 
        className="warning" 
        onClick={_ => removeRate(entity.idx)}
        >
        Remove
      </button>
    </div>
  
      <div className="flex-items">
      
      <label htmlFor={entity.key+'.shippingMethod'}> 
        Shipping method
        
        <select 
          defaultValue
          id={entity.key+'.shippingMethod'}
          onChange={this.onShippingMethodSelected}
        >
        <option disabled  value />
          { 
            shippingMethods.map(m => (
              <option 
              key={m._id}
              value={m._id}>{m.name}
              </option>
            ))
          }
        </select>
      </label>

      <label htmlFor={entity.key+'.minimumSpend'}> 
        Minimum spend
        <Field 
          name={entity.key+'.minimumSpend'}
          id={entity.key+'.minimumSpend'}
          component="input"
          type="number" 
          min="0"
          placeholder="Minimum spend"
          />
         </label>
        <label htmlFor={entity.key+'.rateAmount'}> 
        Rate amount
        <Field 
          name={entity.key+'.rateAmount'}
          id={entity.key+'.rateAmount'}
          component="input"
          type="number" 
          min="0"
          placeholder="Rate amount"
          />
        </label>

      </div>
      <div className="flex-items">

          <label htmlFor={entity.key+'.name'}> 
            Name
            <Field 
            name={entity.key+'.name'}
            id={entity.key+'.name'}
            component="input" 
            placeholder="Express shipping"
            />
          </label>

          <label htmlFor={entity.key+'.deliveryDescription'}> 
            Delivery description
            <Field 
              name={entity.key+'.deliveryDescription'}
              id={entity.key+'.deliveryDescription'}
              component="input" 
              placeholder="Delivered within 3 working days"
              />
        </label>

        <label htmlFor={entity.key+'.description'}> 
          Description
          <Field 
            name={entity.key+'.description'}
            id={entity.key+'.description'}
            component="input" 
            placeholder="To door delivery with Post Nord"
            />
        </label>

      </div>
    </div>
  )}
}