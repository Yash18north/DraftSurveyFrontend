import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import formConfig from "../../formJsonData/LMS/GroupAssignment.json";
import Form from "../../components/common/Form";
import { postDataFromApi } from "../../services/commonServices";
import {
  labparametersApi,
  sampleIdsApi,
} from "../../services/api";
const GroupAssignment = () => {
  const [masterResponse, setMasterResponse] = useState([]);
  

  const getSampleIdsMasterData = async (sampleId) => {
    try {
      let tempBody = {
        smpl_inwrd_id: sampleId,
      };
      let res = await postDataFromApi(sampleIdsApi, tempBody);
      if (res.data && res.data.status === 200 && res.data.data) {
        const transformedData = res.data.data.map((value) => ({
          id: value,
          name: value,
        }));
        const bodyToPass = {
          model: "smpl_set_smpljson",
          data: transformedData,
        };
        let isExists = false;
        let filterData = masterResponse.filter((model) => {
          if (model.model === "smpl_set_smpljson") {
            model.data = transformedData;
            isExists = true;
          }
          return true;
        });
        if (isExists) {
          setMasterResponse(filterData);
        } else {
          setMasterResponse((prev) => [...prev, bodyToPass]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getAssignmentMasterData = async (
    commodity_id,
    lab_id,
    setGroupDefaultValue
  ) => {
    try {
      let tempBody = {
        lab_id: lab_id,
        commodity_id: commodity_id,
      };
      let res = await postDataFromApi(labparametersApi, tempBody);
      if (res.data && res.data.status === 200) {
        const actualResponse = res.data.data;
        let standards = actualResponse.standards;
        let parameters = actualResponse.parameters;
        let groups = actualResponse.groups;
        let basis = actualResponse.basis;

        const groupsData = {
          model: "smpl_set_groupjson",
          data: groups,
        };
        const parametersdata = {
          model: "smpl_set_paramjson",
          data: parameters,
        };
        const standardsData = {
          model: "smpl_set_testmethodjson",
          data: standards,
        };
        const basisData = {
          model: "smpl_set_basisjson",
          data: basis,
        };
        setGroupDefaultValue(basis);
        setMasterResponse((prev) => [
          ...prev,
          groupsData,
          parametersdata,
          standardsData,
          basisData,
        ]);
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
          getAssignmentMasterData={getAssignmentMasterData}
        />
      </Col>
    </Row>
  );
};

export default GroupAssignment;
