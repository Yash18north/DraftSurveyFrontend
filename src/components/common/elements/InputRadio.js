
import React, { useEffect } from "react";
import PropTypes from 'prop-types';

const InputRadio = ({ field }) => {
  const {
    name,
    label,
    error,
    tooltip,
    characterLimit,
    options,
    required,
    fieldWidth,
    onChange,
    value,
    actionClicked,
    viewOnly,
    defaultValue
  } = field;

  useEffect(() => {
    if (typeof defaultValue === "boolean" && !value) {
      onChange(defaultValue, 1);
    }
    else if (defaultValue && !value) {
      onChange(defaultValue, 1);
    }
  }, [options]);
  let newVal = value;
  if (name === "jrf_is_lab_capable" || name === "jrf_agrees_with_time") {
    if (value === "Yes" || value === true) {
      newVal = "Yes";
    } else {
      newVal = "No";
    }
  }
  return (
    <div className="form-group my-2 listform">
      {label && (
        <label htmlFor={name} style={{ width: `${25}%` }}>
          {label}
          <span className="required_mark"> {required ? ` *` : null}</span>
        </label>
      )}
      <div className={"w-" + (fieldWidth ?? "125") + " mx-2 radioOptions"}>
        {options.map((option, optionIndex) => {
          option = option?.label ? option : {
            label: option,
            value: option
          }
          if (typeof option.value === "boolean" && typeof newVal === "string") {
            newVal = newVal.toLowerCase() === "true";
          }
          return (
            <span className="radioOption" key={"radio" + optionIndex}>
              <input
                type="radio"
                id={name}
                name={name}
                value={option?.value}
                title={tooltip}
                maxLength={characterLimit}
                onChange={(e) => onChange(option?.value, 1)}
                // checked={Array.isArray(newVal) ? newVal.includes(option?.value) : option?.value == newVal}
                checked={option?.value == newVal}
                disabled={viewOnly}
              />
              {!field.isNoLabel && <label htmlFor={name}>{option?.label}</label>}
            </span>
          )
        })}
        {error && actionClicked && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
};


InputRadio.propTypes = {
  field: PropTypes.object.isRequired,
};

export default InputRadio;
