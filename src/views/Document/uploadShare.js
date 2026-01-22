import React, { useState } from "react";
import { getDataFromApi } from "../../services/commonServices";
import PropTypes from "prop-types";

const EmailSharePopup = ({
  setUploadPopup,
  setListView,
  handleSharedFile,
  inputValue,
  setInputValue,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = async (event) => {
    const value = event.target.value;
    setInputValue(value);
    if (value?.length > 2) {
      let res = await getDataFromApi(`/email_suggestions/?query=${value}`);
      
      setSuggestions(res?.data?.suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (email) => {
    setInputValue(email);
    setShowSuggestions(false);
  };

  return (
    <div className="popupSearchContainerBG">
      <div className="popupSearchContainer documentPopup">
        <h2>
          Share File
          <i
            className="bi bi-x-lg h4"
            onClick={() => setUploadPopup(false)}
          ></i>
        </h2>
        <div className="advanceShare">
          <span
            onClick={() => {
              setUploadPopup(false);
              setListView("AdvanceShare");
            }}
          >
            Show Advanced
          </span>
        </div>
        <input
          type="text"
          placeholder="Enter Email Address to Share"
          value={inputValue}
          onChange={handleInputChange}
        />

        {showSuggestions && (
          <div className="suggestionsList">
            {suggestions.map((email, index) => (
              <div key={"index"+index} onClick={() => handleSuggestionClick(email)}>
                {email}
              </div>
            ))}
          </div>
        )}

        <div className="rejectButtonsContainer">
          <div className="popupSearchButtons">
            <button type="button" onClick={() => setUploadPopup(false)}>
              Cancel
            </button>
            <button type="button" onClick={() => handleSharedFile()}>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
EmailSharePopup.propTypes = {
  setUploadPopup: PropTypes.func,
  setListView: PropTypes.func,
  handleSharedFile: PropTypes.func,
  inputValue: PropTypes.string,
  setInputValue: PropTypes.func,
};
export default EmailSharePopup;
