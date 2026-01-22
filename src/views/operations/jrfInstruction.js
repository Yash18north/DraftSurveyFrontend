import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";

import formConfig from "../../formJsonData/Operations/jobinstructions/JrfInstruction.json";
import Form from "../../components/common/Form";
import { getDataFromApi, postDataFromApi } from "../../services/commonServices";
import { getClientListDataApi, getPlaceDataApi, getSubplierDataApi, MasterListApi } from "../../services/api";
import { getCommonTabsFroJI, getCompanyData, getOpeartionType } from "../../components/common/commonHandlerFunction/jobinstructionHandlerFunctions";
import { useSelector } from "react-redux";
import commonFields from "../../formJsonData/Operations/commonFields.json";
import { useParams } from "react-router-dom";
import { getMonthOptions } from "../../services/commonFunction";
const JrfInstruction = () => {
  let {
    EditRecordId
  } = useParams();
  const [masterResponse, setMasterResponse] = useState([]);
  const [configJson, setConfigJson] = useState('');
  const [isMainJiSaved, setMainJISaved] = useState(false);
  const session = useSelector((state) => state.session);
  const user = session.user;
  const tileHeader = getCommonTabsFroJI(user?.role)
  const OPSExceutiveEditField = [{
    "width": 6,
    "name": "ji_is_supplier",
    "label": "Supplier / Buyer",
    "type": "radio",
    "options": [
      "Supplier",
      "Buyer"
    ],
    "placeholder": "Supplier / Buyer",
    "defaultValue": "Supplier",
    "secondType": "text"
  },
  {
    "width": 6,
    "name": "fk_supplierid",
    "label": "Supplier / Buyer",
    "placeholder": "Enter  Supplier / Buyer",
    "type": "DropDownWithLoadMore",
    "apiendpoint": "/masters/supplier/list/",
    "model_name": "",
    "apimethod": "GET",
    "isSearchable": true,
    "optionData": {
      "id": "supl_id",
      "label": "supl_name"
    }
  },
  {
    "width": 6,
    "name": "ji_is_loading",
    "label": "Loading / Unloading",
    "type": "radio",
    "options": [
      "Loading",
      "Unloading"
    ],
    "defaultValue": "Loading"
  },
  {
    "width": 4,
    "labelWidth": "50%",
    "name": "fk_loading_unloading_country",
    "placeholder": "Select",
    "label": "Loading Port and Country",
    "type": "DropDownWithLoadMore",
    "apiendpoint": "/masters/list",
    "model_name": "country",
    "apimethod": "POST",
    "isSearchable": true,
    "optionData": {
      "id": "country_id",
      "label": "country_name"
    }
  }, {
    "width": 2,
    "name": "fk_loading_unloading_port",
    "label": "",
    "type": "DropDownWithLoadMore",
    "apiendpoint": "/countrywise-port/get/",
    "apimethod": "POST",
    "isSearchable": "true",
    "optionData": {
      "id": "port_id",
      "label": "port_name"
    },
    "customPayload": {
      "name": "country_id",
      "value": "fk_loading_unloading_country"
    },
    "isCustomPayload": true,
    "options": []
  }]
  useEffect(() => {
    if (configJson && !isMainJiSaved && user?.role === "OPS_ADMIN") {
      getCompanyData(setMasterResponse);
      getOpeartionType(setMasterResponse)
    }
    getMonthOptions(setMasterResponse,'ji_month_name')
  }, [configJson]);

  useEffect(() => {
    let newConfig = JSON.parse(JSON.stringify(formConfig));
    const isMainScopeWork = session?.isMainScopeWork;

    if (isMainJiSaved || user?.role != "OPS_ADMIN") {

      newConfig["sections"][0].fields = commonFields.filter((singleField) => {
        if (user?.role != "OPS_ADMIN") {
          singleField.readOnly = false;
        }
        return singleField
      });
      if (user?.role != "OPS_ADMIN") {
        OPSExceutiveEditField.map((field) => {
          newConfig["sections"][0].fields.push(field)
        })
      }
      newConfig["sections"][0].subSections = [];
      newConfig["sections"][0].isMainPage = false;
    }
    if (user?.role != "OPS_ADMIN") {
      newConfig['sections'][1]['tabs'][0].tileSubHeader = getCommonTabsFroJI();
      if (!isMainJiSaved) {
        setMainJISaved(true)
      }
    }

    // else if(localStorage.getItem('isMainScopeWork') && !isMainJiSaved){
    else if (isMainScopeWork && !isMainJiSaved) {
      setMainJISaved(true)
    }
    setConfigJson(newConfig)
  }, [isMainJiSaved])
  return configJson && (
    <Row className="rowWidthAdjust">
      <Col>
        <Form formConfig={configJson} masterResponse={masterResponse} setMasterResponse={setMasterResponse} tileHeader={tileHeader} setMainJISaved={setMainJISaved} isMainJiSaved={isMainJiSaved} />
      </Col>
    </Row>
  );
};

export default JrfInstruction;
