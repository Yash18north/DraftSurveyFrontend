import React, { useState } from "react";
import { postDataFromApi, getDataFromApi } from "../../services/commonServices";
import { toast, ToastContainer } from "react-toastify";
import Loading from "../../components/common/Loading";
import PropTypes from "prop-types";
import { documentShareCreate } from "../../services/api";


const AdvanceShareView = ({
  setPopupType,
  setUploadPopup,
  RenderFields,
  setListView,
  Row,
  sectionIndex,
  formData,
  handleFieldChange,
  formErrors,
  viewOnly,
  editOnly,
  actionClicked,
  selectedDoc,
  setSelectedIndex,
  shareArray,
  setShareArray,
  folderID,
  selectedRow,
  filteredLisToShare,
}) => {
  const infoJson = [
    {
      width: 6,
      name: "email_subject",
      label: "Email Subject (Optional)",
      type: "text",

      placeholder: "Enter Email Subject (Optional)",
    },
    {
      width: 6,
      name: "email_message",
      label: "Message For Reciepient (Optional)",
      type: "textArea",
      characterLimit: 2000,
      placeholder: "Enter Message For Reciepient (Optional)",
    },
  ];
  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = async (e) => {
    setEmail(e.target.value);
    if (e.target.value?.length > 2) {
      let res = await getDataFromApi(
        `/email_suggestions/?query=${e.target.value}`
      );
      const allSuggestions = res?.data?.suggestions || [];
      const filteredSuggestions = allSuggestions.filter(
        (suggestion) => !emails.includes(suggestion)
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleEmailKeyPress = (e) => {
    if (e.key === "Enter" && email) {
      e.preventDefault();
      setEmails([...emails, email]);
      setEmail("");
      setShareArray([...shareArray, {}]);
    }
  };

  const removeEmail = (index) => {
    const updatedEmails = emails.filter((_, i) => i !== index);
    const updatedShareArray = shareArray.filter((_, i) => i !== index);
    setEmails(updatedEmails);
    setShareArray(updatedShareArray);
  };

  const handleSharedFile = async () => {
    if (folderID != null && selectedRow.length > 0) {
      const sharePayload = {
        folder_id: folderID,
        data: [],
      };

      emails.map((email, emailIndex) => {
        selectedRow.map((selected_id) => {
          sharePayload.data.push({
            ds_folder: folderID,
            ds_document: selected_id,
            ds_shared_with: email,
            ds_share_date: new Date().toISOString().slice(0, 19) + "Z",
            ds_restriction_dwonload: "true",
            ds_download_limit: 10,
            ds_download_count: 0,
            ds_restriction_view: false,
            ds_restriction_print: false,
            ds_expiry_date: "2023-12-31T23:59:59Z",
          });
        });
      });
      let res = await postDataFromApi(documentShareCreate, sharePayload);
      if (res.data.status === 200 || res.data.status === 201) {
        toast.success(res.data.message || "Document Shared Successfully");
        setUploadPopup(false);
      }
    } else {
      let tempData = emails.map((email, emailIndex) => {
        return {
          ds_document: selectedDoc.dl_id,
          ds_shared_with: email,
          ds_share_date: new Date().toISOString().slice(0, 19) + "Z",
          ds_restriction_dwonload: "true",
          ds_download_limit: 10,
          ds_download_count: 0,
          ds_restriction_view: false,
          ds_restriction_print: false,
          ds_expiry_date: "2023-12-31T23:59:59Z",
        };
      });
      const sharePayload = {
        subject: formData[0].email_subject,
        message: formData[0].email_message,
        document_id: selectedDoc.dl_id,
        data: tempData,
      };
      setIsLoading(true);
      try {
        let res = await postDataFromApi(
          documentShareCreate,
          sharePayload
        );

        if (res.data.status === 200 || res.data.status === 201) {
          setTimeout(() => {
            toast.success(res.data.message || "Document Shared Successfully");

            setListView("List");
          }, 1000);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };
  const [suggestions, setSuggestions] = useState([]);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const handleSuggestionClick = (email) => {
    setEmail(email);
    setShowSuggestions(false);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div className="shareContainer">
      {/* <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      /> */}
      <h3 className="shareContainerHeading">
        {selectedDoc?.dl_document_name &&
          `File Name : ${selectedDoc?.dl_document_name}`}
      </h3>
      <h1>Type email address and press enter key to select email</h1>

      <div>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          onKeyPress={handleEmailKeyPress}
          placeholder="Type email and press Enter"
          className="AdvanceShareInput"
        />
      </div>

      {showSuggestions && (
        <div className="suggestionsList suggestionsListAdv">
          {suggestions.map((email, index) => (
            <div
              key={"index" + index}
              onClick={() => {
                handleSuggestionClick(email);
                setEmails([...emails, email]);
                setEmail("");
                setShareArray([...shareArray, {}]);
              }}
            >
              {email}
            </div>
          ))}
        </div>
      )}

      <div className="shareItemContainer">
        {emails.map((email, index) => (
          <div className="shareItem">
            <span>{email}</span>
            <div className="shareItemBtns">
              <span className="remove-tag" onClick={() => removeEmail(index)}>
                x
              </span>
            </div>
          </div>
        ))}
      </div>
      <Row>
        {infoJson.map((field, fieldIndex) => (
          <div
            key={"Field Index" + fieldIndex}
            className={"col-md-" + field.width}
          >
            <RenderFields
              field={field}
              sectionIndex={sectionIndex}
              fieldIndex={fieldIndex}
              formData={formData}
              handleFieldChange={handleFieldChange}
              formErrors={formErrors}
              ///For View Only
              viewOnly={viewOnly}
              editOnly={editOnly}
              actionClicked={actionClicked}
            />
          </div>
        ))}
      </Row>
      <div className="submitBtn_container">
        <button
          type="button"
          onClick={(e) => setListView("List")}
          className="saveBtn"
        >
          Close
        </button>

        <button
          type="button"
          onClick={() => handleSharedFile()}
          className="submitBtn"
        >
          Share
        </button>
      </div>
    </div>
  );
};
AdvanceShareView.propTypes = {
  setPopupType: PropTypes.func,
  setUploadPopup: PropTypes.func,
  RenderFields: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element,
  ]),
  setListView: PropTypes.func,
  Row: PropTypes.object,
  sectionIndex: PropTypes.number,
  formData: PropTypes.object,
  handleFieldChange: PropTypes.func,
  formErrors: PropTypes.object,
  viewOnly: PropTypes.bool,
  editOnly: PropTypes.bool,
  actionClicked: PropTypes.bool,
  selectedDoc: PropTypes.object,
  setSelectedIndex: PropTypes.func,
  shareArray: PropTypes.array,
  setShareArray: PropTypes.func,
  folderID: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  selectedRow: PropTypes.object,
  filteredLisToShare: PropTypes.array,
};
export default AdvanceShareView;
