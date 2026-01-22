import React from "react";
import { Row, Col } from "reactstrap";
import formConfig from "../../../formJsonData/Operations/Vessel/VesselJIListing.json";
// import formConfig from "../../../formJsonData/Operations/jobinstructions/JrfInstructionListing.json";
import searchConfigJson from "../../../formJsonData/LMS/searchFilterFields.json";
import Form from "../../../components/common/Form";

const vesselJIList = () => {
  formConfig.listView.moduleType="jioperationjsonb"
  return (
    <Row>
      <Col>
        <Form formConfig={formConfig} searchConfigJson={searchConfigJson.vesselList} useForComponent="Operations"/>
      </Col>
    </Row>
  );
};

export default vesselJIList;
