import React, { useEffect, useState } from "react";
import { exprtAnalyticsDataFunc } from "../../components/common/commonHandlerFunction/dashboard/OperationOtherAnalystDashboardHandlerFunction";
const ViewFullChart = ({
    setIsFullChart,
    chart,
    fullChartData,
    customFilterData,
    setIsOverlayLoader
}) => {

    return (
        <div className="popupSearchContainerBG">

            <div className="popupInwardModal popupWidthAdjustmentInward viewfullChart">
                <div className="rejectSearchCross">
                    {
                        fullChartData?.isExport && <button
                            type="button"
                            className="iconBtn"
                            onClick={() => exprtAnalyticsDataFunc(fullChartData.apiEndPoint, customFilterData, setIsOverlayLoader, fullChartData.title)}
                        >
                            Export
                        </button>
                    }
                    <button
                        onClick={() => setIsFullChart(false)}
                        className="nonNativeButton2"
                        aria-label="Reject Button"
                    >
                        <i className="bi bi-x-lg h4"></i>
                    </button>
                </div>
                <h5 className="section_heading dashboard-section_heading chart-main-Section">
                    <span>{fullChartData.title}</span>
                </h5>
                {chart}
            </div>
        </div >
    );
};

export default ViewFullChart;
