import Dashboard from "./Dashboard";
import formConfig from "../../formJsonData/Dashboard/OtherAnalystDashboard.json";
import { useEffect, useState } from "react";
import { getAnalyticsSampleAnalyzedOtherFunc, getBranchLoadingUnloadingFunc, getClientPaymentStackbarOtherFunc, getOPSModeWiseJobsDataFunc, getPortLoadingUnloadingCountFunc, getPortLoadingUnloadingFunc } from "../../components/common/commonHandlerFunction/dashboard/OperationOtherAnalystDashboardHandlerFunction";
import moment from "moment";
const formatDate = (date) => date.toISOString().split("T")[0]; 
const OtherAnalystDashboard = () => {
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
        getPortLoadingUnloadingFunc(setActualFormConfig, setIsChartChanged, customFilterData, setIsOverlayLoader)
        getBranchLoadingUnloadingFunc(setActualFormConfig, setIsChartChanged, customFilterData, setIsOverlayLoader)
        getPortLoadingUnloadingCountFunc(setActualFormConfig, setIsChartChanged, customFilterData, setIsOverlayLoader)
    }
    return (<Dashboard formConfig={actualFormConfig} customFilterData={customFilterData} setCustomFilterData={setCustomFilterData} isChartChanged={isChartChanged} commonDashboardFunctions={commonDashboardFunctions} isOverlayLoader={isOverlayLoader} setIsOverlayLoader={setIsOverlayLoader} />
    );
};

export default OtherAnalystDashboard;
