import React, {  useState } from "react";
import { Row, Col } from "reactstrap";

import formConfig from "../../../formJsonData/Operations/Rake/RakeList.json";
import Form from "../../../components/common/Form";
import searchConfigJson from "../../../formJsonData/LMS/searchFilterFields.json";


import commonFields from "../../../formJsonData/Operations/commonFields.json";
formConfig['sections'][0].fields = commonFields
const RakeList = () => {
  const [masterResponse, setMasterResponse] = useState([]);


  return (
    <Row className="rowWidthAdjust">
      <Col>
        <Form formConfig={formConfig} masterResponse={masterResponse} setMasterResponse={setMasterResponse} useForComponent="OperationsList" searchConfigJson={searchConfigJson.truckList} />
      </Col>
    </Row>
  );
};

export default RakeList;
