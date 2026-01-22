import React, { useEffect, useRef, useState } from "react";
import { Row, Col } from "reactstrap";

import formConfig from "../../../../formJsonData/Operations/Vessel/VesseLOperations/TMLOperation.json";
import formConfig2 from "../../../../formJsonData/Operations/Vessel/VesseLOperations/TMLOperation.json";
import H_H_formConfig from "../../../../formJsonData/Operations/Vessel/VesseLOperations/H&HOperation.json";
// import OnlySeal_formConfig from "../../../../formJsonData/Operations/Vessel/VesseLOperations/OnlySealOperation.json";
import QuantityAssessment_formConfig from "../../../../formJsonData/Operations/Rake/RakeOperations/QuantityAssessmentOperation.json";
import supervission_formConfig from "../../../../formJsonData/Operations/Vessel/VesseLOperations/supervission.json";
import DraftSurvey_formConfig from "../../../../formJsonData/Operations/Vessel/VesseLOperations/DraftSurvey.json";
import ScopeWork_GroupParameters from "../../../../formJsonData/Operations/Vessel/VesseLOperations/ScopeWork_GroupParameters.json";
import sizeAnalysis_Details from "../../../../formJsonData/Operations/Vessel/VesseLOperations/sizeAnalysis_Details.json";
import sentToJRF_Details from "../../../../formJsonData/Operations/Vessel/VesseLOperations/sentToJRF_Detail.json";

import OnlySeal_formConfig from "../../../../formJsonData/Operations/Truck/TruckOperations/OnlySealOperation.json";
import CargoSupervision_formConfig from "../../../../formJsonData/Operations/Truck/TruckOperations/CargoSuperVisionOperation.json";

import Form from "../../../../components/common/Form";
import { sampleMarkOptionsApi } from "../../../../services/api";
import { postDataFromApi } from "../../../../services/commonServices";
import commonFields from "../../../../formJsonData/Operations/commonFields.json";
import commonFieldsRake from "../../../../formJsonData/Operations/commonFieldsRake.json";
import { useParams } from "react-router-dom";
import { decryptDataForURL } from "../../../../utills/useCryptoUtils";
import { getLMSOperationActivity, getRakeOperations, getTruckOperations, getPlantOperations, getActivityCode } from "../../../../services/commonFunction";

const TruckOperations = () => {
  let { TMLType } = useParams();
  TMLType = TMLType ? decryptDataForURL(TMLType) : "";
  TMLType = getActivityCode(TMLType)
  const [actualConfigData, setActualConfigData] = useState(formConfig);
  const countRef = useRef(0);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [operationStepNo, setOperationStepNo] = useState(0);
  const [operationMode, setOperationMode] = useState("");
  const tileSubHeaderQAss = [{ Text: "Quantity Assessment" }];
  const tileSubHeaderOnlySeal = [{ Text: "Only Seal" }];
  const tileSubHeadercargoSupervision = [{ Text: "Cargo Supervision" }];
  const tileSubHeaderQA = [
    { Text: "Sample Information" },
    { Text: "Groups & Parameters" },
    { Text: "Assign Parameters" },
    { Text: "Size Analysis" },
    { Text: "Send to JRF / Oth. TPI" },
  ];

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split("?")[1]);
    let useFor = params.get("useFor") ? params.get("useFor") : "";

    useFor = decryptDataForURL(useFor).toLowerCase();
    setIsViewOnly(useFor === "viewonly" ? true : false);

    useFor = decryptDataForURL(useFor).toLowerCase();
    let stepNo = params.get("operationStepNo")
      ? params.get("operationStepNo")
      : "";
    stepNo = decryptDataForURL(stepNo);
    stepNo = parseInt(stepNo);
    let opsMode = params.get("operationMode")
      ? params.get("operationMode")
      : "";
    opsMode = decryptDataForURL(opsMode);
    setOperationStepNo(stepNo);
    setOperationMode(opsMode);
    setIsViewOnly(useFor === "viewonly" ? true : false);
    let newConfig = JSON.parse(JSON.stringify(formConfig2));
    newConfig["sections"][0].subSections.push({
      fields: commonFields
    });

    if (TMLType === getPlantOperations("RK")) {
      newConfig["sections"][0].subSections.push({
        fields: commonFieldsRake
      });
    }

    // newConfig["sections"][0].fields = commonFields;
    if (stepNo == 1) {
      newConfig["sections"][1] = ScopeWork_GroupParameters;
    } else if (stepNo == 4) {
      newConfig["sections"][1] = sizeAnalysis_Details;
    }
    if (TMLType == getRakeOperations('QAss')) {
      newConfig["sections"][1] = QuantityAssessment_formConfig;
      newConfig["sections"][1]["tabs"][0].tileSubHeader = tileSubHeaderQAss;
    }
    else if ([getPlantOperations("TR"), getPlantOperations("RK"), getPlantOperations("ST")].includes(TMLType)) {
      newConfig["sections"][1]["tabs"][0].tileSubHeader = tileSubHeaderQA;
    }
    else if (TMLType == getTruckOperations("OS")) {
      newConfig["sections"][1] = OnlySeal_formConfig;
      newConfig["sections"][1]["tabs"][0].tileSubHeader = tileSubHeaderOnlySeal;
    }
    else if (TMLType == getTruckOperations("CS")) {
      newConfig["sections"][1] = CargoSupervision_formConfig;
      newConfig["sections"][1]["tabs"][0].tileSubHeader = tileSubHeadercargoSupervision;
    }
    else {
      if (useFor === "viewonly") {
        newConfig["sections"][1]["tabs"][1] = {
          label: "Job Description",
          type: "tablePreview",
          moduleType: "VesselListOperationAssignment",
          isViewOnly: "View",
          headers: [
            {
              label: "Samples",
              name: "samples",
              type: "label",
              required: true,
            },
            {
              label: "Type",
              name: "samples",
              type: "label",
              required: true,
            },
            {
              label: "Groups of Parameter",
              name: "Groups",
              type: "select",

              required: true,
              options: ["ASTM", "IS", "ISO"],
              placeholder: "Enter Parameter",
            },
            {
              label: "Test Method",
              name: "test_method",
              type: "select",
              required: true,
              options: ["ASTM", "IS", "ISO"],
              placeholder: "Enter Parameter",
            },
            {
              label: "Basis",
              name: "test_method",
              type: "select",
              required: true,
              options: ["ASTM", "IS", "ISO"],
              placeholder: "Enter Parameter",
            },
          ],
          rows: [
            [
              {
                width: 8,
                name: "is_group_param",
                subname: "isGroup",
                type: "radio",
                options: ["Group", "Parameter"],

                required: true,
                readOnly: true,
                fieldWidth: "100",
                placeholder: "1633",

                multiple: true,
              },

              {
                width: 8,

                name: "smpl_set_paramjson",
                subname: "param_name",
                type: "select",
                options: [],
                required: true,
                fieldWidth: 100,
              },
              {
                width: 8,

                name: "smpl_set_groupjson",
                subname: "group_id",
                type: "select",
                options: [],
                required: true,
                fieldWidth: 100,
              },
              {
                width: 8,
                name: "smpl_set_testmethodjson",
                subname: "std_name",
                type: "select",
                options: [],
                required: true,
                fieldWidth: 100,
                errorlabel: "Test Method",
              },
              {
                width: 8,
                name: "smpl_set_basisjson",
                subname: "basis",
                type: "select",
                options: [],
                required: true,
                fieldWidth: 100,
                multiple: true,
                errorlabel: "Basis",
              },
            ],
          ],
          actions: [
            {
              label: "bi bi-pencil h6",
              value: "Edit",
              type: "icon",
              redirectUrl: "/inwardList/inwardForm",
              permission: "update",
            },
            {
              label: "bi bi-trash h6",
              value: "Delete",
              type: "icon",
              redirectUrl: "/inwardList/inwardForm",
              permission: "delete",
            },
            {
              label: "bi bi-clock-history h6",
              value: "History",
              type: "icon",
              permission: "history",
            },
          ],
        };
      }
    }
    if (![1, 4].includes(stepNo)) {
      if (
        getLMSOperationActivity().includes(TMLType)
      ) {
        if (countRef.current === 0) {
          newConfig["sections"][1]["tabs"][0] = addFieldsinconfig(
            newConfig["sections"][1]["tabs"][0]
          );
          countRef.current = 1;
        }
      }
    }

    setActualConfigData(newConfig);
    return () => {
      // Cleanup: reset count and state when component unmounts
      countRef.current = 0;
      setActualConfigData(formConfig); // Reset to initial form config
    };
  }, [TMLType]);

  const addFieldsinconfig = (array) => {
    let headerfieldValue;
    let tabFields;

    // if (TMLType === "Pre-Shipment (PSI)") {
    headerfieldValue = {
      name: "jism_lot_no",
      type: "text",
      label: "Lot Wise",
    };
    tabFields = {
      name: "jism_lot_no",
      type: "text",
      label: "Lot Wise",
    };
    array.headers = [headerfieldValue, ...array.headers];
    array.rows[0] = [tabFields, ...array.rows[0]];
    // }
    headerfieldValue = {
      name: "jism_is_composite",
      type: "radio",
      label: "Is Composite or Lot",
    };
    tabFields = {
      name: "jism_is_composite",
      type: "radio",
      label: "Is Composite or Lot",
      options: ["Composite", "Lot"],
    };
    const filterdata = array.rows[0].filter(
      (field) => field.name === "jism_is_composite"
    );
    if (filterdata.length === 0) {
      array.headers = [headerfieldValue, ...array.headers];
      array.rows[0] = [tabFields, ...array.rows[0]];
    }
    return array;
  };
  const [masterResponse, setMasterResponse] = useState([]);
  const getSampleIdsMasterData = async (sampleId) => {
    try {
      let tempBody = {
        jism_id: sampleId,
      };
      let res = await postDataFromApi(sampleMarkOptionsApi, tempBody);
      if (res.data && res.data.status === 200 && res.data.data) {
        const transformedData = res.data.data.sample_marks.map((value) => ({
          id: value,
          name: value,
        }));
        const bodyToPass = {
          model: "smpl_set_smpljson",
          data: transformedData,
        };
        let isExists = false;
        let filterData = masterResponse.filter((model) => {
          if (model.model === "smpl_set_smpljson") {
            model.data = transformedData;
            isExists = true;
          }
          return true;
        });
        if (isExists) {
          setMasterResponse(filterData);
        } else {
          setMasterResponse((prev) => [...prev, bodyToPass]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Row className="rowWidthAdjust">
      <Col>
        <Form
          formConfig={actualConfigData}
          masterResponse={masterResponse}
          setMasterResponse={setMasterResponse}
          useForComponent={"OperationDetails"}
          getSampleIdsMasterData={getSampleIdsMasterData}
          isViewOnlyTable={isViewOnly}
          operationStepNo={operationStepNo}
          operationMode={operationMode}
        />
      </Col>
    </Row>
  );
};

export default TruckOperations;
