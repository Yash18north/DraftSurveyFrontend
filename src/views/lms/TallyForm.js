import { Row, Col } from "reactstrap";
import formConfig from "../../formJsonData/LMS/TallyForm.json";
import Form from "../../components/common/Form";
import React,{ useState } from "react";

const InwardForm = () => {
  const [masterResponse, setMasterResponse] = useState([]);
  return (
    <Row>
      <Col>
        <Form formConfig={formConfig} setMasterResponse={setMasterResponse} masterResponse={masterResponse}/>
      </Col>
    </Row>
  );
};

export default InwardForm;
