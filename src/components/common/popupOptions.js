import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  deleteDataFromApi,
  postDataFromApi,
  putDataFromApi,
} from "../../services/commonServices";
import {
  getActivityCode,
  getFormatedDate,
  getOperationActivityListPageUrl,
  getOperationActivityUrl,
  getRakeCollectionActivity,
  getRakeOperations,
  getSampleCollectionActivity,
  getStackOperations,
  getVesselOperation,
  isModuelePermission,
  getLMSOperationActivity
} from "../../services/commonFunction";

import { useDispatch, useSelector } from "react-redux";
import DeleteConfirmation from "./DeleteConfirmation";
import {
  InternalCertificateDeleteApi,
  JRFDeleteApi,
  JRFPDFDownloadApi,
  SFMDeleteApi,
  allotmentDeleteApi,
  sampleInwardDetailsDeleteAPI,
  sampleverificationDeleteApi,
  testMemoDeleteApi,
  InvoiceDeleteApi,
  folderCreateApi,
  InternalCertificateGetPDFApi,
  masterUploadApi
} from "../../services/api";
import { historyData } from "../../actions/authActions";
import PropTypes from "prop-types";
import { encryptDataForURL, decryptDataForURL } from "../../utills/useCryptoUtils";
import { handleJobInstructionDelete } from "./commonHandlerFunction/jobinstructionHandlerFunctions";
import { getNonLMSDetailsById } from "./commonHandlerFunction/OPscertificate/OPSCertificateHandlerFunctions";
import { handleVesselOperationDelete, handleDocumentDelete, handleCommercialCertDelete } from "./commonHandlerFunction/CommercialCertificateHandlerFunctions";
import { handleConsortiumDelete } from "./commonHandlerFunction/operations/consortiumHandlerFunctions";
import { handleConsortiumDelete as stubHandleConsortiumDelete } from "../../utils/stubFunctions";
import { useTranslation } from "react-i18next";
import { handleIncentiveDelete } from "./commonHandlerFunction/Feedback/IncentiveHandler";
import { handleIncentiveDelete as stubHandleIncentiveDelete } from "../../utils/stubFunctions";
import { handleCreateDebitFromList } from "./commonHandlerFunction/InvoiceHandlerFunctions";
import { handleCreateDebitFromList as stubHandleCreateDebitFromList } from "../../utils/stubFunctions";
import { handleIShipmentRecordDelete } from "./commonHandlerFunction/Shipment/ShipmentHandler";



const PopupOptions = ({
  popupActions,
  setPopupIndex,
  id,
  row,
  section,
  getAllListingData,
  setFormData,
  formConfig,
  type,
  sampleInwardFormId,
  model,
  isBottom,
  status,
  setDontClick,
  from,
  setPopupType,
  operationMode,
  formData,
  setIsOverlayLoader,

}) => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const translate = t;
  let user;
  const session = useSelector((state) => state.session);
  user = session?.user;
  console.log("roeship", row)
  let rolePermissions;
  rolePermissions = session?.user?.permissions;
  const uploadExtraModules = ['tenderDocumentList', 'purchaseorderDocumentList', 'purchasereqDocumentList', 'jrfDocumentList', 'itemDocumentList']

  const hash = window.location.hash;
  const params = new URLSearchParams(hash.split("?")[1]);
  let OperationType = decryptDataForURL(params.get("OperationType"));
  OperationType = getActivityCode(OperationType)
  OperationType = OperationType && OperationType.toLowerCase() != "othertpi" ? OperationType.toLowerCase() : OperationType

  const [actions, setActions] = useState(popupActions);
  const [isDelete, setIsDelete] = useState(false);
  const [actionType, setActionType] = useState(false);
  const moduleType = formConfig?.listView?.moduleType;
  const subModuleType = formConfig?.listView?.subModuleType;

  const handleClick = async (value, actionType = "") => {
    setActionType(value);
    setDontClick(true);
    if (value && typeof value === 'string' && value.toLowerCase() === "rake details") {
      navigate(
        getOperationActivityUrl(operationMode) +
        encryptDataForURL(row["fk_jiid"]) +
        "/" +
        encryptDataForURL(row["activity_master"]["activity_code"]) +
        "/" +
        encryptDataForURL(row["id"])
      );
      setPopupIndex(-1);
    }
    if (
      moduleType === "jobinstruction" ||
      moduleType === "jioperationjsonb" || moduleType === "invoice"
    ) {

      if (subModuleType === "invoice") {
        if (["Edit", "View"].includes(value)) {
          navigate(
            `/operation/invoice-listing/create-invoice/${encryptDataForURL(
              row["im_id"]
            )}` + "?status=" +
            encryptDataForURL(value)
          );
          setPopupIndex(-1);
        }
        else if (["Delete"].includes(value)) {
          handleInvoiceDelete();
          setPopupIndex(-1);
        }
        else if (["Create Debit"].includes(value)) {
          // navigate(
          //   `/operation/invoice-listing/invoice-preview/${encryptDataForURL(
          //     row["im_id"]
          //   )}/${encryptDataForURL(
          //     row["im_invoiceurl"]
          //   )}/${encryptDataForURL(
          //     row["im_invoicenumber"]
          //   )}`
          // );
          handleCreateDebitFromList(row, formConfig, setIsOverlayLoader, navigate)
        }
        else if (["Edit Debit"].includes(value)) {
          navigate(
            `/operation/invoice-listing/create-debit/${encryptDataForURL(
              row["im_id"]
            )}` + "?status=" +
            encryptDataForURL("Edit")
          );
        }
        else if (["Courier Details"].includes(value)) {
          navigate(
            `/operation/invoice-listing/create-invoice/${encryptDataForURL(
              row["im_id"]
            )}` + "?status=" +
            encryptDataForURL("Edit") + "&isCourier=" +
            encryptDataForURL(true)
          );
        }
      }

      else {
        if (from === "subListTable") {
          if (['configurationList', 'commercialCertificate'].includes(subModuleType)) {
            if (value === "View" && subModuleType === 'configurationList') {
              navigate(
                "/operation/operation-certificate/" +
                encryptDataForURL(row?.fk_jiid) +
                "/" +
                encryptDataForURL(row?.fk_jisid) +
                "?status=" +
                encryptDataForURL(row?.status) +
                "&RPCID=" +
                encryptDataForURL(row?.rpc_id) +
                "&OperationType=" +
                encryptDataForURL(OperationType) + "&opsCertiView=" +
                encryptDataForURL('view') + "&operationMode=" + encryptDataForURL(operationMode)
              );
            }
            else if (value && typeof value === 'string' && value.toLowerCase() === "delete") {
              setIsDelete(true);
              return
            }
            else if (
              !getLMSOperationActivity().includes(getActivityCode(row?.activity_master?.activity_code || row.activity_code).toLowerCase()) && ![getVesselOperation("bulk_crg"), getStackOperations("ST_SV"), getRakeOperations("RK_SV")].includes(getActivityCode(row?.activity_master?.activity_code || row.activity_code).toLowerCase())
            ) {
              if (row.cc_is_external) {
                navigate(
                  `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(row?.fk_jisid)}/${encryptDataForURL(row.cc_id)}?status=${encryptDataForURL(
                    "View"
                  )}&CCID=${encryptDataForURL(row.cc_id)}` +
                  "&OperationType=" +
                  encryptDataForURL(row?.activity_code) + "&isExternal=" + encryptDataForURL(1)
                );
                return
              }
              else if (row?.cc_is_physical) {
                navigate(
                  `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
                    row?.fk_jiid
                  )}/${encryptDataForURL(row.cc_id)}?status=${encryptDataForURL(
                    "View"
                  )}&CCID=${encryptDataForURL(row.cc_id)}&OperationType=${encryptDataForURL(row.activity_code)}` + "&isUseForPhysical=" +
                  encryptDataForURL(1)
                );
                return
              }
              let payload = {
                ji_id: row?.fk_jiid,
                jis_id: row?.fk_jisid,
                tenant: 1,
              };
              // let OPSDSRes = await postDataFromApi(
              //   "/ops-vessel-ds/get/",
              //   payload
              // );
              let OPSDSRes = await getNonLMSDetailsById(getActivityCode(row.activity_code).toLowerCase(), payload);
              if (OPSDSRes.status === 200) {
                navigate(
                  `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
                    OPSDSRes?.data?.data?.opsvd_id
                  )}/${encryptDataForURL(row.cc_id)}?status=${encryptDataForURL(
                    "View"
                  )}&CCID=${encryptDataForURL(row.cc_id)}&OperationType=${encryptDataForURL(row.activity_code)}`
                );
              }
            } else {
              if (row.cc_is_external) {
                navigate(
                  `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(row?.fk_jisid)}/${encryptDataForURL(row.cc_id)}?status=${encryptDataForURL(
                    "View"
                  )}&CCID=${encryptDataForURL(row.cc_id)}` +
                  "&OperationType=" +
                  encryptDataForURL(row?.activity_code) + "&isExternal=" + encryptDataForURL(1)
                );
                return
              }
              else if (row?.cc_is_physical) {
                navigate(
                  `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
                    row?.fk_jiid
                  )}/${encryptDataForURL(row.cc_id)}?status=${encryptDataForURL(
                    "View"
                  )}&CCID=${encryptDataForURL(row.cc_id)}&OperationType=${encryptDataForURL(row.activity_code)}` + "&isUseForPhysical=" +
                  encryptDataForURL(1)
                );
                return
              }
              navigate(
                `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
                  row?.fk_jiid
                )}/${encryptDataForURL(row.cc_id)}?status=${encryptDataForURL(
                  "View"
                )}&CCID=${encryptDataForURL(row.cc_id)}&OperationType=${encryptDataForURL(row.activity_code)}` + `&activityJIID=${encryptDataForURL(row.fk_jisid)}`
              );
            }
          } else {
            if (
              getLMSOperationActivity().includes(getActivityCode(row["activity_master"]["activity_code"]).toLowerCase())
            ) {
              let opsNo = 2
              if (getRakeCollectionActivity().includes(getActivityCode(row["activity_master"]["activity_code"]).toLowerCase())) {
                opsNo = 7
              }
              else if (getSampleCollectionActivity().includes(getActivityCode(row["activity_master"]["activity_code"]).toLowerCase())) {
                opsNo = 6
              }
              navigate(
                getOperationActivityUrl(operationMode) +
                encryptDataForURL(row["fk_jiid"]) +
                "/" +
                encryptDataForURL(row["activity_master"]["activity_code"]) +
                "?OperationType=" +
                encryptDataForURL(row["activity_master"]["activity_code"]) +
                "&operationId=" +
                encryptDataForURL(row["jis_id"]) +
                "&operationStepNo=" +
                encryptDataForURL(opsNo) +
                "&action=" +
                encryptDataForURL("opsView") + "&operationMode=" + encryptDataForURL(operationMode)
              );
            } else if (moduleType === "vesselOperation" && formConfig?.listView?.subModuleType === 'configurationList') {
              navigate(
                "/operation/vessel-ji-list/vessel-list/" +
                encryptDataForURL(row["fk_jiid"]) +
                "/" +
                encryptDataForURL(OperationType) +
                "?OperationType=" +
                encryptDataForURL(OperationType) +
                "&operationId=" +
                encryptDataForURL(row["jis_id"]) +
                "&useFor=" +
                encryptDataForURL("viewOnly") +
                "&action=" +
                encryptDataForURL("View")
              );
            } else {
              navigate(
                getOperationActivityUrl(operationMode) +
                encryptDataForURL(formData[0]?.ji_id) +
                "/" +
                encryptDataForURL(row["activity_master"]["activity_code"]) +
                "?OperationType=" +
                encryptDataForURL(row["activity_master"]["activity_code"]) +
                "&operationId=" +
                encryptDataForURL(row["jis_id"]) +
                "&useFor=" +
                encryptDataForURL("viewOnly") +
                "&action=" +
                encryptDataForURL("View") + "&activityJIID=" + encryptDataForURL(row["fk_jiid"])
              );
            }
          }
          setPopupIndex(-1);
        }
        if (value === "Delete") {
          setIsDelete(true);
          return
        }
        if (subModuleType == "commercialCertificate" && value === "View") {

        }
        else if (value === "History") {
          const historyDetails = {
            recordNo: "Job Instruction No " + row.ji_reference_number,
            model: model,
            redirect: "/operation/jrfInstructionListing",
            Breadcrumb: "Draught Survey List",
          };

          dispatch(historyData(historyDetails));
          navigate(
            `/module-history?status=${encryptDataForURL(
              value
            )}&id=${encryptDataForURL(row["ji_id"])}`
          );

          setPopupIndex(-1);
        } else if (value === "Documents") {
          navigate(
            "/operation/JI-commercial-certificate-list/" +
            encryptDataForURL(row.ji_id)
          );
        } else if (value === "Edit") {
          // localStorage.setItem('isMainScopeWork','');
          dispatch({
            type: "MAIN_SCOPE_WORK",
            isMainScopeWork: ""
          });
          navigate(
            `/operation/jrfInstructionListing/job-instruction/${encryptDataForURL(
              row["ji_id"]
            )}`
          );
          setPopupIndex(-1);
        }else {
          if (['CP', 'BH'].includes(user?.role)) {
            let redirectUrl = getOperationActivityUrl(row["operation_type"]['operation_type_name'])
            navigate(
              redirectUrl +
              encryptDataForURL(row["ji_id"]) +
              "?action=" +
              encryptDataForURL("View")
            );
          }
          else {
            let redirecturl = getOperationActivityListPageUrl(row["operation_type"]['operation_type_name'])
            redirecturl = redirecturl.replace(/\/([^\/]*)$/, "-$1");
            navigate(
              `${redirecturl}view/${encryptDataForURL(
                row["ji_id"]
              )}?action=${encryptDataForURL("View")}&useFor=${encryptDataForURL(
                "viewOnly"
              )}&isFullDetails=${encryptDataForURL(1)}`
            );
            setPopupIndex(-1);
          }
        }
      }
    } else if (['truckOperation', 'vesselOperation'].includes(moduleType)) {

      if (value === "Delete") {
        setIsDelete(true);
      }
      else {
        if (from === "subListTable") {
          if (['configurationList', 'commercialCertificate'].includes(subModuleType)) {
            if (value === "View" && subModuleType === 'configurationList') {
              navigate(
                "/operation/operation-certificate/" +
                encryptDataForURL(row?.fk_jiid) +
                "/" +
                encryptDataForURL(row?.fk_jisid) +
                "?status=" +
                encryptDataForURL(row?.status) +
                "&RPCID=" +
                encryptDataForURL(row?.rpc_id) +
                "&OperationType=" +
                encryptDataForURL(OperationType) + "&opsCertiView=" +
                encryptDataForURL('view') + "&operationMode=" + encryptDataForURL(operationMode)
              );
            }
            else if (
              !getLMSOperationActivity().includes(getActivityCode(row?.activity_master?.activity_code || row.activity_code).toLowerCase()) && ![getVesselOperation("bulk_crg"), getStackOperations("ST_SV"), getRakeOperations("RK_SV")].includes(getActivityCode(row?.activity_master?.activity_code || row.activity_code).toLowerCase())
            ) {
              let payload = {
                ji_id: row?.fk_jiid,
                jis_id: row?.fk_jisid,
                tenant: 1,
              };
              // let OPSDSRes = await postDataFromApi(
              //   "/ops-vessel-ds/get/",
              //   payload
              // );
              let OPSDSRes = await getNonLMSDetailsById(getActivityCode(row.activity_code).toLowerCase(), payload);
              if (OPSDSRes.status === 200) {
                navigate(
                  `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
                    OPSDSRes?.data?.data?.opsvd_id
                  )}/${encryptDataForURL(row.cc_id)}?status=${encryptDataForURL(
                    "View"
                  )}&CCID=${encryptDataForURL(row.cc_id)}&OperationType=${encryptDataForURL(row.activity_code)}`
                );
              }
            } else {
              navigate(
                `/operation/commercial-certificate-list/commercial-certificate-preview/${encryptDataForURL(
                  row?.fk_jiid
                )}/${encryptDataForURL(row.cc_id)}?status=${encryptDataForURL(
                  "View"
                )}&CCID=${encryptDataForURL(row.cc_id)}&OperationType=${encryptDataForURL(row.activity_code)}`
              );
            }
          } else {
            if (
              getLMSOperationActivity().includes(getActivityCode(row["activity_master"]["activity_code"]).toLowerCase())
            ) {
              let opsNo = 2
              if (getRakeCollectionActivity().includes(getActivityCode(row["activity_master"]["activity_code"]).toLowerCase())) {
                opsNo = 7
              }
              else if (getSampleCollectionActivity().includes(getActivityCode(row["activity_master"]["activity_code"]).toLowerCase())) {
                opsNo = 6
              }
              navigate(
                getOperationActivityUrl(operationMode) +
                encryptDataForURL(row["fk_jiid"]) +
                "/" +
                encryptDataForURL(row["activity_master"]["activity_code"]) +
                "?OperationType=" +
                encryptDataForURL(row["activity_master"]["activity_code"]) +
                "&operationId=" +
                encryptDataForURL(row["jis_id"]) +
                "&operationStepNo=" +
                encryptDataForURL(opsNo) +
                "&action=" +
                encryptDataForURL("opsView") + "&operationMode=" + encryptDataForURL(operationMode)
              );
            } else if (moduleType === "vesselOperation" && formConfig?.listView?.subModuleType === 'configurationList') {
              navigate(
                "/operation/vessel-ji-list/vessel-list/" +
                encryptDataForURL(row["fk_jiid"]) +
                "/" +
                encryptDataForURL(OperationType) +
                "?OperationType=" +
                encryptDataForURL(OperationType) +
                "&operationId=" +
                encryptDataForURL(row["jis_id"]) +
                "&useFor=" +
                encryptDataForURL("viewOnly") +
                "&action=" +
                encryptDataForURL("View")
              );
            } else {
              navigate(
                getOperationActivityUrl(operationMode) +
                encryptDataForURL(formData[0]?.ji_id) +
                "/" +
                encryptDataForURL(row["activity_master"]["activity_code"]) +
                "?OperationType=" +
                encryptDataForURL(row["activity_master"]["activity_code"]) +
                "&operationId=" +
                encryptDataForURL(row["jis_id"]) +
                "&useFor=" +
                encryptDataForURL("viewOnly") +
                "&action=" +
                encryptDataForURL("View") +
                "&operationMode=" +
                encryptDataForURL(operationMode) + "&activityJIID=" + encryptDataForURL(row["fk_jiid"])
              );
            }
          }
          setPopupIndex(-1);
        }
      }
    } else if (['JICommercialCertificateList', ...uploadExtraModules].includes(moduleType)) {
      if (value === "Delete") {
        setIsDelete(true);
      } else {
        setPopupType(value);
      }
    }
    else if (moduleType === "TPIMain") {
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
        )}&action=${encryptDataForURL('View')}`
      );
    }
    else if (moduleType === "consortiumorder") {
      if (value === "Delete") {
        setIsDelete(true);
      }
      else if (value === "Edit") {
        navigate(
          `/operation/consortiums-list/consortium/${encryptDataForURL(
            row["co_id"]
          )}`
        );
        setPopupIndex(-1);
      }
      else {
        navigate(
          `/operation/consortiums-list/consortium/${encryptDataForURL(
            row["co_id"]
          )}?action=${encryptDataForURL('View')}`
        );
      }
    }
    else if (moduleType === "incentives") {
      if (value === "View") {
        navigate(`/incentivesList/incentivesForm/${encryptDataForURL(row["incentive_id"])}?status=${encryptDataForURL('View')}`);
      }
      else if (value === "Delete") {
        setIsDelete(true)
      }
    }
    else if (moduleType === "category") {

      if (value === "View") {
        navigate(`/categorylist/categoryForm/${encryptDataForURL(row["category_id"])}?status=${encryptDataForURL('View')}`);
      }
      else if (value === "Edit") {
        navigate(`/categorylist/categoryForm/${encryptDataForURL(row["category_id"])}?action=${encryptDataForURL('Change')}`);
      }
      else if (value === "Delete") {
        setIsDelete(true)
      }
    }
    else if (moduleType === "ShipmentList") {

      if (value === "View") {

        navigate(`/shipment/shipmentForm/${encryptDataForURL(row["ship_id"])}?status=${encryptDataForURL('View')}`);
      }
      else if (value === "Edit") {
        navigate(`/shipment/shipmentForm/${encryptDataForURL(row["ship_id"])}?action=${encryptDataForURL('Change')}`);
      }
      else if (value === "Delete") {
        setIsDelete(true)
      }
    }
    else if (moduleType === "marketPlaceListing") {

      if (value === "View") {

        navigate(`/market/marketForm/${encryptDataForURL(row["id"])}?status=${encryptDataForURL('View')}`);
      }
      else if (value === "Edit") {
        navigate(`/market/marketForm/${encryptDataForURL(row["id"])}?action=${encryptDataForURL('Change')}`);
      }
      else if (value === "Delete") {
        setIsDelete(true)
      }
    }
    else if (moduleType === "userMaster") {
      if (value === "View") {
        navigate(`/users/user-form/${encryptDataForURL(row["usr_id"])}?status=${encryptDataForURL('View')}`);
      }
      else if (value === "Edit") {
        navigate(`/users/user-form/${encryptDataForURL(row["usr_id"])}?action=${encryptDataForURL('Change')}`);
      }
    }
    else if (moduleType === "feedback") {
      if (value === "View") {
        navigate(`/feedbackListList/feedbackListForm/${encryptDataForURL(row["feedback_id"])}?status=${encryptDataForURL('View')}`);
      }
    }
    if (moduleType === "ClientDetails") {
      navigate(
        `/collections/client-list/${encryptDataForURL(
          row["cust_id"]
        )}` + "?action=" +
        encryptDataForURL(value)
      );
      setPopupIndex(-1);
    }
  };



  const handleDeleteData = async () => {

    if (moduleType === "sampleinward") {
      handleSimpleInwardDeleteData();
      return;
    } else if (moduleType === "testmemomain") {
      handleTestMemoDeleteData();
      return;
    } else if (moduleType === "allotment") {
      handleAllotmentDelete();
      return;
    } else if (moduleType === "sampleverification") {
      handleSampleVerificationDelete();
      return;
    } else if (moduleType === "sfm") {
      handleSFMDelete();
      return;
    } else if (moduleType === "internalcertificate") {
      handleinternalcertificateDelete();
      return;
    } else if (moduleType === "jobinstruction" || moduleType === "jioperationjsonb") {
      if (subModuleType == "commercialCertificate") {
        handleCommercialCertDelete(
          row.cc_id,
          setIsDelete,
          getAllListingData,
          setPopupIndex,
          row
        )
      }
      else {
        handleJobInstructionDelete(
          row.ji_id,
          setIsDelete,
          getAllListingData,
          setPopupIndex
        );
      }
      return;
    }
    else if (moduleType === "vesselOperation") {
      handleVesselOperationDelete(
        row,
        setIsDelete,
        getAllListingData,
        setPopupIndex
      );
      return;
    }
    else if (['JICommercialCertificateList', ...uploadExtraModules].includes(moduleType)) {
      handleDocumentDelete(
        row,
        setIsDelete,
        getAllListingData,
        setPopupIndex
      );
      return;
    }
    else if (moduleType === "consortiumorder") {
      handleConsortiumDelete(
        row,
        setIsDelete,
        getAllListingData,
        setPopupIndex
      );
      return;
    }
    else if (moduleType === "incentives") {
      handleIncentiveDelete(
        row["incentive_id"],
        setIsDelete,
        getAllListingData,
        setPopupIndex
      )
    }
    else if (moduleType === "ShipmentList") {
      handleIShipmentRecordDelete(
        row["ship_id"],
        setIsDelete,
        getAllListingData,
        setPopupIndex
      )
    }
    else if (moduleType === "marketPlaceListing") {
      // handleIShipmentRecordDelete(
      //   row["id"],
      //   setIsDelete,
      //   getAllListingData,
      //   setPopupIndex
      // )
    }
    else {
      let deleteBody = {
        jrf_id: id,
      };
      let res = await deleteDataFromApi(JRFDeleteApi, deleteBody);
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
      setIsDelete(false);
      setPopupIndex(-1);
      getAllListingData();
    }
  };
  const handleSimpleInwardDeleteData = async () => {
    let res;
    if (row["status"] == "rejected") {
      let MainData = {
        jrf_id: id,
        jrf_data: {
          jrf_status: "cancelled",
        },
      };
      res = await putDataFromApi(formConfig.apiEndpoints.update, MainData);
    } else {
      let deleteBody = {
        smpl_inwrd_id: sampleInwardFormId,
      };
      res = await deleteDataFromApi(sampleInwardDetailsDeleteAPI, deleteBody);
    }
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
    setIsDelete(false);
    setPopupIndex(-1);
    getAllListingData();
  };
  const handleTestMemoDeleteData = async () => {
    let deleteBody = {
      test_memo_id: row.tm_id,
    };
    let res = await deleteDataFromApi(testMemoDeleteApi, deleteBody);

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
    setIsDelete(false);
    setPopupIndex(-1);
    getAllListingData();
  };
  const handleAllotmentDelete = async () => {
    let deleteBody = {
      sa_id: row.sa_id,
    };
    let res = await deleteDataFromApi(allotmentDeleteApi, deleteBody);

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
    setIsDelete(false);
    setPopupIndex(-1);
    getAllListingData();
  };
  const handleSampleVerificationDelete = async () => {
    let deleteBody = {
      sv_id: row.sv_id,
    };
    let res = await deleteDataFromApi(sampleverificationDeleteApi, deleteBody);

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
    setIsDelete(false);
    setPopupIndex(-1);
    getAllListingData();
  };
  const handleSFMDelete = async () => {
    let deleteBody = {
      sfm_id: row.sfm_id,
    };
    let res = await deleteDataFromApi(SFMDeleteApi, deleteBody);

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
    setIsDelete(false);
    setPopupIndex(-1);
    getAllListingData();
  };
  const handleinternalcertificateDelete = async () => {
    let deleteBody = {
      ic_id: row.ic_id,
    };
    let res = await deleteDataFromApi(InternalCertificateDeleteApi, deleteBody);

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
    setIsDelete(false);
    setPopupIndex(-1);
    getAllListingData();
  };
  const handleInvoiceDelete = async () => {
    let deleteBody = {
      im_id: row.im_id,
    };
    let res = await deleteDataFromApi(InvoiceDeleteApi, deleteBody);

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
    setIsDelete(false);
    setPopupIndex(-1);
    getAllListingData();
  };
  const handleDownloadJRF = async () => {
    let bodyData = {
      jrf_id: id,
    };
    let res = await postDataFromApi(JRFPDFDownloadApi, bodyData, "", 1);
    if (res?.status === 200) {
      let pdfDate = "JRF" + id + "_" + getFormatedDate(new Date(), "", 1);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = pdfDate + ".pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setIsDelete(false);
    setPopupIndex(-1);
  };
  const openDeletePopup = () => {
    let headingMsg = "Confirmation!";
    let titleMsg = "";
    if (actionType == "Delete") {
      headingMsg = formConfig?.popupMessages?.delete?.headerMsg;
      titleMsg = formConfig?.popupMessages?.delete?.titleMsg;
    } else if (actionType == "Download") {
      headingMsg = formConfig?.popupMessages?.download?.headerMsg;
      titleMsg = formConfig?.popupMessages?.download?.titleMsg;
    }
    return (
      <DeleteConfirmation
        isOpen={isDelete}
        handleClose={setIsDelete}
        handleConfirm={() =>
          actionType == "Download" ? handleDownloadJRF() : handleDeleteData()
        }
        popupMessage={titleMsg}
        popupHeading={headingMsg}
        actionType={actionType}
      />
    );
  };

  const checkOPSHeadData = () => {
    if (['SU', 'OPS_ADMIN'].includes(user?.role)) {
      return false
    }
    else if (user?.logged_in_user_info?.usr_id === row['fk_useropsexecutiveid']) {
      return false
    }
    return true;
  }

  const chkActionVisibility = (
    rolePermissions,
    module,
    subModuleType,
    permission,
    value = ""
  ) => {
    // console.log("module",module)
    let isVisbile = false;
    if (
      permission &&
      isModuelePermission(rolePermissions, module, permission)
    ) {

      if (module == "jrf") {
        if (value && typeof value === 'string' && value.toLowerCase() === "edit") {
          let data = {
            BU: ["saved", "rejected"],
            LR: ["saved"],
            SU: []
          };
          if (data[user?.role].includes(row.jrf_status)) {
            isVisbile = true;
          }
        } else if (value && typeof value === 'string' && value.toLowerCase() === "delete") {
          let data = {
            BU: ["saved", "rejected"],
            LR: [],
            SU: []
          };
          if (data[user?.role].includes(row.jrf_status)) {
            isVisbile = true;
            if (['saved'].includes(row.jrf_status) && row.jrf_is_ops) {
              isVisbile = false;
            }
          }
        } else if (value && typeof value === 'string' && value.toLowerCase() === "reject") {
          let data = {
            BU: [],
            LR: ['accepted'],
            SU: []
          };
          if (data[user?.role].includes(row.jrf_status)) {
            isVisbile = true;
          }
        } else {
          isVisbile = true;
        }
      } else if (module == "sampleinward") {
        if (value && typeof value === 'string' && value.toLowerCase() === "edit") {
          let data = {
            LR: ["created", "saved"],
            SU: []
          };
          if (data[user?.role].includes(row.smpl_status)) {
            isVisbile = true;
          }
        } else {
          isVisbile = true;
        }
      } else if (module == "internalcertificate") {
        if (value && typeof value === 'string' && value.toLowerCase() === "edit") {
          let data = {
            LR: ["rejected", "saved"],
            TM: [],
            STM: [],
            QM: [],
            SQM: [],
            SLC: [],
            DTM: [],
            LC: [],
            SU: []
          };
          if (data[user?.role].includes(row.status)) {
            isVisbile = true;
          }
        } else {
          isVisbile = true;
        }
      } else if (module == "jobinstruction" || moduleType === "jioperationjsonb" || moduleType === "invoice") {
        if (subModuleType == "invoice") {
          if (["edit", "delete"].includes(value && typeof value === 'string' && value.toLowerCase())) {
            let data = {
              BU: ['Saved', 'debit_save'],
              LR: ['Saved', 'debit_save'],
            };
            if (data[user?.role] && data[user?.role].includes(row?.im_status)) {
              isVisbile = true;
            }
          }
          else if (["view"].includes(value && typeof value === 'string' && value.toLowerCase())) {
            isVisbile = true;
          }
          else if (["Share Invoice"].includes(value && typeof value === 'string' && value.toLowerCase())) {
            isVisbile = ['LR', 'BU'].includes(user?.role);
          }
          else if (["create debit"].includes(value && typeof value === 'string' && value.toLowerCase())) {
            if (['invoice_generated'].includes(row?.im_status) && !row?.im_is_debit_created) {
              isVisbile = ['LR', 'BU'].includes(user?.role);
            }
          }
          else if (["edit debit"].includes(value && typeof value === 'string' && value.toLowerCase())) {
            if (['debit_save'].includes(row?.im_status)) {
              isVisbile = ['LR', 'BU'].includes(user?.role);
            }
          }
          else if (["courier details"].includes(value && typeof value === 'string' && value.toLowerCase())) {
            if (!['Saved'].includes(row?.im_status)) {
              isVisbile = ['LR', 'BU'].includes(user?.role);
            }
          }
          else {
            isVisbile = false;
          }
          return isVisbile

        }
        else if (subModuleType == "commercialCertificate") {
          if (value && typeof value === 'string' && value.toLowerCase() === "delete") {

            let data = {
              BU: ['saved']
            };
            if (data?.[user?.role] && data?.[user?.role].includes(status)) {
              isVisbile = false;
            }
            else {
              isVisbile = false;
            }
          }
          else {
            isVisbile = true;
          }
          return isVisbile
        }
        else {
          if (value && typeof value === 'string' && value.toLowerCase() != "view" && checkOPSHeadData()) {
            return false
          }
          if (value && typeof value === 'string' && value.toLowerCase() === "edit") {
            let data = {
              BU: ['posted', 'accepted'],
              "OPS_ADMIN": ["saved", "created", "pre-analysis", "analysis"],
              SU: []
            };
            if (data[user?.role].includes(status)) {
              isVisbile = true;
            }
          } else if (value && typeof value === 'string' && value.toLowerCase() === "delete") {
            let data = {
              BU: [],
              "OPS_ADMIN": ["saved"],
              SU: []
            };
            if (data[user?.role].includes(status)) {
              isVisbile = true;
            }
          }
          else if (value && typeof value === 'string' && value.toLowerCase() === "history") {
            let data = {
              BU: ['rejected'],
              "OPS_ADMIN": ["rejected"],
              SU: []
            };
            if (!data[user?.role].includes(status)) {
              isVisbile = true;
            }
          }
          else if (module === "internalcertificate") {
            if (!["SU"].includes(user?.role)) {
              isVisbile = true;
            }
          }
          else if (module === "sampleinward") {
            if (!["SU"].includes(user?.role)) {
              isVisbile = true;
            }
          }
          else {
            isVisbile = true;
          }
        }
      }
      else if (module == "consortiumorder") {
        if (value && typeof value === 'string' && value.toLowerCase() === "view") {
          isVisbile = true;
        }
        else if (value && typeof value === 'string' && value.toLowerCase() === "edit") {
          let data = {
            BU: ['saved'],
            "OPS_ADMIN": ["saved"],
            SU: []

          };
          if (data[user?.role].includes(status)) {
            isVisbile = true;
          }
        } else if (value && typeof value === 'string' && value.toLowerCase() === "delete") {
          let data = {
            BU: ["saved"],
            "OPS_ADMIN": ["saved"],
            SU: []
          };
          if (data[user?.role].includes(status)) {
            isVisbile = true;
          }
        } else if (value && typeof value === 'string' && value.toLowerCase() === "documents") {
          if (module == "jobinstruction" || moduleType === "jioperationjsonb") {
            if (value && typeof value === 'string' && value.toLowerCase() != "view" && checkOPSHeadData()) {
              return false
            }
            let data = {
              BU: ['rejected', 'cancel'],
              "OPS_ADMIN": ["rejected", "saved", "created", "pre-analysis", "analysis", 'cancel']
            };
            if (!data[user?.role].includes(status)) {
              isVisbile = true;
            }
          }
          else {
            isVisbile = true;
          }
        } else if (value && typeof value === 'string' && value.toLowerCase() === "man power") {
          if (!['CP', 'BH'].includes(user?.role)) {
            isVisbile = true;
          }

        } else if (value && typeof value === 'string' && value.toLowerCase() === "commercial certificate") {
          isVisbile = true;
        }
      }
    }
    else if (module === "userMaster") {
      isVisbile = true
    }
    else if (module == "ClientDetails") {
      isVisbile = true;
    }
    else if (module === "ShipmentList") {

      if (['edit', 'delete', "view", "history"].includes(value && typeof value === 'string' && value.toLowerCase())) {
        isVisbile = true;
      }
      else {
        isVisbile = false
      }
    }
    else if (module === "marketPlaceListing") {

      if (['edit', 'delete', "view", "history"].includes(value && typeof value === 'string' && value.toLowerCase())) {
        isVisbile = true;
      }
      else {
        isVisbile = false
      }
    }
    else {

      if (value && typeof value === 'string' && value.toLowerCase() === "download") {
        let data = {
          BU: ["posted", "saved"],
          LR: ["posted", "saved"],
        };
        if (data[user?.role] && !data[user?.role].includes(row?.jrf_status)) {
          isVisbile = true;
        }
      }
      else if (
        value && typeof value === 'string' && value.toLowerCase() === "pdf" &&
        (formConfig?.listView?.moduleType === "sfm" ||
          formConfig?.listView?.moduleType === "testmemomain")
      ) {
        let data = {
          TM: ["certified", 'results'],
          STM: ["certified", 'results'],
          QM: ["certified", 'results'],
          SQM: ["certified", 'results'],
          SLC: ["certified", 'results', "completed"],
          LR: ["certified", 'results'],
          DTM: ["certified", 'results'],
          LC: ["completed"],
          SU: [],
        }
        if (user?.all_roles?.main_role_id && user?.all_roles?.other_roles?.length) {
          if (formConfig?.listView?.moduleType === "testmemomain") {
            data?.[user?.role]?.push('results')
          }
        }
        if (data[user?.role] && data[user?.role].includes(row.status || row.sfm_status)) {
          isVisbile = true;
        }
      } else if (value && typeof value === 'string' && value.toLowerCase() === "history") {
        if (module == "jobinstruction" || moduleType === "jioperationjsonb") {
          if (value && typeof value === 'string' && value.toLowerCase() != "view" && checkOPSHeadData()) {
            return false
          }
          let data = {
            BU: ['rejected'],
            "OPS_ADMIN": ["rejected"],
          };
          if (data[user?.role] && !data[user?.role].includes(status)) {
            isVisbile = true;
          }
        }
        else {
          isVisbile = true;
        }
      } else if (
        value && typeof value === 'string' && value.toLowerCase() === "pdf" &&
        (moduleType === "sfm" || moduleType === "testmemomain")
      ) {
        let data = {
          TM: ["certified"],
          LR: ["certified"],
          DTM: ["certified"],
          LC: ["completed"],
        };

        if (data[user?.role] &&
          (data[user?.role].includes(row?.status) ||
            data[user?.role].includes(row?.sfm_status))
        ) {
          isVisbile = true;
        }
      } else if (value && typeof value === 'string' && value.toLowerCase() === "documents") {
        if (module == "jobinstruction" || moduleType === "jioperationjsonb") {
          if (value && typeof value === 'string' && value.toLowerCase() != "view" && checkOPSHeadData()) {
            return false
          }
          let data = {
            BU: ['rejected'],
            "OPS_ADMIN": ["rejected", "saved", "created", "pre-analysis", "analysis"],
            "SU": ["rejected", "saved", "created", "pre-analysis", "analysis"],
          };
          if (data[user?.role] && !data[user?.role].includes(status)) {
            isVisbile = true;
          }
        }
        else if (module == "jrf") {
          let data = {
            BU: [],
            LR: [],
            SU: []
          };
          if (data[user?.role] && !data[user?.role].includes(status)) {
            isVisbile = true;
          }
        }
        else {
          isVisbile = true;
        }
      } else if (value && typeof value === 'string' && value.toLowerCase() === "man power") {
        isVisbile = true;
      } else if (value && typeof value === 'string' && value.toLowerCase() === "commercial certificate") {
        isVisbile = true;
      }
      // else if (value && typeof value === 'string' && value.toLowerCase() === "rake details") {
      //   isVisbile = true;
      // }
      else if (value && typeof value === 'string' && value.toLowerCase() === "view") {
        if (moduleType === "TPIMain") {
          isVisbile = true
        }
      }
    }
    // return true
    return isVisbile;
  };
  const chkSubListVisibility = (from, moduleType, value, subModuleType) => {
    if (subModuleType == "commercialCertificate") {
      let isVisbile = true
      if (value && typeof value === 'string' && value.toLowerCase() === "delete") {

        let data = {
          BU: ['saved']
        };
        if (data?.[user?.role] && data?.[user?.role].includes(status)) {
          isVisbile = true;
        }
        else {
          isVisbile = false;
        }
      }
      else {
        isVisbile = true;
      }
      return isVisbile
    }
    if (value?.toLowerCase() === "delete" && row?.status === "completed") {
      return false
    }
    else if (value?.toLowerCase() === "rake details") {
      // if (operationMode === "RAKE") {
      //   if (getActivityCode(row?.activity_master?.activity_code).toLowerCase() === getRakeOperations('QAss')) {
      //     return true
      //   }
      // }
      return false
    }
    else {
      if (from === "subListTable") {
        if (['CP', 'BH'].includes(user?.role)) {
          return false
        }
        else {
          return true
        }
      }
    }

  }
  const popupRef = useRef(null);
  const [dynamicTop, setDynamicTop] = useState(0);

  useEffect(() => {
    if (popupRef.current) {
      const popupHeight = popupRef.current.offsetHeight;
      setDynamicTop(-popupHeight); // Set `top` to negative of the height
    }
  }, [isBottom]); // Recalculate if `isBottom` changes

  return (
    <div
      ref={popupRef}
      className={"popupOptions"}
      style={isBottom ? { position: 'absolute', top: `${dynamicTop}px` } : {}}
    >
      {actions.map((action, actionIndex) => {
        return (action.value &&
          action.value !== "" &&
          action.type === "icon" &&
          action.status !== "assignmentview"
          &&
          chkActionVisibility(
            rolePermissions,
            section.moduleType,
            section.subModuleType,
            action.permission,
            action.value
          ))
          ||
          chkSubListVisibility(
            from,
            section.moduleType,
            action.value,
            section.subModuleType,
          )


          ? (
            <div key={"sample-inward-" + actionIndex}>
              <button
                type="button"
                className="nonNativeButton2"
                aria-label="Sample Inward Action Button"
                onClick={() =>
                  moduleType === "sampleinward"
                    ? handleClick(action.status, action.value)
                    : handleClick(action.value)
                }
              >
                <i className={action.label}></i>
                {action.value}
              </button>
            </div>
          ) : action.status === "assignmentview" &&
            row["smpl_status"] === "assigned" ? (
            <div key={"actionIndex-" + actionIndex}>
              <button
                type="button"
                className="nonNativeButton2"
                aria-label="Assignment View Button"
                onClick={() =>
                  moduleType === "sampleinward"
                    ? handleClick(action.status, action.value)
                    : handleClick(action.value)
                }
              >
                <i className={action.label}></i>
                {action.value}
              </button>
            </div>
          ) : action.status === "JICommercialList" ? (
            <div key={"actionIndex-" + actionIndex}>
              <button
                type="button"
                className="nonNativeButton2"
                aria-label="Assignment View Button"
                onClick={() => handleClick(action.value)}
              >
                <i className={action.label}></i>
                {action.value}
              </button>
            </div>
          )
            : action.status === "vesseListView" ? (
              <div key={"actionIndex-" + actionIndex}>
                <button
                  type="button"
                  className="nonNativeButton2"
                  aria-label="Assignment View Button"
                  onClick={() => handleClick(action.value)}
                >
                  <i className={action.label}></i>
                  {action.value}
                </button>
              </div>
            )
              : null;
      })}
      {isDelete && openDeletePopup()}
    </div>
  );
};
PopupOptions.propTypes = {
  popupActions: PropTypes.arrayOf(PropTypes.object),
  setPopupIndex: PropTypes.func,
  id: PropTypes.string,
  row: PropTypes.object,
  section: PropTypes.string,
  getAllListingData: PropTypes.func,
  formConfig: PropTypes.object,
  type: PropTypes.string,
  sampleInwardFormId: PropTypes.string,
  model: PropTypes.object,
  isBottom: PropTypes.bool,
  status: PropTypes.string,
  setDontClick: PropTypes.func,
};



export default PopupOptions;
