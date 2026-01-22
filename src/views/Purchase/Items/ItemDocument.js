import React from "react";
import { Row, Col } from "reactstrap";
import Form from '../../../components/common/Form'
import formConfig from "../../../formJsonData/Purchase/Items/purchaseItemDocumentList.json"
const TenderDocumentList = () => {
  return (
    <Row>
      <Col>
        <Form formConfig={formConfig} />
      </Col>
    </Row>
  );
};
export default TenderDocumentList;