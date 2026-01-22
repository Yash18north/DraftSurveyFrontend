import React from "react";
import { Row, Col } from "reactstrap";
import Form from '../../../components/common/Form'
import formConfig from "../../../formJsonData/Purchase/PurchaseListing/PurchaseorderDocumentList.json"
const PurchaseorderDocumentList = () => {
  return (
    <Row>
      <Col>
        <Form formConfig={formConfig} />
      </Col>
    </Row>
  );
};
export default PurchaseorderDocumentList;