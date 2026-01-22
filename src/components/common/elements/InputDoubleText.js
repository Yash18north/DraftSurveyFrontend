import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import RenderFields from "../../common/RenderFields";
import InputDate from "./InputDate";
import { Dropdown } from "react-bootstrap";

const InputText = ({ field }) => {
  const {
    name,
    label,
    value,
    secondValue,
    onChange1,
    onChange2,
    onChange3,
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
    secondName,
    actionClicked,
    secondReadOnly,
    restrictByCheckbox,
    isShowRadioBefore,
    thirdValue,
    firstType,
    secondType,
    secondoptions,
    onBlur2,
    onBlur1,
    viewOnly,
    secondPlaceholder,
    sectionIndex,
    fieldIndex,
    formData,
    setFormData,
    upperClass,
    labelWidth,
    minDate,
    upperFieldWidth,
    naValuenotNeeded,
    secondFieldWidth,
    defaultSecondValue,
    dropdownWidth,
    thirdName,
    allProps
  } = field;
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  useEffect(() => {
    const regex = new RegExp(pattern);

    if (value !== "") {
      if (regex.test(value)) {
        setErrorMsg("");
      } else {
        setErrorMsg(
          errorMsgs
            ? errorMsgs["pattern"]
            : "Please enter valid value for " + label
        );
      }
    } else if (required && !renderTable) {
      setErrorMsg(label + " is required");
    }
    else {
      setErrorMsg("");
    }
    // if(firstType === "date" && secondType==="date"){
    //   onChange2(value)
    // }
  }, [value, required]);

  useEffect(() => {
    if (secondName) {
      let spValue = secondName.split("_");
      if (spValue.length > 0) {
        const spIndex = spValue[spValue.length - 1];
        spValue.pop();
        let newSecondName = spValue.join("_");
        if (newSecondName === "svd_abovesize_unit") {
          if (secondValue === "nill") {
            onChange1("0", 1);
          }
        }
      }
    }
    setSelectedOptions(secondValue);
  }, [secondValue]);
  useEffect(() => {
    if (thirdValue) {
      // if (value === "N/A") {
      //   setFormData((prevFormData) => {
      //     return {
      //       ...prevFormData,
      //       0: {
      //         ...prevFormData[0],
      //         [name]: ""
      //       },
      //     };
      //   });
      // }
    }
  }, [thirdValue]);

  useEffect(() => {
    if (defaultSecondValue && !secondValue) {
      onChange2(defaultSecondValue, 1);
    }
  }, []);
  useEffect(() => {
    if (defaultSecondValue && !secondValue && secondType === "label") {
      onChange2(defaultSecondValue, 1);
    }
  }, [secondValue]);



  const smplVerificationCondition =
    name.startsWith("svd_stdsizeofsmpl") ||
    name.startsWith("svd_abovesize") ||
    name.startsWith("svd_belowsize");

  useEffect(() => {
    if (isShowRadioBefore && restrictByCheckbox === true && !thirdValue && firstType !== "date" && !naValuenotNeeded) {
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          0: {
            ...prevFormData[0],
            [name]: "N/A"
          },
        };
      });
    }
  }, [(isShowRadioBefore && restrictByCheckbox === true && !thirdValue)])
  const getSelectedOptionName = () => {
    let allOptions = [];
    secondoptions.forEach((option) => {

      if ((Array.isArray(selectedOptions) && selectedOptions.includes(option)) || selectedOptions === option) {
        allOptions.push(option);
      }
    });

    return allOptions.join(",");
  };
  const isReadOnly = readOnly || (isShowRadioBefore && restrictByCheckbox === true && !thirdValue);
  let showValue = value
  if (!firstType || firstType == "number") {
    // showValue = parseFloat(showValue)
    showValue = showValue
  }
  
  return (
    <div className={"form-group my-2 " + upperClass} style={{ position: "relative" }}>
      {label &&
        <label htmlFor={name} style={{ width: `${labelWidth || 25}%` }} >
          {label}
          <span className="required_mark"> {required ? ` *` : null}</span>
        </label>
      }
      <div className={
        "w-" + (upperFieldWidth || "100")
      }>
        <div
          className={
            "w-" +
            (fieldWidth ?? "25") +
            (smplVerificationCondition
              ? " smplVerificationCondition"
              : " double_text date_time")
          }
        >
          {isShowRadioBefore && (
            <input
              type="checkbox"
              className="tick_icon triple_val"
              onChange={onChange3}
              checked={thirdValue}
              disabled={viewOnly}
              id={thirdName}
            />
          )}
          {firstType === "date" ? (
            <React.Fragment>

              <InputDate
                field={{
                  name: name,
                  label: "",
                  value: value == "N/A" ? "" : value,
                  defaultValue: value == "N/A" ? "" : value,
                  onChange: (e) => {
                    onChange1(e)
                    if (firstType === "date" && secondType === "date") {
                      onChange2(e)
                    }
                  },
                  required: required,
                  readOnly: readOnly || (readOnly ? true : isShowRadioBefore && restrictByCheckbox === true && !thirdValue ? true : false),
                  tooltip: field.tooltip,
                  minDate: field.minDate,
                  maxDate: field.maxDate,
                  fieldWidth: field.fieldWidth,
                  pastDate: field.pastDate,
                  pastdays: field.pastdays,
                  futureDays: field.futureDays,
                  renderTable: renderTable,
                  actionClicked: actionClicked,
                  startDate: field.startDate,
                  showTimeSelect: field.showTimeSelect,
                  fieldWidth: (!secondType && "100"),
                  upperClass: (!secondType && "double_text_date"),
                  forUse: "doubleText",
                  actualField: field,
                  noRestrictionApply: allProps.firstNoRestrictionApply,
                  noDefaultValue: allProps.firstnoDefaultValue,
                }}
              />
            </React.Fragment>
          ) : (
            <>
              <input
                type={isReadOnly ? "text" : firstType || "number"}
                id={name || label}
                name={name || label}
                value={allProps.isShowDefaultDash && !showValue && isReadOnly ? '-' : showValue}
                onChange={onChange1}
                required={required}
                placeholder={!isReadOnly && placeholder}
                className={`form-control rounded-2 ${((isReadOnly || allProps?.firstReadOnly) ? " labelInput" : "")} ${(!secondType ? "w-100" : "")}`}
                readOnly={isReadOnly || allProps?.firstReadOnly}
                title={tooltip}
                maxLength={characterLimit}
                pattern={pattern}
                onBlur={onBlur1 ? onBlur1 : null}
              />
            </>
          )}{" "}
          {secondType == "select" ? (
            <Dropdown className={"w-" + (dropdownWidth || "100") + " d-inline-block  specialInnerSelect"} >
              <Dropdown.Toggle id="dropdown-basic" disabled={readOnly}>
                {" "}
                <span className="multipleSelectHeader">
                  {selectedOptions.length === 0
                    ? "Select " + (label || "")
                    : getSelectedOptionName()}
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="loadmore_dropdown_menu">
                <div className="loadMoreOptions">
                  {secondoptions.map((option, optionIndex) => (
                    <Dropdown.Item
                      key={"optionIndex" + optionIndex}
                      // value={option}
                      title={option}
                      className="optionDropdown"
                      onClick={(e) => {
                        if (onBlur2) {
                          onBlur2(option, 1)
                        }
                        else {
                          onChange2(option, 1)
                        }

                      }}
                    >
                      {option}
                    </Dropdown.Item>
                  ))}
                </div>
              </Dropdown.Menu>
            </Dropdown>
          ) :
            secondType == "date" ?
              <React.Fragment>

                <InputDate
                  field={{
                    name: secondName,
                    label: allProps?.secondLabel || "",
                    value: value == "N/A" ? "" : secondValue,
                    defaultValue: value == "N/A" ? "" : secondValue,
                    onChange: (e) => {

                      onChange2(e)
                    },
                    required: required,
                    readOnly: readOnly || (readOnly ? true : isShowRadioBefore && restrictByCheckbox === true && !thirdValue ? true : false),
                    tooltip: field.tooltip,
                    minDate: firstType === "date" && secondType === "date" ? value == "N/A" ? "" : value : field.minDate,
                    maxDate: field.maxDate,
                    fieldWidth: field.fieldWidth,
                    pastDate: field.pastDate,
                    pastdays: field.pastdays,
                    futureDays: field.futureDays,
                    renderTable: renderTable,
                    actionClicked: actionClicked,
                    startDate: field.startDate,
                    showTimeSelect: field.showTimeSelect,
                    fieldWidth: (!secondType && "100"),
                    upperClass: (!secondType && "double_text_date"),
                    forUse: "doubleText",
                    actualField: field,
                    noRestrictionApply: allProps.secondNoRestrictionApply,
                    noDefaultValue: allProps.secondnoDefaultValue,
                  }}
                />
              </React.Fragment>


              :
              secondType && (
                <input
                  type={secondType || "text"}
                  id={secondName || label}
                  name={secondName || label}
                  value={secondValue}
                  placeholder={secondPlaceholder}
                  className={`form-control rounded-2 ${((secondReadOnly || readOnly || viewOnly) ? " labelInput" : "")}`}
                  // readOnly={secondReadOnly || readOnly || viewOnly}
                  readOnly={(secondReadOnly || readOnly || viewOnly) ? true : isShowRadioBefore && restrictByCheckbox === true && !thirdValue ? true : false}
                  title={tooltip}
                  onChange={onChange2}
                />
              )}
          {
            allProps?.isShowDelete && <i className={"bi bi bi-trash text-danger text-bold"} onClick={(e)=>allProps?.handleDeleteDoubleAction(e)}></i>
          }
          {icon ? (
            <i className={"bi bi-" + icon + " text-danger text-bold"}></i>
          ) : restrictByCheckbox ? (<></>) : (
            <span></span>
          )}

        </div>
        {errorMsg && actionClicked && (
          <p className="text-danger errorMsg">{errorMsg}</p>
        )}
        {error && actionClicked && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
};

InputText.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.any, // Adjust if specific type is known
    secondValue: PropTypes.any, // Adjust if specific type is known
    onChange1: PropTypes.func,
    onChange2: PropTypes.func,
    onChange3: PropTypes.func,
    required: PropTypes.bool,
    error: PropTypes.string,
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
    tooltip: PropTypes.string,
    characterLimit: PropTypes.number,
    icon: PropTypes.string, // Adjust if icon type is different
    fieldWidth: PropTypes.string,
    pattern: PropTypes.string, // Regex pattern, usually a string
    renderTable: PropTypes.bool,
    errorMsgs: PropTypes.arrayOf(PropTypes.string), // Adjust if errorMsgs is a different type
    secondName: PropTypes.string,
    actionClicked: PropTypes.func,
    secondReadOnly: PropTypes.bool,
    isShowRadioBefore: PropTypes.bool,
    thirdName: PropTypes.string,
    thirdValue: PropTypes.any, // Adjust if specific type is known
    firstType: PropTypes.string, // Adjust if you expect different types
    secondType: PropTypes.string, // Adjust if you expect different types
    thirdType: PropTypes.string, // Adjust if you expect different types
    secondoptions: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string, // Adjust based on actual structure
        label: PropTypes.string, // Adjust based on actual structure
      })
    ),
    onBlur2: PropTypes.func,
    onBlur1: PropTypes.func,
    viewOnly: PropTypes.bool,
  }),
};

export default InputText;