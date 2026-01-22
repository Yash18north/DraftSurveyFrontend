import React from "react";
import { formatDate } from "../../../services/commonFunction";
import PropTypes from "prop-types";

import PdfIcon from "../../../assets/images/icons/PdfIconUI.svg";
import WordIcon from "../../../assets/images/icons/wordIcon.png";
import ExcelIcon from "../../../assets/images/icons/excelIcon.png";
import ImgIcon from "../../../assets/images/icons/imgIcon.png";

// import { Document, Page } from "react-pdf";

const GridView = ({
  documentList,
  setSelectedDoc,
  popupIntentionallyOpenedRef,
  setPopupIndex,
  popupOptionsRef,
  popupIndex,
  PopupOptions,
  section,
  filteredAction,
  getAllSubListingdata,
  moduleType,
  formConfig,
  responseData,
  isBottom,
  getStatus,
  setDontClick,
  setPopupType,
  handleMultiFile,
  multipleUrls
}) => {
  function renderDocumentPreview(doc) {
    const fileType = doc?.dl_s3_url?.split(".").pop()?.toLowerCase() || "";

    // IMAGE THUMBNAIL
    if (["jpg", "jpeg", "png"].includes(fileType)) {
      return (
        <img
          src={doc?.dl_s3_url}
          alt={doc?.dl_document_name}
          className="document-thumbnail"
        />
      );
    }

    // PDF PREVIEW
    // if (fileType === "pdf") {
    //   return (
    //     <div className="document-thumbnail pdf-preview">
    //       <Document file={doc?.dl_s3_url}>
    //         <Page pageNumber={1} width={120} />
    //       </Document>
    //     </div>
    //   );
    // }

    // WORD / EXCEL PREVIEW
    // if (["doc", "docx", "xls", "xlsx", "csv"].includes(fileType)) {
    //   return (
    //     <iframe
    //       src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
    //         doc.dl_s3_url
    //       )}`}
    //       width="100%"
    //       height="120px"
    //       title={doc?.dl_document_name}
    //       className="document-thumbnail"
    //       style={{ border: "none" }}
    //     />
    //   );
    // }

    // FALLBACK ICON
    const iconSrc = (() => {
      switch (fileType) {
        case "pdf":
          return PdfIcon;
        case "doc":
        case "docx":
          return WordIcon;
        case "xls":
        case "xlsx":
        case "csv":
          return ExcelIcon;
        default:
          return ImgIcon;
      }
    })();

    return (
      <img
        src={iconSrc}
        alt={doc?.dl_document_name}
        className="document-thumbnail"
      />
    );
  }

  return (
    <div className="document-grid">
      {documentList?.map((doc, docIndex) => (
        <div key={docIndex} className="document-card">
          <div className="document-preview">
            {renderDocumentPreview(doc)}

            <div className="document-actions">
              <input
                type="checkbox"
                checked={multipleUrls.includes(doc.dl_s3_url)}
                onChange={(e) => handleMultiFile(e, doc,"dl_id")}
              />
              <button
                type="button"
                onClick={() => {
                  popupIntentionallyOpenedRef.current = true;
                  setPopupIndex((prevIndex) =>
                    prevIndex === docIndex ? -1 : docIndex
                  );
                  setSelectedDoc(doc);
                }}
                aria-label="Toggle popup"
                className="invisible-button"
              >
                <i className="bi bi-three-dots-vertical"></i>
              </button>

              {popupIndex === docIndex && (
                <span ref={popupOptionsRef}>
                  <PopupOptions
                    section={section}
                    popupActions={filteredAction}
                    setPopupIndex={setPopupIndex}
                    getAllSubListingdata={getAllSubListingdata}
                    id={
                      moduleType === "sampleinward"
                        ? doc["smpl_jrf_id"]
                        : doc["jrf_id"]
                    }
                    sampleInwardFormId={doc["smpl_inwrd_id"]}
                    row={doc}
                    formConfig={formConfig}
                    model={responseData.model}
                    isBottom={isBottom}
                    status={getStatus(formConfig, doc)}
                    setDontClick={setDontClick}
                    setPopupType={setPopupType}
                  />
                </span>
              )}
            </div>
          </div>

          <div className="document-info">
            <span className="document-name" title={doc?.dl_document_name}>
              {doc?.dl_document_name}
            </span>
            <span className="document-date">
              {formatDate(doc?.dl_created_at)}
            </span>
            <span className="document-description">
              {doc?.dl_discription}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

GridView.propTypes = {
  documentList: PropTypes.array.isRequired,
};

export default GridView;
