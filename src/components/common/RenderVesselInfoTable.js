import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
const RenderVesselInfoTable = ({
  tab,
  RenderFields,
  getCustomCellValues,
  sectionIndex,
  formData,
  handleFieldChange,
  formErrors,
  vieableArr,
  pageType,
  viewOnly
}) => {
  
  const { t } = useTranslation();
  const translate = t;
  const [formCount, setFormCount] = useState(1);
  const handleMultipleBerthClick = () => {
    const newcount = parseInt(formCount) + 1
    setFormCount(newcount);
    handleFieldChange(sectionIndex, "opsvsv_vesselInfoCount", newcount)
  };
  const handleMultipleBerthRemoveClick = () => {
    const newcount = parseInt(formCount) - 1
    setFormCount(newcount);
    handleFieldChange(sectionIndex, "opsvsv_vesselInfoCount", newcount)
  };
  useEffect(() => {
    if (formData?.[1]?.["opsvsv_vesselInfoCount"] > 0) {
      setFormCount(formData?.[1]?.["opsvsv_vesselInfoCount"])
    }
  }, [formData?.[1]?.["opsvsv_vesselInfoCount"]])

  const singleFileChange = (sectionIndex, fieldName, value, type = "", isChecked = "") => {
    let beforeLastPart = fieldName.slice(0, fieldName.lastIndexOf("_"));
    let lastPart = fieldName.slice(fieldName.lastIndexOf("_") + 1);
    let isExists = "";

    if (beforeLastPart === "vessel_arrived") {
      if (formData[1]?.['vessel_birthed_' + lastPart]) {
        isExists = true
      }
      handleFieldChange(sectionIndex, 'vessel_birthed_' + lastPart, value, type = "", isChecked = "")
    }
    // else if (beforeLastPart === "vessel_birthed") {
    //   if (formData[1]?.['initial_draught_survey_' + lastPart]) {
    //     isExists = true
    //   }
    // }
    // else if (beforeLastPart === "initial_draught_survey") {
    //   if (formData[1]?.['end_initial_draught_survey_' + lastPart]) {
    //     isExists = true
    //   }
    //   handleFieldChange(sectionIndex, 'end_initial_draught_survey_' + lastPart, value, type = "", isChecked = "")
    // }
    // else if (beforeLastPart === "end_initial_draught_survey") {
    //   if (formData[1]?.['discharge_commenced_' + lastPart]) {
    //     isExists = true
    //   }
    //   handleFieldChange(sectionIndex, 'discharge_commenced_' + lastPart, value, type = "", isChecked = "")
    // }
    // else if (beforeLastPart === "discharge_commenced") {
    //   if (formData[1]?.['discharge_completed_' + lastPart]) {
    //     isExists = true
    //   }
    //   handleFieldChange(sectionIndex, 'discharge_completed_' + lastPart, value, type = "", isChecked = "")
    // }
    ///////////////////////////////////////
    // else if (beforeLastPart === "discharge_completed") {
    //   if (formData[1]?.['final_draught_survey_' + lastPart]) {
    //     isExists = true
    //   }
    //   handleFieldChange(sectionIndex, 'final_draught_survey_' + lastPart, value, type = "", isChecked = "")
    // }
    // else if (beforeLastPart === "final_draught_survey") {
    //   if (formData[1]?.['end_final_draught_survey_' + lastPart]) {
    //     isExists = true
    //   }
    //   handleFieldChange(sectionIndex, 'end_final_draught_survey_' + lastPart, value, type = "", isChecked = "")
    // }
    /////////////////////////////////////////////////////////////////////
    // if (isExists) {
    //   toast.error(translate("custom.laterDate"), {
    //     position: "top-right",
    //     autoClose: 2000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "light",
    //   });
    // }
    handleFieldChange(sectionIndex, fieldName, value, type = "", isChecked = "")
  }

  return (
    <>
      {Array.from({ length: formCount }).map((_, formIndex) => (
        <React.Fragment key={`form-section-${formIndex}`} className="form-section">
          {tab.fields.map((field, fieldIndex) => {
            let isShow = true;
            // field.name = field.name +"_" +formIndex
            const uniqueFieldName = field.name ? `${field.name}_${formIndex}` : '';
            const uniqueFieldsecondName = `${field.secondName}_${formIndex}`;
            let minDate = ""
            let minTime = ""
            let maxTime = ""
            let fieldType = field.type
            if (['vessel_arrived', 'vessel_birthed', 'initial_draught_survey', 'discharge_commenced', 'discharge_completed', 'final_draught_survey', 'end_initial_draught_survey', 'end_final_draught_survey','intrim_draught_survey','end_intrim_draught_survey'].includes(field.name)) {
              fieldType = "date"
            }
            if (field.name === "vessel_birthed") {
              minDate = formData[1]?.['vessel_arrived_' + formIndex]
            }
            else if (field.name === "initial_draught_survey") {
              if (formData[1]?.['vessel_berth_type_' + formIndex] === "At anchorage") {
                minDate = formData[1]?.['vessel_arrived_' + formIndex]
              }
              else {
                minDate = formData[1]?.['vessel_birthed_' + formIndex]
              }
            }
            else if (field.name === "end_initial_draught_survey") {
              minDate = formData[1]?.['initial_draught_survey_' + formIndex]
            }
            else if (field.name === "discharge_commenced") {
              if (formData[0].ji_is_loading !== "Loading") {
                field.label = "Discharge Commenced"
              }
              else {
                field.label = "Loading Commenced"
              }
              minDate = formData[1]?.['end_initial_draught_survey_' + formIndex]
            }
            else if (field.name === "discharge_completed") {
              if (formData[0].ji_is_loading !== "Loading") {
                field.label = "Discharge Completed"
              }
              else {
                field.label = "Loading Completed"
              }
              minDate = formData[1]?.['discharge_commenced_' + formIndex]
            }
            else if (field.name === "intrim_draught_survey") {
              minDate = formData[1]?.['discharge_completed_' + formIndex]
            }
            else if (field.name === "end_intrim_draught_survey") {
              minDate = formData[1]?.['intrim_draught_survey_' + formIndex]
            }
            else if (field.name === "final_draught_survey") {
              minDate = formData[1]?.['end_intrim_draught_survey_' + formIndex]
            }
            else if (field.name === "end_final_draught_survey") {
              minDate = formData[1]?.['final_draught_survey_' + formIndex]
            }
            if (minDate) {
              minTime = minDate
              minTime = new Date(minDate);
              maxTime = new Date(0, 0, 0, 23, 59);
              // const hours = String(now.getHours()).padStart(2, '0');
              // const minutes = String(now.getMinutes()).padStart(2, '0');
              // minTime = `${hours}:${minutes}`
            }
            return (
              isShow && (
                <div
                  key={`Form-default-${formIndex}-${fieldIndex}`}
                  className={"col-md-" + field.width}
                >
                  <RenderFields
                    // field={getCustomCellValues(field, "sub_table", formIndex)}
                    field={{
                      ...field,
                      name: uniqueFieldName,
                      minDate: minDate,
                      minTime: minTime,
                      maxTime: maxTime,
                      secondName: uniqueFieldsecondName,// Pass the unique name to RenderFields without changing the original field object,
                      type: fieldType,
                      noRestrictionApply: true
                    }}
                    sectionIndex={sectionIndex}
                    fieldIndex={fieldIndex}
                    formData={formData}
                    handleFieldChange={singleFileChange}
                    formErrors={formErrors}
                    viewOnly={!vieableArr.includes(pageType) && viewOnly}
                  />
                </div>
              )
            );
          })}
          <hr />
        </React.Fragment>
      ))}

      {!viewOnly && <div className="submit_btns align-end">
        <button className='plus_icon_btn' type="button" onClick={handleMultipleBerthClick}>
          <p className='plus_icon'>+</p>
          Multiple Berth
        </button>
        {
          formCount > 1 && (
            <button className='plus_icon_btn' type="button" onClick={handleMultipleBerthRemoveClick}>
              <p className='plus_icon'>-</p>
              Delete
            </button>
          )
        }
      </div>}
    </>
  );
};

export default RenderVesselInfoTable;
