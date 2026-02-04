import { useNavigate } from "react-router-dom";

import { encryptDataForURL } from "../../utills/useCryptoUtils";

import { GetTenantDetails, postDataFromApi } from "../../services/commonServices";

import { getOperationActivityListPageUrl, getOperationActivityUrl, getPurchaseManager } from "../../services/commonFunction";

import { useDispatch } from "react-redux"

import { toast } from "react-toastify";

import { useTranslation } from "react-i18next";

import { handleFormSave } from "./commonHandlerFunction/JRFHandlerFunctions";

const ListingActionButton = ({

  status,

  actions,

  user,

  moduleType,

  jrf_id,

  sampleInwardFormId,

  row,

  setIsRejectPopupOpen,

  setJRFCreationType,

  setIsPopupOpen,

  setIsOverlayLoader,

  handleSubmit,

  setFormData,

  formData,

  setSubTableData,

  setIsCustomPopup,

  setCurrentActiverow,

  formConfig

}) => {


  const { t }

    = useTranslation();

  const translate = t;

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const actionBtnList = {

    jrf: [

      {

        btnStatus: "posted",

        label: "Verify Checklist",

        status: "checklist",

        btnshortName: "verifyCheckList",

      },

      {

        btnStatus: "accepted",

        label: "Sample Inward",

        status: "inward",

        btnshortName: "sampleInward",

      },

      {

        btnStatus: "completed",

        label: "Test Report",

        status: "testReport",

        btnshortName: "testReport",

      },

      {

        btnStatus: "rejected",

        label: "Update",

        status: "rejected",

        btnshortName: "Edit",

      },

      {

        btnStatus: "saved",

        label: "Update",

        status: "saved",

        btnshortName: "Saved",

      },

    ],
    internalcertificate: [

      {

        btnStatus: "dtm-approved",

        label: "Verify",

        status: "verifyByTm",

        btnshortName: "verifyByTm",

      },

      {

        btnStatus: "pending",

        label: "Verify",

        status: "verifyByDTM",

        btnshortName: "verifyByDTM",

      },

      {

        btnStatus: "tm-approved",

        label: "Publish",

        status: "publishBtn",

        btnshortName: "publishBtn",

      },

      {

        btnStatus: "dtm-reject",

        label: "Update",

        status: "dtmReject",

        btnshortName: "dtmReject",

      },

      {

        btnStatus: "tm-reject",

        label: "Update",

        status: "tmReject",

        btnshortName: "tmReject",

      },

    ],

    jobinstruction: [

      {

        btnStatus: "saved",

        label: "Scope Of Work",

        status: "saved",

        btnshortName: "saved",

      },

      {

        btnStatus: "created",

        label: "Analysis",

        status: "created",

        btnshortName: "created",

      },

      {

        btnStatus: "pre-analysis",

        label: "Analysis",

        status: "pre-analysis",

        btnshortName: "pre-analysis",

      },

      {

        btnStatus: "analysis",

        label: "Nominate",

        status: "analysis",

        btnshortName: "analysis",

      },

      {

        btnStatus: "rejected",

        label: "Update",

        status: "rejected",

        btnshortName: "rejected",

      },

      {

        btnStatus: "posted",

        label: "Fill DS",

        status: "posted",

        btnshortName: "posted",

      },

    ],

    jioperationjsonb: [

      {

        btnStatus: "posted",

        label: "Verify",

        status: "posted",

        btnshortName: "posted",

      },

      {

        btnStatus: "accepted",

        label: "Process",

        status: "accepted",

        btnshortName: "accepted",

      },

      {

        btnStatus: "saved",

        label: "Edit",

        status: "saved",

        btnshortName: "saved",

      }

    ],

    TPIMain: [

      {

        btnStatus: "created",

        label: "Update",

        status: "created",

        btnshortName: "created",

      },

      {

        btnStatus: "posted",

        label: "Update",

        status: "posted",

        btnshortName: "posted",

      },

    ],


    ShipmentList: [

      {
        btnStatus: "saved",
        label: "Edit",

        status: "saved",

        btnshortName: "saved",

      }

    ],

    marketPlaceListing: [

      {

        btnStatus: "saved",

        label: "Edit",

        status: "saved",

        btnshortName: "saved",

      }

    ],

  };



  const rolesWiseBtnList = {

    jrf: {

      BU: ["testReport", "Edit", "Saved"],

      LR: ["testReport", "verifyCheckList", "sampleInward", "Edit", "Saved"],

      TM: [],

      STM: [],

      QM: [],

      SQM: [],

      SLC: [],

      LC: [],

      DTM: [],

      SU: []

    },
    internalcertificate: {

      BU: [],

      LR: ["publishBtn", "dtmReject", "tmReject"],

      TM: ["verifyByTm", "verifyByDTM"],

      STM: ["verifyByTm"],

      QM: ["verifyByTm"],

      SQM: ["verifyByTm"],

      SLC: ["verifyByDTM"],

      LC: [],

      DTM: ["verifyByDTM"],

      SU: []

    },

    jobinstruction: {

      BU: ["posted", "accepted", "process"],

      LR: [],

      TM: [],

      STM: [],

      QM: [],

      SQM: [],

      SLC: [],

      LC: [],

      DTM: [],

      "OPS_ADMIN": ["posted","saved", "created", "analysis", "pre-analysis", "rejected", "accepted"],

      SU: ['accepted'],

      BH: ['accepted'],

      CP: []

    },

    jioperationjsonb: {

      BU: ["posted", "accepted", "process", "saved"],

      LR: [],

      TM: [],

      STM: [],

      QM: [],

      SQM: [],

      SLC: [],

      LC: [],

      DTM: [],

      "OPS_ADMIN": ["saved", "accepted"],

      BH: [],

      SU: ["accepted"],

      BH: ['accepted'],

      CP: []

    },

    TPIMain: {

      BU: ["created", "posted"],

      LR: [],

      TM: [],

      STM: [],

      QM: [],

      SQM: [],

      SLC: [],

      LC: [],

      DTM: [],

      "OPS_ADMIN": [],

      SU: []

    },
    ShipmentList: {

      SU: ["saved", "posted"],

    },

    marketPlaceListing: {

      SU: ["saved"],

    },

  };



  const getBtnListArray = () => {



    let btnFilteredData = [];

    btnFilteredData = actionBtnList[moduleType].filter((btn) => {



      if (GetTenantDetails(1, 1) === "TPBPL" && moduleType === "allotment" && ['LC', 'SLC', 'DTM'].includes(user?.role)) {

        return false;

      }

      return rolesWiseBtnList[moduleType]?.[user?.role] && rolesWiseBtnList[moduleType]?.[user?.role].map((singlestatus) => singlestatus.toLowerCase()).includes(

        btn.btnshortName.toLowerCase()

      ) || false;

    });

    return btnFilteredData;

  };



  //table Action buttion handler

  const handleOnclick = (action) => {

    console.log("moduleType", moduleType)

    if (moduleType == "jobinstruction") {

      if (action.recordType) {

        navigate(

          action?.redirectUrl +

          "/" +

          encryptDataForURL(row["ji_id"]) +

          "/" +

          encryptDataForURL(action.recordType)

        );

      } else if (action.status === "posted") {

        let redirecturl = getOperationActivityListPageUrl(row["operation_type"]['operation_type_code'])

        redirecturl = redirecturl.replace(/\/([^\/]*)$/, "-$1");

        navigate(

          redirecturl + 'view' +

          "/" +

          encryptDataForURL(row["ji_id"]) +

          "?action=" +

          encryptDataForURL("View") +

          "&status=" +

          encryptDataForURL(action?.status) + `&isFullDetails=${encryptDataForURL(1)}`

        );

      }

      else if (action.status === "accepted") {

        let redirectUrl = getOperationActivityUrl(row["operation_type"]['operation_type_name'])

        navigate(

          redirectUrl +

          encryptDataForURL(row["ji_id"]) +

          "?action=" +

          encryptDataForURL("View") +

          "&status=" +

          encryptDataForURL(action?.status) + "&operationMode=" +

          encryptDataForURL(row?.["operation_type"]?.operation_type_code)

        );

      }

      else {

        if (action.status === "rejected") {

          // localStorage.setItem('isMainScopeWork', '')

          dispatch({

            type: "MAIN_SCOPE_WORK",

            isMainScopeWork: ''

          });

          navigate(action?.redirectUrl + "/" + encryptDataForURL(row["ji_id"]));

        }

        else {

          dispatch({

            type: "MAIN_SCOPE_WORK",

            isMainScopeWork: 1

          });

          navigate(action?.redirectUrl + "/" + encryptDataForURL(row["ji_id"]));

        }

      }

    } else if (moduleType == "jioperationjsonb") {

      console.log("this is callinf ")

      if (action.recordType == 'ds-analysis') {

        navigate(

          action?.redirectUrl +

          "/"

          +

          encryptDataForURL(row["ji_id"]) +

          "/" +

          encryptDataForURL(action.recordType)

        );

      }

      else if (action.status === "accepted") {

        let redirectUrl = getOperationActivityUrl(row["operation_type"]['operation_type_name'])

        navigate(

          redirectUrl +

          encryptDataForURL(row["ji_id"]) +

          "?action=" +

          encryptDataForURL("View") +

          "&status=" +

          encryptDataForURL(action?.status) + "&operationMode=" +

          encryptDataForURL(row?.["operation_type"]?.operation_type_code)

        );

      }

      else if (action.status === "posted") {

        let redirecturl = getOperationActivityListPageUrl(row["operation_type"]['operation_type_code'])

        redirecturl = redirecturl.replace(/\/([^\/]*)$/, "-$1");

        navigate(

          redirecturl + 'view' +

          "/" +

          encryptDataForURL(row["ji_id"]) +

          "?action=" +

          encryptDataForURL("View") +

          "&status=" +

          encryptDataForURL(action?.status) + `&isFullDetails=${encryptDataForURL(1)}`

        );

      }

      else {

        navigate(

          action?.redirectUrl +

          "/" +

          encryptDataForURL(row["ji_id"]) +

          "?action=" +

          encryptDataForURL("View") +

          "&status=" +

          encryptDataForURL(action?.status) + "&operationMode=" +

          encryptDataForURL(row?.["operation_type"]?.operation_type_code)

        );

      }

    } else if (moduleType === "TPIMain") {

      navigate(

        `/operation/vessel-ji-list/other-tpi/${encryptDataForURL(

          row["fk_jiid"]

        )}/${encryptDataForURL("otherTPI")}/${encryptDataForURL(

          row["fk_jis_id"]

        )}/${encryptDataForURL(

          row["tpi_id"]

        )}?OperationType=${encryptDataForURL(

          row["activity_code"]

        )}&operationId=${encryptDataForURL(

          row["fk_jis_id"]

        )}`

      );

    }

    else if (moduleType === "marketPlaceListing") {

      if (action?.label == "Edit") {

        navigate(`/market/marketForm/${encryptDataForURL(

          row["id"]

        )

          }`);

      }



    }

    else if (moduleType === "ShipmentList") {

      if (action?.label == "Edit") {

        navigate(`/shipment/shipmentForm/${encryptDataForURL(

          row["id"]

        )

          }`);

      }



    }

    else {

      if (action?.status == "testReport") {

        // navigate(

        //   action?.redirectUrl +

        //   "/" +

        //   encryptDataForURL(row["internal_certificate_id"])

        // );

        navigate(`/testReport/previewPDF/${encryptDataForURL(row["internal_certificate_id"])}` + "?ReferenceNo=" +

          encryptDataForURL(row?.jrf_referenceno));

        // handleTestReport(row, action);

      } else {

        if (row["jrf_status"] === "saved") {

          if (row["jrf_is_ops"]) {

            navigate(

              "/jrfListing/operation-jrf?status=" +

              encryptDataForURL("Edit") +

              "&id=" +

              encryptDataForURL(jrf_id)

            );

          } else {

            if (row["jrf_is_external"]) {

              navigate(

                "/jrfListing/external-jrf?status=" +

                encryptDataForURL('Edit') +

                "&id=" +

                encryptDataForURL(jrf_id)

              );

            }

            else {

              navigate(

                "/jrfListing/jrf?status=" +

                encryptDataForURL("Edit") +

                "&id=" +

                encryptDataForURL(jrf_id)

              );

            }

          }

        } else if (row["jrf_is_ops"] && row["jrf_status"] === "posted") {

          navigate(

            "/jrfListing/operation-inwardForm-checklist?status=" +

            encryptDataForURL("checklist") +

            "&id=" +

            encryptDataForURL(jrf_id)

          );

        } else if (

          user?.role === "LR" &&

          status === "rejected" &&

          row["jrf_is_external"]

        ) {

          navigate(

            "/jrfListing/external-jrf?status=" +

            encryptDataForURL(action?.status) +

            "&id=" +

            encryptDataForURL(jrf_id)

          );

        }

        else if (

          status === "rejected" &&

          row["jrf_is_ops"]

        ) {

          navigate(

            "/jrfListing/operation-jrf?status=" +

            encryptDataForURL(action?.status) +

            "&id=" +

            encryptDataForURL(jrf_id)

          );

        } else {

          navigate(

            action?.redirectUrl +

            "?status=" +

            encryptDataForURL(action?.status) +

            "&id=" +

            encryptDataForURL(jrf_id)

          );

        }

      }

    }

  };





  const checkRoleBseCondition = (buttonDetails) => {



    if (moduleType === "jrf") {

      if (user?.role === "LR" && status === "rejected") {

        if (!row['jrf_is_external'] && !row['jrf_is_regular']) {

          return false;

        }

        else if (!row['jrf_is_external']) {

          return false;

        }

      }

    }

    else if (moduleType === "allotment") {

      if (user?.role === "DTM") {

        if (user?.logged_in_user_info?.usr_id !== row['sa_sampleallottedto']) {

          return false;

        }

      }

      else if (user?.role === "LC") {

        if (GetTenantDetails(1, 1) === "TPBPL") {

          return false;

        }

      }

    }

    else if (['jobinstruction', 'jioperationjsonb'].includes(moduleType)) {
    }

    else if (moduleType === "jobCosting") {

      if (['cancelled'].includes(buttonDetails.btnshortName) && row?.fk_im_id?.im_is_jc_comment) {

        return false;

      }

    }

    else if (moduleType === "purchase") {

      if (['posted', 'Pre-Close'].includes(buttonDetails.btnshortName) && row?.fk_approval_id !== user?.logged_in_user_info?.usr_id) {

        return false;

      }

    }

    else if (moduleType === "purchaseReq") {

      if (!getPurchaseManager(moduleType, "change")) {

        if (['saved', 'reject'].includes(buttonDetails.btnshortName)) {

          return false;

        }

      }

      if (['sent for approval'].includes(buttonDetails.btnshortName) && row?.req_fk_approval_id !== user?.logged_in_user_info?.usr_id) {

        return false;

      }

    }

    else if (['supplier', 'stocks', 'calibration'].includes(moduleType)) {

      if (['saved', 'posted'].includes(buttonDetails.btnshortName) && !getPurchaseManager(moduleType, "change")) {

        return false;

      }

    }

    if (['jrf', 'sampleinward'].includes(moduleType)) {

      if (['testmemoresult', 'testReport'].includes(buttonDetails.btnshortName) && !row['internal_certificate_id']) {

        return false;

      }

    }



    return true;

  };

  const chkBtnExists = (action) => {

    const validConditions = user?.role ? getBtnListArray() : [];
    console.log("validConditions",validConditions)



    const filterData = validConditions.filter((condition) => {

      if (!checkRoleBseCondition(condition)) {

        return false;

      }

      if (action.isDupplicate) {

        return (

          condition.btnStatus.toLowerCase() === status.toLowerCase() &&

          condition.btnshortName.toLowerCase() === action?.status.toLowerCase()

        );

      } else {

        return (



          condition.btnStatus.toLowerCase() === status.toLowerCase() && condition.label.toLowerCase() === action?.label.toLowerCase()

        );

      }

    });

    return Boolean(filterData.length > 0);

  };

  return actions.map((action, actionIndex) => {



    let isValid;

    // isValid = status && chkBtnExists(action);
    isValid = action.status == status;
    if (!isValid || action?.type === "icon") {

      return null;

    }

    if (['jobinstruction', 'jioperationjsonb'].includes(moduleType)) {

      if (user?.role === "BU") {

        if (user?.logged_in_user_info?.usr_id !== row['fk_useropsexecutiveid']) {

          return row['status'] === "accepted" ? (<button

            type="button"

            key={"listing-action" + actionIndex}

            className="iconBtn"

            onClick={() => handleOnclick(action)}

          >



            View

          </button>) : null

        }

      }

    }

    // if (["invoice"].includes(moduleType)) {

    //   if (row["im_is_debit_created"] && row["im_status"] != "debit_save") {

    //     return null

    //   }

    // }

    if (["invoice"].includes(moduleType)) {

      if (row["im_is_debit_created"] && row["im_status"] === "debit_save") {

        return null

      }

    }

    return (



      <button

        type="button"

        key={"listing-action" + actionIndex}

        className="iconBtn"

        onClick={() => handleOnclick(action)}

      >

        {action?.label}

      </button>

    );

  });

}



export default ListingActionButton;

