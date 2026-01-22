import StatisticsMain from "./StatisticsMain";
import formConfig from "../../formJsonData/Statistics/StatisticsData.json";
import { useEffect, useState } from "react";
import { getAllStatisticsData, getChartDataFromResponse } from "../../components/common/commonHandlerFunction/Statistics/Statisticshandlerfunctions";
const StatisticsData = () => {
    const [actualFormConfig, setActualFormConfig] = useState(formConfig);
    const [customFilterData, setCustomFilterData] = useState({});
    const [isOverlayLoader, setIsOverlayLoader] = useState(false);
    const [actualResponseData, setActualResponseData] = useState(null);
    useEffect(()=>{
        if(actualResponseData){
            getChartDataFromResponse(setActualFormConfig,actualResponseData,setIsOverlayLoader,customFilterData)
        }
    },[customFilterData?.[1]?.sub_module_type,customFilterData?.[1]?.sub_record_type])
    const commonDashboardFunctions = () => {
        getAllStatisticsData(setActualFormConfig, customFilterData,setIsOverlayLoader,setActualResponseData)
    }
    
    return (<StatisticsMain formConfig={actualFormConfig} customFilterData={customFilterData} setCustomFilterData={setCustomFilterData}  commonDashboardFunctions={commonDashboardFunctions} isOverlayLoader={isOverlayLoader} setIsOverlayLoader={setIsOverlayLoader}/>
    );
};

export default StatisticsData;
