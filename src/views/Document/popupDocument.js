import React, { useState } from "react";
import UploadPopup from "../../views/Document/uploadPopup";
import PropTypes from "prop-types";

const PopupDocument = ({ actions, handleOptionClick, doc }) => {
  const [renamePopup, setRenamePopup] = useState(false);

  return (
    <div className="popupDocument">
      {actions.map((option) => {
        return (
          <button
            className="popupDocumentOption"
            onClick={() => handleOptionClick(option, doc)}
          >
            <i
              className={option.Class}
              onClick={() => {
                handleOptionClick(option, doc);
              }}
            ></i>
            {option.Label}
          </button>
        );
      })}{" "}
      {renamePopup && (
        <UploadPopup setUploadPopup={setRenamePopup} type="rename" />
      )}
    </div>
  );
};
PopupDocument.propTypes = {
  actions: PropTypes.array,
  handleOptionClick: PropTypes.func,
  doc: PropTypes.object,
};
export default PopupDocument;
