import React, { useEffect, useRef, useState } from "react";
import PopupOptions from "./PopupOptions";
import {
  getActivityCode,
  getComonCodeForCompany,
  getFormatedDate,
  getLMSOperationActivity,
  getVesselOperation,
  getRakeOperations,
  getTruckOperations,
  getStackOperations,
  getPlantOperations,
  getOperationActivityUrl,
  handleCommonDownloadFile,
  getMailSubjectDetails,
  getMailBodyDetails
} from "../../services/commonFunction";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getUniqueData } from "../../services/commonFunction";

import {
  deleteDataFromApi,
  postDataFromApi,
  putDataFromApi,
} from "../../services/commonServices";
import {
  getJIsowandactivityApi,
  getReportConfigApi,
  getCommercialCertificateListApi,
  documentUpdate,
  documentShareCreate,
  documentListApi,
  documentCreateApi,
  documentDeleteApi,
  folderCreateApi,
  ccUpdateApi,
  dsSurveyPdfApi,
  ccCertPdfApi,
  mergeFilesApi,
  masterUploadApi,
  rakeQAPdfApi, truckQA2PdfApi, truckQAPdfApi, stackQAPdfApi, truckCSPdfApi,
  plantQAPdfApi
} from "../../services/api";
import { encryptDataForURL } from "../../utills/useCryptoUtils";
import PropTypes from "prop-types";
import { getCellData } from "../../services/commonFunction";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import DocumentPopup from "../../views/Document/UploadFiles/DocumentPopup";
import Document from "../../formJsonData/Operations/jobinstructions/DocumentPopup.json";
import GridView from "../../views/Document/UploadFiles/DocGridView";
import { useDispatch } from "react-redux";
import Loading from "./Loading";
import { decryptDataForURL } from "../../utills/useCryptoUtils";
import {
  downLoadNonLMSCertificatePDFById,
  getNonLMSDetailsById,
} from "./commonHandlerFunction/OPscertificate/OPSCertificateHandlerFunctions";
import DeleteConfirmation from "./DeleteConfirmation";
import { selectedSingleRow } from "../../actions/authActions";
import RenderFields from "./RenderFields";
import { getAllBrancheDataforDropdown, getCompanyData } from "./commonHandlerFunction/jobinstructionHandlerFunctions";
import TablePagination from "./TablePagination";
import CustomPopupModal from "./commonModalForms/CustomPopupModal";

export const selectUser = (state) => state.user;

const RenderSubListSectionWithPagination = ({
  section,
  sectionIndex,
  actions,
  responseData,
  // getAllSubListingdata,
  formConfig,
  statusCounts,
  setIsRejectPopupOpen,
  setJRFCreationType,
  setIsPopupOpen,
  // loadingTable,
  setIsOverlayLoader,
  moduleType,
  formData,
  breadcrumb,
  handleFieldChange,
  formErrors,
  viewOnly,
  actionClicked,
  JISID,
  OperationType,
  popupType,
  setPopupType,
  setFormData
}) => {
  let user = useSelector(selectUser);
  const navigate = useNavigate();
  const session = useSelector((state) => state.session);
  const uploadExtraModules = ['tenderDocumentList', 'purchaseorderDocumentList', 'purchasereqDocumentList', 'jrfDocumentList', 'itemDocumentList']

  user = session.user;

  const [popupIndex, setPopupIndex] = useState(-1);
  const [sortStates, setSortStates] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [sizeOfPage, setSizeOfPage] = useState(0);
  const [countPage, setCountPage] = useState(0);
  const [filteredAction, setFilteredAction] = useState(actions);
  const [subTableData, setSubTableData] = useState([]);
  const [isBottom, setIsBottom] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState({});
  const [selectedMultiDocs, setSelectedMultiDocs] = useState([]);
  const [dontClick, setDontClick] = useState(false);
  const [uploadPopup, setUploadPopup] = useState(false);
  // const [popupType, setPopupType] = useState("");
  const [popupJson, setPopupJson] = useState({});
  const [toggleView, setToggleView] = useState(true);
  const [loadingTable, setLoadingTable] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [customFilterData, setCustomFilterData] = useState({});
  const [filterMasterOptions, setFilterMasterOptions] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [selectedIds, setSelectedIds] = useState([])
  const [ccIds, setCcIds] = useState([]);
  const [ccReferenceNumbers, setCcReferenceNumbers] = useState([]);


  const [isShowCreateButton, setIsShowCreateButton] = useState(true);
  const [isCustomPopup, setIsCustomPopup] = useState(false);
  const [isDownLoadPopup, setIsDownLoadPopup] = useState(true);
  const [Clickedrow, setClickedRow] = useState(null);
  const [customFormData, setCustomFormdata] = useState({
    0: {}
  });
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let { EditRecordId, TMLType } = useParams();


  // fOR PurchaseReq Only
  const prDocData = [
    {
      "sr_no": 1,
      "dl_document_name": "Employee Handbook",
      "dl_discription": "Guidelines and policies for all new employees.",
      "dl_file_type": "Uploaded",
      "dl_created_by_details": "Admin",
      "dl_created_at": "12/03/2024",
      "dl_updated_at": "25/07/2024"
    },
    {
      "sr_no": 2,
      "dl_document_name": "Project Plan - Alpha",
      "dl_discription": "Detailed project roadmap and deliverables for Alpha project.",
      "dl_file_type": "Uploaded",
      "dl_created_by_details": "John Doe",
      "dl_created_at": "05/04/2024",
      "dl_updated_at": "18/08/2024"
    },
    {
      "sr_no": 3,
      "dl_document_name": "Budget Report Q1",
      "dl_discription": "Financial report and expense summary for Q1.",
      "dl_file_type": "Uploaded",
      "dl_created_by_details": "Priya Sharma",
      "dl_created_at": "20/01/2024",
      "dl_updated_at": "10/05/2024"
    },
    {
      "sr_no": 4,
      "dl_document_name": "Product Images Archive",
      "dl_discription": "Collection of approved marketing and product images.",
      "dl_file_type": "Uploaded",
      "dl_created_by_details": "Rahul Verma",
      "dl_created_at": "08/02/2024",
      "dl_updated_at": "12/06/2024"
    },
    {
      "sr_no": 5,
      "dl_document_name": "Meeting Notes - Client B",
      "dl_discription": "Minutes of the meeting held with Client B regarding Phase 2 updates.",
      "dl_file_type": "Uploaded",
      "dl_created_by_details": "Ananya Gupta",
      "dl_created_at": "15/03/2024",
      "dl_updated_at": "02/09/2024"
    }
  ];


  [EditRecordId, TMLType] = [EditRecordId, TMLType].map((item) =>
    item ? decryptDataForURL(item) : ""
  );
  // EditRecordId = 1
  const translate = t;
  const popupRef = useRef(null);
  const statusesWithColor = formConfig?.listView?.statusesWithColor;
  const divRef = useRef(null);
  const popupIntentionallyOpenedRef = useRef(false);
  const hashData = window.location.hash;
  const paramsData = new URLSearchParams(hashData.split("?")[1]);
  const operationMode = decryptDataForURL(paramsData.get("operationMode"));
  /*
  Author : Yash Darshankar
  Date : 20/06/2024
  Description : This code is used to close the popup when clicked outside the popup.
  */
  const popupOptionsRef = useRef(null);

  const pageLimit =
    currentPage === totalPage
      ? Math.floor(countPage % sizeOfPage) > 3
        ? Math.floor(countPage % sizeOfPage)
        : sizeOfPage
      : sizeOfPage;
  useEffect(() => {
    if (!isCustomPopup) {
      setIsDownLoadPopup(false)
      setClickedRow(null)
    }
  }, [isCustomPopup])

  useEffect(() => {
    setSortStates(Array(section.headers?.length).fill(false));
  }, [section]);
  useEffect(() => {
    if (['OPS_ADMIN'].includes(user?.logged_in_user_info?.role)) {
      setFilteredAction(() => {
        return filteredAction.filter((singleValue) => singleValue.value != "Share")
      })
    }
  }, []);

  useEffect(() => {
    getAllSubListingdata();
    if (section.isCustomFilter) {
      if (['commercialCertificateList'].includes(moduleType)) {
        if (user?.role === "BU") {
          getCompanyData(setFilterMasterOptions);
        }
        else if (['BH', 'CP'].includes(user?.role)) {
          getAllBrancheDataforDropdown(setFilterMasterOptions);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (formData[1]) {
      let ids = Object.keys(formData[1]).map((key) => key.split("_")[1]);

      setSelectedIds((prevSelected) =>
        prevSelected.includes(ids[0])
          ? prevSelected.filter(id => !ids.includes(id))
          : [...prevSelected, ...ids]
      );
    }
  }, [formData]);

  const handleClick = (index, fieldName) => {
    const newSortStates = Array(section.headers?.length).fill(false);
    newSortStates[index] = !sortStates[index];
    let sortType = newSortStates[index] ? "desc" : "asc";
    getAllSubListingdata(currentPage, fieldName, sortType);
    setSortStates(newSortStates);
  };

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
      case "confirugationList":
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
      let tempName = filterStatusData?.name;

      if (
        moduleType == "commercialCertificateList" && ['BH', 'CP'].includes(user?.logged_in_user_info?.role)
        &&
        ["sent_for_approval", "saved", "posted"].includes(
          filterStatusData?.status
        )
      ) {
        tempName = "Pending";
      }
      return (
        <td key="status_list" className="status-td status-stickycol">
          <div
            className={
              tempName === "Pending"
                ? "table_item_sym inprocess_sym_bg"
                : "table_item_sym " + filterStatusData?.icon + "_bg"
            }
            key={"table-item"}
          >
            {tempName}
          </div>
        </td>
      );
    } else {
      return (
        <td key="status_list" className=" status-stickycol">
          <div className="table_item_sym" key={"table-item"} title="">
            {cellData}
          </div>
        </td>
      );
    }
  };

  const getBooleanName = (cellData) => {
    return (
      <td key="status_list" className=" status-stickycol">
        <div className="table_item_sym" key={"table-item"} title="">
          {cellData ? "Yes" : "No"}
        </div>
      </td>
    );
  };


  const getAllSubListingdata = async (
    pagination = "",
    fieldName = "",
    sortType = "",
    searchValue = "",
    isClearBtn = "",
    isCustomFilter,
    customFilterType,
    customFilterValue
  ) => {

    try {

      setLoadingTable(true);
      let querystring = "";
      if (pagination) {
        querystring += "?page=" + pagination;
      }
      if (isCustomFilter) {
        const qType = querystring ? '&' : '?'
        querystring +=
          qType + "filter_context=" +
          customFilterType +
          "&filter_context_id=" +
          customFilterValue;
      }
      let res;
      if (moduleType == "confirugationList") {
        const bodyData = {
          ji_id: EditRecordId,
          jis_id: TMLType,
        };
        res = await postDataFromApi(getReportConfigApi + querystring, bodyData);
      } else if (moduleType == "commercialCertificateList") {
        // getCommercialCertificateList();
        res = await postDataFromApi(
          getCommercialCertificateListApi + querystring
        );
        //getCommercialCertificateList
      } else if (['JICommercialCertificateList', ...uploadExtraModules].includes(moduleType)) {
        // getCommercialCertificateList()
        let refeNo = { dl_document_reference: EditRecordId }
        if (moduleType === "purchasereqDocumentList") {
          refeNo = { dl_document_reqid: EditRecordId }
        }
        else if (moduleType === "itemDocumentList") {
          refeNo = { dl_document_fk_itemid: EditRecordId }
        }
        let payload = {
          dl_module: uploadExtraModules.includes(moduleType) ? moduleType : "commercial_certificate",
          context: "jobinstructions",
          ...refeNo,
          dl_document_jisid: TMLType,
          is_active: true,
        };
        if (uploadExtraModules.includes(moduleType)) {
          payload.context = moduleType.replace("DocumentList", "");

        }
        res = await postDataFromApi(documentListApi + querystring, payload);

        //getCommercialCertificateList
      }
      if (res?.data?.status === 200) {
        setSubTableData(res.data.data);
        setCurrentPage(res.data.current_page);
        setTotalPage(res.data.total_pages);
        setSizeOfPage(res.data.page_size);
        setCountPage(res.data.count);
        setLoadingTable(false);
        if (moduleType == "confirugationList") {
          if (!res.data.jrf_sample_marks[0] && !res.data.tpi_sample_marks[0]) {
            setIsShowCreateButton(false)
          }
          else {
            setIsShowCreateButton(true)
          }
        }
      } else {
        toast.error(res.message, {
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
    } catch (error) {
      // setLoadingTable(false);

      toast.error(error.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setLoadingTable(false);
    }
  };

  const handlePrev = () => {
    getAllSubListingdata(currentPage - 1);
    setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    getAllSubListingdata(currentPage + 1);
    setCurrentPage((prev) => prev + 1);
  };

  const handlePaginationButton = (pageNo) => {
    getAllSubListingdata(pageNo);
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

  const getPaginationNo = () => {
    const displayedPages = [];
    const maxPagesToShow = 7; // Limit visible page buttons to avoid clutter.

    const middle = Math.floor(maxPagesToShow / 2);
    const left = Math.max(1, currentPage - middle);
    const right = Math.min(totalPage, currentPage + middle);

    if (left > 1) {
      displayedPages.push(createButton(1, currentPage, handlePaginationButton));
      if (left > 2) {
        displayedPages.push(<button key={"extra-eclipse"}>...</button>);
      }
    }

    for (let i = Math.max(1, left); i <= Math.min(totalPage, right); i++) {
      displayedPages.push(createButton(i, currentPage, handlePaginationButton));
    }

    if (right < totalPage) {
      if (right < totalPage - 1) {
        displayedPages.push(<button key={"extra-display-btn"}>...</button>);
      }
      displayedPages.push(
        createButton(totalPage, currentPage, handlePaginationButton)
      );
    }

    return displayedPages;
  };

  useEffect(() => {
    if (pageLimit - 2 === popupIndex || pageLimit - 1 === popupIndex) {
      setIsBottom(true);
    } else {
      setIsBottom(false);
    }
  }, [popupIndex]);

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
    else if (moduleType === "commercialCertificateList") {
      if (fieldName === "branch") {
        if (user?.role === "BU") {
          return false;
        }
      }
      else if (fieldName === "company") {
        if (['BH', 'CP'].includes(user?.role)) {
          return false;
        }
      }

    }
    return true;
  };

  const handleOnClick = (row) => {
    navigate(
      "/operation/vessel-ji-list/vessel-list/" +
      encryptDataForURL(formData[0]?.["ji_id"]) +
      "/" +
      encryptDataForURL(row["activity_master"]["activity_code"]) +
      "?OperationType=" +
      encryptDataForURL(row["activity_master"]["activity_code"]) +
      "&operationId=" +
      encryptDataForURL(row["jis_id"]) +
      "&operationStepNo=" +
      encryptDataForURL(1)
    );
  };
  const handleCertificate = (row) => {
    const redirectUrl = getOperationActivityUrl(operationMode)
    navigate(
      redirectUrl + "confirugation-certificate-list/" +
      encryptDataForURL(formData[0]?.["ji_id"]) +
      "/" +
      encryptDataForURL(row["jis_id"]) +
      "?OperationType=" +
      encryptDataForURL(row["activity_master"]?.activity_code) + "&operationMode=" + encryptDataForURL(operationMode)
    );
  };

  const handleCreateConfirugation = (status, RPCID) => {
    if (RPCID) {
      navigate(
        "/operation/operation-certificate/" +
        encryptDataForURL(EditRecordId) +
        "/" +
        encryptDataForURL(TMLType) +
        "?status=" +
        encryptDataForURL(status) +
        "&RPCID=" +
        encryptDataForURL(RPCID) +
        "&OperationType=" +
        encryptDataForURL(OperationType) + "&operationMode=" + encryptDataForURL(operationMode)
      );
    } else {
      navigate(
        "/operation/operation-certificate/" +
        encryptDataForURL(EditRecordId) +
        "/" +
        encryptDataForURL(TMLType) +
        "?status=" +
        encryptDataForURL(status) +
        "&OperationType=" +
        encryptDataForURL(OperationType) + "&operationMode=" + encryptDataForURL(operationMode)
      );
    }
  };
  const handleGenerateConfirugation = (row) => {
    const redirectUrl = getOperationActivityUrl(operationMode)
    navigate(
      redirectUrl + "confirugation-certificate/" +
      encryptDataForURL(row?.fk_jiid) +
      "/" +
      encryptDataForURL(row?.fk_jisid) +
      "/" +
      encryptDataForURL(row?.rpc_id) +
      "?OperationType=" +
      encryptDataForURL(OperationType) +
      "&ConfigID=" +
      encryptDataForURL(row?.cert_config_id) + "&operationMode=" + encryptDataForURL(operationMode)
    );

  };
  const handleDownloadCertificate = (row) => {
    navigate(
      "/operation/commercial-certificate-list/commercial-certificate-preview/" +
      encryptDataForURL(row?.fk_jiid) +
      "/" +
      encryptDataForURL(row?.cc_id) +
      "?OperationType=" +
      encryptDataForURL(OperationType)
    );
  };

  const ApproveCertificate = async (row) => {
    if (
      !getLMSOperationActivity().includes(getActivityCode(row?.activity_code).toLowerCase()) && ![getVesselOperation("bulk_crg")].includes(getActivityCode(row.activity_code).toLowerCase())
    ) {
      let payload = {
        ji_id: row?.fk_jiid,
        jis_id: row?.fk_jisid,
        tenant: 1,
      };
      let OPSDSRes = await getNonLMSDetailsById(getActivityCode(row.activity_code).toLowerCase(), payload);
      if (OPSDSRes.data.status === 200) {
        navigate(
          `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
            OPSDSRes?.data?.data?.opsvd_id
          )}/${encryptDataForURL(row.cc_id)}?status=${encryptDataForURL(
            "NonLMSApprove"
          )}&CCID=${encryptDataForURL(row.cc_id)}` +
          "&OperationType=" +
          encryptDataForURL(row.activity_code)
        );
      }
    } else {
      navigate(
        "/operation/commercial-certificate-list/commercial-certificate-preview/" +
        encryptDataForURL(row?.fk_jiid) +
        "/" +
        encryptDataForURL(row?.cc_id) +
        "/" +
        "?status=" +
        encryptDataForURL("approve") +
        "&CCID=" +
        encryptDataForURL(row?.cc_id) +
        "&OperationType=" +
        encryptDataForURL(row.activity_code)
      );
    }
  };
  const RedirectPublishCertificate = async (row) => {
    dispatch(selectedSingleRow(row))
    if (
      !getLMSOperationActivity().includes(getActivityCode(row?.activity_code).toLowerCase())
    ) {
      let payload = {
        ji_id: row?.fk_jiid,
        jis_id: row?.fk_jisid,
        tenant: 1,
      };
      let OPSDSRes = await getNonLMSDetailsById(getActivityCode(row.activity_code).toLowerCase(), payload);
      if (OPSDSRes.data.status === 200) {
        navigate(
          `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
            OPSDSRes?.data?.data?.opsvd_id
          )}/${encryptDataForURL(row.cc_id)}?status=${encryptDataForURL(
            "NonLMSPublish"
          )}&CCID=${encryptDataForURL(row.cc_id)}` +
          "&OperationType=" +
          encryptDataForURL(row.activity_code)
        );
      }
    } else {
      navigate(
        "/operation/commercial-certificate-list/commercial-certificate-preview/" +
        encryptDataForURL(row?.fk_jiid) +
        "/" +
        encryptDataForURL(row?.cc_id) +
        "/" +
        "?status=" +
        encryptDataForURL("publish") +
        "&CCID=" +
        encryptDataForURL(row?.cc_id) +
        "&OperationType=" +
        encryptDataForURL(row.activity_code)
      );
    }
  };
  const EditCertificate = async (row) => {
    const redirectUrl = getOperationActivityUrl(operationMode)
    if (
      !getLMSOperationActivity().includes(getActivityCode(row.activity_code).toLowerCase())
    ) {
      navigate(
        `${redirectUrl}confirugation-certificate/${encryptDataForURL(
          row.fk_jiid
        )}/${encryptDataForURL(row.fk_jisid)}/${encryptDataForURL(
          row.cc_id
        )}?status=${encryptDataForURL(
          "Edit"
        )}&OperationType=${encryptDataForURL(row.activity_code)}` +
        "&OperationType=" +
        encryptDataForURL(OperationType) + "&operationMode=" + encryptDataForURL(operationMode)
      );
    } else {
      navigate(
        `${redirectUrl}confirugation-certificate/${encryptDataForURL(
          row.fk_jiid
        )}/${encryptDataForURL(row.fk_jisid)}/${encryptDataForURL(
          row.cc_id
        )}?status=${encryptDataForURL("Edit")}` +
        "&OperationType=" +
        encryptDataForURL(row.activity_code) + "&operationMode=" + encryptDataForURL(operationMode)
      );
    }
  };
  const sendForApproval = async (row) => {
    const hash = window.location.hash;

    const params = new URLSearchParams(hash.split("?")[1]);
    const status = decryptDataForURL(params.get("status"));
    if (status === "NonLMS" && ![getVesselOperation('bulk_crg')].includes(OperationType)) {
      let payload = {
        ji_id: EditRecordId,
        jis_id: JISID,
        tenant: 1,
      };
      let OPSDSRes = await getNonLMSDetailsById(getActivityCode(row.activity_code).toLowerCase(), payload);
      if (OPSDSRes.data.status === 200) {
        navigate(
          `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
            OPSDSRes?.data?.data?.opsvd_id
          )}/${encryptDataForURL(
            OPSDSRes?.data?.data?.cc_id
          )}?status=${encryptDataForURL("NonLMS")}` +
          "&OperationType=" +
          encryptDataForURL(row?.activity_code)
        );
      }
    } else {
      if (
        !getLMSOperationActivity().includes(getActivityCode(row?.activity_code).toLowerCase())
      ) {
        let payload = {
          ji_id: row?.fk_jiid,
          jis_id: row?.fk_jisid,
          tenant: 1,
        };
        // let OPSDSRes = await postDataFromApi("/ops-vessel-ds/get/", payload);
        let OPSDSRes = await getNonLMSDetailsById(getActivityCode(row.activity_code).toLowerCase(), payload);
        if (OPSDSRes.status === 200) {
          navigate(
            `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
              OPSDSRes?.data?.data?.opsvd_id
            )}/${encryptDataForURL(row.cc_id)}?status=${encryptDataForURL(
              "NonLMSPosted"
            )}&CCID=${encryptDataForURL(row.cc_id)}` +
            "&OperationType=" +
            encryptDataForURL(row?.activity_code)
          );
        }
      } else {
        navigate(
          `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
            row?.fk_jiid
          )}/${encryptDataForURL(row.cc_id)}?status=${encryptDataForURL(
            "posted"
          )}&CCID=${encryptDataForURL(row.cc_id)}` +
          "&OperationType=" +
          encryptDataForURL(row?.activity_code)
        );
      }
    }
  };


  const handleDownloadCertificateAfterPublish = async (row) => {
    try {


      let payload, generateCertificateResponse;
      setLoadingTable(true);
      if (
        !getLMSOperationActivity().includes(getActivityCode(row?.activity_code).toLowerCase())
      ) {
        let payload = {
          ji_id: row?.fk_jiid,
          jis_id: row?.fk_jisid,
          is_hard_copy: customFormData[0]?.download_is_hard_copy === "Hard Copy",
          tenant: 1,
        };
        let OPSDSRes = await getNonLMSDetailsById(getActivityCode(row.activity_code).toLowerCase(), payload);
        if (OPSDSRes.data.status === 200) {
          generateCertificateResponse = await downLoadNonLMSCertificatePDFById(
            getActivityCode(row?.activity_code).toLowerCase(),
            OPSDSRes?.data?.data?.opsvd_id,
            row?.cc_id,
            payload?.is_hard_copy,
            row?.fk_jisid
          );
        }
      } else {
        payload = {
          ji_id: row?.fk_jiid,
          cc_id: row?.cc_id,
          is_hard_copy: customFormData[0]?.download_is_hard_copy === "Hard Copy",
        };

        if (getActivityCode(row?.activity_code).toLowerCase() == getVesselOperation("CS")) {
          generateCertificateResponse = await postDataFromApi(truckCSPdfApi, payload, "", true, "", "");
        }
        else if (getActivityCode(row?.activity_code).toLowerCase() == getTruckOperations("DTM")) {
          generateCertificateResponse = await postDataFromApi(truckQAPdfApi, payload, "", true, "", "");
        }
        else if ([getPlantOperations("TR"), getTruckOperations("QS")].includes(getActivityCode(row?.activity_code).toLowerCase())) {
          generateCertificateResponse = await postDataFromApi(truckQA2PdfApi, payload, "", true, "", "");
        }
        else if (getActivityCode(row?.activity_code).toLowerCase() == getTruckOperations("CS")) {
          generateCertificateResponse = await postDataFromApi(truckCSPdfApi, payload, "", true, "", "");
        }
        else if (getActivityCode(row?.activity_code).toLowerCase() == getRakeOperations('QA')) {
          generateCertificateResponse = await postDataFromApi(rakeQAPdfApi, payload, "", true, "", "");
        }
        else if (getActivityCode(row?.activity_code).toLowerCase() == getStackOperations("PV") || getActivityCode(row?.activity_code).toLowerCase() == getStackOperations()) {
          generateCertificateResponse = await postDataFromApi(stackQAPdfApi, payload, "", true, "", "");
        }
        else if (getActivityCode(row?.activity_code).toLowerCase() == getVesselOperation("CS")) {
          generateCertificateResponse = await postDataFromApi(truckCSPdfApi, payload, "", true, "", "");
        }
        else if ([getPlantOperations('TR'),
        getPlantOperations('RK'),
        getPlantOperations('VL'),
        getPlantOperations('ST')].includes(getActivityCode(row?.activity).toLowerCase())) {
          generateCertificateResponse = await postDataFromApi(plantQAPdfApi, payload, "", true, "", "");
        }
        else {
          generateCertificateResponse = await postDataFromApi(ccCertPdfApi, payload, "", true, "", "");

        }

      }

      if (generateCertificateResponse && generateCertificateResponse.data) {
        const pdfBlob = new Blob([generateCertificateResponse.data], {
          type: "application/pdf",
        });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Create a link element
        const link = document.createElement("a");
        link.href = pdfUrl;

        // Set the filename for the download
        link.download = row?.activity + "_" + row?.cc_certificatenumber;
        // Programmatically click the link to trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up by removing the link and revoking the object URL
        document.body.removeChild(link);
        URL.revokeObjectURL(pdfUrl);
        setLoadingTable(false);
      }
      else {
        setLoadingTable(false);
      }
    }
    catch (ex) {

    }
    finally {
      setIsCustomPopup(false)
    }
  };

  const getConfigTypeCellContent = (row, index) => {
    let cellContent = "--"; // Default content

    if (row["is_consortium"] && row["is_dual_port"]) {
      cellContent = "Consortium, Dual Port";
    } else if (row["is_consortium"]) {
      cellContent = "Consortium";
    } else if (row["is_dual_port"]) {
      cellContent = "Dual Port";
    }

    return <td key={`cellIndex${index}`}>{cellContent}</td>;
  };

  const handleMultiFile = (e, doc, id_type) => {
    const docIndex = doc[id_type];
    setSelectedRow((prev) => {
      if (prev.includes(docIndex)) {
        return prev.filter((index) => index !== docIndex);
      } else {
        return [...prev, docIndex];
      }
    });

    setSelectedMultiDocs((prev) => {
      const exists = prev.some((item) => item[id_type] === doc[id_type]);
      if (exists) {
        return prev.filter((item) => item[id_type] !== doc[id_type]);
      } else {
        const { cc_id, cc_refencenumber } = doc;
        setCcIds(prevIds => [...prevIds, cc_id]);
        setCcReferenceNumbers(prevNumbers => [...prevNumbers, cc_refencenumber]);
        return [...prev, doc];
      }
    });
  };
  const [multipleUrls, setMultipleUrls] = useState([]);
  useEffect(() => {
    let selectedUrls = subTableData
      .filter((doc) => selectedRow.includes(doc.dl_id)) // Filter the documents based on selected dl_id
      .map((doc) => doc.dl_s3_url); // Extract the dl_s3_url for the matched docs

    setMultipleUrls(selectedUrls);
  }, [subTableData, selectedRow]);

  const handleMergeFiles = async () => {
    try {


      let selectedUrls = subTableData
        .filter((doc) => selectedRow.includes(doc.dl_id)) // Filter the documents based on selected dl_id
        .map((doc) => doc.dl_s3_url); // Extract the dl_s3_url for the matched docs

      // Create the payload with the s3 URLs
      let payload = {
        s3_files: selectedUrls,
      };

      // Send the payload to the API
      setLoadingTable(true);
      setUploadPopup(false);

      let res = await postDataFromApi(mergeFilesApi, payload, "", true, "", "");


      if (res && res.data && res.data.status === 200) {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        let Imagepayload = new FormData();
        Imagepayload.append("document", pdfBlob, "certificate.pdf");
        Imagepayload.append("model_type ", uploadExtraModules.includes(moduleType) ? moduleType : "commercial_certificate");
        Imagepayload.append("bypass_file_size_check ", "True");


        // // Create a download link for the Blob
        // const downloadLink = document.createElement("a");
        // downloadLink.href = URL.createObjectURL(pdfBlob);
        // downloadLink.download = "certificate.pdf"; // File name for the download
        // downloadLink.style.display = "none"; // Hide the link element
        // document.body.appendChild(downloadLink); // Append the link to the DOM

        // // Trigger the download
        // downloadLink.click();

        // // Clean up by removing the link element and revoking the Blob URL
        // document.body.removeChild(downloadLink);
        // URL.revokeObjectURL(downloadLink.href);
        let uploadResponse = await postDataFromApi(
          masterUploadApi,
          Imagepayload,
          "TRUE"
        );

        if (uploadResponse.data.status === 200) {

          let payload = {
            data: {
              dl_folder: 1,
              dl_module: uploadExtraModules.includes(moduleType) ? moduleType : "commercial_certificate",
              dl_document_name: formData[1].dl_document_name,
              dl_discription: formData[1].dl_discription,
              ...(moduleType === "purchasereqDocumentList") ? { dl_document_reqid: EditRecordId } : { dl_document_reference: EditRecordId },

              dl_document_jisid: formData[1].dl_document_jisid,
              dl_type: "PDF",
              dl_file_type: "Merged File",
              dl_show_to_all: false,
              dl_s3_url:
                uploadResponse.data.data.document,
              dl_version: "1.0",
              dl_date_uploaded: "2023-04-01T12:00:00Z",
              dl_status: "Active",
              dl_module_type: moduleType,
              // document_type: "merged_docs",
              // doc_ref_id: EditRecordId
              // dl_assigned_to: "Assigned User",

            },
          };
          if (!formData[1].dl_document_name || !formData[1].dl_discription) {
            toast.error("Both 'Document Name' and 'Description' are required!", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            return; // Stop execution if either is missing
          }
          let DocResonse = await postDataFromApi(documentCreateApi, payload);
          if (DocResonse.data.status === 200) {

            setLoadingTable(false);
            setMultipleUrls([]);
            setUploadPopup(false);
            getAllSubListingdata();
          }
          else {
            setLoadingTable(false);
            toast.error(
              DocResonse?.message ||
              DocResonse?.data?.message ||
              translate("loginPage.unExpectedError"),
              {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              }
            );

          }

        } else {
          setLoadingTable(false);
          toast.error(
            uploadResponse?.message ||
            uploadResponse?.data?.message ||
            translate("loginPage.unExpectedError"),
            {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            }
          );
        }
      }
      else {
        setLoadingTable(false);
        toast.error(
          res?.message ||
          res?.data?.message ||
          translate("loginPage.unExpectedError"),
          {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
      }
    }
    catch { }
    finally {
      setMultipleUrls([])
      setSelectedRow([])
    }
  };
  const handleDescriptionOrNameChange = async (docType) => {
    let payload = {
      id: selectedDoc?.dl_id,
    };
    if (docType === "Rename") {
      payload.data = { dl_document_name: formData[1].dl_document_name };
    } else {
      payload.data = { dl_discription: formData[1].dl_discription };
    }

    let res = await putDataFromApi(documentUpdate, payload);
    if (res.data.status === 200) {
      setUploadPopup(false);
      getAllSubListingdata();
    } else {
      toast.error(
        res?.data?.message || translate("loginPage.unExpectedError"),
        {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }
  };
  //handleDescriptionOrNameChange
  const handleUploadDocument = async () => {
    if (popupType === "Merge") {
      handleMergeFiles();
    } else if (popupType === "Description") {
      handleDescriptionOrNameChange("Description");
    } else if (popupType === "Rename") {
      handleDescriptionOrNameChange("Rename");
    } else if (popupType === "Share") {
      handleSharedFile();
    } else if (popupType === "Upload") {
      handleSharedFile();
    } else if (popupType === "UploadInfo") {
      handleCreateFile();
    }
  };
  const [fileUrl, setFileUrl] = useState("");
  const handleCreateFile = async () => {

    let folderPayload = {
      data: {
        // "fd_name": "27C2425A01VL0028"
        fd_name: uploadExtraModules.includes(moduleType) ? EditRecordId : formData[0]?.ji_reference_number,
      },
      parent_folder: uploadExtraModules.includes(moduleType) ? moduleType : "commercial_certificate"
    };
    if (["purchasereqDocumentList", "purchaseorderDocumentList"].includes(moduleType)) {
      folderPayload.data.fd_name = decryptDataForURL(paramsData.get("fd_name"))
    }
    let folderRes = await postDataFromApi(folderCreateApi, folderPayload);
    let FolderID;
    setLoadingTable(true);

    if (folderRes.data.status === 201 || folderRes.data.status === 200) {
      FolderID = folderRes?.data?.data.fd_id;
    } else {
      FolderID = folderRes?.data?.message?.existing_folder_id;
    }
    if (FolderID) {
      let refeNo = { dl_document_reference: EditRecordId }
        if (moduleType === "purchasereqDocumentList") {
          refeNo = { dl_document_reqid: EditRecordId }
        }
        else if (moduleType === "itemDocumentList") {
          refeNo = { dl_document_fk_itemid: EditRecordId }
        }
      let payload = {
        data: {
          dl_folder: FolderID,
          // dl_sub_folder: 6,
          dl_module: uploadExtraModules.includes(moduleType) ? moduleType : "commercial_certificate",
          dl_document_name: formData[1].dl_document_name,
          dl_discription: formData[1].dl_discription,
          ...refeNo,
          dl_document_jisid: formData[1].dl_document_jisid,
          dl_type: "Document Type",
          dl_show_to_all: true,
          dl_s3_url: fileUrl,
          dl_version: "1.0",
          dl_file_type: "Uploaded",
          dl_date_uploaded: new Date(),
          dl_status: "Active",
          dl_module_type: moduleType,
          // document_type: "manual_create_docs",
          // doc_ref_id: EditRecordId
          // dl_assigned_to: "Assigned User",
        },
      };

      try {

        if (!formData[1].dl_document_name || !formData[1].dl_discription) {
          toast.error("Both 'Document Name' and 'Description' are required!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          return; // Stop execution if either is missing
        }
        else {
          let documentResponse = await postDataFromApi(
            documentCreateApi,
            payload
          );
          if (documentResponse?.data?.status === 200) {
            setUploadPopup(false);
            getAllSubListingdata();
            setTimeout(() => {
              toast.success(
                documentResponse.data?.message || "Document Created Successfully"
              );
            }, 250);
          }
        }
      } finally {
        // setIsLoading(false);
        setLoadingTable(false);
      }
    }
  };

  const handleSharedFile = async () => {
    const sharePayload = {
      document_id: selectedDoc.dl_id,
      data: [
        {
          ds_document: selectedDoc.dl_id,
          ds_shared_with: formData[1]?.ds_shared_with,
          ds_share_date: "2023-04-01T12:00:00Z",
          ds_restriction_dwonload: "true",
          ds_download_limit: 10,
          ds_download_count: 0,
          ds_restriction_view: false,
          ds_restriction_print: false,
          ds_expiry_date: "2023-12-31T23:59:59Z",
        },
      ],
    };
    try {
      let res = await postDataFromApi(documentShareCreate, sharePayload);
      if (res?.data?.status === 200) {
        setUploadPopup(false);
        setTimeout(() => {
          toast.success(res.data?.message || "Document Shared Successfully");
        }, 250);
      }
    } finally {
      // setIsLoading(false);
    }
  };

  const deleteDocument = async () => {

    let payload = {
      id: subTableData[popupIndex].dl_id,
    };

    let res = await deleteDataFromApi(documentDeleteApi, payload);

    if (res?.data?.status === 200) {
      toast.success(res.data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast.error(res.message, {
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

    getAllSubListingdata();
  };

  useEffect(() => {
    if (uploadPopup === false) {
      setPopupType("");
    }
  }, [uploadPopup]);
  useEffect(() => {

    setPopupIndex('')
    if (popupType === "View") {

      const url = subTableData[popupIndex].dl_s3_url;
      navigate(
        `/document-listing/document-preview/${encryptDataForURL(
          subTableData[popupIndex]["dl_id"]
        )}/${encryptDataForURL(
          url
        )}/${encryptDataForURL(
          url
        )}?documentName=${encryptDataForURL(subTableData[popupIndex].dl_document_name)}`
      );
    }
    else if (popupType === "Info") {
      setUploadPopup(true);
      setPopupJson(Document.upload.infoJson);
    } else if (popupType === "Rename") {
      setUploadPopup(true);
      setPopupJson(Document.upload.changeNameJson);
    } else if (popupType === "Description") {
      setUploadPopup(true);
      setPopupJson(Document.upload.changeDescriptionJson);
    } else if (popupType === "Upload") {
      setUploadPopup(true);
      setPopupJson(Document.upload.changeDescriptionJson);
    } else if (popupType === "Share") {
      setUploadPopup(true);
      setPopupJson(Document.upload.shareJson);
    } else if (popupType === "Download") {
      try {
        const url = subTableData[popupIndex].dl_s3_url;
        const fileName = subTableData[popupIndex].dl_document_name;
        handleCommonDownloadFile(url, fileName)
      }
      finally {
        setPopupType("")
      }
    } else if (popupType === "Delete") {
      // deleteDocument();
      setIsDelete(true);
    } else if (popupType === "Merge") {
      setUploadPopup(true);
      setPopupJson(Document.upload.infoJson);
    }
  }, [popupType]);

  const getData = (fieldName, value) => {
    const type = section?.filterListing.filter(
      (field) => field.name === fieldName
    );
    if (type.length > 0) {
      getAllSubListingdata("", "", "", "", "", 1, type[0].filterType, value);
    }
  };
  const clearFilterData = () => {
    setCustomFilterData({});
    getAllSubListingdata();
    setIsFiltered(false);
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

  const handleCustomConfirmHandler = () => {
    if (isDownLoadPopup) {
      handleDownloadCertificateAfterPublish(Clickedrow)
    }
  }

  return loadingTable ? (
    <Loading />
  ) : (
    <div key={sectionIndex} className="row my-2 mx-0 renderList_header_table">
      {isDelete && <DeleteConfirmation
        isOpen={uploadPopup}
        handleClose={setUploadPopup}
        handleConfirm={() => deleteDocument()}
        popupMessage={"Confirmation !"}
        popupHeading={"Are you sure you want to delete ?"}
        actionType={'Delete'}

      />}
      {uploadPopup && (
        <DocumentPopup
          setUploadPopup={setUploadPopup}
          sectionIndex={sectionIndex}
          formData={formData}
          handleFieldChange={handleFieldChange}
          formErrors={formErrors}
          viewOnly={viewOnly}
          actionClicked={actionClicked}
          handleUploadDocument={handleUploadDocument}
          popupType={popupType}
          setPopupType={setPopupType}
          popupJson={popupJson}
          selectedDoc={selectedDoc}
          fileUrl={fileUrl}
          setFileUrl={setFileUrl}
          moduleType={moduleType}
          setFormData={setFormData}
        />
      )}

      <div className="renderList_table_container">
        {" "}

        <div className="renderList_table" ref={divRef}>
          <div className="renderList_table_heading Heading_doc">
            <h2>{section.title || breadcrumb[breadcrumb.length - 1].title}</h2>

            {moduleType == "confirugationList" && isShowCreateButton && (
              <button
                type="button"
                className="submitBtn CreateConfirugationBtn"
                onClick={() => handleCreateConfirugation("saved")}
              >
                + Create Confirugation
              </button>
            )}

            {['JICommercialCertificateList', ...uploadExtraModules].includes(moduleType) && (
              <div className="docSearchNav1">
                <div
                  onClick={() => {
                    setToggleView((Prev) => !Prev);
                  }}
                >
                  <i
                    className={
                      !toggleView
                        ? "bi bi-list-ul viewIconNav1"
                        : "bi bi-grid viewIconNav1"
                    }
                  ></i>
                  <span>{!toggleView ? "List View" : "Grid View"}</span>
                </div>
              </div>
            )}
          </div>
          {!toggleView ? (
            <GridView
              documentList={subTableData}
              // listView={listView}
              setSelectedDoc={setSelectedDoc}
              popupIntentionallyOpenedRef={popupIntentionallyOpenedRef}
              setPopupIndex={setPopupIndex}
              // rowIndex={rowIndex}
              popupOptionsRef={popupOptionsRef}
              popupIndex={popupIndex}
              PopupOptions={PopupOptions} // Check that PopupOptions is imported correctly
              section={section}
              filteredAction={filteredAction}
              getAllSubListingdata={getAllSubListingdata}
              moduleType={moduleType}
              formConfig={formConfig}
              responseData={responseData}
              isBottom={isBottom}
              getStatus={getStatus}
              setDontClick={setDontClick}
              setPopupType={setPopupType}
              handleMultiFile={handleMultiFile}
              multipleUrls={multipleUrls}
            // row={row}
            />
          ) : (
            <table className="table table-white responsive borderless no-wrap align-middle list RenderListPagination">
              <thead>
                <tr>
                  {['JICommercialCertificateList', ...uploadExtraModules].includes(moduleType) && !['OPS_ADMIN'].includes(user?.logged_in_user_info?.role) && <th></th>}
                  <th>Sr. No.</th>
                  {section.headers?.map(
                    (header, headerIndex) =>
                      checkIsShow(header.name) && (
                        <th
                          key={"HeaderIndex -" + headerIndex}
                          colSpan={header.colSpan ?? 1}
                          onClick={() =>
                            handleClick(headerIndex, header?.sortName)
                          }
                          className={` ${header?.label === "Status" ? "statusHeader" : ""}`}
                        >
                          {header?.label}
                        </th>
                      )
                  )}
                  {/* {moduleType !== "JICommercialCertificateList" && */}
                  <th className="actioncol list_th_action">Actions</th>
                  {/* } */}
                </tr>
              </thead>
              <tbody>
                {subTableData?.map((row, rowIndex) => {
                  let newfilteredAction = [...filteredAction]
                  if (['JICommercialCertificateList', 'tenderDocumentList', 'purchaseorderDocumentList', 'purchasereqDocumentList', 'jrfDocumentList', 'itemDocumentList'].includes(moduleType)) {
                    newfilteredAction = newfilteredAction.filter((singleAction) => {

                      if (singleAction.value === "Delete") {
                        return user?.logged_in_user_info?.usr_id === row?.dl_created_by
                      }
                      return true
                    })
                  }
                  return (<tr
                    key={"rowIndex-" + rowIndex}
                    // className={getTdBorderColor(row)}
                    className="border-top"
                  >
                    {['JICommercialCertificateList', ...uploadExtraModules].includes(moduleType) && !['OPS_ADMIN'].includes(user?.logged_in_user_info?.role) && (
                      <td>
                        <input
                          type="checkbox"
                          onChange={(e) => handleMultiFile(e, row, "dl_id")}
                          checked={multipleUrls.includes(row.dl_s3_url)}
                        />
                      </td>
                    )}

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
                      } else if (
                        header?.fieldName === "rpc_is_wght_avg" ||
                        header?.fieldName === "rpc_is_smpl_type"
                      ) {
                        return getBooleanName(row[header?.name]);
                      } else if (header?.fieldName === "config_type") {
                        return getConfigTypeCellContent(row, index);
                      } else if (header?.fromType === "array") {
                        return (
                          <td key={"cellIndex" + index}>
                            {cellData
                              ? header.type === "date"
                                ? getFormatedDate(
                                  cellData[header?.fieldName],
                                  1
                                )
                                : ['cmp_code', 'company_code'].includes(header.fieldName)
                                  ? getComonCodeForCompany(
                                    cellData[header?.fieldName]
                                  )
                                  : getCellData(cellData[header?.fieldName]) + (header.fieldName2 ? ` ${cellData[header?.fieldName2] || ''}` : '')
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
                    {/* <td className="exclude-click last-td" ref={popupRef}> */}
                    {/* <td className="exclude-click last-td " ref={popupRef}> */}
                    {/* <td className="actioncol list_th_action" ref={popupRef}> */}
                    <td className={"actioncol list_th_action " + (popupIndex === rowIndex && "actionColActive")} ref={popupRef}>
                      {/* <div className="actionColumn maxWidth"> */}
                      <div className="renderListButtonDiv">
                        <button
                          type="button"
                          onClick={() => {
                            popupIntentionallyOpenedRef.current = true; // Indicate the popup was intentionally opened
                            setTimeout(() => {
                              AutoScrollHeight('.tableContainer', '.mainRenderList', popupIndex === rowIndex ? -1 : rowIndex);
                            }, 0);
                            setPopupIndex((prevIndex) => {
                              return prevIndex === rowIndex ? -1 : rowIndex;
                            });
                            setSelectedDoc(row);
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
                              popupActions={() => {
                                if (moduleType === "confirugationList" && row["status"] !== "saved") {
                                  return [{
                                    "label": "bi bi-eye h6",
                                    "value": "View",
                                    "type": "icon",
                                    "status": "vesseListView"
                                  }]
                                }
                                return newfilteredAction
                              }}
                              setPopupIndex={setPopupIndex}
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
                              setPopupType={setPopupType}
                              getAllListingData={getAllSubListingdata}
                              operationMode={operationMode}
                            />
                          ) : null}
                        </span>
                        <div className="listActionBtns">
                          {moduleType === "commercialCertificateList" ? (
                            <div className="actionColumn maxWidth d-flex confirugationListActionColumn">
                              {[
                                "saved",
                                "sent_for_approval",
                                "posted",
                              ].includes(row["status"]) &&
                                ['BH', 'CP'].includes(user?.logged_in_user_info?.role) && (
                                  <button
                                    type="button"
                                    className="iconBtn"
                                    onClick={() => ApproveCertificate(row)}
                                  >
                                    Approve Certificate
                                  </button>
                                )}
                              {row["status"] === "saved" &&
                                user?.logged_in_user_info?.role === "BU" &&
                                moduleType !==
                                "JICommercialCertificateList" && (
                                  <button
                                    type="button"
                                    className="iconBtn"
                                    onClick={() => EditCertificate(row)}
                                  >
                                    Edit
                                  </button>
                                )}
                              {row["status"] === "posted" &&
                                user?.logged_in_user_info?.role === "BU" && (
                                  <button
                                    type="button"
                                    className="iconBtn"
                                    onClick={() => sendForApproval(row)}
                                  >
                                    Send For Approval
                                  </button>
                                )}
                              {row["status"] === "approved" &&
                                user?.logged_in_user_info?.role === "BU" && (
                                  <button
                                    type="button"
                                    className="iconBtn"
                                    onClick={() => RedirectPublishCertificate(row)}
                                  >
                                    Publish
                                  </button>
                                )}
                              {row["status"] === "published" &&
                                user?.logged_in_user_info?.role === "BU" && (
                                  <button
                                    type="button"
                                    className="iconBtn"
                                    // onClick={() => handlePublish(row)}
                                    onClick={() => {
                                      setIsCustomPopup(true)
                                      setIsDownLoadPopup(true)
                                      setClickedRow(row)
                                      // handleDownloadCertificateAfterPublish(row)
                                    }}
                                  >
                                    Download
                                  </button>
                                )}
                            </div>
                          ) : moduleType !== "confirugationList" ? (
                            <div className="actionColumn maxWidth d-flex confirugationListActionColumn">
                              {!["posted", "input-completed"].includes(
                                row["status"]
                              ) &&
                                !['JICommercialCertificateList', ...uploadExtraModules].includes(moduleType) && (
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
                              {["posted", "input-completed"].includes(
                                row["status"]
                              ) && (
                                  <div>
                                    <button
                                      type="button"
                                      className="iconBtn"
                                      onClick={() => handleCertificate(row)}
                                    >
                                      Certificate
                                    </button>
                                  </div>
                                )}
                            </div>
                          ) : (
                            <div className="actionColumn maxWidth d-flex gap-8">
                              {row["status"] === "saved" && (
                                <div>
                                  <button
                                    type="button"
                                    className="iconBtn"
                                    onClick={() =>
                                      handleCreateConfirugation(
                                        row["status"],
                                        row["rpc_id"]
                                      )
                                    }
                                  >
                                    Configure Certificate
                                  </button>
                                </div>
                              )}
                              {row["status"] === "configured" && (
                                <div>
                                  <button
                                    type="button"
                                    className="iconBtn"
                                    onClick={() =>
                                      handleGenerateConfirugation(row)
                                    }
                                  >
                                    Generate
                                  </button>
                                </div>
                              )}

                              {row["status"] === "completed" && (
                                <div>
                                  <button
                                    type="button"
                                    className="iconBtn"
                                    onClick={() =>
                                      handleDownloadCertificate(row)
                                    }
                                  >
                                    Download
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>)
                })}
              </tbody>
            </table>
          )}
          {
            moduleType === "commercialCertificateList" && ccIds.length > 1 && ccReferenceNumbers.length > 1 && (
              <div className="certificateBtns">
                <button
                  type="button"
                  className="saveBtn"
                  onClick={() => {
                    dispatch({
                      type: "CC_IDS",
                      cc_ids: [],
                    });
                    dispatch({
                      type: "REF_NUMS",
                      ref_nos: [],
                    });
                    setCcIds([]);
                    setCcReferenceNumbers([]);
                  }}
                >Clear Selection
                </button>
                <button
                  type="button"
                  className="submitBtn certificateiconBtn"
                  onClick={() => {
                    dispatch({
                      type: "CC_IDS",
                      cc_ids: getUniqueData(ccIds),
                    });
                    dispatch({
                      type: "REF_NUMS",
                      ref_nos: getUniqueData(ccReferenceNumbers),
                    });

                    navigate("/operation/invoice-listing/create-invoice")
                  }}
                >
                  <div className="createinvoice-btn">
                    <span> + Create Invoice</span>
                  </div>
                </button>
              </div>
            )
          }
        </div>
        {
          isCustomPopup && <CustomPopupModal isCustomPopup={isCustomPopup} setIsCustomPopup={setIsCustomPopup} handleConfirm={() => handleCustomConfirmHandler()} formData={customFormData} setFormData={setCustomFormdata} section={section.customField} />
        }
        {['JICommercialCertificateList', ...uploadExtraModules].includes(moduleType) && !['OPS_ADMIN'].includes(user?.logged_in_user_info?.role) && (
          <div className="submit_btns align-end">
            {multipleUrls?.length > 1 && (
              <button
                onClick={() => setPopupType("Merge")}
                className="submitBtn"
                type="button"
              >
                Merge
              </button>
            )}
            {multipleUrls?.length > 0 && (
              <button
                onClick={() => {
                  dispatch({
                    type: "SHARED_FILES",
                    selectedMultiDocs: selectedMultiDocs,
                    ccEmails: formData[0]?.ji_client_cc_emails,
                    clientEmails: formData[0]?.ji_client_email,
                    ccMailSubject: getMailSubjectDetails(formData, selectedMultiDocs),
                    ccMailBody: getMailBodyDetails(formData, selectedMultiDocs),
                  });
                  if (uploadExtraModules.includes(moduleType)) {
                    if (moduleType === "purchasereqDocumentList") {
                      navigate(`/PurchRequistion/purchreqDocumentlist/document/ShareFiles`)

                    }
                    else {
                      const mainmodule = moduleType.replace("DocumentList", "");
                      navigate(`/${mainmodule}List/${mainmodule}-document-list/document/ShareFiles`);
                    }

                  }
                  else {
                    navigate("/operation/ShareFiles");
                  }
                }}
                className="submitBtn"
                type="button"
              >
                Share Files
              </button>
            )}
          </div>
        )}
        <div className="previous_next_btns">
          <TablePagination
            totalPages={totalPage}
            currentPage={currentPage}
            onPageChange={handlePaginationButton} />
        </div>
      </div>
    </div>
  );
};
RenderSubListSectionWithPagination.propTypes = {
  section: PropTypes.string,
  sectionIndex: PropTypes.number,
  actions: PropTypes.arrayOf(PropTypes.object),
  responseData: PropTypes.object,
  // getAllSubListingdata: PropTypes.func,
  formConfig: PropTypes.object,
  statusCounts: PropTypes.object,
  setIsRejectPopupOpen: PropTypes.func,
  setJRFCreationType: PropTypes.func,
  setIsPopupOpen: PropTypes.func,
  // loadingTable: PropTypes.bool,
  setIsOverlayLoader: PropTypes.func,
  moduleType: PropTypes.string,
  formData: PropTypes.object,
};
export default RenderSubListSectionWithPagination;
