import React from "react";
import { Row, Col } from "reactstrap";
import formConfig from "../../../formJsonData/Operations/Truck/TruckList.json";
import searchConfigJson from "../../../formJsonData/LMS/searchFilterFields.json";
import Form from "../../../components/common/Form";

import commonFields from "../../../formJsonData/Operations/commonFields.json";
formConfig['sections'][0].fields = commonFields
const TruckList = () => {
  return (
    <Row>
      <Col>
        <Form formConfig={formConfig} searchConfigJson={searchConfigJson.truckList} useForComponent="OperationsList" />
      </Col>
    </Row>
  );
};

export default TruckList;
