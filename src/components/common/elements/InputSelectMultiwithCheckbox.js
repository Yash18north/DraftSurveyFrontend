import React, { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import PropTypes from "prop-types";

const InputSelectMultiwithCheckbox = ({ field }) => {
  let {
    name,
    label,
    value,
    onChange,
    required,
    options,
    masterOptions,
    customname,
    from,
    fieldWidth,
    actionClicked,
    isCustomOptions,
    customOptions,
    exludeOptions,
    labelWidth,
    hintText,
    placeholder,
    formData,
    disabledMarks,
    hasSelectAll,
    styleName,
    readOnly,
    defaultValue,
    upperClass
  } = field;
  const [newOptions, setNewOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const toggleOption = (option) => {
    let updatedOptions = [];
    option.map((singleValue) => {
      updatedOptions.push(singleValue.value);
    });
    value = updatedOptions;
    onChange(updatedOptions);
  };
  useEffect(() => {
    if (isCustomOptions) {
      setNewOptions(customOptions);
    } else {
      let modelData = [];
      masterOptions?.map((model, index) => {
        if (model.model === name || model.model === customname) {
          modelData = model.data.filter((sigleData) => {
            sigleData.value = sigleData.id;
            sigleData.label = sigleData.name;
            return true;
          });
        }
      });
      if (modelData.length > 0) {
        if (exludeOptions && exludeOptions.length > 0) {
          let filteroption = modelData.filter((option) => {
            return !exludeOptions.includes(option.value.toString());
          });

          setNewOptions(filteroption);
        } else {
          setNewOptions(modelData);
        }
      } else {
        getallOptions();
      }
    }
  }, [masterOptions,options?.length]);

  useEffect(() => {
    if (defaultValue?.length) {
      setTimeout(() => {
        onChange(defaultValue)
      }, 10)
    }
  }, []);

  const [errorMsg, setErrorMsg] = useState(false);
  useEffect(() => {

    if (
      value &&
      value.length == 0 &&
      required
    ) {
      setErrorMsg(true);
    } else {
      setErrorMsg(false);
    }
    setSelectedOptions(value);

  }, [value]);
  const getallOptions = () => {
    let customNewOPT = [];
    if (options) {
      options.map((option) => {
        customNewOPT.push({
          value: option,
          label: option,
        });
      });
    }
    setNewOptions(customNewOPT);
    return customNewOPT;
  };
  const getSelectedOptions = () => {

    return newOptions.filter((option) => {

      return selectedOptions.includes(option.value);
    });
  };

  const newOptionsWithDisabled = newOptions.map(option => {
    return {
      ...option,
      disabled: disabledMarks?.includes(option.value)
    };
  });
  return (
    <div
      className={
        "form-group my-2 " + upperClass
        // "form-group my-2" + (name === "smpl_set_smpljson" ? " width-33" : "")
      }
      id={name || label}
    >
      {from !== "Table" && label && (
        <label htmlFor={name} style={{ width: labelWidth || `${25}%` }}>
          {label}
          <span className="required_mark"> {required ? ` *` : null}</span>
        </label>
      )}

      <div className={"w-" + (fieldWidth ?? "75") + " d-inline-block mx-2 " + styleName}>
        {readOnly ? (
          <input
            type="text"
            id={name || label}
            name={name || label}
            value={getSelectedOptions().map((opt) => opt.label).join(", ") || "None"}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            className={"form-control rounded-2 labelInput "}
            readOnly={true}
            title={getSelectedOptions().map((opt) => opt.label).join(", ") || "None"}
          />
        ) : (
          <MultiSelect

            options={newOptionsWithDisabled}
            // options={newOptionsWithDisabled}
            value={getSelectedOptions()}
            onChange={toggleOption}
            labelledBy={"Select " + label}
            hasSelectAll={hasSelectAll === false ? hasSelectAll : true}
            disabled={readOnly}
            className={
              "w-" +
              (fieldWidth ?? (styleName !== "selectCompWidth" ? "75" : "100")) +
              " d-inline-block customMultiSelect form-control rounded-2 SpecialMultiSelect " + (styleName === "selectCompWidth" ? "" : "mx-2")
            }
          />)}
        {
          hintText && <div className="select-hint-text"
            dangerouslySetInnerHTML={{ __html: hintText }}
          />
        }
        {errorMsg && actionClicked && (
          <p className="text-danger errorMsg">{"Please select " + label}</p>
        )}
      </div>
    </div>
  );
};

InputSelectMultiwithCheckbox.propTypes = {
  field: PropTypes.object.isRequired,
};
export default InputSelectMultiwithCheckbox;