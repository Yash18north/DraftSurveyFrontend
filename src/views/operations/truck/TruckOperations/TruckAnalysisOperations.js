import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";

import formConfig from "../../../../formJsonData/Operations/Vessel/VesseLOperations/TMLAnalysOperation.json";
import Form from "../../../../components/common/Form";
import { sampleMarkOptionsApi, sampleMarkOptionsLotWiseApi } from "../../../../services/api";
import { postDataFromApi } from "../../../../services/commonServices";
import commonFields from "../../../../formJsonData/Operations/commonFields.json";
import { decryptDataForURL } from "../../../../utills/useCryptoUtils";
import { useParams } from "react-router-dom";
import { getActivityCode, getLMSActivityHeaderTab, getRakeOperations, getSampleCollectionActivity, getTruckOperations } from "../../../../services/commonFunction";
import { getSampleMarkForDropdown } from "../../../../components/common/commonHandlerFunction/jobinstructionHandlerFunctions";
formConfig["sections"][0].fields = commonFields;
const TruckAnalysisOperations = () => {
  const [masterResponse, setMasterResponse] = useState([]);
  const [operationStepNo, setOperationStepNo] = useState(0);
  const [operationMode, setOperationMode] = useState("");
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
    

  });
  const tileSubHeaderQA = getLMSActivityHeaderTab(TMLType)
  const hash = window.location.hash;
  const params = new URLSearchParams(hash.split("?")[1]);
  let operationType = params.get('OperationType');
  operationType=decryptDataForURL(operationType)
  operationType = getActivityCode(operationType)
  operationType = operationType && operationType.toLowerCase() != "othertpi" ? operationType.toLowerCase() : operationType
  if (operationType == getRakeOperations('QA')) {
    formConfig['sections'][1]['tabs'][0].tileSubHeader = tileSubHeaderQA;
  }
  else if (operationType == getTruckOperations('DTM') || operationType == getTruckOperations("QS")) {
    formConfig['sections'][1]['tabs'][0].tileSubHeader = tileSubHeaderQA;
  }
  else  if (operationType == getTruckOperations("QS")) {
    formConfig['sections'][1]['tabs'][0].tileSubHeader = tileSubHeaderQA;
  }

  const getSampleIdsMasterData = async (ji_id, jis_id, context = "Lot") => {
    getSampleMarkForDropdown(ji_id, jis_id, context,setMasterResponse,masterResponse)
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
        />
      </Col>
    </Row>
  );
};

export default TruckAnalysisOperations;
