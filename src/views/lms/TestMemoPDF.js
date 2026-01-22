import React, { useEffect, useState, useRef } from "react";
import { Card, CardTitle, Row, Button, Col } from "react-bootstrap";
import { postDataFromApi, GetTenantDetails } from "../../services/commonServices";
import { pdfDetailsApi, testMemoPDFDownloadApi } from "../../services/api";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import Logo from "../../assets/images/logos/tcrcLogo2.png";
import TMSign from "../../assets/images/icons/TMSign.png";
import LRSign from "../../assets/images/icons/LRSign.png";
import Loading from "../../components/common/Loading";
import OverlayLoading from "../../components/common/OverlayLoading";
import { getFormatedDate, rolesDetails } from "../../services/commonFunction";


import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { decryptDataForURL } from "../../utills/useCryptoUtils";


const ModuleTestmemo = () => {
  const contentRef = useRef();
  let historyData;
  const session = useSelector((state) => state.session);
  const user = session.user;
  historyData = session.historyData;
  const [testMemoData, setTestMemoData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isPDFDownload, setIsPDFDownload] = useState(false);

  let navigate = useNavigate();
  useEffect(() => {
    let isMounted = true;
    const fetchData = () => {
      if (isMounted) {
        fetchTestMemoData();
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchTestMemoData = async () => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split("?")[1]);
    const tm_id = decryptDataForURL(params.get("id"));
    let payload = {
      test_memo_id: tm_id,
      context: "testmemo",
    };
    try {
      setIsLoading(true);
      let res = await postDataFromApi(pdfDetailsApi, payload);
      if (res?.data?.status === 200) {
        setIsLoading(false);
        setTestMemoData(res.data.data);

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
    const pdfFileName = "TM_" + testMemoData?.test_memo_data?.tm_number + ".pdf";
    const content = contentRef.current;

    if (!content) {
      console.error("Error: Content element not found.");
      return;
    }

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

      const pdfWidth = 595.28; // A4 width in points
      const pdfHeight = 841.89; // A4 height in points
      const margin = 10; // Margin around content
      const pdf = new jsPDF("portrait", "pt", "a4");

      const childDivs = Array.from(content.children);
      let currentPageHeight = margin;

      if (childDivs.length === 0) {
        console.error("Error: No child elements found in content.");
        return;
      }

      for (const [index, div] of childDivs.entries()) {
        const canvas = await html2canvas(div, {
          scale: 2,
          useCORS: true,
          allowTaint: false,
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.7);
        const imgWidth = pdfWidth - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (currentPageHeight + imgHeight > pdfHeight - margin) {
          pdf.addPage();
          currentPageHeight = margin;
        }

        pdf.addImage(imgData, "JPEG", margin, currentPageHeight, imgWidth, imgHeight);
        currentPageHeight += imgHeight + 10;
      }

      if (pdf.internal.pages.length > 1 && pdf.internal.pages[1].length === 0) {
        pdf.deletePage(1);
      }
      pdf.save(pdfFileName);
    } catch (error) {
    }
  };

  const handlePDFConfirmAPI = async () => {
    try {
      setIsPDFDownload(true);
      let endPoint = testMemoPDFDownloadApi;
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.split("?")[1]);
      const tm_id = decryptDataForURL(params.get("id"));
      let payload = {
        test_memo_id: tm_id,
        context: "testmemo",
      };
      let res = await postDataFromApi(endPoint, payload, "", 1);
      if (res?.status === 200) {
        const blob = new Blob([res.data], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "TM_" + testMemoData?.test_memo_data?.tm_number + ".pdf";
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
              <td>{param.param_detail.param_name + (basis.spbr_basiscode !== "NA" && " (" + basis.spbr_basiscode + ")" || "")}</td>
              <td>
                {param.std_detail.std_name}
              </td>
              {renderSampleColumns(sampleChunk, paramIndex, basisIndex, basis)}
            </tr>
          ))}
      </tbody>
    );
  };

  // Combined function to render columns for each sample in the sample chunk, including the test method value and parameter unit
  const renderSampleColumns = (sampleChunk, paramIndex, basisIndex, basis) => {
    // Ensure sampleChunk has at least 4 items by adding empty rows if necessary
    const normalizedSampleChunk = [
      ...sampleChunk,
      ...Array(Math.max(0, maxResultColAllowed - sampleChunk.length)).fill({ sample_params: [""] }),
    ];

    return normalizedSampleChunk.map((thirdSample, thirdSampleIndex) => {
      thirdSample.sample_params = thirdSample.sample_params.sort(
        (a, b) => a.sp_param_sequence - b.sp_param_sequence
      );

      const matchingBasisDetail = thirdSample.sample_params[
        paramIndex
      ]?.basis_detail?.find(
        (detail) => detail.spbr_basiscode === basis.spbr_basiscode
      );

      let tmValue = matchingBasisDetail?.spbr_tmvalue || "--";
      const paramUnit = matchingBasisDetail?.spbr_tmvalue
        // ? thirdSample.sample_params[paramIndex]?.param_detail.param_unit
        ? thirdSample.sample_params[paramIndex]?.sp_param_unit
        : " ";


      if (["TPBPL", "TCRC"].includes(GetTenantDetails(1, 1,testMemoData?.jrf_is_petro))) {
        tmValue = matchingBasisDetail?.spbr_sfm_input_type_value || matchingBasisDetail?.spbr_tmvalue || "--";
      }
      else {
        tmValue = matchingBasisDetail?.spbr_tmvalue || "--";
      }

      return (
        <td
          className="result_col"
          key={`thirdSampleIndex-${basisIndex}-${thirdSampleIndex}`}
        >
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

  const flattenParamsWithBasis = (sample_params) => {
    const flattenedArray = [];

    sample_params.forEach((param) => {
      // If the parameter has multiple bases
      if (param.basis_detail && param.basis_detail.length > 0) {
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

  const getSampleConditionData = () => {
    const sampleCondition = [];
    testMemoData?.sample_sets?.map((singleSample) => {
      singleSample.samples.map((sample) => {
        if (!sampleCondition.includes(sample.smpl_detail_smpl_condtion)) {
          sampleCondition.push(sample.smpl_detail_smpl_condtion)
        }
      })
    })
    return sampleCondition.join(',')
  }
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
              <i className="bi bi-chevron-right card-title-icon"></i> Test Memo
              PDF
            </div>
          </CardTitle>

          <div>
            {/* {isLoading ? (
              <Loading />
            ) : ( */}
            <div ref={contentRef} className="TestMemoPDFContainer">
              {isPDFDownload && <OverlayLoading fullScreen={true} />}
              {testMemoData?.sample_sets?.map((set, setIndex) =>
                Array.from({
                  length: Math.ceil(set.samples.length / maxResultColAllowed),
                }).map((_, chunkIndex) => {
                  const sampleChunk = set.samples.slice(
                    chunkIndex * maxResultColAllowed,
                    chunkIndex * maxResultColAllowed + maxResultColAllowed
                  );
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
                          <table className="table">
                            <tr>
                              <td rowspan="2" width="10%">
                                {
                                  testMemoData?.lab_detail?.company?.cmp_code === "L" ? <img src={"https://tcrc-prod-bucket.s3.ap-south-1.amazonaws.com/masterdata/image_2025_03_04T11_34_37_504Z.png"} style={{ height: "130px", width: "auto" }} /> : testMemoData?.lab_detail?.company?.cmp_code === "P" ? <img src={"https://tcrc-nonprod-bucket.s3.ap-south-1.amazonaws.com/18north_userdata/Petro_Lab_Logo_1_1.png"} style={{ height: "90px", width: "200px" }} /> : <img src={testMemoData?.lab_detail?.company?.cmp_logo} style={{ height: "90px", width: "200px" }} />
                                }
                              </td>
                              <td className="header">
                                {/* <h1>
                                    {
                                      "TCRC QUALITY CONTROLS LLP"}{" "}
                                    {"., "}
                                    { }
                                  </h1> */}
                                <h1>
                                  {
                                    testMemoData?.lab_detail?.company?.cmp_name || "TCRC QUALITY CONTROLS LLP"}
                                  {", "}
                                  {testMemoData?.lab_detail?.lab_name}
                                </h1>
                                {testMemoData?.lab_detail?.company?.cmp_code === "C" && (
                                  <p>
                                    Formerly Known As Therapeutics Chemical Research Corporation
                                  </p>
                                ) || ""}
                              </td>
                            </tr>
                            <tr>
                              <td className="header">
                                <h2>TEST MEMO AND ANALYSIS DETAILS</h2>
                              </td>
                            </tr>
                          </table>

                          <table className="dates_table">
                            <tr>
                              <td className="header_highlight">
                                Commodity:{" "}

                              </td>
                              <td >
                                {
                                  testMemoData?.test_memo_data?.sub_commodity
                                    ?.sub_commodity_name
                                }
                              </td>
                              <td className="header_highlight">
                                Date of Receipt of Sample:{" "}


                              </td>
                              <td >
                                {givenDateFormat(
                                  testMemoData?.test_memo_data
                                    ?.inward_detail?.smpl_dos
                                )}
                              </td>

                            </tr>
                            <tr>
                              <td className="header_highlight">
                                Condition of Sample:{" "}

                              </td>
                              <td >
                                {/* {
                                    testMemoData?.test_memo_data?.jrf_detail
                                      ?.jrf_sample_condition?.join(',')
                                  } */}
                                {
                                  getSampleConditionData()
                                }
                              </td>


                              <td className="header_highlight">
                                Date of Starting Analysis:{" "}
                              </td>
                              <td >
                                {givenDateFormat(
                                  testMemoData?.test_memo_data
                                    ?.tm_datestartinganalysis
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="header_highlight">
                                Date of Completion:{" "}

                              </td>
                              <td >
                                {givenDateFormat(
                                  testMemoData?.test_memo_data
                                    ?.tm_datecompletion
                                )}
                              </td>


                              <td className="header_highlight">
                              </td>
                              <td >

                              </td>
                            </tr>


                          </table>

                          <table
                            className="pdfTable"
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
                                  Sample Code →
                                </th>
                                {
                                  [...sampleChunk, ...Array(Math.max(0, maxResultColAllowed - sampleChunk.length)).fill({ sample_code: "" })].map(
                                    (sample, sampleIndex) => (
                                      <th
                                        className="result_col additional_col"
                                        rowSpan="2"
                                        key={`sampleIndex-${sampleIndex}`}
                                      >
                                        {sample?.sample_code || "--"}
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
                                <img
                                  src={
                                    testMemoData?.test_memo_data?.tm_created_by
                                      .signature
                                    // LRSign
                                  }
                                  className="sign_img"
                                  alt="Signature"
                                />
                                <br />
                                <em>Sign: {rolesDetails.map((role, UserIndex) => (
                                  <span key={"role-" + UserIndex}>
                                    {testMemoData?.test_memo_data?.tm_created_by?.role === role?.role
                                      ? role.label
                                      : null}
                                  </span>
                                ))}</em>
                              </div>
                              <div className="signature">
                                <div>
                                  <img
                                    src={
                                      testMemoData?.test_memo_data
                                        ?.technical_manager?.signature
                                      // TMSign
                                    }
                                    className="sign_img"
                                    alt="Signature"
                                  />
                                  <br />
                                  <em>
                                    Sign: {rolesDetails.map((role, UserIndex) => (
                                      <span key={"role-" + UserIndex}>
                                        {testMemoData?.test_memo_data?.technical_manager?.role === role?.role
                                          ? role.label
                                          : null}
                                      </span>
                                    ))}
                                  </em>
                                </div>
                              </div>
                            </div>

                            <table className="dates_table">
                              <tr>
                                <td colspan="2">Doc. Name: TEST MEMO AND ANALYSIS DETAILS </td>
                                <td colspan="3">Doc. No.:
                                  {user?.logged_in_user_info?.lab_or_branch
                                    ?.lab_is_compliant && (`${testMemoData?.test_memo_data?.tm_msfm_no}`

                                    ) || ""}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  Issue No.:{" "}
                                  {testMemoData?.lab_detail?.lab_tm_msfm_no_issueno || "--"}
                                </td>
                                <td>
                                  Issue Date:{" "}
                                  {getFormatedDate(
                                    testMemoData?.lab_detail.lab_tm_msfm_no_issue_date,
                                    1
                                  )}
                                </td>
                                <td>
                                  Amend No.:{" "}
                                  {testMemoData?.lab_detail.lab_tm_msfm_amendmentno || "--"}
                                </td>
                                <td>
                                  Amend Date:{" "}
                                  {getFormatedDate(
                                    testMemoData?.lab_detail?.lab_tm_msfm_amendment_date,
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
            {/*  )} */}
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

export default ModuleTestmemo;
