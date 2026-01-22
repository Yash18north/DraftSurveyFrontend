import React from "react";
import { Row, Col } from "reactstrap";
import Form from '../../../components/common/Form'
import formConfig from "../../../formJsonData/LMS/JRF/JRFDocumentList.json"
const JRFDocumentList = () => {
  return (
    <Row>
      <Col>
        <Form formConfig={formConfig} />
      </Col>
    </Row>
  );
};
export default JRFDocumentList;