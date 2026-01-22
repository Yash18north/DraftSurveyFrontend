import React from 'react'
import { Row, Col } from "reactstrap";
import formConfig from "../../formJsonData/LMS/SFMList.json";
import Form from '../../components/common/Form';
import searchConfigJson from "../../formJsonData/LMS/searchFilterFields.json";
const SFM = () => {

  return (
    <Row>
      <Col>
        <Form formConfig={formConfig} searchConfigJson={searchConfigJson.SFMList}/>
      </Col>
    </Row>
  )
}

export default SFM