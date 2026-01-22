import React from "react";
import PropTypes from 'prop-types';
const DropDown = ({ field }) => {
  const { name, label, options, required } = field;

  return (
    <div className="form-group my-2">
      <div className="select-entity">
      {label && (
        <label htmlFor={name} style={{ width: `${25}%` }}>
          {label}
          <span className="required_mark"> {required ? ` *` : null}</span>
        </label>
      )}

        <p>{options.join(" , ")}</p>
      </div>
    </div>
  );
};


DropDown.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string,
    label: PropTypes.string,
    required: PropTypes.string,
    options: PropTypes.array,
  }),
};

export default DropDown;
