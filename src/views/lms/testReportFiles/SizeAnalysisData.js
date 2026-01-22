import React from "react";
import { getComonCodeForCompany, getFormatedDate, rolesDetails } from "../../../services/commonFunction";
import { GetTenantDetails } from "../../../services/commonServices";
import FooterTCRC from "../../../assets/images/TestMemo/footer_stamp.png";
import FooterTIPL from "../../../assets/images/TestMemo/footer_TIPL.png";
const TIPLFooter = "https://tcrc-nonprod-bucket.s3.ap-south-1.amazonaws.com/18north_masterdata/TIPL_footerremovebgpreview.png"
const SizeAnalysisData = ({ isNABLLab, labDetails, responsedata, srNoAdd, WrappedText, notdrawnby, testMemoSetData }) => {
    const totalDisplayPages=1
    const currentPage=1
    const isLastPage=true
    return (
        <section
            style={{ marginTop: "0px" }}
            id={"section" + 1}
            className="pdf-section"
        >
            <div
                className="testMemoPreviewContainer"
                style={{
                    /*Author : Yash
                    USE: Commented this code.
                    */
                    // backgroundImage: `url(${
                    //   GetTenantDetails(1, 1) != "TPBPL" && isNABLLab
                    //     ? responsedata?.company?.company_code === "L"
                    //       ? TIPLBackground
                    //       : TCRCBackground
                    //     : ""
                    // })`,
                    backgroundImage: `url(${
                        // GetTenantDetails(1, 1) != "TPBPL" &&
                        isNABLLab && labDetails?.company?.cmp_water_mark
                        })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    boxSizing: "border-box",
                    margin: "0px",
                }}
            >
                {GetTenantDetails(1, 1) !== "TPBPL" ? (
                    <>
                        <div className="logo-description">
                            <div className="logo-description-header-detail">
                                <h1>
                                    {labDetails?.company?.cmp_name}
                                    { }
                                    <br />
                                    {responsedata?.company?.company_code === "C" && (
                                        <span>
                                            (Formerly Known As Therapeutics Chemical
                                            Research Corporation)
                                        </span>
                                    )}
                                </h1>

                                <p>
                                    {labDetails?.lab_address}-{labDetails?.lab_post_code}<br />
                                    Tel: {labDetails?.lab_contact}
                                    <br />
                                    Email:
                                    {labDetails?.lab_email}
                                </p>
                            </div>
                            {responsedata?.company?.company_logo && (
                                <img
                                    src={responsedata?.company?.company_logo}
                                    className={
                                        responsedata.company_code === "L"
                                            ? "tcrcHeaderLogoTIPL"
                                            : "tcrcHeaderLogo"
                                    }

                                />
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="logo-description logo-description-tpbpl">
                            {responsedata?.company?.company_logo && (
                                <img
                                    src={responsedata?.company?.company_logo}
                                    className={
                                        responsedata.company_code === "L"
                                            ? "tcrcHeaderLogoTIPL"
                                            : "tcrcHeaderLogo"
                                    }

                                />
                            )}
                            <div className="logo-description-header-detail">
                                <h1>
                                    {labDetails?.company?.cmp_name}
                                    { }
                                    <br />
                                    {/* <span>
                          (Formerly Known As Therapeutics Chemical Research
                          Corporation)
                        </span> */}
                                </h1>

                                <p>
                                    {labDetails?.lab_address}-{labDetails?.lab_post_code}<br />
                                    Tel: {labDetails?.lab_contact} | Email:
                                    {labDetails?.lab_email}
                                    <br />
                                    CIN NO. {labDetails?.company?.cmp_cin_no}
                                </p>
                            </div>
                        </div>
                    </>
                )}

                {/* )} */}
                <div className="headingWithLogos">
                    <div className="jubleeyrsLogo">
                        {GetTenantDetails(1, 1) != "TPBPL" &&
                            isNABLLab &&
                            responsedata?.company?.company_75_year_logo && (
                                <img
                                    src={responsedata?.company?.company_75_year_logo}
                                    alt="Lab-stamp"
                                    // style={{ width: "50px", height: "50px" }}
                                    className="Lab-stamp"

                                />
                            )}
                        {"   "}
                    </div>
                    <h1 className="heading_h1">Test Report</h1>
                    <div className="nablImg">

                    </div>
                </div>

                <div className="ulr_details">
                    <div>
                        <h3>
                            Test Report Number:{" "}
                            {
                            testMemoSetData.length > 0
                                ? testMemoSetData?.[0]?.sample_code +
                                "A" 
                                // +
                                // (testMemoSetData.length > 1
                                //     ? "-" +
                                //     (testMemoSetData?.[testMemoSetData.length - 1]
                                //         ?.sample_code?.slice(-5)) +
                                //     "A"
                                //     : "")
                                : "-"
                                }
                        </h3>


                    </div>
                    <div>
                        <h3>
                            Date:{" "}
                            {getFormatedDate(
                                responsedata.ic_dateanalysiscompleted
                                    ? responsedata.ic_dateanalysiscompleted
                                    : new Date(),
                                1
                            )}
                        </h3>
                        <h3>
                            Page {currentPage} of {totalDisplayPages}
                        </h3>
                    </div>
                </div>
                {currentPage == 1 && (
                    <div className="job-details">
                        <div>
                            <p className={"col-md-1"}></p>
                            <p className={"col-md-4"}>
                                1. Name of the Customer with Address{" "}
                                <span className="required_mark"> *</span>
                            </p>
                            <span className={"col-md-1"}>:</span>
                            <p className={"col-md-5"}>
                                {responsedata.ic_customername},<br />
                                <WrappedText text={responsedata.ic_customeraddress} width={43} />
                            </p>
                            <p className={"col-md-1"}></p>
                        </div>
                        <div>
                            <p className={"col-md-1"}></p>
                            <p className={"col-md-4"}>2. Sampling Activity</p>
                            <span className={"col-md-1"}>:</span>
                            <p className={"col-md-5"}>
                                {responsedata.ic_smpldrawnbylab}
                            </p>
                            <p className={"col-md-1"}></p>
                        </div>
                        {!notdrawnby ?
                            <>
                                <div>
                                    <p className={"col-md-1"}></p>
                                    <p className={"col-md-4"}>3. Location of Sampling
                                        {
                                            responsedata.ic_is_client_req && (<span className="required_mark"> *</span>)
                                        }
                                    </p>
                                    <span className={"col-md-1"}>:</span>
                                    <p className={"col-md-5"}>
                                        <WrappedText text={responsedata.ic_locationofsmpl} width={43} />
                                    </p>
                                    <p className={"col-md-1"}></p>
                                </div>
                                <div>
                                    <p className={"col-md-1"}></p>
                                    <p className={"col-md-4"}>4. Date of Sampling
                                        {
                                            responsedata.ic_is_client_req && (<span className="required_mark"> *</span>)
                                        }
                                    </p>
                                    <span className={"col-md-1"}>:</span>
                                    <p className={"col-md-5"}>
                                        {responsedata.ic_dos && responsedata.ic_dos !== "N/A"
                                            ? getFormatedDate(responsedata.ic_dos, 1)
                                            : "N/A"}
                                    </p>
                                    <p className={"col-md-1"}></p>
                                </div>
                                <div>
                                    <p className={"col-md-1"}></p>
                                    <p className={"col-md-4"}>5. Sampling Method/Plan
                                        {
                                            responsedata.ic_is_client_req && (<span className="required_mark"> *</span>)
                                        }
                                    </p>
                                    <span className={"col-md-1"}>:</span>
                                    <p className={"col-md-5"}>
                                        <WrappedText text={responsedata.ic_samplingmethods} width={43} />
                                    </p>
                                    <p className={"col-md-1"}></p>
                                </div>
                                <div>
                                    <p className={"col-md-1"}></p>
                                    <p className={"col-md-4"}>
                                        6.{" "}
                                        {responsedata.ic_smpldrawnbylab ===
                                            "Sample Not Drawn By Laboratory"
                                            ? "Environmental Conditions During Sampling"
                                            : "Environmental Conditions During Sampling"}
                                        {
                                            responsedata.ic_is_client_req && (<span className="required_mark"> *</span>)
                                        }
                                    </p>
                                    <span className={"col-md-1"}>:</span>
                                    <p className={"col-md-5"}>
                                        {responsedata.ic_envcondition}
                                    </p>
                                    <p className={"col-md-1"}></p>
                                </div>
                            </> : null
                        }

                        <div>
                            <p className={"col-md-1"}></p>
                            <p className={"col-md-4"}>
                                {7 - notdrawnby}. Description of the Sample{" "}
                                <span className="required_mark"> *</span>
                            </p>
                            <span className={"col-md-1"}>:</span>
                            <p className={"col-md-5"}>
                                {responsedata.ic_descofsmpl}
                            </p>
                            <p className={"col-md-1"}></p>
                        </div>
                        {(responsedata.ic_is_mark || responsedata.ic_is_seal) && (
                            <div>
                                <p className={"col-md-1"}></p>
                                <p className={"col-md-4"}>
                                    {8 - notdrawnby}. Marks and Seal{" "}
                                    <span className="required_mark"> *</span>
                                </p>
                                <span className={"col-md-1"}>:</span>
                                <p className={"col-md-5"}>
                                    <WrappedText text={`${responsedata?.ic_mark_and_seal_qualifier ? responsedata?.ic_mark_and_seal_qualifier + "/" : ""} ${(testMemoSetData.length > 0 &&
                                        responsedata.ic_is_mark &&
                                        responsedata?.ic_mark_from || "") +
                                        (testMemoSetData.length > 1
                                            ? "-" +
                                            responsedata?.ic_mark_to
                                            : "")} ${responsedata.ic_is_seal &&
                                            responsedata.ic_is_mark &&
                                            "/" || ""} ${(testMemoSetData.length > 0 &&
                                                responsedata.ic_is_seal &&
                                                responsedata?.ic_seal_from || "") +
                                            (testMemoSetData.length > 1
                                                ? "-" +
                                                responsedata?.ic_seal_to
                                                : "")}`
                                    } width={43} />
                                </p>
                                <p className={"col-md-1"}></p>
                            </div>
                        ) || ""}
                        <div>
                            <p className={"col-md-1"}></p>
                            <p className={"col-md-4"}>
                                {9 - srNoAdd}. Condition of Sample
                            </p>
                            <span className={"col-md-1"}>:</span>
                            <p className={"col-md-5"}>
                                <WrappedText text={responsedata.ic_conditionofsmpl} width={43} />
                            </p>
                            <p className={"col-md-1"}></p>
                        </div>
                        <div>
                            <p className={"col-md-1"}></p>
                            <p className={"col-md-4"}>
                                {10 - srNoAdd}. Reference No. & Date
                            </p>
                            <span className={"col-md-1"}>:</span>
                            <p className={"col-md-5"}>
                                <WrappedText text={responsedata.ic_reference_date} width={43} />
                            </p>
                            <p className={"col-md-1"}></p>
                        </div>
                        <div>
                            <p className={"col-md-1"}></p>
                            <p className={"col-md-4"}>
                                {11 - srNoAdd}. Date of Sample Receipt
                            </p>
                            <span className={"col-md-1"}>:</span>
                            <p className={"col-md-5"}>
                                {getFormatedDate(responsedata.ic_dateofrecsmpl, 1)}
                            </p>
                            <p className={"col-md-1"}></p>
                        </div>

                        <div>
                            <p className={"col-md-1"}></p>
                            <p className={"col-md-4"}>
                                {12 - srNoAdd}. Location where test performed
                            </p>
                            <span className={"col-md-1"}>:</span>
                            <p className={"col-md-5"}>{responsedata.ic_test_performed_at &&
                                responsedata.ic_test_performed_at.split('\n').length > 1 && responsedata.ic_test_performed_at.split('\n').map((line, index) => (
                                    <React.Fragment key={index}>
                                        <WrappedText text={line} width={43} />
                                        {index === 0 && <br /> || null}
                                    </React.Fragment>
                                )) || <WrappedText text={responsedata.ic_test_performed_at} width={43} />}</p>
                            <p className={"col-md-1"}></p>
                        </div>
                        <div>
                            <p className={"col-md-1"}></p>
                            <p className={"col-md-4"}>
                                {13 - srNoAdd}. Date of Analysis
                            </p>
                            <span className={"col-md-1"}>:</span>
                            <p className={"col-md-5"}>
                                {getFormatedDate(responsedata.ic_dateofanalysis, 1)}
                                {responsedata?.ic_dateofanalysis !==
                                    responsedata?.ic_dateanalysiscompleted &&
                                    " to " +
                                    getFormatedDate(
                                        responsedata.ic_dateanalysiscompleted,
                                        1
                                    ) || ""}
                            </p>
                            <p className={"col-md-1"}></p>
                        </div>
                        <div>
                            <p className={"col-md-1"}></p>
                            <p className={"col-md-4"}>
                                {14 - srNoAdd}. Environmental conditions during
                                Analysis
                            </p>
                            <span className={"col-md-1"}>:</span>
                            <p className={"col-md-5"}>
                                {(responsedata.ic_ambienttemp
                                    ? `Amb Temp.: ${responsedata.ic_ambienttemp + " °C"
                                    },`
                                    : "") +
                                    (responsedata.ic_humidity
                                        ? `RH :${responsedata.ic_humidity} %,`
                                        : "")
                                }
                                <br />
                                {
                                    (responsedata.ic_borometric_pressure &&
                                        !["C", "L"].includes(responsedata.company_code)
                                        ? ` Barometric Pressure:${responsedata.ic_borometric_pressure} hPa`
                                        : "")
                                }
                            </p>
                            <p className={"col-md-1"}></p>
                        </div>
                        {/* <div>
                        <p className={"col-md-1"}></p>
                        <p className={"col-md-4"}>{15 - srNoAdd}. Result</p>
                        <span className={"col-md-1"}>:</span>
                        <p className={"col-md-5"}><WrappedText text={responsedata.ic_remarks} width={43} /></p>
                        <p className={"col-md-1"}></p>
                      </div> */}
                        <div>
                            <p className={"col-md-1"}></p>
                            <p className={"col-md-4"}>{15 - srNoAdd}. Remark</p>
                            <span className={"col-md-1"}>:</span>
                            <p className={"col-md-5"}><WrappedText text={responsedata.ic_remarks} width={43} /></p>
                            <p className={"col-md-1"}></p>
                        </div>
                        <div>
                            <p className={"col-md-1"}></p>
                            <p className={"col-md-11"}>{16 - srNoAdd}. Result :</p>
                        </div>
                    </div>
                )}

                <div className="analysis-data-table">
                    <h5 className="result_label">Size Analysis Details</h5>
                    <table
                        cellPadding={1}
                        cellSpacing={0}
                        className="first_td"
                    >
                        <thead>
                            <tr>
                                <th className="first_td">Parameter Name</th>
                                <th className="first_td">Parameter Value</th>
                                <th className="first_td">Parameter Unit</th>
                                <th className="first_td">Parameter Method</th>
                            </tr>
                        </thead>
                        <tbody>
                            {responsedata?.ic_size_analysis_data.map(
                                (singleData, i) => (
                                    <tr>
                                        <td className="second_td">
                                            {singleData.param_name}
                                        </td>
                                        <td className="second_td">
                                            {singleData.param_value}
                                        </td>
                                        <td className="second_td">
                                            {singleData.param_unit}
                                        </td>
                                        <td className="second_td">
                                            {singleData.param_method}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
                {currentPage == totalDisplayPages && isLastPage ? (
                    <>
                        <div className="roles userdetails-roles">
                            <div>
                                <p>Prepared By</p>
                                {responsedata?.lab_receiptionist?.signature && (
                                    <img
                                        // src={LRSign}
                                        src={responsedata?.lab_receiptionist?.signature}
                                        // src={imageToDataURL(responsedata?.lab_receiptionist?.signature)}
                                        alt="Lab-stamp"
                                        // style={{ width: "100px", height: "auto" }}
                                        className="stamp-signature"
                                    />
                                )}
                                <div>
                                    <p>{responsedata?.lab_receiptionist?.name || "-"}</p>
                                    <p>
                                        (
                                        {rolesDetails.map((role, UserIndex) => (
                                            <span key={"role-" + UserIndex}>
                                                {responsedata?.lab_receiptionist?.role ===
                                                    role?.role
                                                    ? role.label
                                                    : null}
                                            </span>
                                        ))}
                                        )
                                    </p>
                                </div>
                            </div>
                            {["dtm-approved", "tm-approved", "publish"].includes(
                                responsedata.status
                            ) && (
                                    <div>
                                        <p>Verified By</p>

                                        {responsedata?.dtm?.signature && (
                                            <img
                                                // src={LRSign}
                                                src={responsedata?.dtm?.signature}
                                                alt="Lab-stamp"
                                                // style={{ width: "100px", height: "auto" }}
                                                className="stamp-signature"
                                            />
                                        )}
                                        <div>
                                            <p>{responsedata?.dtm?.name || "-"}</p>
                                            <p>
                                                (
                                                {rolesDetails.map((role, UserIndex) => (
                                                    <span key={"role-" + UserIndex}>
                                                        {responsedata?.dtm?.role === role?.role
                                                            ? role.label
                                                            : null}
                                                    </span>
                                                ))}
                                                )
                                            </p>
                                        </div>
                                    </div>
                                )}
                            {["tm-approved", "publish"].includes(
                                responsedata.status
                            ) && (
                                    <div className="stamp-signature-TM">
                                        <p>Authorized Signatory</p>
                                        {responsedata?.technical_manager?.signature && (
                                            <img
                                                // src={TMSign}
                                                src={responsedata?.technical_manager?.signature}
                                                alt="Lab-stamp"
                                                className="stamp-signature"
                                            // style={{ width: "100px", height: "auto" }}

                                            />
                                        )}
                                        <div className="signature-div">
                                            <p>{responsedata?.technical_manager?.name || "-"}</p>
                                            <p>
                                                (
                                                {rolesDetails.map((role, UserIndex) => (
                                                    <span key={"role-" + UserIndex}>
                                                        {responsedata?.technical_manager?.role ===
                                                            role?.role
                                                            ? role.label
                                                            : null}
                                                    </span>
                                                ))}
                                                )
                                            </p>
                                        </div>
                                    </div>
                                )}
                        </div>
                        <div className="end">END OF TEST REPORT</div>
                    </>
                ) : (
                    <div className="end">
                        <div>
                            {responsedata?.technical_manager?.signature ? <img
                                // src={labDetails.lab_tm_stamp}
                                // src={responsedata?.dtm?.signature}
                                src={responsedata?.technical_manager?.signature}
                                alt="Lab-stamp"
                                style={{ width: "100px", height: "auto" }}
                            /> : ""}
                            <p>Cont..{currentPage + 1}..</p>
                        </div>
                    </div>
                )}

                <footer className="footerDetails">
                    {GetTenantDetails(1, 1) !== "TPBPL" ? (
                        <div className="footerContainer">
                            <div className="footerContainerLeft">
                                <span>
                                    + The test result related only to the item tested.
                                    The test report in full or partshall not be
                                    reproduced unless written permission is obtained
                                    from{" "}
                                    {getComonCodeForCompany(
                                        responsedata?.company?.company_code
                                    )}
                                </span>
                                <br />

                                <span>
                                    + Submitted sample not drawn by{" "}
                                    {getComonCodeForCompany(
                                        responsedata?.company?.company_code
                                    )}
                                    ,{labDetails?.lab_name} Laboratory
                                </span>
                                <br />

                                <span>+ "*" Data provided by the customer</span>
                                <br />

                                <span>
                                    + Information / Data Provided by customer may affect
                                    the validity of results,
                                </span>
                            </div>

                            {/* <img src={labDetails?.company?.cmp_seal} /> */}
                            <img
                                src={
                                    responsedata?.company?.company_code === "C"
                                        ? FooterTCRC
                                        : FooterTIPL
                                }
                            />
                            <div className="footerContainerRight">
                                <span>
                                    + This test report which is issued reflects our
                                    findings at the time and place of inspection/testing
                                    only and does not relieve parties from their
                                    contractual obligations
                                </span>
                                <br />
                                <span>
                                    + Samples will be retained by us for thirty days
                                    only
                                </span>
                                <br />

                                <span>+ “# -Revised Data”</span>
                            </div>
                        </div>
                    ) : (
                        <div className="footerContainer">
                            <div className="footerContainerComplete footerContainerComplete-tpbpl">
                                <p>
                                    <strong>Note:</strong>
                                </p>
                                <ol>
                                    <li>
                                        The test result related only to the item(s)
                                        tested. The test report in full or part shall not
                                        be reproduced unless written permission is
                                        obtained from TPBPL.
                                    </li>
                                    <li>
                                        Submitted sample not drawn by TPBPL, Laboratory.
                                    </li>
                                    <li>
                                        "*"- Data Provided by Customer., "#"- Revised
                                        data.
                                    </li>
                                    <li>
                                        This test report which is issued reflects our
                                        findings at the time and place of testing only and
                                        does not relieve parties from their contractual
                                        obligation.
                                    </li>
                                    <li>
                                        Samples will be retained by us for ninety days
                                        only.
                                    </li>
                                    <li>
                                        Information/Data provided by customer may affect
                                        the validity of results.
                                    </li>
                                    <li>
                                        <strong>***</strong>This document is issued by the
                                        Company under its General Conditions for
                                        Inspection and Testing Services printed overleaf.
                                    </li>
                                </ol>
                            </div>
                        </div>
                    )}
                    {responsedata?.company?.company_code === "L" ? (
                        <>
                            <div className="footerContainerTipl">
                                <img src={TIPLFooter} />
                            </div>
                        </>
                    ) : (
                        (
                            <>
                                {GetTenantDetails(1, 1) !== "TPBPL" && <div className="footerContainerBottom">
                                    ***This document is issued by the Company under its
                                    General Conditions for Inspection and Testing
                                    Services printed overleaf
                                </div> || null}
                                <div className="leftStart">
                                    {isNABLLab && (
                                        <>
                                            Doc. No. {labDetails?.lab_ic_msfm_no || "--"}{" "}
                                            Issue No. {labDetails?.lab_ic_msfm_no_issueno || "--"} &
                                            Issue Date.{" "}
                                            {getFormatedDate(
                                                labDetails?.lab_ic_msfm_no_issue_date,
                                                1
                                            )};
                                            Amend No. 00 & Amend Date --
                                        </>
                                    )}
                                </div>
                            </>
                        )
                    )}
                </footer>
            </div>
            <div className="page-break"></div>
        </section>
    )
}
export default SizeAnalysisData;