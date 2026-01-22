import Dashboard from "./Dashboard";
import formConfig from "../../formJsonData/Dashboard/CreditControlDashboard.json";
import { useEffect, useState } from "react";
import { getAnalyticsSampleAnalyzedOtherFunc, getBranchLoadingUnloadingFunc, getClientPaymentStackbarOtherFunc, getClientPaymentTableDataFunc, getCommodityWiseSalesDataFunc, getOPSModeWiseJobsDataFunc, getPortLoadingUnloadingCountFunc, getPortLoadingUnloadingFunc, getSalesPersonPerformanceTableDataFunc, getStateWisePaymentDataFunc } from "../../components/common/commonHandlerFunction/dashboard/OperationOtherAnalystDashboardHandlerFunction";
import moment from "moment";
const formatDate = (date) => date.toISOString().split("T")[0]; 
const CreditControlDashboard = () => {
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
        getAnalyticsSampleAnalyzedOtherFunc(setActualFormConfig, setIsChartChanged, customFilterData, setIsOverlayLoader)
        getClientPaymentTableDataFunc(setActualFormConfig, setIsChartChanged, customFilterData, setIsOverlayLoader)
        getSalesPersonPerformanceTableDataFunc(setActualFormConfig, setIsChartChanged, customFilterData, setIsOverlayLoader)
        getStateWisePaymentDataFunc(setActualFormConfig, setIsChartChanged, customFilterData, setIsOverlayLoader)
        // getCommodityWiseSalesDataFunc(setActualFormConfig, setIsChartChanged, customFilterData, setIsOverlayLoader)
        getOPSModeWiseJobsDataFunc(setActualFormConfig, setIsChartChanged, customFilterData, setIsOverlayLoader)
    }
    return (<Dashboard formConfig={actualFormConfig} customFilterData={customFilterData} setCustomFilterData={setCustomFilterData} isChartChanged={isChartChanged} commonDashboardFunctions={commonDashboardFunctions} isOverlayLoader={isOverlayLoader} setIsOverlayLoader={setIsOverlayLoader} />
    );
};

export default CreditControlDashboard;
