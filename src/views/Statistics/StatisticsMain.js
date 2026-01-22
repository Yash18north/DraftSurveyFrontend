import { Card, CardBody } from "react-bootstrap";
import { Row, Col, CardTitle, Button } from "reactstrap";
import BarChartSection from "../../components/common/elements/ChartSections/BarChartSection";
import { useEffect, useState } from "react";
import HeatMapSection from "../../components/common/elements/ChartSections/HeatMapSection";
import LineChartSection from "../../components/common/elements/ChartSections/LineChartSection";
import PieChartSection from "../../components/common/elements/ChartSections/PieChartSection";
import GaugeChartSection from "../../components/common/elements/ChartSections/GaugeChartSection";
import StackedChartSection from "../../components/common/elements/ChartSections/StackedChartSection";
import RenderFields from "../../components/common/RenderFields";
import OverlayLoading from "../../components/common/OverlayLoading";
import ViewFullChart from "./ViewFullChart";
import TableListData from "../../components/common/elements/ChartSections/TableListData";
import moment from "moment";
import { useSelector } from "react-redux";
import CompletedIcon from "../../assets/images/icons/Completed.svg";
const COLORS = ["#E53935", "#4CAF50", "#B71C1C", "#283593"];

const StatisticsMain = ({ formConfig, customFilterData, setCustomFilterData, commonDashboardFunctions, isOverlayLoader, setIsOverlayLoader }) => {
  // const [dashboardData, setDashboardData] = useState(formConfig);
  const dashboardData = formConfig
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
  const getCommonFieldsForFilter = (filterListing, isSubFilter) => {
    let fieldIndex = 0;
    const startDate = moment('01-09-2024', 'DD-MM-YYYY');
    const today = moment();
    const diffInDays = today.diff(startDate, 'days');
    return filterListing?.map((field, FldIndex) => {
      if (field.name === "sub_record_type") {
        if (customFilterData?.[1]?.sub_module_type === "Invoice") {
          return null
        }
      }
      if (field.type == "date") {
        field = {
          ...field,
          pastDate: true,
          pastdays: diffInDays,
          maxDate: moment()
        }
      }
      return isClear && (
        <div
          key={"Form-Accordion" + FldIndex}
          className={"col-md-" + field.width}
        >
          <RenderFields
            field={field}
            sectionIndex={isSubFilter ? 1 : 0}
            fieldIndex={isSubFilter ? 1 : 0}
            formData={customFilterData}
            handleFieldChange={handleFieldChange}
            masterOptions={[]}
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

  const getChartSection = (chart) => {
    let title = chart.title
    if (chart.isCustomFilter) {
      if (customFilterData?.[1]?.sub_module_type === "Invoice") {
        title = `${customFilterData?.[1]?.sub_module_type} By Branch-Wise`
      }
      else {
        title = `${customFilterData?.[1]?.sub_module_type} By ${customFilterData?.[1]?.sub_record_type}-Wise`
      }
    }

    return title
  }

  return (
    <div className="my-2 bg-white container-fluid">
      {isOverlayLoader && <OverlayLoading fullScreen={1} />}
      <Card className="section_card">
        <CardBody className="section_card_body">
          {/* Breadcrumb Navigation */}
          <CardTitle tag="h5" className="section_title section_title_support">

            <div className="list_breadcrumb">
              {[
                { "title": "#", "redirect": "#" },
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
          <div className="header_table">
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
          </div>
          <Row className="mt-3">
            {dashboardData && dashboardData.BarChartsData.map((chart, index) => {

              return (
                <Col key={index} xs={12} md={chart.width ?? 6} lg={chart.width ?? 6}>
                  <Card className={!(Array.isArray(chart?.data) && chart?.data.length > 0) ? "p-3 shadow-sm dashboard-chart-section dashboard-no-data" : "p-3 shadow-sm dashboard-chart-section"}>
                    <h5 className="section_heading dashboard-section_heading chart-main-Section">
                      <span>{getChartSection(chart)}</span>
                      <div>
                        <button
                          type="button"
                          className="iconBtn"
                          onClick={() => getFullChartData(chart)}
                        >
                          View Full
                        </button>
                      </div>
                    </h5>
                    <div className="custom-filter-section">
                      {chart.isCustomFilter && getCommonFieldsForFilter(chart.filterFields, 1)}
                    </div>
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

export default StatisticsMain;
