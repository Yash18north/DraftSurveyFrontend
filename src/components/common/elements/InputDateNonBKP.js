import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles
import moment from "moment"; // Import Moment.js for date formatting
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesome
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons"; // Import Calendar Icon

const InputDate = ({ field }) => {
  let {
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
    noLimitation,
    showTimeSelect,
    forUse,
    minTime,
    maxTime,
  } = field;

  const DISPLAY_DATE_FORMAT = "dd/MM/yyyy"; // Display format
  const DISPLAY_DATE_FORMAT_WITH_TIME = "dd/MM/yyyy HH:mm"; // Display format
  const INPUT_DATE_FORMAT = !showTimeSelect ? "yyyy-MM-DD" : "yyyy-MM-DD HH:mm"; // Format for internal data

  const isValidDate = (date) => date instanceof Date && !isNaN(date.getTime());

  const [selectedDate, setSelectedDate] = useState(
    defaultValue && moment(defaultValue, INPUT_DATE_FORMAT).isValid()
      ? moment(defaultValue, INPUT_DATE_FORMAT).toDate()
      : null
  );

  const [errorMsg, setErrorMsg] = useState(false);

  useEffect(() => {
    if ((value === undefined || value === "") && required) {
      setErrorMsg(true);
    } else {
      setErrorMsg(false);
    }
  }, [value, required]);

  useEffect(() => {
    if (defaultValue) {
      const parsedDate = moment(defaultValue, INPUT_DATE_FORMAT).toDate();
      if (isValidDate(parsedDate)) {
        setSelectedDate(parsedDate);
      }
    }
  }, [defaultValue]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formattedDate = moment(date).format(INPUT_DATE_FORMAT);
    onChange({
      target: {
        name,
        value: formattedDate, // Send formatted value back in yyyy-MM-DD format
      },
    });
  };

  const calculateMinDate = () => {
    if (minDate) {
      const parsedMinDate = moment(minDate, INPUT_DATE_FORMAT).toDate();
      return isValidDate(parsedMinDate) ? parsedMinDate : null;
    }
    if (pastDate) {
      const pastDateCalculated = pastdays
        ? new Date(new Date().setDate(new Date().getDate() - pastdays))
        : new Date(new Date().setMonth(new Date().getMonth() - 3));
      return isValidDate(pastDateCalculated) ? pastDateCalculated : null;
    }
    return startDate
      ? moment(startDate, INPUT_DATE_FORMAT).toDate()
      : noLimitation
      ? null
      : new Date();
  };

  const calculateMaxDate = () => {
    if (maxDate) {
      const parsedMaxDate = moment(maxDate, INPUT_DATE_FORMAT).toDate();
      return isValidDate(parsedMaxDate) ? parsedMaxDate : null;
    }
    if (futureDays) {
      const futureDateCalculated = new Date(new Date().setDate(new Date().getDate() + futureDays));
      return isValidDate(futureDateCalculated) ? futureDateCalculated : null;
    }
    return null;
  };

  const calculateMinTime = () => {
    if (!minTime) return null;

    const minDate = calculateMinDate();
    if (minDate && selectedDate?.toDateString() === minDate.toDateString()) {
      return isValidDate(minTime) ? minTime : new Date(0, 0, 0, 0, 0);
    }
    return new Date(0, 0, 0, 0, 0);
  };

  const calculateMaxTime = () => {
    if (!maxTime) return null;

    const maxDate = calculateMaxDate();
    if (maxDate && selectedDate?.toDateString() === maxDate.toDateString()) {
      return isValidDate(maxTime) ? maxTime : new Date(0, 0, 0, 23, 59);
    }
    return new Date(0, 0, 0, 23, 59);
  };

  return (
    <div
      className={`form-group ${forUse !== "doubleText" ? "my-2" : ""} ${upperClass} ` + 
        (upperClass === "double_text_date" ? "w-100" : "my-2")}
      style={{ position: "relative" }}
    >
      {label && (
        <label htmlFor={name} style={{ width: `${25}%` }}>
          {label}
          <span className="required_mark"> {required ? ` *` : null}</span>
        </label>
      )}
      <div
        className={`w-${fieldWidth ?? "75"} d-inline-block DateTimePicker ` +
          (upperClass === "double_text_date" ? "" : "mx-2")}
      >
        <div style={{ position: "relative" }}>
          <DatePicker
            showTimeSelect={showTimeSelect || false}
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat={
              !showTimeSelect ? DISPLAY_DATE_FORMAT : DISPLAY_DATE_FORMAT_WITH_TIME
            }
            placeholderText={
              !showTimeSelect ? "DD-MM-YYYY" : "DD-MM-YYYY HH:mm"
            }
            minDate={calculateMinDate()}
            maxDate={calculateMaxDate()}
            minTime={calculateMinTime()}
            maxTime={calculateMaxTime()}
            onKeyDown={(e) => e.preventDefault()}
            className={
              "form-control rounded-2 " + (readOnly ? "labelInput" : "")
            }
            readOnly={readOnly}
          />
          {!readOnly && (
            <FontAwesomeIcon
              icon={faCalendarAlt}
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                color: "#616161",
                pointerEvents: "none",
              }}
            />
          )}
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
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    onChange: PropTypes.func,
    required: PropTypes.bool,
    error: PropTypes.string,
    readOnly: PropTypes.bool,
    tooltip: PropTypes.string,
    defaultValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    minDate: PropTypes.string,
    maxDate: PropTypes.string,
    fieldWidth: PropTypes.string,
    pastDate: PropTypes.bool,
    pastdays: PropTypes.number,
    renderTable: PropTypes.bool,
    actionClicked: PropTypes.bool,
    upperClass: PropTypes.string,
    futureDays: PropTypes.number,
    startDate: PropTypes.string,
    noLimitation: PropTypes.bool,
    showTimeSelect: PropTypes.bool,
    forUse: PropTypes.string,
    minTime: PropTypes.instanceOf(Date),
    maxTime: PropTypes.instanceOf(Date),
  }).isRequired,
};

export default InputDate;