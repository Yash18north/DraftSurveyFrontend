import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { ReactComponent as PlusICon } from "../../../assets/images/icons/plusIcon.svg";
import { ReactComponent as MinusICon } from "../../../assets/images/icons/minusIcon.svg";

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
    actionClicked
  } = field;

  const increaseNumber = () => {
    let incrementedValue = parseInt(value || 0, 10) + 1;
    incrementedValue = Math.min(incrementedValue, 15);
    onChange({ target: { name, value: incrementedValue } });
  };

  const decreaseNumber = () => {
    let decrementedValue = parseInt(value || 0, 10) - 1;
    decrementedValue = Math.max(decrementedValue, 0);
    onChange({ target: { name, value: decrementedValue } });
  };

  const onHandleChange = (e) => {
    let value = e.target.value
    let incrementedValue = parseInt(value || 0, 10) + 1;
    incrementedValue = Math.min(incrementedValue, 15);
    onChange({ target: { name, value: incrementedValue } });
  };
  const [errorMsg, setErrorMsg] = useState(false);
  useEffect(() => {
    if ((value === undefined || value === "") && required) {
      setErrorMsg(true);
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
      <div className={"w-0 d-inline-block mx-2"}>
        <div className="plus-min-container">
          <button className="iconBtn1" type="button" onClick={decreaseNumber}>
            <MinusICon/>

          </button>

          <div className="input-group">
            <input
              type="number"
              id={name}
              name={name}
              value={value || 0}
              onChange={onHandleChange}
              required={required}
              placeholder={placeholder}
              className="form-control rounded-2 inputPlusMin"
              readOnly={readOnly}
              title={tooltip}
              maxLength={characterLimit}
              min="0"
              max="100"
            />
          </div>
          <button className="iconBtn2" type="button" onClick={increaseNumber}>
            <PlusICon/>
          </button>
        </div>

        {errorMsg && actionClicked ? (
          <p className="text-danger errorMsg">{label} is Required</p>
        ) : null}

        {error && actionClicked && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
};

InputNumber.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
    error: PropTypes.string,
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
    tooltip: PropTypes.string,
    characterLimit: PropTypes.number,
    actionClicked: PropTypes.func,
  }).isRequired,
};



export default InputNumber;
