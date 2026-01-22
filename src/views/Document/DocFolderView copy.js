import React, { useEffect, useState } from "react";
import { postDataFromApi } from "../../services/commonServices";
import Pdf from "../../assets/images/icons/pdfIcon.png";
import Word from "../../assets/images/icons/wordIcon.png";
import Img from "../../assets/images/icons/imgIcon.png";
import Excel from "../../assets/images/icons/excelIcon.png";
import { useNavigate } from "react-router-dom";
import PopupDocument from "./popupDocument";
import { formatDate } from "../../services/commonFunction";
import { encryptDataForURL, decryptData, decryptDataForURL } from "../../utills/useCryptoUtils";
import { useSelector } from "react-redux";

const ListView = () => {
  const headers = [
    {
      label: "Name",
      name: "dl_document_name",
      sortName: "ds_document__dl_document_name",
    },
    {
      label: "Description",
      name: "dl_discription",
      type: "text",
      sortName: "ds_document__dl_discription",
    },

    {
      label: "Time",
      name: "ds_share_date",
      type: "text",
      sortName: "ds_share_date",
    },
  ];
  function decryptedValue(encodedValue) {
    try {
      // Decode Base64 string
      const decodedValue = decodeURIComponent(escape(atob(encodedValue)));
      return decodedValue;
    } catch (error) {
      console.error("Failed to decrypt value:", error);
      return null;
    }
  }
  function encryptedValue(plainText) {
    try {
      // Encode the string in Base64
      const encodedValue = btoa(unescape(encodeURIComponent(plainText)));
      return encodedValue;
    } catch (error) {
      console.error("Failed to encrypt value:", error);
      return null;
    }
  }

  function renderDocumentIcon(doc) {
    const fileExtension = doc?.document?.split("/").pop() || doc;
    switch (fileExtension) {
      case "pdf":
        return <img src={Pdf} height={30} width={25} alt="Pdf" />;
      case "doc":
      case "docx":
      case "vnd.oasis.opendocument.text":
        return <img src={Word} height={30} width={25} alt="Word" />;
      case "xls":
      case "xlsx":
      case "csv":
        return <img src={Excel} height={30} width={25} alt="Excel" />;
      case "jpg":
      case "jpeg":
      case "png":
        return <img src={Img} height={30} width={25} alt="Img" />;
      default:
        return <img src={Pdf} height={30} width={25} alt="Pdf" />;
    }
  }
  const hash = window.location.hash;
  const queryString = hash.split("?")[1];
  const params = new URLSearchParams(decryptedValue(queryString));
  const id = params.get("id");
  const email = params.get("email");
  let navigate = useNavigate();
  const [documentList, setDocumentList] = useState();
  const session = useSelector((state) => state.session);

  useEffect(() => {

    async function fetchData() {
      const payload = { id: id, email: email };
      let res = await postDataFromApi("/list_documents/", payload);
      if (res.data.status === 200) {
        setDocumentList(res.data.data);
      }
    }

    fetchData();
  }, [id]);

  useEffect(() => {
    if (session.user) {
      alert("An active session has been detected. Please log out or access this page in Incognito mode.");
      window.location.href = "https://support.google.com/chrome/answer/95464";
    }
  }, [])


  const [openPopup, setOpenPopup] = useState(-1);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const actions = [
    { Label: "About", Class: "bi bi-info" },
    { Label: "View", Class: "bi bi-eye" },
  ];
  const [popupType, setPopupType] = useState("upload");
  const [uploadPopup, setUploadPopup] = useState(false);

  const handleOptionClick = async (option, doc) => {
    if (option.Label === "View") {
      navigate(
        `/documentViewer?${encryptedValue(`ispass=${doc.ds_password !== null}&id=${doc.ds_id}`)}`
      );
    } else if (option.Label === "About") {
      setPopupType("about");
      setUploadPopup(true);
    }
    setOpenPopup(-1);
  };
  const [toggleView, setToggleView] = useState(false);
  return (
    <div className="documentFolderList">
      {toggleView ? (
        <div className="DocumentFullPage">
          <div className="DocumentContainer">
            {documentList?.map((doc, docIndex) => (
              <div className="DocumentContainerItem">
                <div className="DocumentContainerHeader">
                  <span className="truncate">
                    {doc?.document?.document.dl_document_name}
                  </span>
                  <i
                    className="bi bi-three-dots-vertical documentContainerIcon"
                    onClick={() => {
                      setOpenPopup((prev) => (prev === -1 ? docIndex : -1));
                      setSelectedDoc(doc);
                    }}
                  ></i>
                </div>
                {renderDocumentIcon(doc?.document?.dl_type)}
                <span className="documentContainerName">
                  {doc.ds_share_date?.split("T")[0]}
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
        </div>
      ) : (
        <div className="renderList_table DocFolderList">
          <h2 className="section_heading">Attached Documents</h2>
          <table className="table table-white responsive borderless no-wrap align-middle list DocumentList">
            <thead>
              <tr className="border-top">
                {headers?.map((header, headerIndex) => (
                  <th
                    key={"Header-Index" + headerIndex}
                    colSpan={header.colSpan ?? 1}
                  >
                    {header?.label}

                  </th>
                ))}

                <th>Action</th>
              </tr>
            </thead>
            <tbody className="documentContainerTableBody">
              {documentList?.map((doc, docIndex) => (
                <tr>
                  <td >
                    <div className="documentTableItem">
                      <div className="popupIconName">
                        <span>{doc?.document?.dl_document_name}</span>
                      </div>

                      <div className="popupPosition">
                        <i
                          className="bi bi-three-dots-vertical documentContainerIcon"
                          onClick={() => {
                            setOpenPopup((prev) =>
                              prev === -1 ? docIndex : -1
                            );
                            setSelectedDoc(doc);
                          }}
                        ></i>
                        {openPopup === docIndex && (
                          <PopupDocument
                            handleOptionClick={handleOptionClick}
                            actions={actions}
                            doc={doc}
                          />
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="truncate_des"> {doc?.document?.dl_discription}</td>
                  <td className="shared_time">
                    {" "}
                    Folder Shared With {doc.ds_shared_with} on{" "}
                    {formatDate(doc.ds_share_date)}
                  </td>
                  <td className="actionsColumnDoc">
                    {actions.map((action) => {
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
        </div>
      )}
      {uploadPopup && (
        <div className="popupSearchContainerBG">
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
                <span>Name : </span> {selectedDoc.document.dl_document_name}
              </p>
              <p>
                <span>Type : </span>
                {selectedDoc.document?.dl_type}
              </p>
              <p>
                <span>Document Description : </span>
                {selectedDoc.document.dl_discription}
              </p>
              {/* <p>
                <span>Shared URL : </span>
                {selectedDoc.document.dl_s3_url}
              </p> */}

              <p>
                <span>Created on : </span>{" "}
                {new Date(selectedDoc.ds_created_at).toLocaleDateString("en-GB")}
              </p>
              <p>
                <span>Updated on : </span>{" "}
                {new Date(selectedDoc.ds_updated_at).toLocaleDateString("en-GB")}
              </p>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListView;
