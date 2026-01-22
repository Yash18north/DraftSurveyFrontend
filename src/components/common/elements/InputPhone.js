import React, { useEffect, useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import PropTypes from "prop-types";

import "react-phone-number-input/style.css";

const InputPhone = ({ field }) => {
  const {
    name,
    label,
    value,
    onChange,
    required,
    errorMessage,
    readOnly,
    tooltip,
    pattern,
    actionClicked,
    isPatternMessage,
    fieldWidth,
    placeholder
  } = field;



  const [errorMsg, setErrorMsg] = useState(false);
  const [mobileValue, setmobileValue] = useState(value || "");
  useEffect(() => {
    const regex = new RegExp(pattern);
    if (mobileValue) {
      if (!isValidPhoneNumber(mobileValue)) {
        setErrorMsg(
          errorMessage
            ? errorMessage["pattern"]
            : "Please enter valid value for " + label
        );
      }
      else {
        if (regex.test(mobileValue)) {
          setErrorMsg("");
        } else {
          setErrorMsg(
            errorMessage
              ? errorMessage["pattern"]
              : "Please enter valid value for " + label
          );
        }
      }
    } else {
      if (required) {
        setErrorMsg(errorMessage ? errorMessage["required"] : label + " is required");
      }
    }
  }, [mobileValue]);

  useEffect(() => {
    onChange(mobileValue);
  }, [mobileValue]);
  useEffect(() => {
    setmobileValue(value);
  }, [value]);
  return (
    <div className="form-group my-2">
      {label && (
        <label htmlFor={name} style={{ width: `${25}%` }}>
          {label}
          <span className="required_mark"> {required ? ` *` : null}</span>
        </label>
      )}
      <div className={"w-" + (fieldWidth ?? "75") + " d-inline-block mx-2"}>
        <PhoneInput
          placeholder={placeholder ? placeholder : "Enter phone number"}
          id={name}
          name={name}
          defaultCountry="IN"
          value={mobileValue || value}
          onChange={setmobileValue}
          required={required}
          className="form-control rounded-2"
          readOnly={readOnly}
          title={tooltip}
        />

        {errorMsg && (actionClicked || isPatternMessage) && (
          <p className="text-danger errorMsg">{errorMsg}</p>
        )}
      </div>
    </div>
  );
};
InputPhone.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string, // Phone numbers are typically strings
    onChange: PropTypes.func,
    required: PropTypes.bool,
    error: PropTypes.string,
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
    tooltip: PropTypes.string,
    characterLimit: PropTypes.number,
    pattern: PropTypes.string, // Regex pattern, usually a string
    actionClicked: PropTypes.func,
  })
};
export default InputPhone;
