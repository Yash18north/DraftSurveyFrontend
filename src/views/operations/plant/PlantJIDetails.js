import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";

import formConfig from "../../../formJsonData/Operations/Plant/PlantList.json";
import Form from "../../../components/common/Form";
import { getDataFromApi, postDataFromApi } from "../../../services/commonServices";
import { getSalesPersonApi, MasterListApi } from "../../../services/api";
import commonFields from "../../../formJsonData/Operations/commonFields.json";
import { decryptDataForURL } from "../../../utills/useCryptoUtils";
formConfig['sections'][0].fields = commonFields
const PlantJIDetais = () => {
  const [masterResponse, setMasterResponse] = useState([]);
  const [isViewOnly, setIsViewOnly] = useState(false);
  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split("?")[1]);
    let useFor = params.get("useFor")
      ? params.get("useFor")
      : "";

    useFor = decryptDataForURL(useFor).toLowerCase()
    setIsViewOnly(useFor === "viewonly" ? true : false)
  }, []);

  const tileHeader = [
    // { Text: "Company & Commodity", leftSubTitle: "Step 1", rightSubTitle: "In Progress" },
  ]
  return (
    <Row className="rowWidthAdjust">
      <Col>
        <Form formConfig={formConfig} masterResponse={masterResponse} setMasterResponse={setMasterResponse} useForComponent={"OperationsJIDetails"}  isViewOnlyTable={isViewOnly} tileHeader={tileHeader} />
      </Col>
    </Row>
  );
};

export default PlantJIDetais;
