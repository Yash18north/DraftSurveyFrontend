import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import PropTypes from "prop-types";
import { consortiumDeleteApi } from "../../../services/api";

const InputSelect = ({ field }) => {
  let {
    name,
    label,
    value,
    onChange,
    required,
    options,
    error,
    fieldWidth,
    multiple,
    placeholder,
    masterOptions,
    customname,
    actionClicked,
    specialClass,
    from,
    viewOnly,
    isCustomOptions,
    customOptions,
    upperClass,
    exludeOptions,
    readOnly,
    handleFieldBlur,
    defaultValue,
    tooltip,
    noCheckFirstOption,
    allProps
  } = field;


  const [newOptions, setNewOptions] = useState(isCustomOptions ? customOptions : []);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const toggleOption = (e, option) => {
    let updatedOptions;
    if (selectedOptions.includes(option)) {
      updatedOptions = selectedOptions.filter((item) => item !== option);
    } else {
      updatedOptions = [...selectedOptions, option];
    }

    value = updatedOptions;
    onChange(updatedOptions);
  };
  useEffect(() => {
    if (!isCustomOptions) {
      masterOptions?.forEach((model, index) => {

        if (model.model === name || model.model === customname) {

          if (exludeOptions && exludeOptions.length > 0) {
            let filteroption = model.data.filter((option) => {
              return !exludeOptions.includes(option.id?.toString());
            });
            setNewOptions(filteroption);
          } else {
            setNewOptions(model.data);
          }
        }
      });
    }
    // }, [options, newOptions, name, masterOptions]);
    if (name == "ji_branch_sales_person") {
    }
  }, [name, masterOptions]);
  useEffect(() => {
    if (isCustomOptions) {
      setNewOptions(customOptions);
    }
  }, [customOptions])
  useEffect(() => {
    if (newOptions?.length === 1 && !noCheckFirstOption) {
      if (!value) {
        if (name !== "smpl_set_groupjson") {
          onChange(newOptions?.[0]?.id?.toString(), 1);
        }
      }
    }
  }, [newOptions]);
  useEffect(() => {
    if (defaultValue && !value) {
      onChange(defaultValue, 1);
    }
  }, [options]);
  useEffect(() => {
    if (defaultValue) {
      onChange(defaultValue, 1)
    }
  }, [defaultValue]);

  const [errorMsg, setErrorMsg] = useState(false);
  useEffect(() => {
    if ((value === undefined || value === "") && required) {
      setErrorMsg(true);
    } else {
      setErrorMsg(false);
    }
    setSelectedOptions(value.toString());
  }, [value, required]);

  const getSelectedOptionName = () => {
    let allOptions = [];
    if (newOptions?.length > 0) {
      newOptions.forEach((option) => {

        if ((Array.isArray(selectedOptions) && selectedOptions.includes(option.id.toString())) || selectedOptions === option.id.toString()) {
          allOptions.push(option.name);
        }
      });
    } else {
      options && options.map((option) => {
        option = option?.label ? option : {
          label: option,
          value: option
        }
        if ((Array.isArray(selectedOptions) && selectedOptions.includes(option.value)) || selectedOptions == option.value) {
          allOptions.push(option.label);
        }
      });
    }
    return allOptions.join(",");
  };
  const maxOptionLengthAllowed = 50
  const getOpetionName = (id) => {
    let tooltipValue = "";
    if (newOptions.length > 0) {
      let option = newOptions.find((opt) => opt?.id == id)
      tooltipValue = option?.name
    }
    else {
      let option = newOptions.find((opt) => opt == id)
      tooltipValue = option
    }
    return tooltipValue
  }
  const getFilteredOptions = () => {
    if (exludeOptions && exludeOptions.length > 0) {
      let excludeOptionsNormalized = exludeOptions.map(String);
      let filteroption = newOptions.filter((option) => {
        return !excludeOptionsNormalized.includes(option.id.toString());
      });
      return filteroption
    }
    return newOptions
  }
  return (
    <div className={"form-group my-2 " + upperClass} id={name || label}>
      {from !== "Table" && label && (
        <label htmlFor={name} style={{ width: `${25}%` }}>
          {/* <label htmlFor={name} style={{ width: `${25}%` }} className={field.labelClass}> */}
          {label}
          <span className="required_mark"> {required ? ` *` : null}</span>
        </label>
      )}
      {multiple ? (
        <Dropdown
          className={
            "w-" + (fieldWidth ?? "75") + " d-inline-block mx-2 " + specialClass + (readOnly && "labelInput")
          }
          disabled={readOnly}
        >
          <Dropdown.Toggle id="dropdown-basic">
            <span className="multipleSelectHeader">
              {selectedOptions?.length === 0
                ? "Select " + (label || "")
                : getSelectedOptionName()}
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {newOptions.length > 0
              ? getFilteredOptions().map((option, index) => (
                <Dropdown.Item
                  key={"Dropdown-" + index}
                  onClick={(e) => toggleOption(e, option.id)}
                  active={selectedOptions.includes(option.id)}
                >
                  <input
                    type="checkbox"
                    onChange={(e) => toggleOption(e, option.id)}
                    checked={selectedOptions.includes(option.id)}
                  />
                  {option.name}
                </Dropdown.Item>
              ))
              : options.map((option, index) => (
                <Dropdown.Item
                  key={"Dropdown-" + index}
                  onClick={(e) => toggleOption(e, option)}
                  active={selectedOptions.includes(option)}
                >
                  <input
                    type="checkbox"
                    onChange={(e) => toggleOption(e, option)}
                    checked={selectedOptions.includes(option)}
                    value={option}
                  />
                  {option}
                </Dropdown.Item>
              ))}
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <div className={"w-" + (fieldWidth ?? "75") + " d-inline-block mx-2"}>
          <Dropdown className={"w-100" + " d-inline-block  specialInnerSelect " + (readOnly && "labelInput")} >
            <Dropdown.Toggle id="dropdown-basic" disabled={readOnly} title={selectedOptions.length > 0 ? getSelectedOptionName() : ""}>
              <span className="multipleSelectHeader">
                {selectedOptions?.length === 0
                  ? placeholder || "Select " + (label || "")
                  : getSelectedOptionName()}
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <div className="loadMoreOptions loadMoreOptionsSelect">
                {newOptions.length > 0
                  ? getFilteredOptions()?.map((option, optionIndex) => (
                    <Dropdown.Item
                      key={"optionIndex" + optionIndex}
                      title={option?.name}
                      className="optionDropdown"
                      onClick={(e) => {
                        if (handleFieldBlur) {
                          handleFieldBlur(option?.id.toString(), 1, option)
                        }
                        else {
                          onChange(option?.id.toString(), 1, option)
                        }
                      }}
                    // active={value === option?.id}
                    >
                      {option?.name?.length > maxOptionLengthAllowed
                        ? option?.name.slice(0, maxOptionLengthAllowed) + "..."
                        : option?.name}
                    </Dropdown.Item>
                  ))
                  : options?.map((option, optionIndex) => {
                    option = option?.label ? option : {
                      label: option,
                      value: option
                    }
                    return (
                      <Dropdown.Item
                        key={"optionIndex" + optionIndex}
                        title={option.label}
                        className="optionDropdown"
                        onClick={(e) => {
                          if (handleFieldBlur) {
                            handleFieldBlur(option.value, 1)
                          }
                          else {
                            onChange(option.value, 1)
                          }
                        }}
                      >
                        {option.label?.length > maxOptionLengthAllowed
                          ? option.label.slice(0, maxOptionLengthAllowed) + "..."
                          : option.label}
                      </Dropdown.Item>
                    )
                  })}
              </div>
            </Dropdown.Menu>
          </Dropdown>
          {errorMsg && actionClicked ? (
            <p className="text-danger errorMsg">{label} is Required</p>
          ) : null}
          {error && actionClicked && <p className="text-danger">{error}</p>}
        </div>
      )}
    </div>
  );
};

InputSelect.propTypes = {
  field: PropTypes.object.isRequired,
};

export default InputSelect;


