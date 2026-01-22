import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { GetTenantDetails } from "../../../services/commonServices";

const InputCheckbox = ({ field }) => {
  const {
    name,
    label,
    error,
    tooltip,
    characterLimit,
    options,
    onChange,
    required,
    viewOnly,
    value,
    actionClicked,
    isOptionLabelNotShow,
    fieldWidth,
    styleName,
    specialType,
    isSubCheckbox,
    sequence,
    allProps,
    formData
  } = field;
  const [isChecked, setIsChecked] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [errorMsg, setErrorMsg] = useState(false);
  const handleChange = (e) => {
    setIsChecked((prev) => !prev);
    onChange(e);
  };



  const oGHandleChange = (e, option) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      setSelectedOptions((prev) => {
        const updatedOptions = [...prev, option];
        onChange(e, updatedOptions);

        return updatedOptions;
      });
    } else {
      setSelectedOptions((prev) => {
        const updatedOptions = Array.isArray(prev) ? prev.filter((item) => item !== option) : [];
        onChange(e, updatedOptions);
        return updatedOptions;
      });

    }
  };

  useEffect(() => {
    setSelectedOptions(value);
    setIsChecked(value);
    if ((!value || value.length === 0) && required) {
      setErrorMsg(true);
    } else {
      setErrorMsg(false);
    }
  }, [value]);

  const getClassName = (styleName, specialType) => {
    return `form-group my-2 listform ${styleName} ${specialType === "configured" ?
      ((viewOnly || isSubCheckbox) ? "configuredListformDisabled" : (isChecked.length > 0) ?
        "configuredListformChecked"
        : "configuredListform")
      : ""}`
  }

  return (
    <div className={getClassName(styleName, specialType)}>
      {label && (
        <label htmlFor={name} style={{ width: `${25}%` }}>
          {label}
          <span className="required_mark"> {required ? ` *` : null}</span>
        </label>
      )}
      <div className={"w-" + (fieldWidth ?? "125") + " mx-2 radioOptions"}>
        {options?.map((option, optionIndex) => (
          <span className="radioOption" key={optionIndex + "Checkbox "}>
            {["jrf_terms_and_conditions", "jrf_vc_term_condition"].includes(
              name
            ) ? (
              <input
                type="checkbox"
                id={name}
                name={name}
                title={tooltip}
                maxLength={characterLimit}
                required={required}
                value={isChecked}
                checked={viewOnly ? true : isChecked}
                disabled={viewOnly || isSubCheckbox}
                onChange={handleChange}
              />
            ) : (
              <input
                type="checkbox"
                id={name}
                name={name}
                title={tooltip}
                maxLength={characterLimit}
                required={required}
                value={selectedOptions}
                checked={selectedOptions.includes(option)}
                onChange={(e) => oGHandleChange(e, option)}
                disabled={viewOnly || isSubCheckbox}
              />
            )}
            {!isOptionLabelNotShow && (
              <label className="checkbox-text" htmlFor={name}>
                {allProps?.isCustomLabels ? allProps?.customLabels?.[optionIndex] : option}{" "}
                {name === "jrf_terms_and_conditions" && (
                  <span className="boldClass">
                    <br />
                    <br />
                    {GetTenantDetails(1, 1) === "TPBPL"
                      ? "We hereby accept the TCRC Petrolabs Bharat Private Limited, terms and conditions mentioned above."
                      : "We hereby accept the terms and conditions mentioned above."}

                  </span>
                )}
                {sequence?.includes(name) && (
                  <span className="countDisplay">
                    {sequence.indexOf(name) + 1}
                  </span>
                )}

              </label>
            )}
          </span>
        ))}
        {!isChecked && actionClicked && name === "jrf_terms_and_conditions" ? (
          <p className="text-danger errorMsg">
            {"Please accept the terms and conditions."}
          </p>
        ) : errorMsg && actionClicked ? (
          <p className="text-danger errorMsg">{label} is Required</p>
        ) : null}
        {error && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
};

InputCheckbox.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string,
    label: PropTypes.string,
    error: PropTypes.string,
    tooltip: PropTypes.string,
    characterLimit: PropTypes.number,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string, // Adjust based on actual structure
        label: PropTypes.string  // Adjust based on actual structure
      })
    ),
    onChange: PropTypes.func,
    required: PropTypes.bool,
    viewOnly: PropTypes.bool,
    value: PropTypes.any, // Use specific type if known, e.g., PropTypes.string, PropTypes.number
    actionClicked: PropTypes.func,
    isOptionLabelNotShow: PropTypes.bool,
    fieldWidth: PropTypes.string // Adjust if fieldWidth is a different type
  })
};
export default InputCheckbox;
