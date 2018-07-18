import React, { Component } from 'react';
import './index.css';

class Options extends Component {
  constructor(props){
    super(props);
    this.state={
      selected: null
    }
  }


  onChange = (value) => {
    this.setState({
      selected: value.id
    });
    this.props.onChange && this.props.onChange(value)
  }
  

  render() {
    const { selected } = this.state;
    const { options } = this.props;

    return (
      <div>
        <ul className="flex flex-wrap">
          {
            options.map( o => {
              return <li key={o.label}>
                <button
                className={`${o.id === selected ? 'active' : ''} option-button relative bg-transparent font-medium py-2 px-6 mr-2 my-1 w-auto`}
                onClick={_=>this.onChange(o)}
                disabled={o.disabled}
                >      
                {o.label}
              </button>
              </li>
            })
          }
        </ul>
      </div>
    );
  }
}

export default Options;