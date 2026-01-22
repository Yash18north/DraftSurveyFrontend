import React from "react";
import { Row, Col } from "reactstrap";
import formConfig from "../../formJsonData/LMS/AllotmentListing.json";
import Form from "../../components/common/Form";
import searchConfigJson from "../../formJsonData/LMS/searchFilterFields.json";
const InwardList = () => {
  return (
    <Row>
      <Col>
        <Form formConfig={formConfig} searchConfigJson={searchConfigJson.allotmentList}/>
      </Col>
    </Row>
  );
};

export default InwardList;
