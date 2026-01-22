import React, { useState, useEffect } from "react";
import { getDataFromApi, postDataFromApi } from "../../../services/commonServices";
import { useParams } from "react-router-dom";
import Loading from "../Loading";
import {
  decryptDataForURL,
  encryptDataForURL,
} from "../../../utills/useCryptoUtils";
import {
  getJIsowandactivityApi,
  getReportConfigApi,
  getCommercialCertificateListApi,
  documentUpdate,
  documentShareCreate,
  documentListApi,
  documentDeleteApi,
  folderCreateApi,
  ccUpdateApi,
  dsSurveyPdfApi,
  ccCertPdfApi,
  mergeFilesApi,
  masterUploadApi,
  rakeQAPdfApi, truckQA2PdfApi, truckQAPdfApi, stackQAPdfApi, truckCSPdfApi,
  plantQAPdfApi,
  physicalAnalysisPDF,
  tmlMoisturePDFApi
} from "../../../services/api";
import { downLoadNonLMSCertificatePDFById } from "../commonHandlerFunction/OPscertificate/OPSCertificateHandlerFunctions";
import { getLMSOperationActivity, getVesselOperation, getTruckOperations, getRakeOperations, getStackOperations, getPlantOperations, getActivityCode } from "../../../services/commonFunction";

const Preview = ({ pdfUrl, setPdfUrl, IsPreviewUpload, setSharingPdfUrl, label, isCustom, apiUrl, apiMethod, apiPayload }) => {
  let { EditRecordId, EditSubRecordId, s3URL } = useParams();
  [EditRecordId, EditSubRecordId] = [EditRecordId, EditSubRecordId].map(
    (item) => (item ? decryptDataForURL(item) : "")
  );
  const hash = window.location.hash;

  const params = new URLSearchParams(hash.split("?")[1]);
  let isExternal = decryptDataForURL(params.get("isExternal"));
  let OperationType = decryptDataForURL(params.get("OperationType"));
  let isUseForPhysical = decryptDataForURL(params.get("isUseForPhysical"));
  OperationType = getActivityCode(OperationType)
  OperationType = OperationType && OperationType.toLowerCase() != "othertpi" ? OperationType.toLowerCase() : OperationType
  const opsTypeID = decryptDataForURL(params.get("activityJIID"));
  const ReferenceNo = decryptDataForURL(params.get("ReferenceNo")) || "";
  const CCID = decryptDataForURL(params.get("CCID")) || "";
  const getNameOfPDF = (OperationType) => {
    if (OperationType === getVesselOperation("SV")) {
      const currentDate = new Date();
      const formatDate = (date) => {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${dd}${mm}${yyyy}${hours}${minutes}`;
      };
      return `VesselReport_${ReferenceNo}_${formatDate(currentDate)}.pdf`;
    }
    else if (OperationType) {
      return (OperationType + "_" + ReferenceNo + ".pdf")
    }
    else {
      return "certificate.pdf"
    }
  }


  const handleCreateCertificatePrint = async () => {
    let payload, res;
    if (
      getLMSOperationActivity().includes(OperationType)
    ) {
      payload = {
        ji_id: EditRecordId,
        cc_id: EditSubRecordId,
      };
      if (isUseForPhysical) {
        res = await postDataFromApi(physicalAnalysisPDF, payload, "", true, "", "");
      }
      else if (OperationType == getTruckOperations("DTM")) {
        res = await postDataFromApi(truckQAPdfApi, payload, "", true, "", "");
      }
      else if ([getPlantOperations("TR"), getTruckOperations("QS")].includes(OperationType)) {
        res = await postDataFromApi(truckQA2PdfApi, payload, "", true, "", "");
      }
      else if (OperationType == getTruckOperations("CS")) {
        res = await postDataFromApi(truckCSPdfApi, payload, "", true, "", "");
      }
      else if ([getPlantOperations("RK"), getRakeOperations('QA')].includes(OperationType)) {
        res = await postDataFromApi(rakeQAPdfApi, payload, "", true, "", "");
      }
      else if ([getPlantOperations("ST"), getStackOperations("PV"), getStackOperations()].includes(OperationType)) {
        res = await postDataFromApi(stackQAPdfApi, payload, "", true, "", "");
      }
      else if (OperationType == getVesselOperation("CS")) {
        res = await postDataFromApi(truckCSPdfApi, payload, "", true, "", "");
      }
      else if (OperationType == getVesselOperation('VL_TML_M')) {
        res = await postDataFromApi(tmlMoisturePDFApi, payload, "", true, "", "");
      }
      else {
        res = await postDataFromApi(ccCertPdfApi, payload, "", true, "", "");
      }
    }
    // else if ((OperationType === getVesselOperation("SV"))) {
    //   res = await downLoadNonLMSCertificatePDFById(
    //     OperationType,
    //     EditRecordId,
    //     EditSubRecordId
    //   );
    // } 
    else {
      res = await downLoadNonLMSCertificatePDFById(
        OperationType,
        EditRecordId,
        EditSubRecordId,
        "",
        opsTypeID
      );
    }
    if (res && res.data) {
      // Create a URL for the PDF Blob data
      const pdfBlob = new Blob([res.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl); // Set the PDF URL in state to display in the iframe

      let payload = new FormData();
      payload.append("document", pdfBlob, getNameOfPDF(OperationType));
      payload.append("model_type ", "commercial_certificate");
      payload.append("bypass_file_size_check ", true);
      payload.append("sub_folder", 6);
      if (IsPreviewUpload) {
        let uploadResponse = await postDataFromApi(
          masterUploadApi,
          payload,
          "TRUE"
        );
        if (uploadResponse.data.status === 200) {
          setSharingPdfUrl(uploadResponse.data?.data?.document);
        }
      }

    }
  };
  const [docS3URl, setDocS3URl] = useState("");
  const handleDocument = async (EditRecordId) => {
    let payload = {
      "dl_module": "commercial_certificate",
      "dl_document_reference": EditRecordId,
      "is_active": true,
      "tenant": 1
    }
    let res = await postDataFromApi("/documents/list/", payload);
    if (res.data.status === 200) {
      const singleDoc = res.data.data?.find((singleDoc) => CCID == singleDoc.fk_cc_id)
      let s3URL = res.data.data?.[0]?.dl_s3_url
      if (singleDoc) {
        s3URL = singleDoc?.dl_s3_url
      }
      setDocS3URl(s3URL);
    }
  }
  useEffect(() => {
    if (s3URL) {
      setDocS3URl(decryptDataForURL(s3URL))

    }
    else {
      if (isExternal) {
        handleDocument(EditRecordId)
      }
      else {
        if (isCustom) {
          getcustomPdfFileData();
        }
        else {
          handleCreateCertificatePrint();
        }
      }
    }

  }, [isExternal]);

  const getcustomPdfFileData = async () => {
    try {
      let res
      if (apiMethod === "GET") {
        res = await getDataFromApi(apiUrl, apiPayload, "");
      } else if (apiMethod === "POST") {
        res = await postDataFromApi(apiUrl, apiPayload, "", true, "", "");
      }
      if (res && res.data) {
        // Create a URL for the PDF Blob data
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(pdfUrl); // Set the PDF URL in state to display in the iframe

        let payload = new FormData();
        payload.append("document", pdfBlob, getNameOfPDF(OperationType));
        payload.append("model_type ", "commercial_certificate");
        payload.append("bypass_file_size_check ", true);
        payload.append("sub_folder", 6);
      }
    }
    finally {

    }
  }

  return (
    <div
      style={{ position: "relative" }}
      className={"form-group my-2 previewCommercialCertificate"}
    >
      <h1 className="previewCommercialCertificateHeading">{label || 'Certificate'}</h1>
      {docS3URl ?
        <div className={"w-100 d-inline-block mx-2"}>
          <iframe
            src={`https://docs.google.com/gview?url=${docS3URl}&embedded=true`}
            // src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(docS3URl)}`}
            // src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(docS3URl)}#toolbar=0`}
            name="custom_pdf_iframe"
            title="Custom PDF Preview"
            width="100%"
            height="1120px"
            frameBorder="0">
          </iframe>
        </div>
        :
        <div className={"w-100 d-inline-block mx-2"}>
          {pdfUrl ? (
            <iframe
              src={`${pdfUrl}#view=FitH&navpanes=0&toolbar=0&scrollbar=0`}
              title="Custom PDF Preview"
              name="custom_pdf_iframe"
              width="100%"
              height="1120px"
              style={{ border: "none", backgroundColor: "white" }}
            />
          ) : (
            <Loading />
          )}
        </div>
      }

    </div>
  );
};

export default Preview;