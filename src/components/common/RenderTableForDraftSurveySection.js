import React, { useEffect, useState } from "react";
import RenderFields from "./RenderFields";
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";

import ActionOptionsTable from "./ActionOptionsTable";
import {
  getChangeOnShipsValue,
  getDisplacementDifferenceCalc,
  getSelectedOptionName,
  getTotalValues,
  numberToOrdinalWord,
} from "../../services/commonFunction";
import PropTypes from "prop-types";
import SampleVerificationDetals from "./commonModalForms/SampleVerificationDetals";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import ConfirmationModal from "./ConfirmationModal";
const RenderTableForDraftSurveySection = ({
  section,
  sectionIndex,
  handleFieldChange,
  formData,
  setFormData,
  formErrors,
  action,
  isTabOpened
}) => {
  const [addInterm, setAddInterm] = useState(0);
  const [addFinal, setAddFinal] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [interimCount, setIntermCount] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState("");
  const defaultValue = "-"
  const header1ShipsValue = getChangeOnShipsValue(
    formData,
    getTotalValues(formData, "initial", section.headers1),
    addFinal ? getTotalValues(formData, "final", section.headers1) : getTotalValues(
      formData,
      "interim_" + (interimCount.length - 1),
      section.headers1
    ),
    addFinal
  );
  const header2ShipsValue = header1ShipsValue;
  const opsvd_diffdisplacement = getDisplacementDifferenceCalc(formData, interimCount.length, addFinal)
  useEffect(() => {
    let updatedFormData = { ...formData };
    if (!updatedFormData[1]) {
      updatedFormData[1] = {};
    }
    if (formData?.[0]?.opsvd_survey_keel_correction) {
      updatedFormData[1]["opsvd_remarks"] =
        "Total Cargo discharge : " + formData[1]?.opsvd_roundoffqty;
    }
    else {
      updatedFormData[1]["opsvd_remarks"] =
        "Total Cargo discharge : " +
        (Math.round(
          (parseFloat(opsvd_diffdisplacement) || 0) +
          (parseFloat(header2ShipsValue) || 0)
        ) || defaultValue);
    }
    setFormData(updatedFormData)
  }, [
    Math.round(
      parseFloat(opsvd_diffdisplacement) +
      parseFloat(header2ShipsValue) || 0
    ),
  ]);



  const getSingleCommonfield = (name, type, label = "", options = [], isShowTime = false, isMinimum, isReadOnly) => {
    let minTime = "";
    let minDate = "";
    let maxTime = "";
    if (isMinimum) {
      const spFname = name.split('-');
      const spName = spFname[1];
      if (spFname[0] === "todate_time") {
        let selectedDate = formData?.[1]?.['fromdate_time-' + spName];
        let anotherDate = formData?.[1]?.['todate_time-' + spName]
        if (anotherDate) {
          anotherDate = new Date(anotherDate)
        }
        selectedDate = selectedDate ? new Date(selectedDate) : null;


        if (selectedDate) {
          minTime = selectedDate; // Set minTime to the current time (allowing future times from now)
          maxTime = new Date(0, 0, 0, 23, 59); // Set maxTime to 23:59 for today
          minDate = selectedDate; // Set minDate to today's date (disable past dates)
        }
        else {
          const nowDate = new Date();
          // If there's no selected date, set default to today's date and current time
          minDate = nowDate;
          minTime = nowDate; // Set minTime to the current time
          maxTime = new Date(0, 0, 0, 23, 59); // Max time for today
        }
        if (anotherDate && anotherDate != selectedDate) {
          minTime = new Date(0, 0, 0, 0, 0);
          maxTime = new Date(0, 0, 0, 23, 59);
        }
      }

      // minTime = formData?.[1]?.['fromdate_time-' + spName]
      // const now = new Date(minTime);
      // const hours = String(now.getHours()).padStart(2, '0');
      // const minutes = String(now.getMinutes()).padStart(2, '0');
      // minTime = `${hours}:${minutes}`



    }
    let characterLimit = ""
    if (name === "opsvd_remarks") {
      characterLimit = 150
    }
    return (
      <RenderFields
        field={{
          width: 4,
          name: name,
          label: label,
          type: type,
          options: options,
          fieldWidth: 75,
          disabled: isViewOnly || isReadOnly,
          readOnly: isViewOnly || isReadOnly,
          viewOnly: isViewOnly || isReadOnly,
          defaultValue: options.length ? options[0] : "",
          showTimeSelect: isShowTime,
          fieldWidth: 100,
          noLimitation: true,
          minTime: minTime,
          minDate: minDate,
          maxTime: maxTime,
          characterLimit: characterLimit,
          noRestrictionApply: true
        }}
        sectionIndex={sectionIndex}
        fieldIndex={1 * 100 + 1}
        formData={formData}
        handleFieldChange={getCustomInptValue}
        handleFieldBlur={(sesectionIndex, fieldName, value, type, isChecked) => getCustomInptValue(sesectionIndex, fieldName, value, type, isChecked, 1)}
        formErrors={formErrors}
        renderTable={true}
        tableIndex={sectionIndex}
        disabled={isViewOnly}
        readOnly={isViewOnly}
        viewOnly={isViewOnly}
      />
    );
  };
  useEffect(() => {
    if (action === "View") {
      setIsViewOnly(true);
    }
  }, [action]);

  useEffect(() => {
    if (formData[1]?.["opsvd_id"]) {
      if (formData[1]?.opsvd_is_final) {
        setAddFinal(true);
      }
      if (formData[1]?.opsvd_interim_count) {
        setAddInterm(formData[1]?.opsvd_interim_count);
        let newCount = [];
        for (let i = 0; i < formData[1]?.opsvd_interim_count; i++) {
          newCount.push(i);
        }
        setIntermCount(newCount);
      }
    }
  }, [formData[1]?.["opsvd_id"]]);

  const onHandleIntrimButton = () => {
    let isValudValue = true;
    let errorMesg = ""
    const chkValidRes = checkValidation(errorMesg, isValudValue)
    isValudValue = chkValidRes.status
    errorMesg = chkValidRes.msg
    if (!isValudValue) {
      toast.error(errorMesg, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return
    }
    let updatedFormData = { ...formData };
    if (!updatedFormData[1]) {
      updatedFormData[1] = {};
    }
    let existingInterimCount = formData[1]?.opsvd_interim_count;
    //Maybe it should be 1 instead of Zero
    //let existingInterimCount = formData[1]?.opsvd_interim_count;
    existingInterimCount = existingInterimCount
      ? parseInt(existingInterimCount) + 1
      : 1;
    updatedFormData[1]["opsvd_interim_count"] = existingInterimCount;
    setFormData(updatedFormData);
    setAddInterm(existingInterimCount);
    let newCount = interimCount;
    newCount.push(newCount.length);
    setIntermCount(newCount);
  };
  const onHandleIntrimRemove = () => {
    let updatedFormData = { ...formData };
    if (!updatedFormData[1]) {
      updatedFormData[1] = {};
    }
    let existingInterimCount = formData[1]?.opsvd_interim_count;

    existingInterimCount = existingInterimCount
      ? parseInt(existingInterimCount) - 1
      : 0;
    updatedFormData[1]["opsvd_interim_count"] = existingInterimCount;
    setFormData(updatedFormData);
    setAddInterm(existingInterimCount);
    let newCount = interimCount;
    // newCount.push(newCount.length);
    newCount.splice(-1);
    setIntermCount(newCount);
  };
  const checkValidation = (errorMesg, isValudValue) => {
    let existingInterimCount = formData[1]?.opsvd_interim_count;
    section.headers2.map((header) => {
      if (['mean_forward', 'mean_aft', 'port_mid_ship', 'starboard_ship', 'corrected_mean_of_means'].includes(header.name)) {
        if (!formData[1][header.name + "-initial"]) {
          errorMesg = header.label + ' fields is required'
          isValudValue = false;
        }
        else if (formData[1].opsvd_is_final && !formData[1][header.name + "-final"]) {
          errorMesg = header.label + ' fields is required'
          isValudValue = false;
        }
      }
    })
    for (let i = 0; i < existingInterimCount; i++) {
      section.headers2.map((header) => {
        if (['mean_forward', 'mean_aft', 'port_mid_ship', 'starboard_ship', 'corrected_mean_of_means'].includes(header.name)) {
          if (!formData[1][header.name + "-interim" + "_" + i]) {
            errorMesg = header.label + ' fields is required'
            isValudValue = false;
          }
        }
      })
      if (!formData[1]['fromdate_time' + "-interim" + "_" + i]) {
        errorMesg = 'Start Date fields is required'
        isValudValue = false;
      }
      else if (!formData[1]['todate_time' + "-interim" + "_" + i]) {
        errorMesg = 'End Time fields is required'
        isValudValue = false;
      }
    }
    if (!formData[1]['fromdate_time' + "-initial"]) {
      errorMesg = 'Start Date fields is required'
      isValudValue = false;
    }
    else if (!formData[1]['todate_time' + "-initial"]) {
      errorMesg = 'Start Date fields is required'
      isValudValue = false;
    }
    else if (formData[1].opsvd_is_final && !formData[1]['fromdate_time' + "-final"]) {
      errorMesg = 'Start Date fields is required'
      isValudValue = false;
    }
    else if (formData[1].opsvd_is_final && !formData[1]['todate_time' + "-final"]) {
      errorMesg = 'End Time fields is required'
      isValudValue = false;
    }
    return {
      status: isValudValue,
      msg: errorMesg
    }
  }

  const onHandleFanalButton = () => {
    let isValudValue = true;
    let errorMesg = ""
    const chkValidRes = checkValidation(errorMesg, isValudValue)
    isValudValue = chkValidRes.status
    errorMesg = chkValidRes.msg
    if (!isValudValue) {
      toast.error(errorMesg, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return
    }
    let updatedFormData = { ...formData };
    if (!updatedFormData[1]) {
      updatedFormData[1] = {};
    }
    updatedFormData[1]["opsvd_is_final"] = true;
    setFormData(updatedFormData);
    setAddFinal(true);
  };

  const checkConditionOfInputValue = (field, type, value) => {
    const value1 = field === "port_mid_ship" ? value : formData[1]['port_mid_ship-' + type]
    const value2 = field === "mean_aft" ? value : formData[1]['mean_aft-' + type]
    const value3 = field === "mean_forward" ? value : formData[1]['mean_forward-' + type]
    let isValideCondition = true;
    let errorMsg = ""
    if (value3 > value1) {
      if (value1 && value3) {
        isValideCondition = false
        errorMsg = "Forward Draft will be less than Port Midship and Aft , if more than Midship and Aft, Recheck Mean Forward draft.(Check if vessel trim is down by bow)"
      }
    }
    else if (value3 < value1 && value2 < value1) {
      if (value1 && value1 && value3) {
        isValideCondition = false;
        errorMsg = "Aft draft will be more than Forward and midship, if less than forward and midship, Recheck Mean Aft draft (Check if vessel trim is down by bow)"
      }
    }
    if (!isValideCondition) {
      setConfirmMsg(errorMsg)
      setIsConfirmOpen(true)
    }
  }
  const getCustomInptValue = (sesectionIndex, fieldName, value, type = "", isChecked = "", isCheckCondition) => {
    let spField = fieldName.split('-')
    if (["mean_forward", "mean_aft", "port_mid_ship"].includes(spField[0])) {
      if (value > 18) {
        setConfirmMsg("You can not enter more then 18 Mtrs")
        setIsConfirmOpen(true)
        return
      }
      else {
        if (isCheckCondition) {
          checkConditionOfInputValue(spField[0], spField[1], value)
        }
      }
    }
    if (spField[0] === "todate_time" && !isCheckCondition) {
      let minTime = "";
      const spName = fieldName.split('-')[1];
      minTime = formData?.[1]?.['fromdate_time-' + spName]
      const now = new Date(minTime);
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      minTime = `${hours}:${minutes}`
      // if (value < minTime) {
      //   toast.error("Please select valide end time", {
      //     position: "top-right",
      //     autoClose: 2000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     progress: undefined,
      //     theme: "light",
      //   });
      //   return
      // }
    }
    if (["displacement", "trim_correction", "density_correction"].includes(spField[0])) {
      getCorrectedDisplaceMentValue(spField[0], spField[1], value, sesectionIndex)
    }
    if (type === "number") {
      const spValue = value.split('.')

      if (spValue[1]) {
        if (['observed_density', 'corrected_mean_of_means'].includes(spField[0])) {
          if (spValue[1].length > 6) {
            // value=parseFloat(value).toFixed(5)
            return
          }
        }
        else {
          if (spValue[1].length > 3) {
            // value=parseFloat(value).toFixed(3)
            return
          }
        }
      }
    }
    handleFieldChange(sesectionIndex, fieldName, value, type, isChecked)
  }

  const getCorrectedDisplaceMentValue = (name = "", type = "", value, sesectionIndex) => {
    let correctedValue = 0;
    const displacementValue = name === "displacement" ? value : formData[1]?.['displacement-' + type] || 0
    const trim_correctionValue = name === "trim_correction" ? value : formData[1]?.['trim_correction-' + type] || 0
    const density_correctionValue = name === "density_correction" ? value : formData[1]?.['density_correction-' + type] || 0
    correctedValue = parseFloat(displacementValue) + parseFloat(trim_correctionValue) + parseFloat(density_correctionValue)
    correctedValue = correctedValue ? correctedValue.toFixed(3) : correctedValue
    handleFieldChange(sesectionIndex, 'corrected_displacement-' + type, correctedValue)
  }
  const handleClose = () => {
    setConfirmMsg("")
    setIsConfirmOpen(false)
  }
  const handleConfirm = () => {
    setConfirmMsg("")
    setIsConfirmOpen(false)
  }

  const checkIntrimValidation = (type = "") => {
    const opsvd_survey_at = formData[0]?.opsvd_survey_at
    let portType = 'Port'
    if (opsvd_survey_at == 1) {
      portType = "Port"
    }
    else if (opsvd_survey_at == 2) {
      portType = "Jetty"
    }
    else if (opsvd_survey_at == 3) {
      portType = "Ancharage"
    }
    let isInterim = true
    if (formData[0]?.opsvd_survey_at_sow === 'Initial and Final draft survey at ' + portType) {
      isInterim = false
    }
    if (type === "finalBtn") {
      if (isInterim && formData[1]["opsvd_interim_count"] == 0) {
        return false;
      }
    }
    else {
      return isInterim
    }
    return true
  }
  return (
    <div key={sectionIndex} className="row my-2 mx-0 bg-white">
      <Card className="Scrollable">
        <CardBody>
          <CardTitle tag="h5">{section.title}</CardTitle>
          <CardSubtitle
            className="mb-2 text-muted draft_table_subtitle"
            tag="h6"
          >
            Quantity On Board On Ship's Account
          </CardSubtitle>
          {/* <hr className="dotted_underline"/> */}
          <table
            className={
              "table table-white responsive borderless no-wrap mt-3 align-middle renderTable draftSurveyRenderTable " +
              (addInterm != 0 && "draftSurveyRenderTable_final")
            }
          >
            <thead>
              <tr>

                <th>Title</th>
                <th>Initial</th>
                {addInterm != 0 && (
                  <>
                    {interimCount.map((count) => (
                      <th>{numberToOrdinalWord(count + 1)} Interim</th>
                    ))}
                  </>
                )}
                {addFinal && (
                  <>
                    <th>Final</th>
                  </>
                )}

                <th>Units</th>
              </tr>
            </thead>
            <tbody>

              <tr>
                <td>Start Date Time</td>
                <td>{getSingleCommonfield("fromdate_time-initial", "date", "", [], 1)}</td>
                {addInterm != 0 && (
                  <>
                    {interimCount.map((count) => (
                      <td>{getSingleCommonfield("fromdate_time-interim_" + count, "date", "", [], 1)}</td>
                    ))}
                  </>
                )}
                {addFinal && (
                  <td>{getSingleCommonfield("fromdate_time-final", "date", "", [], 1)}</td>
                )}
                <td>-</td>
              </tr>
              <tr>
                <td>End Time</td>
                <td>{getSingleCommonfield("todate_time-initial", "date", "", [], 1, 1)}</td>
                {addInterm != 0 && (
                  <>
                    {interimCount.map((count) => (
                      <td>{getSingleCommonfield("todate_time-interim_" + count, "date", "", [], 1, 1)}</td>
                    ))}
                  </>
                )}
                {addFinal && (
                  <td>{getSingleCommonfield("todate_time-final", "date", "", [], 1, 1)}</td>
                )}
                <td>-</td>
              </tr>
              {section.headers1.map((header) => {
                return (
                  <tr>
                    <td>{header.label}</td>
                    <td className="draftSurveyTd">
                      {getSingleCommonfield(header.name + "-initial", "number")}
                    </td>
                    {addInterm != 0 && (
                      <>
                        {interimCount.map((count) => (
                          <td>
                            {getSingleCommonfield(
                              header.name + "-interim_" + count,
                              "number",
                              "",
                              []
                            )}
                          </td>
                        ))}
                      </>
                    )}
                    {addFinal && (
                      <td>
                        {getSingleCommonfield(header.name + "-final", "number")}
                      </td>
                    )}

                    <td>
                      {getSingleCommonfield(
                        header.name + "-unit",
                        "select",
                        "",
                        ["MT"]
                      )}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td className="Draft_survey_imp_td">Total</td>
                <td className="draft_survey_td">{formData[0]?.ji_id && getTotalValues(formData, "initial", section.headers1) || defaultValue}</td>
                {addInterm != 0 && (
                  <>
                    {interimCount.map((count) => (
                      <td className="draft_survey_td">
                        {getTotalValues(
                          formData,
                          "interim_" + count,
                          section.headers1
                        ) || defaultValue}
                      </td>
                    ))}
                  </>
                )}
                {addFinal && (
                  <td className="draft_survey_td">{getTotalValues(formData, "final", section.headers1)}</td>
                )}
                <td className="draft_survey_td">MT</td>
              </tr>
              {
                formData?.[0]?.opsvd_survey_keel_correction ?
                  (
                    <>
                      <tr>
                        <td className="Draft_survey_imp_td">Change on ship's Account</td>
                        <td></td>
                        <td className="draft_survey_td">{getSingleCommonfield("opsvd_changeonshipaccount", "number")}</td>
                      </tr>
                    </>
                  ) : (
                    <>

                      <tr>
                        <td className="Draft_survey_imp_td">Change on ship's Account</td>
                        <td></td>
                        <td className="draft_survey_td">{header1ShipsValue || defaultValue}</td>
                      </tr>
                    </>
                  )
              }

            </tbody>
          </table>
          <div className="draftSurveyRenderTable_btns_container">
            <div className="submit_btns draftSurveyRenderTable_btns">
              {
                addInterm != 0 && !addFinal && <button
                  type="button"
                  className="saveBtn"
                  id="submit_btn3"
                  onClick={() => onHandleIntrimRemove()}
                  disabled={isViewOnly}
                >
                  Delete Interim
                </button> || null
              }
              {!addFinal && checkIntrimValidation() && (
                <button
                  type="button"
                  className="saveBtn"
                  id="submit_btn3"
                  onClick={() => onHandleIntrimButton()}
                  disabled={isViewOnly || !checkIntrimValidation()}
                >
                  Add Interim
                </button>
              )}
              {!addFinal && checkIntrimValidation('finalBtn') && (
                <button
                  type="button"
                  className="saveBtn"
                  id="submit_btn3"
                  onClick={() => onHandleFanalButton()}
                  disabled={isViewOnly || !checkIntrimValidation('finalBtn')}
                >
                  Add Final
                </button>
              )}
            </div>
          </div>
          <hr />
          <table
            className={
              "table table-white responsive borderless no-wrap mt-3 align-middle renderTable draftSurveyRenderTable " +
              (addInterm != 0 && "draftSurveyRenderTable_final")
            }
          >
            <tbody>
              {section.headers2.map((header) => {
                return (
                  <tr>
                    <td>{header.label}</td>
                    <td className="draftSurveyTd">
                      {getSingleCommonfield(header.name + "-initial", 'number', [], '', '', '', ['corrected_displacement'].includes(header.name))}
                    </td>
                    {addInterm != 0 && (
                      <>
                        {interimCount.map((count) => (
                          <td>
                            {getSingleCommonfield(
                              header.name + "-interim_" + count,
                              "number", [], '', '', '', ['corrected_displacement'].includes(header.name)
                            )}
                          </td>
                        ))}
                      </>
                    )}
                    {addFinal && (
                      <td>
                        {getSingleCommonfield(header.name + "-final", "number", [], '', '', '', ['corrected_displacement'].includes(header.name))}
                      </td>
                    )}

                    <td>
                      {!['observed_density'].includes(header.name) ? getSingleCommonfield(
                        header.name + "-unit",
                        "select",
                        "",
                        ['mean_forward', 'mean_aft', 'port_mid_ship', 'starboard_ship', 'corrected_mean_of_means'].includes(header.name) ? ['M'] : ["MT"]
                      ) : "-"}
                    </td>
                  </tr>
                );
              })}
              {
                formData?.[0]?.opsvd_survey_keel_correction ? (
                  <>
                    <tr>
                      <td className="Draft_survey_imp_td">Difference in Displacement</td>
                      <td>{getSingleCommonfield("opsvd_diffdisplacement", "number")}</td>

                      <td className="draft_survey_td">
                        MT
                      </td>
                    </tr>
                    <tr>

                      <td className="Draft_survey_imp_td">Change on ship's Account</td>
                      <td>{getSingleCommonfield("opsvd_changeonshipaccount", "number")}</td>

                      <td className="draft_survey_td">MT</td>
                    </tr>
                    <tr>
                      <td className="Draft_survey_imp_td">
                        Quantity{" "}
                        {formData[0].ji_is_loading === "Loading" ? "Loaded" : "Discharged"}{" "}
                      </td>
                      <td>{getSingleCommonfield("opsvd_qtydischargedorloaded", "number")}</td>

                      <td className="draft_survey_td">MT</td>
                    </tr>
                    <tr>
                      <td className="Draft_survey_imp_td">Rounded of Qty.</td>
                      <td>{getSingleCommonfield("opsvd_roundoffqty", "number")}</td>
                      <td className="draft_survey_td">MT</td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr>
                      <td className="Draft_survey_imp_td">Difference in Displacement</td>
                      <td></td>

                      <td className="draft_survey_td">
                        {opsvd_diffdisplacement || defaultValue} MT
                      </td>
                    </tr>
                    <tr>

                      <td className="Draft_survey_imp_td">Change on ship's Account</td>
                      <td></td>

                      <td className="draft_survey_td">{header2ShipsValue || defaultValue} MT</td>
                    </tr>
                    <tr>
                      <td className="Draft_survey_imp_td">
                        Quantity{" "}
                        {formData[0].ji_is_loading === "Loading" ? "Loaded" : "Discharged"}{" "}
                      </td>
                      <td></td>

                      <td className="draft_survey_td">
                        {parseFloat(((parseFloat(opsvd_diffdisplacement) || 0) +
                          (parseFloat(header2ShipsValue) || 0) || 0)).toFixed(3)}{" "}
                        MT
                      </td>
                    </tr>
                    <tr>
                      <td className="Draft_survey_imp_td">Rounded of Qty.</td>
                      <td></td>
                      <td className="draft_survey_td">
                        {Math.round(
                          (parseFloat(opsvd_diffdisplacement) || 0) +
                          parseFloat(header2ShipsValue) || 0
                        ) || defaultValue}{" "}
                        MT
                      </td>
                    </tr>
                  </>
                )
              }
            </tbody>
          </table>

          <div className="draft_survey_remarks">
            {getSingleCommonfield("opsvd_remarks", "text", "Remarks")}
          </div>
          {
            formData?.[0]?.opsvd_survey_keel_correction && <div className="draft_survey_remarks">
              {getSingleCommonfield("ds_keel_correction_value", "number", "Keel Correction Value")}
            </div>}
        </CardBody>
      </Card>
      <ConfirmationModal isOpen={isConfirmOpen} handleClose={handleClose} handleConfirm={handleConfirm} popupMessage={confirmMsg} popupHeading={"Draft Survey"} popbuttons={{ no: "Cancel", yes: "Ok" }} isNoOption={true} />
    </div>
  );
};

RenderTableForDraftSurveySection.propTypes = {
  section: PropTypes.string,
  sectionIndex: PropTypes.number,
  formData: PropTypes.object,
  handleFieldChange: PropTypes.func,
};

export default RenderTableForDraftSurveySection;
