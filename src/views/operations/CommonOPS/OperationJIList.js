import React, { useEffect, useRef, useState } from "react";
import { Row, Col } from "reactstrap";
// import formConfig from "../../../formJsonData/Operations/Vessel/VesselJIListing.json";
import formConfig from "../../../formJsonData/Operations/jobinstructions/JrfInstructionListing.json";
import searchConfigJson from "../../../formJsonData/LMS/searchFilterFields.json";
import Form from "../../../components/common/Form";
import { getOperationActivityUrl } from "../../../services/commonFunction";
import { decryptDataForURL } from "../../../utills/useCryptoUtils";
import { useSelector } from "react-redux";
const OperationJIList = ({ ops_code }) => {
    const session = useSelector((state) => state.session);
    const user = session.user;
    const [actualConfigData, setActualConfigData] = useState(formConfig);
    const [isPageChanged, setIsPageChanged] = useState(false);
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split("?")[1]);
    let operationMode = params.get("operationMode")
        ? params.get("operationMode")
        : "";
    operationMode = decryptDataForURL(operationMode);
    useEffect(() => {
        setIsPageChanged(false)
        let newConfig = JSON.parse(JSON.stringify(formConfig));
        newConfig.listView.moduleType = "jioperationjsonb"
        newConfig.apiEndpoints.read = newConfig.apiEndpoints.read + "?ops_code=" + ops_code
        newConfig.apiEndpoints.statuCount = newConfig.apiEndpoints.statuCount + "?ops_code=" + ops_code

        newConfig.listView.actions = newConfig.listView.actions.filter((action) => {
            if (action.status == "accepted") {
                action.redirectUrl = getOperationActivityUrl(ops_code).slice(0, -1)
            }
            return action
        })
        if (ops_code !== "OT") {
            newConfig.listView.filterListing = newConfig.listView.filterListing.filter((singleData) => singleData.name != "fk_operationtypetid")
        }

        setActualConfigData(newConfig);
        setTimeout(() => {
            setIsPageChanged(true)
        }, 10)
    }, [ops_code]);
    return isPageChanged && (
        <Row>
            <Col>
                <Form formConfig={actualConfigData} searchConfigJson={searchConfigJson.jobinstructionList} useForComponent="Operations" />
            </Col>
        </Row>
    );
};

export default OperationJIList;
