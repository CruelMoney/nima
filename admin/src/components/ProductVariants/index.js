import React, { Component } from 'react';
import './index.css';

var colorArray = [
  "rgba(229, 89, 52, 1)",
  "rgba(91, 192, 235, 1)",
  "rgba(155, 197, 61, 1)",
  "rgb(252, 222, 0)",
  "rgba(250, 121, 33, 1)",
];

const combinationToId = combination => combination.map(c => c.label).join('_').toUpperCase();

const getNextVariantId = options => {
  const max = Object.values(options)
                .map(o => o.variants.map(v => v.id))
                .flatten()
                .add(0)
                .max();
  return max + 1; 
}

const optionsContainsVariation = (options, vId) => {
  return Object.values(options)
    .map(o => o.variants.map(v => v.id))
    .flatten()
    .includes(vId);
}

class index extends Component {
  constructor(props){
    super(props);
    this.state = {
      error: null,
      success: null,
      options: props.product.options
    }
  }

  removeOption = (o) => {
    const confirmed = window.confirm("This will remove all variants that use this option.");
    if(confirmed){
      let {[o.name]: omit, ...res} = this.state.options;
      this.setState(state => ({
        options: res
      }));
    }
  }

  removeVariant = (variant, o) => {
    const confirmed = window.confirm(`This will remove all variants that are "${variant.label}".`);
    if(confirmed){
      this.setState(state => ({
        options: {
          ...state.options,
          [o.name] : {
            ...o,
            variants: o.variants.filter(v => variant.label !== v.label)}
        }
      }));
    }
  }

  addVariant = (v, o) => {
    this.setState(state => {
      v = {
        ...v,
        id: getNextVariantId(state.options),
        label: v.label.toLowerCase()
      }
      const newVariants = ([...o.variants, v]).unique(v => v.label);
      
      return {
        options: {
          ...state.options,
          [o.name] : {
            ...o,
            variants: newVariants
          }
        }
      }
    });
  }

  addOption = (o, color) => {
    if(!this.state.options[o]){
      this.setState(state => ({
        options: {
          ...state.options,
          [o] : {
            name: o,
            variants: [],
            color: color
          }
        }
      }));
    }
  }

  editOptionName = (name, option) => {
    const {options} = this.state;
    if(!options[name]){
      let {[option.name]: omit, ...res} = options;
      this.setState({
        options: {
          ...res,
          [name] : {
            ...option,
            name: name
          }
        }
      });
    }
  }


  render() {
    const {removeVariant, addVariant, editOptionName, removeOption} = this;
    const {success, error, options} = this.state;
    const {product, closePopup} = this.props;
    const renderOptions = Object.values(options);

    return (
      <div>
        <h3>
          Variants
        </h3>
        <p>
          Add or edit variants, or update the current stock.
        </p>

        <div className="grey-background">
          
          <div className="form-group option">
            <div>
              <label>Option name</label>
            </div>
            
            <div>
              <label>Option values</label>
            </div>
            <div>
            
            </div>
          </div>

          {renderOptions.map((o, idx) => <Option 
            key={"option-"+idx+o.name}
            color={o.color}
            removeVariant={removeVariant}
            addVariant={addVariant}
            changeName={editOptionName}
            removeOption={removeOption}
            option={o} 
            /> )}

          <button onClick={()=>this.addOption("", colorArray[renderOptions.length%5])}>
            Add new option
          </button>

          <div className="aggregated-variants">
            <p>
              Modify the variants to be created.
            </p>
            <AggregatedVariants
            options={options}
            product={product}
            closePopup={closePopup}
            />
          </div>

        </div>

        <span className="error">
          {error}
        </span>
        <span className="success">
          {success}
        </span>
      </div>
    );
  }
}

export default index;

class Option extends Component {
  constructor(props){
    super(props);
    this.variantInput = React.createRef();
    this.state={
      name: props.option.name
    }
  }

  addVariant = (event) => {
    const {addVariant, option} = this.props;
    const label = this.variantInput.current.value;
    if((event.type === 'blur' || event.key === 'Enter') && !!label){
      addVariant({
        label: label,
      }, option);
      this.variantInput.current.value = "";
    }
  }

  onInput = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  changeName = () => {
    const {changeName, option} = this.props;
    changeName(this.state.name, option);
  }

  render() {
    const {name} = this.state;
    const {option, removeVariant, color, removeOption} = this.props;
    return (
      <div className="form-group option">
        <div>
          <input 
            placeholder={"Size etc."}
            type="text" 
            value={name} 
            onChange={this.onInput}
            onBlur={this.changeName}
          />
        </div>

        <div className="variants" htmlFor="variant-input" onClick={()=>this.variantInput.current.focus()}>
          <Variants
            color={color}
            variants={option.variants}
            removeVariant={(v)=>removeVariant(v, option)}
          />
          <input 
            ref={this.variantInput} 
            type="text" 
            id="variant-input" 
            name="variant-input"
            onKeyDown={this.addVariant}
            onBlur={this.addVariant}
          />
        </div>

        <div>
          <button 
          onClick={()=>removeOption(option)}
          className="transparent warning">
            Delete
          </button>
        </div>
        
      </div>
    );
  }
}



class Variants extends Component {
  render() {
    const {variants, removeVariant, color} = this.props;

    return (
      <div>
        {variants.map((v, idx)=>(
          <span 
          key={"variant-"+idx+v.label}
          className="status variant" style={{backgroundColor: color}}>
            {v.label}
            <span onClick={()=>removeVariant(v)} />
          </span>
        ))}
      </div>
    );
  }
}




class AggregatedVariants extends Component {

  constructor(props){
    super(props);

    this.state={
      variants: props.product.variants
    }
  }

  optionsToVariants = (options, product) => {
    options = Object.values(options);
    const variants = [];
    let idx = 0;

    const rec = (optionsRest, current) => {
      // Remove this option
      const option = optionsRest.shift(); 

      // Case where no variants, recursion should continue
      if(option.variants.isEmpty()){
        if(optionsRest.isEmpty()){
          !current.isInitial && variants.push(current);
        }else{
          rec([...optionsRest], current);
        }
      }

      // generate new variations
      option.variants.forEach(v => {
        const label = v.label.replace(/\s+/g, '_').toUpperCase();
        const combination = [...current.combination, {id: v.id, color: option.color, label: v.label}];
        const newCurrent = {
          id: combinationToId(combination),
          sort: idx++,
          sku: `${current.sku}_${label}`,
          price: product.price,
          inventory: 0,
          used: true,
          combination: combination
        }
        if(optionsRest.isEmpty()){
          return variants.push(newCurrent);
        }else{
          return rec([...optionsRest], newCurrent);
        }
      });
    }
    
    if(!options.isEmpty()){
      // Start recursion
      rec(options, {sku: product.SKU, combination: [], isInitial: true});
    }
   
    return variants;
  }

  getVariants = () => {
    const stateVariants = this.state.variants;
    const {options, product} = this.props;
    const variants = this.optionsToVariants(options, product);
    return [...stateVariants, ...variants]
            // variant might be both in state and from props if modified: take unique
            .unique(v => v.id) 
            // Filter if options does not contain the combination anymore 
            .filter(v => v.combination.every(c => optionsContainsVariation(options, c.id)))
            .sortBy(v => v.sort);
  }

  onEditVariant = (v) => {
    this.setState(state=>({
      variants: [v, ...state.variants].unique(v => v.id)
      })
    );
  }

  save = () => {
    const { options, product } = this.props;
    const variants = this.getVariants();
    product.save({
      ...product,
      options, 
      variants
    });
  }
  
  
  render() {
    const {closePopup} = this.props;
    const variants = this.getVariants();

    return (
      <div>
        <div className="form-group final-variant">
        <div>
          </div>
          <div>
            <label>Variant</label>
          </div>
          <div>
            <label>SKU</label>
          </div>
          <div>
            <label>Price</label>
          </div>
          <div>
            <label>Inventory</label>
          </div>
       
        </div>
        {variants.map(v => (
          <FinalVariant 
            key={v.id}
            variant={v}
            onChange={this.onEditVariant}
          />)
        )}

        <div className="buttons">
          <button
            onClick={closePopup}
          >
            Cancel
          </button>
          <button 
            onClick={this.save}
          >
            Save
          </button>
        </div>
       

      </div>
      
    );
  }
}



class FinalVariant extends Component {
  
  onChange = (e) => {
    const {variant, onChange} = this.props;
    const key = e.target.name;
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    onChange({
      ...variant,
      [key] : val
    });
  }

  render() {
    const {variant} = this.props;
    let {
      combination,
      sku,
      price,
      inventory,
      used
    } = variant;

    return (
      <div className={`form-group final-variant ${used ? "" : "not-used"}`}>
             <div>
              <input 
                type="checkbox"
                checked={used} 
                name="used"
                onChange={this.onChange}
              />
            </div>
            <div>
              
              <label>
                {combination.map((c, idx) => (
                  <React.Fragment key={sku+"-"+idx}>
                  <span className="combination" style={{color: c.color}}>
                    {c.label}
                  </span>
                  {idx < combination.length-1 ? " • " : ""}
                  </React.Fragment>
                ))}
              </label>
            </div>
            <div>
              <input 
                type="text" 
                value={sku} 
                name="sku"
                onChange={this.onChange}
              />
            </div>
            <div>
              <input 
                type="number" 
                value={price}
                name="price" 
                onChange={this.onChange}
              />
            </div>
            <div>
              <input 
                type="number" 
                value={inventory} 
                name="inventory"
                onChange={this.onChange}
              />
            </div>
           
          </div>
    );
  }
}
