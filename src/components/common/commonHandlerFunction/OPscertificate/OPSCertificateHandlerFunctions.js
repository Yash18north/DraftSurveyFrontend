import { toast } from "react-toastify";
import {
  checkexistingCertinoApi,
  dsSurveyPdfApi,
  getDSApi,
  getHHApi,
  getSVApi,
  H_H_PdfApi,
  supervisionPdfApi,
  rakeAssessPdfApi,
  getQualityAssesmentApi,
  bulkCargoPDF,
  opsRakeSVPDFApi,
  opsStackSVPDFApi
} from "../../../../services/api";
import { postDataFromApi } from "../../../../services/commonServices";
import { getRakeOperations, getVesselOperation, getPlantOperations, getActivityCode, getStackOperations } from "../../../../services/commonFunction";


export const checkCettificateNoAvailibility = async (
  value,
  setIsOverlayLoader,
  setIsValideValue
) => {
  // let ref_regex = /^(?=.*[0-9])(?=.*[A-Za-z])[0-9A-Za-z]{16}$/;
  let ref_regex = /^[A-Z]\d{8}[A-Z]\d{4}(\((I|II|III|IV|V|VI|VII|VIII|IX|X)\))?$/
  // if (value.length != 14) {
  //   return;
  // } else 
  if (!ref_regex.test(value)) {
    setIsValideValue(false);
    // toast.error("Please enter valid value", {
    //   position: "top-right",
    //   autoClose: 2000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   progress: undefined,
    //   theme: "light",
    // });
    return;
  }
  try {
    let payload = {
      certificate_number: value,
    };
    setIsOverlayLoader(true);
    let res = await postDataFromApi(checkexistingCertinoApi, payload);
    if (res?.data?.status === 200) {
      setIsValideValue(true);
      toast.success(res.data?.message, {
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
      setIsValideValue(false);
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
  } finally {
    setIsOverlayLoader(false);
  }
};

export const getNonLMSDetailsById = async (OperationType, payload) => {
  let responseData;
  OperationType = getActivityCode(OperationType)
  OperationType = OperationType ? OperationType.toLowerCase() : OperationType
  if (OperationType === getVesselOperation("HH")) {
    responseData = await postDataFromApi(getHHApi, payload);
    if (responseData.data.status === 200) {
      responseData.data.data.opsvd_id = responseData.data.data.opsvhh_id;
    }
  } else if (OperationType === getVesselOperation("SV")) {
    responseData = await postDataFromApi(getSVApi, payload);
    if (responseData.data.status === 200) {
      responseData.data.data.opsvd_id = responseData.data.data.opsvsv_id;
    }
  } else if (OperationType === getRakeOperations("QAss")) {
    responseData = await postDataFromApi(getQualityAssesmentApi, payload);
    if (responseData.data.status === 200) {
      responseData.data.data.opsvd_id = responseData.data.data.rake_qas_id;
    }
  }
  else {
    responseData = await postDataFromApi(getDSApi, payload);
  }

  return responseData;
};

export const downLoadNonLMSCertificatePDFById = async (
  OperationType,
  OPSId,
  CCID,
  isHardCopy,
  opsTypeID
) => {
  let responseData;
  let payload;
  OperationType = getActivityCode(OperationType)
  OperationType = OperationType ? OperationType.toLowerCase() : OperationType
  if (OperationType === getVesselOperation("HH")) {
    payload = {
      hatch_hold_id: OPSId,
      cc_id: CCID,
      is_hard_copy: isHardCopy,
    };
    responseData = await postDataFromApi(H_H_PdfApi, payload, "", true, "", "");
  } else if (OperationType === getVesselOperation("SV")) {
    payload = {
      supervision_id: OPSId,
      // cc_id: CCID,,
      is_hard_copy: isHardCopy,
    };
    responseData = await postDataFromApi(
      supervisionPdfApi,
      payload,
      "",
      true,
      "",
      ""
    );
  } else if (OperationType === getRakeOperations("QAss")) {
    payload = {
      rake_qas_id: OPSId,
      cc_id: CCID,
      is_hard_copy: isHardCopy,
    };
    responseData = await postDataFromApi(
      rakeAssessPdfApi,
      payload,
      "",
      true,
      "",
      ""
    );
  } else if (OperationType === getVesselOperation('bulk_crg')) {
    payload = {
      ji_id: OPSId,
      cc_id: CCID,
      is_hard_copy: isHardCopy,
    };
    responseData = await postDataFromApi(
      bulkCargoPDF,
      payload,
      "",
      true,
      "",
      ""
    );
  }
  else if (OperationType === getRakeOperations("RK_SV")) {
    payload = {
      "ji_id": OPSId,
      cc_id: CCID,
      jis_id: opsTypeID,
      is_hard_copy: isHardCopy,
    }
    responseData = await postDataFromApi(
      opsRakeSVPDFApi,
      payload,
      "",
      true,
      "",
      ""
    );
  }
  else if (OperationType == getStackOperations('ST_SV')) {
    payload = {
      "ji_id": OPSId,
      cc_id: CCID,
      jis_id: opsTypeID,
      is_hard_copy: isHardCopy,
    }
    responseData = await postDataFromApi(opsStackSVPDFApi, payload, "", true, "", "");
  }
  else {
    payload = {
      opsvd_id: OPSId,
      cc_id: CCID,
      is_hard_copy: isHardCopy,
    };
    responseData = await postDataFromApi(
      dsSurveyPdfApi,
      payload,
      "",
      true,
      "",
      ""
    );
  }

  return responseData;
};
