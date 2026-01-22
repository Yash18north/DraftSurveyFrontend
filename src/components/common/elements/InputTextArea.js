import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const InputText = ({ field }) => {
  const {
    name,
    label,
    value,
    onChange,
    required,
    error,
    placeholder,
    readOnly,
    tooltip,
    validation,
    icon,
    labelWidth,
    fieldWidth,
    pattern,
    actionClicked,
    viewOnly,
    characterLimit,
    upperClass,
    inputHeight,
    defaultValue
  } = field;

  const [errorMsg, setErrorMsg] = useState(false);
  useEffect(() => {
    const regex = new RegExp(pattern);
    if (value !== "") {
      if (regex.test(value)) {
        setErrorMsg(false);
      } else {
        setErrorMsg(true);
      }
    } else {
      setErrorMsg(false);
    }
  }, [value]);
  useEffect(() => {
    if (defaultValue ) {
      setTimeout(() => {
        onChange(defaultValue, 1)
      }, 10)
    }
  }, [defaultValue,]);
  useEffect(() => {
    if ((value === undefined || value === "") && required) {
      setErrorMsg(true);
    }
    else {
      setErrorMsg(false);
    }
  }, [value]);
  useEffect(() => {
    if (defaultValue) {
      setTimeout(() => {
        onChange(defaultValue, 1)
      }, 10)
    }
  }, [defaultValue]);
  return (
    <div className={"form-group my-2 " + upperClass} style={{ position: "relative" }}>
      {label && (
        <label htmlFor={name} style={{ width: labelWidth || `${25}%` }}>
          {label}
          <span className="required_mark"> {required ? ` *` : null}</span>
        </label>
      )}
      <div className={"w-" + (fieldWidth ?? "75") + " d-inline-block mx-2"}>
        <textarea
          id={name || label}
          name={name || label}
          value={
            (() => {
              try {
                const parsedValue = JSON.parse(value);
                return Array.isArray(parsedValue) ? parsedValue.join(", ") : value;
              } catch (error) {
                return value; // If parsing fails, return original value
              }
            })()
          }
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={"form-control rounded-2 " + (readOnly && "labelInput")}
          readOnly={readOnly}
          title={tooltip}
          pattern={validation?.pattern}
          disabled={viewOnly}
          maxLength={characterLimit || 8064}
          rows="6"
          style={{ height: inputHeight ?? inputHeight + 'px' }}
        />

        {icon ? (
          <i className={"bi bi-" + icon + " text-danger text-bold"}></i>
        ) : (
          <span></span>
        )}

        {errorMsg && actionClicked ? (
          <p className="text-danger errorMsg">{label} is Required</p>
        ) : null}

        {error && actionClicked && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
};

InputText.propTypes = {
  field: PropTypes.object.isRequired,
};
export default InputText;
