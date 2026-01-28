import { Card, CardBody } from "react-bootstrap";
import { Row, Col, CardTitle, Button } from "reactstrap";
import BarChartSection from "../../components/common/elements/ChartSections/BarChartSection";
import { useEffect, useState } from "react";
import HeatMapSection from "../../components/common/elements/ChartSections/HeatMapSection";
import LineChartSection from "../../components/common/elements/ChartSections/LineChartSection";
import PieChartSection from "../../components/common/elements/ChartSections/PieChartSection";
import GaugeChartSection from "../../components/common/elements/ChartSections/GaugeChartSection";
import StackedChartSection from "../../components/common/elements/ChartSections/StackedChartSection";
import CompletedIcon from "../../assets/images/icons/Completed.svg";
import RenderFields from "../../components/common/RenderFields";
import OverlayLoading from "../../components/common/OverlayLoading";
import ViewFullChart from "./ViewFullChart";
import TableListData from "../../components/common/elements/ChartSections/TableListData";
import { getFormatedDate } from "../../services/commonFunction";
// import { exprtAnalyticsDataFunc } from "../../components/common/commonHandlerFunction/dashboard/OperationOtherAnalystDashboardHandlerFunction";
import moment from "moment";
import { useSelector } from "react-redux";
import { getAllBrancheDataforDropdown } from "../../components/common/commonHandlerFunction/jobinstructionHandlerFunctions";
const COLORS = ["#E53935", "#4CAF50", "#B71C1C", "#283593"];

const Dashboard = ({ formConfig, customFilterData, setCustomFilterData, isChartChanged, commonDashboardFunctions, isOverlayLoader, setIsOverlayLoader }) => {
  // const [dashboardData, setDashboardData] = useState(formConfig);
  const dashboardData = formConfig
  const [filterMasterOptions, setFilterMasterOptions] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isClear, setIsClear] = useState(true);
  const [isFullChart, setIsFullChart] = useState(false);
  const [fullChartData, setFullChartData] = useState(null);
  const session = useSelector((state) => state.session);
  const user = session.user;
  const handleFieldChange = (
    sectionIndex,
    fieldName,
    value,
    type = "",
    isChecked = ""
  ) => {
    if (type) {
      value = isChecked;
    }
    setCustomFilterData((prevFormData) => {
      return {
        ...prevFormData,
        [sectionIndex]: {
          ...prevFormData[sectionIndex],
          [fieldName]: value,
        },
      };
    });
  };
  const getCommonFieldsForFilter = (filterListing) => {
    let fieldIndex = 0;
    const startDate = moment('01-09-2024', 'DD-MM-YYYY');
    const today = moment();
    const diffInDays = today.diff(startDate, 'days');
    return filterListing?.map((field, FldIndex) => {
      if (field.type == "date") {
        field = {
          ...field,
          pastDate: true,
          pastdays: diffInDays,
          maxDate: moment()
        }
      }
      if (!['SU', 'BH', 'CU'].includes(user?.role)) {
        if (['branch_id', 'lab_id'].includes(field.name)) {
          return null
        }
      }
      return isClear && (
        <div
          key={"Form-Accordion" + FldIndex}
          className={"col-md-" + field.width}
        >
          <RenderFields
            field={field}
            sectionIndex={0}
            fieldIndex={0}
            formData={customFilterData}
            handleFieldChange={handleFieldChange}
            masterOptions={filterMasterOptions}
            upperClass={field.upperClass}
          />
        </div>
      )
    });
  };

  const getDynamicChart = (chart, isFullDetails) => {
    // Create a deep-enough copy so we don’t mutate original chart
    if (!chart.data) {
      chart.data = []
    }
    const chartCopy = {
      ...chart,
      data: [...chart.data],
      xLabels: chart.xLabels ? [...chart.xLabels] : [],
      yLabels: chart.yLabels ? [...chart.yLabels] : [],
      colors: chart.colors ? { ...chart.colors } : {},
    };

    if (!isFullDetails) {
      // Show last 5 rows

      // if (chartCopy.chartType === "heatmap") {
      //   chartCopy.yLabels = chartCopy.yLabels.slice(-4); // show last 4 yLabels
      //   chartCopy.xLabels = chartCopy.xLabels.slice(-4); // show last 4 xLabels
      //   chartCopy.data = chartCopy.data.slice(-5);
      // }
      // else if (chartCopy.chartType === "tableData") {
      //   chartCopy.data = chartCopy.data.slice(-10);
      // }
      // else {
      //   chartCopy.data = chartCopy.data.slice(-5);
      // }
      if (chartCopy.chartType === "heatmap") {
        chartCopy.yLabels = chartCopy.yLabels.slice(0, 5); // show last 4 yLabels
        chartCopy.xLabels = chartCopy.xLabels.slice(0, 5); // show last 4 xLabels
        chartCopy.data = chartCopy.data.slice(0, 5);
      }
      else if (chartCopy.chartType === "tableData") {
        chartCopy.data = chartCopy.data.slice(0, 10);
      }
      else if (chart.filterType === "monthly") {
        chartCopy.data = chartCopy.data.slice(-5);
      }
      else if (chartCopy.showRecords) {
        chartCopy.data = chartCopy.data.slice(0, chartCopy.showRecords);
      }
      else {
        chartCopy.data = chartCopy.data.slice(0, 5);
      }
    }

    switch (chartCopy.chartType) {
      case "heatmap":
        return (
          <HeatMapSection
            data={chartCopy.data}
            xLabels={chartCopy.xLabels}
            yLabels={chartCopy.yLabels}
            COLORS={COLORS}
            isFullDetails={isFullDetails}
          />
        );
      case "line":
        return (
          <LineChartSection
            data={chartCopy.data}
            labels={chartCopy.labels}
            COLORS={COLORS}
            isFullDetails={isFullDetails}
          />
        );
      case "pie":
        return (
          <PieChartSection
            data={chartCopy.data}
            labels={chartCopy.labels}
            COLORS={COLORS}
            isFullDetails={isFullDetails}
          />
        );
      case "gauge":
        return (
          <GaugeChartSection
            data={chartCopy.data}
            labels={chartCopy.labels}
            needleValue={25}
            COLORS={["#FF9800", '#4CAF50']}
            isFullDetails={isFullDetails}
          />
        );
      case "stackedBar":
        return (
          <StackedChartSection
            data={chartCopy.data}
            labels={chartCopy.labels}
            COLORS={chartCopy.colors}
            isFullDetails={isFullDetails}
          />
        );
      case "tableData":
        return (
          <TableListData
            data={chartCopy.data}
            headers={chartCopy.headers}
            isFullDetails={isFullDetails}
          />
        );
      default:
        return (
          <BarChartSection
            data={chartCopy.data}
            labels={chartCopy.labels}
            COLORS={COLORS}
            isFullDetails={isFullDetails}
            isQuantity={chart.isQuantity}
            isNoTShowInNormal={chart.isNoTShowInNormal}
          />
        );
    }
  };


  const clearFilter = () => {
    setCustomFilterData((prevFormData) => {
      return {
        ...prevFormData,
        [0]: {}
      };
    });

    setTimeout(() => {
      setIsClear(false)
      setTimeout(() => {
        setIsClear(true)
      }, 10)

    }, 10)
  }
  useEffect(() => {
    if (isClear) {
      commonDashboardFunctions()
    }
  }, [isClear])

  const getFullChartData = (chart) => {
    setFullChartData(chart)
    setIsFullChart(true)
  }
  useEffect(() => {
    if (['OPS', 'OTHER', 'CREDIT'].includes(formConfig?.moduleType)) {
      getAllBrancheDataforDropdown(setFilterMasterOptions, "branch_id", 1)
    }
  }, [])
  return (
    <div className="my-2 bg-white container-fluid">
      {isOverlayLoader && <OverlayLoading fullScreen={1} />}
      <Card className="section_card">
        <CardBody className="section_card_body">
          {/* Breadcrumb Navigation */}
          <CardTitle tag="h5" className="section_title section_title_support">

            <div className="list_breadcrumb">
              {[
                { "title": "Analytics", "redirect": "#" },
                { "title": formConfig.title, "redirect": "#" }
              ]?.map((title, i) => (
                <span key={"form-breadcom-main-" + i}>
                  {i === 0 ? null : (
                    <i
                      className="bi bi-chevron-right card-title-icon"
                      key={"form-breadcom-icon" + i}
                    ></i>
                  )}{" "}
                  {title.title}
                </span>
              ))}
            </div>
          </CardTitle>
          {/* Charts Section */}
          {dashboardData.isFilter &&
            <>
              <Card className="p-3 shadow-sm">
                <Row className="justify-content-center">
                  {getCommonFieldsForFilter(dashboardData.filterListing)}
                </Row>
                <div className="submitBtn_container">
                  <Button
                    type="button"
                    className="submitBtn"
                    id="submit_btn1"
                    onClick={() => {
                      setIsFiltered(true)
                      commonDashboardFunctions()
                    }}
                  >
                    Search
                  </Button>
                  {isFiltered && <Button
                    type="button"
                    className="submitBtn"
                    id="submit_btn1"
                    onClick={() => {
                      setIsFiltered(false)
                      clearFilter()
                    }}
                  >
                    Clear
                  </Button>}
                </div>
              </Card>
              <br />
            </>
          }


          {/* Summary Cards */}

          {dashboardData.summary.length ? <div className="header_table">
            <Row className="justify-content-center dashboard-analytics">
              {dashboardData.summary.map((item, index) => (
                <>
                  <Col xs={dashboardData.summary.length > 3 ? 3 : 4} key={index}>
                    <div className="header_table_status_item">
                      <img
                        src={CompletedIcon}
                        alt="jrf Icon"
                      />

                      {/* <Card className="text-center p-3 shadow-sm dashboard-summery"> */}
                      <div className={"header_table_status_count "}>

                        <p>{item.value}</p>
                        <div>{item.label}</div>
                        {/* </Card> */}
                      </div>

                    </div>
                  </Col >
                </>

              ))}
            </Row>
          </div> : null}




          <Row className="mt-3">
            {dashboardData && dashboardData.BarChartsData.map((chart, index) => {
              const obj = { ...customFilterData?.[0] };

              const today = new Date();
              const formatDate = (date) => date.toISOString().split("T")[0]; // 'YYYY-MM-DD'
              let firstDate = "";
              let lastDate = "";
              chart.filterType = "yearly"
              if (chart.filterType === "monthly") {
                const fiveMonthsAgo = new Date(today);
                fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);
                firstDate = formatDate(fiveMonthsAgo);
                lastDate = formatDate(today);
              }
              else if (chart.filterType === "yearly") {
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
              return !chart.isNoNeeded && (
                <Col key={index} xs={12} md={6} lg={6}>
                  <Card className={!(Array.isArray(chart?.data) && chart?.data.length > 0) ? "p-3 shadow-sm dashboard-chart-section dashboard-no-data" : "p-3 shadow-sm dashboard-chart-section"}>
                    <h5 className="section_heading dashboard-section_heading chart-main-Section">
                      <span>{chart.title}</span>
                      <div>
                        {
                          chart?.isExport && <button
                            type="button"
                            className="iconBtn"
                            // onClick={() => exprtAnalyticsDataFunc(chart.apiEndPoint, customFilterData, setIsOverlayLoader, chart.title)}
                          >
                            Export
                          </button>
                        }
                        {" "}
                        <button
                          type="button"
                          className="iconBtn"
                          onClick={() => getFullChartData(chart)}
                        >
                          View Full
                        </button>
                      </div>
                    </h5>
                    <span className="filterDateSection">Filter Date : {getFormatedDate(obj.start_date, 1)} - {getFormatedDate(obj.end_date, 1)}</span>
                    {
                      getDynamicChart(chart)
                    }
                  </Card>
                </Col>
              )
            })}
          </Row>
        </CardBody>
      </Card>

      {isFullChart && <ViewFullChart setIsFullChart={setIsFullChart} chart={getDynamicChart(fullChartData, 1)} fullChartData={fullChartData} customFilterData={customFilterData} setIsOverlayLoader={setIsOverlayLoader} />}
    </div >
  );
};

export default Dashboard;
