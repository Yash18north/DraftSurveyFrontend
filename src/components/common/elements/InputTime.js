import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const InputTime = ({ field }) => {
  const {
    name,
    label,
    value,
    onChange,
    required,
    error,
    readOnly,
    tooltip,
    defaultValue,
    minDate,
    maxDate,
    fieldWidth,
    pastDate,
    pastdays,
    renderTable,
    actionClicked,
    upperClass,
    futureDays,
    startDate,
    minTime
  } = field;
  const [selectedDate, setSelectedDate] = useState(defaultValue);

  useEffect(() => {
    setSelectedDate(defaultValue);
  }, [defaultValue]);

  const [errorMsg, setErrorMsg] = useState(false);
  useEffect(() => {
    if ((value === undefined || value === "") && required) {
      setErrorMsg(true);
    } else {
      setErrorMsg(false);
    }
  }, [value, required]);

  const handleDateChange = (event) => {
    if (minTime) {
      if (event.target.value >= minTime) {
        setSelectedDate(event.target.value);
        onChange(event);
      } else {
        toast.error(`Please select a time less then ${minTime}.`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      // setSelectedDate(event.target.value);
      // onChange(event);
    }
    else {
      setSelectedDate(event.target.value);
      onChange(event);
    }

  };
  return (
    <div
      className={"form-group my-2 " + upperClass}
      style={{ position: "relative" }}
    >
      {label && (
        <label htmlFor={name} style={{ width: `${25}%` }}>
          {label}
          <span className="required_mark"> {required ? ` *` : null}</span>
        </label>
      )}
      <div className={"w-" + (fieldWidth ?? "75") + " d-inline-block mx-2"}>
        <input
          type="time"
          id={name}
          name={name}
          value={value ?? selectedDate}
          onChange={handleDateChange}
          required={required}
          className="form-control rounded-2"
          readOnly={readOnly}
          title={tooltip}
          onKeyDown={(e) => e.preventDefault()}
          min={minTime ? minTime : ""}
        />
        {errorMsg && actionClicked && !renderTable ? (
          <p className="text-danger errorMsg">{label} is required</p>
        ) : null}
        {error && actionClicked && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
};

InputTime.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.any, // Use `any` if the value can be of any type
    onChange: PropTypes.func,
    required: PropTypes.bool,
    error: PropTypes.string,
    readOnly: PropTypes.bool,
    tooltip: PropTypes.string,
    defaultValue: PropTypes.string,
    minDate: PropTypes.string,
    maxDate: PropTypes.string,
    fieldWidth: PropTypes.string,
    pastDate: PropTypes.bool,
    pastdays: PropTypes.number,
    renderTable: PropTypes.bool,
    actionClicked: PropTypes.func,
    upperClass: PropTypes.string,
    futureDays: PropTypes.number,
    startDate: PropTypes.string
  })
};
export default InputTime;
