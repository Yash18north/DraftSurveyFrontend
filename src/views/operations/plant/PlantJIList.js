import React from "react";
import { Row, Col } from "reactstrap";
import formConfig from "../../../formJsonData/Operations/Plant/PlantJIListing.json";
import searchConfigJson from "../../../formJsonData/LMS/searchFilterFields.json";
import Form from "../../../components/common/Form";
const PlantJIList = () => {
  return (
    <Row>
      <Col>
        <Form formConfig={formConfig} searchConfigJson={searchConfigJson.jobinstructionList} useForComponent="Operations" />
      </Col>
    </Row>
  );
};

export default PlantJIList;
