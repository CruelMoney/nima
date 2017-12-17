import React, { Component } from 'react';

class Options extends Component {

  state={
    selected: null
  }

  onChange = (value) => {
    this.setState({
      selected: value
    });
    this.props.onChange && this.props.onChange(value)
  }

  render() {
    const { options } = this.props;

    return (
      <ul className="flex">
        {
          options.map( o => {
            return <li key={o.label}>
              <button
              className={`${o.value === this.state.selected ? 'active' : ''} bg-transparent border hover:border-transparent hover:text-white font-bold py-2 px-6 mr-2`}
              onClick={()=>{this.onChange(o.value)}}
              disabled={!!o.disabled}
              >
              {o.label}
            </button>
            </li>
          })
        }
      </ul>
    );
  }
}

export default Options;