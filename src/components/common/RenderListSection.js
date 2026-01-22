import React, { useEffect, useRef, useState } from "react";
import PopupOptions from "./PopupOptions";
import {
  getComonCodeForCompany,
  getDayCountFromDate,
  getFormatedDate,
  getActivityCode,
  getLMSOperationActivity,
  getVesselOperation,
  getDaysColorCount,
  getTruckOperations,
  getRakeOperations,
  getStackOperations,
  getUniqueData,
  getDateFromCreatedAt,
  getColorForDate,
  getDateColor,
  getAllYearsOptions,
  getColoredDate,
  getOperationActivityUrl,
  getPlantOperations,
  formatCurrency,
} from "../../services/commonFunction";

import { useSelector } from "react-redux";
import PartialIcon from "../../assets/images/icons/Partial.svg";
import PostedIcon from "../../assets/images/icons/Posted.svg";
import CompletedIcon from "../../assets/images/icons/Completed.svg";
import AllotedIcon from "../../assets/images/icons/Accepted.svg";
import PendingIcon from "../../assets/images/icons/Inprocess.svg";
// import AllotedIcon from "../../assets/images/icons/Alloted.svg";
// import NotInvoiced from "../../assets/images/icons/Pending.svg";
// import PendingIcon from "../../assets/images/icons/Pending.svg";
import RejectedIcon from "../../assets/images/icons/Rejected.svg";
import AcceptedIcon from "../../assets/images/icons/Accepted.svg";
import InprocessIcon from "../../assets/images/icons/Inprocess.svg";
import RupeeIcon from "../../assets/images/icons/RupeeIcon.png";
import { Row, Col, Placeholder, Collapse } from "react-bootstrap";
import ListingActionButton from "./ListingActionButton";
import PropTypes from "prop-types";
import Loading from "./Loading";
import $ from "jquery";
import { getDataFromApi, postDataFromApi } from "../../services/commonServices";
import { notificationListApi, ccCertPdfApi, truckCSPdfApi, rakeQAPdfApi, truckQAPdfApi, truckQA2PdfApi, stackQAPdfApi, bulkCargoPDF, physicalAnalysisPDF, tmlMoisturePDFApi, opsRakeSVPDFApi, opsStackSVPDFApi } from "../../services/api";
import RenderFields from "./RenderFields";
import {
  getCommodityData,
  getCompanyData,
  getOpeartionType,
} from "./commonHandlerFunction/jobinstructionHandlerFunctions";
import { getCellData } from "../../services/commonFunction";
import TablePagination from "./TablePagination";
import { useNavigate, useParams } from "react-router-dom";
import { encryptDataForURL, decryptDataForURL } from "../../utills/useCryptoUtils";
import { useDispatch } from "react-redux";
import {
  downLoadNonLMSCertificatePDFById,
  getNonLMSDetailsById,
} from "./commonHandlerFunction/OPscertificate/OPSCertificateHandlerFunctions";
import { selectedSingleRow } from "../../actions/authActions";
import { getMonthlyOutStanding } from "./commonHandlerFunction/Audit/OutStanding/OutStandingHandlerFunction";
import { capitalize } from "lodash";
import CustomPopupModal from "./commonModalForms/CustomPopupModal";
import { handleTransferCertificateOwnershipHandler } from "./commonHandlerFunction/CommercialCertificateHandlerFunctions";
import { hanfleInvoiceStatusChange } from "./commonHandlerFunction/InvoiceHandlerFunctions";
import { handleCancelRemarkFunck } from "./commonHandlerFunction/Audit/JobCosting/JobCostingHandlerFunction";
import { toast } from "react-toastify";
import NotInvoiced from "../../assets/images/icons/not_invoiced.svg";
import CertificatePublished from "../../assets/images/icons/certificate_published.svg";
import InvoicedSVG from "../../assets/images/icons/invoiced_svg.svg";
import moment from "moment";


export const selectUser = (state) => state.user;

const RenderListSection = ({
  section,
  sectionIndex,
  actions,
  responseData,
  getAllListingData,
  formConfig,
  setFormData,
  statusCounts,
  setIsRejectPopupOpen,
  setJRFCreationType,
  setIsPopupOpen,
  loadingTable,
  setLoadingTable,
  setIsOverlayLoader,
  kpiValue,
  setKpiValue,
  searchFormData,
  setSearchFormData,
  handleSearchFilter,
  formData,
  OperationType,
  handleSubmit,
  setSubTableData,
  setIsFiltered,
  isFiltered,
  customFilterData,
  setCustomFilterData,
  sizeofPage,
  setSizeOfPage,
  isCustomPopup,
  setIsCustomPopup,
  getAllListingDataExports
}) => {


  let user = useSelector(selectUser);
  const session = useSelector((state) => state.session);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  user = session.user;
  const currentPageNo = session?.currentPageNo;
  const moduleTypeSess = session?.moduleType;
  const OPSCodeSess = session?.OPSCode;

  const [popupIndex, setPopupIndex] = useState(-1);
  const [sortStates, setSortStates] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(10);
  const [sizeChanged, setSizeChanged] = useState(0);

  const [countPage, setCountPage] = useState(10);
  const [filteredAction, setFilteredAction] = useState(actions);
  const [allNotifications, setAllNotifications] = useState([]);
  const [nextPage, setNextPage] = useState(0);

  const [filterMasterOptions, setFilterMasterOptions] = useState([]);

  const [selectedMultiDocs, setSelectedMultiDocs] = useState([]);
  const [selectedIds, setSelectedIds] = useState([])
  const [ccIds, setCcIds] = useState([]);
  const [ccReferenceNumbers, setCcReferenceNumbers] = useState([]);
  const [ccactivities, setCcactivities] = useState([]);
  const [showButton, setShowButton] = useState(false);

  const [currentActiverow, setCurrentActiverow] = useState({});
  const popupRef = useRef(null);
  const moduleType = formConfig?.listView?.moduleType;
  const subModuleType = formConfig?.listView?.subModuleType;
  const [isDownLoadPopup, setIsDownLoadPopup] = useState(true);
  const [Clickedrow, setClickedRow] = useState(null);
  const [customFormData, setCustomFormdata] = useState({
    0: {}
  });
  const hash = window.location.hash;

  const params = new URLSearchParams(hash.split("?")[1]);
  const opsTypeID = decryptDataForURL(params.get("activityJIID"));
  const status = decryptDataForURL(params.get("status"));
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
    setCurrentPage(responseData.current_page);
    setTotalPage(responseData.total_pages);
    setSizeOfPage(responseData.page_size);
    setCountPage(responseData.count);
  }, [responseData]);

  useEffect(() => {
    if (section.isCustomFilter) {
      if (["jioperationjsonb", "jobinstruction", 'dashboard', 'purchase'].includes(moduleType)) {
        // getCommodityData(setFilterMasterOptions);
        getCompanyData(setFilterMasterOptions);
      }
    }
  }, []);

  const handleClick = (index, fieldName) => {
    const newSortStates = Array(section.headers?.length).fill(false);
    newSortStates[index] = !sortStates[index];
    let sortType = newSortStates[index] ? "desc" : "asc";
    getAllListingData(currentPage, fieldName, sortType);
    setSortStates(newSortStates);
  };

  const handlePrev = () => {
    getAllListingData(currentPage - 1);
    setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    getAllListingData(currentPage + 1);
    setCurrentPage((prev) => prev + 1);
  };

  const handlePaginationButton = (pageNo) => {
    getAllListingData(pageNo);
    setCurrentPage(pageNo);
    let ops_code = ""
    if (moduleType === "jioperationjsonb" && !subModuleType) {
      let endPoint = formConfig?.apiEndpoints?.read
      const spQuerystring = endPoint.split('?')
      endPoint = spQuerystring[1]
      ops_code = endPoint.split("=")[1]
    }
    dispatch({
      type: "currentPageNo",
      pageNo: pageNo,
      moduleType: moduleType,
      OPSCode: ops_code,
    });
  };

  const onPageSizeChange = (pageSize) => {
    setCurrentPage(1);
    setSizeOfPage(pageSize)
    setSizeChanged(pageSize)
    dispatch({
      type: "currentPageNo",
      pageNo: 0,
      moduleType: '',
      OPSCode: '',
    });
  }
  useEffect(() => {
    if (sizeChanged) {
      getAllListingData();
    }
  }, [sizeChanged])

  let statusesWithIcon = formConfig?.listView?.statusesWithIcon;

  const statusesWithColor = formConfig?.listView?.statusesWithColor;

  const getAlstatusesNames = () => {
    let filterData = statusesWithIcon?.filter((status) => {
      if (moduleType === "jrf") {
        if (['LR', 'SU'].includes(user?.role)) {
          if (['LR'].includes(user?.role)) {
            return !["saved"].includes(status.name);
          }
          else {
            return !["saved", "rejected"].includes(status.name);
          }
        } else if (user?.role === "BU") {
          return !["awaited"].includes(status.name);
        }
      }
      else if (moduleType === "invoice") {
        if (['CU'].includes(user?.role)) {
          return ['sales_current_month', 'sales_april_to_prev_month', 'collection_current_month', 'collection_april_to_prev_month', 'tcrc_outstanding', 'tipl_outstanding'].includes(status.name);
        }
        return !['sales_current_month', 'sales_april_to_prev_month', 'collection_current_month', 'collection_april_to_prev_month', 'tcrc_outstanding', 'tipl_outstanding'].includes(status.name);
      }
      if (subModuleType === "commercialCertificate") {
        if (['BH'].includes(user?.role)) {
          return !["rejected"].includes(status.name);
        }
        return true
      } else {
        return true;
      }
    });
    return filterData;
  };

  function getImageObject(imageName) {
    // if (['dashboard'].includes(moduleType)) {
    //   // const icons = import.meta.glob('../../assets/images/icons/DashboardListing/*.svg', {
    //   //   eager: true,
    //   //   import: 'default',
    //   // });

    //   // const iconSrc = icons[`../../assets/images/icons/DashboardListing/${imageName}.svg`];
    //   try{
    //     return require(`../../assets/images/icons/DashboardListing/${imageName}.svg`)
    //   }
    //   catch(ex){}
    // }
    switch (imageName) {
      case "PartialIcon":
        return PartialIcon;
      case "PostedIcon":
        return PostedIcon;
      case "CompletedIcon":
        return CompletedIcon;
      case "RejectedIcon":
        return RejectedIcon;
      case "AcceptedIcon":
        return AcceptedIcon;
      case "InprocessIcon":
        return InprocessIcon;
      case "AllotedIcon":
        return AllotedIcon;
      case "PendingIcon":
        return PendingIcon;
      case "NotInvoiced":
        return NotInvoiced;
      case "CertificatePublished":
        return CertificatePublished;
      case "InvoicedSVG":
        return InvoicedSVG;
      // Srushti

      case "RupeeIcon":
        return RupeeIcon;
      // ----------------------------------------------------------------

      default:
        return null;
    }
  }
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
        return user?.role == "BU" ? row["status"] : row["ji_internal_status"];
      case "jioperationjsonb":
        return row["status"];
      case "TPIMain":
        return row["status"];
      case "consortiumorder":
        return row["status"];
      case "invoice":
        return row["im_status"];

      // Srushti 
      case "jobCosting":

        if (row?.["fk_im_id"]?.['im_status'] === "cancelled") {
          return row?.["fk_im_id"]?.['im_status']?.toLowerCase();
        }
        else {
          return row["jc_status"].toLowerCase();
        }
      case "auditBranchExpenses":
        return row["status"];
      case "auditOutstanding":
        return row["status"];
      case "auditSalesRegister":
        return row["status"];
      case "calibration":
        return supStatusMap[row?.calib_status];
      case "supplier":
        return supStatusMap[row?.sup_status];
      case "purchaseReq":
        return row?.req_status
      case "purchase":
        return row?.po_status
      case "tender":
        return tenderStatusMap[row?.tender_final_status]
      case "stocks":
        return stockStatusMap[row?.stock_status]
      case "incentives":
        // row?.incentive_status
        return incentivesStatusMap[row?.incentive_status]
      case "feedback":
        return feedbackStatusMap[0]
      // case "category":
      //   return categoryStatusMap[0]

      // ---------------------------------------------
      default:
        return row["jrf_status"];
    }
  };

  const getStatusNameValue = (cellData, newraw) => {

    let statusData = statusesWithColor;

    let filterStatusData = statusData?.filter((jrfColor, jrfColorIndex) => {
      if (Array.isArray(jrfColor.status)) {
        return jrfColor.status.includes(cellData);
      } else {
        if (moduleType === "jobCosting") {
          if (newraw?.["fk_im_id"]?.['im_status'] === "cancelled") {
            return jrfColor.status?.toLowerCase() == "cancelled";
          }
          else {
            return jrfColor.status?.toLowerCase() == cellData?.toLowerCase();
          }
        }
        return jrfColor.status?.toLowerCase() == cellData?.toLowerCase();
      }
    });
    if (filterStatusData?.length > 0) {
      filterStatusData = filterStatusData[0];
      if (moduleType === "jrf") {
        if (newraw["jrf_status"] == "saved" && newraw["jrf_is_ops"]) {
          filterStatusData.name = "Partial";
        }
      }
      if (moduleType === "jobCosting") {
        if (newraw?.["fk_im_id"]?.['im_status'] === "cancelled") {
          filterStatusData.name = "Cancelled";
        }
        else {
          filterStatusData.name = newraw.jc_status;
        }
      }

      return (
        <td key="status_list" className={`status-td ${moduleType === "internalcertificate" && user?.logged_in_user_info?.role === "LR"
          ? "ic_status"
          : moduleType === "dashboard" || user?.role == "CU" ? "" : "status-stickycol"
          } ${(subModuleType === "commercialCertificate" &&
            user?.logged_in_user_info?.role === "BU")
            ? " ext_status"
            : ""
          }`}>
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
        <td key="status_list" className={(moduleType === "dashboard" ? "" : "status-stickycol") + ((subModuleType == "commercialCertificate" || moduleType == "internalcertificate") &&
          user?.logged_in_user_info?.role === "BU" ? " ext_status" : "")}>
          <div className="table_item_sym" key={"table-item"} title="">
            {/* <div className="posted_sym"> </div> */}

            {cellData}
          </div>
        </td>
      );
    }
  };


  const getStatusCountForAuditModels = (module, statusCount) => {

    let data = [];
    if (module === "auditSalesRegister") {
      return data = [
        {
          "status": "monthly_sales",
          "count": statusCount.monthly_sales
        },
        {
          "status": "yearly_sales",
          "count": statusCount.yearly_sales
        }
      ]
    }
    else if (module === "auditBranchExpenses") {

      return data = [
        {
          "status": "total_monthly_expense",
          "count": statusCount.monthly_expense
        },
        {
          "status": "tcrc_yearly_expenses",
          "count": statusCount?.tenant_expense?.tenant_expenses[1]?.total_expense
        },
        {
          "status": "tipl_yearly_expenses",
          "count": statusCount?.tenant_expense?.tenant_expenses[0]?.total_expense
        }
      ]
    }
    else if (module === "auditOutstanding") {
      return data = [
        {
          "status": "monthly_outstanding",
          "count": statusCount.monthly_outstanding
        },
        {
          "status": "yearly_outstanding",
          "count": statusCount.yearly_outstanding
        }
      ]
    }
  }

  const getFilteredStatusCount = (status, jrfStatus) => {
    if (moduleType == "dashboard") {
      // if (jrfStatus && jrfStatus?.istotalRecords) {
      //   return countPage || 0
      // }
      if (['total_invoice_balance'].includes(status)) {
        return statusCounts?.[status] || 0
      }
      return statusCounts?.[jrfStatus?.objectName]?.[status] || 0
    }
    else if (moduleType === "invoice") {
      if (['CU'].includes(user?.role)) {
        if (['sales_current_month', 'sales_april_to_prev_month', 'collection_current_month', 'collection_april_to_prev_month'].includes(status)) {
          return statusCounts?.['sales_collection_summary']?.[status] || 0
        }
        else if (['tcrc_outstanding', 'tipl_outstanding'].includes(status)) {
          return statusCounts?.['outstanding_summary']?.[status] || 0
        }
      }
    }
    let module = moduleType;
    let statusarr = [];
    if (module == "internalcertificate") {
      if (status == "approved") {
        if (user.role == "DTM") {
          status = "dtm-approved";
        } else {
          status = "tm-approved";
        }
        statusarr.push("dtm-approved");
        statusarr.push("tm-approved");
      } else if (status == "rejected") {
        if (user.role == "DTM") {
          status = "dtm-rejected";
        } else {
          status = "tm-rejected";
        }
        statusarr.push("dtm-reject");
        statusarr.push("tm-reject");
      } else {
        statusarr.push(status);
      }
    } else if (module === "jioperationjsonb" || module === "invoice") {
      if (subModuleType == "commercialCertificate") {
        module = "commercial_certificate";
      }
      else if (subModuleType == "invoice") {

        module = "invoice";
      }
      else {
        module = "jobinstruction";
      }
      statusarr.push(status);
    } else if (module === "jobCosting") {
      module = "jobCosting";
      statusarr.push(status)
    }
    else if (module === "auditBranchExpenses") {
      module = "auditBranchExpenses";
      statusarr.push(status)
    }
    else if (module === "auditOutstanding") {
      module = "auditOutstanding";
      statusarr.push(status)
    }
    else if (module === "auditSalesRegister") {
      module = "auditSalesRegister";

      statusarr.push(status)
    }
    else if (module === "supplier") {
      module = "supplier_status";
      statusarr.push(status)
    }
    else if (module === "purchaseReq") {
      module = "commercial_certificate";
      statusarr.push(status)
    }
    else if (module === "purchase") {
      module = "purchase_order_status";
      statusarr.push(status)
    }
    else if (module === "tender") {
      module = "tender_status";

      statusarr.push(status)
    }
    else if (module === "calibration") {
      module = "calibration_status";
      statusarr.push(status)
    }
    else if (module === "stocks") {
      module = "chemist_stock_status";
      statusarr.push(status)
    }
    else if (module === "incentives") {
      module = "incentive_status";
      statusarr.push(status)
    }
    else {
      statusarr.push(status);
    }
    statusarr = statusarr.map((singleStatus) => singleStatus.toLowerCase())
    let statusData =
      statusCounts[module] && statusCounts[module].length > 0
        ? statusCounts[module].filter((singleData) => {

          return statusarr.includes(singleData?.status?.toLowerCase());
        })
        :
        ["auditSalesRegister", "auditOutstanding", "auditBranchExpenses"].includes(moduleType)
          ? getStatusCountForAuditModels(module, statusCounts)
          : []

    let countData = 0;

    if (["auditSalesRegister", "auditOutstanding", "auditBranchExpenses"].includes(moduleType)) {

      const filterStatusData = statusData?.find((st) => {
        return st.status.toLowerCase() === status.toLowerCase()

      });
      countData = filterStatusData?.count

      return countData;
    }
    else {

      statusData?.map((st) => {
        countData = st.count
      });
      return countData;
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

  const checkIsShow = (fieldName, header) => {
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
    } else if (moduleType === "internalcertificate") {
      if (fieldName === "ic_ulrno") {
        if (!["BU"].includes(user?.role)) {
          if (!user?.logged_in_user_info?.lab_or_branch?.lab_is_compliant) {
            return false;
          }
        }
      }
    } else if (moduleType == "jobinstruction") {
      if (fieldName === "ji_created_by_user") {
        if (user?.role !== "BU") {
          return false;
        }
      }
    }
    else if (subModuleType == "commercialCertificate") {
      if (fieldName === "branch") {
        if (user?.role === "BU") {
          return false;
        }
      }
      else if (fieldName === "company") {
        if (['CP', 'BH'].includes(user?.role)) {
          return false;
        }
      }

    }
    else if (moduleType === "testmemomain") {
      if (fieldName === "date_of_allotment") {
        if (user?.role === "LR") {
          return false;
        }
      }
      else if (header.fieldName === "smpl_dos") {
        if (user?.role !== "LR") {
          // return false;
        }
      }
      else if (header.fieldName === "jrf_date") {
        if (user?.role === "LR") {
          return false;
        }
      }
    }
    else if (moduleType === "invoice") {
      if (['CU'].includes(user?.role) && !['PaymentDetails', 'ClientDetails'].includes(subModuleType)) {
        if (!['company_details', 'im_invoice_date', 'cust_name', 'fk_invoice_branchid', 'im_invoicenumber', 'im_total', 'sales_person', 'invoice_ageing', 'reciept_date', 'im_status', 'im_total_gst', 'im_tds', 'im_net_amount', 'im_paid', 'im_paid_date'].includes(fieldName)) {
          return false;
        }
        else {
          if (['company_details', 'sales_person', 'reciept_date'].includes(fieldName)) {
            return false;
          }
        }
      }

      if (fieldName === "invoice_ageing") {
        if (user?.role === "LR") {
          return false;
        }
      }
    }
    else if (moduleType === "dashboard") {
      if (user?.role === "CU") {
        return !['place_of_work', 'ji_totalqty', 'certificate_status', 'invoice_status'].includes(fieldName)
      }
    }
    return true;
  };
  $("table").each(function (index, tableID) {
    $(tableID)
      .find("thead tr th")
      .each(function (index) {
        index += 1;
        $(tableID)
          .find("tbody tr td:not(.exclude-click)")
          .each(function (index, tdID) {
            $(tdID).attr("title", $(this).text());
            // $(tdID).css("overflow", "hidden");
          });
      });
  });
  const getAllNotificationList = async (isNext = "") => {
    try {
      let endPoint = notificationListApi;
      if (isNext) {
        endPoint = endPoint + `?page=${1}`;
      }
      let res = await getDataFromApi(endPoint);
      if (res?.status === 200) {
        let responseData = res.data;

        setAllNotifications(responseData.results);
        // setHasMore(responseData.next !== null);
        if (isNext) {
          setNextPage((prevPage) => prevPage + 1);
        } else {
          setNextPage(1);
        }
      }
    } catch (error) {
    }
  };
  useEffect(() => {
    if (user?.role !== "SU" && moduleType != "dashboard")
      getAllNotificationList(1);
  }, []);

  const handleStatus = (status) => {
    if (status === kpiValue) {
      setKpiValue(null);
      setIsFiltered(false)
    } else {
      setKpiValue(status);
      setIsFiltered(true)
    }
  };

  const handleFieldChange = (
    sectionIndex,
    fieldName,
    value,
    type = "",
    isChecked = ""
  ) => {
    if (type) {
      value = isChecked;
    }
    const fieldtype = section.filterListing.filter(

      (field) => field.name === fieldName
    );
    setIsFiltered(true);
    setCustomFilterData((prevFormData) => {
      return {
        ...prevFormData,
        [sectionIndex]: {
          ...prevFormData[sectionIndex],
          [fieldName]: value,
          lastChangeFiledName: fieldtype[0].filterType,
          lastChangeFiledValue: value,
        },
      };
    });

    // getData(fieldName, value);

  };
  const getInvoiceDetailsData = (row, header) => {
    const key = header;

    const values = row.invoice_details
      .map(item => {
        return item.ji_data?.[key] || item.jrf_data?.[key] || item.jis_data?.[key];
      })
      .filter(Boolean);

    const uniqueValues = [...new Set(values)];

    return getCellData(uniqueValues.join(", "));
  };



  useEffect(() => {

    if (currentPageNo && moduleTypeSess === moduleType) {

      if (moduleType === "jioperationjsonb" && !subModuleType) {
        let endPoint = formConfig?.apiEndpoints?.read
        const spQuerystring = endPoint.split('?')
        endPoint = spQuerystring[1]
        const ops_code = endPoint.split("=")[1]
        if (OPSCodeSess === ops_code) {
          setCurrentPage(currentPageNo)
          getAllListingData(currentPageNo)
        }
        else {
          dispatch({
            type: "currentPageNo",
            pageNo: 0,
            moduleType: '',
            OPSCode: '',
          });
          getAllListingData()
        }
      }
      else {
        setCurrentPage(currentPageNo)
        getAllListingData(currentPageNo)
      }
    }
    else {
      if (!['dashboard'].includes(moduleTypeSess)) {
        dispatch({
          type: "currentPageNo",
          pageNo: 0,
          moduleType: '',
          OPSCode: '',
        });
      }
      getAllListingData()
    }
  }, [customFilterData?.[1]?.lastChangeFiledValue])
  useEffect(() => {
    if (['dashboard'].includes(moduleType)) {
      if (customFilterData?.[1]?.end_date) {
        getAllListingData()
      }

    }
  }, [customFilterData?.[1]?.end_date])
  useEffect(() => {
    if (['dashboard'].includes(moduleType)) {
      if (customFilterData?.[1]?.isClearDate) {
        getAllListingData()
      }
    }
  }, [customFilterData?.[1]?.isClearDate])
  const getData = (fieldName, value) => {

    const type = section.filterListing.filter(

      (field) => field.name === fieldName
    );
    if (type.length > 0) {
      getAllListingData("", "", "", "", "", 1, type[0].filterType, value);
    }
  };

  // Srushti 

  const hasLabel = formConfig?.listView?.filterListing?.some(item => item.label);

  const supStatusMap = {
    0: "saved",
    1: "posted"
  }

  const poStatusMap = {
    0: "approved",
    1: "saved",
    2: "posted"
  }

  const tenderStatusMap = {
    0: "retendered",
    1: "awarded",
    2: "not awarded",
    3: "underevaluation",
    4: "cancelled",
    5: "inprocess"
  }

  const reqStatusMap = {
    0: "saved",
    1: "posted",
    2: "send for approval",
    3: "Approved"
  }

  const stockStatusMap = {
    0: "saved",
    1: "posted"
  }

  const incentivesStatusMap = {
    0: "saved",
    1: "posted"
  }

  const feedbackStatusMap = {
    0: "submitted"
  }
  const categoryStatusMap = {
    0: "saved"
  }

  const departmentMap = {
    1: "Field Sampling",
    2: "Chemical Analysis",
    3: "Quality Assurance",
    4: "Instrumentation & Calibration",
    5: "Reporting",
    6: "Field Instrumentation & Survey"
  };

  const branchMap = {
    1: "Mumbai",
    2: "Delhi",
    3: "Bengaluru",
    4: "Hyderabad",
    5: "Chennai",
    6: "Kolkata",
    7: "Pune",
    8: "Ahmedabad",
    9: "Jaipur",
    10: "Lucknow"
  }
  //  ----------------------------------------------------------------
  const getCommonFieldsForFilter = () => {

    let fieldIndex = 0;
    return section.filterListing?.map((field, FldIndex) => {
      if (field.isYearOptions) {
        field = {
          ...field,
          options: getAllYearsOptions('', '', 1)
        }
      }

      return (

        <div
          key={"Form-Accordion" + FldIndex}
          className={`col-md-${field.width} ${hasLabel ? "expenseListLabel" : ""}`}
        >

          <RenderFields
            field={field}
            sectionIndex={sectionIndex}
            fieldIndex={fieldIndex}
            formData={customFilterData}
            handleFieldChange={handleFieldChange}
            masterOptions={filterMasterOptions}
          // isEditMode={true}
          />
        </div>
      )
    }
    );
  };
  const clearFilterData = () => {
    setCustomFilterData({});
    if (kpiValue) {
      setKpiValue(null);
    }
    else {
      getAllListingData("", "", "", "", "", 1);
    }
    setIsFiltered(false);

  };
  const getHeaderTileConditonWise = (header) => {
    // if (user?.role === "TM") {
    //   if (header?.name === "tm_datestartinganalysis") {
    //     return "Date of Sample Recieve"
    //   }
    // }
    if (moduleType === "testmemomain") {
      if (header?.name === "tm_datecompletion") {
        if (user?.role !== "LR") {
          return "Completion Date"
        }
      }
      else if (header.fieldName === "smpl_dos") {
        if (user?.role !== "LR") {
          return "Inward Date";
        }
      }
    }
    else if (moduleType === "internalcertificate") {
      if (user?.role === "LR") {
        if (header.name === "ic_created_time") {
          return "Date of Analysis Completed"
        }
      }
    }
    else if (moduleType === "allotment") {
      if (['LC', 'SLC'].includes(user?.role)) {
        if (header.name === "sa_expdateofresult") {
          return "Expected Date of Completion"
        }
      }
    }
    else if (moduleType === "sfm") {
      if (['LC', 'SLC'].includes(user?.role)) {
        if (header.name === "sfm_dateanalysiscompleted") {
          return "Completion Date"
        }
      }
    }
    return header.label && header.label.split('\n').length > 1 && header.label.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index == header.label.split('\n').length - 1 ? null : <br />}
      </React.Fragment>
    )) || header.label;
  }

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
  const sendForApproval = async (row) => {

    if (row.cc_is_external) {
      navigate(
        `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(row?.fk_jisid)}/${encryptDataForURL(row.cc_id)}?status=${encryptDataForURL(
          "posted"
        )}&CCID=${encryptDataForURL(row.cc_id)}` +
        "&OperationType=" +
        encryptDataForURL(row?.activity_code) + "&isExternal=" + encryptDataForURL(1)
      );
      return
    }
    if (
      !getLMSOperationActivity().includes(getActivityCode(row?.activity_code).toLowerCase()) && ![getStackOperations("ST_SV"), getRakeOperations("RK_SV"), getVesselOperation('bulk_crg')].includes(getActivityCode(row?.activity_code).toLowerCase())
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
      if (row?.cc_is_physical) {
        navigate(
          `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
            row?.fk_jiid
          )}/${encryptDataForURL(row.cc_id)}?status=${encryptDataForURL(
            "posted"
          )}&CCID=${encryptDataForURL(row.cc_id)}` +
          "&OperationType=" +
          encryptDataForURL(row?.activity_code) + "&isUseForPhysical=" +
          encryptDataForURL(1)
        );
      }
      else {
        navigate(
          `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
            row?.fk_jiid
          )}/${encryptDataForURL(row.cc_id)}?status=${encryptDataForURL(
            "posted"
          )}&CCID=${encryptDataForURL(row.cc_id)}&activityJIID=${encryptDataForURL(row.fk_jisid)}` +
          "&OperationType=" +
          encryptDataForURL(row?.activity_code)
        );
      }
    }
  };

  const ApproveCertificate = async (row) => {
    if (row.cc_is_external) {
      navigate(
        "/operation/commercial-certificate-list/commercial-certificate-preview/" +
        encryptDataForURL(row?.fk_jisid) +
        "/" +
        encryptDataForURL(row?.cc_id) +
        "/" +
        "?status=" +
        encryptDataForURL("approve") +
        "&CCID=" +
        encryptDataForURL(row?.cc_id) +
        "&OperationType=" +
        encryptDataForURL(row.activity_code) + "&isExternal=" + encryptDataForURL(1)
      )
      return
    }
    else if (row?.cc_is_physical) {
      navigate(
        `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
          row?.fk_jiid
        )}/${encryptDataForURL(row.cc_id)}?status=${encryptDataForURL(
          "approve"
        )}&CCID=${encryptDataForURL(row.cc_id)}` +
        "&OperationType=" +
        encryptDataForURL(row?.activity_code) + "&isUseForPhysical=" +
        encryptDataForURL(1)
      );
      return
    }
    if (
      !getLMSOperationActivity().includes(getActivityCode(row?.activity_code).toLowerCase()) && ![getVesselOperation("bulk_crg"), getStackOperations("ST_SV"), getRakeOperations("RK_SV")].includes(getActivityCode(row.activity_code).toLowerCase())
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
        encryptDataForURL(row.activity_code) + `&activityJIID=${encryptDataForURL(row.fk_jisid)}`
      );
    }
  };
  const RedirectPublishCertificate = async (row) => {
    dispatch(selectedSingleRow(row))
    if (row.cc_is_external) {
      navigate(
        "/operation/commercial-certificate-list/commercial-certificate-preview/" +
        encryptDataForURL(row?.fk_jisid) +
        "/" +
        encryptDataForURL(row?.cc_id) +
        "/" +
        "?status=" +
        encryptDataForURL("publish") +
        "&CCID=" +
        encryptDataForURL(row?.cc_id) +
        "&OperationType=" +
        encryptDataForURL(row.activity_code) + "&isExternal=" + encryptDataForURL(1)
      );
      return
    }
    else if (row?.cc_is_physical) {
      navigate(
        `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
          row?.fk_jiid
        )}/${encryptDataForURL(row.cc_id)}?status=${encryptDataForURL(
          "publish"
        )}&CCID=${encryptDataForURL(row.cc_id)}` +
        "&OperationType=" +
        encryptDataForURL(row?.activity_code) + "&isUseForPhysical=" +
        encryptDataForURL(1)
      );
      return
    }
    if (
      (!getLMSOperationActivity().includes(getActivityCode(row?.activity_code).toLowerCase()) && ![getVesselOperation("bulk_crg"), getStackOperations("ST_SV"), getRakeOperations("RK_SV")].includes(getActivityCode(row.activity_code).toLowerCase()))
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
        encryptDataForURL(row.activity_code) + `&activityJIID=${encryptDataForURL(row.fk_jisid)}`
      );
    }
  };
  const EditCertificate = async (row) => {
    const redirectUrl = getOperationActivityUrl(row?.operationmode?.ops_code)
    if (row.cc_is_external) {
      navigate(
        `${redirectUrl}confirugation-certificate/${encryptDataForURL(
          row.fk_jiid
        )}/${encryptDataForURL(row.fk_jisid)}/${encryptDataForURL(
          row.cc_id
        )}?status=${encryptDataForURL(
          "Edit"
        )}&OperationType=${encryptDataForURL(row.activity_code)}` +
        "&isExternal=" + encryptDataForURL(1) + "&isCustomMode=" + encryptDataForURL(1) + "&operationMode=" + encryptDataForURL(row?.operationmode?.ops_code)
      );
      return
    }
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
        encryptDataForURL(OperationType) + "&operationMode=" + encryptDataForURL(row?.operationmode?.ops_code)
      );
    } else {
      if (row?.cc_is_physical) {
        navigate(
          `${redirectUrl}confirugation-certificate/${encryptDataForURL(
            row.fk_jiid
          )}/${encryptDataForURL(row.fk_jisid)}/${encryptDataForURL(
            row.cc_id
          )}?status=${encryptDataForURL(
            "Edit"
          )}&OperationType=${encryptDataForURL(row.activity_code)}` +
          "&OperationType=" +
          encryptDataForURL(OperationType) + "&isUseForPhysical=" +
          encryptDataForURL(1) + "&operationMode=" + encryptDataForURL(row?.operationmode?.ops_code)
        );
        return
      }
      navigate(
        `${redirectUrl}confirugation-certificate/${encryptDataForURL(
          row.fk_jiid
        )}/${encryptDataForURL(row.fk_jisid)}/${encryptDataForURL(
          row.cc_id
        )}?status=${encryptDataForURL("Edit")}` +
        "&OperationType=" +
        encryptDataForURL(row.activity_code) + "&operationMode=" + encryptDataForURL(row?.operationmode?.ops_code)
      );
    }
  };


  const handleDownloadCertificateAfterPublish = async (row) => {
    try {
      let payload, generateCertificateResponse;
      setLoadingTable(true);
      if (row.cc_is_external) {
        let payload = {
          "dl_module": "commercial_certificate",
          "dl_document_reference": row.fk_jisid,
          dl_document_jisid: row?.fk_jisid,
          "is_active": true,
          "tenant": 1
        }
        let res = await postDataFromApi("/documents/list/", payload);
        if (res.data.status === 200) {

          const pdfUrl = res.data.data[0].dl_s3_url;

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
          return
        }
      }
      if (
        !getLMSOperationActivity().includes(getActivityCode(row?.activity_code).toLowerCase()) && ![getVesselOperation("bulk_crg"), getStackOperations("ST_SV"), getRakeOperations("RK_SV")].includes(getActivityCode(row.activity_code).toLowerCase())
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
        // if (getActivityCode(row?.activity_code).toLowerCase() == getVesselOperation("CS")) {
        //   generateCertificateResponse = await postDataFromApi(truckCSPdfApi, payload, "", true, "", "");
        // } else {
        //   generateCertificateResponse = await postDataFromApi(
        //     ccCertPdfApi,
        //     payload,
        //     "",
        //     true,
        //     "",
        //     ""
        //   );
        // }
        if (row?.cc_is_physical) {
          generateCertificateResponse = await postDataFromApi(physicalAnalysisPDF, payload, "", true, "", "");
        }
        else if (getActivityCode(row?.activity_code).toLowerCase() == getVesselOperation("CS")) {
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
        else if ([getRakeOperations('QA'), getPlantOperations('RK')].includes(getActivityCode(row?.activity_code).toLowerCase())) {
          generateCertificateResponse = await postDataFromApi(rakeQAPdfApi, payload, "", true, "", "");
        }
        else if (getActivityCode(row?.activity_code).toLowerCase() == getStackOperations("PV") || getActivityCode(row?.activity_code).toLowerCase() == getStackOperations()) {
          generateCertificateResponse = await postDataFromApi(stackQAPdfApi, payload, "", true, "", "");
        }
        else if (getActivityCode(row?.activity_code).toLowerCase() == getVesselOperation("CS")) {
          generateCertificateResponse = await postDataFromApi(truckCSPdfApi, payload, "", true, "", "");
        }
        else if (getActivityCode(row?.activity_code).toLowerCase() == getVesselOperation("bulk_crg")) {
          generateCertificateResponse = await postDataFromApi(bulkCargoPDF, payload, "", true, "", "");
        }
        else if (getActivityCode(row?.activity_code).toLowerCase() == getVesselOperation("VL_TML_M")) {
          generateCertificateResponse = await postDataFromApi(tmlMoisturePDFApi, payload, "", true, "", "");
        }
        else if (getActivityCode(row?.activity_code).toLowerCase() == getRakeOperations('RK_SV')) {
          payload.jis_id = row?.fk_jisid
          generateCertificateResponse = await postDataFromApi(opsRakeSVPDFApi, payload, "", true, "", "");
        }
        else if (getActivityCode(row?.activity_code).toLowerCase() == getStackOperations('ST_SV')) {
          payload.jis_id = row?.fk_jisid
          generateCertificateResponse = await postDataFromApi(opsStackSVPDFApi, payload, "", true, "", "");
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
  const handleMultiFile = (e, doc, id_type) => {
    setSelectedMultiDocs((prev) => {
      let { cc_id, cc_refencenumber, activity, cc_certificatenumber, fk_jisid, cc_created_time, ic_test_report_no, cc_date, company } = doc;
      if (moduleType == "internalcertificate") {
        cc_refencenumber = doc?.ic_refenence;
        cc_certificatenumber = doc?.sample_ids_from_to || "--";
        cc_id = doc?.ic_id || "--";
        cc_created_time = doc?.ic_dateanalysiscompleted
        // cc_created_time = doc?.ic_created_time
        company.cmp_code = company.company_code
      }
      else {
        cc_created_time = cc_date
      }
      if (ccactivities.length && !ccactivities.find((singleAct) => singleAct.cmp_code === company.cmp_code)) {
        toast.error("Certificates from different companies cannot be selected together.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return prev
      }
      let tempJSON = {
        cc_id: cc_id,
        ic_id: doc?.ic_id,
        cc_refencenumber: cc_refencenumber,
        activity: doc?.ic_id ? "SS" : activity + cc_id,
        cc_certificatenumber: cc_certificatenumber,
        cc_created_time: cc_created_time,
        cmp_code: company.cmp_code
      }
      setCcIds((prevIds) => {
        if (e.target.checked) {
          if (!prevIds.includes(cc_id)) {
            const CCIdRef = [...prevIds, cc_id];
            setShowButton(CCIdRef.length > 0);
            return CCIdRef;
          }
        } else {
          const updatedIds = prevIds.filter((id) => id !== cc_id);
          setShowButton(updatedIds.length > 0);
          return updatedIds;
        }
        return prevIds;
      });


      setCcReferenceNumbers(prevNumbers => {
        let ccRefNums = []
        if (e.target.checked) {
          ccRefNums = [...prevNumbers, cc_refencenumber]
        }
        else {
          ccRefNums = prevNumbers.filter((id) => id !== cc_refencenumber);
        }
        return ccRefNums
      });
      setCcactivities(newprev => {
        let existPrev = newprev
        if (e.target.checked) {
          existPrev = [...existPrev, tempJSON]
        }
        else {
          existPrev = existPrev.filter(item => item.cc_id !== cc_id);
        }
        // const isExisting = prev.some(item => item.cc_id === cc_id);
        // if (!isExisting) {
        //   return [...prev, tempJSON];
        // }
        return existPrev;
      });
      return [...prev, doc];
    }
    );
  };

  const getReferenceNoListFromInvoice = (data) => {
    // let refNumbers = data.invoice_details ? data.invoice_details.map(item => item.ivd_ref_no) : [];
    let refNumbers = data.ji_data ? data.ji_data?.['ji_ref_nos'] : [];
    refNumbers = getUniqueData(refNumbers)
    refNumbers = refNumbers.join(',');
    return refNumbers
  }
  const checkboxRefs = useRef([]);
  const clearCheckboxes = () => {
    checkboxRefs.current.forEach((ref) => {
      if (ref) ref.checked = false;
    });
    setCcIds([])
    setCcactivities([])
    setSelectedMultiDocs([])
  };

  const clearbtnfunc = () => {
    clearCheckboxes()
    dispatch({
      type: "CC_IDS",
      cc_ids: [],
    });
    dispatch({
      type: "REF_NUMS",
      ref_nos: [],
    });
    dispatch({
      type: "CC_Activities",
      activities: [],
    });
    setCcIds([]);
    setCcReferenceNumbers([]);
    setShowButton(false);
  }

  const handleCustomConfirmHandler = () => {
    if ((subModuleType === "commercialCertificate" || moduleType == "internalcertificate")) {
      if (isDownLoadPopup) {
        handleDownloadCertificateAfterPublish(Clickedrow)
      }
      else {
        handleTransferCertificateOwnershipHandler(ccIds, customFormData, getAllListingData, setIsCustomPopup, clearbtnfunc, setIsOverlayLoader, moduleType)
      }
    }
    else if (moduleType === "purchase") {
      getAllListingDataExports(customFormData, 1)
    }
    else if (moduleType === "jobCosting") {
      handleCancelRemarkFunck(customFormData, setIsOverlayLoader, navigate, currentActiverow, getAllListingData)
    }

  }
  const checkDashboardViewIcon = (header, row) => {
    let isShow = true;
    if (moduleType === "dashboard") {
      if (header?.name == "certificate_status") {
        if (row?.certificate_status == "Not Published") {
          isShow = false;
        }
      }
      else if (header?.name == "invoice_status") {
        if (row?.invoice_status == "Not Invoiced") {
          isShow = false;
        }
      }
    }
    return isShow
  }
  const redirectToExternalLink = (header, row) => {
    if (moduleType === "dashboard") {
      let cc_refencenumber = "";
      if (header?.name == "certificate_status") {
        // if (row?.certificate_status == "Not Published") {
        //   toast.error("This reference number does not have any certificate.", {
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
        cc_refencenumber = "cc_refencenumber"
        if (["LR"].includes(user?.role) || section.isLMSDashboard) {
          // cc_refencenumber = 'ic_refenence';
          navigate(`/testReport/previewPDF/${encryptDataForURL(row["ic_id"])}` + "?ReferenceNo=" +
            encryptDataForURL(row?.jrf_referenceno));
          return
        }
      }
      else if (header?.name == "invoice_status") {
        // if (row?.invoice_status == "Not Invoiced") {
        //   toast.error("This reference number does not have any invoice.", {
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
        cc_refencenumber = "iv_jireference"
      }
      let refNo = row['ji_reference_number']
      if (["LR"].includes(user?.role) || section.isLMSDashboard) {
        refNo = row['jrf_referenceno']
      }
      navigate(header.redirectLink + `?filterList=${encryptDataForURL(
        cc_refencenumber + '-' + refNo
      )}`)
    }
  }
  const trTdBGColorClass = (row) => {
    const colorKey = row?.[section?.bgFieldName];
    let statusColor = section?.bgColors?.[colorKey]?.class
    if (kpiValue) {
      statusColor = section?.bgColors?.[kpiValue]?.class
    }
    return statusColor || ''
  }
  function capitalizeFirstLetter(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const RowColorLegend = () => {
    return (
      <div className="dashboard-list legend-box">
        {
          Object.keys(section?.bgColors).map((color, key) => {
            const { class: colorClass, description, title, icon } = section.bgColors[color] || {};

            return (
              <div className={`legend-item ${kpiValue === color ? "header_table_status_item_active" : ""}`} key={key} title={description} onClick={() => handleStatus(color)}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className={`color-indicator ${colorClass}`} >{icon ? (<i class={icon}></i>) : title}</span>
                  {/* <span className={`color-indicator ${colorClass}`} >{title}</span> */}
                  {/* <strong>{capitalizeFirstLetter(color)}</strong> */}
                </div>
                {/* {description && (
                  <div style={{ marginLeft: "24px", fontSize: "11px", color: "#555" }}>
                    {description}
                  </div>
                )} */}
              </div>
            );
          })
        }

      </div>
    );
  };
  // return null
  const isNotificationShow = !["commercialCertificate", "invoice", 'PaymentDetails'].includes(subModuleType) && user?.role !== "SU" && !["jobCosting", "auditBranchExpenses", "auditOutstanding", "auditSalesRegister", "tender", "purchaseReq", "purchase", "supplier", "calibration", "stocks", "dashboard", "incentives", "feedback", 'purchaseItems', 'userMaster', 'category', 'ClientDetails', 'PaymentDetails'].includes(moduleType)
  const checkinvoicecondition = (row) => {
    let isCheckShow = false;
    if ((subModuleType == "commercialCertificate" && ["BU"].includes(user?.logged_in_user_info?.role)) || (moduleType == "internalcertificate" && user?.logged_in_user_info?.role === "LR")) {
      if (['publish', 'published'].includes(row["status"])) {
        if (moduleType == "internalcertificate") {
          if (row?.fk_invoice_branchid === null) {
            isCheckShow = true
          }
          else if (row?.ic_is_external_jrf) {
            if (!row?.ic_certificate_transfered_to_user || user?.logged_in_user_info?.usr_id == row?.ic_certificate_transfered_to_user?.usr_id) {
              isCheckShow = true
            }
          }
        }
        else if (subModuleType == "commercialCertificate") {
          if (row?.ic_iv_status === null) {
            isCheckShow = true
          }
          else if ((!row?.fk_certificate_transfered_to && user?.logged_in_user_info?.usr_id == row?.useropsexecutive?.usr_id) || user?.logged_in_user_info?.usr_id == row?.fk_certificate_transfered_to) {
            isCheckShow = true
          }
        }
      }
    }
  }
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  return (
    <div key={sectionIndex} className="row my-2 mx-0 renderList_header_table">
      {
        // moduleType !== "jobinstruction"
        !(['confirugationCertificate', 'purchaseItems', 'userMaster', 'ClientDetails'].includes(moduleType) || ['PaymentDetails'].includes(subModuleType)) && (
          <div className="header_table_section collepse_main_section">
            <div
              className="d-flex justify-content-between align-items-center mb-2 collpse_toggle"
              style={{ cursor: "pointer" }}
              onClick={() => setIsLegendOpen(!isLegendOpen)}
            >
              <h2 className="m-0" >Status Overview</h2>
              {isLegendOpen
                ? <i className="bi bi-chevron-up"></i>
                : <i className="bi bi-chevron-down"></i>
              }
            </div>
            <Collapse in={isLegendOpen}>
              <div className={`header_table  ${['dashboard'].includes(moduleType) && 'dashboardList-kpi-class'}`}>
                <Row>
                  <Col xs={isNotificationShow ? 9 : 12}>
                    <div className="header_table_box1">
                      {getAlstatusesNames()?.map((jrfStatus, jrfStatusIndex) => (
                        <div
                          className={
                            ` ${["auditSalesRegister", "auditBranchExpenses", "auditOutstanding"].includes(moduleType)
                              ? "header_table_status_item_audit"
                              : "header_table_status_item"}
                          ${kpiValue === jrfStatus.name && !['dashboard'].includes(moduleType) ? "header_table_status_item_active" : ""}`
                          }

                          key={"jrf-status" + jrfStatusIndex}
                          // onClick={() => handleStatus(jrfStatus.name.toLowerCase())}
                          onClick={() => !['dashboard'].includes(moduleType) && !jrfStatus.isNotClickable ? handleStatus(jrfStatus.name) : null}
                          style={['dashboard'].includes(moduleType) || jrfStatus.isNotClickable ? { "cursor": "unset" } : null}
                          title={getFilteredStatusCount(jrfStatus.name, jrfStatus)}
                        >

                          {jrfStatus.image ? (
                            <img
                              src={getImageObject(jrfStatus.image)}
                              alt="jrf Icon"
                            />
                          ) : (
                            // <i className={jrfStatus.icon + " list_icon"}></i>
                            <img src={PartialIcon} alt="jrf Icon" />
                          )}
                          <div className={"header_table_status_count " + (jrfStatus.label === "Invoice Not Initiated" && " header_table_status_count_danger")}>

                            {/* <p>{formatCurrency(getFilteredStatusCount(jrfStatus.name, jrfStatus))}</p> */}
                            <p>{jrfStatus?.isSmallValue ? formatCurrency(getFilteredStatusCount(jrfStatus.name, jrfStatus)) : getFilteredStatusCount(jrfStatus.name, jrfStatus)}</p>
                            <div>{jrfStatus.description || jrfStatus.label}</div>
                          </div>
                        </div>
                      ))}
                      {/* {['dashboard'].includes(moduleType) && <div
                    className={
                      `header_table_status_item dashboard-list-legend`
                    }>
                    {RowColorLegend()}
                  </div>} */}
                    </div>

                    <div className="status-dropdown">
                      <select className="form-control rounded-2">
                        {statusesWithIcon?.map((jrfStatus, jrfStatusIndex) => (
                          <option
                            key={"jrf-status" + jrfStatusIndex}
                            value={jrfStatus.name}
                          >
                            <div
                              className="header_table_status_item"
                              key={"jrf-status" + jrfStatusIndex}
                            >
                              {jrfStatus.image ? (
                                <img
                                  src={getImageObject(jrfStatus.image)}
                                  alt="jrf Icon"
                                />
                              ) : (
                                // <i className={jrfStatus.icon + " list_icon"}></i>
                                <img src={PartialIcon} alt="jrf Icon" />
                              )}
                              <p>{getHeaderTileConditonWise(jrfStatus)}</p>
                              {/* <p>{jrfStatus.label}</p> */}


                              <div> ({getFilteredStatusCount(jrfStatus.name)})</div>
                            </div>
                          </option>
                        ))}
                      </select>
                    </div>

                  </Col>
                  {/* i hv removed this condition for show notification
              && !["jobCosting", "auditBranchExpenses", "auditOutstanding", "auditSalesRegister", "tender", "purchaseReq", "purchase", "supplier", "calibration", "stocks","dashboard", "incentives", "feedback"].includes(moduleType)  */}
                  {isNotificationShow && <Col xs={3} className="header_table_box2_width">
                    <div className="header_table_box2">
                      <h3>Overall Notifications</h3>
                      <ul>
                        {allNotifications
                          .slice(0, 3)
                          .map((notification, notificationIndex) => (
                            <li key={"notification" + notificationIndex}>
                              {notification.message}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </Col>}
                </Row >
              </div >
            </Collapse>
          </div>
        )
      }
      <div className={`renderList_table_container ${['dashboard'].includes(moduleType) && 'dashboardList-table-class'}`}>
        <div className="renderList_table" ref={divRef}>
          <div className={"renderList_table_heading my-2"}>
            <h2>
              {section.isCustomTitle ? section.title : Array.isArray(formConfig?.breadcom) &&
                formConfig.breadcom.length > 0
                ? formConfig.breadcom[formConfig.breadcom.length - 1].title
                : ""}
            </h2>

            <div className={`renderList_sub_table_heading dropdownSticky ${moduleType === "purchaseReq" ? "purchase-sub-table-heading" : ""}`}>
              {['dashboard'].includes(moduleType) && <div
                className={
                  `dashboard-list-legend`
                }>
                <span>Click icon to filter</span>
                {RowColorLegend()}
              </div>}
              {section.isCustomFilter && getCommonFieldsForFilter()}
              {isFiltered && (
                <button
                  type="button"
                  className="searchby_button clearBtnList"
                  onClick={() => clearFilterData()}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <div className="tableContainer">
            {loadingTable ? (
              <Loading />
            ) :
              <table className={"table table-white responsive borderless no-wrap align-middle list mainRenderList " + (subModuleType == "invoice" ? "minWidthTh " : "minWidthTh ") + (["dashboard"].includes(moduleType) ? "dashboardList " : null)}>
                <thead>
                  {/* 
                  Author : Yash Darshankar
                  Date : 22/01/2025
                  Description: According to Latest UI Disussions
                */ }

                  <tr>
                    {/* {
                    ["purchaseReq", "supplier", "calibration", "purchase", "tender"].includes(moduleType) && <th>Sr. No.</th>
                  } */}
                    {
                      // ['dashboard'].includes(moduleType) && <th className="sr_no_th">Sr. No.</th>
                    }
                    {section.headers?.map(
                      (header, headerIndex) =>
                        checkIsShow(header.name, header) && (
                          <th
                            key={"HeaderIndex -" + headerIndex}
                            style={{ textAlign: header?.textAlign || ((header?.label === "Status" && header?.name !== "dashboard_status") ? "center" : "left") }}
                            colSpan={header.colSpan ?? 1}
                            onClick={() =>
                              !header.isNoSort ? handleClick(headerIndex, header?.sortName) : null
                            }
                            className={user?.role !== "CU" && ` ${moduleType === "internalcertificate" && header?.label === "Status" && user?.logged_in_user_info?.role === "LR" ? "ic_status" : header?.label === "Status" || (header?.label === "Tender Final Status" && moduleType === "tender" && header?.name !== "dashboard_status") ? "statusHeader" : " "}` + ((subModuleType == "commercialCertificate") &&
                              user?.logged_in_user_info?.role === "BU" ? " ext_status" : " ") + (header?.isCustomLink && " custom-link-class" || '') + (header.customClass ? header.customClass : '')}
                          >
                            {getHeaderTileConditonWise(header)}
                            {
                              !header.isNoSort &&
                              <span className="table_header_icon">
                                {sortStates[headerIndex] ? (
                                  <i className="bi bi-caret-up-fill"></i>
                                ) : (
                                  <i className="bi bi-caret-down-fill"></i>
                                )}
                              </span>
                            }
                          </th>
                        )
                    )}
                    {((subModuleType == "commercialCertificate" && ["BU"].includes(user?.logged_in_user_info?.role)) || (moduleType == "internalcertificate" && ["LR"].includes(user?.logged_in_user_info?.role))) ?

                      <th className={`statusHeader ${moduleType === "internalcertificate" || subModuleType == "commercialCertificate" && user?.logged_in_user_info?.role === "BU" ? "stickyColForIC" : ""}`}> Select for Inv.</th> :
                      null
                    }
                    {!["dashboard", "feedback"].includes(moduleType) && !(["PaymentDetails", 'invoice'].includes(subModuleType) && user?.logged_in_user_info?.role === "CU") ? <th className={` ${moduleType === "internalcertificate" && user?.logged_in_user_info?.role === "LR" || subModuleType == "commercialCertificate" && user?.logged_in_user_info?.role === "BU" ? "actionColForIntCert" : moduleType === "internalcertificate" && user?.logged_in_user_info?.role !== "LR" ? "actioncolNoLR" : "actioncol list_th_action"}`}>Actions</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {responseData?.data && responseData?.data.length > 0 ? responseData?.data?.map((row, rowIndex) => (
                    <tr
                      key={"rowIndex-" + rowIndex}
                      className={section.isStatusBGTr && trTdBGColorClass(row)}
                    >
                      {
                        // ['dashboard'].includes(moduleType) && <td className="sr_no_td">{((currentPage - 1) * sizeofPage) + ((rowIndex) + 1)}</td>
                        // ['dashboard'].includes(moduleType) && <td className="sr_no_td">{responseData?.count - rowIndex - ((currentPage - 1) * sizeofPage)}</td>
                      }
                      {section.headers?.map((header, index) => {

                        if (!checkIsShow(header.name, header)) {
                          return null;
                        }
                        let cellData = row[header?.name];
                        if (header?.isCustomLink) {
                          let customTitle = ''
                          if (['dashboard'].includes(moduleType)) {
                            if (header.name === 'invoice_status') {
                              customTitle = row?.total_invoice_balance
                            }
                          }
                          return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }} className="exclude-click" title={customTitle}>
                            {checkDashboardViewIcon(header, row) && <button
                              type="button"
                              className={`${moduleType === "dashboard" && ["Cert.", "Inv."].includes(header.label) ? "eyeIcon" : "searchby_button"}`}
                              onClick={() => {
                                redirectToExternalLink(header, row)
                              }}
                            >
                              {
                                moduleType === "dashboard" && ["Cert.", "Inv."].includes(header.label) ?
                                  <div>
                                    <i className={`${header?.customLabel}`}></i>
                                  </div>

                                  :
                                  header?.customLabel
                              }

                            </button> || '--'}
                          </td>;
                        }
                        if (header?.isCustomColor) {
                          const colorKey = Object.keys(header?.statuses).find(key => header?.statuses[key]?.toLowerCase() === row?.[header?.name]?.toLowerCase());
                          let statusColor = section?.customColors.find(item => item.status === colorKey)
                          if (!statusColor) {
                            statusColor = section?.customColors.find(item => item.status === "pending")
                          }
                          return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>
                            <div
                              className={"table_item_sym " + statusColor?.icon + "_bg"}
                              key={"table-item"}
                            >
                              {row?.[header?.name]?.charAt(0).toUpperCase() + row?.[header?.name]?.slice(1)}
                            </div>
                          </td>;
                        }
                        if (moduleType === "internalcertificate") {
                          if (user?.role === "LR") {
                            if (header.name === "ic_created_time") {
                              cellData = row['ic_dateanalysiscompleted'];
                            }
                          }
                        }
                        else if (moduleType === "jobCosting") {
                          if (header.name === "client_name") {
                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>
                              {getCellData(row?.fk_im_id?.client?.cust_name)}
                            </td>;
                          }
                          else if (header.name === "place_of_attendance") {
                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>

                              {getCellData(row?.branch?.br_name
                                ? `${row?.branch?.br_name} (${row?.branch?.br_code})`
                                : "")}
                            </td>
                          }
                          else if (header.name === "commodity") {
                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>

                              {
                                getCellData(Array.isArray(row?.commodity_json) ? row?.commodity_json?.map((commodity) => {

                                  return commodity?.cmd_name
                                }).join(",") : "")
                              }
                              {/* row?.commodity_json.join(",") */}
                              {/* row?.commodity_json?.map((commodity)=>{
                               return commodity?.cmd.name
                            }).join(",") */}
                            </td>
                          }
                          else if (header.name === "reference_number" && moduleType === "jobCosting") {
                            return (
                              <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>

                                {getCellData(
                                  (() => {
                                    try {
                                      const parsedData = JSON.parse(row?.ref_no_data);
                                      return Array.isArray(parsedData) ? parsedData.join(", ") : row?.ref_no_data;
                                    } catch (error) {
                                      return row?.ref_no_data;
                                    }
                                  })()
                                )}

                              </td>
                            );
                          }
                          else if (header.name === "certificate_no" && moduleType === "jobCosting") {
                            return (
                              <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>

                                {getCellData(
                                  (() => {
                                    try {
                                      const parsedData = JSON.parse(row?.certificate_data);
                                      return Array.isArray(parsedData) ? parsedData.join(", ") : row?.certificate_data;
                                    } catch (error) {
                                      return row?.certificate_data;
                                    }
                                  })()
                                )}
                              </td>
                            );
                          }
                        }
                        else if (moduleType === "auditOutstanding") {

                          if (header.name === "monthly_outstanding") {
                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>
                              {getCellData(row?.total_outstanding_amt)}
                            </td>;
                          }
                          else if (header.name === "yearly_outstanding") {
                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>
                              {getCellData(row?.yearly_outstanding)}
                            </td>;
                          }
                          else if (header.name === "ji_date") {
                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>
                              {getDateFromCreatedAt(row?.created_at)}
                            </td>;
                          }

                        }
                        else if (moduleType === "auditSalesRegister") {

                          if (header.name === "monthly_sales") {
                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>
                              {getCellData(row?.final_sales)}
                            </td>;
                          }
                          else if (header.name === "yearly_sales") {
                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>
                              {getCellData(row?.yearly_sales)}
                            </td>;
                          }
                          else if (header.name === "ji_date") {
                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>
                              {getDateFromCreatedAt(row?.created_at)}
                            </td>;
                          }
                        }
                        else if (moduleType === "auditBranchExpenses") {
                          if (header.name === "date") {
                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>
                              {getDateFromCreatedAt(row?.created_at)}
                            </td>;
                          }
                          else if (header.name === "monthly_total") {
                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>
                              {getCellData(row?.monthly_expense)}
                            </td>;
                          }
                          else if (header.name === "yearly_total") {
                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>
                              {getCellData(row?.yearly_expense)}
                            </td>;
                          }
                        }
                        else if (moduleType === "supplier") {

                          if (header.name === "sup_status") {
                            return getStatusNameValue(supStatusMap[row?.sup_status])
                          }

                        }
                        else if (moduleType === "purchaseReq") {
                          if (header.name === "req_status") {
                            return getStatusNameValue(typeof row["req_status"] === "string" ? row["req_status"] : reqStatusMap[row?.req_status])
                          }

                          // else if (header.name === "fk_departmentid") {
                          //   return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>
                          //     {getCellData(departmentMap[row?.fk_departmentid])}
                          //   </td>
                          // }

                          else if (header.name === "fk_branchid") {
                            const branch = row?.branch_details;

                            return (
                              <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>
                                {getCellData(branch ? `${branch?.br_name} (${branch?.br_code})` : "")}
                              </td>
                            );
                          }

                        }
                        else if (moduleType === "purchase") {

                          if (header.name === "po_status") {
                            return getStatusNameValue(row["po_status"])
                          }
                          else if (header.name === "po_requisition_date") {

                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>
                              {getFormatedDate(row?.po_requisition_date, 1, "", header?.isShowColorifPassed)}
                            </td>
                          }
                          else if (header.name === "req_no") {

                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>
                              {getCellData(row?.po_requisition_no)}
                            </td>
                          }
                          else if (header.name === "fk_branchid") {
                            const branch = row?.branch_details;

                            return (
                              <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>
                                {getCellData(branch ? `${branch?.br_name} (${branch?.br_code})` : "")}
                              </td>
                            );
                          }
                          else if (header.name === "po_to") {

                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>{getCellData(row?.fk_supplier_id === row?.supplier_details?.sup_id ? row?.supplier_details?.sup_name : "")}</td>

                          }
                        }
                        else if (moduleType === "stocks") {
                          if (header.name === "stock_status") {
                            return getStatusNameValue(stockStatusMap[row?.stock_status])
                          }
                          else if (header.name === "stock_created_at") {
                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>
                              {getDateFromCreatedAt(row?.stock_created_at)}
                            </td>;
                          }
                          else if (header.name === "stock_item_code") {
                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>
                              {getCellData(row?.item_details?.item_rm_code)}
                            </td>;
                          }
                        }
                        else if (moduleType === "tender") {
                          if (header.name === "tender_contract_period_to") {
                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>
                              {
                                getFormatedDate(row?.tender_contract_period_to, true)
                              }
                            </td>
                          }
                          else if (header.name === "tender_final_status") {

                            return getStatusNameValue(tenderStatusMap[row?.tender_final_status])
                          }
                          else if (header.name === "tender_client_name") {
                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>{getCellData(row?.tender_client_name_details?.cust_name)}</td>
                          }
                          else if (header.name === "tender_contract_period") {
                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>{getCellData(row?.tender_contract_period_to)}</td>
                          }
                          else if (header.name === "tender_submission_date") {
                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>{getColoredDate(row?.tender_submission_date, row?.tender_final_status)}</td>
                          }
                          else if (header.name === "tender_scope_of_work") {
                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>{getCellData(row?.tender_scope_of_work_details?.am_name)}</td>
                          }
                          else if (header.name === "tender_winner_bid") {
                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>{getCellData(row?.tender_bid_amount)}</td>
                          }
                          else if (header.name === "tender_opening_date") {
                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>{getFormatedDate(row?.tender_tender_opening_datetime, 1)}</td>
                          }
                          else if (header.name === "tender_auction_date") {
                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>{getFormatedDate(row?.tender_auction_date, 1)}</td>
                          }
                          else if (header.name === "tender_tenure") {
                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>{getFormatedDate(row?.tender_tenure, 1)}</td>
                          }
                        }
                        else if (moduleType === "dashboard") {
                          if (header.name === "place_of_work") {
                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }} className="exclude-click" title={row['ji_other_placework'] || cellData[header.fieldName]}>
                              {
                                cellData[header.fieldName]
                              }
                            </td>
                          }
                        }
                        else if (moduleType === "incentives") {
                          if (header.name === "incentive_status") {

                            return getStatusNameValue(incentivesStatusMap[row?.incentive_status])
                          }
                          else if (header.name === "incentive_client_id") {
                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>
                              {getCellData(row?.incentive_client_id_details?.cust_name)}
                            </td>;
                          }
                          else if (header.name === "incentive_place_of_work") {
                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>
                              {getCellData(row?.incentive_place_of_work_details?.pow_name)}
                            </td>;
                          }
                          else if (header.name === "incentive_invoice_id") {
                            return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>
                              {getCellData(row?.incentive_invoice_details?.im_invoicenumber)}
                            </td>;
                          }
                        }
                        else if (moduleType === "feedback") {
                          if (header.name === "feedback_status") {
                            return getStatusNameValue(feedbackStatusMap[0])
                          }
                          if (header.name === "feedback_date") {
                            return getDateFromCreatedAt(row?.feedback_created_at)
                          }
                        }
                        else if (moduleType === "calibration") {

                          if (header.name === "calib_status") {
                            return getStatusNameValue(supStatusMap[row?.calib_status])
                          }
                          if (header.name === "calibration_agency") {
                            return <td
                              key={"cellIndex" + index}
                              style={{ textAlign: header?.textAlign || "left" }}
                            >
                              {getCellData(row?.calib_agency)}
                            </td>
                          }

                        }
                        else if (moduleType === "category") {

                          if (header.name === "category_status") {
                            return getStatusNameValue(categoryStatusMap[0])
                          }
                        }
                        // else if (moduleType === "dashboard" && !["im_total", "im_remark", "im_status", "im_is_regular", "iv_jireference"].includes(header.name)) {
                        //   return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>

                        //     {
                        //       getInvoiceDetailsData(row, header.name)
                        //     }
                        //   </td>
                        // }
                        else if (["iv_jireference"].includes(header.name)) {
                          return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>

                            {
                              row[header.name] != "-" ? getCellData(row[header.name]) : getCellData(row["im_remark"])
                            }
                          </td>
                        }
                        else if (["br_code", "fk_invoice_branchid"].includes(header.name)) {
                          return (
                            <td
                              key={"cellIndex" + index}
                              style={{ textAlign: header?.textAlign || "left" }}
                            >
                              {row?.branch.br_code}
                            </td>
                          );
                        }
                        if (header?.fieldName === "status") {
                          return getStatusNameValue(cellData, row);
                        } else if (header.type === "dayCount") {
                          return (
                            <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>
                              {getDayCountFromDate(
                                row[header?.fromdate],
                                row[header?.todate],
                                1
                              )}
                            </td>
                          );
                        }
                        else if (header.type === "statusAgeing") {
                          let fromDateTime = row[header?.todate] || moment()
                          if (['dashboard_ageing'].includes(header.name)) {
                            fromDateTime = row['invoice_ageing']
                            if (fromDateTime && fromDateTime !== "Multi") {
                              let color = "#CC1E29";
                              if (fromDateTime < row['ji_payment_terms']) {
                                color = "#008000";
                              }
                              fromDateTime = Math.abs(fromDateTime)
                              fromDateTime = (<span style={{ color: color }}>
                                {fromDateTime + (fromDateTime > 1 ? " Days" : " Day")}
                              </span>)
                            }
                            else {
                              fromDateTime = fromDateTime || '--'
                            }
                          }
                          else if (header.name === "invoice_ageing") {
                            const ageingDays = parseInt(row?.['ji_data']?.['ji_payment_terms']) || 0
                            fromDateTime = ageingDays ? moment(fromDateTime).add(ageingDays, 'days') : fromDateTime;
                            fromDateTime = getDayCountFromDate(
                              Date.now(),
                              fromDateTime,
                              '',
                              '',
                              1
                            )
                            let color = "#CC1E29";
                            if (fromDateTime >= 0) {
                              color = "#008000";
                            }
                            fromDateTime = Math.abs(fromDateTime)
                            fromDateTime = (<span style={{ color: color }}>
                              {fromDateTime + (fromDateTime > 1 ? " Days" : " Day")}
                            </span>)
                          }
                          else if (header.name === "lms_dashboard_ageing") {
                            const ageingDays = row['jrf_test_repo_req_on']
                            fromDateTime = moment(fromDateTime).add(ageingDays, 'days');
                            fromDateTime = getDayCountFromDate(
                              Date.now(),
                              fromDateTime,
                              '',
                              '',
                              1
                            )
                            let color = "#CC1E29";
                            if (fromDateTime >= 0) {
                              color = "#008000";
                            }
                            fromDateTime = Math.abs(fromDateTime)
                            fromDateTime = (<span style={{ color: color }}>
                              {fromDateTime + (fromDateTime > 1 ? " Days" : " Day")}
                            </span>)
                          }
                          else if (header.name === "ic_ageing") {
                            const ageingDays = row['ic_ageing']
                            fromDateTime = row['ic_ageing'];
                            let color = "#CC1E29";
                            if (fromDateTime >= 0) {
                              color = "#008000";
                            }
                            fromDateTime = Math.abs(fromDateTime)
                            fromDateTime = (<span style={{ color: color }}>
                              {fromDateTime + (fromDateTime > 1 ? " Days" : " Day")}
                            </span>)
                            if (!row?.ic_is_external_jrf) {
                              fromDateTime = "NA"
                            }
                          }
                          else {
                            fromDateTime = getDayCountFromDate(
                              fromDateTime,
                              Date.now(),
                              1,
                              1
                            )
                          }
                          return (
                            <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>
                              {fromDateTime}
                            </td>
                          );
                        }
                        else if (header.name === "im_is_regular") {
                          return (
                            <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>

                              {capitalize(row?.im_is_regular)}
                            </td>
                          );
                        }
                        else if (header.name === "ivd_ref_no") {
                          return (
                            <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>
                              {getCellData(getReferenceNoListFromInvoice(row))}
                            </td>
                          );
                        }
                        else if (header.name === "cust_gstno") {
                          return (
                            <td
                              key={"cellIndex" + index}
                              style={{ textAlign: header?.textAlign || "left" }}
                            >
                              {getCellData(row?.client[header?.name])}
                            </td>
                          );
                        }
                        else if (header.name === "cust_name" && !['ClientDetails'].includes(moduleType)) {
                          return (
                            <td
                              key={"cellIndex" + index}
                              style={{ textAlign: header?.textAlign || "left" }}
                            >
                              {getCellData(row?.client?.[header?.name])}
                            </td>
                          );
                        }
                        else if (header.name === "allotment_detail") {
                          let newCelData = row[header?.name];
                          return (
                            <td
                              key={"cellIndex" + index}
                              title={newCelData[header?.fieldName]}
                              style={{ alignItems: header?.textAlign || "left" }}

                            >
                              {newCelData
                                ? header.type === "date"
                                  ? getFormatedDate(
                                    newCelData[header?.fieldName],
                                    1, "", header?.isShowColorifPassed
                                  )
                                  : getCellData(newCelData[header?.fieldName])
                                : "--"}
                            </td>
                          );
                        } else if (header.name === "allotment_detail") {
                          let newCelData = row[header?.name];
                          return (
                            <td
                              key={"cellIndex" + index}
                              title={newCelData[header?.fieldName]}
                              style={{ textAlign: header?.textAlign || "left" }}
                            >
                              {newCelData
                                ? header.type === "date"
                                  ? getFormatedDate(
                                    newCelData[header?.fieldName],
                                    1, "", header?.isShowColorifPassed
                                  )
                                  : getCellData(newCelData[header?.fieldName])
                                : "--"}
                            </td>
                          );
                        } else if (header.name === "ji_created_by_user") {
                          return (
                            ["BU", "SU"].includes(user?.role) && (
                              <td
                                key={"cellIndex" + index}
                                title={cellData[header?.fieldName]}
                                style={{ textAlign: header?.textAlign || "left" }}
                              >
                                {cellData
                                  ? header.type === "date"
                                    ? getFormatedDate(
                                      cellData[header?.fieldName],
                                      1, "", header?.isShowColorifPassed
                                    )
                                    : getCellData(cellData[header?.fieldName])
                                  : "--"}
                              </td>
                            )
                          );
                        } else if (header.name === "jrf_lab_detail") {
                          return (
                            ["BU", "SU"].includes(user?.role) && (
                              <td
                                key={"cellIndex" + index}
                                title={cellData?.lab_code}
                                style={{ textAlign: header?.textAlign || "left" }}
                              >
                                {getCellData(cellData?.lab_code) || "--"}
                              </td>
                            )
                          );
                        } else if (header.name === "jrf_branch_detail") {
                          return (
                            ["LR", "SU", 'CU'].includes(user?.role) && (
                              <td
                                key={"cellIndex" + index}
                                title={cellData?.br_code}
                                style={{ textAlign: header?.textAlign || "left" }}
                              >
                                {getCellData(cellData?.[header.fieldName || 'br_code']) || "--"}{(header.fieldName2 && cellData?.[header?.fieldName2] ? ` (${cellData?.[header?.fieldName2]})` : '')}
                              </td>
                            )
                          );
                        } else if (header.name === "tm_jrf_date") {
                          let newCelData = row["jrf_detail"];
                          return (
                            <td key={"index" + index} style={{ textAlign: header?.textAlign || "left" }}>
                              {getFormatedDate(newCelData?.jrf_date, 1, "", header?.isShowColorifPassed)}

                            </td>
                          );
                        } else if (header.name === "test_memo_detail") {
                          let newCelData = row[header?.name];
                          if (header.fieldName === "commodity") {
                            return (
                              <td
                                key={"cellIndex" + index}
                                title={newCelData?.commodity?.cmd_name}
                                style={{ textAlign: header?.textAlign || "left" }}
                              >
                                {newCelData?.commodity
                                  ? getCellData(newCelData?.commodity?.cmd_name)
                                  : "--"}
                              </td>
                            );
                          } else {
                            return (
                              <td
                                key={"cellIndex" + index}
                                title={newCelData[header?.fieldName]}
                                style={{ textAlign: header?.textAlign || "left" }}
                              >
                                {newCelData
                                  ? header.type === "date"
                                    ? getFormatedDate(
                                      newCelData[header?.fieldName],
                                      1, "", header?.isShowColorifPassed
                                    )
                                    : getCellData(newCelData[header?.fieldName])
                                  : "--"}
                              </td>
                            );
                          }
                        } else if (header?.type === "date") {
                          let newCelData = row[header?.name];
                          if (typeof newCelData === "object") {
                            if (newCelData) {
                              newCelData = newCelData[header?.fieldName] || ''
                            }
                            else {
                              newCelData = ''
                            }
                          }
                          return (
                            <td key={"index" + index} style={{ textAlign: header?.textAlign || "left" }}>
                              {getFormatedDate(newCelData, 1, "", (header.name === "tm_datecompletion" && ['certified', 'verified'].includes(row['status']) ? "" : header?.isShowColorifPassed))}
                            </td>
                          );
                        } else if (typeof cellData === "string") {

                          if (header.isHTMLText) {
                            cellData = cellData.replace(/<[^>]*>/g, "");
                            cellData = cellData.replace(/&nbsp;/g, " ").trim();
                          }
                          return (
                            <td
                              key={"cellIndex" + index}
                              title={
                                header.type === "date"
                                  ? getFormatedDate(cellData, 1, "", header?.isShowColorifPassed)
                                  : cellData
                              }
                              style={{ textAlign: header?.textAlign || "left" }}
                            >
                              {header.type === "date"
                                ? getFormatedDate(cellData, 1, "", header?.isShowColorifPassed)
                                : getCellData(cellData, header)}
                            </td>
                          );
                        } else if (
                          [
                            "jrf_commodity_detail",
                            "smpl_commodity_detail",
                            "commodity",
                            "commodity_detail",
                            "commodity_details",
                            "commodity_details",
                          ].includes(header.name)
                        ) {
                          return (
                            <td
                              key={"cellIndex" + index}
                              title={cellData?.cmd_name}
                              style={{ textAlign: header?.textAlign || "left" }}
                            >
                              {getCellData(cellData?.cmd_name) || "--"}
                            </td>
                          );
                        } else if (
                          [
                            "sub_commodity",
                          ].includes(header.name)
                        ) {
                          return (
                            <td
                              key={"cellIndex" + index}
                              title={cellData?.sub_cmd_name}
                              style={{ textAlign: header?.textAlign || "left" }}
                            >
                              {getCellData(cellData?.sub_cmd_name) || "--"}
                            </td>
                          );
                        } else if (["client_details"].includes(header.name)) {
                          return (
                            <td
                              key={"cellIndex" + index}
                              title={cellData?.client_name}
                              style={{ textAlign: header?.textAlign || "left" }}
                            >
                              {getCellData(cellData?.client_name) || "--"}
                            </td>
                          );
                        } else if (["supplier"].includes(header.name)) {
                          return (
                            <td
                              key={"cellIndex" + index}
                              title={cellData?.supplier_name}
                              style={{ textAlign: header?.textAlign || "left" }}
                            >
                              {getCellData(cellData?.supplier_name)}
                            </td>
                          );
                        } else if (header.name === "inward_detail") {
                          let newCelData = row[header?.name];
                          if (typeof newCelData === "object") {
                            if (newCelData) {
                              newCelData = header?.fieldName ? newCelData[header?.fieldName] || '' : newCelData['smpl_inward_number']
                            }
                            else {
                              newCelData = ''
                            }
                          }
                          return (
                            <td
                              key={"cellIndex" + index}
                              title={cellData.smpl_inward_number}
                              style={{ textAlign: header?.textAlign || "left" }}
                            >
                              {cellData
                                ? getCellData(newCelData)
                                : "-"}
                            </td>
                          );
                        } else if (header.name === "allotment_number") {
                          return (
                            <td key={"cellIndex" + index} title={cellData[0]} style={{ textAlign: header?.textAlign || "left" }}>
                              {cellData ? getCellData(cellData[0]) : "-"}
                            </td>
                          );
                        } else if (header.name === "sample_allotedto_data") {
                          return (
                            <td
                              key={"cellIndex" + index}
                              title={cellData.first_name + " " + cellData.last_name}
                              style={{ textAlign: header?.textAlign || "left" }}
                            >
                              {cellData
                                ? getCellData(
                                  cellData.first_name + " " + cellData.last_name
                                )
                                : "-"}
                            </td>
                          );
                        } else if (header.name === "inward_detail") {
                          return (
                            <td
                              key={"cellIndex" + index}
                              title={cellData.smpl_inward_number}
                              style={{ textAlign: header?.textAlign || "left" }}
                            >
                              {getCellData(cellData.smpl_inward_number)}
                            </td>
                          );
                        } else if (header.name === "operation_type") {
                          return (
                            <td
                              key={"cellIndex" + index}
                              title={cellData?.[header.fieldName]}
                              style={{ textAlign: header?.textAlign || "left" }}
                            >
                              {getCellData(cellData?.[header.fieldName], header)}
                            </td>
                          );
                        } else if (header.name === "branch") {
                          return (
                            <td
                              key={"cellIndex" + index}
                              title={cellData[header.fieldName]}
                              style={{ textAlign: header?.textAlign || "left" }}
                            >
                              {cellData
                                // ? getCellData(cellData[header.fieldName])
                                ? getCellData(cellData[header?.fieldName]) + (header.fieldName2 && cellData?.[header?.fieldName2] ? `(${cellData[header?.fieldName2]})` : '')
                                : "-"}
                            </td>
                          );
                        } else if (['company', 'jrf_company_detail'].includes(header.name)) {
                          return (
                            <td
                              key={"cellIndex" + index}
                              title={cellData[header.fieldName]}
                              style={{ textAlign: header?.textAlign || "left" }}
                            >
                              {
                                header.name === "jrf_company_detail" && row['jrf_is_external'] ? row['jrf_ext_orgnizationname'] : ['cmp_code', 'company_code'].includes(header.fieldName)
                                  ? getComonCodeForCompany(cellData[header.fieldName])
                                  : getCellData(cellData[header.fieldName])
                              }
                            </td>
                          );
                        } else {
                          let newCelData = row[header?.name];
                          if (typeof newCelData === "object") {
                            if (newCelData) {
                              newCelData = newCelData[header?.fieldName] || ''
                            }
                            else {
                              newCelData = ''
                            }
                          }
                          if (header.type === "boolean") {
                            newCelData = newCelData ? "Yes" : "No"
                          }
                          return <td key={"cellIndex" + index} style={{ textAlign: header?.textAlign || "left" }}>{newCelData
                            ? header.type === "date"
                              ? getFormatedDate(
                                newCelData,
                                1, "", header?.isShowColorifPassed
                              )
                              : getCellData(newCelData, header)
                            : "--"}</td>;
                        }
                      })}

                      {subModuleType == "commercialCertificate" && ["BU"].includes(user?.logged_in_user_info?.role) || (moduleType == "internalcertificate" && user?.logged_in_user_info?.role === "LR") ?
                        (row["status"] === "published" || row["status"] === "publish") &&
                          ((row?.fk_invoice_branchid === null) ||
                            (
                              row?.ic_is_external_jrf &&
                              (moduleType == "internalcertificate" && ["LR"].includes(user?.logged_in_user_info?.role) && ((!row?.ic_certificate_transfered_to_user || user?.logged_in_user_info?.usr_id == row?.ic_certificate_transfered_to_user?.usr_id)))))
                          && (row?.ic_iv_status === null || (subModuleType == "commercialCertificate" && ["BU"].includes(user?.logged_in_user_info?.role) && ((!row?.fk_certificate_transfered_to && user?.logged_in_user_info?.usr_id == row?.useropsexecutive?.usr_id) || user?.logged_in_user_info?.usr_id == row?.fk_certificate_transfered_to)))
                          ?
                          <td className={`${moduleType === "internalcertificate" && user?.logged_in_user_info?.role === "LR" || subModuleType == "commercialCertificate" && user?.logged_in_user_info?.role === "BU" ? "stickyColForIC" : moduleType === "internalcertificate" && user?.logged_in_user_info?.role !== "LR" || subModuleType == "commercialCertificate" && user?.logged_in_user_info?.role !== "BU" ? "stickyColForICNonLR" : moduleType === "dashboard" ? "" : "list_th_action status-stickycol"}`}>
                            <input
                              ref={(el) => (checkboxRefs.current[rowIndex] = el)}
                              type="checkbox"
                              onChange={(e) => handleMultiFile(e, row, "cc_id")}
                              checked={moduleType == "internalcertificate" ? ccIds.includes(row.ic_id) : ccIds.includes(row.cc_id)}
                            // disabled={ccIds.length > 0 && (moduleType == "internalcertificate" && ["LR"].includes(user?.logged_in_user_info?.role)) && !ccIds.includes(row.ic_id)}
                            />
                          </td>
                          :
                          <td className={`${moduleType === "internalcertificate" && user?.logged_in_user_info?.role === "LR" || subModuleType == "commercialCertificate" && user?.logged_in_user_info?.role === "BU" ? "stickyColForIC" : moduleType === "dashboard" ? "" : "list_th_action status-stickycol"}`}>{`${moduleType === "internalcertificate" && !row.ic_is_external_jrf ? 'NA' : ''}`}</td>
                        :
                        null
                      }

                      {!["dashboard", "feedback"].includes(moduleType) && !(["PaymentDetails", 'invoice'].includes(subModuleType) && user?.logged_in_user_info?.role === "CU") && <td className={`${moduleType === "internalcertificate" && user?.logged_in_user_info?.role === "LR" || subModuleType == "commercialCertificate" && user?.logged_in_user_info?.role === "BU" ? "actionColForIntCert" : "list_th_action actioncol"} ` + (popupIndex === rowIndex && " actionColActive")} ref={popupRef}>
                        <div className="renderListButtonDiv">

                          <span ref={popupOptionsRef}>
                            {popupIndex === rowIndex ? (
                              <PopupOptions
                                section={section}
                                popupActions={filteredAction}
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
                                setIsOverlayLoader={setIsOverlayLoader}
                                from={subModuleType == "commercialCertificate" ? "subListTable" : ""}
                              />
                            ) : null}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              popupIntentionallyOpenedRef.current = true;
                              setTimeout(() => {
                                AutoScrollHeight('.tableContainer', '.mainRenderList', popupIndex === rowIndex ? -1 : rowIndex);
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

                          {actions?.length > 0 && !["feedback"].includes(moduleType) && <div className="listActionBtns">
                            <ListingActionButton
                              actions={actions}
                              status={getStatus(formConfig, row)}
                              user={user}
                              moduleType={["invoice"].includes(subModuleType) ? subModuleType : moduleType}
                              jrf_id={
                                moduleType === "sampleinward"
                                  ? row["smpl_jrf_id"]
                                  : moduleType === "internalcertificate"
                                    ? row["ic_id"]
                                    : row["jrf_id"]
                              }
                              sampleInwardFormId={row["smpl_inwrd_id"]}
                              row={row}
                              formConfig={formConfig}
                              setIsRejectPopupOpen={setIsRejectPopupOpen}
                              setIsPopupOpen={setIsPopupOpen}
                              setJRFCreationType={setJRFCreationType}
                              model={responseData.model}
                              isBottom={isBottom}
                              setDontClick={setDontClick}
                              setIsOverlayLoader={setIsOverlayLoader}
                              handleSubmit={handleSubmit}
                              setFormData={setFormData}
                              formData={formData}
                              setSubTableData={setSubTableData}
                              setIsCustomPopup={setIsCustomPopup}
                              setCurrentActiverow={setCurrentActiverow}
                            />
                          </div>}
                          {subModuleType === "commercialCertificate" && ['BH', 'BU', 'CP'].includes(user?.logged_in_user_info?.role) && (['CP', 'BH'].includes(user?.logged_in_user_info?.role) || user?.logged_in_user_info?.usr_id == row?.useropsexecutive?.usr_id) &&
                            < div className="listActionBtns">
                              {
                                <div className="actionColumn maxWidth d-flex confirugationListActionColumn">
                                  {[
                                    // "saved",
                                    "sent_for_approval",
                                    // "posted",
                                  ].includes(row["status"]) &&
                                    (user?.logged_in_user_info?.role === "CP" || (user?.logged_in_user_info?.role === "BH" && (!row?.branch_captain?.usr_id || ![getVesselOperation('TML'), getVesselOperation('VL_TML_M')].includes(getActivityCode(row?.activity_code).toLowerCase())))) && (
                                      <button
                                        type="button"
                                        className="iconBtn"
                                        onClick={() => ApproveCertificate(row)}
                                      >
                                        Approve Certificate
                                      </button>
                                    )}
                                  {['saved', 'rejected'].includes(row["status"]) &&
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
                                        }
                                        }
                                      >
                                        Download
                                      </button>
                                    )}
                                </div>
                              }
                            </div>
                          }

                        </div>
                      </td>}
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={section.headers.length + 2} className="text-center py-3">
                        No data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>}
          </div>


          {(subModuleType === "commercialCertificate" || moduleType == "internalcertificate") && showButton && (
            <div className="certificateBtns">
              <button
                type="button"
                className="saveBtn"
                onClick={() => clearbtnfunc()}
              >Clear Selection
              </button>
              <button
                type="button"
                className="submitBtn certificateiconBtn"
                onClick={() => {
                  dispatch({
                    type: "CC_IDS",
                    cc_ids: ccIds,
                  });
                  dispatch({
                    type: "REF_NUMS",
                    ref_nos: ccReferenceNumbers,
                  });
                  dispatch({
                    type: "CC_Activities",
                    activities: ccactivities,
                  });
                  navigate("/operation/invoice-listing/create-invoice" + (moduleType == "internalcertificate" ? `?type=${encryptDataForURL("IC")}` : `?type=${encryptDataForURL("CC")}`))
                }}
              >
                <div className="createinvoice-btn">
                  <span> + Create Invoice</span>
                </div>
              </button>
              {
                // moduleType !== "internalcertificate" && 
                (<button
                  type="button"
                  className="submitBtn certificateiconBtn"
                  onClick={() => {
                    setIsCustomPopup(true)
                  }}
                >
                  <div className="createinvoice-btn">
                    <span>Transfer Certificate</span>
                  </div>
                </button>)
              }

            </div>
          )
          }
          {
            isCustomPopup && <CustomPopupModal isCustomPopup={isCustomPopup} setIsCustomPopup={setIsCustomPopup} handleConfirm={() => handleCustomConfirmHandler()} formData={customFormData} setFormData={setCustomFormdata} section={isDownLoadPopup ? section.customField2 : section.customField} filterMasterOptions={filterMasterOptions} />
          }
        </div>
        <div className="previous_next_btns">
          <TablePagination
            totalPages={totalPage}
            currentPage={currentPage}
            onPageChange={handlePaginationButton}
            onPageSizeChange={onPageSizeChange}
            sizeofPage={sizeofPage}
            moduleType={moduleType}
          />
        </div>
      </div>
    </div >
  )
};

RenderListSection.propTypes = {
  section: PropTypes.string,
  sectionIndex: PropTypes.number,
  actions: PropTypes.arrayOf(PropTypes.object),
  responseData: PropTypes.object,
  getAllListingData: PropTypes.func,
  formConfig: PropTypes.object,
  statusCounts: PropTypes.array,
  setIsRejectPopupOpen: PropTypes.func,
  setJRFCreationType: PropTypes.func,
  setIsPopupOpen: PropTypes.func,
  loadingTable: PropTypes.bool,
  setIsOverlayLoader: PropTypes.func,
};

export default RenderListSection;
