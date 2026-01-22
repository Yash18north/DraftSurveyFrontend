import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "reactstrap";
import {
  GetTenantDetails,
  postDataFromApi,
} from "../../services/commonServices";
import { JRFGetApi, JRFGetPDFApi, MasterListApi } from "../../services/api";
import { useParams } from "react-router-dom";
import faviconIcon from "../../assets/images/logos/favicanLogo.jpg";
import { getFormatedDate, getLogoCondition } from "../../services/commonFunction";
import { decryptDataForURL } from "../../utills/useCryptoUtils";
import { toast } from "react-toastify";
import OverlayLoading from "../../components/common/OverlayLoading";
const JRFPdfDownLoad = () => {
  const contentRef = useRef();
  let { JRFId } = useParams();
  JRFId = decryptDataForURL(JRFId);
  const [isPDFDownload, setIsPDFDownload] = useState(false);
  const [jrf_data, setJRFData] = useState("");
  const [testMethods, setTestMethods] = useState([]);
  const handleDownloadJRFBkp = async () => {
    const pdfFileName = jrf_data.jrf_no + ".pdf";
    const content = contentRef.current;

    if (content) {
      // Ensure all images are loaded before capturing the content
      const images = content.getElementsByTagName("img");
      const loadImage = (img) =>
        new Promise((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = img.onerror = resolve;
          }
        });

      try {
        await Promise.all([...images].map((img) => loadImage(img)));

        // Capture the content using html2canvas with scale for better quality
        const canvas = await html2canvas(content, {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          logging: true,
        });

        // Convert the canvas to JPEG data URL with quality factor
        const imgData = canvas.toDataURL("image/jpeg", 1.0);

        // Initialize jsPDF with portrait orientation, points unit, and A4 page size
        const pdf = new jsPDF("p", "pt", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Get dimensions of the canvas
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / pdfWidth;
        const adjustedHeight = imgHeight / ratio;

        // Initialize variables for page breaking
        let heightLeft = adjustedHeight - 10;
        let position = 0;

        // Loop through and add pages if content exceeds one page
        while (heightLeft > pdfHeight) {
          pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, pdfHeight);
          heightLeft -= pdfHeight;
          position -= pdfHeight;
          pdf.addPage(); // Add new page if content exceeds one page
        }

        // Add remaining content to the last page (without adding an empty page)
        if (heightLeft > 0) {
          pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, heightLeft);
        }

        // Save the generated PDF with the specified filename
        pdf.save(pdfFileName);
      } catch (error) {
        console.error("Error generating PDF", error);
      }
    } else {
      console.error("The content element is not available.");
    }
  };
  const handleDownloadJRF = async () => {
    const pdfFileName = `${jrf_data.jrf_no}.pdf`;
    const content = contentRef.current;

    if (!content) {
      console.error("The content element is not available.");
      return;
    }

    // Helper function to ensure all images are loaded
    const preloadImages = async () => {
      const images = content.getElementsByTagName("img");
      const loadImage = (img) =>
        new Promise((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = img.onerror = resolve;
          }
        });
      await Promise.all([...images].map((img) => loadImage(img)));
    };

    try {
      // Preload all images within the content
      await preloadImages();

      // Capture the content using html2canvas
      const canvas = await html2canvas(content, {
        scale: 2, // Increase scale for better quality
        useCORS: true, // Handle cross-origin images
        allowTaint: false, // Avoid tainted canvas issues
        logging: true, // Enable logging for debugging
      });

      // Convert the canvas to a data URL
      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      // Initialize jsPDF
      const pdf = new jsPDF("p", "pt", "a4"); // Portrait, points, A4 size
      const pdfWidth = pdf.internal.pageSize.getWidth(); // Width of the PDF page
      const pdfHeight = pdf.internal.pageSize.getHeight(); // Height of the PDF page

      // Dimensions of the canvas
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / pdfWidth; // Scale ratio to fit canvas in PDF
      const adjustedHeight = imgHeight / ratio;

      // Variables for tracking content height
      let heightLeft = adjustedHeight - 10; // Remaining height to process
      let position = 0; // Starting position for each page

      // Loop through and add content to PDF
      while (heightLeft > pdfHeight) {
        pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, pdfHeight); // Add content
        heightLeft -= pdfHeight; // Reduce remaining height
        position -= pdfHeight; // Update position
        pdf.addPage(); // Add a new page
      }

      // Add remaining content on the last page
      if (heightLeft > 0) {
        pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, heightLeft);
      }

      // Save the generated PDF
      pdf.save(pdfFileName);
    } catch (error) {
      console.error("Error generating PDF", error);
    }
  };

  const getJRFDetails = async () => {
    let bodyToPass = {
      jrf_id: JRFId,
      model_name: "jrf_detail",
    };
    try {
      let res = await postDataFromApi(JRFGetApi, bodyToPass);
      if (res?.data?.status === 200) {
        let actualJrfData = res.data.jrf
        if (actualJrfData.jrf_is_ops) {
          if (!actualJrfData.jrf_desc_of_sample) {
            actualJrfData.jrf_desc_of_sample = actualJrfData?.jrf_ops_lms_assignments?.sample_mark.join(',')
          }
          if (!actualJrfData.jrf_parameters_to_analyze) {
            actualJrfData.jrf_parameters_to_analyze = actualJrfData?.jrf_ops_lms_assignments?.parameters.join(',')
          }
          // if(!actualJrfData.jrf_test_method_details){
          actualJrfData.jrf_test_method_details = actualJrfData?.jrf_ops_lms_assignments?.standards.join(',')
          // }
        }
        if (actualJrfData.jrf_petro_checklist_json) {
          for (let obj in actualJrfData.jrf_petro_checklist_json) {
            actualJrfData[obj]=actualJrfData.jrf_petro_checklist_json?.[obj]
          }
        }
        setJRFData(actualJrfData);
      }
    } catch (error) { }
  };
  useEffect(() => {
    getJRFDetails();
  }, []);
  useEffect(() => {
    if (jrf_data && !jrf_data.jrf_is_ops) {
      geStandardMethodMasterData()
    }
  }, [jrf_data])
  const geStandardMethodMasterData = async () => {
    try {
      let tempBody = {
        model_name: "standard_type",
        is_dropdown: true,
      };
      let res = await postDataFromApi(MasterListApi, tempBody);
      if (res?.data?.status === 200 && res.data.data) {
        const transformedData = []
        res.data.data.map((labDetail) => transformedData.push(labDetail[1]));
        setTestMethods(transformedData)
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handlePDFConfirmAPI = async () => {
    try {
      setIsPDFDownload(true);
      let endPoint = JRFGetPDFApi;
      const body = {
        jrf_id: JRFId,
      };
      let res = await postDataFromApi(endPoint, body, "", 1);
      if (res?.status === 200) {
        const blob = new Blob([res.data], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `${jrf_data.jrf_no}.pdf`;;
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
  const petroLiquidOptions = ['1 Liter', '500 ml', '100 ml']
  const petroSemiSlidOptions = ['1 Kg', '2 Kg', '5 Kg']
  const petroGaseousOptions = ['500 ml', '1 liter']
  return (
    <>
      <style>
        {`
    
          `}
      </style>
      {isPDFDownload && <OverlayLoading fullScreen={true} />}
      <div ref={contentRef} id="generateJRFPDF" style={{ display: "block" }}>
        <div className="container">
          <table className="table">
            <tr>
              <td rowspan="2" width="10%">
                {
                  //https://tcrc-nonprod-bucket.s3.ap-south-1.amazonaws.com/18north_masterdata/image_2025_03_04T11_34_37_504Z.png

                  jrf_data?.jrf_lab_detail?.company?.cmp_code === "L" ? (<img src={"https://tcrc-prod-bucket.s3.ap-south-1.amazonaws.com/masterdata/image_2025_03_04T11_34_37_504Z.png"} style={{ height: "130px", width: "auto" }} />) : jrf_data?.jrf_lab_detail?.company?.cmp_code === "P" ? (<img src={"https://tcrc-nonprod-bucket.s3.ap-south-1.amazonaws.com/18north_userdata/Petro_Lab_Logo_1_1.png"} style={{ height: "90px", width: "200px" }} />) : (<img src={jrf_data?.jrf_lab_detail?.company?.cmp_logo} style={{ height: "90px", width: "200px" }} />)
                }

              </td>
              <td className="header">
                <h1>
                  {jrf_data?.jrf_lab_detail?.company?.cmp_name ||
                    "TCRC QUALITY CONTROLS LLP"}
                  {", "}
                  {jrf_data?.jrf_lab_detail?.lab_name}
                </h1>
                {jrf_data?.jrf_lab_detail?.company?.cmp_code === "C" && (
                  <p>
                    Formerly Known As Therapeutics Chemical Research Corporation
                  </p>
                )}
              </td>
            </tr>
            <tr>
              <td className="header">
                <h2>JOB REQUEST FORM</h2>
              </td>
            </tr>
          </table>
          <div className="job-details">
            <p>Date: {getFormatedDate(jrf_data?.jrf_date, 1)}</p>
            <p>JRF number: {jrf_data?.jrf_no}</p>
            <p>Reference number: {jrf_data?.jrf_referenceno}</p>
            <p>
              Name of organization:{" "}
              {jrf_data?.jrf_is_external
                ? jrf_data?.jrf_ext_orgnizationname
                : jrf_data?.jrf_company_detail?.cmp_name}
            </p>
            <p>
              Address of the organization:{" "}
              {jrf_data?.jrf_is_external
                ? jrf_data?.jrf_ext_address
                : jrf_data?.jrf_cmp_address}
            </p>
            <p>
              Contact Person:{" "}
              {jrf_data?.jrf_is_external
                ? jrf_data?.jrf_ext_contactpersonname
                : jrf_data.jrf_contact_person}
            </p>
            <p>
              Phone number:{" "}
              {jrf_data?.jrf_is_external
                ? jrf_data?.jrf_ext_contactpersonnumber
                : jrf_data.jrf_contact_person_number}
            </p>
          </div>

          <h3>Sample Specifications</h3>

          <div className="sample-specification">
            <ul>
              <li>
                Name of the commodity :{" "}
                {jrf_data?.jrf_sub_commodity_detail?.sub_cmd_name}
              </li>
              {/* <li>Name of the commodity : {jrf_data?.jrf_commodity_detail?.cmd_name}</li> */}
              <li>
                Quantity of the test sample :
                {jrf_data.jrf_quanity_sample}
              </li>
              <li>
                {GetTenantDetails(1, 1, jrf_data.jrf_is_petro) === "TPBPL" ? "No. of Containers" : "No. of Packets"} :
                {jrf_data.jrf_no_of_packets}
              </li>
            </ul>
          </div>

          <h3>Job Description</h3>
          <ul>
            <li>
              Description of sample :
              {jrf_data.jrf_desc_of_sample}
            </li>
            <li>
              Parameter to be analyse :
              {jrf_data.jrf_parameters_to_analyze}
            </li>
            {!jrf_data?.jrf_is_ops && <li>
              Test Method :
              {testMethods.map((testmethod) => (
                <>
                  <input
                    type="checkbox"
                    checked={jrf_data?.jrf_test_method?.includes(testmethod)}
                  />{" "}
                  {testmethod}{" "}
                </>
              ))}
            </li>}

            <li>
              Test Method Details :- {jrf_data?.jrf_test_method_details}
            </li>
            <li>
              Other Requirement (if any) : {jrf_data.jrf_other_info}
            </li>
            <li>
              Test report Required on : {jrf_data.jrf_test_repo_req_on}{" "}{parseInt(jrf_data?.jrf_test_repo_req_on) > 1 ? "days " : "day "}
              After received of sample
            </li>
          </ul>

          <div className="terms-conditions">
            <p>
              <input type="checkbox" checked />
              <strong>Terms & Conditions: </strong>
              {GetTenantDetails(1, 1, jrf_data.jrf_is_petro) === "TPBPL"
                ? " The samples will be retained for a duration of 30 days from the date of certificate issuance. However, for export vessels, the retention period will be extended to 90 days, where applicable. Any grievances or complaints must be duly lodged within a timeframe of 15 days from the date of issuance of the test report. Both parties will adhere to and uphold a set of compliance code and principles in the provision of services. We do not provides statement of conformity, opinions or interpretations concerning the findings rendered in reports."
                : " The samples will be retained for a duration of 30 days from the date of certificate. However, for export vessels, the retention period will be extended to 90 days, where applicable. Any grievances or complaints must be duly lodged within a timeframe of 15 days from the date of issuance of the test report. Both parties will adhere to and uphold a set of compliance code and principles in the provision of services. We do not provide statements of conformity, opinions, or interpretations concerning the findings rendered in reports."}
            </p>
            <p>

              {GetTenantDetails(1, 1, jrf_data.jrf_is_petro) === "TPBPL"
                ? "We hereby accept the TCRC Petrolabs Bharat Private Limited, terms and conditions mentioned above."
                : "We hereby accept the terms and conditions mentioned above."}

            </p>
          </div>

          <div className="customer-signature">
            {!jrf_data?.jrf_is_external ? <img src={jrf_data?.jrf_created_user?.signature} /> : ""}
            <p>{jrf_data?.jrf_is_external && '$' || ''}Customer Representative Signature</p>
            {/* <p>Date: {getFormatedDate(jrf_data?.jrf_created_time, 1)}</p> */}
            <p>Date: {getFormatedDate(jrf_data?.jrf_date, 1)}</p>
            {jrf_data?.jrf_is_external ? <p style={{ textAlign: "left" }}>$The Acknowledgment has been Received Via Email</p> : null}
          </div>

          <h3>For Laboratory Use Only</h3>

          <div className="lab-use">
            <ul>
              {/* {GetTenantDetails(1, 1,jrf_data.jrf_is_petro) !== "TPBPL" &&  */}
              <li>
                <strong>Sample Condition:</strong>{" "}
                {jrf_data?.jrf_sample_condition
                  ? jrf_data?.jrf_sample_condition.join(",")
                  : ""}
              </li>
              {/* { || null} */}
              <li>
                <strong>Packaging Condition:</strong>{" "}
                {jrf_data?.jrf_pkging_condition
                  ? jrf_data?.jrf_pkging_condition.join(",")
                  : ""}
              </li>
              {GetTenantDetails(1, 1, jrf_data.jrf_is_petro) == "TPBPL" ? (
                // <ul>
                <>
                  <li>
                    <strong>Container Description</strong>{" "}
                    <input
                      type="checkbox"
                      checked={
                        jrf_data.jrf_qty_of_raw_smpl_checkboxes &&
                        jrf_data.jrf_qty_of_raw_smpl_checkboxes.includes(
                          "Aluminum Container"
                        )
                      }
                    />{" "}
                    Aluminum Container;
                    <input
                      type="checkbox"
                      checked={
                        jrf_data.jrf_qty_of_raw_smpl_checkboxes &&
                        jrf_data.jrf_qty_of_raw_smpl_checkboxes.includes(
                          "Plastic Bottle"
                        )
                      }
                    />{" "}
                    Plastic Bottle ;
                    <input
                      type="checkbox"
                      checked={
                        jrf_data.jrf_qty_of_raw_smpl_checkboxes &&
                        jrf_data.jrf_qty_of_raw_smpl_checkboxes.includes(
                          "Glass Bottle"
                        )
                      }
                    />{" "}
                    Glass Bottle ;
                    <input
                      type="checkbox"
                      checked={
                        jrf_data.jrf_qty_of_raw_smpl_checkboxes &&
                        jrf_data.jrf_qty_of_raw_smpl_checkboxes.includes("Tins")
                      }
                    />{" "}
                    Tins;
                    <input
                      type="checkbox"
                      checked={
                        jrf_data.jrf_qty_of_raw_smpl_checkboxes &&
                        jrf_data.jrf_qty_of_raw_smpl_checkboxes.includes(
                          "Gas Carrier Cylinder"
                        )
                      }
                    />{" "}
                    Gas Carrier Cylinder;
                    <input
                      type="checkbox"
                      checked={
                        jrf_data.jrf_qty_of_raw_smpl_checkboxes &&
                        jrf_data.jrf_qty_of_raw_smpl_checkboxes.includes(
                          "Plastic Bucket"
                        )
                      }
                    />{" "}
                    Plastic Bucket ; Specify (if available) : {jrf_data?.jrf_qty_of_raw_smpl_input}
                  </li>
                   <li><strong>Approximate Quantity of Received Sample:</strong></li>
                  <ul>
                    <li>
                      <b>Liquid :</b>
                      {
                        petroLiquidOptions.map((singleOPT, i) => (
                          <><input
                            type="checkbox"
                            checked={
                              jrf_data.jrf_liquid_checkbox &&
                              jrf_data.jrf_liquid_checkbox.includes(
                                singleOPT
                              )
                            }
                          />{" : " + singleOPT + " ;"}</>
                        ))
                      }
                      Specify (if available) : {jrf_data?.jrf_liquid_input}
                    </li>
                    <li>
                      <b>Semisolid :</b>
                      {
                        petroSemiSlidOptions.map((singleOPT, i) => (
                          <><input
                            type="checkbox"
                            checked={
                              jrf_data.jrf_semisolid_checkbox &&
                              jrf_data.jrf_semisolid_checkbox.includes(
                                singleOPT
                              )
                            }
                          />{" : " + singleOPT + " ;"}</>
                        ))
                      }
                      Specify (if available) : {jrf_data?.jrf_semisolid_input}
                    </li>
                    <li>
                      <b>Gaseous :</b>
                      {
                        petroGaseousOptions.map((singleOPT, i) => (
                          <><input
                            type="checkbox"
                            checked={
                              jrf_data.jrf_gaseous_checkbox &&
                              jrf_data.jrf_gaseous_checkbox.includes(
                                singleOPT
                              )
                            }
                          />{" : " + singleOPT + " ;"}</>
                        ))
                      }
                      Specify (if available) : {jrf_data?.jrf_gaseous_input}
                    </li>
                  </ul>
                  {/*  </ul> */}
                </>
              ) : (
                <>
                  <li><strong>Quantity of Received sample:</strong></li>
                  <ul>
                    <li>
                      For Raw Sample{" "}
                      <input
                        type="checkbox"
                        checked={
                          jrf_data.jrf_qty_of_raw_smpl_checkboxes &&
                          jrf_data.jrf_qty_of_raw_smpl_checkboxes.includes(
                            ">=2KG"
                          )
                        }
                      />{" "}
                      : ≥ 2Kg ;
                      <input
                        type="checkbox"
                        checked={
                          jrf_data.jrf_qty_of_raw_smpl_checkboxes &&
                          jrf_data.jrf_qty_of_raw_smpl_checkboxes.includes(
                            ">=1KG"
                          )
                        }
                      />{" "}
                      ≥ 1Kg ; Specify (if available) : {jrf_data?.jrf_qty_of_raw_smpl_input}
                    </li>
                    <li>
                      For Powdered Sample:{" "}
                      <input
                        type="checkbox"
                        checked={
                          jrf_data.jrf_qty_of_powedered_smpl_checkboxes &&
                          jrf_data.jrf_qty_of_powedered_smpl_checkboxes.includes(
                            "< 100"
                          )
                        }
                      />{" "}
                      ≤ 100 gm {">"} 100 gm & below{" "}
                      <input
                        type="checkbox"
                        checked={
                          jrf_data.jrf_qty_of_powedered_smpl_checkboxes &&
                          jrf_data.jrf_qty_of_powedered_smpl_checkboxes.includes(
                            "100-200"
                          )
                        }
                      />{" "}
                      ≤ 200gm{" "}
                      <input
                        type="checkbox"
                        checked={
                          jrf_data.jrf_qty_of_powedered_smpl_checkboxes &&
                          jrf_data.jrf_qty_of_powedered_smpl_checkboxes.includes(
                            ">200gm"
                          )
                        }
                      />{" "}
                      {">"} 200gm ; Specify (if available) : {jrf_data?.jrf_qty_of_powedered_smpl_input}
                    </li>
                  </ul>
                </>
              )}

              <li>
                <strong>Checklist:</strong>{" "}
                <input
                  type="checkbox"
                  checked={
                    jrf_data.jrf_checklist &&
                    jrf_data.jrf_checklist.includes("Customer Name")
                  }
                />{" "}
                Customer Name,{" "}
                <input
                  type="checkbox"
                  checked={
                    jrf_data.jrf_checklist &&
                    jrf_data.jrf_checklist.includes("Sample Source")
                  }
                />{" "}
                Sample Source,{" "}
                <input
                  type="checkbox"
                  checked={
                    jrf_data.jrf_checklist &&
                    jrf_data.jrf_checklist.includes("Seal Number")
                  }
                />{" "}
                Seal Number,{" "}
                <input
                  type="checkbox"
                  checked={
                    jrf_data.jrf_checklist &&
                    jrf_data.jrf_checklist.includes("Commodity")
                  }
                />{" "}
                Commodity,{" "}
                <input
                  type="checkbox"
                  checked={
                    jrf_data.jrf_checklist &&
                    jrf_data.jrf_checklist.includes("Test Method")
                  }
                />{" "}
                Test Method
              </li>
              <li>
                <strong>Appropriate Test Method Confirmed Through:</strong>{" "}
                {jrf_data.jrf_test_method_conf_through}
              </li>
              <li>
                <strong>Agreed with time frame required by client:</strong>{" "}
                <input
                  type="radio"
                  value="Yes"
                  checked={jrf_data.jrf_agrees_with_time}
                />{" "}
                Yes{" "}
                <input
                  type="radio"
                  value="No"
                  checked={!jrf_data.jrf_agrees_with_time}
                />{" "}
                No
              </li>
              <li>
                <strong>Finalize time frame:</strong> {jrf_data.jrf_finalize_timeframe} days
              </li>
              <li>
                <strong>Lab is capable to perform the test:</strong>{" "}
                <input
                  type="radio"
                  value="Yes"
                  checked={jrf_data.jrf_is_lab_capable}
                />{" "}
                Yes{" "}
                <input
                  type="radio"
                  value="No"
                  checked={!jrf_data.jrf_is_lab_capable}
                />{" "}
                No
              </li>
            </ul>
            <p className="customer-signature">
              <strong>Sample Reviewed & received by:</strong>{" "}
              <span>{jrf_data?.jrf_updated_user?.name}</span> <strong>Signature</strong>:{" "}
              <img src={jrf_data?.jrf_updated_user?.signature} />
            </p>
          </div>

          <p className="note">
            Note: All the information given by the customer is intended to be
            placed in the public domain with protection. Without any purpose to
            responding complaints, customer and laboratory are mutually agreed
            to consider proprietary information regarded as confidential. Tick{" "}
            <input type="checkbox" checked />. Whichever applicable.
          </p>
          {jrf_data?.jrf_lab_detail?.lab_is_compliant && (
            <table className="table">
              <tr>
                <td colspan="2">Doc. Name: Job Request Form</td>
                <td colspan="3">Doc. No.: {jrf_data.jrf_msfm_number}</td>
              </tr>
              <tr>
                <td>
                  Issue No.:{" "}
                  {jrf_data?.jrf_lab_detail?.lab_jrfmsfmno_issueno || "--"}
                </td>
                <td>
                  Issue Date:{" "}
                  {getFormatedDate(
                    jrf_data?.jrf_lab_detail?.lab_jrfmsfmno_issue_date,
                    1
                  )}
                </td>
                <td>
                  Amend No.:{" "}
                  {jrf_data?.jrf_lab_detail?.lab_jrfmsfmno_amendmentno || "--"}
                </td>
                <td>
                  Amend Date:{" "}
                  {getFormatedDate(
                    jrf_data?.jrf_lab_detail?.lab_jrfmsfmno_amendment_date,
                    1
                  )}
                </td>
              </tr>
            </table>
          )}
        </div>
      </div >
      <div className="autoWidthImportantLeft">
        <Button
          type="button"
          className="submitBtn btn btn-primary"
          // onClick={handleDownloadJRF}
          onClick={handlePDFConfirmAPI}
        >
          Download
        </Button>
      </div>
    </>
  );
};
export default JRFPdfDownLoad;
