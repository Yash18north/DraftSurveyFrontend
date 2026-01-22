import { toast } from "react-toastify";
import { getBranchLoadingUnloadingApi, getClientPaymentStackbarApi, getClientPaymentTableDataApi, getCommodityWiseSalesDataApi, getMonthSalesTrendApi, getOPSModeWiseJobsDataApi, getOverallBranchOutstandingApi, getOverallcommodityOutstandingApi, getOverallSalesPersonPerformanceApi, getPortLoadingUnloadingApi, getPortLoadingUnloadingCountApi, getSalesPersonPerformanceTableDataApi, getStateWisePaymentDataApi } from "../../../../services/api"
import { formatCurrency } from "../../../../services/commonFunction";
import { getDataFromApi } from "../../../../services/commonServices"
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
            const currentMonth = String(today.getMonth() + 1).padStart(2, "0");
            // firstDate = `${year}-04-01`;
            firstDate = `${year}-${currentMonth}-01`;
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
        // const params = Object.entries(obj)
        //     .filter(([_, value]) => value !== undefined && value !== null && value !== "")
        //     .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        //     .join("&");
        const params = Object.entries(obj)
            .map(([key, value]) => {
                if (Array.isArray(value)) {
                    // Join with commas without encoding them
                    return `${encodeURIComponent(key)}=${value.join(",")}`;
                }
                return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
            })
            .join("&")

        return params ? `?${params}` : "";
    } catch (error) {
        console.error("Query String Error:", error);
        return "?error=Something%20went%20wrong";
    }
};

export const getoverAllBranchwiseAnalytics = async (setActualFormConfig, setIsChartChanged, formData, setIsOverlayLoader) => {
    try {
        setIsOverlayLoader(true);
        let queristring = getQueryStringData(formData, "", 1)
        let res = await getDataFromApi(getOverallBranchOutstandingApi + queristring);
        if (res?.data?.status === 200) {
            setActualFormConfig((formConfig) => {
                const data = []
                formConfig['BarChartsData'][0]['data'] = res.data.map(
                    ({ branch, ...rest }) => ({
                        name: branch,
                        ...rest
                    })
                );
                formConfig['BarChartsData'][0]['labels'] = {
                    "opening_outstanding": "Opening Outstanding (₹)",
                    "old_outstanding": "Old Outstanding (>90 days) (₹)",
                    "current_outstanding": "Current Outstanding (0–90 days) (₹)",
                    "current_period_collection": "Current Period Collection (₹)",
                    "total_outstanding": "Total Outstanding (₹)",
                    "collection_percent": "Collection %",
                    "old_collection": "Old Collection (₹)",
                };
                return formConfig
            });
        }
    } catch (error) {
        console.error(error);
    } finally {
        setIsOverlayLoader(false)
        setIsChartChanged(false)
        setTimeout(() => {
            setIsChartChanged(true)
        }, 10)
    }
};

export const getoverAllSalesPersonwiseAnalytics = async (setActualFormConfig, setIsChartChanged, formData, setIsOverlayLoader) => {
    try {
        setIsOverlayLoader(true);
        let queristring = getQueryStringData(formData, "", 1)
        let res = await getDataFromApi(getOverallSalesPersonPerformanceApi + queristring);
        if (res?.data?.status === 200) {
            setActualFormConfig((formConfig) => {
                const data = []
                formConfig['BarChartsData'][1]['data'] = res.data.map(
                    ({ salesperson, ...rest }) => ({
                        name: salesperson,
                        ...rest
                    })
                );

                formConfig['BarChartsData'][1]['labels'] = {
                    "no_of_clients": "No. of Clients",
                    "total_outstanding": "Total Outstanding (₹)",
                    "overdue_90": ">90 Days Overdue (₹)",
                    "overdue_60": ">60 Days (₹)",
                    "current_month_collection": "Current Month Collection (₹)",
                    "recovery_percent": "Recovery %"
                };
                return formConfig
            });
        }
    } catch (error) {
        console.error(error);
    } finally {
        setIsOverlayLoader(false)
        setIsChartChanged(false)
        setTimeout(() => {
            setIsChartChanged(true)
        }, 10)
    }
};
export const getoverAllCommoditywiseAnalytics = async (setActualFormConfig, setIsChartChanged, formData, setIsOverlayLoader) => {
    try {
        setIsOverlayLoader(true);
        let queristring = getQueryStringData(formData, "", 1)
        let res = await getDataFromApi(getOverallcommodityOutstandingApi + queristring);
        if (res?.data?.status === 200) {
            setActualFormConfig((formConfig) => {
                const data = []
                formConfig['BarChartsData'][2]['data'] = res.data.map(
                    ({ commodity, ...rest }) => ({
                        name: commodity,
                        ...rest
                    })
                );
                formConfig['BarChartsData'][2]['labels'] = {
                    "total_sales": "Total Sales (₹)",
                    "total_outstanding": "Total Outstanding (₹)",
                    "outstanding_percent": "Outstanding % of Sales",
                    ">90_days_old_outstanding": ">90 Days Old Outstanding (₹)",
                    "no_of_clients": "No. of Clients"
                };
                return formConfig
            });
        }
    } catch (error) {
        console.error(error);
    } finally {
        setIsOverlayLoader(false)
        setIsChartChanged(false)
        setTimeout(() => {
            setIsChartChanged(true)
        }, 10)
    }
};