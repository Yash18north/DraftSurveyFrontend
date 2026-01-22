import React from "react";
import { Row, Col } from "reactstrap";
import formConfig from "../../formJsonData/LMS/TestReportList.json";
import searchConfigJson from "../../formJsonData/LMS/searchFilterFields.json";
import Form from "../../components/common/Form";
const TestReportList = () => {
  return (
    <Row>
      <Col>
        <Form formConfig={formConfig} searchConfigJson={searchConfigJson.testReportList}/>
      </Col>
    </Row>
  );
};
export default TestReportList;
