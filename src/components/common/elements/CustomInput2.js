import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { GetTenantDetails } from "../../../services/commonServices";

const CustomInput = ({ field }) => {
  const {
    name,
    label,
    value,
    onChange,
    required,
    error,
    placeholder,
    readOnly,
    tooltip,
    characterLimit,
    fieldWidth,
    minValue,
    maxValue,
    pattern,
    errorMsgs,
    sectionIndex,
    actionClicked,
    formData
  } = field;

  const [errorMsg, setErrorMsg] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [sampleselectedOptions, setSampleSelectedOptions] = useState([]);
  useEffect(() => {
    const regex = new RegExp(pattern);

    if (value !== "") {
      if (regex.test(value)) {
        setErrorMsg("");
      } else {
        setErrorMsg(
          errorMsgs ? errorMsgs["pattern"] : "Please enter valid value"
        );
      }
    } else if (required) {
      setErrorMsg(errorMsgs ? errorMsgs["required"] : "This field is required");
    }

    if (
      value?.jrf_qty_of_powedered_smpl_checkboxes &&
      value?.jrf_qty_of_powedered_smpl_checkboxes.length > 0
    ) {
      setSelectedOptions(value["jrf_qty_of_powedered_smpl_checkboxes"]);
    }
    if (
      value?.jrf_qty_of_raw_smpl_checkboxes &&
      value?.jrf_qty_of_raw_smpl_checkboxes.length > 0
    ) {
      setSampleSelectedOptions(value["jrf_qty_of_raw_smpl_checkboxes"]);
    }
  }, [value]);

  const oGHandleChange = (e, option, type, stateFunc) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      stateFunc((prev) => {
        const updatedOptions = [...prev, option];
        onChange(sectionIndex, type, updatedOptions);

        return updatedOptions;
      });
    } else {
      stateFunc((prev) => {
        const updatedOptions = prev.filter((item) => item !== option);
        onChange(sectionIndex, type, updatedOptions);
        return updatedOptions;
      });
    }
  };

  return (
    <div className="form-group my-2">
      {label && (
        <label
          htmlFor={name}
          style={{
            width: `${25}%`,
            alignItems: "baseline",
            paddingTop: "10px",
          }}
        >
          {label}
          <span className="required_mark"> {required ? ` *` : null}</span>
        </label>
      )}
      <div className={"w-" + (fieldWidth ?? "75") + " d-inline-block mx-2 "}>
        {(name === "quantity_received_sample" || name === "quantity_received_sample_desc") ? (
          <span>
            {
              GetTenantDetails(1, 1,formData[0]?.jrf_is_petro) == "TPBPL" ?
                (
                  <div className="customInput">
                    <div>
                      <div className="customInputDiv">
                        <span>{"Aluminum Container"}</span>
                        <input
                          type="radio"
                          id={"jrf_qty_of_raw_smpl_checkboxes"}
                          name={"jrf_qty_of_raw_smpl_checkboxes"}
                          value={sampleselectedOptions}
                          onChange={(e) =>
                            oGHandleChange(
                              e,
                              "Aluminum Container",
                              "jrf_qty_of_raw_smpl_checkboxes",
                              setSampleSelectedOptions
                            )
                          }
                          checked={sampleselectedOptions.includes("Aluminum Container")}
                        />
                      </div>
                      <span>/{"Plastic Bottle"}</span>
                      <input
                        type="radio"
                        id={"jrf_qty_of_raw_smpl_checkboxes"}
                        name={"jrf_qty_of_raw_smpl_checkboxes"}
                        value={sampleselectedOptions}
                        onChange={(e) =>
                          oGHandleChange(
                            e,
                            "Plastic Bottle",
                            "jrf_qty_of_raw_smpl_checkboxes",
                            setSampleSelectedOptions
                          )
                        }
                        checked={sampleselectedOptions.includes("Plastic Bottle")}
                      />
                      <span> / {"Glass Bottle"}</span>
                      <input
                        type="radio"
                        id={"jrf_qty_of_raw_smpl_checkboxes"}
                        name={"jrf_qty_of_raw_smpl_checkboxes"}
                        value={sampleselectedOptions}
                        onChange={(e) =>
                          oGHandleChange(
                            e,
                            "Glass Bottle",
                            "jrf_qty_of_raw_smpl_checkboxes",
                            setSampleSelectedOptions
                          )
                        }
                        checked={sampleselectedOptions.includes("Glass Bottle")}
                      />
                      <span> / {"Tins"}</span>
                      <input
                        type="radio"
                        id={"jrf_qty_of_raw_smpl_checkboxes"}
                        name={"jrf_qty_of_raw_smpl_checkboxes"}
                        value={sampleselectedOptions}
                        onChange={(e) =>
                          oGHandleChange(
                            e,
                            "Tins",
                            "jrf_qty_of_raw_smpl_checkboxes",
                            setSampleSelectedOptions
                          )
                        }
                        checked={sampleselectedOptions.includes("Tins")}
                      />
                      <span> / {"Gas Carrier Cylinder"}</span>
                      <input
                        type="radio"
                        id={"jrf_qty_of_raw_smpl_checkboxes"}
                        name={"jrf_qty_of_raw_smpl_checkboxes"}
                        value={sampleselectedOptions}
                        onChange={(e) =>
                          oGHandleChange(
                            e,
                            "Gas Carrier Cylinder",
                            "jrf_qty_of_raw_smpl_checkboxes",
                            setSampleSelectedOptions
                          )
                        }
                        checked={sampleselectedOptions.includes("Gas Carrier Cylinder")}
                      />
                      <span> / {"Plastic Bucket"}</span>
                      <input
                        type="radio"
                        id={"jrf_qty_of_raw_smpl_checkboxes"}
                        name={"jrf_qty_of_raw_smpl_checkboxes"}
                        value={sampleselectedOptions}
                        onChange={(e) =>
                          oGHandleChange(
                            e,
                            "Plastic Bucket",
                            "jrf_qty_of_raw_smpl_checkboxes",
                            setSampleSelectedOptions
                          )
                        }
                        checked={sampleselectedOptions.includes("Plastic Bucket")}
                      />

                    </div>
                    <div>
                      <span>{"Specify (if available)"} </span>
                      <input
                        type="text"
                        id="jrf_qty_of_raw_smpl_input"
                        name="jrf_qty_of_raw_smpl_input"
                        value={value?.jrf_qty_of_raw_smpl_input}
                        onChange={(e) =>
                          onChange(
                            sectionIndex,
                            "jrf_qty_of_raw_smpl_input",
                            e.target.value
                          )
                        }
                        className="form-control rounded-2 sub-element"
                      />
                    </div>

                  </div>
                )
                :
                (
                  <div className="customInput">
                    <div>
                      <div className="customInputDiv">
                        <span>{"For Raw : >=2KG "}</span>
                        <input
                          type="checkbox"
                          id={"jrf_qty_of_raw_smpl_checkboxes"}
                          name={"jrf_qty_of_raw_smpl_checkboxes"}
                          value={sampleselectedOptions}
                          onChange={(e) =>
                            oGHandleChange(
                              e,
                              ">=2KG",
                              "jrf_qty_of_raw_smpl_checkboxes",
                              setSampleSelectedOptions
                            )
                          }
                          checked={sampleselectedOptions.includes(">=2KG")}
                        />
                      </div>
                      <span>, {">=1KG"}</span>
                      <input
                        type="checkbox"
                        id={"jrf_qty_of_raw_smpl_checkboxes"}
                        name={"jrf_qty_of_raw_smpl_checkboxes"}
                        value={sampleselectedOptions}
                        onChange={(e) =>
                          oGHandleChange(
                            e,
                            ">=1KG",
                            "jrf_qty_of_raw_smpl_checkboxes",
                            setSampleSelectedOptions
                          )
                        }
                        checked={sampleselectedOptions.includes(">=1KG")}
                      />
                      <span>{" Specify (if available)"} </span>
                      <input
                        type="text"
                        id="jrf_qty_of_raw_smpl_input"
                        name="jrf_qty_of_raw_smpl_input"
                        value={value?.jrf_qty_of_raw_smpl_input}
                        onChange={(e) =>
                          onChange(
                            sectionIndex,
                            "jrf_qty_of_raw_smpl_input",
                            e.target.value
                          )
                        }
                        className="form-control rounded-2 sub-element"
                      />
                    </div>
                    <div>
                      <div className="customInputDiv">
                        <span>{"For powered Sample : <100gm"}</span>
                        <input
                          type="checkbox"
                          id={"jrf_qty_of_powedered_smpl_checkboxes"}
                          name={"jrf_qty_of_powedered_smpl_checkboxes"}
                          value={selectedOptions}
                          checked={selectedOptions.includes("< 100")}
                          onChange={(e) =>
                            oGHandleChange(
                              e,
                              "< 100",
                              "jrf_qty_of_powedered_smpl_checkboxes",
                              setSelectedOptions
                            )
                          }
                        />
                      </div>
                      <div className="customInputDiv">
                        <span>{"/> 100gm & below <=200gm"}</span>
                        <input
                          type="checkbox"
                          id={"jrf_qty_of_powedered_smpl_checkboxes"}
                          name={"jrf_qty_of_powedered_smpl_checkboxes"}
                          value={selectedOptions}
                          onChange={(e) =>
                            oGHandleChange(
                              e,
                              "100-200",
                              "jrf_qty_of_powedered_smpl_checkboxes",
                              setSelectedOptions
                            )
                          }
                          checked={selectedOptions.includes("100-200")}
                        />
                      </div>
                      <div className="customInputDiv">
                        <span>{"/>200gm"}</span>
                        <input
                          type="checkbox"
                          id={"jrf_qty_of_powedered_smpl_checkboxes"}
                          name={"jrf_qty_of_powedered_smpl_checkboxes"}
                          value={selectedOptions}
                          onChange={(e) =>
                            oGHandleChange(
                              e,
                              ">200gm",
                              "jrf_qty_of_powedered_smpl_checkboxes",
                              setSelectedOptions
                            )
                          }
                          checked={selectedOptions.includes(">200gm")}
                        />
                      </div>
                      <span>, {"Specify (if available)"} </span>
                      <input
                        type="text"
                        id="jrf_qty_of_powedered_smpl_input"
                        name="jrf_qty_of_powedered_smpl_input"
                        value={value?.jrf_qty_of_powedered_smpl_input}
                        onChange={(e) =>
                          onChange(
                            sectionIndex,
                            "jrf_qty_of_powedered_smpl_input",
                            e.target.value
                          )
                        }
                        className="form-control rounded-2 sub-element"
                      />
                    </div>
                  </div>
                )
            }

          </span>
        ) : (
          <input
            type="number"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            className="form-control rounded-2"
            readOnly={readOnly}
            title={tooltip}
            maxLength={characterLimit}
            min={minValue || 0}
            max={maxValue || 99}
          />
        )}
        {errorMsg && actionClicked ? (
          <p className="text-danger errorMsg">{errorMsg}</p>
        ) : null}
        {error && actionClicked && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
};

CustomInput.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
    error: PropTypes.string,
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
    tooltip: PropTypes.string,
    characterLimit: PropTypes.number,
    fieldWidth: PropTypes.number,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
    pattern: PropTypes.string,
    errorMsgs: PropTypes.arrayOf(PropTypes.string),
    sectionIndex: PropTypes.number,
    actionClicked: PropTypes.func,
  }).isRequired,
};
export default CustomInput;
