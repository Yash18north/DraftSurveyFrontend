import React from "react";
import { Row, Col } from "reactstrap";
import formConfig from "../../formJsonData/Operations/jobinstructions/JrfInstructionListing.json";
import searchConfigJson from "../../formJsonData/LMS/searchFilterFields.json";
import Form from "../../components/common/Form";
const JrfInstructionListing = () => {
  return (
    <Row>
      <Col>
        <Form
          formConfig={formConfig}
          searchConfigJson={searchConfigJson.jobinstructionList}
        />
      </Col>
    </Row>
  );
};

export default JrfInstructionListing;
