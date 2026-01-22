import React from "react";
import { Row, Col } from "reactstrap";
import formConfigOp from "../../formJsonData/LMS/InwardCheckListWitOperaton.json";
import formConfig from "../../formJsonData/LMS/InwardCheckList.json";
import Form from "../../components/common/Form";
import PropTypes from "prop-types";

const InwardCheckListForm = ({isOperationJRF}) => {
  return (
    <Row>
      <Col>
        <Form formConfig={isOperationJRF ? formConfigOp : formConfig} />
      </Col>
    </Row>
  );
};
InwardCheckListForm.propTypes = {
  isOperationJRF: PropTypes.bool,
};

export default InwardCheckListForm;
