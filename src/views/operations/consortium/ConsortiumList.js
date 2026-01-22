import React from "react";
import { Row, Col } from "reactstrap";
import formConfig from "../../../formJsonData/Operations/Consortium/ConsortiumList.json";
import searchConfigJson from "../../../formJsonData/LMS/searchFilterFields.json";
import Form from "../../../components/common/Form";
const ConsortiumList = () => {
  return (
    <Row>
      <Col>
        <Form
          formConfig={formConfig}
          searchConfigJson={searchConfigJson.ConsortiumList}
        />
      </Col>
    </Row>
  );
};

export default ConsortiumList;
