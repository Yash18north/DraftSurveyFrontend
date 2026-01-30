import { data } from "jquery";
import { getAnalyticsSampleAnalyzedApi, getAnalyticsSampleSubmissionTrendApi, getAVGSampleAnalysusCountApi, getClientPaymentCountApi, getClientRevenueChartApi, getExternalSampleCountApi, getSampleAnalyzedDataApi, getStatisticsDataApi, getUserSampleHeatMapApi } from "../../../../services/api";
import { getDataFromApi } from "../../../../services/commonServices";

const getQueryStringData = (formData, isLast5Moth, isYearStart) => {
    try {
        isYearStart = 1
        isLast5Moth = ""
        const obj = { ...formData?.[0] };

        const today = new Date();
        const formatDate = (date) => date.toISOString().split("T")[0]; // 'YYYY-MM-DD'
        let firstDate = "";
        let lastDate = "";
        if (isLast5Moth) {
            const fiveMonthsAgo = new Date(today);
            fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);
            firstDate = formatDate(fiveMonthsAgo);
            lastDate = formatDate(today);
        }
        else if (isYearStart) {
            const currentYear = today.getFullYear();
            const isBeforeApril = today.getMonth() < 3; // Jan = 0, Feb = 1, Mar = 2
            const year = isBeforeApril ? currentYear - 1 : currentYear;
            firstDate = `${year}-04-01`;
            lastDate = formatDate(today);
        } else {
            // Default to 7 days if not provided
            if (!obj.end_date) {
                lastDate = formatDate(today);
            }

            if (!obj.start_date) {
                const sevenDaysAgo = new Date(today);
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                firstDate = formatDate(sevenDaysAgo);
            }
        }
        if (!obj.end_date) {
            obj.end_date = lastDate;
        }

        if (!obj.start_date) {
            obj.start_date = firstDate;
        }
        const params = Object.entries(obj)
            .filter(([_, value]) => value !== undefined && value !== null && value !== "")
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join("&");

        return params ? `?${params}` : "";
    } catch (error) {
        console.error("Query String Error:", error);
        return "?error=Something%20went%20wrong";
    }
};
const getUserLoginDetails = (userData) => {
    userData = userData?.[0]
    let totallogin = userData?.['Total Logins'] || 0
    let totalUsers = userData?.['Total Unique Users'] || 0
    return `${totalUsers} / ${totallogin}`
}
const getLMSMetricsDetails = (MetricsData) => {
    let chartData = MetricsData && MetricsData.map((singleData) => {
        return {
            name: singleData.Metric,
            total: singleData?.["Total"],
            today: singleData?.["Today's"]

        }
    }) || []
    return chartData
}
const getOperationMetricsDetails = (MetricsData) => {
    let chartData = MetricsData && MetricsData.map((singleData) => {
        return {
            name: singleData.Metric,
            total: singleData?.["Total"],
            today: singleData?.["Today's"]

        }
    }) || []
    return chartData
}
const getJIBreakdownMetricsDetails = (MetricsData) => {
    let chartData = MetricsData && MetricsData.map((singleData) => {
        return {
            name: singleData?.['Operation Mode'],
            total: singleData?.["Total"],
            today: singleData?.["Today's"]

        }
    }) || []
    return chartData
}
const getModuleWiseData = (actualResponseData, formData) => {
    let moduleType = formData?.[1]?.sub_module_type || 'Job Instructions';
    let recordType = formData?.[1]?.sub_record_type || 'Activity';
    let record_name = 'Activity Name';
    let responseKey = "Job Instructions By Activities"
    if (moduleType === "Job Instructions") {
        if (recordType == "Branch") {
            responseKey = "Job Instructions Branch-Wise"
            record_name = "Branch Name"
        }
    }
    else if (moduleType === "Certificates") {
        responseKey = "Certificates Issued by Activity"
        if (recordType == "Branch") {
            responseKey = "Certificates Issued by Branch"
            record_name = "Branch Name"
        }
    }
    else if (moduleType === "Invoice") {
        responseKey = "Invoices Branch-Wise"
        record_name = "Branch Name"
    }
    let chartData = actualResponseData && actualResponseData?.[responseKey] && actualResponseData?.[responseKey].map((singleData) => {
        return {
            name: singleData?.[record_name],
            total: singleData?.["Total"],
            today: singleData?.["Today's"]
        }
    }) || []
    return chartData
}
export const getChartDataFromResponse = async (setActualFormConfig, actualResponseData, setIsOverlayLoader, formData) => {
    try {
        setIsOverlayLoader(true);
        setActualFormConfig((formConfig) => {
            formConfig['summary'][0].value = getUserLoginDetails(actualResponseData?.['User Engagement'])
            formConfig['BarChartsData'][0]['data'] = getLMSMetricsDetails(actualResponseData?.['LMS Metrics'])
            formConfig['BarChartsData'][1]['data'] = getOperationMetricsDetails(actualResponseData?.['Operations Metrics'])
            formConfig['BarChartsData'][2]['data'] = getJIBreakdownMetricsDetails(actualResponseData?.['Job Instructions Breakdown'])
            formConfig['BarChartsData'][3]['data'] = getModuleWiseData(actualResponseData, formData)
            return formConfig
        });
    } catch (error) {
        // console.log(error);
    } finally {
        setTimeout(() => {
            setIsOverlayLoader(false)
        }, 1000)
    }
};
export const getAllStatisticsData = async (setActualFormConfig, formData, setIsOverlayLoader, setActualResponse) => {
    try {
        setIsOverlayLoader(true);
        // let queristring = getQueryStringData(formData)
        let queristring = ""
        let res = await getDataFromApi(getStatisticsDataApi + queristring);        
        if (res?.data?.status === 200 && res.data.data) {
            setActualResponse(res.data.data)
            getChartDataFromResponse(setActualFormConfig,res.data.data,setIsOverlayLoader,formData)
        }
    } catch (error) {
        console.error(error);
    } finally {
        setIsOverlayLoader(false)
    }
};