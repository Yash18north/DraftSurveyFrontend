import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import formConfig from "../../../../formJsonData/Operations/Vessel/VesseLOperations/CommericialCertificateList.json";
import Form from "../../../../components/common/Form";
import searchConfigJson from "../../../../formJsonData/LMS/searchFilterFields.json";
import { useSelector } from "react-redux";
const OperationCertificateListing = () => {
  const session = useSelector((state) => state.session);
  const user = session.user;
  const [actualConfig,setActualConfig]=useState(formConfig)
  useEffect(()=>{
    let newConfig = JSON.parse(JSON.stringify(formConfig));
    // if(user?.role=="BU"){
    //   newConfig['sections'][1]['tabs'][0].listView.filterListing.splice(1,1)
    // }
    // else if(user?.role=="BH"){
    //   newConfig['sections'][1]['tabs'][0].listView.filterListing.splice(0,1)
    // }
    setActualConfig(newConfig)
  },[user?.role])
  return (
    <Row>
      <Col>
        <Form formConfig={actualConfig} searchConfigJson={searchConfigJson.commercialCertificateList} useForComponent="Operations"/>
      </Col>
    </Row>
  );
};

export default OperationCertificateListing;