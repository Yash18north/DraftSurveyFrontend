import React from "react";
import { Row, Col } from "reactstrap";
import formConfig from "../../../../formJsonData/Operations/Vessel/VesseLOperations/JICommericialCertificateList.json";
import Form from "../../../../components/common/Form";
import commonFields from "../../../../formJsonData/Operations/commonFields.json";
formConfig['sections'][0].fields = commonFields;
const OperationCertificateListing = () => {
  return (
    <Row>
      <Col>
        <Form formConfig={formConfig} />
      </Col>
    </Row>
  );
};
export default OperationCertificateListing;