import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import FontAwesome CSS

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

  const [selectedDate, setSelectedDate] = useState(defaultValue ? moment(defaultValue) : null);

  useEffect(() => {
    setSelectedDate(defaultValue ? moment(defaultValue) : null);
  }, [defaultValue]);

  const [errorMsg, setErrorMsg] = useState(false);
  useEffect(() => {
    if ((value === undefined || value === "") && required) {
      setErrorMsg(true);
    } else {
      setErrorMsg(false);
    }
  }, [value, required]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onChange(date ? moment(date).format('YYYY-MM-DD') : '');
  };

  // Calculate min and max date values using moment
  const minDateValue = minDate ?? (pastDate
    ? moment().subtract(pastdays ?? 3, 'days').format('YYYY-MM-DD')
    : startDate ? moment(startDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'));

  const maxDateValue = maxDate ?? (pastDate
    ? moment().format('YYYY-MM-DD')
    : futureDays
    ? moment().add(futureDays, 'days').format('YYYY-MM-DD')
    : null);

  return (
    <div className={"form-group my-2 " + upperClass} style={{ position: 'relative' }}>
      {label && (
        <label htmlFor={name} style={{ width: `${25}%` }}>
          {label}
          <span className="required_mark"> {required ? ` *` : null}</span>
        </label>
      )}
      <div className={"w-" + (fieldWidth ?? '75') + " d-inline-block mx-2"}>
        <div className="date-picker-wrapper">
          <DatePicker
            id={name}
            name={name}
            selected={selectedDate ? new Date(selectedDate) : null}
            onChange={handleDateChange}
            required={required}
            readOnly={readOnly}
            title={tooltip}
            minDate={minDateValue ? new Date(minDateValue) : null}
            maxDate={maxDateValue ? new Date(maxDateValue) : null}
            dateFormat="dd-MM-yyyy"
            className="form-control rounded-2"
            disabled={readOnly}
          />
          <i className="fas fa-calendar-alt calendar-icon" onClick={() => document.getElementById(name).focus()}></i>
        </div>
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
    value: PropTypes.any,
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
