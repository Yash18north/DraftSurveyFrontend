import React from "react";
import { formatDate } from "../../../services/commonFunction";
import PropTypes from "prop-types";

import Pdf from "../../../assets/images/icons/PdfIconUI.svg";
import Word from "../../../assets/images/icons/wordIcon.png";
import Img from "../../../assets/images/icons/imgIcon.png";
import Excel from "../../../assets/images/icons/excelIcon.png";

const GridView = ({
  documentList,
  // listView,
  setSelectedDoc,
  popupIntentionallyOpenedRef,
  setPopupIndex,
  docIndex,
  popupOptionsRef,
  popupIndex,
  PopupOptions,          // Ensure PopupOptions is properly imported at the top of the file if needed
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
  doc
}) => {
  function renderDocumentIcon(doc) {
    const fileExtension = doc?.split("/").pop() || doc;
    switch (fileExtension) {
      case "pdf":
        return <img src={Pdf} height={32} width={32} alt="Pdf" />;
      case "doc":
      case "docx":
      case "vnd.oasis.opendocument.text":
        return <img src={Word} height={32} width={32} alt="Word" />;
      case "xls":
      case "xlsx":
      case "csv":
        return <img src={Excel} height={32} width={32} alt="Excel" />;
      case "jpg":
      case "jpeg":
      case "png":
        return <img src={Img} height={32} width={32} alt="Img" />;
      default:
        return <img src={Pdf} height={32} width={32} alt="Pdf" />;
    }
  }
  return (
    <div className="DocumentContainerJI">
      {documentList?.map((doc, docIndex) => (
        <div className="DocumentContainerItemJI">
          <div className="DocumentContainerHeaderJI">
            {
              renderDocumentIcon(
                doc?.dl_type
              )}
            <div className="d-flex">
              <input
                type="checkbox"
                onChange={(e) => handleMultiFile(e, doc)}
              />


              <div className="actionColumn maxWidth d-flex">
                <button
                  type="button"
                  onClick={() => {
                    popupIntentionallyOpenedRef.current = true; // Indicate the popup was intentionally opened
                    setPopupIndex((prevIndex) => {
                      return prevIndex === docIndex ? -1 : docIndex;
                    });
                    setSelectedDoc(doc);
                  }}
                  aria-label="Toggle popup"
                  className="invisible-button"
                >
                  <i className="bi bi-three-dots-vertical"></i>
                </button>
                <span ref={popupOptionsRef}>
                  {popupIndex === docIndex ? (
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
                  ) : null}
                </span>

              </div>
            </div>
          </div>

          <span className="documentContainerNameJI">
            <span className="truncate fileName">
              {doc?.dl_document_name}
            </span>
            {formatDate(
              doc.dl_created_at
            )}

          </span>
          <span className="documentContainerNameJI">
            {/* Description of File No 1 */}
            <span className="fileDescription">
              {doc?.dl_discription}
            </span>
          </span>

        </div>
      ))
      }
    </div >


  );
};


export default GridView;
