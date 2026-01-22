import React from "react";
import { Row, Col } from "reactstrap";
import formConfig from "../../formJsonData/LMS/JrfListing.json";
import searchConfigJson from "../../formJsonData/LMS/searchFilterFields.json";
import Form from "../../components/common/Form";
const JrfListing = () => {
  return (
    <Row>
      <Col>
        <Form formConfig={formConfig} searchConfigJson={searchConfigJson.JRFList}/>
      </Col>
    </Row>
  );
};

export default JrfListing;
