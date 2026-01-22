import React from "react";
import { Row, Col } from "reactstrap";
import formConfig from "../../formJsonData/Operations/OtherTPIList.json";
import searchConfigJson from "../../formJsonData/LMS/searchFilterFields.json";
import Form from "../../components/common/Form";
const OtherTPIList = () => {
  return (
    <Row>
      <Col>
        <Form
          formConfig={formConfig}
          searchConfigJson={searchConfigJson.OtherTPIList}
        />
      </Col>
    </Row>
  );
};

export default OtherTPIList;
