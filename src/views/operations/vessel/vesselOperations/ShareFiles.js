import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";

import formConfig from "../../../../formJsonData/Operations/Vessel/VesseLOperations/ShareFiles.json";
import Form from "../../../../components/common/Form";
import { postDataFromApi } from "../../../../services/commonServices";
import { useSelector } from "react-redux";

const ShareFile = () => {
  const session = useSelector((state) => state.session);
  const [actualFormConfig, setActualFormConfig] = useState(formConfig)
  useEffect(() => {
    let newFormconfig = formConfig
    if (session?.shareFileModule === "invoice") {
      newFormconfig = {
        ...formConfig,
        breadcom: [
          {
            "title": "Invoice List",
            "redirect": "#"
          },
          {
            "title": "Share Files",
            "redirect": "#"
          }
        ]
      }
    }
    else {
      newFormconfig = formConfig
    }
    setActualFormConfig(newFormconfig)
  }, [session?.shareFileModule])


  return (
    <Row>
      <Col>
        <Form
          formConfig={actualFormConfig}
          isExternalJRF="1"
        />

      </Col>
    </Row>
  );
};
export default ShareFile;