import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";

import formConfig from "../../../../formJsonData/Operations/Vessel/VesseLOperations/TMLAnalysOperation.json";
import Form from "../../../../components/common/Form";
import { sampleMarkOptionsApi, sampleMarkOptionsLotWiseApi } from "../../../../services/api";
import { postDataFromApi } from "../../../../services/commonServices";
import { getActivityCode, getLMSActivityHeaderTab, getLMSOperationActivity, getSampleCollectionActivity, getVesselOperation } from "../../../../services/commonFunction"
import commonFields from "../../../../formJsonData/Operations/commonFields.json";
import { decryptDataForURL } from "../../../../utills/useCryptoUtils";
import { useParams } from "react-router-dom";
import { getSampleMarkForDropdown } from "../../../../components/common/commonHandlerFunction/jobinstructionHandlerFunctions";
formConfig["sections"][0].fields = commonFields;
const TMLAnalysisOperations = () => {
  const [masterResponse, setMasterResponse] = useState([]);
  const [operationStepNo, setOperationStepNo] = useState(0);
  const [operationMode, setOperationMode] = useState("");
  const [allSampleMarksData, setAllSampleMarksData] = useState([]);
  let { TMLType } = useParams();
  TMLType = TMLType ? decryptDataForURL(TMLType) : "";
  TMLType = getActivityCode(TMLType)
  TMLType = TMLType && TMLType.toLowerCase() != "othertpi" ? TMLType.toLowerCase() : TMLType
  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split("?")[1]);
    let stepNo = params.get("operationStepNo")
      ? params.get("operationStepNo")
      : "";
    stepNo = decryptDataForURL(stepNo);
    let opsMode = params.get("operationMode")
      ? params.get("operationMode")
      : "";
    opsMode = decryptDataForURL(opsMode);
    setOperationStepNo(stepNo);
    setOperationMode(opsMode);

    // formConfig['sections'][1]['tabs'][0].tileSubHeader = tileSubHeaderQA;

  });
  const hash = window.location.hash;
  const params = new URLSearchParams(hash.split("?")[1]);
  let operationType = params.get('OperationType');
  operationType = decryptDataForURL(operationType)
  operationType = getActivityCode(operationType)
  operationType = operationType && operationType.toLowerCase() != "othertpi" ? operationType.toLowerCase() : operationType
  const tileSubHeaderHH = [
    { Text: "H&H" }
  ]
  const tileSubHeaderSV = [
    { Text: "Supervision" },
    { Text: "Vessel Information" },
    { Text: "Other Details" },
    { Text: "Storage Details" },
    { Text: "Daily Moisture & Size" },
    { Text: "Discharge Details" },
  ]
  const tileSubHeaderDS = [
    // { Text: "Draft Survey" },
    // { Text: "Groups & Parameters" },
  ]
  let tileSubHeaderQA = getLMSActivityHeaderTab(operationType)
  if (operationType == getVesselOperation("HH")) {
    formConfig['sections'][1]['tabs'][0].tileSubHeader = tileSubHeaderHH;
  }
  else if (operationType == getVesselOperation("SV")) {
    formConfig['sections'][1]['tabs'][0].tileSubHeader = tileSubHeaderSV;

  }
  else if (operationType == getVesselOperation("DS")) {
    formConfig['sections'][1]['tabs'][0].tileSubHeader = tileSubHeaderDS;

  }
  else if (getLMSOperationActivity().includes(operationType)) {
    formConfig['sections'][1]['tabs'][0].tileSubHeader = tileSubHeaderQA;
  }

  const getSampleIdsMasterData = async (ji_id, jis_id, context = "Lot") => {
    getSampleMarkForDropdown(ji_id, jis_id, context,setMasterResponse,masterResponse,setAllSampleMarksData)
  };
  return (
    <Row className="rowWidthAdjust">
      <Col>
        <Form
          formConfig={formConfig}
          masterResponse={masterResponse}
          setMasterResponse={setMasterResponse}
          useForComponent={"OperationDetailsAssignment"}
          getSampleIdsMasterData={getSampleIdsMasterData}
          operationStepNo={operationStepNo}
          operationMode={operationMode}
          allSampleIds={allSampleMarksData}
        />
      </Col>
    </Row>
  );
};

export default TMLAnalysisOperations;
