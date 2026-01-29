import React, { useEffect, useRef, useState } from "react";
import PopupOptions from "./PopupOptions";
import {
  getComonCodeForCompany,
  getFormatedDate,
  getVesselOperation,
  getCellData,
  getLMSOperationActivity,
  getOperationActivityUrl,
  getSampleCollectionActivity,
  getNonLMSOperationActivity,
  getActivityCode,
  getRakeCollectionActivity,
  getDefaultActivityMode,
  getRakeOperations,
  getStackOperations,
} from "../../services/commonFunction";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

// import PartialIcon from "../../assets/images/icons/Partial.svg";
// import PostedIcon from "../../assets/images/icons/Posted.svg";
// import CompletedIcon from "../../assets/images/icons/Completed.svg";
// import AllotedIcon from "../../assets/images/icons/Alloted.svg";
// import PendingIcon from "../../assets/images/icons/Pending.svg";
// import RejectedIcon from "../../assets/images/icons/Rejected.svg";
// import AcceptedIcon from "../../assets/images/icons/Accepted.svg";
// import InprocessIcon from "../../assets/images/icons/Inprocess.svg";

// import { Row, Col, CardTitle } from "react-bootstrap";
import { postDataFromApi } from "../../services/commonServices";
import { getJIsowandactivityApi, getReportConfigApi } from "../../services/api";
import {
  encryptDataForURL,
  decryptDataForURL,
} from "../../utills/useCryptoUtils";

import PropTypes from "prop-types";
import { toast } from "react-toastify";

export const selectUser = (state) => state.user;

const RenderSubListSection = ({
  section,
  sectionIndex,
  actions,
  responseData,
  getAllListingData,
  formConfig,
  statusCounts,
  setIsRejectPopupOpen,
  setJRFCreationType,
  setIsPopupOpen,
  loadingTable,
  setIsOverlayLoader,
  moduleType,
  formData,
}) => {
  let user = useSelector(selectUser);
  const navigate = useNavigate();
  const session = useSelector((state) => state.session);

  user = session.user;

  const [popupIndex, setPopupIndex] = useState(-1);
  const [sortStates, setSortStates] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(10);
  const [sizeofPage, setSizeOfPage] = useState(10);
  const [countPage, setCountPage] = useState(10);
  const [filteredAction, setFilteredAction] = useState(actions);
  const [subTableData, setSubTableData] = useState([]);

  const popupRef = useRef(null);
  useEffect(() => {
    setSortStates(Array(section.headers?.length).fill(false));
  }, [section]);
  let { EditRecordId, editReordType, TMLType, TMLID, operationName } =
    useParams();
  [EditRecordId, editReordType, TMLType, TMLID, operationName] = [
    EditRecordId,
    editReordType,
    TMLType,
    TMLID,
    operationName,
  ].map((item) => (item ? decryptDataForURL(item) : ""));

  useEffect(() => {
    if (moduleType == "jobinstruction") {
      getJIVesselDataData(formData[0]?.ji_id);
    } else if (moduleType == "confirugationList") {
      getConfigListData(EditRecordId, TMLType);
    }
  }, []);
  const getJIVesselDataData = async (ji_id) => {
    try {
      const bodyData = {
        ji_id: ji_id,
      };
      let res = await postDataFromApi(getJIsowandactivityApi, bodyData);
      if (res?.data?.status === 200 && res.data.data) {
        const responseData = res.data.data;
        const updatedFormData = { ...formData };
        let type = "scope_of_work";
        if (type === "scope_of_work") {
          setSubTableData(responseData[type]);
        }
        // let type1 = "additional_activities";
        // if (type === "scope_of_work") {
        //   setSubTableData([...responseData[type], ...responseData?.[type1]]);
        // }

      }
    } catch (error) {
      console.error(error);
    }
  };
  const getConfigListData = async (ji_id, jis_id) => {
    try {
      const bodyData = {
        ji_id: ji_id,
        jis_id: jis_id,
      };
      let res = await postDataFromApi(getReportConfigApi, bodyData);
      if (res?.data?.status === 200 && res.data.data) {
        const responseData = res.data.data;
        const updatedFormData = { ...formData };
        let type = "scope_of_work";
        if (type === "scope_of_work") {
          setSubTableData(responseData[type]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleClick = (index, fieldName) => {
    const newSortStates = Array(section.headers?.length).fill(false);
    newSortStates[index] = !sortStates[index];
    let sortType = newSortStates[index] ? "desc" : "asc";
    getAllListingData(currentPage, fieldName, sortType);
    setSortStates(newSortStates);
  };

  const handlePaginationButton = (pageNo) => {
    getAllListingData(pageNo);
    setCurrentPage(pageNo);
  };

  const createButton = (page, currentPage, handlePaginationButton) => {
    return (
      <button
        type="button"
        className={
          currentPage === page
            ? "btn btn-danger pagination-active"
            : "btn btn-danger"
        }
        key={"page-" + page}
        onClick={() => handlePaginationButton(page)}
      >
        {page}
      </button>
    );
  };

  const statusesWithColor = formConfig?.listView?.statusesWithColor;

  const getStatus = (formConfig, row) => {
    switch (moduleType) {
      case "sampleinward":
        return row["smpl_status"];
      case "testmemomain":
      case "allotment":
      case "sampleverification":
        return row["status"];
      case "sfm":
        return row["sfm_status"];
      case "internalcertificate":
        return row["status"];
      case "jobinstruction":
        return row["ji_internal_status"];
      case "vesselOperation":
        return row["status"];
      default:
        return row["jrf_status"];
    }
  };

  const getStatusNameValue = (cellData) => {
    let statusData = statusesWithColor;

    let filterStatusData = statusData.filter((jrfColor, jrfColorIndex) => {
      if (Array.isArray(jrfColor.status)) {
        return jrfColor.status.includes(cellData);
      } else {
        return (
          jrfColor &&
          cellData &&
          jrfColor.status.toLowerCase() == cellData.toLowerCase()
        );
      }
    });
    if (filterStatusData.length > 0) {
      filterStatusData = filterStatusData[0];
      return (
        <td key="status_list" className="status-td">
          <div
            className={"table_item_sym " + filterStatusData?.icon + "_bg"}
            key={"table-item"}
          >
            {/* <div className={filterStatusData?.icon}> </div> */}
            {filterStatusData?.name}
          </div>
        </td>
      );
    } else {
      return (
        <td key="status_list" className="status-td">
          <div className="table_item_sym" key={"table-item"} title="">
            <div className="posted_sym"> </div>
            {cellData}
          </div>
        </td>
      );
    }
  };

  const divRef = useRef(null);
  /*
  Author : Yash Darshankar
  Date : 20/06/2024
  Description : This code is used to close the popup when clicked outside the popup.
  */
  const popupOptionsRef = useRef(null);
  const [isBottom, setIsBottom] = useState(false);
  const pageLimit =
    currentPage === totalPage
      ? Math.floor(countPage % sizeofPage) > 3
        ? Math.floor(countPage % sizeofPage)
        : sizeofPage
      : sizeofPage;
  useEffect(() => {
    if (pageLimit - 2 === popupIndex || pageLimit - 1 === popupIndex) {
      setIsBottom(true);
    } else {
      setIsBottom(false);
    }
  }, [popupIndex]);

  const popupIntentionallyOpenedRef = useRef(false);
  /*
   */
  const [dontClick, setDontClick] = useState(false);
  useEffect(() => {
    const handler = (event) => {
      const isLastTd = event.target.classList.contains("last-td");
      const isInsidePopup =
        popupOptionsRef.current &&
        popupOptionsRef.current.contains(event.target);
      if (
        !isInsidePopup &&
        !popupIntentionallyOpenedRef.current &&
        !isLastTd &&
        !dontClick
      ) {
        setPopupIndex(-1);
      }
      popupIntentionallyOpenedRef.current = false;
    };

    document.addEventListener("click", handler);
    setDontClick(false);
    return () => document.removeEventListener("click", handler);
  }, [dontClick]);

  const checkIsShow = (fieldName) => {
    if (moduleType === "allotment") {
      if (
        fieldName === "inward_detail" ||
        fieldName === "sample_allotedto_data"
      ) {
        if (user?.role === "LC") {
          return false;
        }
      }
    } else if (moduleType === "jrf") {
      if (fieldName === "jrf_lab_detail") {
        if (user?.role === "LR") {
          return false;
        }
      } else if (fieldName === "jrf_branch_detail") {
        if (user?.role === "BU") {
          return false;
        }
      }
    }
    return true;
  };

  const handleOnClick = (row) => {
    let opsNo = 2
    if (getLMSOperationActivity().includes(getActivityCode(row["activity_master"]["activity_code"]).toLowerCase())) {
      if (getRakeCollectionActivity().includes(getActivityCode(row["activity_master"]["activity_code"]).toLowerCase())) {
        opsNo = 7
      }
      else if (getSampleCollectionActivity().includes(getActivityCode(row["activity_master"]["activity_code"]).toLowerCase())) {
        opsNo = 6
      }
      navigate(
        section.redirectUrl +
        encryptDataForURL(formData[0]?.["ji_id"]) +
        "/" +
        encryptDataForURL(row["activity_master"]["activity_code"]) +
        "?OperationType=" +
        encryptDataForURL(row["activity_master"]["activity_code"]) +
        "&operationId=" +
        encryptDataForURL(row["jis_id"]) +
        "&operationStepNo=" +
        encryptDataForURL(opsNo) + "&operationMode=" + encryptDataForURL(formData[0]?.operation_type?.operation_type_code)
      );
    }
    else {
      if (!getNonLMSOperationActivity().includes(getActivityCode(row["activity_master"]["activity_code"]).toLowerCase())) {
        toast.error("No any form available for this activity", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      else {
        navigate(
          section.redirectUrl +
          encryptDataForURL(formData[0]?.["ji_id"]) +
          "/" +
          encryptDataForURL(row["activity_master"]["activity_code"]) +
          "?OperationType=" +
          encryptDataForURL(row["activity_master"]["activity_code"]) +
          "&operationId=" +
          encryptDataForURL(row["jis_id"]) +
          "&operationStepNo=" +
          encryptDataForURL(opsNo) + "&operationMode=" + encryptDataForURL(formData[0]?.operation_type?.operation_type_code)
        );
      }
    }

  };
  const handleCertificate = (row) => {
    navigate(
      getOperationActivityUrl(formData[0]?.operation_type?.operation_type_name) + "confirugation-certificate-list/" +
      encryptDataForURL(formData[0]?.["ji_id"]) +
      "/" +
      encryptDataForURL(row["jis_id"]) +
      "?operationStepNo=" +
      encryptDataForURL(1) +
      "&OperationType=" +
      encryptDataForURL(row["activity_master"]["activity_code"]) + "&operationMode=" + encryptDataForURL(formData[0]?.operation_type?.operation_type_code)
    );
  };

  const handleCertificateForNonLMS = (row) => {

    navigate(
      getOperationActivityUrl(formData[0]?.operation_type?.operation_type_name) + "confirugation-certificate/" +
      encryptDataForURL(formData[0]?.["ji_id"]) +
      "/" +
      encryptDataForURL(row["jis_id"]) +
      "/" +
      encryptDataForURL(formData[0]?.["rpc_id"] || -999) +
      "?status=" +
      encryptDataForURL("NonLMS") +
      "&OperationType=" +
      encryptDataForURL(row["activity_master"]?.activity_code) + "&operationMode=" + encryptDataForURL(formData[0]?.operation_type?.operation_type_code)
    );
  };
  const handleCertificateForNonDefaultForm = (row) => {
    navigate(
      getOperationActivityUrl(formData[0]?.operation_type?.operation_type_name) + "confirugation-certificate/" +
      encryptDataForURL(formData[0]?.["ji_id"]) +
      "/" +
      encryptDataForURL(row["jis_id"]) +
      "/" +
      encryptDataForURL(formData[0]?.["rpc_id"] || -999) +
      "?status=" +
      encryptDataForURL("NonLMS") +
      "&OperationType=" +
      encryptDataForURL(row["activity_master"]?.activity_code) + "&operationMode=" + encryptDataForURL(formData[0]?.operation_type?.operation_type_name) + "&isCustomMode=" + encryptDataForURL(1)
    );
  };

  const handleCreateConfirugation = () => {
    navigate(
      "/operation/operation-certificate/" + encryptDataForURL(EditRecordId)
    );
  };
  const AutoScrollHeight = (containerClass, contentClass, Index) => {
    const tableContainer = document.querySelector(containerClass);
    const content = document.querySelector(contentClass);

    if (tableContainer && content) {
      const currentHeight = tableContainer.offsetHeight;
      const requiredHeight = content.scrollHeight + 8;
      if (pageLimit - 2 === Index || pageLimit - 1 === Index) {
        return;
      }
      else {
        const originalHeight = tableContainer.dataset.originalHeight
          ? parseInt(tableContainer.dataset.originalHeight, 10)
          : currentHeight;

        if (!tableContainer.dataset.originalHeight) {
          tableContainer.dataset.originalHeight = currentHeight;
        }

        if (currentHeight < requiredHeight) {
          tableContainer.style.height = `${requiredHeight}px`;
        } else if (currentHeight > requiredHeight && currentHeight > originalHeight) {
          tableContainer.style.height = `${originalHeight}px`;
        }
      }
    }
  };

  return (
    <div key={sectionIndex} className="row my-2 mx-0 renderList_header_table">
      <div className="renderList_table_container">
        {" "}
        <div className="renderList_table" ref={divRef}>
          <div className="renderList_table_heading my-2">
            <h2>{section.title}</h2>
            {moduleType == "confirugationList" && (
              <button
                type="button"
                className="create_button"
                onClick={() => handleCreateConfirugation()}
              >
                <i className="bi bi-plus-lg"></i>Create
              </button>
            )}
          </div>
          <table className="table table-white responsive borderless no-wrap align-middle list configureList">
            <thead>
              {/*
              Author : Yash Darshankar
              Date : 22/01/2025
              Description: According to Latest UI Disussions

              */}
              <tr>
                <th>Sr. No.</th>
                {section.headers?.map(
                  (header, headerIndex) =>
                    checkIsShow(header.name) && (
                      <th
                        key={"HeaderIndex -" + headerIndex}
                        colSpan={header.colSpan ?? 1}
                      // onClick={() =>
                      //   handleClick(headerIndex, header?.sortName)
                      // }
                      >
                        {header?.label}
                        {/* <span className="table_header_icon">
                          {sortStates[headerIndex] ? (
                            <i className="bi bi-caret-up-fill"></i>
                          ) : (
                            <i className="bi bi-caret-down-fill"></i>
                          )}
                        </span> */}
                      </th>
                    )
                )}
                <th className="Action-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subTableData?.map((row, rowIndex) => {
                return (
                  <tr
                    key={"rowIndex-" + rowIndex}
                    // className={getTdBorderColor(row)}
                    className="border-top"
                  >
                    <td key={"rowIndex-" + rowIndex + "1"}>{rowIndex + 1}</td>
                    {section.headers?.map((header, index) => {
                      if (!checkIsShow(header.name)) {
                        return null;
                      }
                      let cellData = formData[0]?.[header?.name];
                      if (!cellData) {
                        cellData = row[header?.name];
                      }
                      if (header?.fieldName === "status") {
                        return getStatusNameValue(row[header?.name]);
                      } else if (header?.fromType === "array") {
                        return (
                          <td
                            key={"cellIndex" + index}
                            title={cellData[header?.fieldName]}
                          >
                            {cellData
                              ? header.type === "date"
                                ? getFormatedDate(
                                  cellData[header?.fieldName],
                                  1
                                )
                                : header.fieldName === "company_code"
                                  ? getComonCodeForCompany(
                                    cellData[header?.fieldName]
                                  )
                                  : getCellData(cellData[header?.fieldName])
                              : "--"}
                          </td>
                        );
                      } else {
                        return (
                          <td key={"cellIndex" + index} title={cellData}>
                            {header.type === "date"
                              ? getFormatedDate(cellData, 1)
                              : getCellData(cellData)}
                          </td>
                        );
                      }
                    })}

                    <td className="exclude-click last-td" ref={popupRef}>
                      {
                        // row['status'] !== "posted" &&
                        <div className="actionColumn maxWidth d-flex confirugationListActionColumn">
                          <button
                            type="button"
                            onClick={() => {
                              popupIntentionallyOpenedRef.current = true; // Indicate the popup was intentionally opened
                              setTimeout(() => {
                                AutoScrollHeight('.renderList_table_container', '.renderList_table', popupIndex === rowIndex ? -1 : rowIndex);
                              }, 0);
                              setPopupIndex((prevIndex) => {
                                return prevIndex === rowIndex ? -1 : rowIndex;
                              });
                            }}
                            aria-label="Toggle popup"
                            className="invisible-button"
                          >
                            <i className="bi bi-three-dots-vertical"></i>
                          </button>
                          <span ref={popupOptionsRef}>
                            {popupIndex === rowIndex ? (
                              <PopupOptions
                                section={section}
                                popupActions={filteredAction.filter((singleAction) => {
                                  if (singleAction.value.toLowerCase() === "view") {
                                    if (!formData?.[0]?.["operation_type"]?.operation_is_system_generated || row["activity_master"]?.am_is_system_generated) {
                                      return false
                                    }
                                  }
                                  else if(['OPS_ADMIN', 'SU', 'BH'].includes(user?.role) || user?.logged_in_user_info?.usr_id !== formData[0]?.['fk_useropsexecutiveid']){
                                    if (singleAction.value.toLowerCase() === "man power") {
                                      return false
                                    }
                                  }
                                  return true
                                })}
                                setPopupIndex={setPopupIndex}
                                getAllListingData={getAllListingData}
                                id={
                                  moduleType === "sampleinward"
                                    ? row["smpl_jrf_id"]
                                    : row["jrf_id"]
                                }
                                sampleInwardFormId={row["smpl_inwrd_id"]}
                                row={row}
                                formConfig={formConfig}
                                model={responseData.model}
                                isBottom={isBottom}
                                status={getStatus(formConfig, row)}
                                setDontClick={setDontClick}
                                from="subListTable"
                                formData={formData}
                                operationMode={formData[0]?.operation_type?.operation_type_name}
                              />
                            ) : null}
                          </span>
                          {['OPS_ADMIN', 'SU', 'BH'].includes(user?.role) || user?.logged_in_user_info?.usr_id !== formData[0]?.['fk_useropsexecutiveid'] ? null :
                            <>
                              {
                                // getDefaultActivityMode().includes(formData?.[0]?.["operation_type"]?.operation_type_code) 
                                formData?.[0]?.["operation_type"]?.operation_is_system_generated && !row["activity_master"]?.am_is_system_generated
                                &&
                                (!["posted", "input-completed", "certified"].includes(
                                  row["status"]
                                ) && row.fk_jiid == formData[0]?.ji_id
                                  // ||row["activity_master"]?.activity_code === getVesselOperation("SV")
                                ) && !['BH', 'CP'].includes(user?.role) &&
                                (
                                  <div className="">
                                    <button
                                      type="button"
                                      className="iconBtn"
                                      onClick={() => handleOnClick(row)}
                                    >
                                      Edit
                                    </button>
                                  </div>
                                )}
                              {
                                // getDefaultActivityMode().includes(formData?.[0]?.["operation_type"]?.operation_type_code)
                                formData?.[0]?.["operation_type"]?.operation_is_system_generated && !row["activity_master"]?.am_is_system_generated
                                  ? getLMSOperationActivity().includes(getActivityCode(row["activity_master"]?.activity_code).toLowerCase())
                                    ? row["jis_eligible_for_cert"] && row.fk_jiid == formData[0]?.ji_id && !['BH', 'CP'].includes(user?.role) && (
                                      <div>
                                        {
                                          <button
                                            type="button"
                                            className="iconBtn"
                                            onClick={() => handleCertificate(row)}
                                          >
                                            Certify
                                          </button>
                                        }
                                      </div>
                                    )
                                    : ["posted"].includes(row["status"]) && !([getVesselOperation("SV"),getStackOperations("ST_SV"),getRakeOperations("RK_SV"),getRakeOperations("QAss")].includes(getActivityCode(row["activity_master"]?.activity_code).toLowerCase())) && row.fk_jiid == formData[0]?.ji_id && !['BH', 'CP'].includes(user?.role) && (
                                      <div>
                                        <button
                                          type="button"
                                          className="iconBtn"
                                          onClick={() =>
                                            handleCertificateForNonLMS(row)
                                          }
                                        >
                                          Certify
                                        </button>
                                      </div>
                                    ) : !["generated"].includes(row["status"]) && <div>
                                      <button
                                        type="button"
                                        className="iconBtn"
                                        onClick={() =>
                                          handleCertificateForNonDefaultForm(row)
                                        }
                                      >
                                        Certificate Generation
                                      </button>
                                    </div>
                              }
                            </>
                          }
                        </div >
                      }
                    </td >
                  </tr >
                );
              })}
            </tbody >
          </table >
        </div >
      </div >
    </div >
  );
};
RenderSubListSection.propTypes = {
  section: PropTypes.string,
  sectionIndex: PropTypes.number,
  actions: PropTypes.arrayOf(PropTypes.object),
  responseData: PropTypes.object,
  getAllListingData: PropTypes.func,
  formConfig: PropTypes.object,
  statusCounts: PropTypes.object,
  setIsRejectPopupOpen: PropTypes.func,
  setJRFCreationType: PropTypes.func,
  setIsPopupOpen: PropTypes.func,
  loadingTable: PropTypes.bool,
  setIsOverlayLoader: PropTypes.func,
  moduleType: PropTypes.string,
  formData: PropTypes.object,
};
export default RenderSubListSection;
