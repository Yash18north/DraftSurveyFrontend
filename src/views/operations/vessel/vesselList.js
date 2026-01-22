import React, {  useState } from "react";
import { Row, Col } from "reactstrap";

import formConfig from "../../../formJsonData/Operations/Vessel/VesselList.json";
import Form from "../../../components/common/Form";

import commonFields from "../../../formJsonData/Operations/commonFields.json";
formConfig['sections'][0].fields = commonFields
const VesselDetails = () => {
  const [masterResponse, setMasterResponse] = useState([]);


  return (
    <Row className="rowWidthAdjust">
      <Col>
        <Form formConfig={formConfig} masterResponse={masterResponse} setMasterResponse={setMasterResponse} useForComponent="OperationsList" />
      </Col>
    </Row>
  );
};

export default VesselDetails;
