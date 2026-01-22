import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const InputMobile = ({ field }) => {
  const {
    name,
    label,
    value,
    onChange,
    required,
    error,
    placeholder,
    readOnly,
    pattern,
    actionClicked,
  } = field;

  const [errorMsg, setErrorMsg] = useState(false);
  const validatePhoneNumber = (value) => {
    const indianPhoneRegex = /^(?:\+91)?\d{10}$/; // Regular expression for Indian mobile numbers with +91 prefix
    if (!indianPhoneRegex.test(value)) {
      setErrorMsg(true);
      return;
    }
    setErrorMsg(false);
  };
  useEffect(() => {
    if (value !== "") {
      validatePhoneNumber(value);
    } else {
      setErrorMsg(false);
    }
  }, [value]);
  return (
    <div className="form-group my-2">
        {label && (
        <label htmlFor={name} style={{ width: `${25}%` }}>
          {label}
          <span className="required_mark"> {required ? ` *` : null}</span>
        </label>
      )}
      <div className="w-75 d-inline-block mx-2">
        <input
   
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="form-control rounded-2"
          placeholder={placeholder}
          readOnly={readOnly}
          title="Enter a 10-digit phone number (e.g., 1234567890)."
          maxLength={13}
          pattern={pattern}
        />
        {errorMsg && actionClicked ? (
          <p className="text-danger errorMsg">
            please enter valid value for {label}
          </p>
        ) : null}
        {error && actionClicked && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
};

InputMobile.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
    error: PropTypes.string,
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
    pattern: PropTypes.string,
    actionClicked: PropTypes.func,
  }).isRequired,
};
export default InputMobile;
