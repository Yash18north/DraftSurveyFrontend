import React from "react";
import { formatDate } from "../../services/commonFunction";
import PropTypes from "prop-types";

const GridView = ({
  documentList,
  setOpenPopup,
  setSelectedDoc,
  renderDocumentIcon,
  PopupDocument,
  openPopup,
  actions,
  handleOptionClick,
  handlePrev,
  handleNext,
  currentPage,
  totalPage,
  getPaginationNo,
  listView,
}) => {
  return (
    <div className="DocumentFullPage">
      <div className="DocumentContainer">
        {documentList?.map((doc, docIndex) => (
          <div className="DocumentContainerItem">
            <div className="DocumentContainerHeader">
              <span className="truncate">
                {listView !== "Shared"
                  ? doc?.dl_document_name
                  : doc?.document?.dl_document_name}
              </span>
              <i
                className="bi bi-three-dots-vertical documentContainerIcon"
                onClick={() => {
                  setOpenPopup((prev) => (prev === -1 ? docIndex : -1));
                  setSelectedDoc(doc);
                }}
              ></i>
            </div>
            {renderDocumentIcon(
              listView !== "Shared" ? doc?.dl_type : doc?.document?.dl_type
            )}
            <span className="documentContainerName">
              {formatDate(
                listView !== "Shared" ? doc.dl_created_at : doc.ds_share_date
              )}
            </span>
            {openPopup === docIndex && (
              <PopupDocument
                handleOptionClick={handleOptionClick}
                actions={actions}
                doc={doc}
              />
            )}
          </div>
        ))}
      </div>
      <div className="previous_next_btns">
        <button
          type="button"
          onClick={() => handlePrev()}
          disabled={currentPage === 1}
          className={currentPage === 1 ? "disabled_btn" : null}
          aria-label="Previous Page"
        >
          <i className="bi bi-chevron-left" aria-hidden="true"></i>
        </button>

        {getPaginationNo()}

        <button
          type="button"
          onClick={() => handleNext()}
          disabled={currentPage === totalPage}
          className={currentPage === totalPage ? "disabled_btn" : null}
          aria-label="Next Page"
        >
          <i className="bi bi-chevron-right" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  );
};
GridView.propTypes = {
  documentList: PropTypes.array,
  setOpenPopup: PropTypes.func,
  setSelectedDoc: PropTypes.func,
  renderDocumentIcon: PropTypes.func,
  PopupDocument: PropTypes.element,
  openPopup: PropTypes.bool,
  actions: PropTypes.object,
  handleOptionClick: PropTypes.func,
  handlePrev: PropTypes.func,
  handleNext: PropTypes.func,
  currentPage: PropTypes.number,
  totalPage: PropTypes.number,
  getPaginationNo: PropTypes.func,
  listView: PropTypes.bool,
};

export default GridView;
