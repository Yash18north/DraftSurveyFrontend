import React, { useState, useEffect } from 'react'
import RenderFields from '../../../components/common/RenderFields'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import InsertFile from "../../../assets/images/icons/insertFileUpload.svg";
import { postDataFromApi } from '../../../services/commonServices';
import { masterUploadApi } from '../../../services/api';
import Document from "../../../formJsonData/Operations/jobinstructions/DocumentPopup.json";
import Loading from '../../../components/common/OverlayLoading';
import { toast } from 'react-toastify';
import { getMailBodyDetails, getMailSubjectDetails } from '../../../services/commonFunction';



const DocumentPopup = ({
    setUploadPopup,
    sectionIndex,
    formData,
    handleFieldChange,
    formErrors,
    viewOnly,
    editOnly,
    actionClicked,
    handleUploadDocument,
    popupType,
    setPopupType,
    selectedDoc,
    popupJson,
    fileUrl,
    setFileUrl,
    isExternalUse,
    moduleType,
    setFormData
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            handleUploadFile(file);
        }
    };

    const handleUploadFile = async (file) => {

        const formData = new FormData();
        formData.append("file", file);
        if (isExternalUse) {
            formData.append("model_type ", "commercial_certificate");
        } else {
            formData.append("model_type ", "userdata");
        }
        setIsLoading(true);
        try {
            let response = await postDataFromApi(masterUploadApi, formData, "TRUE");
            if (response.data.status === 200) {
                setPopupType("UploadInfo");
                setIsLoading(false);

                setFileUrl(response.data.data.file);
            }
            else {
                toast.error(
                    response?.message ||
                    response?.data?.message,
                    {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    }
                );
            }
        } finally {
            setIsLoading(false);
        }
    };
    const triggerFileInput = () => {
        document.getElementById("hiddenFileInput").click();
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
        setFormData((prev) => ({
            ...prev,
            [1]: {
                ...prev[1],
                ds_shared_with: formData?.[0]?.ji_client_cc_emails || []
            },
        }));
        return () => {
            dropArea?.removeEventListener("dragenter", handleDragEnter);
            dropArea?.removeEventListener("dragleave", handleDragLeave);
            dropArea?.removeEventListener("dragover", handleDragOver);
            dropArea?.removeEventListener("drop", handleDrop);
        };
    }, []);
    const uploadExtraModules = ['tenderDocumentList', 'purchaseorderDocumentList', 'purchasereqDocumentList', 'jrfDocumentList','itemDocumentList']
    return (
        <div className="popupSearchContainerBG">
            {isLoading ? <Loading /> :
                <>
                    {popupType === "Info" ?
                        <div className="popupSearchContainer documentInfoPopup">
                            <h2>
                                Document Info
                                <i
                                    className="bi bi-x-lg h4"
                                    onClick={() => setUploadPopup(false)}
                                ></i>
                            </h2>
                            <div className="popupAbout">
                                <p>
                                    <span>Name : </span> {selectedDoc.dl_document_name}
                                </p>
                                <p>
                                    <span>Type : </span>
                                    {selectedDoc?.dl_type}
                                </p>
                                <p>
                                    <span>Document Description : </span>
                                    {selectedDoc.dl_discription}
                                </p>
                                {/* <p>
                                    <span>Shared URL : </span>
                                    {selectedDoc.dl_s3_url}
                                </p> */}

                                <p>
                                    <span>Created on : </span>{" "}
                                    {selectedDoc.dl_created_at ? new Date(selectedDoc.dl_created_at).toLocaleDateString("en-GB") : ""}
                                </p>
                                <p>
                                    <span>Updated on : </span>{" "}
                                    {selectedDoc.dl_updated_at ? new Date(selectedDoc.dl_updated_at).toLocaleDateString("en-GB") : ""}
                                </p>

                            </div>
                        </div>
                        : popupType === "Upload" ?
                            <div className="popupSearchContainer documentPopup">
                                <h2>
                                    Upload File
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
                                        <div className='insertFileUpload'>
                                            <img src={InsertFile} alt="InsertFile" />
                                            <p>Click and Drag file here or Choose file</p>
                                        </div>


                                        {/* <span>Drag and Drop or Click to Upload</span> */}
                                        <input
                                            type="file"
                                            id="hiddenFileInput"
                                            style={{ display: "none" }}
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            : popupType === "UploadInfo" ?

                                <div className="popupSearchContainer documentPopup documentInfoPopup">
                                    <h2>
                                        Document Info
                                        <i
                                            className="bi bi-x-lg h4"
                                            onClick={() => setUploadPopup(false)}
                                        ></i>
                                    </h2>
                                    {Document.upload.infoJson.body.map((field, fieldIndex) => (
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
                                :
                                <div className="popupSearchContainer documentPopup documentInfoPopup">
                                    <h2>
                                        {popupJson?.heading}
                                        <i
                                            className="bi bi-x-lg h4"
                                            onClick={() => setUploadPopup(false)}
                                        ></i>
                                    </h2>
                                    {popupJson?.heading === "Share File" && <div className="advanceShare">
                                        <span
                                            onClick={() => {
                                                dispatch(
                                                    {
                                                        type: "SHARED_FILES",
                                                        selectedMultiDocs: [selectedDoc],
                                                        ccEmails: formData[0]?.ji_client_cc_emails,
                                                        clientEmails: formData[0]?.ji_client_email,
                                                        ccMailSubject: getMailSubjectDetails(formData, selectedDoc),
                                                        ccMailBody: getMailBodyDetails(formData, selectedDoc),
                                                    }
                                                );
                                                if (uploadExtraModules.includes(moduleType)) {
                                                    const mainmodule = moduleType.replace("DocumentList", "");
                                                    navigate(`/${mainmodule}List/${mainmodule}-document-list/document/ShareFiles`);
                                                }
                                                else {
                                                    navigate("/operation/ShareFiles");
                                                }
                                            }}
                                        >
                                            Show Advanced
                                        </span>
                                    </div>}
                                    {popupJson?.body?.map((field, fieldIndex) => (
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
                                                // editOnly={editOnly}
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
                                </div>}
                </>}

        </div>
    )
}

export default DocumentPopup