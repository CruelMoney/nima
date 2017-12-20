import React, { Component } from 'react';
import './index.css';

class Options extends Component {

  state={
    selected: null,
    options: [],
  }

  componentWillMount(){
    this.setState({
      options: this.props.options
    })
  }

  onChange = (value) => {
    this.setState({
      selected: value
    });
    this.props.onChange && this.props.onChange(value)
  }

  editOption = (optionKey, valueKey, value) => {
    const idx = this.state.options.findIndex(o =>o.value === optionKey);
    const exists = idx !== -1;
    const option = exists ? this.state.options[idx] : {};
    option[valueKey] = value;

    const newOptions = this.state.options;
    if(exists){
      newOptions[idx] = option;
    }else{
      newOptions.push(option);
    }
    this.setState({
      options: [...newOptions]
    })
  }

  addOption = () =>{
    this.setState({
      options: [
        ...this.state.options,
        {
          label: "label",
          value: "key",
          stock: 0
        }
      ]
    })
  }

  removeOption = (key) => {
    this.setState({
      options: this.state.options.filter(o=>o.value !== key)
    })
  }

  render() {
    const { options, selected } = this.state;
    const { editMode } = this.props;

    return (
      <ul className="flex flex-wrap">
        {
          options.map( o => {
            return <li key={o.label}>
              <button
              className={`${o.value === selected ? 'active' : ''} option-button relative bg-transparent border hover:border-transparent hover:text-white font-bold py-2 px-6 mr-2`}
              onClick={()=>{this.onChange(o.value)}}
              disabled={o.stock <= 0}
              >
              {
                editMode ?
                <span 
                className="delete-option"
                onClick={()=>this.removeOption(o.value)}>
                x
                </span>
                : null
              }
             
              {o.label}
            </button>
            </li>
          })
        }
        {editMode ? 
          <li>
            <button onClick={this.addOption}>+</button>
          </li>
        : null}
      </ul>
    );
  }
}

export default Options;