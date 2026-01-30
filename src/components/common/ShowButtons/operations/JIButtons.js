import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  handleJIUpdateStatus,
  handleJIValidation,
} from "../../commonHandlerFunction/jobinstructionHandlerFunctions";
import {
  OperationCargoSupervisionCreateDataFunction,
  vesselListBackFunctionality,
  vesselListNextFunctionality,
  vesselListCancelFunctionality,
  truckOnlySealDailyReport,
  OperationSizeAnalysisCreateDataFunction,
  Operation_Supervision_CreateDataFunction
} from "../../commonHandlerFunction/operations/TMLOperations";
import { encryptDataForURL } from "../../../../utills/useCryptoUtils";
import { getLMSOperationActivity, getOperationActivityUrl, getPlantOperations, getRakeOperations, getVesselOperation, getWithoutSizeAnalysisActivity, getActivityCode, getStackOperations, getOperationActivityListPageUrl } from "../../../../services/commonFunction";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { OperationQualityAssesmentCreateDataFunction, RakeSupervissionDailyReport } from "../../commonHandlerFunction/operations/RakeHandlerOperation";
import { stackSupervissionDailyReport } from "../../commonHandlerFunction/operations/StackHandlerFunctions";
const JIButtons = ({
  action,
  tabOpen,
  setIsPopupOpen,
  setJRFCreationType,
  setInwardBtnchange,
  formData,
  subTableData,
  EditRecordId,
  viewOnly,
  handleBackButtonFunction,
  navigate,
  editReordType,
  setJrfCreationType,
  handleSubmit,
  formConfig,
  setIsOverlayLoader,
  setIsRejectPopupOpen,
  useForComponent,
  activeTab,
  setActiveTab,
  testMemoSetData,
  isDisplayNewAddOption,
  isViewOnlyTable,
  operationStepNo,
  OperationTypeID,
  OperationType,
  parameterDataTableMain,
  isUseForManPower,
  operationMode,
  setSubTableData,
  setFormData,
  JRFTPIFormData,
  setIsCancelPopupOpen,
  isRakeDetails,
  ...props
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [checkState, setCheckState] = useState(false);
  const translate = t;
  const getTotalNotFilledCount = () => {
    let count = 0;
    testMemoSetData.forEach((tab, tabIndex) => {
      count += (formData["tab_" + tabIndex]?.["noFilledCount"] || 0);
    });
    return count;
  };
  const checkValidation = (useFor = "") => {
    if ([getVesselOperation("HH")].includes(OperationType)) {
      return subTableData.length === 0;
    }
    else if (OperationType === getVesselOperation("DS") && useFor == "post") {
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
      let isInterim = true;
      if (formData[0]?.opsvd_survey_at_sow === 'Initial and Final draft survey at ' + portType) {
        isInterim = false
      }
      if (!formData[1]?.opsvd_is_final) {
        return true
      }
      else if (isInterim && formData[1]["opsvd_interim_count"] === 0) {
        return true
      }
    }
    else if ([getStackOperations("ST_SV"), getRakeOperations("RK_SV")].includes(OperationType)) {
      return subTableData.length === 0;
    } else if (
      getLMSOperationActivity().includes(OperationType)
    ) {
      if (operationStepNo == 1) {
        const paramsaved = parameterDataTableMain.filter((singleParam) => {
          return singleParam.labIdSaved;
        });
        return paramsaved.length === 0;
      } else if (operationStepNo == 2) {
        return subTableData.length == 0;
      } else if (operationStepNo == 3) {
        if (useFor === "finalPost") {
          let addedSampleIds = []
          const finalpostdata = subTableData.filter((singleParam) => {
            if (singleParam.jila_for_jrf || singleParam.jila_for_tpi) {
              // addedSampleIds.push(singleParam.jila_set_smpljson_ids)
              addedSampleIds = [...addedSampleIds, ...singleParam.jila_set_smpljson_ids]
            }
            return singleParam.jila_for_jrf || singleParam.jila_for_tpi;
          });
          // return finalpostdata.length === 0;
          return addedSampleIds?.length !== props?.allSampleIds?.length;
        }
        return subTableData.length == 0;
      } else if (operationStepNo == 5) {
        const finalpostdata = subTableData.filter((singleParam) => {
          return singleParam.jila_for_jrf || singleParam.jila_for_tpi;
        });
        return finalpostdata.length === 0;
      }
    } else if (useFor === "JIAdminCheck") {
      if (editReordType === "analysis") {
        const scopeofworkdata = formData?.[1]?.["scope_of_work_data"] || [];
        const existsLMS = scopeofworkdata.find((singleData) =>
          getLMSOperationActivity().includes(getActivityCode(singleData?.activity_master?.activity_code).toLowerCase())
        );
        if (
          (formData?.[1]?.ji_internal_status === "created")
        ) {
          return true
        }
        return false
        if (
          (existsLMS && subTableData.length === 0) ||
          (!existsLMS && formData?.[1]?.ji_internal_status === "created")
        ) {
          return true;
        }
      } else if (editReordType !== "nomination" && subTableData.length === 0) {
        return true;
      }
    }
    return false;
  };
  const manPowerButton = () => {
    return (
      <div className="submit_btns">
        <React.Fragment>
          <Button
            type="button"
            className="cancelBtn"
            id="submit_btn3"
            onClick={() => {
              // handleBackButtonFunction();
              navigate(getOperationActivityUrl(operationMode) + encryptDataForURL(EditRecordId))
            }}
          >
            {translate("common.backBtn")}
          </Button>

          <>
            {/* <Button type="button" className="submitBtn" id="submit_btn1">
              {translate("common.postBtn")}
            </Button> */}
          </>
        </React.Fragment>
      </div>
    );
  };
  const LMSViewDetailsButton = () => {
    return (
      <div className="submit_btns">
        <React.Fragment>
          <Button
            type="button"
            className="cancelingBtn"
            id="submit_btn3"
            onClick={() => {
              navigate(
                "/operation/vessel-ji-list/vessel-list/" +
                encryptDataForURL(EditRecordId)
              );
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="cancelBtn"
            id="submit_btn3"
            onClick={
              (OperationType === getVesselOperation("SV")) && activeTab !== "1-0"
                ? () => {
                  const spValue = activeTab.split("-");
                  const newValue = parseInt(spValue[1]) - 1;
                  setActiveTab("1-" + newValue);
                }
                : () => {
                  vesselListBackFunctionality(
                    formData,
                    OperationType,
                    OperationTypeID,
                    navigate,
                    operationStepNo,
                    action,
                    operationMode
                  );
                }
            }
          >
            {translate("common.backBtn")}
          </Button>
          {![5, 4].includes(operationStepNo) ? operationStepNo == 3 && getWithoutSizeAnalysisActivity().includes(OperationType) ? null : (
            <>
              <button
                type="button"
                className="saveBtn"
                id="submit_btn2"
                data-name="save"
                onClick={(e) => {
                  vesselListNextFunctionality(
                    formData,
                    OperationType,
                    OperationTypeID,
                    navigate,
                    operationStepNo,
                    action,
                    operationMode
                  );
                }}
                disabled={checkValidation()}
              >
                {operationStepNo == 4 ? "Save" : operationStepNo == 3 && !getLMSOperationActivity().includes(OperationType)
                  ? "Save"
                  : "Next"}
              </button>

            </>

          ) : null}
        </React.Fragment>
      </div>
    );
  };

  const checkShowButtonConditon = () => {
    if ([getRakeOperations('QAss'), getRakeOperations('QA')].includes(OperationType)) {
      if (formData?.[0].rake_qas_id || formData?.[0].rake_qan_id) {
        return true;
      }
      else {
        if (getRakeOperations('QA') == OperationType) {
          return true
        }
        return true
      }
    }
    else {
      return true;
    }
  }
  const checkLabOtherTIPIBeforeSendToJRF = (type) => {
    let JRFData = [];
    let TPIData = [];
    let labids = [];
    for (let obj in JRFTPIFormData[0]) {
      let name = obj.split("_");
      const id = name[name.length - 1];
      if (JRFTPIFormData[0][obj] && JRFTPIFormData[0][obj][0] === "Yes") {
        subTableData.filter((singleData, index) => {

          if (id == singleData.jila_id) {
            if (singleData.lab_detail) {
              if (!labids.includes(singleData.fk_labid)) {
                labids.push(singleData?.fk_labid)
              }
            }
            else {
              if (!labids.includes('OtherTPI')) {
                labids.push('OtherTPI')
              }
            }
          }
        })
        JRFData.push(id);
        TPIData.push(id);
      }
    }
    let isValide = true;
    let errorMsg = ""
    if (labids.length > 1) {
      isValide = false
      errorMsg = "You have to select same lab"
    }
    if (type === "postJRF") {
      if (JRFData.length === 0) {
        isValide = false
        errorMsg = "Please choose Parameter for sent To JRF"
      }
      else if (labids[0] === "OtherTPI") {
        isValide = false
        errorMsg = "Please choose Lab id for sent To JRF"
      }
      else {
        setFormData((prevData) => {
          return {
            ...prevData,
            1: {
              ...prevData[1],
              "send_for_jrf_lab_id": labids[0],
            },
          };
        });
      }
    }
    else if (type === "postOther") {
      if (JRFData.length === 0) {
        isValide = false
        errorMsg = "Please choose Parameter for sent To External Results"
      }
      else if (labids[0] !== "OtherTPI") {
        isValide = false
        errorMsg = "Please choose Lab id for sent To External Results"
      }
    }
    if (!isValide) {
      toast.error(errorMsg, {
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
    setJRFCreationType(type);
    setIsPopupOpen(true);
  }

  const sendDailyReportHandler = async () => {
    try {
      setIsOverlayLoader(true)
      if (getRakeOperations("QAss") === OperationType)
        await OperationQualityAssesmentCreateDataFunction(
          formData,
          setIsOverlayLoader,
          setIsPopupOpen,
          OperationType,
          OperationTypeID,
          navigate,
          subTableData,
          'save',
          operationMode,
          operationStepNo,
          '',
          formConfig.sections[1]?.tabs?.[0],
          setSubTableData,
          setFormData,
          formConfig,
          setActiveTab,
          activeTab,
          1
        );
      else if (getStackOperations("ST_SV") === OperationType)
        await stackSupervissionDailyReport(formData, navigate, OperationTypeID)
      else if (getRakeOperations("RK_SV") === OperationType)
        await RakeSupervissionDailyReport(formData, navigate, OperationTypeID)
    }
    catch (ex) {
      setIsOverlayLoader(false)
    }
    // finally{
    //   setIsOverlayLoader(false)
    // }
  }

  return isRakeDetails ? (
    <div className="submit_btns">
      <Button
        type="button"
        className="cancelBtn"
        id="submit_btn3"
        onClick={() => {
          vesselListBackFunctionality(
            formData,
            OperationType,
            OperationTypeID,
            navigate,
            operationStepNo,
            "",
            operationMode
          );
        }}
      >
        {translate("common.backBtn")}
      </Button>
      <button
        type="button"
        className="saveBtn"
        id="submit_btn2"
        data-name="save"
        onClick={(e) => {
          setJRFCreationType("save");
          setIsPopupOpen(true);
        }}
        disabled={checkValidation()}
      >
        Save
      </button>
    </div>
  ) :
    action !== "opsView" ? (
      <div className="submit_btns">
        {!useForComponent ? (
          !viewOnly && (
            <React.Fragment>
              <Button
                type="button"
                className="cancelBtn"
                id="submit_btn3"
                onClick={() => {
                  if (editReordType === "nomination") {
                    navigate('/operation/jrfInstructionListing/job-instruction-analysis/' + encryptDataForURL(formData?.[0]?.ji_id) + '/' + encryptDataForURL('analysis'))
                  }
                  else if (editReordType === "analysis") {
                    // localStorage.setItem('isMainScopeWork',1);
                    dispatch(
                      {
                        type: "MAIN_SCOPE_WORK",
                        isMainScopeWork: 1
                      }
                    );
                    navigate('/operation/jrfInstructionListing/job-instruction/' + encryptDataForURL(formData?.[0]?.ji_id))
                  }
                  else {
                    if (props.isMainJiSaved) {
                      // localStorage.setItem('isMainScopeWork','');
                      dispatch(
                        {
                          type: "MAIN_SCOPE_WORK",
                          isMainScopeWork: ""
                        }
                      );
                      props.setTabOpen(false)
                      props.setMainJISaved(false)
                      setSubTableData([])
                    }
                    else {
                      setTimeout(() => {
                        handleBackButtonFunction();
                      }, [10])

                    }
                  }
                }}
              >
                {translate("common.backBtn")}
              </Button>

              <>
                {!['posted', 'accepted'].includes(formData?.[0]?.status) && <button
                  type="button"
                  className="saveBtn"
                  id="submit_btn2"
                  data-name="save"
                  onClick={(e) =>
                    handleJIValidation(
                      handleSubmit,
                      setJrfCreationType,
                      setIsPopupOpen,
                      "save"
                    )
                  }
                >
                  {translate("common.saveBtn")}
                </button>}
                <Button
                  type="button"
                  className="submitBtn"
                  id="submit_btn1"
                  // disabled={editReordType !== "nomination" && !['posted', 'accepted'].includes(formData?.[0]?.status)}
                  onClick={(e) =>
                    handleJIUpdateStatus(
                      formData,
                      formConfig,
                      setIsOverlayLoader,
                      editReordType,
                      navigate,
                      1,           // isMainStatusChange = true
                      "accepted",  // mainStatus = "accepted"
                      "",          // remarkText = ""
                      subTableData
                    )
                  }
                >
                  {translate("common.postBtn")}
                </Button>


                {
                  ['posted', 'accepted'].includes(formData?.[0]?.status) && subTableData.filter((singleData) => singleData.status === "tasked").length === subTableData.length && (<Button
                    type="button"
                    className="saveBtn"
                    id="submit_btn1"
                    onClick={(e) => {
                      setIsRejectPopupOpen(true)
                      setIsCancelPopupOpen(true)
                    }
                    }
                  >
                    Cancel JI
                  </Button>)
                }
              </>
            </React.Fragment>
          )
        ) : useForComponent === "OperationDetails" ? (
          <React.Fragment>
            <Button
              type="button"
              className="cancelingBtn"
              id="submit_btn3"
              // onClick={() => {
              //   navigate(
              //     "/operation/vessel-ji-list/vessel-list/" +
              //     encryptDataForURL(EditRecordId)
              //   );
              // }}
              onClick={() => vesselListCancelFunctionality(
                formData,
                navigate,
                operationMode
              )}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="cancelBtn"
              id="submit_btn3"
              onClick={

                ([getVesselOperation("SV"), getRakeOperations("QAss")].includes(OperationType)) &&
                  activeTab !== "1-0" &&
                  // formData[1]?.ops_status !== "posted" &&
                  action !== "View"
                  ? () => {
                    const spValue = activeTab.split("-");
                    const newValue = parseInt(spValue[1]) - 1;
                    setActiveTab("1-" + newValue);
                  }
                  : () => {
                    vesselListBackFunctionality(
                      formData,
                      OperationType,
                      OperationTypeID,
                      navigate,
                      operationStepNo,
                      "",
                      operationMode
                    );
                  }
              }
            >
              {translate("common.backBtn")}
            </Button>

            {!isViewOnlyTable && !viewOnly && checkShowButtonConditon() ? (OperationType === getVesselOperation("DS") && !tabOpen) ? null : (
              <>
                {" "}
                {[getStackOperations("ST_SV"), getRakeOperations("RK_SV")].includes(OperationType) ? null : <button
                  type="button"
                  className="saveBtn"
                  id="submit_btn2"
                  data-name="save"
                  onClick={(e) => {
                    setJRFCreationType("save");
                    setIsPopupOpen(true);
                  }}
                  disabled={checkValidation()}
                >
                  {operationStepNo == 4 ? "Save" : !getLMSOperationActivity().includes(OperationType)
                    ? "Save"
                    : "Next"}
                </button>}
                {
                  operationStepNo == 4 && (
                    <button
                      type="button"
                      className="saveBtn"
                      id="submit_btn2"
                      data-name="save"
                      onClick={(e) => {
                        dispatch({
                          type: "SIZE_ANALYSIS_DATA",
                          analysisData: subTableData,
                        });
                        OperationSizeAnalysisCreateDataFunction(
                          formData,
                          setIsOverlayLoader,
                          setIsPopupOpen,
                          OperationType,
                          OperationTypeID,
                          navigate,
                          subTableData,
                          operationStepNo,
                          operationMode,
                          OperationType !== getVesselOperation("DM"),
                          "",
                          1
                        );
                      }}
                      disabled={subTableData.length === 0}
                    >
                      Generate Physical Certificate
                    </button>
                  )
                }
                {
                  OperationType === getRakeOperations("QAss") && activeTab === "1-0" ? (<button
                    type="button"
                    className="saveBtn"
                    id="submit_btn2"
                    data-name="save"
                    onClick={(e) => {
                      setJRFCreationType("save");
                      setIsPopupOpen(true);
                    }}
                  >
                    NEXT
                  </button>) : null
                }


                {(OperationType === getVesselOperation("SV")) &&
                  (activeTab !== "1-7" ? (
                    // formData[1]?.ops_status !== "posted" &&
                    action !== "View" ? (
                      <>
                        <Button
                          type="button"
                          className="submitBtn"
                          id="submit_btn1"
                          onClick={(e) => {
                            const spValue = activeTab.split("-");
                            const newValue = parseInt(spValue[1]) + 1;
                            // setActiveTab("1-" + newValue);
                            OperationCargoSupervisionCreateDataFunction(
                              formData,
                              setIsOverlayLoader,
                              setIsPopupOpen,
                              OperationType,
                              OperationTypeID,
                              navigate,
                              subTableData,
                              "save",
                              operationMode,
                              "",
                              "1-" + newValue,
                              setActiveTab,
                              setSubTableData,
                              setFormData,
                              formConfig,
                              1
                            );
                          }}
                        >
                          Next
                        </Button>
                        {activeTab === "1-7" &&
                          <Button
                            type="button"
                            className="submitBtn"
                            id="submit_btn1"
                            onClick={(e) => {
                              OperationCargoSupervisionCreateDataFunction(
                                formData,
                                setIsOverlayLoader,
                                setIsPopupOpen,
                                OperationType,
                                OperationTypeID,
                                navigate,
                                subTableData,
                                "post",
                                operationMode,
                                1
                              );

                            }}
                          >
                            Send Daily Report
                          </Button>
                        }
                      </>
                    ) : (
                      <></>
                      // <Button
                      //   type="button"
                      //   className="submitBtn"
                      //   id="submit_btn1"
                      //   onClick={(e) => {
                      //     Operation_Supervision_CreateDataFunction(
                      //       formData,
                      //       setIsOverlayLoader,
                      //       setIsPopupOpen,
                      //       OperationType,
                      //       OperationTypeID,
                      //       navigate,
                      //       subTableData,
                      //       "post",
                      //       operationMode,
                      //       1
                      //     );

                      //   }}
                      // >
                      //   Send Daily Report
                      // </Button>
                    )
                  ) : (
                    <>
                      <Button
                        type="button"
                        className="submitBtn"
                        id="submit_btn1"
                        onClick={(e) => {
                          Operation_Supervision_CreateDataFunction(
                            formData,
                            setIsOverlayLoader,
                            setIsPopupOpen,
                            OperationType,
                            OperationTypeID,
                            navigate,
                            subTableData,
                            "post",
                            operationMode,
                            1
                          );

                        }}
                      >
                        Send Daily Report
                      </Button>
                      <Button
                        type="button"
                        className="submitBtn"
                        id="submit_btn1"
                        onClick={(e) => {
                          setJRFCreationType("post");
                          setIsPopupOpen(true);
                        }}
                      >
                        Post
                      </Button>
                    </>
                  ))}
                {!(getLMSOperationActivity().includes(OperationType) || OperationType === getVesselOperation("SV")) && !viewOnly ? (OperationType === getRakeOperations("QAss") && activeTab === "1-0") ? null : (
                  <Button
                    type="button"
                    className="submitBtn"
                    id="submit_btn1"
                    disabled={checkValidation('post')}
                    onClick={(e) => {
                      setJRFCreationType("post");
                      setIsPopupOpen(true);
                    }}
                  >
                    Post
                  </Button>
                ) : null}
                {[getRakeOperations("QAss"), getStackOperations("ST_SV"), getRakeOperations("RK_SV")].includes(OperationType) &&
                  <Button
                    type="button"
                    className="submitBtn"
                    id="submit_btn1"
                    disabled={checkValidation('post')}
                    onClick={(e) => {
                      sendDailyReportHandler()
                    }}
                  >
                    Send Daily Report
                  </Button>}
              </>
            ) : (
              getLMSOperationActivity().includes(OperationType) && (
                <>
                  {/* <button
                  type="button"
                  className="saveBtn"
                  id="submit_btn2"
                  data-name="save"
                  onClick={(e) => {
                    
                  }}
                >
                  Next
                </button> */}
                </>
              )
            )}
          </React.Fragment>
        ) : useForComponent === "OperationDetailsAssignment" ? (
          <React.Fragment>
            <Button
              type="button"
              className="cancelBtn"
              id="submit_btn3"
              onClick={() => {
                vesselListBackFunctionality(
                  formData,
                  OperationType,
                  OperationTypeID,
                  navigate,
                  operationStepNo,
                  "",
                  operationMode
                );
              }}
            >
              {translate("common.backBtn")}
            </Button>

            {operationStepNo != 5 && (
              <button
                type="button"
                className="saveBtn"
                id="submit_btn2"
                data-name="save"
                disabled={checkValidation()}
                onClick={(e) => {
                  setJRFCreationType("save");
                  setIsPopupOpen(true);
                }}
              >
                {
                  operationStepNo == 3 && getWithoutSizeAnalysisActivity().includes(OperationType) ? "Save" : "Next"
                }
              </button>

            )}
            {
              action != "View" && (operationStepNo == 3 && action !== "opsView") && subTableData.length > 0 ?
                <>
                  <Button
                    type="button"
                    className="submitBtn"
                    id="submit_btn1"
                    disabled={checkValidation('finalPost')}
                    onClick={(e) => {
                      setJRFCreationType("post");
                      setIsPopupOpen(true);
                    }}
                  >
                    Final Post
                  </Button>
                  {props.labDropDownOptions.find((lab) => lab.id !== "otherTpi") && <div className="button_container">
                    <button
                      type="button"
                      className="submitBtn btn btn-primary"
                      onClick={() => {
                        checkLabOtherTIPIBeforeSendToJRF('postJRF')
                      }}
                    >
                      Send to JRF
                    </button>
                  </div>
                  }
                  {
                    props?.labDropDownOptions.find((lab) => lab.id === "otherTpi") && <div className="button_container">
                      <button
                        type="button"
                        className="submitBtn btn btn-primary"
                        onClick={(e) => {
                          checkLabOtherTIPIBeforeSendToJRF('postOther')
                        }}
                      >
                        Send to External Results
                      </button>
                    </div>
                  }
                </>
                : null
            }
            {operationStepNo == 5 && (
              <>
                <Button
                  type="button"
                  className="submitBtn"
                  id="submit_btn1"
                  disabled={checkValidation('finalPost')}
                  onClick={(e) => {
                    setJRFCreationType("post");
                    setIsPopupOpen(true);
                  }}
                >
                  Final Post
                </Button>
                <button
                  type="button"
                  className="submitBtn"
                  id="submit_btn1"
                  onClick={(e) => {
                    setJRFCreationType("postJRF");
                    setIsPopupOpen(true);
                  }}
                  disabled={subTableData.length == 0 || formData[1]?.smpl_filter_lab === "otherTpi"}
                >
                  Send to JRF
                </button>
                <button
                  type="button"
                  className="submitBtn"
                  id="submit_btn1"
                  onClick={(e) => {
                    setJRFCreationType("postOther");
                    setIsPopupOpen(true);
                  }}
                  disabled={subTableData.length == 0 || formData[1]?.smpl_filter_lab !== "otherTpi"}
                >
                  Send to External Results
                </button>
              </>
            )}
          </React.Fragment>
        ) : useForComponent !== "OperationsList" ? (
          <React.Fragment>
            <Button
              type="button"
              className="cancelBtn"
              id="submit_btn3"
              disabled={
                useForComponent !== "OperationDetailsOtherTPI" &&
                activeTab === "1-0" && useForComponent !== "OperationsJIDetails"
              }
              onClick={
                useForComponent === "OperationDetailsOtherTPI"
                  ? () => {
                    navigate("/operation/other-tpi");
                  }
                  : (e) => {
                    if (activeTab === "1-0") {
                      navigate(getOperationActivityListPageUrl(formData[0]?.operation_type?.operation_type_code));
                    }
                    else {
                      const spValue = activeTab.split("-");
                      const newValue = parseInt(spValue[1]) - 1;
                      setActiveTab("1-" + newValue);
                    }
                  }
              }
            >
              {translate("common.backBtn")}
            </Button>
            <>
              {useForComponent === "OperationsJIDetails" ? (
                <>
                  {
                    // activeTab !== "1-2" ? (
                    //   <Button
                    //     type="button"
                    //     className="submitBtn"
                    //     id="submit_btn1"
                    //     onClick={(e) => {
                    //       const spValue = activeTab.split("-");
                    //       const newValue = parseInt(spValue[1]) + 1;
                    //       setActiveTab("1-" + newValue);
                    //     }}
                    //   >
                    //     Next
                    //   </Button>
                    // ) :
                    (
                      !isViewOnlyTable && (
                        <>
                          <Button
                            type="button"
                            className="saveBtn"
                            id="submit_btn1"
                            onClick={(e) => setIsRejectPopupOpen(true)}
                          >
                            {translate("common.rejectBtn")}
                          </Button>
                          <Button
                            type="button"
                            className="submitBtn"
                            id="submit_btn1"
                            onClick={(e) =>
                              handleJIUpdateStatus(
                                formData,
                                formConfig,
                                setIsOverlayLoader,
                                editReordType,
                                navigate,
                                1,
                                "accepted",
                                "",
                                subTableData
                              )
                            }
                          >
                            {translate("common.acceptBtn")}
                          </Button>
                          <Button
                            type="button"
                            className="saveBtn"
                            id="submit_btn1"
                            onClick={(e) => {
                              setIsRejectPopupOpen(true)
                              setIsCancelPopupOpen(true)
                            }
                            }
                          >
                            Cancel JI
                          </Button>
                        </>
                      )
                    )}
                </>
              ) : useForComponent === "OperationDetailsOtherTPI" ? (
                !viewOnly &&
                !getTotalNotFilledCount() && (
                  <>
                    <Button
                      type="button"
                      className="submitBtn"
                      id="submit_btn1"
                      onClick={() => {
                        setJRFCreationType("save");
                        setIsPopupOpen(true);
                      }}
                    >
                      {translate("common.saveBtn")}
                    </Button>
                    <Button
                      type="button"
                      className="submitBtn"
                      id="submit_btn1"
                      onClick={() => {
                        setJRFCreationType("post");
                        setIsPopupOpen(true);
                      }}
                    >
                      {translate("common.postBtn")}
                    </Button>
                  </>
                )
              ) : null}
            </>
          </React.Fragment>
        ) : null}

      </div>
    ) : (
      LMSViewDetailsButton()
    )
  
};

JIButtons.propTypes = {
  action: PropTypes.func, // Function for handling actions
  tabOpen: PropTypes.bool, // Boolean to indicate if a tab is open
  setIsPopupOpen: PropTypes.func, // Function to set popup open state
  setJRFCreationType: PropTypes.func, // Function to set JRF creation type
  setInwardBtnchange: PropTypes.func, // Function to handle inward button changes
  formData: PropTypes.object, // Form data, object type
  subTableData: PropTypes.array, // Array of sub-table data
  EditRecordId: PropTypes.any, // ID of the record being edited; use 'any' or specify type if known
  viewOnly: PropTypes.bool, // Boolean to indicate view-only mode
  handleBackButtonFunction: PropTypes.func, // Function for handling back button
  navigate: PropTypes.func, // Function for navigation
  editReordType: PropTypes.string, // Type of record being edited, string type
  setJrfCreationType: PropTypes.func, // Function to set JRF creation type
  handleSubmit: PropTypes.func, // Function to handle form submission
  formConfig: PropTypes.object, // Configuration for the form
  setIsOverlayLoader: PropTypes.func, // Function to set overlay loader state
  setIsRejectPopupOpen: PropTypes.func, // Function to set reject popup open state
  useForComponent: PropTypes.string, // String to specify use for component
  activeTab: PropTypes.string, // String to indicate the active tab
  setActiveTab: PropTypes.func, // Function to set active tab
  testMemoSetData: PropTypes.object, // Object containing test memo data
  isDisplayNewAddOption: PropTypes.bool, // Boolean to control display of new add option
};

export default JIButtons;
