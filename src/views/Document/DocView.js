import React, { useEffect, useState } from "react";
import { postDataFromApi } from "../../services/commonServices";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveAs } from "file-saver";
import { decryptDataForURL } from "../../utills/useCryptoUtils";
import Loading from "../../components/common/OverlayLoading";
import { useSelector } from "react-redux";

const DocumentViewer = () => {
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
  const [s3Url, setS3Url] = useState("");
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const hash = window.location.hash;
  let decryptedVal = decryptedValue(hash.split("?")[1]);
  const params = new URLSearchParams(decryptedVal);
  const ispass = params.get("ispass");
  const id = params.get("id");


  useEffect(() => {
    if (ispass?.toLowerCase() === "false") {
      const handleNoPassword = async () => {
        let res = await postDataFromApi(`/document_shares/paasverify/`, {
          id: id,
        });
        if (res.status === 200) {
          setS3Url(res.data.data.document.dl_s3_url);
          setShareFileData(res.data.data);
          setIsPasswordProtected(false);
        }
      };
      handleNoPassword();
    }
  }, []);
  const session = useSelector((state) => state.session);
  useEffect(() => {
    if (session.user) {
      alert("An active session has been detected. Please log out or access this page in Incognito mode.");
      window.location.href = "https://support.google.com/chrome/answer/95464";
    }
  }, [])
  const [inputValue, setInputValue] = useState("");
  const [shareFileData, setShareFileData] = useState("");
  const handlePasswordSubmit = async () => {
    const payload = {
      id: id,
      password: inputValue,
    };

    let res = await postDataFromApi(`/document_shares/paasverify/`, payload);
    if (res.status === 200) {
      setS3Url(res.data.data.document.dl_s3_url);
      setShareFileData(res.data.data);

      setIsPasswordProtected(false);
      toast.success(res.data.message);
    } else {
      toast.error(res.data.message);
    }
  };
  const getFileNameAndExtension = (url) => {
    const urlParts = url.split("/");
    const filename = urlParts[urlParts.length - 1];
    const nameParts = filename.split(".");
    const extension = nameParts.length > 1 ? "." + nameParts.pop() : "";
    return { filename, extension };
  };
  const getFormattedDateTime = () => {
    const now = new Date();
    return (
      [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
      ].join("-") +
      "_" +
      [
        String(now.getHours()).padStart(2, "0"),
        String(now.getMinutes()).padStart(2, "0"),
        String(now.getSeconds()).padStart(2, "0"),
      ].join("-")
    );
  };
  const handleDownload = async (s3url) => {
    if (shareFileData.ds_download_limit > shareFileData.ds_download_count) {
      const response = await fetch(s3url);
      const blob = await response.blob();
      const { extension } = getFileNameAndExtension(s3url);
      const formattedDateTime = getFormattedDateTime();
      const newName = `Document_${formattedDateTime}${extension}`;
      saveAs(blob, newName);
      if (response.status) {
        const payload = {
          id: shareFileData.ds_id,
        };
        let res = await postDataFromApi(`/increment_download_count/`, payload);
        if (res.status === 200) {

          setShareFileData((prev) => ({
            ...prev,
            ds_download_count: prev.ds_download_count + 1,
          }));
        }
      }
    } else {
      alert("Your Download Limit Has Exceed");
    }
  };

  const [viewerUrl, setViewerUrl] = useState(null);

  useEffect(() => {
    const url = determineViewerType(s3Url);
    setViewerUrl(url);
  }, [s3Url]);

  const determineViewerType = (url) => {
    const fileExtension = url.split(".").pop().toLowerCase();
    const supportedExtensions = {
      pdf: `https://docs.google.com/viewer?url=${encodeURIComponent(
        url
      )}&embedded=true`,
      doc: `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
        url
      )}`,
      docx: `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
        url
      )}`,
      xls: `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
        url
      )}`,
      xlsx: `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
        url
      )}`,
      ppt: `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
        url
      )}`,
      pptx: `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
        url
      )}`,
    };
    return supportedExtensions[fileExtension] || null;
  };
  const [isLoading, setIsLoading] = useState(true);

  return isPasswordProtected ? (
    <div className="popupSearchContainerBG">
      <div className="popupSearchContainer documentPopup">
        <div className="input_container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) => {
              setShowIcon(e.target.value !== "");

              setInputValue(e.target.value);
            }}
            maxLength={32}
          />
          {showIcon && (
            <i
              className={!showPassword ? "bi bi-eye h4" : "bi bi-eye-slash h4"}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          )}
        </div>

        <div className="rejectButtonsContainer passwordBtn">
          <div className="popupSearchButtons">
            <button onClick={() => handlePasswordSubmit()}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div style={{ width: "100%", height: "100vh" }}>
      {/* {shareFileData.ds_restriction_view === false ? ( */}
      {isLoading && <Loading />}
      <iframe
        src={viewerUrl}
        title="Document Viewer"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        onLoad={() => setIsLoading(false)}
      ></iframe>
      {/* ) : ( */}
      {/* <div className="pageNotFound"> */}
      {/* <h1>You Are Not Authorized to View this Document.</h1> */}
      {/* </div> */}
      {/* )} */}
      {shareFileData.ds_restriction_download === false ? (
        <button className="downloadBtn" onClick={() => handleDownload(s3Url)}>
          Download
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default DocumentViewer;
