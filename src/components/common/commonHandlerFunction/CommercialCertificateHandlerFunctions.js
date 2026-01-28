import { toast } from "react-toastify";
import {
  deleteDataFromApi,
  getDataFromApi,
  GetTenantDetails,
  postDataFromApi,
  putDataFromApi,
} from "../../../services/commonServices";
import { getVesselOperation,  getStackOperations, getRakeOperations, getRakeCollectionActivity, getPlantOperations, getLMSOperationActivity, getActivityCode, getFormatedDate, getPDFFormattedDateWithTime } from "../../../services/commonFunction";
import {
  reportConfigGetApi,
  ccCertGetApi,
  reportHeaderFooterCreateApi,
  reportConfigDeleteApi,
  documentDeleteApi,
  folderCreateApi,
  documentCreateApi,
  bulk_cc_update_to_trans_userAPI,
  bulk_ic_update_to_trans_userAPI,
  getReportConfigApi,
  ccCertDeleteApi,
  reportConfigCreateApi,
  reportConfigUpdateApi
} from "../../../services/api";
import { getSingleQualityAnalysisData } from "./operations/RakeHandlerOperation";

import { encryptDataForURL, decryptDataForURL } from "../../../utills/useCryptoUtils";


export const getReportConfig = async (EditRecordId, EditSubRecordId, configCertStatusRPCID, setFormData, setSequence) => {
  let payload = {
    ji_id: EditRecordId,
    jis_id: EditSubRecordId,
    rpc_id: configCertStatusRPCID,
  };
  let res = await postDataFromApi(reportConfigGetApi, payload);

  if (res?.data.status === 200) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        1: {
          ...prevFormData[1],
          rpc_from_date: res.data.data?.report_configuration.rpc_from_date,
          rpc_to_date: res.data.data?.report_configuration.rpc_to_date,
          rpc_is_lot_no: res.data.data?.report_configuration.rpc_is_lot_no
            ? ["Lot Wise"]
            : [],
          rpc_is_smpl_qty: res.data.data?.report_configuration.rpc_is_smpl_qty
            ? ["Sample Quantity"]
            : false,
          rpc_is_total_no: res.data.data?.report_configuration.rpc_is_total_no
            ? ["Total Number"]
            : false,
          rpc_is_qty: res.data.data?.report_configuration.rpc_is_qty
            ? ["Quantity"]
            : false,
          rpc_is_smpl_wghtorunit: res.data.data?.report_configuration
            .rpc_is_smpl_wghtorunit
            ? ["Sample Weight / Unit"]
            : false,
          rpc_is_total_qty: res.data.data?.report_configuration
            .rpc_is_total_qty
            ? ["Quantity Total"]
            : false,
          rpc_is_smpl_mark: res.data.data?.report_configuration
            .rpc_is_smpl_mark
            ? ["Sample Mark"]
            : false,
          rpc_is_smpl_type: res.data.data?.report_configuration
            .rpc_is_smpl_type
            ? ["Sample Type"]
            : false,
          rpc_is_smpl_total: res.data.data?.report_configuration
            .rpc_is_smpl_total
            ? ["Sample Total"]
            : false,
          rpc_is_dos: res.data.data?.report_configuration.rpc_is_dos
            ? ["Date of Sampling"]
            : false,
          rpc_is_wght_avg: res.data.data?.report_configuration.rpc_is_wght_avg
            ? ["Weighted Avg."]
            : false,
          rpc_is_lotwise_wght_avg: res.data.data?.report_configuration.rpc_is_lotwise_wght_avg
            ? ["Weighted Avg."]
            : false,
          rpc_is_lotwise_qty: res.data.data?.report_configuration.rpc_is_lotwise_qty
            ? ["Lot Quantity"]
            : false,
          rpc_is_appendix: res.data.data?.report_configuration.rpc_is_appendix
            ? ["Appendix"]
            : false,
          rpc_is_size_analysis: res.data.data?.report_configuration.rpc_is_size_analysis
            ? ["Size Analysis"]
            : false,
          rpc_is_sample_specs: res.data.data?.report_configuration.rpc_is_sample_specs
            ? ["Sample Specification"]
            : false,
          rpc_is_smpl_spec_lotno: res.data.data?.report_configuration.rpc_is_smpl_spec_lotno
            ? ["Lot No"]
            : false,
          rpc_is_lotwise_qty: res.data.data?.report_configuration.rpc_is_lotwise_qty
            ? ["Lot Quantity"]
            : false,
          rpc_is_lotwise_sample_qty: res.data.data?.report_configuration.rpc_is_lotwise_sample_qty
            ? ["Sample Quantity"]
            : false,
          rpc_is_lotwise_smpl_mark: res.data.data?.report_configuration.rpc_is_lotwise_smpl_mark
            ? ["Client Sample Mark"]
            : false,
          rpc_is_other_config: res.data.data?.report_configuration.rpc_is_other_config
            ? ["Others"]
            : false,
          rpc_is_dual_port: res.data.data?.report_configuration.rpc_is_dual_port
            ? ["Dual Port 2nd"]
            : false,
          rpc_is_dual_port_combined: res.data.data?.report_configuration.rpc_is_dual_port_combined
            ? ["Dual Port Combined"]
            : false,
          rpc_is_eis_format: res.data.data?.report_configuration.rpc_is_eis_format
            ? ["EIC Format"]
            : false,
          rpc_weighted_certno: res.data.data?.report_configuration.rpc_weighted_certno
            ? ["Weighted Certificate"]
            : false,

          rpc_is_sequence: res.data.data?.report_configuration.rpc_is_sequence
            ? ["Sequence"]
            : false,
          rpc_weight_avg_seq: res.data.data?.report_configuration.rpc_weight_avg_seq
            ? ["Sequence of the sections- Weighted Average"]
            : false,
          rpc_lotwise_seq: res.data.data?.report_configuration.rpc_lotwise_seq
            ? ["Sequence of the sections- Lot wise"]
            : false,
          rpc_sample_spec_seq: res.data.data?.report_configuration.rpc_sample_spec_seq
            ? ["Sequence of the sections- Sample Specifications"]
            : false,
          //new Added
          rpc_is_wt_sample_mark: res.data.data?.report_configuration.rpc_is_wt_sample_mark
            ? ["Client Sample Mark"]
            : false,
          rpc_is_annexure: res.data.data?.report_configuration.rpc_is_annexure
            ? ["Is Annexure"]
            : false,
          rpc_is_lotwise_lot_no: res.data.data?.report_configuration.rpc_is_lotwise_lot_no
            ? ["Lot No."]
            : false,
          rpc_is_smpl_sa_lowise: res.data.data?.report_configuration.rpc_is_smpl_sa_lowise
            ? ["Lot wise size analysis"]
            : false,
          rpc_is_sa_weighted_avg: res.data.data?.report_configuration.rpc_is_sa_weighted_avg
            ? ["Weighted Avg."]
            : false,
          rpc_is_other_remark: res.data.data?.report_configuration.rpc_is_other_remark
            ? ["Remark"]
            : false,
          rpc_is_other_work_dt: res.data.data?.report_configuration.rpc_is_other_work_dt
            ? ["Work Order & Dt."]
            : false,
          rpc_is_sequence_size_analysis: res.data.data?.report_configuration.rpc_is_sequence_size_analysis
            ? ["Size Analysis"]
            : false,
        },
      };
    });
    const sequenceKeys = ["rpc_weight_avg_seq", "rpc_lotwise_seq", "rpc_sample_spec_seq"];
    const nameToBeAddedSequence = sequenceKeys
      .map(key => ({
        name: key,
        value: res.data.data?.report_configuration[key] // Get the value
      }))
      .filter(item => item.value !== undefined && item.value !== null && item.value !== -1) // Exclude empty, null, or -1
      .sort((a, b) => a.value - b.value)
      .map(item => item.name);
    setSequence(nameToBeAddedSequence);

  }
};

export const getCommercialCertificateSingle = async (
  EditRecordId,
  JISID,
  RPCID,
  setFormData,
  formData,
  formConfig,
  setIsOverlayLoader,
  TMLType,
  setNewExtraFields,
  isUseForPhysical
) => {
  let payload = {
    ji_id: EditRecordId,
    jis_id: JISID,
    cc_id: RPCID,
  };
  let res = await postDataFromApi(ccCertGetApi, payload);
  if (res.data.status === 200) {
    let extrafields = {}
    if (res?.data?.data?.cc_additional_headers) {
      let index = 0
      for (let obj in res?.data?.data?.cc_additional_headers) {
        const fieldName = "new_extra_field";
        extrafields[fieldName + '_label_' + index] = obj
        extrafields[fieldName + '_value_' + index] = res?.data?.data?.cc_additional_headers[obj]?.value
        extrafields[fieldName + '_chk_' + index] = res?.data?.data?.cc_additional_headers[obj]?.isChecked
        index++
      }
      setNewExtraFields(index)
    }
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        0: {
          ...prevFormData[0],
          ...res?.data?.data,
          ...res.data.data?.rpc_details,
          cert_number: res?.data?.data?.cc_certificatenumber,
          ji_reference_number: res?.data?.data?.cc_refencenumber,
          ji_date: res?.data?.data?.cc_date,
          ji_sub_commodity_name: res?.data?.data?.cc_commodity,
          cc_accountof: res?.data?.data?.cc_accountof,
          cc_eia: res?.data?.data?.cc_eia,
          jrf_header: res?.data?.data?.cc_topheader,
          jrf_bottom: res?.data?.data?.cc_bottomheader,
          cc_show_rounded_qty: res?.data?.data?.cc_show_rounded_qty ? [true] : [],
          cc_is_hide_basis: res?.data?.data?.cc_is_hide_basis ? [true] : [],
          cc_is_qty_display: res?.data?.data?.cc_is_qty_display ? [true] : [],
          cc_is_rake_details: res?.data?.data?.cc_is_rake_details ? [true] : [],
          fk_commodityid: res?.data?.data?.commodity_details?.commodity_id,
          operation_type_code: res?.data?.data?.operationmode?.ops_code,
          cc_place_of_work_name: res?.data?.data?.place_of_work?.pow_name,
          cc_is_other_format: res?.data?.data?.cc_is_other_format ? [true] : [],
          fk_cc_cert_format_label: res?.data?.data?.cc_cert_format_details?.client_certificate_format_code,
          ...res?.data?.data?.cc_certijsondata,
          ...extrafields
        },
      };
    });
    if (getRakeCollectionActivity(1).includes(res?.data?.data?.activity_code.toLowerCase())) {
      getSingleQualityAnalysisData(
        JISID,
        formData,
        setIsOverlayLoader,
        setFormData,
        formConfig,
        EditRecordId,
        res?.data?.data?.fk_cert_config_id,
        isUseForPhysical,
        RPCID
      );
    }
  }
};

export const getCommercialCertificateTopBottom = async (setFormData, EditRecordId, OperationType, JISID, setNewExtraFields) => {
  let payload = {
    "ji_id": EditRecordId,
    "jis_id": JISID
  };
  // 1	"VL_QA"
  // 2	"VL_SV"
  // 3	"VL_HH"
  // 4	"VL_DS"
  // 5	"VL_TML"
  // 6	"VL_PSI"

  if ([getVesselOperation("QA"), getPlantOperations('VL')].includes(OperationType)) {
    payload.rhf_type = "QA"
    payload.rhf_id = 1
  }
  else if (OperationType === getVesselOperation("SV")) {
    payload.rhf_type = "SV"
    payload.rhf_id = 2

  }
  else if (OperationType === getVesselOperation("HH")) {
    payload.rhf_type = "HH"
    payload.rhf_id = 3
  } else if (OperationType === getVesselOperation("DS")) {
    payload.rhf_type = "DS"
    payload.rhf_id = 4
  }
  // else if (getVesselOperation().includes(OperationType)) {
  //   payload.rhf_type = "QA"
  //   payload.rhf_id = 1
  // }
  else {
    payload.rhf_type = "QA"
    payload.rhf_id = 1
  }

  let res = await postDataFromApi(reportHeaderFooterCreateApi, payload);
  if (res.data.status === 200) {
    setFormData((prevFormData) => {
      let extrafields = {}
      if (res?.data?.data?.additional_headers) {
        let index = 0
        for (let obj in res?.data?.data?.additional_headers) {
          const fieldName = "new_extra_field";
          extrafields[fieldName + '_label_' + index] = obj
          extrafields[fieldName + '_value_' + index] = res?.data?.data?.additional_headers[obj]
          extrafields[fieldName + '_chk_' + index] = res?.data?.data?.additional_headers[obj] ? true : false
          index++
        }
        setNewExtraFields(index)
      }

      return {
        ...prevFormData,
        0: {
          ...prevFormData[0],
          ...res?.data?.data,
          jrf_header: res?.data?.data?.header,
          jrf_bottom: res?.data?.data?.footer,
          ...extrafields,
        },
      };
    });
  }
};

export const handleVesselOperationDelete = async (
  row,
  setIsDelete,
  getAllListingData,
  setPopupIndex
) => {
  let deleteBody = {
    "rpc_id": row?.rpc_id,
    "ji_id": row?.fk_jiid,
    "jis_id": row?.fk_jisid
  }
  let res = await deleteDataFromApi(reportConfigDeleteApi, deleteBody);

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


export const handleDocumentDelete = async (
  row,
  setIsDelete,
  getAllListingData,
  setPopupIndex
) => {
  let deleteBody = {
    id: row.dl_id,
  }
  let res = await deleteDataFromApi(documentDeleteApi, deleteBody);

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

export const handleCommonUploadFile = async (formData, fileUrl, setUploadPopup, EditGeneratedCertificate, JISID, OperationType, navigate) => {
  let folderPayload = {
    data: {
      // "fd_name": "27C2425A01VL0028"
      fd_name: formData[0]?.ji_reference_number,
    },
    parent_folder: "commercial_certificate",
  };
  let folderRes = await postDataFromApi(folderCreateApi, folderPayload);
  let FolderID;

  if (folderRes.data.status === 201 || folderRes.data.status === 200) {
    FolderID = folderRes?.data?.data.fd_id;
  } else {
    FolderID = folderRes?.data?.message?.existing_folder_id;
  }
  if (FolderID) {
    let payload = {
      data: {
        dl_folder: FolderID,
        // dl_sub_folder: 6,
        dl_module: "commercial_certificate",
        dl_document_name: formData[0].dl_document_name,
        dl_discription: formData[0].dl_discription,
        dl_document_reference: JISID,
        dl_document_jisid: JISID,
        dl_type: "Document Type",
        dl_show_to_all: true,
        dl_s3_url: fileUrl,
        dl_version: "1.0",
        dl_file_type: "External Certificate",
        dl_date_uploaded: new Date(),
        dl_status: "Active",
        fk_cc_id: formData[0]?.cc_id
        // dl_assigned_to: "Assigned User",
        // document_type:"External Certificate",
        // doc_ref_id: JISID
      },
    };

    try {

      if (!formData[0].dl_document_name || !formData[0].dl_discription) {
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
        if ([200, 201].includes(documentResponse?.data?.status)) {
          setUploadPopup(false);
          // generateCertificate("uploadedDocument", "posted", 1);
          EditGeneratedCertificate("posted", 1);

          setTimeout(() => {
            // navigate(
            //   `/operation/vessel-ji-list/vessel-list/commercial-certificate-preview/${encryptDataForURL(
            //     JISID
            //   )}/${encryptDataForURL(formData[0]?.cc_id)}` +
            //   "?OperationType=" +
            //   encryptDataForURL(OperationType) + "&isExternal=" + encryptDataForURL(1)
            // );
            toast.success(
              documentResponse.data?.message || "Document Created Successfully"
            );
          }, 250);
        }
      }
    } finally {
    }
  }
};
export const handleTransferCertificateOwnershipHandler = async (ccIds, customFormData, getAllListingData, setIsCustomPopup, clearbtnfunc, setIsOverlayLoader, moduleType) => {
  const fieldValue = moduleType === "internalcertificate" ? customFormData[0]?.fk_ic_certificate_transfered_to : customFormData[0]?.fk_certificate_transfered_to
  if (!fieldValue) {
    toast.error("Please select user", {
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
  try {

    setIsOverlayLoader(true)
    let payload = {}
    let res
    if (moduleType === "internalcertificate") {
      payload = {
        bulkICIDs: ccIds,
        fk_ic_certificate_transfered_to: customFormData[0]?.fk_ic_certificate_transfered_to
      };
      res = await postDataFromApi(bulk_ic_update_to_trans_userAPI, payload);
    }
    else {
      payload = {
        bulkCCIDs: ccIds,
        fk_certificate_transfered_to: customFormData[0]?.fk_certificate_transfered_to
      };
      res = await postDataFromApi(bulk_cc_update_to_trans_userAPI, payload);
    }

    if (res.data.status === 200) {
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
      clearbtnfunc()
      getAllListingData();
    }
  }
  finally {
    setIsCustomPopup(false)
    setIsOverlayLoader(false)
  }
}

export const getConfigDatabyji_jis_id = async (ji_id, jis_id, setFormData, configCertStatusRPCID) => {
  try {
    let payload = {
      ji_id: ji_id,
      jis_id: jis_id,
      rpc_id: configCertStatusRPCID,
    };

    let res = await postDataFromApi(reportConfigGetApi, payload);
    if (res?.data.status === 200) {
      if (res?.data?.data?.report_configuration?.rpc_is_other_remark) {
        setFormData((formdata) => {
          return {
            ...formdata,
            0: {
              ...formdata[0],
              rpc_is_other_remark: true
            }
          }
        })
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const handleCommercialCertDelete = async (
  cc_id,
  setIsDelete,
  getAllListingData,
  setPopupIndex,
  row
) => {
  try {
    let deleteBody = {
      cc_id: cc_id,
      is_non_lms: !getLMSOperationActivity().includes(getActivityCode(row?.activity_code).toLowerCase()) && !row?.cc_is_external
    };
    // console.log('ttt',deleteBody)
    // return
    let res = await postDataFromApi(ccCertDeleteApi, deleteBody);

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
  }
  catch (e) {

  }
  finally {
    setIsDelete(false);
    setPopupIndex(-1);
    getAllListingData();

  }

};

export const handleConfigSave = async (type, formData, setIsOverlayLoader, sequence, EditSubRecordId, configCertStatus, EditRecordId, configCertStatusRPCID, setTabOpenSecond, setFormData) => {
  try {
    setIsOverlayLoader(true)
    const payload = {
      report_configuration: {
        // Weighted Average
        rpc_is_wght_avg: !!formData?.[1]?.rpc_is_wght_avg?.length,
        rpc_is_appendix: !!formData?.[1]?.rpc_is_appendix?.length,
        rpc_is_wt_sample_mark: !!formData?.[1]?.rpc_is_wt_sample_mark?.length,//new added
        rpc_is_annexure: !!formData?.[1]?.rpc_is_annexure?.length,//new added

        // Lot-Wise
        rpc_is_lot_no: !!formData?.[1]?.rpc_is_lot_no?.length,
        rpc_is_lotwise_wght_avg: !!formData?.[1]?.rpc_is_lotwise_wght_avg?.length,
        rpc_is_lotwise_qty: !!formData?.[1]?.rpc_is_lotwise_qty?.length,
        rpc_is_lotwise_sample_qty: !!formData?.[1]?.rpc_is_lotwise_sample_qty?.length,
        rpc_is_lotwise_smpl_mark: !!formData?.[1]?.rpc_is_lotwise_smpl_mark?.length,
        rpc_is_lotwise_lot_no: !!formData?.[1]?.rpc_is_lotwise_lot_no?.length, //new added

        // Sample Specs
        rpc_is_sample_specs: !!formData?.[1]?.rpc_is_sample_specs?.length,
        rpc_is_smpl_spec_lotno: !!formData?.[1]?.rpc_is_smpl_spec_lotno?.length,
        rpc_is_qty: !!formData?.[1]?.rpc_is_qty?.length,
        rpc_is_smpl_mark: !!formData?.[1]?.rpc_is_smpl_mark?.length,
        rpc_is_dos: !!formData?.[1]?.rpc_is_dos?.length,
        rpc_is_smpl_qty: !!formData?.[1]?.rpc_is_smpl_qty?.length,
        rpc_is_smpl_wghtorunit: !!formData?.[1]?.rpc_is_smpl_wghtorunit?.length,
        rpc_is_smpl_type: !!formData?.[1]?.rpc_is_smpl_type?.length,

        // Size Analysis
        rpc_is_other_config: !!formData?.[1]?.rpc_is_other_config?.length,
        rpc_is_size_analysis: !!formData?.[1]?.rpc_is_size_analysis?.length,
        rpc_is_dual_port: !!formData?.[1]?.rpc_is_dual_port?.length,
        rpc_is_dual_port_combined: !!formData?.[1]?.rpc_is_dual_port_combined?.length,
        rpc_is_eis_format: !!formData?.[1]?.rpc_is_eis_format?.length,
        rpc_weighted_certno: !!formData?.[1]?.rpc_weighted_certno?.length,
        rpc_is_smpl_sa_lowise: !!formData?.[1]?.rpc_is_smpl_sa_lowise?.length, //New Added
        rpc_is_sa_weighted_avg: !!formData?.[1]?.rpc_is_sa_weighted_avg?.length, //New Added
        rpc_is_other_remark: !!formData?.[1]?.rpc_is_other_remark?.length, //New Added
        rpc_is_other_work_dt: !!formData?.[1]?.rpc_is_other_work_dt?.length, //New Added
        rpc_is_sequence_size_analysis: !!formData?.[1]?.rpc_is_sequence_size_analysis?.length, //New Added


        // Other Selections
        rpc_is_sequence: !!formData?.[1]?.rpc_is_sequence?.length,
        rpc_weight_avg_seq: sequence.indexOf("rpc_weight_avg_seq") >= 0 ? sequence.indexOf("rpc_weight_avg_seq") + 1 : null,
        rpc_lotwise_seq: sequence.indexOf("rpc_lotwise_seq") >= 0 ? sequence.indexOf("rpc_lotwise_seq") + 1 : null,
        rpc_sample_spec_seq: sequence.indexOf("rpc_sample_spec_seq") >= 0 ? sequence.indexOf("rpc_sample_spec_seq") + 1 : null,



        fk_jiid: formData[0]?.ji_id,
        fk_jisid: EditSubRecordId,
        status: configCertStatus,
        tenant: GetTenantDetails(1),
      },
    };

    let res;
    if (type === "Save") {
      res = await postDataFromApi(reportConfigCreateApi, payload);
    } else {
      payload.rpc_id = configCertStatusRPCID || formData[0]?.rpc_id;
      payload.ji_id = EditRecordId;
      payload.jis_id = EditSubRecordId;
      res = await putDataFromApi(reportConfigUpdateApi, payload);
    }
    if (res?.data && res?.data?.status === 200) {
      setTabOpenSecond(true);
      if (type === "Save") {
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            0: {
              ...prevFormData[0],
              rpc_id: res.data.data?.rpc_id,
            },
          };
        });
      } else {
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            0: {
              ...prevFormData[0],
              temp_option_change: new Date(),
            },
          };
        });
      }

      toast.success(res?.data?.message, {
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
      toast.error(res?.message, {
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
  }
  finally {
    setIsOverlayLoader(false)
  }
}