import React from "react";
import { Row, Col } from "reactstrap";
import formConfig from "./../../../../formJsonData/Operations/Vessel/VesseLOperations/OperationCertificateList.json";
import Form from "./../../../../components/common/Form";
import { getOperationActivityListPageUrl, getOperationNameByCode } from "../../../../services/commonFunction";
import { decryptDataForURL } from "../../../../utills/useCryptoUtils";
const OperationCertificateListing = () => {
  const hash = window.location.hash;
  const params = new URLSearchParams(hash.split("?")[1]);
  let opsMode = params.get("operationMode")
    ? params.get("operationMode")
    : "";
  opsMode = decryptDataForURL(opsMode);

  const opsLabel = getOperationNameByCode(opsMode) + " Operation"
  formConfig['breadcom'][0]['title'] = getOperationNameByCode(opsMode) + " List"
  formConfig['breadcom'][0]['redirect'] = '#'
  formConfig['breadcom'][1]['redirect'] = '#'
  formConfig['breadcom'][1]['title'] = opsLabel
  return (
    <Row>
      <Col>
        <Form formConfig={formConfig} />
      </Col>
    </Row>
  );
};

export default OperationCertificateListing;