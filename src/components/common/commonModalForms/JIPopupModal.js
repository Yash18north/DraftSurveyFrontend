import React, { useEffect, useState } from "react";
import RenderFields from "../RenderFields";
import { Row } from "react-bootstrap";
import viewJIDetails from "../../../formJsonData/Operations/jobinstructions/viewJIDetails.json";
import RenderTablePreview from "../RenderTableSectionPreview";
import RenderTableSection from "../RenderTableSection";
import { getSingleJiRecordForPreview } from "../commonHandlerFunction/jobinstructionHandlerFunctions";
import { getActivityCode, getVesselOperation } from "../../../services/commonFunction";
const JIPopupModal = ({
  section,
  sectionIndex,
  formData,
  handleFieldChange,
  formErrors,
  setViewDetail,
  setIsOverlayLoader,
  isOverlayLoader,
  checkShowButtonConditon
}) => {
  const [subTableData, setSubTableData] = useState([]);
  const [customFormData, setCustomFormData] = useState({});
  const [isShowPopup, setIsShowPopup] = useState(false);
  const getCustomCellValues = (cell) => {
    if (cell.name === "ji_suplier_name") {
      if (customFormData[0]?.ji_is_supplier === "Buyer") {
        cell.label = "Supplier";
      } else if (customFormData[0]?.ji_is_supplier === "Supplier") {
        cell.label = "Buyer";
      }
    } else if (cell.name === "ji_loading_unloading_name") {
      if (customFormData[0]?.ji_is_loading === "Loading") {
        cell.label = "Name of Unloading Port";
      } else {
        cell.label = "Name of Loading Port";
      }
    }
    else if (cell.name === "loading_unloading_country_name") {
      if (formData[0].ji_is_loading === "Loading") {
        if (['RK'].includes(formData[0]?.fk_operationtypetid_code)) {
          cell.label = "Destination and country";
        }
        else {
          cell.label = "Unloading Port and country";
        }
      } else {
        if (['RK'].includes(formData[0]?.fk_operationtypetid_code)) {
          cell.label = "Source and country";
        }
        else {
          cell.label = "Loading Port and country";
        }
      }
    } else if (cell.name === "ji_first_ref_no") {
      if (
        customFormData[0]?.ji_dual_port_seq === "Second" &&
        customFormData[0]?.ji_is_dual_port === "Yes"
      ) {
        // cell.required = true;
      } else {
        // cell.required = false;
      }
    } else if (cell.name === "fk_consortium_order" || cell.name === "consortium_number") {
      if (customFormData[0]?.ji_is_consortium_order === "Yes") {
        // cell.required = true;
      } else {
        // cell.required = false;
      }
    }
    else if (cell.name === "ji_nameofoperationmode") {
      if (['ST', 'MI'].includes(formData[0]?.fk_operationtypetid_code)) {
        cell.label = "Vessel Name (As declared by client)"
      }
      else {
        cell.label = "Vessel Name"
      }
    }
    else if (cell.name === "ji_no_of_sample") {
      cell.label = "No. of Sample"
      if (formData[0]?.fk_operationtypetid_code === "RK") {
        cell.label = "No. of Rake"
      }
      else if (formData[0]?.fk_operationtypetid_code === "TR") {
        cell.label = "No. of Truck"
      }
      else if (formData[0]?.fk_operationtypetid_code === "ST") {
        cell.label = "No. of Stack"
      }
    }
    else if (cell.name === "ji_dos") {
      cell.label = "Date of Sampling"
      if (formData[0]?.fk_operationtypetid_code === "SS") {
        cell.label = "Date of Received"
      }
    }
    return cell;
  };
  useEffect(() => {
    if (formData[0]?.ji_id) {
      getSingleJiRecordForPreview(
        formData[0]?.ji_id,
        setCustomFormData,
        setIsOverlayLoader,
        viewJIDetails?.scopeWorkData?.scopeWordTableData,
        setIsShowPopup,
        setSubTableData
      );
      // setCustomFormData(formData);
      setTimeout(() => {
        setIsShowPopup(true);
      }, 10);
    }
  }, [formData[0]?.ji_id]);

  return (
    isShowPopup && (
      <div className="popupSearchContainerBG">
        <div className="popupInwardModal  JIPopupModal">
          <h1 className="section_heading_middle">Complete Job Details</h1>
          <div className="rejectSearchCross">
            <button
              onClick={() => setViewDetail(false)}
              className="nonNativeButton2"
              aria-label="Reject Button"
            >
              <i className="bi bi-x-lg h4"></i>
            </button>
          </div>
          <div className="JIPopupModalContainer">
            <Row className="main_form">
              {viewJIDetails?.mainform?.map((field, fieldIndex) => {
                let isShow = true;
                // if (
                //   field.name == "ji_dispatch_address"
                //   //  && customFormData[0]?.ji_is_ecertification !== "Print Hard Copy" 
                //   && !(customFormData[0]?.ji_is_hardcopy?.includes("Print Hard Copy"))
                // ) {
                //   isShow = false;
                // } else 
                if (field.name === "ji_with_whom") {
                  if (
                    !customFormData[0]?.ji_type_of_sampling ||
                    ["Independently"].includes(
                      customFormData[0]?.ji_type_of_sampling
                    )
                  ) {
                    isShow = false;
                  }
                }
                else if (field.name === "ji_analysis_with_whom") {
                  if (
                    !formData[0].ji_type_of_analysis ||
                    ["Independently"].includes(
                      formData[0].ji_type_of_analysis
                    )
                  ) {
                    isShow = false;
                  }
                }
                else if (field.name === "fk_consortium_order" || field.name === "consortium_number") {
                  if (customFormData[0]?.ji_is_consortium_order === "No") {
                    isShow = false;
                  }
                } else if (field.name === "ji_dual_port_seq") {
                  if (customFormData[0]?.ji_is_dual_port === "No") {
                    isShow = false;
                  }
                } else if (field.name === "ji_first_ref_no") {
                  if (customFormData[0]?.ji_is_dual_port === "No") {
                    isShow = false;
                  } else if (customFormData[0]?.ji_dual_port_seq === "First") {
                    isShow = false;
                  }
                }
                else if (field.name === "ji_is_plot_no") {
                  if (['SS'].includes(formData[0]?.fk_operationtypetid_code)) {
                    isShow = false;
                  }
                }
                else if (field.name === "ji_plot_no") {
                  if (formData[0]?.ji_is_plot_no === "No") {
                    isShow = false;
                  }
                }
                else if (field.name === "ji_month_name") {
                  if (formData[0]?.ji_is_monthly === "No") {
                    isShow = false;
                  }
                }
                else if (field.name === "ji_eta") {
                  if (['PL', 'RK', 'ST', 'TR', 'PV', 'CS', 'PR', 'CV', 'BO', 'CN', 'RC', 'AS', 'SS', 'PL', 'CM', 'MI'].includes(formData[0]?.fk_operationtypetid_code)) {
                    isShow = false
                  }
                }
                else if (field.name === "ji_is_loading") {
                  if (['PV', 'ST', 'CS', 'PR', 'CV', 'BO', 'SS', 'CM', 'MI'].includes(formData[0]?.fk_operationtypetid_code)) {
                    isShow = false
                  }
                }
                else if (field.name === "loading_unloading_country_name") {
                  if (['PV', 'RK', 'ST', 'CS', 'PR', 'CV', 'BO', 'SS', 'CM', 'MI'].includes(formData[0]?.fk_operationtypetid_code)) {
                    isShow = false
                  }
                }
                else if (field.name === "loading_unloading_port_name") {
                  if (['PV', 'RK', 'ST', 'CS', 'PR', 'CV', 'BO', 'SS', 'CM', 'MI'].includes(formData[0]?.fk_operationtypetid_code)) {
                    isShow = false
                  }
                }
                else if (field.name === "ji_loading_destination") {
                  if (!['RK'].includes(formData[0]?.fk_operationtypetid_code)) {
                    isShow = false
                  }
                }
                else if (field.name === "ji_is_dual_port") {
                  if (['RK', 'ST', 'TR', 'CS', 'TL', 'PR', 'CV', 'BO', 'CN', 'RC', 'AS', 'SS', 'PL', 'CM', 'MI'].includes(formData[0]?.fk_operationtypetid_code)) {
                    isShow = false
                  }
                }
                else if (field.name === "ji_other_placework") {
                  let spPlaceCode = formData[0]?.ji_place_of_work_name ? formData[0]?.ji_place_of_work_name.split('-') : []
                  if (spPlaceCode.length != 2 || spPlaceCode[1].toLowerCase() !== "others") {
                    isShow = false;
                  }
                }
                else if (['fk_supplierid', 'ji_suplier_name', 'ji_is_supplier'].includes(field.name)) {
                  if (['CV', 'BO', 'PV', 'SS', 'CM'].includes(formData[0]?.fk_operationtypetid_code)) {
                    isShow = false
                  }
                }
                else if (['ji_no_of_sample'].includes(field.name)) {
                  if (['PL'].includes(formData[0]?.fk_operationtypetid_code)) {
                    isShow = false
                  }
                }
                return (
                  isShow && (
                    <div
                      className={"col-md-" + field.width}
                      key={"Headers-" + fieldIndex}
                    >
                      <RenderFields
                        field={getCustomCellValues(field)}
                        sectionIndex={0}
                        fieldIndex={fieldIndex}
                        formData={customFormData}
                        handleFieldChange={handleFieldChange}
                        formErrors={formErrors}
                        viewOnly={true}
                      />
                    </div>
                  )
                );
              })}
            </Row>
            <Row className="main_form scopeWorkDataPopup">
              {
                <>
                  {viewJIDetails?.scopeWorkData?.mainTitle?.map(
                    (field, fieldIndex) => {
                      let isShow = true;
                      return (
                        isShow && (
                          <div
                            className={"col-md-" + field.width}
                            key={"Headers-" + fieldIndex}
                          >
                            <RenderFields
                              field={getCustomCellValues(field)}
                              sectionIndex={sectionIndex}
                              fieldIndex={fieldIndex}
                              formData={customFormData}
                              handleFieldChange={handleFieldChange}
                              formErrors={formErrors}
                              viewOnly={true}
                            />
                          </div>
                        )
                      );
                    }
                  )}
                  <RenderTableSection
                    key={`${0}-${0}`}
                    section={viewJIDetails?.scopeWorkData?.scopeWordTableData}
                    sectionIndex={1}
                    formData={customFormData}
                    setFormData={setCustomFormData}
                    action={"View"}
                    setTableData={setSubTableData}
                    tableData={subTableData}
                    moduleType={"jobinstruction"}
                    setIsOverlayLoader={setIsOverlayLoader}
                    isOverlayLoader={isOverlayLoader}
                    isUseForViwOnly={true}
                    checkShowButtonConditon={checkShowButtonConditon}
                  />
                </>
              }
            </Row>

            <Row className="main_form">
              {customFormData[1]?.jiqualityanalysis && (
                <>
                  {viewJIDetails?.assignmentTab?.analysisFields?.map(
                    (field, fieldIndex) => {
                      let isShow = true;
                      if (field.name === "ji_with_whom") {
                        if (
                          !customFormData[0]?.ji_type_of_sampling ||
                          ["Independently"].includes(
                            customFormData[0]?.ji_type_of_sampling
                          )
                        ) {
                          isShow = false;
                        }
                      }
                      else if (field.name === "ji_analysis_with_whom") {
                        if (
                          !formData[0].ji_type_of_analysis ||
                          ["Independently"].includes(
                            formData[0].ji_type_of_analysis
                          )
                        ) {
                          isShow = false;
                        }
                      }
                      return (
                        isShow && (
                          <div
                            className={"col-md-" + field.width}
                            key={"Headers-" + fieldIndex}
                          >
                            <RenderFields
                              field={getCustomCellValues(field)}
                              sectionIndex={sectionIndex}
                              fieldIndex={fieldIndex}
                              formData={customFormData}
                              handleFieldChange={handleFieldChange}
                              formErrors={formErrors}
                              viewOnly={true}
                            />
                          </div>
                        )
                      );
                    }
                  )}

                  <RenderTablePreview
                    key={`${0}-${0}`}
                    section={viewJIDetails?.assignmentTab?.parameterFields}
                    sectionIndex={1}
                    formData={customFormData}
                    isSubPreview={true}
                    moduleType={"jobinstruction"}
                    isSingleParamOnly={true}
                    isUseForViwOnly={true}
                    isPopup={true}
                    isSingleSetOnly={true}
                  />

                </>
              )}
            </Row>
            <Row className="main_form">
              {viewJIDetails?.nominationDetails?.map((field, fieldIndex) => {
                let isShow = true;
                return (
                  isShow && (
                    <div
                      className={"col-md-" + field.width}
                      key={"Headers-" + fieldIndex}
                    >
                      <RenderFields
                        field={getCustomCellValues(field)}
                        sectionIndex={0}
                        fieldIndex={fieldIndex}
                        formData={customFormData}
                        handleFieldChange={handleFieldChange}
                        formErrors={formErrors}
                        viewOnly={true}
                      />
                    </div>
                  )
                );
              })}
            </Row>
            <Row className="main_form">
              {viewJIDetails?.billingDetails?.map((field, fieldIndex) => {
                let isShow = true;
                return (
                  isShow && (
                    <div
                      className={"col-md-" + field.width}
                      key={"Headers-" + fieldIndex}
                    >
                      <RenderFields
                        field={getCustomCellValues(field)}
                        sectionIndex={0}
                        fieldIndex={fieldIndex}
                        formData={customFormData}
                        handleFieldChange={handleFieldChange}
                        formErrors={formErrors}
                        viewOnly={true}
                      />
                    </div>
                  )
                );
              })}
            </Row>
          </div>

        </div>
      </div>
    )
  );
};

export default JIPopupModal;
