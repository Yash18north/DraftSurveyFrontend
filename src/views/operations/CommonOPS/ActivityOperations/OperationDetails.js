import React, { useEffect, useRef, useState } from "react";
import { Row, Col } from "reactstrap";

import formConfig from "../../../../formJsonData/Operations/Vessel/VesseLOperations/TMLOperation.json";
import formConfig2 from "../../../../formJsonData/Operations/Vessel/VesseLOperations/TMLOperation.json";
import H_H_formConfig from "../../../../formJsonData/Operations/Vessel/VesseLOperations/H&HOperation.json";
import StackSupervission from "../../../../formJsonData/Operations/Vessel/VesseLOperations/StackSupervission.json";
import RakeSupervission from "../../../../formJsonData/Operations/Vessel/VesseLOperations/RakeSupervission.json";
import supervission_formConfig from "../../../../formJsonData/Operations/Vessel/VesseLOperations/supervission.json";
import DraftSurvey_formConfig from "../../../../formJsonData/Operations/Vessel/VesseLOperations/DraftSurvey.json";
import ScopeWork_GroupParameters from "../../../../formJsonData/Operations/Vessel/VesseLOperations/ScopeWork_GroupParameters.json";
import sizeAnalysis_Details from "../../../../formJsonData/Operations/Vessel/VesseLOperations/sizeAnalysis_Details.json";
import sample_collection from "../../../../formJsonData/Operations/Vessel/VesseLOperations/sample_collection.json";
import Rake_Details from "../../../../formJsonData/Operations/Vessel/VesseLOperations/Rake_Details.json";
import CargoSupervision_formConfig from "../../../../formJsonData/Operations/Vessel/VesseLOperations/CargoSuperVisionOperation.json";
import Form from "../../../../components/common/Form";
import { sampleMarkOptionsApi } from "../../../../services/api";
import { postDataFromApi } from "../../../../services/commonServices";
import commonFields from "../../../../formJsonData/Operations/commonFields.json";
import DraftSurveyMainSection from "../../../../formJsonData/Operations/DraftSurveyMainSection.json";
import { useParams } from "react-router-dom";
import { decryptDataForURL } from "../../../../utills/useCryptoUtils";
import { getLMSActivityHeaderTab, getLMSOperationActivity, getPlantOperations, getRakeOperations, getSampleCollectionActivity, getVesselOperation, getActivityCode, getOperationNameByCode, getOperationActivityListPageUrl, getOperationActivityUrl, getStackOperations } from "../../../../services/commonFunction";
import QuantityAssessment_formConfig from "../../../../formJsonData/Operations/Rake/RakeOperations/QuantityAssessmentOperation.json";
import commonFieldsRake from "../../../../formJsonData/Operations/commonFieldsRake.json";
import BulkCargoSupevission from "../../../../formJsonData/Operations/Vessel/VesseLOperations/BulkCargoSupevission.json";
import { useSelector } from "react-redux";
const OperationDetails = ({ ops_code }) => {
    let { TMLType } = useParams();
    TMLType = TMLType ? decryptDataForURL(TMLType) : "";
    TMLType = getActivityCode(TMLType)
    const ActualTMLType = TMLType
    TMLType = TMLType && TMLType.toLowerCase() != "othertpi" ? TMLType.toLowerCase() : TMLType
    const opsLabel = getOperationNameByCode(ops_code) + " Operation"
    formConfig['breadcom'][0]['title'] = getOperationNameByCode(ops_code) + " List"
    formConfig['breadcom'][0]['redirect'] = getOperationActivityListPageUrl(ops_code)
    formConfig['breadcom'][1]['title'] = opsLabel
    const [actualConfigData, setActualConfigData] = useState(formConfig);
    const countRef = useRef(0);
    const [isViewOnly, setIsViewOnly] = useState(false);
    const [isTabOpened, setIsTabOpened] = useState(false);
    const [operationStepNo, setOperationStepNo] = useState(0);
    const [operationMode, setOperationMode] = useState("");
    const tileSubHeaderHH = [{ Text: "H&H" }];
    const tileSubHeadercargoSupervision = [{ Text: "Cargo Supervision" }];
    const tileSubHeaderDS = [
    ];
    let tileSubHeaderQA = getLMSActivityHeaderTab(TMLType)
    const session = useSelector((state) => state.session);
    const user = session.user;
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
        let isRakeDetails = params.get("isRakeDetails")
            ? params.get("isRakeDetails")
            : "";
        isRakeDetails = decryptDataForURL(isRakeDetails);
        setOperationStepNo(stepNo);
        setOperationMode(opsMode);
        setIsViewOnly(useFor === "viewonly" ? true : false);
        let newConfig = JSON.parse(JSON.stringify(formConfig2));
        if (ops_code == "RK" || TMLType === getPlantOperations("RK")) {
            //for rake details tab
            // if (TMLType == getRakeOperations('QA')) {
            //     newConfig["sections"][0].fields = commonFields;
            // }
            // else {
            if (isRakeDetails) {
                newConfig["sections"][0].subSections.push({
                    fields: commonFields
                });
                newConfig["sections"][0].subSections.push({
                    fields: commonFieldsRake
                });
            }
            else {
                newConfig["sections"][0].fields = commonFields;
            }
            // }
            //

        }
        else {
            newConfig["sections"][0].fields = commonFields;
        }
        const tileSubHeaderOnlySeal = [{ Text: "Truck Supervission" }];
        const tileSubHeaderQAss = [{ Text: "Rake Details" }, { Text: "Quantity Assessment" }];
        if (stepNo == 1) {
            newConfig["sections"][1] = ScopeWork_GroupParameters;
        } else if (stepNo == 4) {
            newConfig["sections"][1] = sizeAnalysis_Details;
        }
        else if (stepNo == 6) {
            if (ops_code == "TR" || TMLType === getPlantOperations("TR")) {
                let tabs = sample_collection.tabs.map((tab) => {
                    tab.headers = tab.headers.map((header) => {
                        if (header.name == "lot_no") {
                            header.label = "Truck No."
                        }
                        if (header.name == "sample_qty") {
                            header.label = "Truck Quantity"
                        }
                        return header;
                    })
                    return tab
                })
                sample_collection = {
                    ...sample_collection,
                    tabs: tabs
                }
            }
            else {
                let tabs = sample_collection.tabs.map((tab) => {
                    tab.headers = tab.headers.map((header) => {
                        if (header.name == "lot_no") {
                            header.label = "Lot No."
                        }
                        if (header.name == "sample_qty") {
                            header.label = "Lot Quantity"
                        }
                        return header;
                    })
                    return tab
                })
                sample_collection = {
                    ...sample_collection,
                    tabs: tabs
                }
            }
            newConfig["sections"][1] = sample_collection;
        }
        else if (stepNo == 7) {
            newConfig["sections"][1] = Rake_Details;
        }
        if (TMLType == getVesselOperation("HH") && ["VL", "OT"].includes(ops_code)) {
            newConfig["sections"][1] = H_H_formConfig;
            newConfig["sections"][1]["tabs"][0].tileSubHeader = tileSubHeaderHH;
        } else if (TMLType == getVesselOperation("SV") && ["VL", "PL", "OT"].includes(ops_code)) {
            newConfig["sections"][1] = supervission_formConfig;
        } else if (TMLType == getVesselOperation("DS") && ["VL", "OT"].includes(ops_code)) {
            newConfig["sections"][0].subSections = [{ fields: [] }, { fields: [] }];
            newConfig["sections"][0].subSections[0].fields = commonFields;
            newConfig["sections"][0].subSections[1].fields = DraftSurveyMainSection;
            newConfig["sections"][1] = DraftSurvey_formConfig;
            newConfig["sections"][1]["tabs"][0].tileSubHeader = tileSubHeaderDS;
        } else if ([getVesselOperation("CS")].includes(TMLType) && ["VL", "OT", "PL"].includes(ops_code)) {
            newConfig["sections"][1] = CargoSupervision_formConfig;
            newConfig["sections"][1]["tabs"][0].tileSubHeader = tileSubHeadercargoSupervision;
        } else if (TMLType == getVesselOperation("DM") && ["VL", "OT"].includes(ops_code)) {
            newConfig["sections"][1] = sizeAnalysis_Details;
            newConfig["sections"][1]["tabs"][0].tileSubHeader = [{ Text: "Daily Moisture" }];
        }
        else if (TMLType == getVesselOperation("bulk_crg") && ["VL", "OT"].includes(ops_code)) {
            newConfig["sections"][1] = BulkCargoSupevission;
        }
        else if (TMLType == getRakeOperations('QAss') && ["RK", "OT"].includes(ops_code)) {
            newConfig["sections"][1] = QuantityAssessment_formConfig;
            if (isRakeDetails) {
                delete newConfig["sections"][1]
            }
        } else if (TMLType == getRakeOperations('QAss') && ["TR", "OT", "PL", "OT"].includes(ops_code)) {
            newConfig["sections"][1] = QuantityAssessment_formConfig;
            newConfig["sections"][1]["tabs"][0].tileSubHeader = tileSubHeaderQAss;
        }
        else if ([getPlantOperations("TR"), getPlantOperations("RK"), getPlantOperations("ST")].includes(TMLType) && ops_code === "PL") {
            newConfig["sections"][1]["tabs"][0].tileSubHeader = tileSubHeaderQA;
        }
        else if (TMLType == getStackOperations("ST_SV")) {
            newConfig["sections"][1] = StackSupervission;
            newConfig["sections"][1]["tabs"][0].headers = newConfig["sections"][1]["tabs"][0].headers.map((singleField) => {
                if (singleField.name === "st_sv_stack_no") {
                    singleField.label = ops_code === "OT" ? "Mines No." : 'Stack No.'
                }
                return singleField
            });
            newConfig["sections"][1]["tabs"][0].rows = newConfig["sections"][1]["tabs"][0].rows.map((singleField) => {
                if (singleField.name === "st_sv_stack_no") {
                    singleField.label = ops_code === "OT" ? "Mines No." : 'Stack No.'
                }
                return singleField
            });
            newConfig["sections"][1]["tabs"][0].label = `${ops_code === "OT" ? "Mines" : "Stack"} Supervission`
        }
        else if (TMLType == getRakeOperations("RK_SV") && ["RK", "PL"].includes(ops_code)) {
            newConfig["sections"][1] = RakeSupervission;
        }
        else if (getLMSOperationActivity().includes(TMLType)) {
            newConfig["sections"][1]["tabs"][0].tileSubHeader = tileSubHeaderQA;
        } else {
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

        // else if (stepNo == 5) {
        //   newConfig["sections"][1] = sentToJRF_Details;
        // }
        if (TMLType !== getVesselOperation("SV")) {
            if (newConfig["sections"]?.[1]) {
                let tabTitle = newConfig["sections"][1]["tabs"][0].label;
                // newConfig["sections"][1]["tabs"][0].label = ActualTMLType || tabTitle;
                newConfig["sections"][1]["tabs"][0].label = tabTitle || ActualTMLType;
            }
        }
        if (![1, 4, 6, 7].includes(stepNo)) {
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
        if (stepNo === 2 && getLMSOperationActivity().includes(TMLType)) {
            newConfig["sections"][1]["tabs"][0].headers = newConfig["sections"][1]["tabs"][0].headers.filter((header) => {
                if (!['TR', 'TRUCK'].includes(opsMode.toUpperCase())) {
                    if (!(['PL', 'PLANT'].includes(opsMode.toUpperCase()) && [getPlantOperations('TR')].includes(TMLType)))
                        return !['jism_truck_no', 'jism_sample_quantity'].includes(header.name)
                }
                return true
            })
            newConfig["sections"][1]["tabs"][0].rows[0] = newConfig["sections"][1]["tabs"][0].rows[0].filter((header) => {
                if (!['TR', 'TRUCK'].includes(opsMode.toUpperCase())) {
                    if (!(['PL', 'PLANT'].includes(opsMode.toUpperCase()) && [getPlantOperations('TR')].includes(TMLType)))
                        return !['jism_truck_no', 'jism_sample_quantity'].includes(header.name)
                }
                return true
            })
        }
        newConfig["sections"][0].fields = newConfig["sections"][0].fields.map((singleField) => {
            singleField.readOnly = true;
            return singleField
        });

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
        headerfieldValue = [{
            name: "jism_lot_no",
            type: "text",
            label: "Lot Wise",
            "isShowTable": true
        }];
        tabFields = [{
            name: "jism_lot_no",
            type: "text",
            label: "Lot Wise",
            "isShowTable": true,
            "width": 6,
            "fieldWidth": "100"
        }];
        array.headers = [...headerfieldValue, ...array.headers];
        array.rows[0] = [...tabFields, ...array.rows[0]];
        // }
        headerfieldValue = [{
            name: "jism_is_composite",
            type: "radio",
            label: "Is Composite or Lot",
            "isShowTable": true
        }];
        tabFields = [{
            name: "jism_is_composite",
            type: "radio",
            label: "Is Composite or Lot",
            options: ["Composite", "Lot", "Singular Composite"],
            "isShowTable": true,
            "fieldWidth": "100",
        }];
        const filterdata = array.rows[0].filter(
            (field) => field.name === "jism_is_composite"
        );
        if (filterdata.length === 0) {
            array.headers = [...headerfieldValue, ...array.headers];
            array.rows[0] = [...tabFields, ...array.rows[0]];
        }
        if (['TR', 'TRUCK'].includes(ops_code) || TMLType === getPlantOperations('TR')) {
            headerfieldValue = [
                {
                    "name": "seal_number",
                    "type": "label",
                    "label": "Seal No.",
                    "width": 6,
                    "fieldWidth": "100"
                },
                {
                    "name": "seal_number_count",
                    "type": "label",
                    "label": "No. of Seals",
                    "width": 6,
                    "fieldWidth": "100"
                },
                {
                    "name": "truck_gross_weight",
                    "type": "label",
                    "label": "Truck Gross Weight",
                    "width": 6,
                    "fieldWidth": "100"
                },
                {
                    "name": "tare_weight",
                    "type": "label",
                    "label": "Tare Weight",
                    "width": 6,
                    "fieldWidth": "100"
                },
                {
                    "name": "net_weight",
                    "type": "label",
                    "label": "Net Weight",
                    "width": 6,
                    "fieldWidth": "100"
                },
                {
                    "name": "truck_transporter",
                    "type": "label",
                    "label": "TRANSPORTER",
                    "width": 6,
                    "fieldWidth": "100"
                },
                {
                    "name": "truck_mines",
                    "type": "label",
                    "label": "MINES",
                    "width": 6,
                    "fieldWidth": "100"
                },
                {
                    "name": "truck_no_of_truck",
                    "type": "label",
                    "label": "NO. OF TRUCK",
                    "width": 6,
                    "fieldWidth": "100"
                },
                {
                    "name": "truck_form_l_no",
                    "type": "label",
                    "label": "FORM L NO.",
                    "width": 6,
                    "fieldWidth": "100"
                },
                {
                    "name": "truck_source",
                    "type": "label",
                    "label": "Source",
                    "width": 6,
                    "fieldWidth": "100"
                },
                {
                    "name": "truck_supplier",
                    "type": "label",
                    "label": "Supplier",
                    "width": 6,
                    "fieldWidth": "100"
                }]
            tabFields = [
                {
                    "name": "seal_number",
                    "type": "text",
                    "label": "Seal No.",
                    "width": 6,
                    "fieldWidth": "100",
                    isExternalJson: true
                },
                {
                    "name": "seal_number_count",
                    "type": "number",
                    "label": "No. of Seals",
                    "width": 6,
                    "fieldWidth": "100",
                    isExternalJson: true
                },
                {
                    "name": "truck_gross_weight",
                    "type": "text",
                    "label": "Truck Gross Weight",
                    "width": 6,
                    "fieldWidth": "100",
                    isExternalJson: true
                },
                {
                    "name": "tare_weight",
                    "type": "text",
                    "label": "Tare Weight",
                    "width": 6,
                    "fieldWidth": "100",
                    isExternalJson: true
                },
                {
                    "name": "net_weight",
                    "type": "text",
                    "label": "Net Weight",
                    "width": 6,
                    "fieldWidth": "100",
                    isExternalJson: true
                },
                {
                    "width": 6,
                    "name": "truck_transporter",
                    "type": "text",
                    "fieldWidth": "100",
                    isExternalJson: true
                },
                {
                    "width": 6,
                    "name": "truck_mines",
                    "type": "text",
                    "fieldWidth": "100",
                    isExternalJson: true
                },
                {
                    "width": 6,
                    "name": "truck_no_of_truck",
                    "type": "text",
                    "fieldWidth": "100",
                    isExternalJson: true
                },
                {
                    "width": 6,
                    "name": "truck_form_l_no",
                    "type": "text",
                    "fieldWidth": "100",
                    isExternalJson: true
                },
                {
                    "width": 6,
                    "name": "truck_source",
                    "type": "text",
                    "fieldWidth": "100",
                    isExternalJson: true
                },
                {
                    "name": "truck_supplier",
                    "type": "text",
                    "label": "Supplier",
                    "placeholder": "Supplier",
                    "width": 6,
                    "fieldWidth": "100",
                    isExternalJson: true
                },
            ]
        }
        else {
            headerfieldValue = [{
                name: "sample_supplier",
                type: "text",
                label: "Supplier"
            }]
            tabFields = [{
                "name": "sample_supplier",
                "type": "text",
                "label": "Supplier",
                "placeholder": "Supplier",
                "width": 6,
                "fieldWidth": "100",
                isExternalJson: true
            }]
        }
        array.headers = [...array.headers, ...headerfieldValue];
        array.rows[0] = [...array.rows[0], ...tabFields];
        headerfieldValue = [
            {
                name: "sample_loc",
                type: "text",
                label: "Sampling Location",
            },
            {
                name: "sub_commodity",
                type: "text",
                label: "Sub Commodity"
            },
            {
                name: "manual_duplicate_entry",
                type: "text",
                label: "Sample Count"
            }];
        tabFields = [
            {
                "name": "sample_loc",
                "type": "text",
                "label": "Sampling location",
                "placeholder": "Sampling location",
                "width": 6,
                "fieldWidth": "100",
                isExternalJson: true
            }, {
                "name": "sub_commodity",
                "type": "text",
                "label": "Sub Commodity",
                "placeholder": "Sub Commodity",
                "width": 6,
                "fieldWidth": "100",
                isExternalJson: true
            }, {
                "name": "manual_duplicate_entry",
                "type": "number",
                "label": "Sample Count",
                "placeholder": "Sample Count",
                "width": 6,
                "fieldWidth": "100",
                defaultValue: 1
            }];
        array.headers = [...array.headers, ...headerfieldValue];
        array.rows[0] = [...array.rows[0], ...tabFields];
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
                    setIsTabOpened={setIsTabOpened}
                    isTabOpened={isTabOpened}
                />
            </Col>
        </Row>
    );
};

export default OperationDetails;
