import React, { useEffect, useRef, useState } from "react";
import { Button } from "reactstrap";
import { postDataFromApi } from "../../services/commonServices";
import { JRFGetApi } from "../../services/api";
import { useParams } from "react-router-dom";
import faviconIcon from "../../assets/images/logos/favicanLogo.jpg";
import { getFormatedDate } from "../../services/commonFunction";
import html2pdf from 'html2pdf.js';
const JRFPdfDownLoad = () => {
  const contentRef = useRef();
  const { JRFId } = useParams();
  const [jrf_data, setJRFData] = useState("");

  
  const handleDownloadJRF = async () => {
    const pdfFileName = jrf_data.jrf_no + ".pdf";
    const input = contentRef.current;
    if (!input) {
      console.error("The PDF content element is not available.");
      return;
    }
  
    const customWidth = 700;
    const customHeight = 1350;
    const opt = {
      margin: [0, 0],
      filename: pdfFileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: {
        unit: 'pt',
        format: [customWidth, customHeight], // Set custom page size
        orientation: 'portrait'
      },
      pagebreak: {
        mode: ['avoid-all'], // Ensure it avoids breaking in undesired locations
        // before: '.page-break', // Use class names to manually define page breaks
        after: '.page-break' // Optionally add page breaks after specific elements
      }
    };
  
    try {
      await html2pdf().from(input).set(opt).save();
    } catch (error) {
      console.error("Error generating PDF", error);
    } finally {
      // Optionally reset state or perform additional actions after PDF generation
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
        setJRFData(res.data.jrf);
      }
    } catch (error) { }
  };
  useEffect(() => {
    getJRFDetails();
  }, []);
  return (
    <>
      <style>
        {`
            #generatePDF{
              body {
                font-family: 'Inter', sans-serif;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 980px;
                margin: 0 auto;
                padding: 20px;
                overflow: unset;
            }
            h1, h2, h3 {
                text-align: center;
                margin: 0;
            }
            p {
                margin: 10px;
            }
            .table {
                width: 100%;
                border-collapse: collapse;
            }
            .table th, .table td {
                border: 1px solid #000;
                padding: 8px;
                text-align: center;
            }
            .terms-conditions {
                margin-top: 20px;
                text-align: justify;
            }
            .checkbox {
                margin-right: 5px;
            }
            ul {
              margin: 0px;
            }
            li {
              padding: 3px;
            }
            h3 {
              background-color: rgb(211, 208, 208);
              font-weight: bold;
              font-size: medium;
              padding: 4px;
              margin-block-start: 1em;
              margin-block-end: 1em;
              margin-inline-start: 0px;
              margin-inline-end: 0px;
            }
            .lab-use {
              padding-top: 10px;
            }
            .customer-signature {
              text-align: right;
              width: 100%;
              margin-top: 20px;
            }
            .note {
                font-size: 12px;
                text-align: justify;
            }
              td.header h1 {
                font-size: 25px;
                font-weight: bold;
                background: none;
            }
                td.header p {
                    font-size: 14px;
                    margin-bottom: 2px;
                    margin-top: 5px;
                    padding-top: 2px;
                    padding-bottom: 2px;
                    margin-left: 0px;
                    margin-right: 0px;
                    background: none;
                }
            }
                td.header h2 {
                font-size: 22px;
                font-weight: bold;
                padding-top: 2px;
                padding-bottom: 2px;
                background: none;
            }
                p.customer-signature span {
    border-bottom: 1px solid;
    padding: 0px 20px;
}
    p.customer-signature img {
    border-bottom: 1px solid;
    height: 50px;
    width: 100px;
}
    div.customer-signature img {
    width: 150px;
    margin-right: 70px;
}
    #generatePDF input{
          width:auto
    }
          .pdf-content {
  padding-top: 0; /* Remove or reduce top padding */
}
        .page-break {
          page-break-before: always; /* Forces a page break before the element */
        }
          .pdfContent {
              margin-top: 30px; /* Adjust based on header height */
              margin-bottom: 30px; /* Adjust based on footer height */
            }
        }
          `}
      </style>
      <div className="pdf-container">
        <div ref={contentRef} id="generatePDF" style={{ display: "block", width: "100%", margin: "0 auto" }}>
          <div id="pdfContent">
            <div className="container">
              <table className="table">
                <tr>
                  <td rowspan="2" width="10%">
                    <img src={faviconIcon} />
                  </td>
                  <td className="header">
                    <h1>
                      TCRC QUALITY CONTROLS LLP.,{" "}
                      {jrf_data?.jrf_lab_detail?.lab_name}
                    </h1>
                    <p>
                      Formerly Known As Therapeutics Chemical Research Corporation
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="header">
                    <h2>JOB REQUEST FORMAT</h2>
                  </td>
                </tr>
              </table>
              <div className="job-details">
                <p>Date: {getFormatedDate(jrf_data?.jrf_date, 1)}</p>
                <p>JRF number: {jrf_data?.jrf_no}</p>
                <p>Reference number: {jrf_data?.jrf_referenceno}</p>
                <p>
                  Name of organization: {jrf_data?.jrf_company_detail?.cmp_name}
                </p>
                <p>
                  Address of the organization:{" "}
                  {jrf_data?.jrf_company_detail?.cmp_address}
                </p>
                <p>Contact Person: {jrf_data.jrf_contact_person}</p>
                <p>Phone number: {jrf_data.jrf_contact_person_number}</p>
              </div>

              <h3>Sample & Job Specification</h3>

              <div className="sample-specification">
                <p>
                  Name of the commodity: {jrf_data?.jrf_commodity_detail?.cmd_name}
                </p>
                <p>
                  <b>Quantity of the test sample</b>
                </p>
                <ul>
                  <li>{jrf_data.jrf_quanity_sample}</li>
                </ul>
                <p>
                  <b>Description of sample</b>
                </p>
                <ul>
                  <li>{jrf_data.jrf_desc_of_sample}</li>
                  <li>Other Requirement (if any): {jrf_data.jrf_other_info}</li>
                  <li>
                    Test report Required on : {jrf_data.jrf_test_repo_req_on} After
                    received of sample
                  </li>
                </ul>
              </div>

              <h3>Job Description</h3>


              <div className="terms-conditions">
                <p>
                  <input type="checkbox" checked /> Terms & Conditions: The samples
                  will be retained for a duration of 30 days from the date of
                  testing. However, for export vessels, the retention period will be
                  extended to 90 days, where applicable. Any grievances or
                  complaints must be duly lodged within a timeframe of 15 days from
                  the date of issuance of the test report. Both parties will adhere
                  to and uphold a set of compliance code and principles in the
                  provision of services. We do not provide statements of conformity,
                  opinions, or interpretations concerning the findings rendered in
                  reports.
                </p>
                <p>
                  <b>
                    We hereby accept the terms and conditions as mentioned above.
                  </b>
                </p>
              </div>

              <div className="customer-signature">
                <img src={jrf_data?.jrf_created_user?.signature} />
                <p>Customer Representative Signature</p>
                <p>Date: {getFormatedDate(new Date(), 1)}</p>
              </div>

              <h3>For Laboratory Use Only</h3>

              <div className="lab-use">
                <ul>
                  <li>
                    Sample Condition:{" "}
                    {jrf_data?.jrf_sample_condition
                      ? jrf_data?.jrf_sample_condition.join(",")
                      : ""}
                  </li>
                  <li>
                    Packaging Condition:{" "}
                    {jrf_data?.jrf_pkging_condition
                      ? jrf_data?.jrf_pkging_condition.join(",")
                      : ""}
                  </li>
                  <li>Quantity of Received sample:</li>
                  <ul>
                    <li>
                      For Raw Sample{" "}
                      <input
                        type="checkbox"
                        checked={
                          jrf_data.jrf_qty_of_raw_smpl_checkboxes &&
                          jrf_data.jrf_qty_of_raw_smpl_checkboxes.includes(">=2KG")
                        }
                      />{" "}
                      : ≥ 2Kg ;
                      <input
                        type="checkbox"
                        checked={
                          jrf_data.jrf_qty_of_raw_smpl_checkboxes &&
                          jrf_data.jrf_qty_of_raw_smpl_checkboxes.includes(">=1KG")
                        }
                      />{" "}
                      ≥ 1Kg ; Specify (if available)
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
                      {">"} 200gm ; Specify (if available)
                    </li>
                  </ul>
                  <li>
                    Checklist:{" "}
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
                    Appropriate Test Method Confirmed Through:{" "}
                    {jrf_data.jrf_test_method_conf_through}
                  </li>
                  <li>
                    Agreed with time frame required by client:{" "}
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
                    Finalize time frame: {jrf_data.jrf_finalize_timeframe} days
                  </li>
                  <li>
                    Lab is capable to perform the test:{" "}
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
                  Sample Reviewed & received by: <span>{jrf_data?.jrf_updated_user?.name}</span> {" "}
                  Signature: <img src={jrf_data?.jrf_updated_user?.signature} crossOrigin="anonymous" />
                </p>
              </div>

              <p className="note">
                Note: All the information given by the customer is intended to be
                placed in the public domain with protection. Without any purpose to
                responding complaints, customer and laboratory are mutually agreed
                to consider proprietary information regarded as confidential. Tick{" "}
                <input type="checkbox" checked />. Whichever applicable.
              </p>

              <table className="table">
                <tr>
                  <td colspan="2">Document Name: Job Request Form</td>
                  <td colspan="3">Document Number: {jrf_data.jrf_msfm_number}</td>
                </tr>
                <tr>
                  <td>Issue Number: 04</td>
                  <td>Issue Date: 05.02.2024</td>
                  <td>Amend Number: 00</td>
                  <td>Amend Date: -</td>
                </tr>
              </table>
            </div>
            <div className="page-break"></div>
          </div>
        </div>

      </div>
      <div className="autoWidthImportantLeft">
        <Button
          type="button"
          className="submitBtn btn btn-primary"
          onClick={handleDownloadJRF}
        >
          Download
        </Button>
      </div>
    </>
  );
};
export default JRFPdfDownLoad;
