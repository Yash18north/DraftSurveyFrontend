import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const InputEmail = ({ field }) => {
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
    characterLimit,
    icon,
    fieldWidth,
    pattern,
    renderTable,
    errorMsgs,
    actionClicked,
    styleName,
    upperClass,
    isPatternMessage,
    handleFieldBlur,
  } = field;

  const [errorMsg, setErrorMsg] = useState("");
  useEffect(() => {
    let newPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const regex = new RegExp(newPattern);

    if (value) {
      if (regex.test(value)) {
        setErrorMsg("");
      } else {
        setErrorMsg(
          errorMsgs
            ? errorMsgs["pattern"]
            : "Please enter valid value for " + label
        );
      }
    } else if (required && !renderTable && value == "") {
      setErrorMsg(errorMsgs ? errorMsgs["required"] : label + " is required");
    }
  }, [value]);

  return (
    <div style={{ position: "relative" }}
      className={
        "form-group " + upperClass + (styleName !== " InputNum" ? " my-2" : "")
      }

    >
      {label && (
        <label htmlFor={name} style={{ width: `${25}%` }}>
          {label}
          <span className="required_mark"> {required ? ` *` : null}</span>
        </label>
      )}
      <div className={"w-" + (fieldWidth ?? "75") + " d-inline-block mx-2"}>
        <input
          type="email"
          id={name || label}
          name={name || label}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={"form-control rounded-2 "}
          readOnly={readOnly}
          title={tooltip}
          maxLength={characterLimit}
          pattern={pattern}
          onBlur={handleFieldBlur || null}
        />

        {icon ? (
          <i className={"bi bi-" + icon + " text-danger text-bold"}></i>
        ) : (
          <span></span>
        )}

        {errorMsg && (actionClicked || isPatternMessage) && (
          <p className="text-danger errorMsg">{errorMsg}</p>
        )}

        {error && (actionClicked || isPatternMessage) && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
};

InputEmail.propTypes = {
  field: PropTypes.object.isRequired,
};

export default InputEmail;
