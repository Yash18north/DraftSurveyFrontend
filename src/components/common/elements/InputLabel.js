import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
const InputLabel = ({ field }) => {
  const {
    label,
    value,
    fieldWidth,
    headerLength,
    name,
    onChange,
    required,
    placeholder,
    tooltip,
    characterLimit,
    validation,
    styleName,
    centerAlign,
    upperClass,
    isForOnlyLabel,
    isCopy,
    defaultValue
  } = field;
  const inputRef = useRef(null);
  const [isChanged, setIsChanged] = useState(true);
  const handleCopy = () => {
    if (inputRef.current) {
      inputRef.current.select();
      navigator.clipboard.writeText(inputRef.current.value);
    }
  };
  useEffect(() => {
    if (defaultValue) {

      setIsChanged(false)
      setTimeout(() => {
        onChange(defaultValue, 1)
        setIsChanged(true)
      }, 10)
    }
  }, [defaultValue]);
  return (
    <div
      className={
        (centerAlign ? "form-group " : "form-group my-2 ") +
        upperClass +
        (styleName !== " InputNum" ? " my-2" : "")
      }
      style={{ position: "relative" }}
    >
      {label && (
        <label
          htmlFor={label}
          style={{ width: headerLength ? `${headerLength}` : "25%" }}
          className={styleName}
        >
          {label}{" "}
        </label>
      )}
      {!isForOnlyLabel && name && !['section_sub_heading_for_environmental', 'section_heading'].includes(name) ? (
        value || value === 0 || true ? (
          <div
            className={"w-" + (fieldWidth ?? "75") + " d-inline-block mx-2 "}
          >
            <div className="input-group">
              {isChanged && <input
                ref={inputRef}
                type="text"
                id={name || label}
                name={name || label}
                value={value}
                onChange={onChange}
                required={required}
                // placeholder={placeholder}
                className={"form-control rounded-2 labelInput " + styleName}
                readOnly={true}
                title={tooltip}
                maxLength={characterLimit}
                pattern={validation?.pattern}
              />}
              {isCopy && <span className="input-group-text" style={{ cursor: "pointer" }} onClick={handleCopy}>
                <i className="bi bi-clipboard"></i>
              </span>}
            </div>
          </div>
        ) : (
          <div
            className={
              "w-" + (fieldWidth ?? "75") + " d-inline-block mx-2  labelValue"
            }
          >
            {value}
          </div>
        )
      ) : null}
    </div>
  );
};

InputLabel.propTypes = {
  field: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fieldWidth: PropTypes.number,
    headerLength: PropTypes.number,
    name: PropTypes.string,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
    tooltip: PropTypes.string,
    characterLimit: PropTypes.number,
    validation: PropTypes.func,
    styleName: PropTypes.string,
    upperClass: PropTypes.string,
    centerAlign: PropTypes.bool,
    upperClass: PropTypes.string,
  }).isRequired,
};

export default InputLabel;
