import React, { PureComponent } from 'react';
import { Formik, Form, Field, FastField } from 'formik';
import Modal from 'react-responsive-modal';
import {continents, countries as countriesJSON} from 'countries-list';
import removeAt from 'sugar/array/removeAt'
import insertAt from 'sugar/array/insert'
import CountriesSummary from './CountriesSummary';


const Zone = ({...props, name, countries, shippingRates}) => {
  
  return (
    <div>
      <div className="row">
        <h4>{name}</h4>
        <CountriesSummary countries={countries} />
        { 
          shippingRates.map( rate => {
            return(
            <div className="shipping-rate">
              <span>
                <h5>{rate.name}</h5>
                <p>{rate.description}</p>
                {rate.minimumSpend > 0 ? 
                  <p>
                    Available for {rate.minimumSpend} Kr. and up
                  </p>
                  : null}
              </span>
              <span>
                {rate.rateAmount} Kr.
              </span>
            </div>)
          }) 
        }
      </div>
     
    </div>
  )
}


class ShippingZones extends PureComponent {

  state={
    modal : false
  }

  toggleModal = (open, m) => {
    this.setState({
      modal: open,
      activeZone: m
    });
  }


  deleteItem = async (values, modal) => {
    const {deleteItem} = this.props;
    try {
      await deleteItem(values);
      this.setState({
        modal: modal,
      });
    } catch (error) {
      console.log(error)
    }
  }

  saveShippingRate = async (values) => {
    const {saveItem} = this.props;
    try {
      return await saveItem(values);
    } catch (error) {
      console.log(error)
    }
  }


  saveShippingZone = async (values) => {
    const {saveItem, fetchShippingZones} = this.props;
    try {
      await saveItem(values);
      fetchShippingZones({page:1,perPage:100});
      this.setState({
        modal: false,
      });
    } catch (error) {
      console.log(error)
    }
  }


  render() {
    const {modal, activeZone} = this.state;
    const {shippingZones, shippingMethods} = this.props;
    return (
      <div className="card padding">
        <h2>Shipping zones</h2>
        <p>
        Each shipping zone consists of a set of countries, and the available shipping rates for those countries.
        </p>
        <div className="flex-items halfs">
          {shippingZones.map(m => (
            <div key={m._id}>
              <button 
              onClick={_ => this.toggleModal(true, m)} 
              className="transparent item">
              <Zone {...m} />
              </button>
            </div>
           
          ))}
          <div>
          <button 
          onClick={_ => this.toggleModal(true)} 
          className="add item transparent center">
            <span>+</span>
          </button>
          </div>
        
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
            saveShippingRate={this.saveShippingRate}
            saveShippingZone={this.saveShippingZone}
            deleteItem={this.deleteItem}
            shippingMethods={shippingMethods}
            zone={activeZone}
          />
        </Modal>
      </div>
    );
  }
}


export default ShippingZones;



class ShippingZoneDetail extends PureComponent{

  valueGetters = { }

  updateOrCreate = async ({values, setSubmitting}) => {
    const { saveShippingZone, saveShippingRate } = this.props;
    try {
      const countries = JSON.stringify(this.getCountries());


      // first create shipping rates
      let newRates = await Promise.all(
        values.shippingRates.map(r => ({
          rate: r
        }))
        .map(async r => await saveShippingRate(r))
      );
      
      const rateIDs = [
        ...newRates.filter(r => !!r), 
      ].map(r => r._id);

      await saveShippingZone({zone: {
        ...values, 
        countries,
        shippingRates: rateIDs
      }});
    } catch (error) {
      console.log(error);
    }
    setSubmitting(false);
  }

  delete = async ({setSubmitting}) => {
    const { zone, deleteItem} = this.props;
    try {
      await deleteItem({zone});
    } catch (error) {
      console.log(error);
    }
    setSubmitting(false);
  }

  deleteShippingRate = async ({rate}) => {
    const { deleteItem} = this.props;
    try {
      await deleteItem({rate}, true);
    } catch (error) {
      console.log(error);
    }
  }

  registerValueGetter = (key, fun) => {
    this.valueGetters[key] = fun;
  }

  getCountries = () => {
    return this.valueGetters.countries();
  }


  render(){
    let { zone, shippingMethods } = this.props;
    zone = zone ? zone : {
      id: null,
      name: '', 
      shippingRates: [{
        name: "",
        shippingMethod: '',
        deliveryDescription: "",
        description: "",
        minimumSpend: 0,
        rateAmount: 0
      }],
      countries: [],
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
              
              <Countries 
                initialValues={zone.countries}
                registerValueGetter={this.registerValueGetter}
                />
              <ShippingRates 
              deleteShippingRate={this.deleteShippingRate}
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
  constructor(props){
    super(props);
    const { initialValues } = props;
    console.log(initialValues)
    this.state={
      search: "",
      countries: Object.keys(countriesJSON).map(c => ({
        ...countriesJSON[c],
        id: c,
        selected: initialValues.some(v => v.id === c)
      }))
    }
  
  }

  
  componentDidMount(){
    const {registerValueGetter} = this.props;
    resizeAllGridItems();
    window.addEventListener("resize", resizeAllGridItems);
    registerValueGetter('countries', _ => {
      return this.state.countries.filter(c => c.selected).map(c => ({
        id: c.id,
        name: c.name
      }))
    });
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

  continentShouldShow = (continent) => {
    const {search, countries} = this.state;
    return countries.some(c => c.continent === continent ? c.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 : false)
  }

  render(){ 
    const { search, countries } = this.state;
    const {values, setValues} = this.props;
    
    return (
      <div className="continents-wrapper">
      <div className="row">
        <h2 style={{marginRight: '1em'}}>
          Countries
          </h2>
          <CountriesSummary countries={countries.filter(c => c.selected)} />
        <div className="search">
          <input type="text" placeholder="Search" onChange={this.search}/>
        </div>
      </div>
      
      <div className="continents">


      <ol className="masonry">
        {Object.keys(continents)
        .filter(this.continentShouldShow)
        .map(con => {
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
             
              <ol className="countries">
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
        shippingMethod: '',
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


  removeRate = (idx, rate) => {
    const { values, setValues, deleteShippingRate } = this.props;

    setValues({
      ...values,
      shippingRates : removeAt(values.shippingRates, idx)
    });

    deleteShippingRate({rate});
  }



  render(){ 
    const { values, setValues, shippingMethods } = this.props;

    return (
      <div className="margin-bottom">
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
                  removeRate={idx => this.removeRate(idx, s)}
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
          Add new rate
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
          value={shippingMethod}
          id={entity.key+'.shippingMethod'}
          onChange={this.onShippingMethodSelected}
        >
        <option disabled value="" />
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