import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import formConfig from "../../../formJsonData/Operations/Vessel/OtherTPIOperation.json";
import Form from "../../../components/common/Form";
import commonFields from "../../../formJsonData/Operations/commonFields.json";
formConfig['sections'][0].fields=commonFields

const OtherTPIOperation = () => {

  return (
    <Row>
      <Col>
        <Form
          formConfig={formConfig}
          useForComponent={"OperationDetailsOtherTPI"}
        />
      </Col>
    </Row>
  );
};

export default OtherTPIOperation;
