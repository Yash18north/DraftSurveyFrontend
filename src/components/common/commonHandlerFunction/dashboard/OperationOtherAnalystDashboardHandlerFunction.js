import { toast } from "react-toastify";
import { getBranchLoadingUnloadingApi, getClientPaymentStackbarApi, getClientPaymentTableDataApi, getCommodityWiseSalesDataApi, getMonthSalesTrendApi, getOPSModeWiseJobsDataApi, getPortLoadingUnloadingApi, getPortLoadingUnloadingCountApi, getSalesPersonPerformanceTableDataApi, getStateWisePaymentDataApi } from "../../../../services/api"
import { formatCurrency } from "../../../../services/commonFunction";
import { getDataFromApi } from "../../../../services/commonServices"
import { saveAs } from "file-saver";
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

export const getPortLoadingUnloadingFunc = async (setActualFormConfig, setIsChartChanged, formData, setIsOverlayLoader) => {
    try {
        setIsOverlayLoader(true);
        let queristring = getQueryStringData(formData, "", 1)
        let res = await getDataFromApi(getPortLoadingUnloadingApi + queristring);
        if (res?.data?.status === 200) {
            setActualFormConfig((formConfig) => {
                const data = []
                res.data.data.chart_data.map((singleData) => {
                    data.push({
                        "name": singleData.port_name,
                        "loading_count": singleData.loading_quantity,
                        "unloading_count": singleData.unloading_quantity,
                    })
                })
                formConfig['BarChartsData'][0]['data'] = data
                // let chartdata = res.data.data.statistics.total_loading + ' / ' + res.data.data.statistics.total_unloading
                // formConfig['summary'][1]['value'] = chartdata
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

export const getBranchLoadingUnloadingFunc = async (setActualFormConfig, setIsChartChanged, formData, setIsOverlayLoader) => {
    try {
        setIsOverlayLoader(true);
        let queristring = getQueryStringData(formData, "", 1)
        let res = await getDataFromApi(getBranchLoadingUnloadingApi + queristring);
        if (res?.data?.status === 200) {
            setActualFormConfig((formConfig) => {
                const data = []
                res.data.data.chart_data.map((singleData) => {
                    data.push({
                        "name": `${singleData.branch_code}`,
                        "loading_count": singleData.loading_count,
                        "unloading_count": singleData.unloading_count,
                    })
                })
                formConfig['BarChartsData'][1]['data'] = data
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

export const getPortLoadingUnloadingCountFunc = async (setActualFormConfig, setIsChartChanged, formData, setIsOverlayLoader) => {
    try {
        setIsOverlayLoader(true);
        let queristring = getQueryStringData(formData, "", 1)
        let res = await getDataFromApi(getPortLoadingUnloadingCountApi + queristring);
        if (res?.data?.status === 200) {
            setActualFormConfig((formConfig) => {
                const data = res.data.data.summary.loading_count + ' / ' + res.data.data.summary.unloading_count
                formConfig['summary'][0]['value'] = data
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

export const getAnalyticsSampleAnalyzedOtherFunc = async (setActualFormConfig, setIsChartChanged, formData, setIsOverlayLoader, isForCount) => {
    try {
        setIsOverlayLoader(true);
        let queristring = getQueryStringData(formData, 1)
        // let queristring = "?months=2"
        let res = await getDataFromApi(getMonthSalesTrendApi + queristring);
        if (res?.data?.status === 200) {
            setActualFormConfig((formConfig) => {
                let chartdata = res.data.data.chart_data.map((singledata) => {
                    return {
                        "month": singledata.month_name,
                        "sales": singledata.sales,
                    }
                })
                formConfig['BarChartsData'][0]['data'] = chartdata
                formConfig['BarChartsData'][0]['labels'] = {
                    "sales": "Sales"
                }
                let data = "₹" + formatCurrency(res.data.data.statistics.average_monthly_sales) + ' / ' + "₹" + formatCurrency(res.data.data.statistics.total_sales)
                formConfig['summary'][0]['value'] = data
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

export const getClientPaymentStackbarOtherFunc = async (setActualFormConfig, setIsChartChanged, formData, setIsOverlayLoader) => {
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
                formConfig['BarChartsData'][3]['data'] = data
                formConfig['BarChartsData'][3]['labels'] = {
                    "firstLabel": "Paid",
                    "secondLabel": "Balance"
                }
                formConfig['BarChartsData'][3]['colors'] = {
                    "firstLabel": "#4CAF50",
                    "secondLabel": "#FF9800"
                }

                let chartdata = res.data.data.statistics.total_paid + ' / ' + res.data.data.statistics.total_balance
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

export const getClientPaymentTableDataFunc = async (setActualFormConfig, setIsChartChanged, formData, setIsOverlayLoader) => {
    try {
        setIsOverlayLoader(true);
        let queristring = getQueryStringData(formData, "", 1)
        let res = await getDataFromApi(getClientPaymentTableDataApi + queristring);
        if (res?.data?.status === 200) {
            let data = []
            res.data.data.branch_summary.map((singleData) => {
                if (singleData.total_balance || singleData.total_paid) {
                    data.push({
                        "category": singleData?.branch?.branch_code,
                        "firstLabel": singleData.total_balance,
                        "secondLabel": singleData.total_paid
                    })
                }
            })
            setActualFormConfig((formConfig) => {
                let chartdata = []
                res.data.data.branch_summary && res.data.data.branch_summary.map((singleData) => {
                    if (singleData.total_balance || singleData.total_paid) {
                        chartdata.push({
                            "category": singleData?.branch?.branch_code,
                            "firstLabel": singleData.total_balance,
                            "secondLabel": singleData.total_paid
                        })
                    }
                })
                formConfig['BarChartsData'][2]['data'] = chartdata
                formConfig['BarChartsData'][2]['labels'] = {
                    "firstLabel": "Paid",
                    "secondLabel": "Balance"
                }
                formConfig['BarChartsData'][2]['colors'] = {
                    "firstLabel": "#4CAF50",
                    "secondLabel": "#FF9800"
                }
                let summary = "₹" + formatCurrency(res?.data?.data?.summary?.total_balance) + ' / ' + "₹" + formatCurrency(res?.data?.data?.summary?.total_paid)
                formConfig['summary'][1]['value'] = summary
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
export const getSalesPersonPerformanceTableDataFunc = async (setActualFormConfig, setIsChartChanged, formData, setIsOverlayLoader) => {
    try {
        setIsOverlayLoader(true);
        let queristring = getQueryStringData(formData, "", 1)
        let res = await getDataFromApi(getSalesPersonPerformanceTableDataApi + queristring);
        if (res?.data?.status === 200) {
            let data = []
            res.data.data.salesperson_data.map((singleData) => {
                data.push({
                    "category": singleData?.person_name,
                    "firstLabel": singleData.sales_generated
                })
            })
            setActualFormConfig((formConfig) => {
                formConfig['BarChartsData'][3]['data'] = data
                formConfig['BarChartsData'][3]['labels'] = {
                    "firstLabel": "Sales Generated",
                }
                formConfig['BarChartsData'][3]['colors'] = {
                    "firstLabel": "#4CAF50",
                }
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
export const getStateWisePaymentDataFunc = async (setActualFormConfig, setIsChartChanged, formData, setIsOverlayLoader) => {
    try {
        setIsOverlayLoader(true);
        let queristring = getQueryStringData(formData, "", 1)
        let res = await getDataFromApi(getStateWisePaymentDataApi + queristring);
        if (res?.data?.status === 200) {
            let data = []
            res.data.data.state_data.map((singleData) => {
                data.push({
                    "category": singleData?.state_name,
                    "firstLabel": singleData.total_revenue
                })
            })
            setActualFormConfig((formConfig) => {
                formConfig['BarChartsData'][1]['data'] = data
                formConfig['BarChartsData'][1]['labels'] = {
                    "firstLabel": "Revenue",
                }
                formConfig['BarChartsData'][1]['colors'] = {
                    "firstLabel": "#4CAF50",
                }
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

export const getCommodityWiseSalesDataFunc = async (setActualFormConfig, setIsChartChanged, formData, setIsOverlayLoader) => {
    try {
        setIsOverlayLoader(true);
        let queristring = getQueryStringData(formData, "", 1)
        let res = await getDataFromApi(getCommodityWiseSalesDataApi + queristring);
        if (res?.data?.status === 200) {
            let data = []
            res.data.data.commodity_data.map((singleData) => {
                data.push({
                    "category": singleData?.commodity_name,
                    "firstLabel": singleData.total_sales
                })
            })
            setActualFormConfig((formConfig) => {
                formConfig['BarChartsData'][4]['data'] = data
                formConfig['BarChartsData'][4]['labels'] = {
                    "firstLabel": "Sales",
                }
                formConfig['BarChartsData'][4]['colors'] = {
                    "firstLabel": "#4CAF50",
                }
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

export const getOPSModeWiseJobsDataFunc = async (setActualFormConfig, setIsChartChanged, formData, setIsOverlayLoader) => {
    try {
        setIsOverlayLoader(true);
        let queristring = getQueryStringData(formData, "", 1)
        let res = await getDataFromApi(getOPSModeWiseJobsDataApi + queristring);
        if (res?.data?.status === 200) {
            let data = []
            setActualFormConfig((formConfig) => {
                let operation_type_data = res.data.data.operation_type_data
                formConfig['BarChartsData'][5]['data'] = operation_type_data.map((singleData) => {
                    return {
                        name: singleData.operation_type_name,
                        count: singleData.count,
                    }
                })
                formConfig['BarChartsData'][5]['labels'] = {
                    "count": "Jobs Count"
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

export const exprtAnalyticsDataFunc = async (apiEndpoint, formData, setIsOverlayLoader, fileName) => {
    try {
        setIsOverlayLoader(true);
        let queristring = getQueryStringData(formData, "", 1)
        queristring += '&export=csv'
        let res = await getDataFromApi(apiEndpoint + queristring, "", "", 1);
        if (res?.status === 200) {
            const blob = new Blob([res.data], {
                type: "text/csv;charset=utf-8;"
            });
            const excelFileName = fileName + ".csv"; // Change the extension to .xls if needed
            saveAs(blob, excelFileName);
        }
        else {
            toast.error(res.message, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    } catch (error) {
        console.error(error);
    } finally {
        setIsOverlayLoader(false)
    }
};