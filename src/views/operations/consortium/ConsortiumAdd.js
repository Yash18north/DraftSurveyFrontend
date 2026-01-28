import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";

import formConfig from "../../../formJsonData/Operations/Consortium/ConsortiumAdd.json";
import Form from "../../../components/common/Form";
const ConsortiumAdd = () => {
  const [masterResponse, setMasterResponse] = useState([]);
  return (
    <Row className="rowWidthAdjust">
      <Col>
        <Form formConfig={formConfig} masterResponse={masterResponse} setMasterResponse={setMasterResponse}/>
      </Col>
    </Row>
  );
};

export default ConsortiumAdd;
