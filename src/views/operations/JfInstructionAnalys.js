import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";

import formConfig from "../../formJsonData/Operations/jobinstructions/JrfInstruction_analys.json";
import Form from "../../components/common/Form";
import { postDataFromApi } from "../../services/commonServices";
import { MasterListApi } from "../../services/api";
import { getCommonTabsFroJI } from "../../components/common/commonHandlerFunction/jobinstructionHandlerFunctions";
import { useSelector } from "react-redux";
import commonFields from "../../formJsonData/Operations/commonFields.json";
const JfInstructionAnalys = () => {
  const [masterResponse, setMasterResponse] = useState([]);
  const session = useSelector((state) => state.session);
  const user = session.user;
  const tileHeader = getCommonTabsFroJI(user?.role)
  let newConfig = JSON.parse(JSON.stringify(formConfig));
  if (user?.role != "OPS_ADMIN") {
    newConfig["sections"][0].fields = commonFields;
    newConfig["sections"][0].subSections = [];
    newConfig['sections'][1]['tabs'][0].tileSubHeader = getCommonTabsFroJI();
  }
  else{
    newConfig["sections"][0].subSections[0].fields = commonFields;
  }
  useEffect(() => {
    // geStandardMethodMasterData()
  }, [])

  // const geStandardMethodMasterData = async () => {
  //   try {
  //     let tempBody = {
  //       model_name: "standard_type",
  //       is_dropdown: true,
  //     };
  //     let res = await postDataFromApi(MasterListApi, tempBody);
  //     if (res?.data?.status === 200 && res.data.data) {
  //       const transformedData = res.data.data.map((labDetail) => ({
  //         id: labDetail[1] ? labDetail[1] : "",
  //         name: labDetail[1] ? labDetail[1] : "",
  //       }));

  //       const bodyToPass = {
  //         model: "ji_sampling_methods",
  //         data: transformedData,
  //       };

  //       setMasterResponse((prev) => [...prev, bodyToPass]);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  return (
    <Row className="rowWidthAdjust">
      <Col>
        <Form formConfig={newConfig} masterResponse={masterResponse} setMasterResponse={setMasterResponse} tileHeader={tileHeader} />
      </Col>
    </Row>
  );
};

export default JfInstructionAnalys;
