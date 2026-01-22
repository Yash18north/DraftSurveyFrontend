import { Row, Col } from "reactstrap";
import formConfig from "../../formJsonData/LMS/InternalCertificate.json";
import Form from "../../components/common/Form";
import React, { useState } from "react";
import { postDataFromApi } from "../../services/commonServices";
import { labGrouoparametersApi, labGroupsStdBasisApi } from "../../services/api";

const InternalCertificate = () => {
  const [masterResponse, setMasterResponse] = useState([]);
  const [testMemoId, setTestMemoId] = useState("");
  const getAssignmentMasterData = async (commodity_id, lab_id, context,setIstestMethods) => {
    try {
      let tempBody = {
        lab_id: lab_id,
        commodity_id: commodity_id,
        context: context,
      };
      let res = await postDataFromApi(labGrouoparametersApi, tempBody);
      if (res.data && res.data.status === 200) {
        const actualResponse = res.data.data;
        if (actualResponse.parameters.length > 0) {
          let filterData = actualResponse.parameters.filter((param) => param.param_name === "Sampling")
          if (filterData.length > 0) {
            if(setIstestMethods){
              setIstestMethods(true)
            }
            getGroupParameterMasterData(filterData[0].param_id, commodity_id, lab_id)
          }
          else {
            // setIstestMethods(false)
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
    return true;
  };
  const getGroupParameterMasterData = async (value, commodity_id, lab_id) => {
    try {
      let tempBody = {
        lab_id: lab_id,
        commodity_id: commodity_id
      };
      tempBody.param_id = value;
      let res = await postDataFromApi(labGroupsStdBasisApi, tempBody);
      if (res.data && res.data.status == 200) {
        const actualResponse = res.data.data;
        let standards = actualResponse.standard || [];
        standards = standards.filter((standard) => {
          standard.name = standard.std_name;
          standard.id = standard.std_name;
          return true;
        });
        const testMethodData = {
          model: "ic_samplingmethods",
          data: standards,
        };
        setMasterResponse((prev) => [...prev, testMethodData]);
      }
    } catch (error) {

    }
  };
  return (
    <Row>
      <Col>
        <Form
          formConfig={formConfig}
          setMasterResponse={setMasterResponse}
          masterResponse={masterResponse}
          testMemoId={testMemoId}
          setTestMemoId={setTestMemoId}
          getAssignmentMasterData={getAssignmentMasterData}
        />
      </Col>
    </Row>
  );
};

export default InternalCertificate;
