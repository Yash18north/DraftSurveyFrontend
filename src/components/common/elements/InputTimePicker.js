import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import moment from "moment";
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
        fieldWidth,
        renderTable,
        actionClicked,
        upperClass,
        minTime,
        maxTime,
    } = field;

    const [selectedTime, setSelectedTime] = useState(defaultValue ? moment(defaultValue, "HH:mm").toDate() : null);
    const [errorMsg, setErrorMsg] = useState(false);

    useEffect(() => {
        if (defaultValue) {
            setSelectedTime(moment(defaultValue, "HH:mm").toDate());
        }
    }, [defaultValue]);

    useEffect(() => {
        if ((value === undefined || value === "") && required) {
            setErrorMsg(true);
        } else {
            setErrorMsg(false);
        }
    }, [value, required]);

    const handleTimeChange = (time) => {
        const formatted = moment(time).format("HH:mm");

        if (minTime && moment(formatted, "HH:mm").isBefore(moment(minTime, "HH:mm"))) {
            toast.error(`Please select a time after ${minTime}.`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }

        if (maxTime && moment(formatted, "HH:mm").isAfter(moment(maxTime, "HH:mm"))) {
            toast.error(`Please select a time before ${maxTime}.`, {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }

        setSelectedTime(time);
        onChange({
            target: {
                name,
                value: formatted,
            },
        });
    };

    return (
        <div className={`form-group my-2 ${upperClass ?? ""}`} style={{ position: "relative" }}>
            {label && (
                <label htmlFor={name} style={{ width: "25%" }}>
                    {label}
                    {required && <span className="required_mark"> *</span>}
                </label>
            )}
            <div className={`w-${fieldWidth ?? "75"} d-inline-block mx-2`}>
                <DatePicker
                    selected={selectedTime}
                    onChange={handleTimeChange}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={1}
                    timeFormat="HH:mm"
                    timeCaption="Time"
                    dateFormat="HH:mm"
                    className="form-control rounded-2"
                    disabled={readOnly}
                    title={tooltip}
                    placeholderText="HH:mm"
                    {...(minTime ? { minTime: moment(minTime, "HH:mm").toDate() } : { minTime: new Date(0, 0, 0, 0, 0) })}
                    {...(maxTime ? { maxTime: moment(maxTime, "HH:mm").toDate() } : { maxTime: new Date(0, 0, 0, 23, 59) })}
                />
                {errorMsg && actionClicked && !renderTable && (
                    <p className="text-danger errorMsg">{label} is required</p>
                )}
                {error && actionClicked && <p className="text-danger">{error}</p>}
            </div>
        </div>
    );
};

InputTime.propTypes = {
    field: PropTypes.shape({
        name: PropTypes.string.isRequired,
        label: PropTypes.string,
        value: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        required: PropTypes.bool,
        error: PropTypes.string,
        readOnly: PropTypes.bool,
        tooltip: PropTypes.string,
        defaultValue: PropTypes.string,
        fieldWidth: PropTypes.string,
        renderTable: PropTypes.bool,
        actionClicked: PropTypes.bool,
        upperClass: PropTypes.string,
        minTime: PropTypes.string, // format: "HH:mm"
        maxTime: PropTypes.string, // format: "HH:mm"
    }).isRequired,
};

export default InputTime;
