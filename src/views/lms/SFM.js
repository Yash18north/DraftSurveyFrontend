import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import formConfig from "../../formJsonData/LMS/SFM.json";

import Form from "../../components/common/Form";

const TestMemo = () => {
  const [testMemoId, setTestMemoId] = useState("");

  return (
    <Row>
      <Col>
        <Form
          formConfig={formConfig}
          testMemoId={testMemoId}
          setTestMemoId={setTestMemoId}
        />
      </Col>
    </Row>
  );
};

export default TestMemo;
