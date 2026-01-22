import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import formConfig from "../../formJsonData/LMS/SampleVerification.json";
import Form from "../../components/common/Form";
import { postDataFromApi } from "../../services/commonServices";
import { geChemistUserApi } from "../../services/api";
import { decryptDataForURL } from "../../utills/useCryptoUtils";

const InwardForm = () => {
  const [masterResponse, setMasterResponse] = useState([]);
  const [testMemoId, setTestMemoId] = useState('')
  const hash = window.location.hash;
  const params = new URLSearchParams(hash.split("?")[1]);
  const view = decryptDataForURL(params.get("view"));
  useEffect(() => {
    if (view != "view") {
      getChemistUsersMaster();
    }
  }, []);
  const getChemistUsersMaster = async () => {
    try {
      let tempBody = {};
      let res = await postDataFromApi(geChemistUserApi, tempBody);
      if (res.data && res.data.status === 200 && res.data.data) {
        const transformedData = res.data.data.map((value) => ({
          id: value.usr_id,
          name: value.full_name,
        }));
        const bodyToPass = {
          model: "sv_verifiedby",
          data: transformedData,
        };
        setMasterResponse((prev) => [...prev, bodyToPass]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Row>
      <Col>
        <Form formConfig={formConfig} setMasterResponse={setMasterResponse} masterResponse={masterResponse} setTestMemoId={setTestMemoId} testMemoId={testMemoId} />
      </Col>
    </Row>
  );
};

export default InwardForm;
