import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from 'prop-types';
import moment from "moment/moment";

const DateTimePicker = ({ field }) => {
  let {
    name,
    label,
    value,
    onChange,
    required,
    error,
    placeholder,
    readOnly,
    tooltip,
    minDate,
    maxDate,
    actionClicked,
    fieldWidth
  } = field;

  value = value ? new Date(value) : ""
  return (
    <div className="form-group my-2">
      {label && (
        <label htmlFor={name} style={{ width: `${25}%` }}>
          {label}
          <span className="required_mark"> {required ? ` *` : null}</span>
        </label>
      )}
      <div className={`w-${fieldWidth || "50"} d-inline-block mx-2 DateTimePicker`}>
        <DatePicker
          selected={value}
          onChange={onChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="dd-mm-yyyy H:mm"
          required={required}
          placeholderText={placeholder}
          className="form-control rounded-2"
          readOnly={readOnly}
          title={tooltip}
          minDate={new Date(minDate)}
          maxDate={new Date(maxDate)}
        />
        {error && actionClicked && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
};


DateTimePicker.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.instanceOf(Date),
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
    error: PropTypes.string,
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
    tooltip: PropTypes.string,
    minDate: PropTypes.instanceOf(Date),
    maxDate: PropTypes.instanceOf(Date),
    actionClicked: PropTypes.func,
  }).isRequired,
};

export default DateTimePicker;
