import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const InputDate = ({ field }) => {
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
    startDate
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
    setSelectedDate(event.target.value);
    onChange(event);
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
          type="date"
          id={name}
          name={name}
          value={value ?? selectedDate}
          onChange={handleDateChange}
          required={required}
          className="form-control rounded-2"
          readOnly={readOnly}
          title={tooltip}
          onKeyDown={(e) => e.preventDefault()}
          min={
            minDate ??
            (pastDate
              ? new Date(
                  pastdays
                    ? new Date().setDate(new Date().getDate() - pastdays)
                    : new Date().setMonth(new Date().getMonth() - 3)
                )
                  .toISOString()
                  .split("T")[0]
              : startDate ? new Date(startDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0])
          }
          max={
            maxDate ??
            (pastDate
              ? new Date().toISOString().split("T")[0]
              : futureDays
              ? new Date(new Date().setDate(new Date().getDate() + futureDays))
                  .toISOString()
                  .split("T")[0]
              : null)
          }
        />
        {errorMsg && actionClicked && !renderTable ? (
          <p className="text-danger errorMsg">{label} is required</p>
        ) : null}
        {error && actionClicked && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
};

InputDate.propTypes = {
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
export default InputDate;
