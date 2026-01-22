import React, { useEffect, useState} from "react";
import { Row, Col } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import formConfig from "../../../formJsonData/Operations/Vessel/VesselJIDetailsView.json";
import Form from "../../../components/common/Form";
import { getDataFromApi, postDataFromApi } from "../../../services/commonServices";
import { getSalesPersonApi, MasterListApi } from "../../../services/api";
import commonFields from "../../../formJsonData/Operations/commonFields.json";
import { decryptDataForURL } from "../../../utills/useCryptoUtils";
// import { getCommonTabsFroJI } from "../../../components/common/commonHandlerFunction/jobinstructionHandlerFunctions";
import { getSingleJiRecordForPreview } from "../../../components/common/commonHandlerFunction/jobinstructionHandlerFunctions";

formConfig['sections'][0].fields = commonFields
const VesselJIDetais = () => {
  const [masterResponse, setMasterResponse] = useState([]);
  const [isViewOnly, setIsViewOnly] = useState(false);
  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split("?")[1]);
    let useFor = params.get("useFor")
      ? params.get("useFor")
      : "";

    useFor = decryptDataForURL(useFor).toLowerCase()
    setIsViewOnly(useFor==="viewonly" ? true : false)
    // getBranchDetailsData();
    // getSalesPersonDetailsData();
  }, []);
  const tileHeader = []
  // const tileHeader = getCommonTabsFroJI()
  return (
    <Row className="rowWidthAdjust">
      <Col>
        <Form formConfig={formConfig} masterResponse={masterResponse} setMasterResponse={setMasterResponse} useForComponent={"OperationsJIDetails"} isViewOnlyTable={isViewOnly}  tileHeader={tileHeader}/>
      </Col>
    </Row>
  );
};

export default VesselJIDetais;
