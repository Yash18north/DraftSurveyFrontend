import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";

import formConfig from "../../formJsonData/Operations/jobinstructions/JrfInstruction_nomination.json";
import Form from "../../components/common/Form";
import { getDataFromApi, postDataFromApi } from "../../services/commonServices";
import { getSalesPersonApi, MasterListApi } from "../../services/api";
import { getCommonTabsFroJI } from "../../components/common/commonHandlerFunction/jobinstructionHandlerFunctions";
import { useSelector } from "react-redux";
import commonFields from "../../formJsonData/Operations/commonFields.json";
const JfInstructionNomination = () => {
  const [masterResponse, setMasterResponse] = useState([]);
  const session = useSelector((state) => state.session);
  const user = session.user;
  const tileHeader = getCommonTabsFroJI(user?.role)
  let newConfig = JSON.parse(JSON.stringify(formConfig));
  if (user?.role != "OPS_ADMIN") {
    newConfig["sections"][0].fields = commonFields;
    newConfig["sections"][0].subSections = [];
    newConfig['sections'].push({
      "title": "Tabs Section",
      "styleName": "section_heading",
      "type": "tabs",
      "tabs": [{
        "label": "Nomination Details",
        "fields": [
          {
            "width": 25,
            "label": "Nomination Details",
            "styleName": "section_heading",
            "type": "label"
          },
          {
            "width": 6,
            "name": "ji_branch_name",
            "label": "Branch Name",
            "type": "label",
            "required": true,
            "value": "-"
          },
          {
            "width": 6,
            "name": "fk_userbranchheadid",
            "label": "Branch Head",
            "type": "label",
            "required": true,
            "value": "-"
          },
          {
            "width": 6,
            "name": "ji_branch_ex_name",
            "label": "Operation Executive",
            "type": "label",
            "required": true,
            "value": "-"
          },
          {
            "width": 6,
            "name": "ji_branch_ex_heade_name",
            "label": "Operation Executive (Head Office)",
            "type": "label",
            "required": true,
            "value": "-"
          },
          {
            "width": 6,
            "name": "ji_branch_sales_person",
            "label": "Sales Person",
            "type": "label",
            "required": true,
            "value": "-"
          },
          {
            "width": 6,
            "name": "ji_branch_captain_name",
            "label": "Branch Captain",
            "type": "label",
            "required": true,
            "value": "-"
          },
          {
            "width": 12,
            "label": "Billing Details",
            "styleName": "section_heading",
            "type": "label"
          },
          {
            "width": 6,
            "name": "ji_billing",
            "label": "Billing Details",
            "type": "label",
            "value": "-"
          }
        ]
      }]
    })
    newConfig['sections'][1]['tabs'][0].tileSubHeader = getCommonTabsFroJI();
  }
  else {
    newConfig["sections"][0].subSections[0].fields = commonFields;
  }
  useEffect(() => {
    if (user?.role != "OPS_ADMIN") {
      getSalesPersonDetailsData();
    }
  }, []);

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
        const bodyToPass2 = {
          model: "ji_branch_sales_person",
          data: clientData,
        };
        setMasterResponse((prev) => [...prev, bodyToPass, bodyToPass2]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Row className="rowWidthAdjust">
      <Col>
        <Form
          formConfig={newConfig}
          masterResponse={masterResponse}
          setMasterResponse={setMasterResponse}
          tileHeader={tileHeader}
        />
      </Col>
    </Row>
  );
};

export default JfInstructionNomination;
