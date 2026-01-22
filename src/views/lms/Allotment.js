import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import formConfig from "../../formJsonData/LMS/Allotment.json";

import Form from "../../components/common/Form";
import { geChemistUserApi } from "../../services/api";
import { postDataFromApi } from "../../services/commonServices";

/*Author: Yash 
Date: 22-10-2021
Use: removed filterconfig and added formConfig

*/
const TestMemo = () => {
  const [testMemoId, setTestMemoId] = useState("");
  const [masterResponse, setMasterResponse] = useState([]);
  useEffect(() => {
    getChemistUsersMaster();
  }, []);
  const getChemistUsersMaster = async () => {
    try {
      let tempBody = {};
      let res = await postDataFromApi(geChemistUserApi, tempBody);
      if (res.data && res.data.status === 200 && res.data.data) {
        const transformedData = res.data.data.map((value) => ({
          id: value.usr_id,
          name: value.full_name,
        }));
        const bodyToPass = {
          model: "sa_sampleallottedto",
          data: transformedData,
        };
        setMasterResponse((prev) => [...prev, bodyToPass]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Row>
      <Col>
        <Form
          formConfig={formConfig}
          testMemoId={testMemoId}
          setTestMemoId={setTestMemoId}
          masterResponse={masterResponse}
          setMasterResponse={setMasterResponse}
        />
      </Col>
    </Row>
  );
};

export default TestMemo;
