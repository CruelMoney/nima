import React, { Component } from 'react';
import Modal from 'react-modal';
import './index.css';

class Options extends Component {

  state={
    selected: null,
    options: [],
    openOption: {},
    modalIsOpen: false,
    isExistingOption: false
  }

  componentDidMount(){
    Modal.setAppElement('body');
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

  editOption = (key) => {
    this.setState({
      openOption: {
        ...this.state.options.find(o => o.label === key)
      },
      isExistingOption: true,
      modalIsOpen: true
    });
  }

  editOptionValue = (event) => {
    const { value, name } = event.target;

    this.setState({
      openOption:{
        ...this.state.openOption,
        [name]: value
      }
    });
    
  }

  addOption = () =>{
    this.setState({
      openOption: {
          label: "variation",
          stock: 0
      },
      isExistingOption: false,
      modalIsOpen: true
    })
  }

  removeOption = (key) => {
    this.setState({
      options: this.state.options.filter(o=>o.label !== key)
    })
  }

  cancelOption = () => {
    this.setState({
      modalIsOpen: false,
      openOption: {}
    })
  }

  saveOption = () => {
    const { label } = this.state.openOption;
    const idx = this.state.options.findIndex(o =>o.label === label);
    const exists = idx !== -1;
    const newOptions = this.state.options;

    if(exists){
      newOptions[idx] = this.state.openOption;
    }else{
      newOptions.push(this.state.openOption);
    }
    this.setState({
      options: [...newOptions],
      modalIsOpen: false
    })
  }

  render() {
    const { options, selected, isExistingOption } = this.state;
    const { editMode } = this.props;

    return (
      <div>
        <ul className="flex flex-wrap">
          {
            options.map( o => {
              return <li key={o.label}>
                <button
                className={`${o.label === selected ? 'active' : ''} option-button relative bg-transparent font-medium py-2 px-6 mr-2`}
                onClick={()=>{
                  if(editMode){
                    this.editOption(o.label)
                  }else{
                    this.onChange(o.label)
                  }
                }}
                disabled={o.stock <= 0 && !editMode}
                >      
                {o.label}
              </button>
              </li>
            })
          }
          {editMode ? 
            <li>
              <button 
              className={`option-button relative bg-transparen font-medium py-2 px-6 mr-2`}
              onClick={this.addOption}>+</button>
            </li>
          : null}
        </ul>
        <Modal
          isOpen={this.state.modalIsOpen}
        > 
          <div className="flex flex-col items-center justify-center">
            <h2>Add option</h2>
            <div className="flex flex-col">
              <label className="my-4">Name
                <input className="ml-2 border p-2" type="text" name="label" value={this.state.openOption.label} onChange={this.editOptionValue}/>
              </label>
              <label className="mb-4">Stock
                <input  className="ml-2 border p-2" type="number" min="0" name="stock" value={this.state.openOption.stock} onChange={this.editOptionValue}/>
              </label>
            </div>

            <div className="flex">
              <button className="bg-red hover:bg-red-dark text-white font-medium py-2 px-4 mr-4" onClick={()=>this.removeOption(this.state.openOption.label)}>
                DELETE
              </button>
              <button className="bg-blue hover:bg-blue-dark text-white font-medium py-2 px-4 mr-4" onClick={this.cancelOption}>
                CANCEL
              </button>
              <button className="bg-blue hover:bg-blue-dark text-white font-medium py-2 px-4" onClick={this.saveOption}>
                {isExistingOption ? "SAVE" : "ADD"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Options;