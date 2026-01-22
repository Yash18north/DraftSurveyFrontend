import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";

import formConfig from "../../formJsonData/Operations/jobinstructions/JrfInstruction_billing_details.json";
import Form from "../../components/common/Form";
import { getCommonTabsFroJI } from "../../components/common/commonHandlerFunction/jobinstructionHandlerFunctions";
import { useSelector } from "react-redux";

const JfInstructionNomination = () => {
  const [masterResponse, setMasterResponse] = useState([]);
  const session = useSelector((state) => state.session);
  const user = session.user;
  const tileHeader = getCommonTabsFroJI(user?.role)
  return (
    <Row className="rowWidthAdjust">
      <Col>
        <Form
          formConfig={formConfig}
          masterResponse={masterResponse}
          setMasterResponse={setMasterResponse}
          tileHeader={tileHeader}
        />
      </Col>
    </Row>
  );
};

export default JfInstructionNomination;
