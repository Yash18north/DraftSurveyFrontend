import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";

import formConfig from "../../formJsonData/LMS/JrfReport.json";
import formConfigOp from "../../formJsonData/LMS/JrfReportWithOperation.json";
import Form from "../../components/common/Form";
import { postDataFromApi } from "../../services/commonServices";
import { MasterListApi } from "../../services/api";
import { decryptDataForURL } from "../../utills/useCryptoUtils";
import PropTypes from "prop-types";
const JrfReport = ({isOperationJRF}) => {
  const [masterResponse, setMasterResponse] = useState([]);
  const hash = window.location.hash;
  const params = new URLSearchParams(hash.split("?")[1]);
  const jrfType = decryptDataForURL(params.get("jrfType"));
  const [isRegularJRF, setIsRegularJRF] = useState(jrfType === "isRegularJRF");
  useEffect(() => {
    getLabMasterData();
    geStandardMethodMasterData()
  }, []);
  const getLabMasterData = async () => {
    try {
      let tempBody = {
        model_name: "lab",
        is_dropdown: true,
      };
      let res = await postDataFromApi(MasterListApi, tempBody);
      if (res?.data?.status === 200 && res.data.data) {
        const transformedData = res.data.data.map((labDetail) => ({
          id: labDetail[0],
          name: labDetail[2] ? labDetail[2] + ` (${labDetail[1]})` : "",
        }));

        const bodyToPass = {
          model: "jrf_lab",
          data: transformedData,
        };

        setMasterResponse((prev) => [...prev, bodyToPass]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const geStandardMethodMasterData = async () => {
    try {
      let tempBody = {
        model_name: "standard_type",
        is_dropdown: true,
      };
      let res = await postDataFromApi(MasterListApi, tempBody);
      if (res?.data?.status === 200 && res.data.data) {
        const transformedData = res.data.data.map((labDetail) => ({
          id: labDetail[1] ? labDetail[1] : "",
          name: labDetail[1] ? labDetail[1] : "",
        }));

        const bodyToPass = {
          model: "jrf_test_method",
          data: transformedData,
        };

        setMasterResponse((prev) => [...prev, bodyToPass]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Row className="rowWidthAdjust">
      <Col>
        <Form formConfig={isOperationJRF ? formConfigOp : formConfig} masterResponse={masterResponse} isRegularJRF={isRegularJRF}/>
      </Col>
    </Row>
  );
};
JrfReport.propTypes = {
  isOperationJRF: PropTypes.bool,
};
export default JrfReport;
