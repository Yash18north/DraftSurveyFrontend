import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";

const InputSelectwithSearch = ({ field }) => {
  let {
    name,
    label,
    value,
    onChange,
    required,
    options,
    error,
    fieldWidth,
    masterOptions,
    customname,
    actionClicked,
    from,
    isCustomOptions,
    customOptions,
    exludeOptions,
    upperClass,
  } = field;

  const [newOptions, setNewOptions] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [defaultValue, setDefaulValue] = useState(null);
  useEffect(() => {
    if (isCustomOptions) {
      setNewOptions(customOptions);
    } else {
      masterOptions?.forEach((model, index) => {
        if (model.model === name || model.model === customname) {
          if (exludeOptions && exludeOptions.length > 0) {
            let excludeOptionsNormalized = exludeOptions.map(String);
            let filteroption = model.data.filter((option) => {
              return !excludeOptionsNormalized.includes(option.id.toString());
            });
            setNewOptions(filteroption);
          } else {
            setNewOptions(model.data);
          }
        }
      });
    }
    // }, [options, newOptions, name, masterOptions]);
  }, [name, masterOptions]);

  const [errorMsg, setErrorMsg] = useState(false);
  useEffect(() => {
    if ((value === undefined || value === "") && required) {
      setErrorMsg(true);
    } else {
      setErrorMsg(false);
    }
    setSelectedOptions(value);
  }, [value]);

  const getSelectedOptionName = () => {
    let selectedOptions = getFilteredOptions().filter((option) => {
      return value == option.id || value == option.value
    });

    setDefaulValue(selectedOptions.length > 0 ? selectedOptions[0] : null)
  };

  const getFilteredOptions = () => {
    let actualOpt = newOptions

    if (actualOpt.length == 0 && options) {
      actualOpt = []
      options.map((opt) => {
        actualOpt.push({
          value: opt,
          label: opt
        })
      })
    }
    if (exludeOptions && exludeOptions.length > 0) {
      let excludeOptionsNormalized = exludeOptions.map(String);
      let filteroption = actualOpt.filter((option) => {
        return !excludeOptionsNormalized.includes(option.id.toString());
      });
      return filteroption
    }
    return actualOpt
  }
  useEffect(() => {
    getSelectedOptionName()
  }, [value])
  return (
    <div className={"form-group my-2 " + upperClass}>
      {from !== "Table" && label && (
        <label htmlFor={name} style={{ width: `${25}%` }}>
          {label}
          <span className="required_mark"> {required ? ` *` : null}</span>
        </label>
      )}
      <div className={"w-" + (fieldWidth ?? "75") + " d-inline-block mx-2"}>
        <Select
          className={"form-control rounded-2"}
          classNamePrefix="select"
          isSearchable={true}
          name={name || label}
          options={getFilteredOptions()}
          onChange={onChange}
          value={defaultValue}
        />
        {errorMsg && actionClicked ? (
          <p className="text-danger errorMsg">{label} is Required</p>
        ) : null}
        {error && actionClicked && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
};

InputSelectwithSearch.propTypes = {
  field: PropTypes.object.isRequired,
};

export default InputSelectwithSearch;
