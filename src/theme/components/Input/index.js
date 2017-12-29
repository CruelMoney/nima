import React from 'react';
import PropTypes from 'prop-types';
import { control } from 'react-validation';

const Input = ({ error, isChanged, isUsed, ...props }) => {
  const {children, ...rest} = props;

  return(<div 
  className={props.className}
  >
    <input {...rest} {...( isChanged && isUsed && error ? {
      className: `is-invalid-input`
    } : { className: '' } )} />
    {children}
    {isChanged && isUsed && error}
  </div>)
};

Input.propTypes = {
  error: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
};

export default control(Input);