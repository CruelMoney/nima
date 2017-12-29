import React from 'react';
import PropTypes from 'prop-types';
import { button } from 'react-validation';

const Button = ({ hasErrors, ...props }) => {
  
  const handleClick = (e) => {
    e.preventDefault();
    
    if(!hasErrors && props.onClick){
      props.onClick(e);
    }else{
      props.onErrors(e);
    }
  }

  return (
    <button {...props} onClick={handleClick}  />
  );
};

Button.contextTypes = {
  hasErrors: PropTypes.bool
};

export default button(Button);