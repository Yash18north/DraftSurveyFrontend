import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

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
    defaultValue,
    allProps
  } = field;

  const [errorMsg, setErrorMsg] = useState("");
  const [isChanged, setIsChanged] = useState(true);
  const inputRef = useRef(null);
  useEffect(() => {
    const regex = new RegExp(pattern);

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
      setErrorMsg(errorMsgs ? errorMsgs["required"] : (label) + " is required");
    }
    else {
      setErrorMsg("")
    }
  }, [value, required]);
  useEffect(() => {
    if (defaultValue) {
      setIsChanged(false)
      setTimeout(() => {
        onChange(defaultValue, 1)
        setIsChanged(true)
      }, 10)
    }
  }, [defaultValue]);
  const getTextboxComp = () => {
    return isChanged && <input
      ref={inputRef}
      type="text"
      id={name || label}
      name={name || label}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={readOnly ? "" : placeholder}
      className={"form-control rounded-2 " + (readOnly ? "labelInput" : "")}
      readOnly={readOnly}
      title={tooltip}
      maxLength={characterLimit}
      pattern={pattern}
      onBlur={handleFieldBlur || null}
    />
  }

  const handleCopy = () => {
    if (inputRef.current && inputRef.current.value) {
      inputRef.current.select();
      navigator.clipboard.writeText(inputRef.current.value).then(() => {
        toast.success("Copied to clipboard!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
    }
  };
  return (
    <div style={{ position: "relative" }}
      className={
        "form-group " + upperClass + (styleName !== " InputNum" ? " my-2" : "")
      }

    >
      {label && (
        <label htmlFor={name} style={{ width: `${25}%` }} >

          {label}
          <span className="required_mark"> {required ? ` *` : null}</span>
        </label>
      )}
      <div className={"w-" + (fieldWidth ?? "75") + " d-inline-block mx-2"}>
        {allProps.isCopy ? (
          <div className="input-group">
            {getTextboxComp()}
            <span className="input-group-text" style={{ cursor: "pointer" }} onClick={handleCopy}>
                <i className="bi bi-clipboard"></i>
              </span>
          </div>
        ) : getTextboxComp()
        }
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

InputText.propTypes = {
  field: PropTypes.object.isRequired,
};

export default InputText;
