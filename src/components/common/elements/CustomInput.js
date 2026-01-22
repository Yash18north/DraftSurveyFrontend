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
  const petroLiquidOptions = ['1 Liter', '500 ml', '100 ml']
  const petroSemiSlidOptions = ['1 Kg', '2 Kg', '5 Kg']
  const petroGaseousOptions = ['500 ml', '1 liter']
  return (
    <div className="form-group my-2">
      {label && (
        <label
          htmlFor={name}
          style={{
            width: `${25}%`,
            alignItems: "baseline",
            paddingTop: "5px",
          }}
        >
          {label}
          <span className="required_mark"> {required ? ` *` : null}</span>
        </label>
      )}
      <div className={"w-" + (fieldWidth ?? "75") + " d-inline-block mx-2 "}>
        {name === "quantity_received_sample" ? (
          <span>
            {
              GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) == "TPBPL" ?
                (
                  <div className="customInput">

                    <div>
                      <b>Liquid :</b>
                      {
                        petroLiquidOptions.map((singleOPT, i) => (
                          <div className="customInputDiv">
                            <span>{(i !== 0 && '/ ' || '') + singleOPT}</span>
                            <input
                              type="radio"
                              id={"jrf_liquid_checkbox"}
                              name={"jrf_liquid_checkbox"}
                              value={singleOPT}
                              checked={formData?.[sectionIndex]?.['jrf_liquid_checkbox'] === singleOPT}
                              onChange={(e) =>
                                onChange(
                                  sectionIndex,
                                  "jrf_liquid_checkbox",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        ))
                      }
                      <span>, {"Specify (if available)"} </span>
                      <input
                        type="text"
                        id="jrf_liquid_input"
                        name="jrf_liquid_input"
                        value={value?.jrf_liquid_input}
                        onChange={(e) =>
                          onChange(
                            sectionIndex,
                            "jrf_liquid_input",
                            e.target.value
                          )
                        }
                        className="form-control rounded-2 sub-element"
                      />
                    </div>
                    <div>
                      <b>Semisolid :</b>
                      {
                        petroSemiSlidOptions.map((singleOPT, i) => (
                          <div className="customInputDiv">
                            <span>{(i !== 0 && '/ ' || '') + singleOPT}</span>
                            <input
                              type="radio"
                              id={"jrf_semisolid_checkbox"}
                              name={"jrf_semisolid_checkbox"}
                              value={singleOPT}
                              checked={formData?.[sectionIndex]?.['jrf_semisolid_checkbox'] === singleOPT}
                              onChange={(e) => onChange(sectionIndex, 'jrf_semisolid_checkbox', singleOPT)}
                            />
                          </div>
                        ))
                      }
                      <span>, {"Specify (if available)"} </span>
                      <input
                        type="text"
                        id="jrf_semisolid_input"
                        name="jrf_semisolid_input"
                        value={formData?.[sectionIndex]?.['jrf_semisolid_input']}
                        onChange={(e) =>
                          onChange(
                            sectionIndex,
                            "jrf_semisolid_input",
                            e.target.value
                          )
                        }
                        className="form-control rounded-2 sub-element"
                      />
                    </div>
                    <div>
                      <b>Gaseous :</b>
                      {
                        petroGaseousOptions.map((singleOPT, i) => (
                          <div className="customInputDiv">
                            <span>{(i !== 0 && '/ ' || '') + singleOPT}</span>
                            <input
                              type="radio"
                              id={"jrf_gaseous_checkbox"}
                              name={"jrf_gaseous_checkbox"}
                              value={singleOPT}
                              checked={formData?.[sectionIndex]?.['jrf_gaseous_checkbox'] === singleOPT}
                              onChange={(e) => onChange(sectionIndex, 'jrf_gaseous_checkbox', singleOPT)}
                            />
                          </div>
                        ))
                      }
                      <span>, {"Specify (if available)"} </span>
                      <input
                        type="text"
                        id="jrf_gaseous_input"
                        name="jrf_semisolid_input"
                        value={formData?.[sectionIndex]?.['jrf_gaseous_input']}
                        onChange={(e) =>
                          onChange(
                            sectionIndex,
                            "jrf_gaseous_input",
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

                  <table className="customInput_table">
                    <thead></thead>
                    <tbody>
                      <tr>
                        <td>For Raw Sample:</td>
                        <td className="small-gap-chklst">{"> 2 Kg"}</td>
                        <td>
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
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                        <td className="small-gap-chklst">{">=1KG"}</td>
                        <td>
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
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>{"Specify,"}<span className="if_avail_checklist">(if avalible)</span></td>
                        <td>
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
                        </td>
                      </tr>
                      <br />
                      {/*For Powdered Samples */}
                      <tr>
                        <td>For Powdered Sample:</td>
                        <td className="small-gap-chklst">{" <100gm"}</td>
                        <td>
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
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                        <td className="small-gap-chklst">{"/> 100gm & below <=200gm"}</td>
                        <td>
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
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>{"Specify, "}<span className="if_avail_checklist">(if avalible)</span></td>
                        <td>
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
                        </td>
                      </tr>

                    </tbody>

                  </table>
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
