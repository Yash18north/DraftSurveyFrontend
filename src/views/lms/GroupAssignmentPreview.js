import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import formConfig from "../../formJsonData/LMS/GroupAssignmentPreview.json";
import Form from "../../components/common/Form";
import { postDataFromApi } from "../../services/commonServices";
import {  sampleIdsApi } from "../../services/api";
const GroupAssignment = () => {
  const [masterResponse, setMasterResponse] = useState([]);
  const [totalSamples, setTotalSamples] = useState([]);
  const getSampleIdsMasterData = async (sampleId) => {
    try {
      let tempBody = {
        smpl_inwrd_id: sampleId,
      };
      let res = await postDataFromApi(sampleIdsApi, tempBody);
      if (res.status === 200 && res.data.data) {
        setTotalSamples(res.data.data)
        const transformedData = res.data.data.map((value) => ({
          id: value,
          name: value,
        }));
        const bodyToPass = {
          model: "smpl_set_smpljson",
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
          masterResponse={masterResponse}
          getSampleIdsMasterData={getSampleIdsMasterData}
          setMasterResponse={setMasterResponse}
          totalSamples={totalSamples}
        />
      </Col>
    </Row>
  );
};

export default GroupAssignment;
