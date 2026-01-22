import React from "react";
import { Row, Col } from "reactstrap";

import formConfig from "../../../../formJsonData/Operations/Vessel/VesseLOperations/OperationCertificate.json";
import Form from "../../../../components/common/Form";
import { postDataFromApi } from "../../../../services/commonServices";
import { getOperationActivityListPageUrl, getOperationNameByCode } from "../../../../services/commonFunction";

const OperationCertificate = ({ ops_code }) => {
  const opsLabel = getOperationNameByCode(ops_code) + " Operation"
  formConfig['breadcom'][1]['title'] = getOperationNameByCode(ops_code) + " List"
  formConfig['breadcom'][1]['redirect'] = '#'
  return (
    <Row>
      <Col>
        <Form
          formConfig={formConfig}
          isExternalJRF="1"
        />

      </Col>
    </Row>
  );
};
export default OperationCertificate;
