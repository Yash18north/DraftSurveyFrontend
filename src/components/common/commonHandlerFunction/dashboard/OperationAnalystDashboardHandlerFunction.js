import { getClientPaymentStackbarApi, getClientPaymentTableDataApi, getCommodityHandlesCountApi, getCostingExpenseCountApi, getMonthSalesTrendApi } from "../../../../services/api"
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


export const getAnalyticsSampleAnalyzedFunc = async (setActualFormConfig, setIsChartChanged, formData, setIsOverlayLoader) => {
    try {
        setIsOverlayLoader(true);
        let queristring = getQueryStringData(formData, 1)
        // let queristring = "?months=2"
        let res = await getDataFromApi(getMonthSalesTrendApi + queristring);
        if (res?.data?.status === 200) {
            setActualFormConfig((formConfig) => {
                let chartdata = res.data.data.chart_data.map((singledata) => {
                    return {
                        "name": singledata.month_name,
                        "sales": singledata.sales,
                    }
                })
                formConfig['BarChartsData'][0]['data'] = chartdata
                formConfig['BarChartsData'][0]['labels'] = {
                    "sales": "Sales"
                }
                let data = res.data.data.statistics.total_sales
                formConfig['summary'][0]['value'] = "₹" + formatCurrency(data)
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

export const getClientPaymentStackbarFunc = async (setActualFormConfig, setIsChartChanged, formData, setIsOverlayLoader) => {
    try {
        setIsOverlayLoader(true);
        let queristring = getQueryStringData(formData, "", 1)
        let res = await getDataFromApi(getClientPaymentStackbarApi + queristring);
        if (res?.data?.status === 200) {
            let data = []
            res.data.data.chart_data.map((singleData) => {
                data.push({
                    "category": singleData.client_name,
                    "firstLabel": singleData.paid,
                    "secondLabel": singleData.total
                })
            })
            setActualFormConfig((formConfig) => {
                formConfig['BarChartsData'][1]['data'] = data
                formConfig['BarChartsData'][1]['labels'] = {
                    "firstLabel": "Paid",
                    "secondLabel": "Balance"
                }
                formConfig['BarChartsData'][1]['colors'] = {
                    "firstLabel": "#4CAF50",
                    "secondLabel": "#FF9800"
                }
                let chartdata = "₹" + formatCurrency(res.data.data.statistics.total_paid) + ' / ' + "₹" + formatCurrency(res.data.data.statistics.total_balance)
                formConfig['summary'][3]['value'] = chartdata
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

export const getCommodityHandlesCountFunc = async (setActualFormConfig, setIsChartChanged, formData, setIsOverlayLoader) => {
    try {
        setIsOverlayLoader(true);
        let queristring = getQueryStringData(formData, "", 1)
        let res = await getDataFromApi(getCommodityHandlesCountApi + queristring);
        if (res?.data?.status === 200) {
            setActualFormConfig((formConfig) => {
                let summaryData = res?.data?.data?.total_unique_commodities
                formConfig['summary'][1]['value'] = summaryData
                return formConfig
            });
        }
    } catch (error) {
        console.error(error);
    } finally {
        setIsOverlayLoader(false);
        setIsChartChanged(false)
        setTimeout(() => {
            setIsChartChanged(true)
        }, 10)
    }
};

export const getCostingExpenseCountfunc = async (setActualFormConfig, setIsChartChanged, formData, setIsOverlayLoader) => {
    try {
        setIsOverlayLoader(true);
        let queristring = getQueryStringData(formData, "", 1)
        let res = await getDataFromApi(getCostingExpenseCountApi + queristring);
        if (res?.data?.status === 200) {
            setActualFormConfig((formConfig) => {
                let summaryData = res.data.data.summary.total_expense
                formConfig['summary'][2]['value'] = "₹" + formatCurrency(summaryData)
                return formConfig
            });
        }
    } catch (error) {
        console.error(error);
    } finally {
        setIsOverlayLoader(false);
        setIsChartChanged(false)
        setTimeout(() => {
            setIsChartChanged(true)
        }, 10)
    }
};


export const getBranchPaymentTableDataFunc = async (setActualFormConfig, setIsChartChanged, formData, setIsOverlayLoader) => {
    try {
        setIsOverlayLoader(true);
        let queristring = getQueryStringData(formData, "", 1)
        let res = await getDataFromApi(getClientPaymentTableDataApi + queristring);
        if (res?.data?.status === 200) {
            let data = []
            res.data.data.branch_summary && res.data.data.branch_summary.map((singleData) => {
                if (singleData.total_balance || singleData.total_paid) {
                    data.push({
                        "category": `${singleData?.branch?.branch_code}`,
                        "firstLabel": singleData.total_balance,
                        "secondLabel": singleData.total_paid
                    })
                }

            })
            setActualFormConfig((formConfig) => {
                formConfig['BarChartsData'][3]['data'] = data
                formConfig['BarChartsData'][3]['labels'] = {
                    "firstLabel": "Paid",
                    "secondLabel": "Balance"
                }
                formConfig['BarChartsData'][3]['colors'] = {
                    "firstLabel": "#4CAF50",
                    "secondLabel": "#FF9800"
                }
                formConfig['BarChartsData'][2]['data'] = [
                    {
                        "name": "Pending",
                        "value": res.data.data.summary.total_paid,
                        "color": "#FF4D4D"
                    },
                    {
                        "name": "Recieved",
                        "value": res.data.data.summary.total_balance,
                        "color": "#FFA500"
                    }
                ]
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