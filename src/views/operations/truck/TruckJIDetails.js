import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";

import formConfig from "../../../formJsonData/Operations/Vessel/VesselJIDetails.json";
import Form from "../../../components/common/Form";
import { getDataFromApi, postDataFromApi } from "../../../services/commonServices";
import { getSalesPersonApi, MasterListApi } from "../../../services/api";
import commonFields from "../../../formJsonData/Operations/commonFields.json";
import { decryptDataForURL } from "../../../utills/useCryptoUtils";
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
  const getBranchDetailsData = async () => {
    try {
      let res = await postDataFromApi(MasterListApi, { is_dropdown: true, model_name: "branch" });
      if (res?.data?.status === 200 && res.data.data) {
        const clientData = res.data.data.map((client) => ({
          id: client[0],
          name: client[1],
        }));

        const bodyToPass = {
          model: "fk_branchid",
          data: clientData,
        };
        setMasterResponse((prev) => [...prev, bodyToPass]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getSalesPersonDetailsData = async () => {
    try {
      let res = await getDataFromApi(getSalesPersonApi);
      if (res?.data?.status === 200 && res.data.data) {
        const clientData = res.data.data.map((client) => ({
          id: client.usr_id,
          name: client.full_name,
        }));
        const bodyToPass = {
          model: "fk_usersalespersonid",
          data: clientData,
        };
        setMasterResponse((prev) => [...prev, bodyToPass]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const tileHeader = [{ Text: "Company & Commodity", leftSubTitle: "Step 1", rightSubTitle: "In Progress" },
    { Text: "Scope of Work", leftSubTitle: "Step 2", rightSubTitle: "In Progress" },
    { Text: "Groups & Parameters", leftSubTitle: "Step 3", rightSubTitle: "In Progress" },
    { Text: "Nominations Details", leftSubTitle: "Step 4", rightSubTitle: "In Progress" }
    ]
  return (
    <Row className="rowWidthAdjust">
      <Col>
        <Form formConfig={formConfig} masterResponse={masterResponse} setMasterResponse={setMasterResponse} useForComponent={"OperationsJIDetails"} isViewOnlyTable={isViewOnly}  tileHeader={tileHeader}/>
      </Col>
    </Row>
  );
};

export default VesselJIDetais;
