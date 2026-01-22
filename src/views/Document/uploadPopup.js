import React, { useEffect, useState } from "react";
import InsertFile from "../../assets/images/icons/InsertFile.png";
import RenderFields from "../../components/common/RenderFields";
import {
  putDataFromApi,
  postDataFromApi,
  deleteDataFromApi,
} from "../../services/commonServices";
import { toast } from "react-toastify";
import UploadShare from "./uploadShare";
import Loading from "../../components/common/Loading";
import Document from "../../formJsonData/Document.json";
import PropTypes from "prop-types";
import {

  getJIsowandactivityApi,
  getReportConfigApi,
  getCommercialCertificateListApi,
  documentUpdate,
  documentShareCreate,
  documentListApi,
  documentCreateApi,
  documentDeleteApi,
  folderCreateApi,
  ccUpdateApi,
  dsSurveyPdfApi,
  ccCertPdfApi,
  mergeFilesApi,
  masterUploadApi,
  documentShareDelete

} from "../../services/api";



const UploadPopup = ({
  setUploadPopup,
  type,
  doc,
  setPopupType,
  getListData,
  setListView,
  listView,
  formData,
  setFormData,
  actionClicked,
  setActionClicked,
  formErrors,
  setFormErrors,
  selectedIndex,
  shareArray,
  setShareArray,
  folderID,
  selectedRow,
  filteredLisToShare,
  mainFolderID,
}) => {

  const [viewOnly, setViewOnly] = useState(false);
  const [editOnly, setEditOnly] = useState(false);

  const hash = window.location.hash;
  const queryString = hash.split("?")[1];
  const params = new URLSearchParams(queryString);
  const module = params.get("module");
  const id = params.get("id");

  const currentDate = new Date().toISOString();
  const [fileUrl, setFileUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    setSelectedFile(file);
    setIsLoading(true);
    try {
      let response = await postDataFromApi(masterUploadApi, formData, "TRUE");
      if (response.data.status === 200) {
        setPopupType("info");
        setFileUrl(response.data.data.file);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadDocument = async (file) => {
    const formDataPayload = new FormData();

    const data = {
      data: {
        dl_folder: mainFolderID, // Replace this hardcoded Folder ID.
        dl_module: module,
        dl_document_name: formData[0].dl_document_name,

        dl_document_reference: id,
        dl_type: selectedFile?.type,
        dl_show_to_all: formData[0].show_all === "Yes" ? true : false,
        dl_s3_url: fileUrl,
        dl_date_uploaded: currentDate,
        dl_version: "1.0",
        dl_status: "Active",
        // dl_assigned_to: "Assigned User",
        dl_discription: formData[0].dl_discription,
        // document_type: selectedFile.document_type,
        // doc_ref_id: selectedFile.doc_ref_id
      },
    };

    formDataPayload.append("data", data);
    formDataPayload.append("file", selectedFile);
    formDataPayload.append("model_type ", "commercial_certificate");
    if (!formData[0].dl_document_name || !formData[0].dl_discription) {
      alert("Both 'Document Name' and 'Description' are required!");
      return; // Stop execution if either is missing
    }
    let res = await postDataFromApi(documentCreateApi, data);
    if (res.data.status === 200 || res.data.status === 201) {
      toast.success(res.data.message || "Document Updated Successfully");
      getListData();
      setListView("List");
      setTimeout(() => {
        setUploadPopup(false);
      }, 250);
    }
  };
  const handleUploadFolder = async () => {
    const data = {
      data: {
        fd_name: formData[0].folder_name,
      },
    };

    let res = await postDataFromApi(folderCreateApi, data);
    if (res.data.status === 200 || res.data.status === 201) {
      toast.success(res.data.message || "Document Updated Successfully");
      getListData();
      setUploadPopup(false);
    }
  };

  const triggerFileInput = () => {
    document.getElementById("hiddenFileInput").click();
  };
  const triggerFolderInput = () => {
    setPopupType("createFolder");
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  const handleFolderChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleUploadFile(file);
    }
  };
  const [inputValue, setInputValue] = useState("");
  const [inputTextAreaValue, setInputTextAreaValue] = useState("");

  const updateName = async () => {
    const data = {
      id: doc.dl_id,
      data: {
        dl_document_name: inputValue,
      },
    };
    let res = await putDataFromApi(documentUpdate, data);
    if (res.data.status === 200) {
      getListData();
      setUploadPopup(false);
      setTimeout(() => {
        toast.success(res.data.message || "Document Updated Successfully");
      }, 250);
    }
  };
  const updateDescription = async () => {
    const data = {
      id: doc.dl_id,
      data: {
        dl_discription: inputTextAreaValue,
      },
    };
    let res = await putDataFromApi(documentUpdate, data);
    if (res.data.status === 200) {
      getListData();
      setUploadPopup(false);
      setTimeout(() => {
        toast.success(res.data.message || "Document Updated Successfully");
      }, 250);
    }
  };
  const sectionIndex = 0;
  const handleFieldChange = async (
    sectionIndex,
    fieldName,
    value,
    type = "",
    isChecked = ""
  ) => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        0: {
          ...prevFormData[0],
          [fieldName]: value,
        },
      };
    });

    setFormErrors((prevFormErrors) => {
      const newFormErrors = { ...prevFormErrors };
      if (newFormErrors[sectionIndex]) {
        delete newFormErrors[sectionIndex][fieldName];
        if (Object.keys(newFormErrors[sectionIndex]).length === 0) {
          delete newFormErrors[sectionIndex];
        }
      }
      return newFormErrors;
    });
  };

  const handleSharedFile = async () => {
    if (folderID != null && selectedRow.length > 0) {
      const sharePayload = {

        folder_id: folderID,
        data: [],
      };

      selectedRow.map((selected_id) => {
        sharePayload.data.push({
          ds_document: selected_id,
          ds_shared_with: inputValue,
          ds_folder: folderID,
          ds_share_date: "2023-04-01T12:00:00Z",
          ds_restriction_dwonload: "true",
          ds_download_limit: 10,
          ds_download_count: 0,
          ds_restriction_view: false,
          ds_restriction_print: false,
          ds_expiry_date: "2023-12-31T23:59:59Z",
        });
      });

      setIsLoading(true);
      try {
        let res = await postDataFromApi(documentShareCreate, sharePayload);
        if (res.data.status === 200 || res.data.status === 201) {
          setUploadPopup(false);
          setTimeout(() => {
            toast.success(res.data.message || "Document Shared Successfully");
          }, 250);
        }
      } finally {
        setIsLoading(false);

      }

    } else {
      const sharePayload = {
        document_id: doc.dl_id,
        data: [
          {
            ds_document: doc.dl_id,
            ds_shared_with: inputValue,
            ds_share_date: "2023-04-01T12:00:00Z",
            ds_restriction_dwonload: "true",
            ds_download_limit: 10,
            ds_download_count: 0,
            ds_restriction_view: false,
            ds_restriction_print: false,
            ds_expiry_date: "2023-12-31T23:59:59Z",
          },
        ],
      };
      setIsLoading(true);
      try {
        let res = await postDataFromApi(documentShareCreate, sharePayload);
        if (res.data.status === 200 || res.data.status === 201) {
          setUploadPopup(false);
          setTimeout(() => {
            toast.success(res.data.message || "Document Shared Successfully");
          }, 250);
        }
      }
      finally {
        setIsLoading(false);
      }

    }
  };

  useEffect(() => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        0: {
          ...prevFormData[0],

          show_all: "No",
        },
      };
    });
  }, []);

  const handleShareSave = async () => {
    if (
      selectedIndex !== null &&
      selectedIndex >= 0 &&
      selectedIndex < shareArray.length
    ) {
      const updatedShareArray = [...shareArray];
      const temp = {
        email_subject: formData[0]?.[`email_subject_` + selectedIndex] ?? "",
        pass_share_link:
          formData[0]?.[`pass_share_link_` + selectedIndex] ?? "",
        permission_print:
          formData[0]?.[`permission_print_` + selectedIndex] ?? "",
        permission_allow_download:
          formData[0]?.[`permission_allow_download_` + selectedIndex] ?? "",
        permission_secure_view:
          formData[0]?.[`permission_secure_view_` + selectedIndex] ?? "",
        pass_down_limit:
          formData[0]?.[`pass_down_limit_` + selectedIndex] ?? "",
      };
      updatedShareArray[selectedIndex] = temp;
      setShareArray(updatedShareArray);
      setUploadPopup(false);
    }
  };
  const [dragging, setDragging] = useState(false);

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(true);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
    const fileEvent = {
      target: {
        files: event.dataTransfer.files,
      },
    };

    handleFileChange(fileEvent);
  };

  useEffect(() => {
    const dropArea = document.getElementById("popupUploadContainer");

    dropArea?.addEventListener("dragenter", handleDragEnter);
    dropArea?.addEventListener("dragleave", handleDragLeave);
    dropArea?.addEventListener("dragover", handleDragOver);
    dropArea?.addEventListener("drop", handleDrop);

    return () => {
      dropArea?.removeEventListener("dragenter", handleDragEnter);
      dropArea?.removeEventListener("dragleave", handleDragLeave);
      dropArea?.removeEventListener("dragover", handleDragOver);
      dropArea?.removeEventListener("drop", handleDrop);
    };
  }, []);

  const handleDelete = async () => {
    if (listView === "Shared") {
      const deletePayload = {
        id: doc.ds_id,
      };

      let res = await deleteDataFromApi(
        documentShareDelete,
        deletePayload
      );
      if (res.status === 204) {
        toast.success(
          res.data.message || "Shared Document Deleted Successfully"
        );
        setUploadPopup(false);
        getListData();
      }
    } else if (type === "permenantDelete") {
      const deletePayload = {
        id: doc.dl_id,
      };

      let res = await deleteDataFromApi(documentDeleteApi, deletePayload);
      if (res.status === 204) {
        toast.success(
          res.data.message || "Shared Document Deleted Successfully"
        );
        setUploadPopup(false);
        getListData();
      } else {
        toast.error(res.data.message || "Failed to Delete Document");
        setUploadPopup(false);
      }
    } else {
      const softDeletePayload = {
        id: doc.dl_id,
        data: {
          is_active: false,
        },
      };

      let res = await putDataFromApi(documentUpdate, softDeletePayload);

      if (res.status === 200) {
        setUploadPopup(false);
        getListData();
        setTimeout(() => {
          toast.success(res.data.message || "Document Deleted Successfully");
        }, 250);
      }
    }
  };

  return type === "upload" ? (
    <div className="popupSearchContainerBG">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="popupSearchContainer documentPopup">
          <h2>
            Add New
            <i
              className="bi bi-x-lg h4"
              onClick={() => setUploadPopup(false)}
            ></i>
          </h2>

          <div
            id="popupUploadContainer"
            className={`popupUploadContainer ${dragging ? "dragging" : ""}`}
          >
            <div onClick={triggerFileInput} className="fileUpoadContainer">
              <img src={InsertFile} alt="InsertFile" />

              <span>Drag and Drop or Click to Upload</span>
              <input
                type="file"
                id="hiddenFileInput"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  ) : type === "rename" ? (
    <div className="popupSearchContainerBG">
      <div className="popupSearchContainer documentPopup">
        <h2>
          Rename Document
          <i
            className="bi bi-x-lg h4"
            onClick={() => setUploadPopup(false)}
          ></i>
        </h2>

        <input
          type="text"
          placeholder="Enter New Name"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />

        <div className="rejectButtonsContainer">
          <div className="popupSearchButtons">
            <button type="button" onClick={() => setUploadPopup(false)}>
              Cancel
            </button>
            <button type="button" onClick={() => updateName()}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : type === "changeDocument" ? (
    <div className="popupSearchContainerBG">
      <div className="popupSearchContainer documentPopup">
        <h2>
          Change Description
          <i
            className="bi bi-x-lg h4"
            onClick={() => setUploadPopup(false)}
          ></i>
        </h2>

        <textarea
          type="text"
          placeholder="Enter New Description"
          value={inputTextAreaValue}
          className="form-control rounded-2"
          onChange={(event) => setInputTextAreaValue(event.target.value)}
        ></textarea>
        <div className="rejectButtonsContainer">
          <div className="popupSearchButtons">
            <button type="button" onClick={() => setUploadPopup(false)}>
              Cancel
            </button>
            <button type="button" onClick={() => updateDescription()}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : type === "info" ? (
    <div className="popupSearchContainerBG">
      <div className="popupSearchContainer documentPopup documentInfoPopup">
        <h2>
          Document Info
          <i
            className="bi bi-x-lg h4"
            onClick={() => setUploadPopup(false)}
          ></i>
        </h2>
        {Document.upload.infoJson.map((field, fieldIndex) => (
          <div
            key={"Field Index" + fieldIndex}
            className={"col-md-" + field.width + " uploadRenderFields"}
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
        <div className="rejectButtonsContainer">
          <div className="popupSearchButtons">
            <button type="button" onClick={() => setUploadPopup(false)}>
              Cancel
            </button>
            <button type="button" onClick={() => handleUploadDocument()}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : type === "createFolder" ? (
    <div className="popupSearchContainerBG">
      <div className="popupSearchContainer documentPopup documentInfoPopup">
        <h2>
          Create Folder
          <i
            className="bi bi-x-lg h4"
            onClick={() => setUploadPopup(false)}
          ></i>
        </h2>
        {Document.upload.createFolder.map((field, fieldIndex) => (
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
        <div className="rejectButtonsContainer">
          <div className="popupSearchButtons">
            <button type="button" onClick={() => setUploadPopup(false)}>
              Cancel
            </button>
            <button type="button" onClick={() => handleUploadFolder()}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : type === "about" ? (
    <div className="popupSearchContainerBG">
      <div className="popupSearchContainer documentPopup documentInfoPopup">
        <h2>
          Document Info
          <i
            className="bi bi-x-lg h4"
            onClick={() => setUploadPopup(false)}
          ></i>
        </h2>
        <div className="popupAbout">
          <p>
            <span>Name : </span>{" "}
            {listView !== "Shared"
              ? doc.dl_document_name
              : doc.document.dl_document_name}
          </p>
          <p>
            <span>Type : </span>
            {listView !== "Shared" ? doc?.dl_type : doc?.document?.dl_type}
          </p>
          <p>
            <span>Document Description : </span>
            {listView !== "Shared"
              ? doc.dl_discription
              : doc.document.dl_discription}
          </p>
          {/* <p>
            <span>Shared URL : </span>
            {listView !== "Shared" ? doc.dl_s3_url : doc.document.dl_s3_url}
          </p> */}

          <p>
            <span>Created on : </span>{" "}
            {listView !== "Shared"
              ? doc.dl_created_at?.split("T")[0]
              : doc.ds_created_at?.split("T")[0]}
          </p>
          <p>
            <span>Updated on : </span>{" "}
            {listView !== "Shared"
              ? doc.dl_updated_at?.split("T")[0]
              : doc.ds_updated_at?.split("T")[0]}
          </p>
        </div>
      </div>
    </div>
  ) : type === "delete" || type === "permenantDelete" ? (
    <div className="popupSearchContainerBG">
      <div className="popupSearchContainer documentPopup documentInfoPopup">
        <h2>
          Delete{" "}
          <i
            className="bi bi-x-lg h4"
            onClick={() => setUploadPopup(false)}
          ></i>
        </h2>
        <span className="deletePopupMsg">
          Are you sure you want to Delete ?
        </span>
        <div className="rejectButtonsContainer">
          <div className="popupSearchButtons">
            <button type="button" onClick={() => setUploadPopup(false)}>
              Cancel
            </button>
            <button type="button" onClick={() => handleDelete()}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : type === "SharePermission" ? (
    <div className="popupSearchContainerBG">
      <div className="popupSearchContainer documentPopup">
        <h2>
          Link Permission
          <i
            className="bi bi-x-lg h4"
            onClick={() => setUploadPopup(false)}
          ></i>
        </h2>

        {Document.upload.sharePermissionJson.map((field, fieldIndex) => {
          let newField = {
            ...field,
            name: field.name + "_" + selectedIndex,
          };
          return (
            <div
              key={"Field Index" + fieldIndex}
              className={"col-md-" + field.width}
            >
              {(field.name !== "pass_down_limit" ||
                formData[0][`permission_allow_download_${selectedIndex}`] ===
                "Yes") && (
                  <RenderFields
                    field={newField}
                    sectionIndex={sectionIndex}
                    fieldIndex={fieldIndex}
                    formData={formData}
                    handleFieldChange={handleFieldChange}
                    formErrors={formErrors}
                    viewOnly={viewOnly}
                    editOnly={editOnly}
                    actionClicked={actionClicked}
                  />
                )}
            </div>
          );
        })}
        <div className="rejectButtonsContainer">
          <div className="popupSearchButtons">
            <button type="button" onClick={() => setUploadPopup(false)}>
              Cancel
            </button>
            <button type="button" onClick={() => handleShareSave()}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <UploadShare
      setUploadPopup={setUploadPopup}
      setListView={setListView}
      handleSharedFile={handleSharedFile}
      inputValue={inputValue}
      setInputValue={setInputValue}
    />
  );
};
UploadPopup.propTypes = {
  setUploadPopup: PropTypes.func,
  type: PropTypes.string,
  doc: PropTypes.object,
  setPopupType: PropTypes.func,
  getListData: PropTypes.func,
  setListView: PropTypes.func,
  listView: PropTypes.bool,
  formData: PropTypes.object,
  setFormData: PropTypes.func,
  actionClicked: PropTypes.bool,
  setActionClicked: PropTypes.func,
  formErrors: PropTypes.object,
  setFormErrors: PropTypes.func,
  selectedIndex: PropTypes.number,
  shareArray: PropTypes.array,
  setShareArray: PropTypes.func,
  folderID: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  selectedRow: PropTypes.object,
  filteredLisToShare: PropTypes.array,
  mainFolderID: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};
export default UploadPopup;
