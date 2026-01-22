import React, { useEffect, useRef, useState } from "react";
import { Row, Col } from "reactstrap";

import ManPowerConfig from "../../formJsonData/Operations/jobinstructions/ManPower.json";
import Form from "../../components/common/Form";
import commonFields from "../../formJsonData/Operations/commonFields.json";
const JIManPower = () => {
    let newConfig = JSON.parse(JSON.stringify(ManPowerConfig));
  newConfig["sections"][0].fields = commonFields;
  const [masterResponse, setMasterResponse] = useState([]);
  return (
    <Row className="rowWidthAdjust">
      <Col>
        <Form
          formConfig={newConfig}
          masterResponse={masterResponse}
          setMasterResponse={setMasterResponse}
        />
      </Col>
    </Row>
  );
};

export default JIManPower;
