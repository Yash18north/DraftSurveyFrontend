import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  postDataFromApi,
} from "../../../services/commonServices";
import {
  documentCreateApi,
  folderCreateApi,
} from "../../../services/api";
import {
  decryptDataForURL,
} from "../../../utills/useCryptoUtils";
import { useDispatch } from 'react-redux';
import { getMailBodyDetails, getMailSubjectDetails, handleCommonDownloadFile } from "../../../services/commonFunction";

const InvoicePreviewButtons = ({ moduleType }) => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  let { EditRecordId, s3URL, invoiceNumber } = useParams();
  [EditRecordId, s3URL, invoiceNumber] = [EditRecordId, s3URL, invoiceNumber].map(
    (item) => (item ? decryptDataForURL(item) : "")
  );
  const hash = window.location.hash;
  const params = new URLSearchParams(hash.split("?")[1]);
  const handleShare = async () => {
    let folderPayload = {
      data: {
        fd_name: invoiceNumber,
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
          dl_module: "commercial_certificate",
          dl_document_name: invoiceNumber,
          dl_discription: invoiceNumber,
          dl_document_reference: EditRecordId,
          dl_type: "Document Type",
          dl_show_to_all: true,
          dl_s3_url: s3URL,
          dl_version: "1.0",
          dl_file_type: "Invoice",
          dl_date_uploaded: new Date(),
          dl_status: "Active",
          // dl_assigned_to: "Assigned User",
          // document_type: "invoice_doc",
          // doc_ref_id: EditRecordId
        },
      };

      try {
        let documentResponse = await postDataFromApi(
          documentCreateApi,
          payload
        );
        if ([200, 201, 400].includes(documentResponse?.data?.status)) {
          dispatch(
            {
              type: "SHARED_FILES",
              shareFileModule: "invoice",
              selectedMultiDocs: [documentResponse?.data?.data],
              ccMailSubject: getMailSubjectDetails(null, documentResponse?.data?.data),
              ccMailBody: getMailBodyDetails(null, documentResponse?.data?.data),
            }
          );
          navigate("/operation/ShareFiles")
        }
      } catch (e) {
      }
    }

  }
  const handleDownload = () => {
    const documentName = decryptDataForURL(params.get("documentName"))
    if (documentName) {
      handleCommonDownloadFile(s3URL, documentName)
    }
    else {
      const link = document.createElement("a");
      link.href = s3URL;
      link.download = "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="submit_btns">
      <button
        className="cancelBtn"
        type="button"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      {moduleType === "invoicePreview" && <button
        className="saveBtn"
        type="button"
        onClick={() => handleShare()}
      >
        Share
      </button>}
      <button
        className="saveBtn"
        type="button"
        onClick={() => handleDownload()}
      >
        Download
      </button>
    </div>
  );
};


export default InvoicePreviewButtons;