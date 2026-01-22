import React, { useEffect, useState } from "react";
import { postDataFromApi } from "../../../services/commonServices";
import { testReportDetailsApi } from "../../../services/api";
import TestReportPreviewDetailsSetWise from "./TestReportPreviewDetailsSetWise";
import PropTypes from 'prop-types';

const TestReportPreviewDetails = ({
  scopType,
  testMemoId,
  responsedata,
  setToatlPages,
  setLabDetails,
  labDetails,
  isPDFDownload,
  setNonScopeData,
  setScopeData,
  isLastPageShow,
  isFrom,
  scopeData
}) => {
  const [testMemoSetData, setTestMemoSetData] = useState([]);

  useEffect(() => {
    if (testMemoId) {
      getTestReportDetails(testMemoId);
    }
  }, [testMemoId]);
  const getTestReportDetails = async (id) => {
    try {
      const bodyToPass = {
        test_memo_id: id,
        context: scopType,
      };
      let res = await postDataFromApi(testReportDetailsApi, bodyToPass);
      if (res?.data?.status === 200) {
        const actualResponse = res.data.data;
        setTestMemoSetData(actualResponse.sample_sets);
        setLabDetails(actualResponse.lab_detail);
        if (scopType === "scope") {
          setScopeData(actualResponse.sample_sets);
        } else {
          setNonScopeData(actualResponse.sample_sets);
        }
      }
    } catch (error) {
    }
  };
  return (
    <>
   
      {testMemoSetData.map((singleSet, setIndex) => {
        return (
          <TestReportPreviewDetailsSetWise
            scopType={scopType}
            testMemoId={testMemoId}
            responsedata={responsedata}
            setToatlPages={setToatlPages}
            singleSet={singleSet}
            actualLabDetails={labDetails}
            // isLastPage={setIndex === testMemoSetData.length - 1}
            isLastPage={true}
            isPDFDownload={isPDFDownload}
            setIndex={setIndex}
            scopeData={scopeData}
            isLastPageShow={isLastPageShow}
          />
        );
      })}
    </>
  );
};
TestReportPreviewDetails.propTypes = {
  scopType: PropTypes.string,
  testMemoId: PropTypes.string,
  responsedata: PropTypes.object,
  setToatlPages: PropTypes.func,
  setLabDetails: PropTypes.func,
  labDetails: PropTypes.shape({
    // Define the expected shape of the labDetails object if known
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
    lab_ic_msfm_no: PropTypes.string,
  }),
  isPDFDownload: PropTypes.bool,
  setNonScopeData: PropTypes.func,
  setScopeData: PropTypes.func,
  isLastPageShow: PropTypes.bool,
  isFrom: PropTypes.string,
  scopeData: PropTypes.arrayOf(PropTypes.object),
};
export default TestReportPreviewDetails;
