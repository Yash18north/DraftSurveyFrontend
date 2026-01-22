import React from 'react'
import { Row, Col } from "reactstrap";
import formConfig from "../../formJsonData/LMS/TestMemoList.json";
import Form from '../../components/common/Form';
import searchConfigJson from "../../formJsonData/LMS/searchFilterFields.json";
const TestMemo = () => {

  return (
    <Row>
      <Col>
        <Form formConfig={formConfig} searchConfigJson={searchConfigJson.testMemoList}/>
      </Col>
    </Row>
  )
}

export default TestMemo