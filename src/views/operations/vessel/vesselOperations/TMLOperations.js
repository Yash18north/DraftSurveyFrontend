import React, { useEffect, useRef, useState } from "react";
import { Row, Col } from "reactstrap";

import formConfig from "../../../../formJsonData/Operations/Vessel/VesseLOperations/TMLOperation.json";
import formConfig2 from "../../../../formJsonData/Operations/Vessel/VesseLOperations/TMLOperation.json";
import H_H_formConfig from "../../../../formJsonData/Operations/Vessel/VesseLOperations/H&HOperation.json";
import OnlySeal_formConfig from "../../../../formJsonData/Operations/Vessel/VesseLOperations/OnlySealOperation.json";
// import QuantityAssessment_formConfig from "../../../../formJsonData/Operations/Vessel/VesseLOperations/QuantityAssessmentOperation.json";
import supervission_formConfig from "../../../../formJsonData/Operations/Vessel/VesseLOperations/supervission.json";
import DraftSurvey_formConfig from "../../../../formJsonData/Operations/Vessel/VesseLOperations/DraftSurvey.json";
import ScopeWork_GroupParameters from "../../../../formJsonData/Operations/Vessel/VesseLOperations/ScopeWork_GroupParameters.json";
import sizeAnalysis_Details from "../../../../formJsonData/Operations/Vessel/VesseLOperations/sizeAnalysis_Details.json";
import sample_collection from "../../../../formJsonData/Operations/Vessel/VesseLOperations/sample_collection.json";
import sentToJRF_Details from "../../../../formJsonData/Operations/Vessel/VesseLOperations/sentToJRF_Detail.json";
import CargoSupervision_formConfig from "../../../../formJsonData/Operations/Truck/TruckOperations/CargoSuperVisionOperation.json";

import Form from "../../../../components/common/Form";
import { sampleMarkOptionsApi } from "../../../../services/api";
import { postDataFromApi } from "../../../../services/commonServices";
import commonFields from "../../../../formJsonData/Operations/commonFields.json";
import DraftSurveyMainSection from "../../../../formJsonData/Operations/DraftSurveyMainSection.json";
import { useParams } from "react-router-dom";
import { decryptDataForURL } from "../../../../utills/useCryptoUtils";
import { getLMSOperationActivity, getVesselOperation, getTruckOperations,getSampleCollectionActivity,getLMSActivityHeaderTab,getActivityCode } from "../../../../services/commonFunction";
import { toast, ToastContainer } from "react-toastify";
import BulkCargoSupevission from "../../../../formJsonData/Operations/Vessel/VesseLOperations/BulkCargoSupevission.json";
const TMLOperations = () => {
  let { TMLType } = useParams();
  TMLType = TMLType ? decryptDataForURL(TMLType) : "";
  TMLType = getActivityCode(TMLType)
  const ActualTMLType = TMLType
  TMLType = TMLType && TMLType.toLowerCase() != "othertpi" ? TMLType.toLowerCase() : TMLType
  const [actualConfigData, setActualConfigData] = useState(formConfig);
  const countRef = useRef(0);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [isTabOpened, setIsTabOpened] = useState(false);
  const [operationStepNo, setOperationStepNo] = useState(0);
  const [operationMode, setOperationMode] = useState("");
  const tileSubHeaderHH = [{ Text: "H&H" }];
  const tileSubHeadercargoSupervision = [{ Text: "Cargo Supervision" }];
  const tileSubHeaderDS = [
    // { Text: "Draft Survey" },
    // { Text: "Groups & Parameters" },
  ];
  let tileSubHeaderQA = getLMSActivityHeaderTab(TMLType)
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
    newConfig["sections"][0].fields = commonFields;
    if (stepNo == 1) {
      newConfig["sections"][1] = ScopeWork_GroupParameters;
    } else if (stepNo == 4) {
      newConfig["sections"][1] = sizeAnalysis_Details;
    }
    else if (stepNo == 6) {
      newConfig["sections"][1] = sample_collection;
    }
    if (TMLType == getVesselOperation("HH")) {
      newConfig["sections"][1] = H_H_formConfig;
      newConfig["sections"][1]["tabs"][0].tileSubHeader = tileSubHeaderHH;
    } else if (TMLType == getVesselOperation("SV")) {
      newConfig["sections"][1] = supervission_formConfig;
      // newConfig['sections'][1]['tabs'][0].tileSubHeader = tileSubHeaderSV;
    }
    else if (TMLType == getVesselOperation("DS")) {
      newConfig["sections"][0].subSections = [{ fields: [] }, { fields: [] }];
      newConfig["sections"][0].subSections[0].fields = commonFields;
      newConfig["sections"][0].subSections[1].fields = DraftSurveyMainSection;
      newConfig["sections"][1] = DraftSurvey_formConfig;
      newConfig["sections"][1]["tabs"][0].tileSubHeader = tileSubHeaderDS;
    }

    else if (TMLType == getTruckOperations("CS")) {
      newConfig["sections"][1] = CargoSupervision_formConfig;
      newConfig["sections"][1]["tabs"][0].tileSubHeader = tileSubHeadercargoSupervision;
    }
    else if (TMLType == getVesselOperation("bulk_crg")) {
      newConfig["sections"][1] = BulkCargoSupevission;
    }
    else if (TMLType == getVesselOperation("DM")) {
      newConfig["sections"][1] = sizeAnalysis_Details;
      newConfig["sections"][1]["tabs"][0].tileSubHeader = [{ Text: "Daily Moisture" }];
    }
    else if (getLMSOperationActivity().includes(TMLType)) {
      newConfig["sections"][1]["tabs"][0].tileSubHeader = tileSubHeaderQA;
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
      else {
        // newConfig["sections"].splice(1,1)
        // setIsViewOnly(true)
        // toast.error("No any form available for this activity", {
        //   position: "top-right",
        //   autoClose: 2000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        //   theme: "light",
        //   containerId: 'A'
        // });
      }
    }

    // else if (stepNo == 5) {
    //   newConfig["sections"][1] = sentToJRF_Details;
    // }
    if (TMLType !== getVesselOperation("SV")) {
      if (newConfig["sections"]?.[1]) {
        let tabTitle = newConfig["sections"][1]["tabs"][0].label;
        // newConfig["sections"][1]["tabs"][0].label = ActualTMLType || tabTitle;
        newConfig["sections"][1]["tabs"][0].label = tabTitle;
      }
    }
    if (![1, 4, 6].includes(stepNo)) {
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
      options: ["Composite", "Lot", "Singular Composite"],
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
      {/* <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        containerId="A"
      /> */}
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
          setIsTabOpened={setIsTabOpened}
          isTabOpened={isTabOpened}
        />
      </Col>
    </Row>
  );
};

export default TMLOperations;
