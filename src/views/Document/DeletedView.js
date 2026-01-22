import React from "react";
import { formatDate } from "../../services/commonFunction";
import PropTypes from "prop-types";

const DeletedView = ({
  documentList,
  renderDocumentIcon,
  deletedActions,
  setSelectedDoc,
  handleOptionClick,
  handlePrev,
  handleNext,
  currentPage,
  totalPage,
  getPaginationNo,
  getListData,
  headers,
  sortStates,
  setSortStates,
  openPopup,
  setOpenPopup,
  PopupDocument,
}) => {
  const handleClick = (index, fieldName) => {
    const newSortStates = Array(headers?.length).fill(false);
    newSortStates[index] = !sortStates[index];
    let sortType = newSortStates[index] ? "desc" : "asc";
    setSortStates(newSortStates);
    getListData(currentPage, fieldName, sortType);
  };
  return (
    <div className="renderList_table">
      <table className="table table-white responsive borderless no-wrap align-middle list DocumentList">
        <thead>
          <tr className="border-top">
            {headers?.map((header, headerIndex) => (
              <th
                key={"Header-Index" + headerIndex}
                colSpan={header.colSpan ?? 1}
                onClick={() => handleClick(headerIndex, header?.sortName)}
              >
                {header?.label}
                <span className="table_header_icon">
                  {sortStates[headerIndex] ? (
                    <i className="bi bi-caret-up-fill"></i>
                  ) : (
                    <i className="bi bi-caret-down-fill"></i>
                  )}
                </span>
              </th>
            ))}
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="documentContainerTableBody">
          {documentList?.map((doc, docIndex) => (
            <tr>
              <td>
                <div className="documentTableItem">
                  <div className="popupIconName">
                    {renderDocumentIcon(doc.dl_type)}
                    <span>{doc.dl_document_name}</span>
                  </div>

                  <div className="popupPosition">
                    <i
                      className="bi bi-three-dots-vertical documentContainerIcon"
                      onClick={() => {
                        setOpenPopup((prev) => (prev === -1 ? docIndex : -1));
                        setSelectedDoc(doc);
                      }}
                    ></i>
                    {openPopup === docIndex && (
                      <PopupDocument
                        handleOptionClick={handleOptionClick}
                        actions={deletedActions}
                        doc={doc}
                      />
                    )}
                  </div>
                </div>
              </td>
              <td> {doc.dl_discription}</td>
              <td> {formatDate(doc.dl_date_uploaded)}</td>
              <td className="actionsColumnDoc">
                {deletedActions.map((action) => {
                  return (
                    <i
                      className={action.Class}
                      onClick={() => {
                        setSelectedDoc(doc);

                        handleOptionClick(action, doc);
                      }}
                    ></i>
                  );
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="previous_next_btns">
        <button
          type="button"
          onClick={() => handlePrev()}
          disabled={currentPage === 1}
          className={(currentPage === 1 ? "disabled_btn" : null) + " previous_btn"}
          aria-label="Previous Page"
        >
          <i className="bi bi-chevron-left" aria-hidden="true"></i>
        </button>

        {getPaginationNo()}

        <button
          type="button"
          onClick={() => handleNext()}
          disabled={currentPage === totalPage}
          className={(currentPage === totalPage ? "disabled_btn" : null)  + " next_btn"}
          aria-label="Next Page"
        >
          <i className="bi bi-chevron-right" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  );
};
DeletedView.propTypes = {
  documentList: PropTypes.array,
  renderDocumentIcon: PropTypes.func,
  deletedActions: PropTypes.object,
  setSelectedDoc: PropTypes.func,
  handleOptionClick: PropTypes.func,
  handlePrev: PropTypes.func,
  handleNext: PropTypes.func,
  currentPage: PropTypes.number,
  totalPage: PropTypes.number,
  getPaginationNo: PropTypes.func,
  getListData: PropTypes.func,
  headers: PropTypes.array,
  sortStates: PropTypes.object,
  setSortStates: PropTypes.func,
  openPopup: PropTypes.bool,
  setOpenPopup: PropTypes.func,
  PopupDocument: PropTypes.element,
};
export default DeletedView;
