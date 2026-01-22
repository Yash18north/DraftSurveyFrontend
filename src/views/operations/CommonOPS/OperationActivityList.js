import React, { useEffect, useRef, useState } from "react";
import { Row, Col } from "reactstrap";

import formConfig from "../../../formJsonData/Operations/Vessel/VesselList.json";
import Form from "../../../components/common/Form";

import commonFields from "../../../formJsonData/Operations/commonFields.json";
import { getOperationActivityListPageUrl, getOperationActivityUrl, getOperationNameByCode } from "../../../services/commonFunction";
import { useSelector } from "react-redux";
import { decryptDataForURL } from "../../../utills/useCryptoUtils";
formConfig['sections'][0].fields = commonFields
const OperationActivityList = ({ ops_code }) => {
    const session = useSelector((state) => state.session);
    const user = session.user;
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split("?")[1]);
    let operationMode = params.get("operationMode")
        ? params.get("operationMode")
        : "";
    operationMode = decryptDataForURL(operationMode) || ops_code;
    const [masterResponse, setMasterResponse] = useState([]);
    const [actualConfigData, setActualConfigData] = useState(formConfig);
    const [isPageChanged, setIsPageChanged] = useState(false);
    useEffect(() => {
        setIsPageChanged(false)
        let newConfig = JSON.parse(JSON.stringify(formConfig));
        const opsLabel = getOperationNameByCode(operationMode) + " Operation"
        const moduleType = "vesselOperation"
        const redirectUrl = getOperationActivityUrl(operationMode)
        newConfig['breadcom'][0]['title'] = getOperationNameByCode(operationMode) + " List"
        formConfig['breadcom'][0]['redirect'] = getOperationActivityListPageUrl(ops_code)
        newConfig['breadcom'][1]['title'] = opsLabel
        newConfig['sections'][1]['tabs'][0]['label'] = opsLabel
        newConfig['sections'][1]['tabs'][0]['listView'].title = opsLabel
        newConfig['sections'][1]['tabs'][0]['listView'].moduleType = moduleType
        newConfig['sections'][1]['tabs'][0]['listView'].redirectUrl = redirectUrl

        setActualConfigData(newConfig);
        setTimeout(() => {
            setIsPageChanged(true)
        }, 10)
    }, [ops_code]);
    return isPageChanged && (
        <Row className="rowWidthAdjust">
            <Col>
                <Form formConfig={actualConfigData} masterResponse={masterResponse} setMasterResponse={setMasterResponse} useForComponent="OperationsList" />
            </Col>
        </Row>
    );
};

export default OperationActivityList;
