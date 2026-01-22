import React, { useEffect, useState, useRef } from "react";
import { Card, CardTitle, Row, Button, Col } from "react-bootstrap";
import { postDataFromApi } from "../../services/commonServices";
import { pdfDetailsApi, testMemoPDFDownloadApi } from "../../services/api";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logos/logo.jpg";
import Loading from "../../components/common/Loading";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { decryptDataForURL } from "../../utills/useCryptoUtils";
import { getFormatedDate, rolesDetails } from "../../services/commonFunction";
import OverlayLoading from "../../components/common/OverlayLoading";
import {
  GetTenantDetails,
} from "../../services/commonServices";

export const selectUser = (state) => state.user;

const ModuleSFM = () => {
  const contentRef = useRef();
  let historyData;
  const session = useSelector((state) => state.session);
  const user = session.user;
  historyData = session.historyData;
  const [sfmData, setSfmData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPDFDownload, setIsPDFDownload] = useState(false);
  let navigate = useNavigate();
  useEffect(() => {
    let isMounted = true;
    const fetchData = () => {
      if (isMounted) {
        fetchsfmData();
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchsfmData = async () => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split("?")[1]);
    const sfm_id = decryptDataForURL(params.get("id"));
    let payload = {
      sfm_id: sfm_id,
      context: "sfm",
    };
    try {
      setIsLoading(true);
      let res = await postDataFromApi(pdfDetailsApi, payload);
      if (res?.data?.status === 200) {
        setSfmData(res.data.data);

        let allSamples = [];
        res.data.data.sample_sets?.map((set, setIndex) => {
          set.samples?.map((sample, sampleIndex) => {
            allSamples = [...allSamples, sample];
          });
        });
      } else {
        toast.error(res.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  };
  const givenDateFormat = (date) => {
    if (!date) {
      return "";
    }

    const dateParts = date.split("-");
    if (dateParts.length !== 3) {
      return "";
    }

    const [year, month, day] = dateParts;

    if (
      !year ||
      !month ||
      !day ||
      year.length !== 4 ||
      month.length !== 2 ||
      day.length !== 2
    ) {
      return "";
    }

    return `${day}/${month}/${year}`;
  };


  const handleDownload = async () => {
    const pdfFileName = "SFM_" + sfmData?.sfm_data?.allotment_number?.[0] + ".pdf";
    const content = contentRef.current;

    if (!content) {
      console.error("The content element is not available.");
      return;
    }

    // Helper function to ensure all images are fully loaded
    const preloadImagesWithCrossOrigin = async () => {
      const images = Array.from(document.querySelectorAll("img"));
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

    try {
      await preloadImagesWithCrossOrigin();

      // PDF configuration
      const pdfWidth = 595.28; // A4 width in points
      const pdfHeight = 841.89; // A4 height in points
      const margin = 10; // Margin around the content
      const pdf = new jsPDF("portrait", "pt", "a4"); // Initialize jsPDF instance

      const childDivs = Array.from(content.children); // Get all child elements
      let currentPageHeight = margin; // Track height for content placement

      // Process each child div and add it to the PDF
      for (const div of childDivs) {
        // Render the div as a canvas
        const canvas = await html2canvas(div, {
          scale: 2, // High-quality rendering
          useCORS: true, // Handle cross-origin images
          allowTaint: false, // Avoid tainted canvas issues
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.7); // Convert canvas to image
        const imgWidth = pdfWidth - margin * 2; // Image width in PDF
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

        // Check if content fits on the current page
        if (currentPageHeight + imgHeight > pdfHeight - margin) {
          pdf.addPage(); // Add a new page if needed
          currentPageHeight = margin; // Reset height for the new page
        }

        // Add the image to the PDF
        pdf.addImage(imgData, "JPEG", margin, currentPageHeight, imgWidth, imgHeight);
        currentPageHeight += imgHeight + 10; // Update height for next content
      }

      // Save the generated PDF
      pdf.save(pdfFileName);
    } catch (error) {
      console.error("Error generating PDF", error);
    }
  };
  const handlePDFConfirmAPI = async () => {
    try {
      setIsPDFDownload(true);
      let endPoint = testMemoPDFDownloadApi;
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.split("?")[1]);
      const sfm_id = decryptDataForURL(params.get("id"));
      let payload = {
        sfm_id: sfm_id,
        context: "sfm",
      };
      let res = await postDataFromApi(endPoint, payload, "", 1);
      if (res?.status === 200) {
        const blob = new Blob([res.data], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "SFM_" + sfmData?.sfm_data?.allotment_number?.[0] + ".pdf";
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
  const maxResultColAllowed = 4;
  const renderTableBody = (set, sampleChunk, paramChunkIndex) => {
    let sortSamples = set.samples?.[0].sample_params;
    sortSamples = set.samples?.[0].sample_params.sort(
      (a, b) => a.sp_param_sequence - b.sp_param_sequence
    );
    return (
      <tbody>
        {sortSamples
          .flatMap((param, paramIndex) =>
            param.basis_detail?.map((basis, basisIndex) => ({
              param,
              paramIndex,
              basis,
              basisIndex,
            }))
          )
          .slice(
            vertical_Limit * paramChunkIndex,
            vertical_Limit * paramChunkIndex + vertical_Limit
          ) // You can adjust this to control how many chunks you want per iteration.
          .map(({ param, paramIndex, basis, basisIndex }) => (
            <tr key={`paramIndex-${paramIndex}-basisIndex-${basisIndex}`}>
              <td>{param.param_detail.param_name}</td>
              <td>
                {param.std_detail.std_name + (basis.spbr_basiscode !== "NA" && " (" + basis.spbr_basiscode + ")" || "")}
              </td>
              {renderSampleColumns(sampleChunk, paramIndex, basisIndex, basis)}
            </tr>
          ))}
      </tbody>
    );
  };

  // Combined function to render columns for each sample in the sample chunk, including the test method value and parameter unit
  const renderSampleColumns = (sampleChunk, paramIndex, basisIndex, basis) => {
    const normalizedSampleChunk = [
      ...sampleChunk,
      ...Array(Math.max(0, maxResultColAllowed - sampleChunk.length)).fill({ sample_params: [""] }),
    ];
    return normalizedSampleChunk.map((thirdSample, thirdSampleIndex) => {
      // return sampleChunk.map((thirdSample, thirdSampleIndex) => {
      // const tmValue = thirdSample.sample_params[paramIndex]?.basis_detail?.[basisIndex]?.spbr_sfm_input_type_value;
      // const paramUnit = thirdSample.sample_params[paramIndex]?.param_detail.param_unit;
      thirdSample.sample_params = thirdSample.sample_params.sort(
        (a, b) => a.sp_param_sequence - b.sp_param_sequence
      );
      const matchingBasisDetail = thirdSample.sample_params[paramIndex]?.basis_detail?.find(
        (detail) => detail.spbr_basiscode === basis.spbr_basiscode
      );

      let tmValue = matchingBasisDetail?.spbr_sfm_input_type_value || "--";
      const paramUnit = matchingBasisDetail?.spbr_sfm_input_type_value ? thirdSample.sample_params[paramIndex]?.sp_param_unit : " ";

      if (["TPBPL", "TCRC"].includes(GetTenantDetails(1, 1,sfmData?.jrf_is_petro))) {
        tmValue = matchingBasisDetail?.spbr_sfm_input_type_value || matchingBasisDetail?.spbr_tmvalue || "--";
      }
      else {
        tmValue = matchingBasisDetail?.spbr_tmvalue || "--";
      }

      return (
        <td className="result_col" key={`thirdSampleIndex-${basisIndex}-${thirdSampleIndex}`}>
          {tmValue}{" "}
          {(paramUnit !== "null" && paramUnit !== "-") ? paramUnit : ""}
        </td>
      );
    });
  };

  const vertical_Limit = 10;
  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };
  return (
    <Row>
      <Col>
        <Card>
          <CardTitle tag="h5" className="history_title">
            <div>
              LMS <i className="bi bi-chevron-right card-title-icon"></i>{" "}
              <button
                className="breadcrumb_button"
                type="button"
                onClick={() => navigate(historyData.redirect)}
              >
                {historyData?.Breadcrumb}{" "}
              </button>
              <i className="bi bi-chevron-right card-title-icon"></i> SFM PDF
            </div>
          </CardTitle>

          <div>
            {/* {isLoading ? (
              <Loading />
            ) : ( */}
            <div ref={contentRef} className="TestMemoPDFContainer">
              {isPDFDownload && <OverlayLoading fullScreen={true} />}
              {sfmData.sample_sets?.map((set, setIndex) =>
                Array.from({
                  length: Math.ceil(set.samples.length / maxResultColAllowed),
                }).map((_, chunkIndex) => {
                  const sampleChunk = set.samples.slice(
                    chunkIndex * maxResultColAllowed,
                    chunkIndex * maxResultColAllowed + maxResultColAllowed
                  );
                  // Assuming `chunkArray` is a function that chunks the array based on `vertical_Limit`
                  // Flatten parameters and bases into a single array
                  const flattenParamsWithBasis = (sample_params) => {
                    const flattenedArray = [];

                    sample_params.forEach((param) => {
                      // If the parameter has multiple bases
                      if (
                        param.basis_detail &&
                        param.basis_detail.length > 0
                      ) {
                        param.basis_detail.forEach((basis) => {
                          flattenedArray.push({ param, basis });
                        });
                      } else {
                        // If no basis, just push the parameter itself
                        flattenedArray.push({ param, basis: null });
                      }
                    });

                    return flattenedArray;
                  };

                  // Flatten the parameters and basis
                  const flattenedParams = flattenParamsWithBasis(
                    set.samples?.[0].sample_params || []
                  );

                  // Now chunk the flattened array
                  const parameterChunks = chunkArray(
                    flattenedParams,
                    vertical_Limit
                  );
                  return (
                    <>
                      {parameterChunks.map((paramChunk, paramChunkIndex) => (
                        <div
                          className="container"
                          key={"setIndex" + chunkIndex}
                          id="generateSFMPDF"
                        >
                          {/* <img src={Logo} className="logo" alt="Logo" /> */}

                          {/* <div className="docNo">
                              {user?.logged_in_user_info?.lab_or_branch
                                ?.lab_is_compliant && (
                                  <h2>
                                    DocNo. : {sfmData?.sfm_data?.sfm_msfm_no}
                                  </h2>
                                )}
                            </div> */}
                          {/* <div className="header">
                              <h2>SAMPLE FORWARDING AND RESULT FORWARDING MEMO</h2>
                            </div> */}
                          <table className="table">
                            <tr>
                              <td rowspan="2" width="10%">
                                {
                                  sfmData?.lab_detail?.company?.cmp_code === "L" ?
                                    <img src={"https://tcrc-prod-bucket.s3.ap-south-1.amazonaws.com/masterdata/image_2025_03_04T11_34_37_504Z.png"} style={{ height: "130px", width: "auto" }} /> : sfmData?.lab_detail?.company?.cmp_code === "P" ? <img src={"https://tcrc-nonprod-bucket.s3.ap-south-1.amazonaws.com/18north_userdata/Petro_Lab_Logo_1_1.png"} style={{ height: "90px", width: "200px" }} /> : <img src={sfmData?.lab_detail?.company?.cmp_logo} style={{ height: "90px", width: "200px" }} />
                                }
                              </td>
                              <td className="header">
                                <h1>
                                  {
                                    sfmData?.lab_detail?.company?.cmp_name || "TCRC QUALITY CONTROLS LLP"}
                                  {", "}
                                  {sfmData?.lab_detail?.lab_name}
                                </h1>
                                {sfmData?.lab_detail?.company?.cmp_code === "C" && (
                                  <p>
                                    Formerly Known As Therapeutics Chemical Research Corporation
                                  </p>
                                ) || ""}
                              </td>
                            </tr>
                            <tr>
                              <td className="header">
                                <h2>SAMPLE FORWARDING AND RESULT FORWARDING MEMO</h2>
                              </td>
                            </tr>
                          </table>

                          <table className="dates_table">
                            <tr>
                              <td>
                                Date of Sample Received:{" "}

                              </td>
                              <td className="header">
                                {givenDateFormat(
                                  sfmData?.sample_sets?.[0].samples?.[0]
                                    .sample_date
                                )}
                              </td>
                              <td>
                                Analysis Starts On:{" "}

                              </td>
                              <td className="header">
                                {givenDateFormat(
                                  sfmData?.sfm_data?.sfm_dateanalysisstarted
                                )}
                              </td>

                            </tr>
                            <tr>
                              <td className="header">
                                Expected Date of Analysis
                              </td>
                              <td className="header">
                                {/* {sfmData?.sfm_data?.sfm_expecteddateanalysis
                                    ? givenDateFormat(sfmData.sfm_data.sfm_expecteddateanalysis)
                                    : "--"} */}
                                {
                                  givenDateFormat(sfmData?.sfm_data?.allotment_details?.[0]?.sa_expdateofresult)
                                }
                              </td>


                              <td className="header">
                                Date of Analysis Completion:{" "}

                              </td>
                              <td className="header">
                                {givenDateFormat(
                                  sfmData?.sfm_data?.sfm_dateanalysiscompleted
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="header">
                                Commodity:{" "}



                              </td>
                              <td className="header">
                                {sfmData?.sfm_data?.sub_commodity?.sub_commodity_name}
                              </td>

                              <td className="header">

                              </td>
                              <td className="header">

                              </td>
                            </tr>


                          </table>




                          {/* <div className="header_main" style={{ marginTop: "8px" }}>
                              <div className="header_main_left">
                                <div>
                                  Date of Sample Received:{" "}
                                  {givenDateFormat(
                                    sfmData?.sample_sets?.[0].samples?.[0]
                                      .sample_date
                                  )}
                                </div>
                             
                                <div>
                                  Commodity:{" "}
                                  {sfmData?.sfm_data?.sub_commodity?.sub_commodity_name}

                                </div>
                              </div>
                              <div className="header_main_left">
                                <div>
                                  Date of Analysis started:{" "}
                                  {givenDateFormat(
                                    sfmData?.sfm_data?.sfm_dateanalysisstarted
                                  )}
                                </div>
                                <div>
                                  Date of Analysis Completed:{" "}
                                  {givenDateFormat(
                                    sfmData?.sfm_data?.sfm_dateanalysiscompleted
                                  )}
                                </div>
                              </div>
                            </div> */}

                          <table
                            // className="pdfTable"
                            key={"chunk-" + chunkIndex}
                          >
                            <thead>
                              <tr>
                                <th></th>
                                <th></th>
                                <th
                                  colSpan={
                                    sampleChunk.length > maxResultColAllowed
                                      ? sampleChunk.length
                                      : maxResultColAllowed
                                  }
                                  className="table_header"
                                >
                                  RESULTS
                                </th>
                              </tr>
                              <tr>
                                <th
                                  rowSpan="2"
                                  className="table_header table_param"
                                >
                                  PARAMETERS
                                </th>
                                <th className="table_header table_param">
                                  Laboratory Code  →
                                </th>

                                {
                                  [...sampleChunk, ...Array(Math.max(0, maxResultColAllowed - sampleChunk.length)).fill({ sample_code: "" })].map(
                                    (sample, sampleIndex) => (
                                      <th
                                        className="result_col"
                                        rowSpan="2"
                                        key={`sampleIndex-${sampleIndex}`}
                                      >
                                        {sample?.sample_params?.[0]?.sp_lab_smplcode || "--"}
                                      </th>
                                    )
                                  )
                                }

                              </tr>
                              <tr>
                                <th className="table_header">Test Methods ↓</th>
                              </tr>
                            </thead>
                            {renderTableBody(
                              set,
                              sampleChunk,
                              paramChunkIndex
                            )}
                          </table>

                          <div className="footer">
                            <div className="remarks_signature">
                              <div className="remarks">
                                <strong>Remarks, If Any:</strong>
                                <br />
                                {
                                  sfmData?.sfm_data?.lab?.lab_is_skip_process ? (
                                    <>
                                      <img
                                        src={
                                          sfmData?.sfm_data?.sfm_updated_by?.signature
                                        }
                                        className="sign_img"
                                        alt="Signature"
                                      />
                                      <br />
                                      Signature: {rolesDetails.map((role, UserIndex) => (
                                        sfmData?.sfm_data?.sfm_updated_by?.role === role?.role ? role.label : null
                                      ))}
                                    </>
                                  ) : (
                                    <>
                                      <img
                                        src={
                                          sfmData?.sfm_data?.allotment_details?.[0]?.chemist_sign
                                        }
                                        className="sign_img"
                                        alt="Signature"
                                      />
                                      <br />
                                      Signature: {rolesDetails.map((role, UserIndex) => (
                                        sfmData?.sfm_data?.allotment_details?.[0]?.chemist_role === role?.role ? role.label : null
                                      ))}
                                    </>
                                  )
                                }

                              </div>
                              <div className="signature">
                                <div>
                                  <img
                                    src={
                                      sfmData?.sfm_data?.technical_manager
                                        ?.signature
                                    }
                                    className="sign_img"
                                    alt="Signature"
                                  />
                                  <br />
                                  {/* <em> */}
                                  Signature: {rolesDetails.map((role, UserIndex) => (
                                    sfmData?.sfm_data?.technical_manager?.role === role?.role
                                      ? role.label
                                      : null
                                  ))}
                                  {/* </em> */}
                                </div>
                              </div>
                            </div>

                            <table className="dates_table">
                              <tr>
                                <td colspan="2">Doc. Name : Sample Forwarding and Result Forwarding Memo</td>
                                <td colspan="3">Doc. No.:
                                  {user?.logged_in_user_info?.lab_or_branch
                                    ?.lab_is_compliant && (`${sfmData?.sfm_data?.sfm_msfm_no}`)}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  Issue No.:{" "}
                                  {sfmData?.lab_detail?.lab_tm_msfm_no_issueno || "--"}
                                </td>
                                <td>
                                  Issue Date:{" "}
                                  {getFormatedDate(
                                    sfmData?.lab_detail?.lab_tm_msfm_no_issue_date,
                                    1
                                  )}
                                </td>
                                <td>
                                  Amend No.:{" "}
                                  {sfmData?.lab_detail?.lab_tm_msfm_amendmentno || "--"}
                                </td>
                                <td>
                                  Amend Date:{" "}
                                  {getFormatedDate(
                                    sfmData?.lab_detail?.lab_tm_msfm_amendment_date,
                                    1
                                  )}
                                </td>
                              </tr>
                            </table>
                          </div>

                        </div>
                      ))}
                    </>
                  );
                })
              )}
            </div>
            {/* )} */}
            <div className="testMemo_sfm_pdf">
              <Button
                type="button"
                className="submitBtn btn btn-primary"
                // onClick={handleDownload}
                onClick={handlePDFConfirmAPI}
              >
                Download
              </Button>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default ModuleSFM;
