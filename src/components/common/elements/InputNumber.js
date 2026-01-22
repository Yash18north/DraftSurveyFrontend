import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const InputNumber = ({ field }) => {
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
    fieldWidth,
    minValue,
    maxValue,
    pattern,
    errorMsgs,
    actionClicked,
    styleName,
    handleFieldBlur,
    upperClass,
    isSubTitle,
    defaultValue,
    allFileds
  } = field;

  const [errorMsg, setErrorMsg] = useState("");
  const minMaxCondition = styleName !== "InputNum";
  useEffect(() => {
    const regex = new RegExp(pattern);

    if (value !== "") {
      if (regex.test(value)) {
        setErrorMsg("");
      } else {
        setErrorMsg(
          errorMsgs
            ? errorMsgs["pattern"]
            : "Please enter valid value for " + label
        );
      }
    } else if (required) {
      setErrorMsg(errorMsgs ? errorMsgs["required"] : label + " is required");
    }
  }, [value]);
  const handleOnchangeEvent = (e) => {
    if (characterLimit) {
      let newValue = e.target.value;
      if (newValue >= 0) {
        e.target.value = newValue
      }
      else {
        e.target.value = Math.abs(newValue);
      }
    }
    if (allFileds.isOnlyNumber) {
      const { value } = e.target;
      const numberPattern = /^\d*$/;
      if (!numberPattern.test(value)) {
        e.target.value=parseInt(value)
      }
    }
    onChange(e)
  }
  const inputRef = useRef(null);
  const preventScroll = (e) => {
    e.target.blur()
  };
  useEffect(() => {
    if (defaultValue) {
      onChange(defaultValue, 1)
    }
  }, [defaultValue]);
  return (
    <div
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
          type="number"
          id={name}
          name={name}
          value={value}
          onChange={handleOnchangeEvent}
          onWheel={preventScroll} // Disable scroll behavior
          onWheelCapture={(e) => e.preventDefault()}
          required={required}
          placeholder={placeholder}
          className={"form-control rounded-2 " + (readOnly ? "labelInput" : "")}
          readOnly={readOnly}
          title={tooltip}
          maxLength={characterLimit}
          onBlur={handleFieldBlur || null}
          {...(minMaxCondition && { min: minValue || 0, max: maxValue || 999999999999999 })}
          style={{ width: "100%" }}
          step="1"
          onKeyDown={(e) => {
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
              e.preventDefault();
            }
          }}
        />

        {errorMsg && actionClicked ? (
          <p className="text-danger errorMsg">{errorMsg}</p>
        ) : null}
        {error && actionClicked && <p className="text-danger">{error}</p>}
      </div>
      {name === "jrf_finalize_timeframe" && <label htmlFor="days">Days</label>}
      {isSubTitle && <label htmlFor="days">{isSubTitle}</label>}
    </div>
  );
};

InputNumber.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.any, // Use `any` if the value can be of any type
    onChange: PropTypes.func,
    required: PropTypes.bool,
    error: PropTypes.string,
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
    tooltip: PropTypes.string,
    characterLimit: PropTypes.number,
    fieldWidth: PropTypes.string,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
    pattern: PropTypes.string,
    errorMsgs: PropTypes.arrayOf(PropTypes.string),
    actionClicked: PropTypes.func,
    styleName: PropTypes.string,
    handleFieldBlur: PropTypes.func,
    upperClass: PropTypes.string,
  }),
};
export default InputNumber;
