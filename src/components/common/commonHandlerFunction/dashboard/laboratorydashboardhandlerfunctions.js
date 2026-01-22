import { data } from "jquery";
import { getAnalyticsSampleAnalyzedApi, getAnalyticsSampleSubmissionTrendApi, getAVGSampleAnalysusCountApi, getClientPaymentCountApi, getClientRevenueChartApi, getExternalSampleCountApi, getSampleAnalyzedDataApi, getUserSampleHeatMapApi } from "../../../../services/api";
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


export const getSampleAnalyzedDataFunc = async (setActualFormConfig, setIsChartChanged, formData, setIsOverlayLoader) => {
    try {
        setIsOverlayLoader(true);
        let queristring = getQueryStringData(formData)
        let res = await getDataFromApi(getSampleAnalyzedDataApi + queristring);
        if (res?.data?.status === 200 && res.data.data) {
            setActualFormConfig((formConfig) => {
                const chartDataMap = new Map();

                const externalSamples = res?.data?.data?.external_samples?.commodity_breakdown || [];
                const internalSamples = res?.data?.data?.internal_samples?.commodity_breakdown || [];

                // Merge external samples
                externalSamples.forEach(item => {
                    chartDataMap.set(item.commodity_id, {
                        name: item.commodity_name,
                        external_count: item.sample_count,
                        internal_count: 0
                    });
                });

                // Merge internal samples
                internalSamples.forEach(item => {
                    if (chartDataMap.has(item.commodity_id)) {
                        chartDataMap.get(item.commodity_id).internal_count = item.sample_count;
                    } else {
                        chartDataMap.set(item.commodity_id, {
                            name: item.commodity_name,
                            external_count: 0,
                            internal_count: item.sample_count
                        });
                    }
                });

                // Convert to array
                const combinedData = Array.from(chartDataMap.values());

                formConfig['BarChartsData'][0]['data'] = combinedData;
                formConfig['BarChartsData'][0]['labels'] = {
                    "external_count": "External Samples",
                    "internal_count": "Regular Samples"
                };

                return formConfig;
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

export const getUserSampleHeatMapDataFunc = async (setActualFormConfig, setIsChartChanged, formData, setIsOverlayLoader) => {
    try {
        setIsOverlayLoader(true);
        let queristring = getQueryStringData(formData)
        queristring = queristring + (queristring ? '&' : '?') + "role=LC"
        let res = await getDataFromApi(getUserSampleHeatMapApi + queristring);
        if (res?.data?.status === 200 && res.data.data) {
            // let data=[]
            const heatmapAnalyticsData = res.data.data.heatmap_data
            const yLabels = heatmapAnalyticsData.map(a => a.name);
            let xLabels = []
            if (heatmapAnalyticsData.length > 0) {
                xLabels = heatmapAnalyticsData[0].daily_counts.map(d => {
                    const date = new Date(d.date);

                    const formatted = date.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                    });
                    return formatted
                });
            }


            const data = heatmapAnalyticsData.map(analyst =>
                analyst.daily_counts.map(day => day.count)
            );
            const heatmapInput = {
                xLabels,
                yLabels,
                data
            };
            setActualFormConfig((formConfig) => {
                formConfig['BarChartsData'][1]['data'] = heatmapInput.data
                formConfig['BarChartsData'][1]['xLabels'] = heatmapInput.xLabels
                formConfig['BarChartsData'][1]['yLabels'] = heatmapInput.yLabels
                return formConfig
            });
        }
        else {
            setActualFormConfig((formConfig) => {
                formConfig['BarChartsData'][1]['data'] = []
                formConfig['BarChartsData'][1]['xLabels'] = []
                formConfig['BarChartsData'][1]['yLabels'] = []
                return formConfig
            });
        }
    } catch (error) {
        setActualFormConfig((formConfig) => {
            formConfig['BarChartsData'][1]['data'] = []
            formConfig['BarChartsData'][1]['xLabels'] = []
            formConfig['BarChartsData'][1]['yLabels'] = []
            return formConfig
        });
        console.error(error);
    } finally {
        setIsOverlayLoader(false);
        setIsChartChanged(false)
        setTimeout(() => {
            setIsChartChanged(true)
        }, 10)
    }
};
export const getAnalylizedSampleAnalyzedFunc = async (setActualFormConfig, setIsChartChanged, formData, setIsOverlayLoader) => {
    try {
        setIsOverlayLoader(true);
        let queristring = getQueryStringData(formData, 1)
        let res = await getDataFromApi(getAnalyticsSampleAnalyzedApi + queristring);
        if (res?.data?.status === 200) {
            if (res?.data?.data?.chart_data) {
                setActualFormConfig((formConfig) => {
                    let chartData = res.data.data.chart_data.map((singleData) => {
                        return {
                            month: singleData.month,
                            external_samples: singleData.external_samples,
                            internal_samples: singleData.internal_samples,
                        }
                    })
                    formConfig['BarChartsData'][2]['data'] = chartData
                    formConfig['BarChartsData'][2]['labels'] = {
                        "external_samples": "External Samples",
                        "internal_samples": "Regular Samples"
                    }
                    return formConfig
                });
            }
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
export const getClientRevenueChartDataFunc = async (setActualFormConfig, setIsChartChanged, formData, setIsOverlayLoader) => {
    try {
        setIsOverlayLoader(true);
        let queristring = getQueryStringData(formData, "", 1)
        let res = await getDataFromApi(getClientRevenueChartApi + queristring);
        if (res?.data?.status === 200 && res.data.data) {
            let revenueData = []
            // res.data.data.chart_data.map((singleData) => {
            //     revenueData.push({
            //         "name": singleData.client_name,
            //         "value": singleData.revenue
            //     })
            // })
            // setActualFormConfig((formConfig) => {
            //     formConfig['BarChartsData'][3]['data'] = revenueData
            //     formConfig['BarChartsData'][3]['labels'] = "Sales Chart"
            //     return formConfig
            // });
            // setActualFormConfig((formConfig) => {

            //     let chartData = res?.data?.data?.chart_data?.map((singleData) => {
            //         return {
            //             name: singleData.client_name,
            //             revenue: singleData.revenue
            //         }
            //     })
            //     console.log('chartData', chartData)
            //     formConfig['BarChartsData'][3]['data'] = chartData
            //     formConfig['BarChartsData'][3]['labels'] = {
            //         "revenue": "Sales Chart",
            //     }
            //     return formConfig
            // })
            res.data.data.chart_data.map((singleData) => {
                revenueData.push({
                    "category": singleData.client_name,
                    "firstLabel": singleData.revenue,
                    "secondLabel": ''
                })
            })
            setActualFormConfig((formConfig) => {
                formConfig['BarChartsData'][3]['data'] = revenueData
                formConfig['BarChartsData'][3]['labels'] = {
                    "firstLabel": "Sales Chart"
                }
                formConfig['BarChartsData'][3]['colors'] = {
                    "firstLabel": "#4CAF50"
                }
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

export const getExternalSampleCountFunc = async (setActualFormConfig, setIsChartChanged, formData, setIsOverlayLoader) => {
    try {
        let queristring = getQueryStringData(formData)
        let res = await getDataFromApi(getExternalSampleCountApi + queristring);
        if (res?.data?.status === 200 && res.data.data) {
            setActualFormConfig((formConfig) => {
                const currentMonthCount = parseInt(res.data.data?.current_month?.jrf_count) + parseInt(res.data.data?.current_month?.sample_count)
                const currentYearCount = parseInt(res.data.data?.financial_year?.jrf_count) + parseInt(res.data.data?.financial_year?.sample_count)

                let summaryData = currentMonthCount + ' / ' + currentYearCount
                formConfig['summary'][0]['value'] = summaryData
                return formConfig
            });
        }
    } catch (error) {
        console.error(error);
    } finally {
        setIsChartChanged(false)
        setTimeout(() => {
            setIsChartChanged(true)
        }, 10)
    }
};

export const getAnalyticsSampleSubmissionTrendFunc = async (setActualFormConfig, setIsChartChanged, formData, setIsOverlayLoader) => {
    try {
        setIsOverlayLoader(true);
        let queristring = getQueryStringData(formData)
        // let queristring = "?months=2"
        let res = await getDataFromApi(getAnalyticsSampleSubmissionTrendApi + queristring);
        if (res?.data?.status === 200) {
            setActualFormConfig((formConfig) => {
                let summaryData = res.data.data.statistics.max_monthly_samples + ' / ' + res.data.data.statistics.total_samples
                formConfig['summary'][0]['value'] = summaryData
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

export const getClientPaymentCountFunc = async (setActualFormConfig, setIsChartChanged, formData, setIsOverlayLoader) => {
    setActualFormConfig((formConfig) => {
        formConfig['summary'][1]['value'] = 0
        return formConfig
    });
    return
    try {
        setIsOverlayLoader(true);
        let queristring = getQueryStringData(formData)
        let res = await getDataFromApi(getClientPaymentCountApi + queristring);
        if (res?.data?.status === 200) {
            setActualFormConfig((formConfig) => {
                let summaryData = res.data.data.statistics.total_paid
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

export const getAVGSampleAnalysusCountFunc = async (setActualFormConfig, setIsChartChanged, formData, setIsOverlayLoader) => {
    try {
        setIsOverlayLoader(true);
        let queristring = getQueryStringData(formData)
        let res = await getDataFromApi(getAVGSampleAnalysusCountApi + queristring);
        if (res?.data?.status === 200) {
            setActualFormConfig((formConfig) => {
                let summaryData = res.data.data.summary.overall_analyst_avg
                formConfig['summary'][2]['value'] = summaryData
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