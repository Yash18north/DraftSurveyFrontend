import React, { useEffect, useRef, useState } from "react";
import { Button } from "reactstrap";
import { getCertificateDetailsById } from "../../components/common/commonHandlerFunction/intenralCertificateHandlerFunction";
import { useParams } from "react-router-dom";
import TestReportPreviewDetails from "./testReportFiles/TestReportPreviewDetails";
import termcondition from "../../assets/images/TestMemo/t&c.jpg";
import termconditionTIPL from "../../assets/images/TestMemo/TIPLt&c.png";
import termconditionPetro from "../../assets/images/TestMemo/t&c_petro.jpg";
import OverlayLoading from "../../components/common/OverlayLoading";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import {
  GetTenantDetails,
  postDataFromApi,
} from "../../services/commonServices";
import { decryptDataForURL } from "../../utills/useCryptoUtils";
import { saveAs } from "file-saver";
import html2pdf from "html2pdf.js";
import { useSelector } from "react-redux";
import TCRCBackground from "../../assets/images/TestMemo/TCRCBackground.jpg";
import TIPLBackground from "../../assets/images/TestMemo/TIPLBackground.jpg";
import { toast } from "react-toastify";
import { InternalCertificateGetPDFApi } from "../../services/api";
const TestReportPreview = () => {
  let { icID } = useParams();
  icID = decryptDataForURL(icID);
  const [testMemoId, setTestMemoId] = useState("");
  const [responsedata, setResponseData] = useState("");
  const [labDetails, setLabDetails] = useState("");
  const [isPDFDownload, setIsPDFDownload] = useState(false);
  const [nonScopeData, setNonScopeData] = useState([]);
  const [scopeData, setScopeData] = useState([]);
  const reportTemplateRef = useRef(null);
  const session = useSelector((state) => state.session);

  const user = session.user;

  useEffect(() => {
    getCertificateDetailsById(icID, null, setResponseData, setTestMemoId, 1);
  }, [icID]);

  const getPdfName = () => {
    let pdfFileName = `${responsedata.ic_ulrno}`;
    if (scopeData.length === 0) {
      if (nonScopeData.length === 1 && nonScopeData[0].samples.length === 1) {
        pdfFileName = nonScopeData[0].samples[0].sample_code;
      } else {
        // const firstValue = nonScopeData[0].samples[0].sample_code
        // const secondValue = nonScopeData[nonScopeData.length - 1].samples[nonScopeData[nonScopeData.length - 1].samples.length - 1].sample_code
        // pdfFileName = firstValue.slice(-4) + '_' + secondValue.slice(-4)

        const firstValue =
          nonScopeData[0].samples[0].sample_code +
          (labDetails?.lab_is_compliant ? "A" : "");
        pdfFileName = firstValue;
      }
    }
    return pdfFileName + ".pdf";
  };
  //This code original
  const handlePDFConfirmBKKK = async () => {
    setIsPDFDownload(true);

    const pdfFileName = getPdfName();
    const sections = document.querySelectorAll(".pdf-section");
    if (sections.length === 0) {
      console.error("No sections found for PDF generation.");
      setIsPDFDownload(false);
      return;
    }

    const margin = 16; // 16px margin on all sides
    const customWidth = 700 - 2 * margin; // Adjusted width for the margin

    const opt = {
      margin: [0, 0], // This is for html2canvas; we'll handle margins for jsPDF separately
      filename: pdfFileName,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 4, useCORS: true },
      jsPDF: {
        unit: "pt",
        format: [700, 0], // The full width, we'll handle margins separately
        orientation: "portrait",
      },
      pagebreak: { mode: ["avoid-all"], after: ".page-break" },
    };

    try {
      let pdf;

      for (let i = 0; i < sections.length; i++) {
        const input = sections[i];
        if (!input) {
          console.error(`Section ${i + 1} is not available.`);
          continue;
        }

        // Capture the section as a canvas
        const canvas = await html2canvas(input, opt.html2canvas);
        const imgData = canvas.toDataURL("image/jpeg", opt.image.quality);

        // Get the original width and height of the canvas
        const originalWidth = canvas.width;
        const originalHeight = canvas.height;

        // Calculate the height for the PDF page while maintaining the aspect ratio
        const height = (customWidth / originalWidth) * originalHeight;

        if (i === 0) {
          // Create the PDF with the first page
          pdf = new jsPDF({
            unit: "pt",
            format: [customWidth + 2 * margin, height + 2 * margin],
            orientation: "portrait",
          });
        } else {
          // Add a new page with the calculated height
          pdf.addPage([customWidth + 2 * margin, height + 2 * margin]);
        }

        // Add the image to the PDF with the margin applied
        pdf.addImage(imgData, "JPEG", margin, margin, customWidth, height);
      }

      const pdfBlob = pdf.output("blob");
      saveAs(pdfBlob, pdfFileName);
    } catch (error) {
      console.error("Error generating the final PDF", error);
    } finally {
      setIsPDFDownload(false);
    }
  };
  //Please dont remove this code
  //Its working batter but still taking uch time so i hv commented it 35MB to 5MB
  const handlePDFConfirmbbkkk = async () => {
    setIsPDFDownload(true);

    const pdfFileName = getPdfName();
    const sections = document.querySelectorAll(".pdf-section");
    if (sections.length === 0) {
      console.error("No sections found for PDF generation.");
      setIsPDFDownload(false);
      return;
    }

    const margin = 16; // 16px margin on all sides
    const customWidth = 700 - 2 * margin; // Adjusted width for the margin

    const opt = {
      margin: [0, 0],
      filename: pdfFileName,
      image: { type: "jpeg", quality: 0.8 }, // Reduced quality to 0.8
      html2canvas: { scale: 3, useCORS: true }, // Reduced scale from 4 to 3
      jsPDF: {
        unit: "pt",
        format: [700, 0],
        orientation: "portrait",
      },
      pagebreak: { mode: ["avoid-all"], after: ".page-break" },
    };

    try {
      let pdf;

      for (let i = 0; i < sections.length; i++) {
        const input = sections[i];
        if (!input) {
          console.error(`Section ${i + 1} is not available.`);
          continue;
        }

        const canvas = await html2canvas(input, opt.html2canvas);
        const imgData = canvas.toDataURL("image/jpeg", opt.image.quality);

        // Resize the canvas to reduce size without much loss in quality
        const resizeFactor = 0.9;
        const resizedWidth = canvas.width * resizeFactor;
        const resizedHeight = canvas.height * resizeFactor;

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = resizedWidth;
        tempCanvas.height = resizedHeight;
        const tempContext = tempCanvas.getContext("2d");
        tempContext.drawImage(canvas, 0, 0, resizedWidth, resizedHeight);

        const resizedImgData = tempCanvas.toDataURL(
          "image/jpeg",
          opt.image.quality
        );

        const height = (customWidth / resizedWidth) * resizedHeight;

        if (i === 0) {
          pdf = new jsPDF({
            unit: "pt",
            format: [customWidth + 2 * margin, height + 2 * margin],
            orientation: "portrait",
          });
        } else {
          pdf.addPage([customWidth + 2 * margin, height + 2 * margin]);
        }

        pdf.addImage(
          resizedImgData,
          "JPEG",
          margin,
          margin,
          customWidth,
          height
        );
      }

      const pdfBlob = pdf.output("blob");
      saveAs(pdfBlob, pdfFileName);
    } catch (error) {
      console.error("Error generating the final PDF", error);
    } finally {
      setIsPDFDownload(false);
    }
  };
  //
  //don't remove this code already working but we have call pdf using api so commented this
  const handlePDFConfirmwithoutA4Size = async () => {
    setIsPDFDownload(true);

    const pdfFileName = getPdfName();
    const sections = document.querySelectorAll(".pdf-section");
    if (sections.length === 0) {
      console.error("No sections found for PDF generation.");
      setIsPDFDownload(false);
      return;
    }

    const margin = 16; // 16px margin on all sides
    const customWidth = 700 - 2 * margin; // Adjusted width for the margin

    const opt = {
      margin: [0, 0],
      filename: pdfFileName,
      image: { type: "jpeg", quality: 0.7 }, // Reduced quality further to 0.7
      html2canvas: { scale: 2, useCORS: true }, // Reduced scale from 3 to 2
      jsPDF: {
        unit: "pt",
        format: [700, 0],
        orientation: "portrait",
      },
      pagebreak: { mode: ["avoid-all"], after: ".page-break" },
    };

    try {
      let pdf;

      for (let i = 0; i < sections.length; i++) {
        const input = sections[i];
        if (!input) {
          console.error(`Section ${i + 1} is not available.`);
          continue;
        }

        // Capture the section as a canvas
        const canvas = await html2canvas(input, opt.html2canvas);
        const imgData = canvas.toDataURL("image/jpeg", opt.image.quality);

        // Resize the canvas to reduce size
        const resizeFactor = 0.8; // Adjust this value to trade-off between speed and quality
        const resizedWidth = canvas.width * resizeFactor;
        const resizedHeight = canvas.height * resizeFactor;

        // Create a temporary canvas for resizing
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = resizedWidth;
        tempCanvas.height = resizedHeight;
        const tempContext = tempCanvas.getContext("2d");
        tempContext.drawImage(canvas, 0, 0, resizedWidth, resizedHeight);

        const resizedImgData = tempCanvas.toDataURL(
          "image/jpeg",
          opt.image.quality
        );

        // Calculate height to maintain aspect ratio
        const height = (customWidth / resizedWidth) * resizedHeight;

        if (i === 0) {
          // Create the PDF with the first page
          pdf = new jsPDF({
            unit: "pt",
            format: [customWidth + 2 * margin, height + 2 * margin],
            orientation: "portrait",
          });
        } else {
          // Add a new page for subsequent sections
          pdf.addPage([customWidth + 2 * margin, height + 2 * margin]);
        }

        // Add the resized image to the PDF
        pdf.addImage(
          resizedImgData,
          "JPEG",
          margin,
          margin,
          customWidth,
          height
        );
      }

      // Output the PDF as a blob and save it
      const pdfBlob = pdf.output("blob");
      saveAs(pdfBlob, pdfFileName);
    } catch (error) {
      console.error("Error generating the final PDF", error);
    } finally {
      setIsPDFDownload(false);
    }
  };
  const handlePDFConfirm05_12_2024 = async () => {
    setIsPDFDownload(true);

    const pdfFileName = getPdfName();
    const sections = document.querySelectorAll(".pdf-section");
    if (sections.length === 0) {
      console.error("No sections found for PDF generation.");
      setIsPDFDownload(false);
      return;
    }

    const margin = 20; // 20pt margin on all sides
    const a4Width = 595.28; // A4 width in points
    const a4Height = 841.89; // A4 height in points
    const contentWidth = a4Width - 2 * margin;

    const opt = {
      margin: [0, 0],
      filename: pdfFileName,
      image: { type: "jpeg", quality: 0.8 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: {
        unit: "pt",
        format: "a4",
        orientation: "portrait",
      },
    };

    try {
      const pdf = new jsPDF(opt.jsPDF);

      for (let i = 0; i < sections.length; i++) {
        const input = sections[i];
        if (!input) {
          console.error(`Section ${i + 1} is not available.`);
          continue;
        }

        // Capture the section as a canvas
        const canvas = await html2canvas(input, opt.html2canvas);
        const imgData = canvas.toDataURL("image/jpeg", opt.image.quality);

        // Scale the content to fit A4 width while maintaining aspect ratio
        const scaleFactor = canvas.width / contentWidth;
        const imgWidth = contentWidth;
        const imgHeight = canvas.height / scaleFactor;

        // Content height to handle overflow
        let yOffset = 0;

        while (yOffset < imgHeight) {
          const remainingHeight = imgHeight - yOffset;
          const printHeight = Math.min(a4Height - 2 * margin, remainingHeight);

          if (yOffset > 0) {
            pdf.addPage(); // Only add a page if there is overflow
          }

          pdf.addImage(
            imgData,
            "JPEG",
            margin,
            margin - yOffset, // Ensure proper offset
            imgWidth,
            printHeight,
            undefined,
            "FAST"
          );

          yOffset += a4Height - 2 * margin; // Increment the offset for the next section
        }
      }

      // Save the PDF after all sections are processed
      const pdfBlob = pdf.output("blob");
      saveAs(pdfBlob, pdfFileName);
    } catch (error) {
      console.error("Error generating the final PDF", error);
    } finally {
      setIsPDFDownload(false);
    }
  };
  const handlePDFConfirm051224 = async () => {
    setIsPDFDownload(true);

    const pdfFileName = getPdfName();
    const sections = document.querySelectorAll(".pdf-section");
    if (sections.length === 0) {
      console.error("No sections found for PDF generation.");
      setIsPDFDownload(false);
      return;
    }

    const margin = 20; // 20pt margin on all sides
    const a4Width = 595.28; // A4 width in points
    const a4Height = 841.89; // A4 height in points
    const contentWidth = a4Width - 2 * margin;

    const opt = {
      margin: [0, 0],
      filename: pdfFileName,
      image: { type: "jpeg", quality: 0.8 },
      html2canvas: {
        scale: 2, // Higher scale for better quality
        useCORS: true,
      },
      jsPDF: {
        unit: "pt",
        format: "a4",
        orientation: "portrait",
      },
    };

    try {
      const pdf = new jsPDF(opt.jsPDF);

      for (let i = 0; i < sections.length; i++) {
        const input = sections[i];
        if (!input) {
          console.error(`Section ${i + 1} is not available.`);
          continue;
        }

        // Clone and style the section in a hidden container
        const hiddenContainer = document.createElement("div");
        hiddenContainer.style.width = "800px"; // Fixed width for consistent rendering
        hiddenContainer.style.position = "absolute";
        hiddenContainer.style.top = "-9999px";
        hiddenContainer.style.left = "-9999px";
        hiddenContainer.innerHTML = input.innerHTML;
        document.body.appendChild(hiddenContainer);

        // Capture the section as a canvas
        const canvas = await html2canvas(hiddenContainer, opt.html2canvas);
        const imgData = canvas.toDataURL("image/jpeg", opt.image.quality);
        document.body.removeChild(hiddenContainer); // Cleanup after capturing

        // Scale the content to fit A4 width while maintaining aspect ratio
        const scaleFactor = canvas.width / contentWidth;
        const imgWidth = contentWidth;
        const imgHeight = canvas.height / scaleFactor;

        // Handle content overflow by splitting into pages
        let yOffset = 0;

        while (yOffset < imgHeight) {
          const remainingHeight = imgHeight - yOffset;
          const printHeight = Math.min(a4Height - 2 * margin, remainingHeight);

          if (yOffset > 0) {
            pdf.addPage(); // Add a page for overflow
          }

          pdf.addImage(
            imgData,
            "JPEG",
            margin,
            margin - yOffset, // Proper offset
            imgWidth,
            printHeight,
            undefined,
            "FAST"
          );

          yOffset += a4Height - 2 * margin; // Increment offset for the next section
        }
      }

      // Save the PDF after processing all sections
      const pdfBlob = pdf.output("blob");
      saveAs(pdfBlob, pdfFileName);
    } catch (error) {
      console.error("Error generating the final PDF", error);
    } finally {
      setIsPDFDownload(false);
    }
  };


  const handlePDFConfirm111 = async () => {
    setIsPDFDownload(true);

    const pdfFileName = getPdfName();
    const sections = document.querySelectorAll(".pdf-section");
    if (sections.length === 0) {
      console.error("No sections found for PDF generation.");
      setIsPDFDownload(false);
      return;
    }

    const margin = 20; // 20pt margin on all sides
    const a4Width = 595.28; // A4 width in points
    const a4Height = 841.89; // A4 height in points
    const contentWidth = a4Width - 2 * margin;

    const opt = {
      margin: [0, 0],
      filename: pdfFileName,
      image: { type: "jpeg", quality: 0.8 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: {
        unit: "pt",
        format: "a4",
        orientation: "portrait",
      },
    };

    try {
      const pdf = new jsPDF(opt.jsPDF);
      let yOffset = 0; // Track the position of the content

      // Iterate through each section
      for (let i = 0; i < sections.length; i++) {
        const input = sections[i];
        if (!input) {
          console.error(`Section ${i + 1} is not available.`);
          continue;
        }

        // Capture the section as a canvas
        const canvas = await html2canvas(input, opt.html2canvas);
        const imgData = canvas.toDataURL("image/jpeg", opt.image.quality);

        // Scale the content to fit A4 width while maintaining aspect ratio
        const scaleFactor = canvas.width / contentWidth;
        const imgWidth = contentWidth;
        const imgHeight = canvas.height / scaleFactor;

        // If it's not the first section, add a new page
        if (i > 0) {
          pdf.addPage();
        }

        // Render content, split across pages if necessary
        let remainingHeight = imgHeight;
        let printHeight = Math.min(a4Height - 2 * margin, remainingHeight); // Fit content to page

        while (remainingHeight > 0) {
          pdf.addImage(
            imgData,
            "JPEG",
            margin,
            yOffset + margin, // Ensure correct top margin
            imgWidth,
            printHeight,
            undefined,
            "FAST"
          );

          remainingHeight -= printHeight; // Update remaining height
          yOffset += printHeight; // Move down for the next portion of content

          // If content is still remaining, add a new page
          if (remainingHeight > 0) {
            pdf.addPage();
          }
        }

        // Reset yOffset for the next section
        yOffset = 0;
      }

      // Output the PDF as a blob and save it
      const pdfBlob = pdf.output("blob");
      saveAs(pdfBlob, pdfFileName);
    } catch (error) {
      console.error("Error generating the final PDF", error);
    } finally {
      setIsPDFDownload(false);
    }
  };


  //api integration download
  const handlePDFConfirmAPI = async () => {
    try {
      setIsPDFDownload(true);
      let endPoint = InternalCertificateGetPDFApi;
      const body = {
        ic_id: icID,
      };
      let res = await postDataFromApi(endPoint, body, "", 1);
      if (res?.status === 200) {
        let pdfName = getPdfName();
        const blob = new Blob([res.data], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = getPdfName();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setIsPDFDownload(false);
    }
  };
  const preloadImagesWithCrossOrigin = async () => {
    const images = Array.from(document.querySelectorAll(".pdf-section img"));
    for (const img of images) {
      try {
        const tempImg = new Image();
        tempImg.crossOrigin = "anonymous";
        tempImg.src = `${img.src}?cacheBust=${new Date().getTime()}`;
        await new Promise((resolve, reject) => {
          tempImg.onload = () => {
            img.src = tempImg.src;
            resolve();
          };
          tempImg.onerror = (err) => {
            reject(err);
          };
        });
      } catch (error) {
      }
    }
  };

  const preloadBackgroundImages = async () => {
    const elements = Array.from(document.querySelectorAll(".testMemoPreviewContainer"));

    for (const element of elements) {
      const bgImage = window.getComputedStyle(element).getPropertyValue("background-image");
      const match = bgImage.match(/url\(["']?([^"']*)["']?\)/);
      if (match && match[1]) {
        const imgSrc = match[1];

        try {
          const response = await fetch(`${imgSrc}?cacheBust=${new Date().getTime()}`, {
            mode: "cors", // Enforce CORS
          });
          if (!response.ok) {
            throw new Error(`Failed to fetch background image: ${imgSrc}`);
          }

          const blob = await response.blob();
          const dataURL = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });

          // Set the background image inline as a data URL
          element.style.backgroundImage = `url("${dataURL}")`;
        } catch (error) {
        }
      }
    }
  };



  const handlePDFConfirm = async () => {
    setIsPDFDownload(true);

    const pdfFileName = getPdfName();
    const sections = document.querySelectorAll(".pdf-section");

    if (sections.length === 0) {
      setIsPDFDownload(false);
      return;
    }

    const margin = 20;
    const a4Width = 595.28;
    const a4Height = 841.89;
    const contentWidth = a4Width - 2 * margin;

    const opt = {
      margin: [0, 0],
      filename: pdfFileName,
      image: { type: "jpeg", quality: 0.8 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      },
      jsPDF: {
        unit: "pt",
        format: "a4",
        orientation: "portrait",
      },
    };

    try {
      // Preload images
      await preloadImagesWithCrossOrigin();
      await preloadBackgroundImages();

      const pdf = new jsPDF(opt.jsPDF);

      for (let i = 0; i < sections.length; i++) {
        const input = sections[i];
        if (!input) {
          console.error(`Section ${i + 1} is not available.`);
          continue;
        }

        const canvas = await html2canvas(input, opt.html2canvas);
        const imgData = canvas.toDataURL("image/jpeg", opt.image.quality);

        const scaleFactor = canvas.width / contentWidth;
        const imgWidth = contentWidth;
        const imgHeight = canvas.height / scaleFactor;

        let yOffset = 0;

        while (yOffset < imgHeight) {
          const remainingHeight = imgHeight - yOffset;
          const printHeight = Math.min(a4Height - 2 * margin, remainingHeight);

          if (yOffset > 0) {
            pdf.addPage();
          }

          pdf.addImage(
            imgData,
            "JPEG",
            margin,
            margin - yOffset,
            imgWidth,
            printHeight,
            undefined,
            "FAST"
          );

          yOffset += a4Height - 2 * margin;
        }
      }

      const pdfBlob = pdf.output("blob");
      saveAs(pdfBlob, pdfFileName);
    } catch (error) {
      console.error("Error generating the final PDF", error);
    } finally {
      setIsPDFDownload(false);
    }
  };

  //
  const isNABLLab = user?.logged_in_user_info?.lab_or_branch?.lab_is_compliant;
  return (
    <>
      <style>
        {`
            .pdf-container {
            display: flex;
            width: 100%;
            justify-content: center;
            padding: 10px;
          }

          
          .tcrcHeaderLogo {
           width: 50vw;
          height: 90px;
          max-width: 560px;
          }
          .tcrcHeaderLogoTIPL {
           width: 50vw;
          height: 90px;
          max-width: 560px;
          }

          .testMemoPreviewContainer {
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            width: 100%;
            box-sizing: border-box;
            margin: 20px;
            // padding: $select-height;
            padding: 22px;
            position: relative;
            height: 1580pt;
            //1226pt
            // border: 1px solid black;
          }

          .Lab-stamp {
            font-family: 'Times New Roman', Times, serif;
            height:auto;
            width:132px;
          }
            

          .ulr_details>div>h3 {
            font-weight: 600 !important;
            font-size: 22px !important;
            font-family: 'Times New Roman', Times, serif;
            margin-bottom: 3px;
          }

          .job-details>div>p {
            // width: 46%;
            margin-bottom: 3px;
            font-size: 22px;
            font-weight: 400;
            color: #000;
            font-family: 'Times New Roman', Times, serif;

          }

          .nablImg>img {
            // width: 5rem;
            // height: auto;
            // max-height: 80px;
            // max-width: 80px;
            // width:100%;
            // height:100%
            height:auto;
            width:132px;
          }
          .pdf-content {
            padding-top: 0;
          }

          .page-break {
            page-break-before: always;
            /* Forces a page break before the element */
          }

          .header {
            top: 0;
            text-align: center;
            background: #f8f8f8;
            padding: 10px;
          }

          .footer {
            bottom: 0;
            text-align: center;
            background: #f8f8f8;
            padding: 10px;
          }

          .pdfContent {
            margin-top: 30px;
            /* Adjust based on header height */
            margin-bottom: 30px;
            /* Adjust based on footer height */
          }


          .header-content,
          .footer-content {
            width: 100%;
          }

          th,
          td {
            padding: 8px;
            text-align: center;

          }
        th {
            background-color: #f2f2f2;
        }
        .logo-description {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          position: relative;
          top: 0;
        }
          
          th {
            background-color: #f2f2f2;
          }

          .logo-description {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            position: relative;
            top: 0;
          }

          .logo-description>div>h1 {
            color: #E11D07;
            width: 75%;
            font-size: 22px;
            font-weight: 700;
            font-family: 'Times New Roman', Times, serif;
            margin-bottom:0px;
          }
          .logo-description-header-detail h1{
              width: 100% !important;
          }
          .logo-description-header-detail p{
              width: 80% !important;
          }

          .logo-description>div>h1>span {
            font-size: 16px;
            font-family: 'Times New Roman', Times, serif;

          }

          .logo-description>div>p {
            font-size: 20px;
            width: 60%;
            font-family: 'Times New Roman', Times, serif;
            font-weight: 500 !important;
            margin-bottom:3px
          }

          

       .heading_h1 {
    display: flex;
    justify-content: center;
    font-size: 25px;
    font-weight: 700;
    text-transform: uppercase;
    width: 60%;
    /* margin-left: -50px; */
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
}

          .headingWithLogos {
            display: flex;
            justify-content: space-between;
            padding-top: 4px;
               position: relative;
          }
 

          .nablImg {
            display: flex;
            justify-content: flex-end;
          }

          .ulr_details {
            margin-top: 3px;
            display: flex;
            justify-content: space-between;
            // margin-bottom: 5px;
          }


          .job-details>div {
            width: 100%;
            display: flex;
            justify-content: space-between;
          }


          .job-details>div>span {
            // width: 8%;
            display: flex;
            align-items: center;
          }

          .footerDetails {
            position: absolute;
            bottom: 0;
            width:100%
          }

          .footerDetails>img {
            width: 100%;
            height: auto;
            margin-top: 22px;
          }

          .roles {
            margin: $select-height 0px;
            display: flex;
            justify-content: space-between;
          }

          .test-report-end {
            justify-content: center !important;
          }

          .roles>div {
            display: flex;
            flex-direction: column;
          }

          .roles.userdetails-roles p {
            margin-bottom: 0.1rem !important;
          }

          .roles.userdetails-roles div {
            
            // justify-content: space-between;
            align-items: center;
          }

          .end {
            display: flex;
            justify-content: flex-end;
          }

          .first_td {
            border: 2px solid #8080809c;
            text-align: center;
            font-size: 22px;
            font-weight: 600;
          }

          .second_td {
            border: 2px solid #8080809c;
            font-size: 22px;
            font-weight: 500;
          }

          .third_td {
            border: 2px solid #8080809c;
            font-size: 13px;
            font-weight: 400;
          }

          .header_urs_label {
            margin: 24px 10px 16px;
          }

          .width-33 {
            width: 33%;
            margin-top: 3% !important;
          }

          .paramterTableSpecialClass {
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: baseline;
          }

          .paramterTableSpecialClass>div {
            height: 38px;
          }

          .result_label {

            font-size: 22px;
            font-weight: 600;
          }
            .roles.userdetails-roles {
               font-size: 22px;
            }

          .testMemoPreviewContainer .param-table-data table td {
            padding: 0px;
          }
           .roles.userdetails-roles {
            width: 90%;
            margin-left: 5%;
           
            }
          .header-footer-content-bg {
            padding: 10px 80px;
          }

          .term-condition-img {
            height: 100%;
            width: 100%
          }

          .footerContainer {
            display: flex;
            margin-left: 2%;
            margin-right: 2%;
          }

          .footerContainerLeft,
          .footerContainerRight {
            width: 40%;
            font-size: 16px;
            padding-top: 4%;
          }

          .footerContainerComplete {
            width: 100%;
            font-size: 11px;
            padding-top: 4%;
          }

          .footerContainerBottom {
            width: 100%;
            display: flex;
            justify-content: center;
            font-size: 16px;
            margin-top: 4px;
          }

            .footerContainer>img {
            width: 16%;
            height: 120px;
            max-width: 146px;
        }

         .leftStart {
              margin-left: 2%;
              padding-bottom: 16px;
              font-size: 22px;
          }

          .param-table-data,
          .first_td,
          .result_label,
          .heading_h1,
          .userdetails-roles,
          .footerDetails {
            font-family: 'Times New Roman', Times, serif;
          }
          .footerContainerTipl{
            width:100%;
            img{
              width: 97%;
              height: 150px;
            }
          }
          .logo-description-tpbpl{
            .logo-description-header-detail{
            width:45% !important
            }
            .logo-description-header-detail p{
            width:100% !important
            }
          }
            .footerContainerComplete-tpbpl p{
              font-size:18px;
              margin-bottom:0px;
            }
            .footerContainerComplete-tpbpl ol li{
            font-size:16px
            }
            .pdf-section {
              width: 100%;
              padding: 10px;
              box-sizing: border-box;
              background: white;
            }
              .stamp-signature-TM img{
              height: 120px;
              width: 120px;
              position: absolute;
              }
              .stamp-signature-TM .signature-div{
              margin-top: 76px;
              }
        `}
      </style>
      {isPDFDownload && <OverlayLoading fullScreen={true} />}
      <div className="pdf-container">
        <div id="generatePDF" ref={reportTemplateRef}>
          <div id="pdfContent">
            <div className="pdf-main-content">
              <TestReportPreviewDetails
                scopType="scope"
                testMemoId={testMemoId}
                responsedata={responsedata}
                setLabDetails={setLabDetails}
                labDetails={labDetails}
                isPDFDownload={isPDFDownload}
                setScopeData={setScopeData}
                scopeData={scopeData}
                isLastPageShow={nonScopeData.length === 0}
              />
              <TestReportPreviewDetails
                scopType="non_scope"
                testMemoId={testMemoId}
                responsedata={responsedata}
                setLabDetails={setLabDetails}
                labDetails={labDetails}
                isPDFDownload={isPDFDownload}
                scopeData={scopeData}
                setNonScopeData={setNonScopeData}
                nonScopeData={nonScopeData}
                isLastPageShow={nonScopeData.length > 0}
              />
              <section
                style={{ marginTop: "0px" }}
                id={"section-0"}
                className="pdf-section"
              >
                <div
                  className="testMemoPreviewContainer"
                  style={{
                    backgroundImage: `url(${GetTenantDetails(1, 1) != "TPBPL" && isNABLLab
                      ? responsedata?.company?.company_code === "L"
                        ? TIPLBackground
                        : TCRCBackground
                      : ""
                      })`,
                    // backgroundImage: `url(${
                    //   GetTenantDetails(1, 1) != "TPBPL" && isNABLLab
                    //     ? responsedata?.company?.company_code === "L"
                    //       ? TIPLBackground
                    //       : TCRCBackground
                    //     : ""
                    // })`,
                    backgroundImage: `url(${GetTenantDetails(1, 1) != "TPBPL" &&
                      isNABLLab &&
                      labDetails?.company?.cmp_water_mark
                      })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    boxSizing: "border-box",
                    margin: "0px",
                    height: "100%"
                  }}
                >
                  <img
                    src={
                      GetTenantDetails(1, 1) == "TPBPL"
                        ? termconditionPetro
                        : responsedata?.company?.company_code === "L"
                          ? termconditionTIPL
                          : termcondition
                    }
                    className={"term-condition-img"}
                  />
                </div>
              </section>
            </div>
          </div>
        </div>
        {responsedata.status === "publish" && (
          <div className="autoWidthImportantLeft">
            <Button
              type="button"
              className="submitBtn btn btn-primary"
              // onClick={handlePDFConfirm}
              onClick={handlePDFConfirmAPI}
            >
              Download
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default TestReportPreview;
