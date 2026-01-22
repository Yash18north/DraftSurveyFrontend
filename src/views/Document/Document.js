import React, { useEffect, useState } from "react";
import { Card, CardTitle, Row, Col } from "react-bootstrap";
import {
  postDataFromApi,
  putDataFromApi,
} from "../../services/commonServices";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Pdf from "../../assets/images/icons/pdfIcon.png";
import Word from "../../assets/images/icons/wordIcon.png";
import Img from "../../assets/images/icons/imgIcon.png";
import Excel from "../../assets/images/icons/excelIcon.png";
import Loading from "../../components/common/Loading";
import ListView from "./ListView";
import PopupDocument from "./popupDocument";
import UploadPopup from "../Document/uploadPopup";
import { toast } from "react-toastify";
import RenderFields from "../../components/common/RenderFields";
import GridView from "./GridView";
import AdvanceShareView from "./AdvanceShare";
import DeletedView from "./DeletedView";
import SharedView from "./SharedView";
import { saveAs } from "file-saver";
import Document from "../../formJsonData/Document.json";
import { decryptDataForURL } from "../../utills/useCryptoUtils";
import { documentShareUpdate, getJIsowandactivityApi, getReportConfigApi, getCommercialCertificateListApi, documentUpdate, documentShareCreate, documentListApi, documentDeleteApi, folderCreateApi, ccUpdateApi, dsSurveyPdfApi, ccCertPdfApi, mergeFilesApi, masterUploadApi } from "../../services/api";



export const selectUser = (state) => state.user;

const ModuleDocument = () => {
  let historyData;
  const session = useSelector((state) => state.session);
  historyData = session?.historyData;
  let navigate = useNavigate();
  const hash = window.location.hash;
  const queryString = hash.split("?")[1];
  const params = new URLSearchParams(queryString);
  const module = decryptDataForURL(params.get("module"));

  const id = decryptDataForURL(params.get("id"));
  const [openPopup, setOpenPopup] = useState(-1);
  const [documentList, setDocumentList] = useState([]);
  const [listView, setListView] = useState("List");
  const [toggleView, setToggleView] = useState(true);
  const [uploadPopup, setUploadPopup] = useState(false);
  const [popupType, setPopupType] = useState("upload");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [actionClicked, setActionClicked] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);
  const [editOnly, setEditOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(10);
  const [responseData, setResponseData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState([]);
  const [folderID, setFolderID] = useState(null);
  const [mainFolderID, setMainFolderID] = useState(null);
  const [filteredLisToShare, setFilteredListToShare] = useState([]);
  const [sortStatesListView, setSortStatesListView] = useState(
    Array(Document.List.headers?.length).fill(false)
  );

  const [sortStatesShareView, setSortStatesShareView] = useState(
    Array(Document.Share.headers?.length).fill(false)
  );

  const [sortStatesDeleteView, setSortStatesDeleteView] = useState(
    Array(Document.List.headers?.length).fill(false)
  );

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [shareArray, setShareArray] = useState([]);

  const getListData = async (
    pagination = "",
    fieldName = "",
    sortType = "",
    searchValue = ""
  ) => {
    
    try {
      let payload;

      let endPoint;
      if (listView === "Shared") {
        
        payload = {
          dl_module: module,
          dl_document_reference: id,
          ds_is_active: false,
        };

        endPoint = "/document_shares/list/";
      } else if (listView === "Deleted") {
    
        payload = {
          dl_module: module,
          dl_document_reference: id,
          is_active: false,
        };
       
        endPoint = "/documents/list/";
      } else {
     
        payload = {
          dl_module: module,
          dl_document_reference: id,
          is_active: true,
        };
        
        endPoint = "/documents/list/";
        
      }
      let querystring = "";
      if (pagination) {
        querystring += "?page=" + pagination;
      }
      if (fieldName && sortType) {
        querystring += querystring
          ? "&sort_by=" + fieldName
          : "?sort_by=" + fieldName;
        querystring += "&sort_order=" + sortType;
      }
      if (searchValue || searchValue === -1) {
        searchValue = searchValue === -1 ? "" : searchValue;
        querystring += querystring
          ? "&search=" + searchValue
          : "?search=" + searchValue;
      } else if (searchTerm) {
        querystring += querystring
          ? "&search=" + searchTerm
          : "?search=" + searchTerm;
      }
      setIsLoading(true);
       
      let res = await postDataFromApi(endPoint + querystring, payload);
      if (res.data.status === 200) {
        
        setIsLoading(false);
        setCurrentPage(res.data.current_page);
        setTotalPage(res.data.total_pages);
        setResponseData(res.data);
        AssigningFolderID(endPoint, querystring, res);
      }
    } catch (error) { }
  };

  useEffect(() => {
    
    getListData();
  }, [listView]);

  useEffect(() => {
    setCurrentPage(responseData.current_page);
    setTotalPage(responseData.total_pages);
  }, [responseData]);

  function renderDocumentIcon(doc) {
    const fileExtension = doc?.split("/").pop() || doc;
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
  function renderDocumentIconGrid(doc) {
    const fileExtension = doc?.split("/").pop() || doc;
    switch (fileExtension) {
      case "pdf":
        return <img src={Pdf} height={50} width={50} alt="Pdf" />;
      case "doc":
      case "docx":
      case "vnd.oasis.opendocument.text":
        return <img src={Word} height={50} width={50} alt="Word" />;
      case "xls":
      case "xlsx":
      case "csv":
        return <img src={Excel} height={50} width={50} alt="Excel" />;
      case "jpg":
      case "jpeg":
      case "png":
        return <img src={Img} height={50} width={50} alt="Img" />;
      default:
        return <img src={Pdf} height={50} width={50} alt="Pdf" />;
    }
  }

  const handleOptionClick = async (option, doc) => {
    if (option.Label === "Rename") {
      setPopupType("rename");
      setUploadPopup(true);
    } else if (option.Label === "Change Description") {
      setPopupType("changeDocument");
      setUploadPopup(true);
    } else if (option.Label === "Delete") {
      setPopupType("delete");
      setUploadPopup(true);
    } else if (option.Label === "View") {
      setListView("View");
    } else if (option.Label === "About") {
      setPopupType("about");
      setUploadPopup(true);
    } else if (option.Label === "Share") {
      setPopupType("share");
      setUploadPopup(true);
    } else if (option.Label === "Permanent Delete") {
      setPopupType("permenantDelete");
      setUploadPopup(true);
    } else if (option.Label === "Download") {
      if (
        doc.ds_download_limit > doc.ds_download_count ||
        listView !== "Shared"
      ) {
        const getFileNameAndExtension = (url) => {
          const urlParts = url.split("/");
          const filename = urlParts[urlParts.length - 1];
          const nameParts = filename.split(".");
          const extension = nameParts.length > 1 ? "." + nameParts.pop() : "";
          return { filename, extension };
        };

        const downloadFile = async (url, newName) => {
          const response = await fetch(url);
          if (response.status && listView === "Shared") {
            const payload = {
              id: doc.ds_id,
              data: {
                ds_download_count: doc.ds_download_count + 1,
              },
            };
            let res = await putDataFromApi(documentShareUpdate, payload);
            if (res.status === 200) {
              getListData();
            }
          }
          const blob = await response.blob();
          saveAs(blob, newName);
        };

        if (listView === "Shared") {
          const { extension } = getFileNameAndExtension(doc.document.dl_s3_url);
          downloadFile(
            doc.document.dl_s3_url,
            doc.document.dl_document_name + extension
          );
        } else {
          const { extension } = getFileNameAndExtension(doc.dl_s3_url);
          downloadFile(doc.dl_s3_url, doc.dl_document_name + extension);
        }
      } else {
        alert("Your Download Limit Has Exceed");
      }
    } else if (option.Label === "Revert Delete") {
      const revertDeletePayload = {
        id: doc.dl_id,
        data: {
          is_active: true,
        },
      };

      let res = await putDataFromApi(documentUpdate, revertDeletePayload);
      if (res.status === 200) {
        getListData();
        setTimeout(() => {
          toast.success(
            res.data.message || "Deleted Document Reverted Successfully"
          );
        }, 250);
      }
    }

    setOpenPopup(-1);
  };
  const handleMultiFile = (e, doc) => {
    const docIndex = doc.dl_id;
    setSelectedRow((prev) => {
      if (prev.includes(docIndex)) {
        return prev.filter((index) => index !== docIndex);
      } else {
        return [...prev, docIndex];
      }
    });
  };
  const AssigningFolderID = (endPoint, querystring, res) => {
    if (
      endPoint === "/documents/list/" &&
      querystring === "" &&
      listView === "List"
    ) {
      if (res?.data?.data?.length > 0) {
        setMainFolderID(res?.data.data[0].dl_folder);
      } else {
        const createFolder = async () => {
          let payload = {
            data: {
              fd_name: "New Created Folder",
            },
          };
          let res = await postDataFromApi(folderCreateApi, payload);
          setMainFolderID(res.data?.data?.fd_id);
        };
        createFolder();
      }
    }
  };

  const handleMultiSharedFiles = async () => {
    const payload = {
      data: {
        fd_name: "System Generated",
      },
    };
    let FolderCreateResponse = await postDataFromApi(
      folderCreateApi,
      payload
    );

    const filteredList = documentList.filter((document) =>
      selectedRow.includes(document.id)
    );
    
    if (FolderCreateResponse.data.status === 200) {
      setFolderID(FolderCreateResponse.data.data.fd_id);
      setFilteredListToShare(filteredList);
      setPopupType("share");
      setUploadPopup(true);
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

  const handleSearch = async (e) => {
    setSearchTerm(e);

    let payload;

    let endPoint;
    let searchQuery = `?search=${e}`;
    if (listView === "Shared") {
      payload = {
        dl_module: module,
        dl_document_reference: id,
        ds_is_active: false,
      };

      endPoint = "/document_shares/list/";
    } else if (listView === "Deleted") {
      payload = {
        dl_module: module,
        dl_document_reference: id,
        is_active: false,
      };

      endPoint = "/documents/list/";
    } else {
      payload = {
        dl_module: module,
        dl_document_reference: id,
        is_active: true,
      };
      endPoint = "/documents/list/";
    }
    setIsLoading(true);
    
    let res = await postDataFromApi(endPoint + searchQuery, payload);
    if (res.status === 200) {
      setIsLoading(false);
      setCurrentPage(res.data.data.current_page);
      setTotalPage(res.data.data.total_pages);
      setResponseData(res.data);
    }
  };

  const handlePrev = () => {
    getListData(currentPage - 1);
    setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    getListData(currentPage + 1);
    setCurrentPage((prev) => prev + 1);
  };

  const handlePaginationButton = (pageNo) => {
    getListData(pageNo);
    setCurrentPage(pageNo);
  };

  const getPaginationNo = () => {
    const displayedPages = [];
    const maxPagesToShow = 7;

    const createButton = (page, isActive = false, isEllipsis = false) => {
      return isEllipsis ? (
        <button key={`ellipsis-${page}`}>...</button>
      ) : (
        <button
          className={
            isActive ? "btn btn-danger pagination-active" : "btn btn-danger"
          }
          key={`button-${page}`}
          onClick={() => handlePaginationButton(page)}
        >
          {page}
        </button>
      );
    };

    const addPageButtons = (start, end) => {
      for (let i = start; i <= end; i++) {
        displayedPages.push(createButton(i, currentPage === i));
      }
    };

    if (totalPage <= 3) {
      addPageButtons(1, totalPage);
    } else {
      const middle = Math.floor(maxPagesToShow / 2);
      const left = Math.max(1, currentPage - middle);
      const right = Math.min(totalPage, currentPage + middle);

      if (left > 1) {
        displayedPages.push(createButton(1, currentPage === 1));
        if (left > 2) {
          displayedPages.push(createButton("left-ellipsis", false, true));
        }
      }

      addPageButtons(left, right);

      if (right < totalPage) {
        if (right < totalPage - 1) {
          displayedPages.push(createButton("right-ellipsis", false, true));
        }
        displayedPages.push(createButton(totalPage, currentPage === totalPage));
      }
    }

    return displayedPages;
  };

  return (
    <Row>
      <Col>
        <Card className="bgDefault">
          <CardTitle tag="h5" className="history_title">
            <div>
              TCRC <i className="bi bi-chevron-right card-title-icon"></i>{" "}
              <button
                className="breadcrumb_button"
                type="button"
                onClick={() => navigate(historyData.redirect)}
              >
                {historyData?.Breadcrumb}{" "}
              </button>
              <i className="bi bi-chevron-right card-title-icon"></i> Document
            </div>
          </CardTitle>
          {listView !== "AdvanceShare" && (
            <>
              <div className="docSearch">
                <div className="docSearchInput">
                  <i className="bi bi-search"></i>
                  <input
                    placeholder="Search"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>

                <div className="layoutDocumentBtnContainer">
                  <div className="docSearchNav">
                    <div
                      onClick={() => {
                        setListView("List");
                      }}
                      className={
                        listView === "Grid" || listView === "List"
                          ? "doc_active"
                          : ""
                      }
                    >
                      <i className="bi bi-folder-fill"></i>
                      <span>All Files</span>
                    </div>
                    <div
                      onClick={() => {
                        setListView("Shared");
                      }}
                      className={listView === "Shared" ? "doc_active" : ""}
                    >
                      <i className="bi bi-share"></i>
                      <span>Shared Files</span>
                    </div>

                    <div
                      onClick={() => {
                        setListView("Deleted");
                      }}
                      className={listView === "Deleted" ? "doc_active" : ""}
                    >
                      <i className="bi bi-folder-x"></i>
                      <span>Files Deleted</span>
                    </div>

                    <div
                      onClick={() => {
                        getListData();
                        setToggleView((Prev) => !Prev);
                      }}
                    >
                      <i
                        className={
                          !toggleView
                            ? "bi bi-list-ul viewIconNav"
                            : "bi bi-grid viewIconNav"
                        }
                      ></i>
                      <span>{!toggleView ? "List View" : "Grid View"}</span>
                    </div>

                    <div
                      onClick={() => {
                        setPopupType("upload");
                        setUploadPopup(true);
                      }}
                    >
                      <i className="bi bi-plus-circle-fill viewIconNav doc_active"></i>
                      <span>Create</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {uploadPopup && (
            <div>
              <UploadPopup
                setUploadPopup={setUploadPopup}
                type={popupType}
                setPopupType={setPopupType}
                doc={selectedDoc}
                getListData={getListData}
                setListView={setListView}
                listView={listView}
                formData={formData}
                setFormData={setFormData}
                actionClicked={actionClicked}
                setActionClicked={setActionClicked}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
                selectedIndex={selectedIndex}
                shareArray={shareArray}
                setShareArray={setShareArray}
                folderID={folderID}
                selectedRow={selectedRow}
                filteredLisToShare={filteredLisToShare}
                mainFolderID={mainFolderID}
              />
            </div>
          )}
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {listView !== "AdvanceShare" && toggleView ? (
                listView === "List" ? (
                  <ListView
                    documentList={responseData.data}
                    renderDocumentIcon={renderDocumentIcon}
                    actions={Document.List.actions}
                    setSelectedDoc={setSelectedDoc}
                    handleOptionClick={handleOptionClick}
                    handlePrev={handlePrev}
                    handleNext={handleNext}
                    currentPage={currentPage}
                    totalPage={totalPage}
                    getPaginationNo={getPaginationNo}
                    getListData={getListData}
                    headers={Document.List.headers}
                    sortStates={sortStatesListView}
                    setSortStates={setSortStatesListView}
                    openPopup={openPopup}
                    setOpenPopup={setOpenPopup}
                    PopupDocument={PopupDocument}
                    handleMultiSharedFiles={handleMultiSharedFiles}
                    selectedRow={selectedRow}
                    setSelectedRow={setSelectedRow}
                    handleMultiFile={handleMultiFile}
                  />
                ) : listView === "Deleted" ? (
                  <DeletedView
                    documentList={responseData.data}
                    renderDocumentIcon={renderDocumentIcon}
                    deletedActions={Document.delete.actions}
                    setSelectedDoc={setSelectedDoc}
                    handleOptionClick={handleOptionClick}
                    handlePrev={handlePrev}
                    handleNext={handleNext}
                    currentPage={currentPage}
                    totalPage={totalPage}
                    getPaginationNo={getPaginationNo}
                    getListData={getListData}
                    headers={Document.delete.headers}
                    sortStates={sortStatesDeleteView}
                    setSortStates={setSortStatesDeleteView}
                    openPopup={openPopup}
                    setOpenPopup={setOpenPopup}
                    PopupDocument={PopupDocument}
                  />
                ) : (
                  <SharedView
                    documentList={responseData.data}
                    renderDocumentIcon={renderDocumentIcon}
                    actions={Document.Share.actions}
                    setSelectedDoc={setSelectedDoc}
                    handleOptionClick={handleOptionClick}
                    handlePrev={handlePrev}
                    handleNext={handleNext}
                    currentPage={currentPage}
                    totalPage={totalPage}
                    getPaginationNo={getPaginationNo}
                    getListData={getListData}
                    headers={Document.Share.headers}
                    sortStates={sortStatesShareView}
                    setSortStates={setSortStatesShareView}
                    openPopup={openPopup}
                    setOpenPopup={setOpenPopup}
                    PopupDocument={PopupDocument}
                  />
                )
              ) : (
                listView !== "AdvanceShare" && (
                  <GridView
                    documentList={responseData.data}
                    setOpenPopup={setOpenPopup}
                    setSelectedDoc={setSelectedDoc}
                    renderDocumentIcon={renderDocumentIconGrid}
                    PopupDocument={PopupDocument}
                    openPopup={openPopup}
                    actions={
                      listView === "Deleted"
                        ? Document.delete.actions
                        : listView === "Shared"
                          ? Document.Share.actions
                          : Document.List.actions
                    }
                    handleOptionClick={handleOptionClick}
                    handlePrev={handlePrev}
                    handleNext={handleNext}
                    currentPage={currentPage}
                    totalPage={totalPage}
                    getPaginationNo={getPaginationNo}
                    listView={listView}
                  />
                )
              )}

              {listView === "AdvanceShare" && (
                <AdvanceShareView
                  setPopupType={setPopupType}
                  setUploadPopup={setUploadPopup}
                  RenderFields={RenderFields}
                  setListView={setListView}
                  Row={Row}
                  sectionIndex={sectionIndex}
                  formData={formData}
                  handleFieldChange={handleFieldChange}
                  formErrors={formErrors}
                  viewOnly={viewOnly}
                  editOnly={editOnly}
                  actionClicked={actionClicked}
                  selectedDoc={selectedDoc}
                  setSelectedIndex={setSelectedIndex}
                  selectedIndex={selectedIndex}
                  shareArray={shareArray}
                  setShareArray={setShareArray}
                  folderID={folderID}
                  selectedRow={selectedRow}
                  filteredLisToShare={filteredLisToShare}
                />
              )}
            </>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default ModuleDocument;
