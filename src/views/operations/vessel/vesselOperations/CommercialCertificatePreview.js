import React from "react";
import { Row, Col } from "reactstrap";
import formConfig from "../../../../formJsonData/Operations/Vessel/VesseLOperations/CommericialCertificatePreview.json";
import Form from "../../../../components/common/Form";
import Preview from "../../../../components/common/elements/Preview";
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