import React, { useState } from "react";
import DeleteConfirmation from "./DeleteConfirmation";
import PropTypes from 'prop-types';

const PopupOptions = ({
  actions,
  onActionHandleClick,

  popupMessages,
  saveClicked,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [actionType, setActionType] = useState(false);

  const openDeletePopup = () => {
    let headingMsg;
    let titleMsg = "";
    if (actionType == "Edit") {
     
      onActionHandleClick(actionType);
      return;
    } else if (actionType == "Delete") {
      headingMsg = popupMessages?.delete?.headerMsg;
      titleMsg = popupMessages?.delete?.titleMsg;
    } else {
      headingMsg = popupMessages?.save?.headerMsg;
      titleMsg = popupMessages?.save?.titleMsg;
    }
    return (
      <DeleteConfirmation
        isOpen={isPopupOpen}
        handleClose={setIsPopupOpen}
        handleConfirm={() => {
          onActionHandleClick(actionType);
          setIsPopupOpen(true);
        }}
        popupMessage={titleMsg}
        popupHeading={headingMsg}
        saveClicked={saveClicked}
        actionType={actionType}
      />
    );
  };

  return (
    <div className="popupOptions">
      {actions.map((action, actionIndex) => (
      <button
      key={"actionIndex"+actionIndex}
      tabIndex={0}
      onClick={() => {
        setActionType(action.text);
        setIsPopupOpen(true);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setActionType(action.text);
          setIsPopupOpen(true);
        }
      }}
      className="action-div"
      aria-label="popup-action-button"
    >
      {action.text}
    </button>
      ))}
      {isPopupOpen && openDeletePopup()}
    </div>
  );
};

PopupOptions.propTypes = {
  actions: PropTypes.array.isRequired,
  onActionHandleClick: PropTypes.func.isRequired,
  popupMessages: PropTypes.object,
  saveClicked: PropTypes.bool,
};

export default PopupOptions;
