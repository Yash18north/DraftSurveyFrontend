import React, { useEffect, useState } from "react";
import { deleteDataFromApi, getDataFromApi, postDataFromApi } from "../../services/commonServices";
import { documentDeleteApi, testReportDetailsApi } from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { decryptDataForURL } from "../../utills/useCryptoUtils";
import Loading from "../../components/common/OverlayLoading";
import {
  InternalCertificateGetPDFApi,
} from "../../services/api";
import { getCertificateDetailsById } from "../../components/common/commonHandlerFunction/intenralCertificateHandlerFunction";
import { useSelector } from "react-redux";
const PDFViewer = () => {
  let { icID } = useParams();
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true); // Loader state
  // Ensure icID is decrypted
  icID = decryptDataForURL(icID);
  const hash = window.location.hash;
  const params = new URLSearchParams(hash.split("?")[1]);
  const ReferenceNo = decryptDataForURL(params.get("ReferenceNo")) || "";
  const [testMemoId, setTestMemoId] = useState("");
  const [responsedata, setResponseData] = useState("");
  const [labDetails, setLabDetails] = useState("");
  const [isPDFDownload, setIsPDFDownload] = useState(false);
  const [nonScopeData, setNonScopeData] = useState([]);
  const [scopeData, setScopeData] = useState([]);
  const session = useSelector((state) => state.session);
  const user = session.user;
  useEffect(() => {
    getCertificateDetailsById(icID, null, setResponseData, setTestMemoId, 1);
  }, [icID]);
  useEffect(() => {
    if (testMemoId) {
      getTestReportDetails(testMemoId, 'scope');
      getTestReportDetails(testMemoId, 'non_scope');
    }
  }, [testMemoId]);
  const getTestReportDetails = async (id, scopType) => {
    try {
      const bodyToPass = {
        test_memo_id: id,
        context: scopType,
      };
      let res = await postDataFromApi(testReportDetailsApi, bodyToPass);
      if (res?.data?.status === 200) {
        const actualResponse = res.data.data;
        setLabDetails(actualResponse.lab_detail);
        if (scopType === "scope") {
          setScopeData(actualResponse.sample_sets);
        } else {
          setNonScopeData(actualResponse.sample_sets);
        }
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let payload, generateCertificateResponse;

        payload = {
          ic_id: icID
        };
        generateCertificateResponse = await postDataFromApi(
          InternalCertificateGetPDFApi,
          payload,
          "",
          true,
          "",
          ""
        );
        if (generateCertificateResponse && generateCertificateResponse.data) {
          // Create a URL for the PDF Blob data
          const pdfBlob = new Blob([generateCertificateResponse.data], { type: "application/pdf" });
          const pdfUrl = URL.createObjectURL(pdfBlob);
          setPdfUrl(pdfUrl);
        }
      } catch (error) {
        console.error("Error fetching PDF:", error);
      }
    };
    fetchData();
  }, [icID]);
  const getPdfName = () => {
    let pdfFileName = `${responsedata.ic_ulrno}`;
    if (scopeData.length === 0) {
      if (nonScopeData.length === 1 && nonScopeData[0].samples.length === 1) {
        pdfFileName = nonScopeData[0].samples[0].sample_code;
      } else {
        // const firstValue = nonScopeData[0].samples[0].sample_code
        // const secondValue = nonScopeData[nonScopeData.length - 1].samples[nonScopeData[nonScopeData.length - 1].samples.length - 1].sample_code
        // pdfFileName = firstValue.slice(-4) + '_' + secondValue.slice(-4)

        const firstValue =
          nonScopeData[0].samples[0].sample_code +
          (labDetails?.lab_is_compliant ? "A" : "");
        pdfFileName = firstValue;
      }
    }
    return pdfFileName + ".pdf";
  };
  return (
    <div className="testPreviewContainer">
      {pdfUrl ? (
        <iframe
          src={`${pdfUrl}#view=FitH&navpanes=0&toolbar=0&scrollbar=0`}
          style={{
            width: "65%",
            height: "100%",
            display: "block",
            border: "none",
            padding: "0",
            margin: "0",
          }}
          title="PDF Viewer"
          onLoad={() => setLoading(false)} // Hide loader when iframe loads
        ></iframe>
      ) : <Loading fullScreen={true} />}
      {responsedata.status === "publish" && user?.role!="SU" && <div className="autoWidthImportantLeft">
        <button
          type="button"
          className="submitBtn btn btn-primary"
          onClick={() => {
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = getPdfName();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          aria-label="Download PDF"
        >
          Download
        </button>
      </div>}
    </div>
  );
};
export default PDFViewer;
