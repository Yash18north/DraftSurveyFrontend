import React, { useEffect, useState } from "react";
import BhuvneshvarLab from "../../../assets/images/TestMemo/BhuvneshvarLab.png";
import {
  getComonCodeForCompany,
  getFormatedDate,
  imageToDataURL,
  rolesDetails,
} from "../../../services/commonFunction";
import TestReportPreviewMulti from "./TestReportPreviewMulti";
import TestReportPreviewSingleSet from "./TestReportPreviewSingleSet";
import TCRCBackground from "../../../assets/images/TestMemo/TCRCBackground.jpg";
import TIPLBackground from "../../../assets/images/TestMemo/TIPLBackground.jpg";
// import TIPLFooter from "../../../assets/images/TestMemo/TIPL_footer.jpg";
import petrolabQR from "../../../assets/images/TestMemo/TIPL VIZAG NABL QR CODE.png";
import petroLabLogo from "../../../assets/images/TestMemo/TPBPL MUMBAI NABL SYMBOL.png";
import { GetTenantDetails } from "../../../services/commonServices";
import FooterTCRC from "../../../assets/images/TestMemo/footer_stamp.png";
import FooterTIPL from "../../../assets/images/TestMemo/footer_TIPL.png";
import TMSign from "../../../assets/images/icons/TMSign.png";
import LRSign from "../../../assets/images/icons/LRSign.png";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import SizeAnalysisData from "./SizeAnalysisData";
const TIPLFooter = "https://tcrc-nonprod-bucket.s3.ap-south-1.amazonaws.com/18north_masterdata/TIPL_footerremovebgpreview.png"

const TestReportPreviewDetailsSetWise = ({
  scopType,
  testMemoId,
  responsedata,
  actualLabDetails,
  singleSet,
  isLastPage,
  isPDFDownload,
  setIndex,
  scopeData,
  isLastPageShow,
}) => {
  const [testMemoSetData, setTestMemoSetData] = useState([]);
  const [basisNames, setBasisNames] = useState([]);
  const [standardValues, setStandardValues] = useState([]);
  const [paramValues, setParamValues] = useState([]);
  const [paramDetailsValues, setParamDetailsValues] = useState([]);
  const [basisValues, setBasisValues] = useState([]);
  const [samplecodes, setSampleCodes] = useState([]);
  const [basisTableLength, setBasisTableLength] = useState([]);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [perBaseData, setPerBaseData] = useState(0);
  const [totalPages, setToatlPages] = useState({
    scope: 0,
    non_scope: 0,
  });

  const session = useSelector((state) => state.session);

  const user = session.user;

  let labDetails = actualLabDetails
  if (labDetails) {
    labDetails.lab_is_compliant = responsedata?.ic_is_complient !== "" ? responsedata?.ic_is_complient : responsedata?.lab_is_compliant
    labDetails.lab_nabl_code_logo = responsedata?.ic_nabl_logo !== "" ? responsedata?.ic_nabl_logo : responsedata?.lab_nabl_code_logo
    labDetails.lab_nabl_QR = responsedata?.ic_nabl_qr !== "" ? responsedata?.ic_nabl_qr : responsedata?.lab_nabl_QR
    labDetails.company.cmp_water_mark = responsedata?.ic_water_mark || labDetails?.company?.cmp_water_mark
  }

  useEffect(() => {
    getTestReportDetails(singleSet);
  }, []);
  let isOveLength = false;
  if (responsedata.ic_is_mark || responsedata.ic_is_seal) {
    let markString1 = testMemoSetData.length > 0 &&
      responsedata.ic_is_mark &&
      testMemoSetData?.[0]?.sample_mark +
      (testMemoSetData.length > 1
        ? "-" +
        testMemoSetData?.[
          testMemoSetData.length - 1
        ]?.sample_mark
        : "")
    let markString2 = testMemoSetData.length > 0 &&
      responsedata.ic_is_seal &&
      testMemoSetData?.[0]?.sample_seal +
      (testMemoSetData.length > 1
        ? "-" +
        testMemoSetData?.[
          testMemoSetData.length - 1
        ]?.sample_seal
        : "")

    let concateString = responsedata.ic_is_seal &&
      responsedata.ic_is_mark &&
      " / "

    let acualString = markString1 + concateString + markString2
    if (acualString.length > 70) {
      isOveLength = true;
    }
  }
  const getTestReportDetails = async (singleSet) => {
    try {
      let actualResponse = singleSet;
      actualResponse.samples = actualResponse.samples.sort((a, b) => {
        const string1Lst5Digit = a.sample_code.slice(-5);
        const string2Lst5Digit = b.sample_code.slice(-5);
        return string1Lst5Digit - string2Lst5Digit;
      });
      setTestMemoSetData(actualResponse.samples);
      let sampleSetData = [];
      let sampleIndex = 0;
      let perSetData = 5;
      let isNewPage = false;
      if (actualResponse.samples.length <= perSetData) {
        perSetData = 2;
      }
      actualResponse.samples.map((singleSetData, index) => {
        let sampeData = singleSetData.sample_params;
        let isTestMethodLengthOver = false
        sampeData.map((param, index2) => {
          if (param.std_detail.std_name.length > 30) {
            isTestMethodLengthOver = true
          }
        })

        if (index == 0) {
          sampleSetData[sampleIndex] = [];
        }
        const sealmarkstring =
          singleSetData.sample_mark +
          (singleSetData.sample_seal ? "-" + singleSetData.sample_seal : "");
        if (!isNewPage) {
          if (sealmarkstring.length > 45 || isOveLength || isTestMethodLengthOver) {
            perSetData = 1;
          }
        }
        if (sampleSetData[sampleIndex].length == perSetData) {
          sampleIndex = sampleIndex + 1;
          sampleSetData[sampleIndex] = [];
          perSetData = 20;
          isNewPage = true;
        }
        if (isNewPage) {
          const sealmarkstring =
            singleSetData.sample_mark +
            (singleSetData.sample_seal ? "-" + singleSetData.sample_seal : "");
          if (sealmarkstring.length > 45 || isOveLength || isTestMethodLengthOver) {
            perSetData = 10;
          }
        }
        sampleSetData[sampleIndex].push(singleSetData);
      });
      setSampleCodes(sampleSetData);
      let paramDataMain = [];
      let basisDataMain = [];
      let basisDataValuesMain = [];
      let standardMain = [];
      let basisLengthMain = [];
      let paramDetailMain = [];
      let pageCount = 0;
      let allStdDetals = []
      sampleSetData.map((singlesetData) => {
        let paramData = [];
        let paramDetail = [];
        let basisData = [];
        let basisDataValues = [];
        let standard = [];
        let isMultiBasis = false;
        let maxbasisLength = 0;
        let newParamData = [];
        let newStdData = [];
        singlesetData.map((singleValue, index) => {
          basisDataValues[index] = [];
          // singleValue.sample_params.map((param, index2) => {
          let sampeData = singleValue.sample_params;
          sampeData = sampeData.sort(
            (a, b) => a.sp_param_sequence - b.sp_param_sequence
          );
          sampeData = sampeData.reduce((accumulator, current) => {
            // Find if a matching param and standard already exists
            const existingIndex = accumulator.findIndex(

              (item) =>
                item.param_detail.param_name === current.param_detail.param_name &&
                item.std_detail.std_name === current.std_detail.std_name
            );
            // Normalize basis_detail to always be an array
            const basisDetailArray = Array.isArray(current.basis_detail)
              ? current.basis_detail
              : [current.basis_detail];

            if (existingIndex !== -1) {
              // Merge basis_detail into the existing entry, avoiding duplicates
             
              accumulator[existingIndex].basis_detail.push(...basisDetailArray);
            } else {
              // Add a new entry
              accumulator.push({
                ...current,
                basis_detail: [...basisDetailArray],
              });
            }
            return accumulator;
          }, []);
          singleValue.sample_params=sampeData
          sampeData.map((param, index2) => {
            if (GetTenantDetails(1, 1) == "TPBPL") {
              // param.basis_detail=[];
            }
            if (!paramData.includes(param.param_detail.param_name) || !standard.includes(param.std_detail.std_name)) {
              paramData.push(param.param_detail.param_name);
              standard.push(param.std_detail.std_name);
              paramDetail.push(param);
            }
            
            
            if (param.basis_detail.length > 1) {
              isMultiBasis = true;
            }
            if (maxbasisLength <= param.basis_detail.length) {
              maxbasisLength = param.basis_detail.length;
            }
            param.basis_detail.map((basis) => {
              if (
                !basisDataValues[index][
                param.sp_id + "_" + basis.spbr_basiscode
                ]
              ) {
                if (["TPBPL", "TCRC"].includes(GetTenantDetails(1, 1))) {
                  basisDataValues[index][
                    param.sp_id + "_" + basis.spbr_basiscode
                  ] = basis.spbr_sfm_input_type_value;
                } else {
                  basisDataValues[index][
                    param.sp_id + "_" + basis.spbr_basiscode
                  ] = basis.spbr_lcvalue;
                }
              }

              if (!basisData.includes(basis.spbr_basiscode)) {
                basisData.push(basis.spbr_basiscode);
              }
            });
          });
        });
        let countperbaseData = 10;
        if (isMultiBasis) {
          countperbaseData = 3
          // countperbaseData = 3;

          // if (maxbasisLength === 2) {
          //   if (paramData.length <= 8) {
          //     countperbaseData = 5;
          //   } else {
          //     countperbaseData = 8;
          //   }
          // }
          // else if (maxbasisLength === 3) {
          //   if (paramData.length <= 7) {
          //     countperbaseData = 5;
          //   } else {
          //     countperbaseData = 7;
          //   }
          // }
          // if (paramData.length <= 3) {
          //   countperbaseData = 2
          // }
        } else {
          countperbaseData = 5;
          // if (paramData.length <= 10) {
          //   countperbaseData = 8;
          // } else {
          //   countperbaseData = 10;
          // }

        }

        if (actualResponse.samples.length > 1) {
          countperbaseData = isMultiBasis ? 3 : 4;
        }

        setPerBaseData(countperbaseData);
        const basisLength =
          paramData.length > 0
            ? Math.ceil(paramData.length / countperbaseData)
            : 0;
        paramDataMain.push(paramData);
        basisDataMain.push(basisData);
        paramDetailMain.push(paramDetail);
        basisDataValuesMain.push(basisDataValues);
        standardMain.push(standard);
        basisLengthMain.push(basisLength);
        pageCount += basisLength;
      });
      setTotalPageCount(pageCount);
      setBasisTableLength(basisLengthMain);
      setToatlPages((pageCount) => {
        return {
          ...pageCount,
          [scopType]: basisLengthMain,
        };
      });

      setParamValues(paramDataMain);
      setParamDetailsValues(paramDetailMain);
      setBasisNames(basisDataMain);
      setBasisValues(basisDataValuesMain);
      setStandardValues(standardMain);
    } catch (error) {
    }
  };
  const getParameterTableDataBKP = (index, mainIndex, isSecondPageMultiple) => {
    let minValue = 0;
    let maxValue = perBaseData - 1;
    if (index != 0) {
      minValue = index * perBaseData;
      maxValue = minValue + (perBaseData - 1);
    }
    const filterdata = paramValues[mainIndex].filter(
      (param, index2) => index2 >= minValue && index2 <= maxValue
    );
    if (filterdata.length === 0) {
      return <></>;
    }
    return testMemoSetData.length === 1 ? (
      <TestReportPreviewSingleSet
        samplecodes={samplecodes}
        mainIndex={mainIndex}
        paramValues={paramValues}
        minValue={minValue}
        maxValue={maxValue}
        basisNames={basisNames}
        standardValues={standardValues}
        basisValues={basisValues}
        paramDetailsValues={paramDetailsValues}
      />
    ) : (
      <TestReportPreviewMulti
        minValue={minValue}
        maxValue={maxValue}
        basisNames={basisNames}
        paramValues={paramValues}
        standardValues={standardValues}
        testMemoSetData={testMemoSetData}
        basisValues={basisValues}
        mainIndex={mainIndex}
        samplecodes={samplecodes}
        paramDetailsValues={paramDetailsValues}
        responsedata={responsedata}
      />
    );
  };

  //Don't remove this function its working but right now commented it
  const getParameterTableData = (index, mainIndex, isSecondPageMultiple, viewIndexNo) => {

    let minValue = 0;
    let maxValue = perBaseData - 1;
    if (isSecondPageMultiple && testMemoSetData.length === 1) {
      if (viewIndexNo) {
        index = viewIndexNo - 1
      }

      // Adjust `perBaseData` dynamically
      const isFirstPage = index === 0;
      const currentPerBaseData = isFirstPage ? perBaseData : 10;

      // Set `minValue` and `maxValue` for subsequent pages
      if (!isFirstPage) {
        minValue = ((index - 1) * currentPerBaseData) + (perBaseData);
        maxValue = parseInt(minValue) + parseInt(currentPerBaseData - 1);

      }

      // Ensure `maxValue` doesn't exceed the total data length
      const dataLength = paramValues[mainIndex]?.length || 0;
      maxValue = Math.min(maxValue, dataLength);
    }
    else {
      if (index != 0) {
        minValue = index * perBaseData;
        maxValue = minValue + (perBaseData - 1);
      }
    }



    // Filter the data for the current page
    const filterdata = paramValues[mainIndex].filter(
      (param, index2) => index2 >= minValue && index2 < maxValue
    );

    if (filterdata.length === 0) {
      // console.log('minnnnn',minValue,maxValue)
      return <></>;
    }
    // console.log('Filtered Data:', filterdata);


    // Render appropriate component based on the condition
    return testMemoSetData.length === 1 ? (
      <TestReportPreviewSingleSet
        samplecodes={samplecodes}
        mainIndex={mainIndex}
        paramValues={paramValues}
        minValue={minValue}
        maxValue={maxValue}
        basisNames={basisNames}
        standardValues={standardValues}
        basisValues={basisValues}
        paramDetailsValues={paramDetailsValues}
      />
    ) : (
      <TestReportPreviewMulti
        minValue={minValue}
        maxValue={maxValue}
        basisNames={basisNames}
        paramValues={paramValues}
        standardValues={standardValues}
        testMemoSetData={testMemoSetData}
        basisValues={basisValues}
        mainIndex={mainIndex}
        samplecodes={samplecodes}
        paramDetailsValues={paramDetailsValues}
      />
    );
  };
  //

  // let currentPage =
  //   scopType == "non_scope" ? parseInt(totalPages.scope) + 0 : 0;
  let currentPage = 0;
  // let totalDisplayPages = totalPageCount;
  // totalDisplayPages = Math.ceil(totalDisplayPages / 2)
  let totalDisplayPages = 0;
  basisTableLength.map((singleBasisLength, mainIndex) => {
    // totalDisplayPages = totalDisplayPages + Math.ceil(singleBasisLength / 2);
    totalDisplayPages = totalDisplayPages + singleBasisLength;
    if (mainIndex == 0 && singleBasisLength !== 1) {
      if (totalDisplayPages === 1) {
        totalDisplayPages = totalDisplayPages + 1;
      }
    }
  });

  function WrappedText({ text, width }) {
    let wrappedText = text
    if (Array.isArray(text)) {
      wrappedText = wrappedText.join(',')
    }
    else {
      wrappedText = text ? text.match(new RegExp(`.{1,${width}}`, 'g')).join('\n') : "";
    }
    // const wrappedText = text ? text.match(new RegExp(`.{1,${width}}`, 'g')).join('\n') : "";

    return <>{wrappedText}</>; // Use <pre> for preformatted text
  }
  let tempCurrent = 0
  basisTableLength.map((singleBasisLength, mainIndex) => {
    let addedIndex = 0;
    return Array.from({ length: singleBasisLength }, (_, index) => {
      let srNoAdd = 0;
      if (!responsedata.ic_is_mark && !responsedata.ic_is_seal) {
        srNoAdd = 1;
      }
      if (scopeData.length !== 0) {
        // srNoAdd = +2;
      }

      if (addedIndex) {
        addedIndex = 0;
        return null;
      } else {
        tempCurrent++;
      }
      if (
        tempCurrent !== 1 &&
        paramDetailsValues[mainIndex][index + 1] &&
        samplecodes[mainIndex].length < 6 &&
        getParameterTableData(index + 1, mainIndex)
      ) {
        addedIndex = 1;
      }
    })
  })
  totalDisplayPages = tempCurrent
  return (
    <>
      {basisTableLength.map((singleBasisLength, mainIndex) => {
        let addedIndex = 0;
        let indexCount = 0;
        return Array.from({ length: singleBasisLength }, (_, index) => {
          let srNoAdd = 0;
          if (!responsedata.ic_is_mark && !responsedata.ic_is_seal) {
            srNoAdd = 1;
          }
          if (scopeData.length !== 0) {
            // srNoAdd = +2;
          }
          if (addedIndex) {
            addedIndex = 0;
            return null;
          } else {
            currentPage++;
          }
          if (
            currentPage !== 1 &&
            paramDetailsValues[mainIndex][index + 1] &&
            samplecodes[mainIndex].length < 6 &&
            getParameterTableData(index + 1, mainIndex)
          ) {
            addedIndex = 1;
          }

          // const isNABLLab =
          //   user?.logged_in_user_info?.lab_or_branch?.lab_is_compliant;
          // labDetail?.company?.cmp_water_mark = responsedata?.ic_water_mark || labDetail?.company?.cmp_water_mark
          const isNABLLab = labDetails?.lab_is_compliant;

          const isAnalysisDataAvalil =
            // scopType === "non_scope" &&
            isLastPageShow &&
            currentPage == totalDisplayPages &&
            responsedata.ic_is_size_analysis &&
            responsedata.ic_is_size_analysis[0] &&
            responsedata.ic_size_analysis_data != null &&
            responsedata.ic_size_analysis_data.length > 0 &&
            isLastPage;
          indexCount++
          let notdrawnby = 0
          if (responsedata.ic_smpldrawnbylab === "Sample Not Drawn By Laboratory" && !responsedata.ic_is_client_req) {
            notdrawnby = 4
            srNoAdd = srNoAdd + 4
          }
          return (
            <>
              <section
                style={{ marginTop: "0px" }}
                id={"section" + mainIndex}
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
                      {scopType === "scope" && currentPage == 1 ? (
                        GetTenantDetails(1, 1) == "TPBPL" && isNABLLab ? (
                          <>
                            {labDetails.lab_nabl_code_logo && isNABLLab && (
                              <img
                                src={labDetails.lab_nabl_code_logo}
                                alt="lab-logo"

                              />
                            )}

                            {labDetails.lab_nabl_QR && isNABLLab && (
                              <img
                                src={labDetails.lab_nabl_QR}
                                alt="lab-QR-Code"

                              />
                            )}
                          </>
                        ) : (
                          <>
                            {labDetails.lab_code == "22TCODB" && isNABLLab && (
                              <img
                                src={BhuvneshvarLab}
                                alt="Lab-stamp"
                              // style={{ width: "50px", height: "50px" }}

                              />
                            )}
                            {labDetails.lab_nabl_code_logo && isNABLLab && (
                              <img
                                src={labDetails.lab_nabl_code_logo}
                                alt="lab-logo"

                              />
                            )}

                            {labDetails.lab_nabl_QR && isNABLLab && (
                              <img
                                src={labDetails.lab_nabl_QR}
                                alt="lab-QR-Code"

                              />
                            )}
                          </>
                        )
                      ) : null}
                    </div>
                  </div>

                  <div className="ulr_details">
                    <div>
                      {currentPage == 1 && scopType == "scope" && (
                        <>
                          {isNABLLab && <h3>ULR - {responsedata.ic_ulrno}</h3>}
                          {/* <h3>Chemical Testing: {responsedata.ic_group}</h3> */}
                        </>
                      )}
                      {index == 0 && (
                        <>
                          <h3>Descipline : {responsedata.ic_discipline}</h3>
                          <h3>Group : {responsedata.ic_group}</h3>
                        </>
                      )}
                      <h3>
                        Test Report Number:{" "}
                        {testMemoSetData.length > 0
                          ? testMemoSetData?.[0]?.sample_code +
                          (scopType == "non_scope" &&
                            scopeData.length !== 0 &&
                            isNABLLab
                            ? "A"
                            : "") +
                          (testMemoSetData.length > 1
                            ? "-" +
                            (testMemoSetData?.[testMemoSetData.length - 1]
                              ?.sample_code?.slice(-5)) +
                            (scopType == "non_scope" &&
                              isNABLLab &&
                              scopeData.length !== 0
                              ? "A"
                              : "")
                            : "")
                          : "-"}
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
                          {14 - srNoAdd}. Environmental conditions during Analysis
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
                        <p className={"col-md-4"}>{15 - srNoAdd}. Remark</p>
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
                        {/* <span className={"col-md-1"}>:</span> */}
                        {/* <p className={"col-md-5"}></p>
                        <p className={"col-md-1"}></p> */}
                      </div>
                    </div>
                  )}

                  {/* <h5 className="result_label">Results :</h5> */}

                  <div className="param-table-data">
                    {/* {getParameterTableData(index, mainIndex)}
                    <br />
                    {currentPage !== 1 &&
                      paramDetailsValues[mainIndex][index + 1] &&
                      samplecodes[mainIndex].length < 6 &&
                      getParameterTableData(index + 1, mainIndex) || null} */}

                    {/* Temporrary commented it dont remove it*/}

                    {currentPage !== 1 &&
                      paramDetailsValues[mainIndex][index + 1] &&
                      samplecodes[mainIndex].length < 6 && testMemoSetData.length === 1 ?
                      getParameterTableData(index, mainIndex, 1, indexCount) : getParameterTableData(index, mainIndex, "", indexCount)}
                    <br />
                    {currentPage !== 1 &&
                      paramDetailsValues[mainIndex][index + 1] &&
                      samplecodes[mainIndex].length < 6 && testMemoSetData.length !== 1 &&
                      getParameterTableData(index + 1, mainIndex) || null}
                    {/* End comment temporray */}
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
                              {/* <img
                              src={LRSign}
                              // src={responsedata?.dtm?.signature}
                              alt="Lab-stamp"
                            // style={{ width: "100px", height: "auto" }}

                            /> */}
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
                              {/* <img
                              src={TMSign}
                              // src={responsedata?.technical_manager?.signature}
                              alt="Lab-stamp"
                            // style={{ width: "100px", height: "auto" }}

                            /> */}
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
                      // responsedata?.company?.company_code === "L" ? (
                      //   <div className="footerContainer">
                      //     <div className="footerContainerLeft"></div>

                      //     {/* <img src={labDetails?.company?.cmp_seal} /> */}
                      //     <img src={Footer} />
                      //     <div className="footerContainerRight"></div>
                      //   </div>
                      // ) :
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
                  {/* <footer className="footerDetails">
                    <div>
                      {labDetails?.company?.cmp_seal && (
                        <img src={labDetails?.company?.cmp_seal} />
                      )}
                    </div>
                    <div className="leftStart">
                      {isNABLLab && (
                        <>
                          Doc. No. {labDetails?.lab_ic_msfm_no || "--"} Issue
                          Date & No.{" "}
                          {getFormatedDate(
                            labDetails?.lab_ic_msfm_no_issue_date,
                            1
                          )}
                          /{labDetails?.lab_ic_msfm_no_issueno || "--"}
                        </>
                      )}
                    </div>
                  </footer> */}
                  {/* )} */}
                </div>
                <div className="page-break"></div>
              </section>
              {isAnalysisDataAvalil && <SizeAnalysisData isNABLLab={isNABLLab} labDetails={labDetails} responsedata={responsedata} srNoAdd={srNoAdd} WrappedText={WrappedText} notdrawnby={notdrawnby} testMemoSetData={testMemoSetData}/>}
            </>
          );

        });
      })}
    </>
  );
};
TestReportPreviewDetailsSetWise.propTypes = {
  scopType: PropTypes.string,
  testMemoId: PropTypes.string,
  responsedata: PropTypes.object,
  actualLabDetails: PropTypes.shape({
    lab_compliance_code: PropTypes.string,
    company: PropTypes.shape({
      cmp_name: PropTypes.string,
    }),
    lab_address: PropTypes.string,
    lab_contact: PropTypes.string,
    lab_email: PropTypes.string,
    lab_code: PropTypes.string,
    lab_nabl_code_logo: PropTypes.string,
    lab_nabl_QR: PropTypes.string,
    lab_ic_msfm_no: PropTypes.string, // Added based on your last warning
  }),
  singleSet: PropTypes.bool,
  isLastPage: PropTypes.bool,
  isPDFDownload: PropTypes.bool,
  setIndex: PropTypes.number,
  scopeData: PropTypes.arrayOf(PropTypes.object),
};
export default TestReportPreviewDetailsSetWise;
