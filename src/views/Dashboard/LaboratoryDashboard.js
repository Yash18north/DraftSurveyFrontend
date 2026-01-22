import { Card, CardBody } from "react-bootstrap";
import { Row, Col, CardTitle } from "reactstrap";
import Dashboard from "./Dashboard";
import formConfig from "../../formJsonData/Dashboard/LaboratoryDashboard.json";
import { useEffect, useState } from "react";
import { getAnalylizedSampleAnalyzedFunc, getAnalyticsSampleSubmissionTrendFunc, getAVGSampleAnalysusCountFunc, getClientPaymentCountFunc, getClientRevenueChartDataFunc, getExternalSampleCountFunc, getSampleAnalyzedDataFunc, getUserSampleHeatMapDataFunc } from "../../components/common/commonHandlerFunction/dashboard/laboratorydashboardhandlerfunctions";
import moment from "moment";
const formatDate = (date) => date.toISOString().split("T")[0]; 
const LaboratoryDashboard = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const isBeforeApril = today.getMonth() < 3; // Jan = 0, Feb = 1, Mar = 2
    const year = isBeforeApril ? currentYear - 1 : currentYear;
    const currentMonth = String(today.getMonth() + 1).padStart(2, "0");
    // firstDate = `${year}-04-01`;
    let firstDate = `${year}-${currentMonth}-01`;
    const lastDate = formatDate(today)
    const [actualFormConfig, setActualFormConfig] = useState(formConfig);
    const [customFilterData, setCustomFilterData] = useState({
        0: {
            start_date: firstDate,
            end_date: lastDate,
        }
    });
    const [isChartChanged, setIsChartChanged] = useState(true);
    const [isOverlayLoader, setIsOverlayLoader] = useState(false);

    const commonDashboardFunctions = () => {
        getSampleAnalyzedDataFunc(setActualFormConfig, setIsChartChanged, customFilterData, setIsOverlayLoader)
        getUserSampleHeatMapDataFunc(setActualFormConfig, setIsChartChanged, customFilterData, setIsOverlayLoader)
        getClientRevenueChartDataFunc(setActualFormConfig, setIsChartChanged, customFilterData, setIsOverlayLoader)
        getAnalylizedSampleAnalyzedFunc(setActualFormConfig, setIsChartChanged, customFilterData, setIsOverlayLoader)
        getExternalSampleCountFunc(setActualFormConfig, setIsChartChanged, customFilterData, setIsOverlayLoader)
        // getAnalyticsSampleSubmissionTrendFunc(setActualFormConfig, setIsChartChanged, customFilterData,setIsOverlayLoader)
        getClientPaymentCountFunc(setActualFormConfig, setIsChartChanged, customFilterData, setIsOverlayLoader)
        getAVGSampleAnalysusCountFunc(setActualFormConfig, setIsChartChanged, customFilterData, setIsOverlayLoader)
    }

    return actualFormConfig && (<Dashboard formConfig={actualFormConfig} customFilterData={customFilterData} setCustomFilterData={setCustomFilterData} isChartChanged={isChartChanged} commonDashboardFunctions={commonDashboardFunctions} isOverlayLoader={isOverlayLoader} setIsOverlayLoader={setIsOverlayLoader} />
    );
};

export default LaboratoryDashboard;
