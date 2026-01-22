import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import PropTypes from 'prop-types';

const DropDown = ({ field }) => {
  const { name, label, options, setGAData } = field;
  
  const allData = JSON.parse(localStorage.getItem("allData")) || [];

  const filteredOptions = options.filter((option) => {
    return !allData.some((item) =>  item[name]?.includes(option));
  });

  const initialSelectedOptions = allData[name] || [];

  const [selectedOptions, setSelectedOptions] = useState(
    initialSelectedOptions
  );

  const toggleOption = (option) => {
    let updatedOptions;
    if (selectedOptions.includes(option)) {
      updatedOptions = selectedOptions.filter((item) => item !== option);
    } else {
      updatedOptions = [...selectedOptions, option];
    }

    setSelectedOptions(updatedOptions);

    setGAData((prevData) => ({
      ...prevData,
      [name]: updatedOptions,
    }));
  };
  return (
    <div className="form-group my-2">
      <div className="select-entity">
      {label && (
        <label htmlFor={name} style={{ width: `${25}%` }}>
          {label}
          <span className="required_mark"> {field.required ? ` *` : null}</span>
        </label>
      )}

        <Dropdown className="dropdown_options form-control rounded-2">
          <Dropdown.Toggle id="dropdown-basic">
            {selectedOptions.length === 0
              ? "Select Options "
              : selectedOptions + " , "}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {(filteredOptions ?? options).map((option, index) => (
              <Dropdown.Item
                key={"Multi-Select"+index}
                onClick={() => toggleOption(option)}
                active={selectedOptions.includes(option)}
              >
                {option}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};


DropDown.propTypes = {
  field: PropTypes.object.isRequired,
};

export default DropDown;
