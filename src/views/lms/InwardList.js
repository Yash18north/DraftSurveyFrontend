import React from "react";
import { Row, Col } from "reactstrap";
import formConfig from "../../formJsonData/LMS/InwardListing.json";
import Form from "../../components/common/Form";
import searchConfigJson from "../../formJsonData/LMS/searchFilterFields.json";
const InwardList = () => {
  return (
    <Row>
      <Col>
        <Form formConfig={formConfig} searchConfigJson={searchConfigJson.sampleInwardList}/>
      </Col>
    </Row>
  );
};

export default InwardList;
