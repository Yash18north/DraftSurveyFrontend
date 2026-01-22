import React from "react";
import { Row, Col } from "reactstrap";
import formConfig from "../../../formJsonData/Operations/Stack/StackJiListing.json";
import searchConfigJson from "../../../formJsonData/LMS/searchFilterFields.json";
import Form from "../../../components/common/Form";
const StackJIList = () => {
  return (
    <Row>
      <Col>
        <Form formConfig={formConfig} searchConfigJson={searchConfigJson.stackList} useForComponent="Operations" />
      </Col>
    </Row>
  );
};

export default StackJIList;
