import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesome
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons"; // Import Calendar Icon
const popupSearch = ({
  setSearchby,
  searchConfigJson,
  setFilterIndex,
  filterIndex,
  handleSearchFilter,
  searchFormData,
  searchFormDataType,
  setSearchFormDataErros,
  searchFormDataErros,
  setSearchFormData,
  getAllListingData,
  setisFilterBtnclicked,
  user,
  moduleType
}) => {
  const purchaseRequisitionDepartment = [
    { label: "Field Sampling" },
    { label: "Chemical Analysis" },
    { label: "Quality Assurance" },
    { label: "Instrumentation & Calibration" },
    { label: "Reporting" },
    { label: "Field Instrumentation & Survey" }
  ];
  const addMoreSearchFilter = () => {
    let isValide = true;
    let errorData = {};
    for (let index = 1; index <= filterIndex; index++) {
      if (!searchFormData?.["fieldWiseFilter_" + index]) {
        isValide = false;
        errorData["fieldWiseFilter_" + index] = "This field is required";
      }
      if (!searchFormData?.["fieldWiseFilterOption_" + index]) {
        isValide = false;
        errorData["fieldWiseFilterOption_" + index] = "This field is required";
      }
      if (!searchFormData?.["fieldWiseFilterValue_" + index]) {
        isValide = false;
        errorData["fieldWiseFilterValue_" + index] = "This field is required";
      }
    }
    setSearchFormDataErros(errorData);
    if (isValide) {
      setFilterIndex(filterIndex + 1);
    }
  };
  const removeSearchFilter = () => {
    setSearchFormData((prevFormData) => {
      return {
        ...prevFormData,
        ["fieldWiseFilter_" + filterIndex]: "",
        ["fieldWiseFilterOption_" + filterIndex]: "",
        ["fieldWiseFilterValue_" + filterIndex]: "",
      };
    });
    setFilterIndex(filterIndex - 1);
  };
  const getFilterSignOption = (index) => {
    let type = searchFormDataType?.["fieldWiseFilter_" + index];
    let optionData;
    let textType = "text";
    let filteredData = [];
    if (searchConfigJson.length > 0) {
      filteredData = searchConfigJson.filter((field) => {
        return field.name === searchFormData?.["fieldWiseFilter_" + index];
      });
    }
    optionData = filteredData.length > 0 ? filteredData[0].options : [];
    if (['date', 'datetime', 'select'].includes(type)) {
      textType = "date";
      if (['select'].includes(type)) {
        textType = type;
      }

    }
    return {
      textType: textType,
      optionData: optionData,
      ddOptions: filteredData?.[0]?.ddOptions,
    };
  };
  const getSeachFildData = () => {
    let filterHtml = [];
    for (let index = 1; index <= filterIndex; index++) {
      let optionData = getFilterSignOption(index);
      let textType = optionData.textType;
      let filterOptions = optionData.optionData;

      filterHtml.push(
        <span>
          <div className="popupSearchFilterContainer">
            <div>
              <select
                name={"fieldWiseFilter_" + index}
                onChange={(e) => handleSearchFilter(e, 1)}
                value={searchFormData?.["fieldWiseFilter_" + index]}
                className="popSeaarchOne"
              >
                <option value={""}>Select</option>
                {searchConfigJson?.map((field) =>
                  user?.role === "BU" &&
                    field.name === "jrf_finalize_timeframe" ? null : (
                    <option
                      value={field.name}
                      data-type={field.type}
                      key={field.name + index}
                    >
                      {field.label}
                    </option>
                  )
                )}
              </select>
              {searchFormDataErros?.["fieldWiseFilter_" + index] && (
                <p className="text-danger errorMsg">
                  {searchFormDataErros?.["fieldWiseFilter_" + index]}
                </p>
              )}
            </div>
            <div>
              <select
                name={"fieldWiseFilterOption_" + index}
                onChange={(e) => handleSearchFilter(e)}
                value={searchFormData?.["fieldWiseFilterOption_" + index]}
                className="secondSelect"

              >
                <option value="">Select</option>
                {filterOptions.map((option, optionIndex) => (
                  <option value={option.value} key={option.label + optionIndex}>
                    {option.label}
                  </option>
                ))}
              </select>
              {searchFormDataErros?.["fieldWiseFilterOption_" + index] && (
                <p className="text-danger errorMsg">
                  {searchFormDataErros?.["fieldWiseFilterOption_" + index]}
                </p>
              )}
            </div>
            <div className={"sizeFieldDate"}>
              <div style={{ position: 'relative', display: 'inline-block' }} className="inputField">
                {
                  textType === "select" ?
                    (<select
                      name={"fieldWiseFilterValue_" + index}
                      onChange={(e) => handleSearchFilter(e)}
                      value={searchFormData?.["fieldWiseFilterValue_" + index]}
                      className="secondSelect"

                    >
                      <option value="">Select</option>
                      {optionData.ddOptions.map((option, optionIndex) => (
                        <option value={option.value || option.label} key={option.label + optionIndex}>
                          {option.label}
                        </option>
                      ))}
                    </select>)
                    :
                    <input
                      type={textType}
                      name={"fieldWiseFilterValue_" + index}
                      onChange={(e) => handleSearchFilter(e)}
                      value={searchFormData?.["fieldWiseFilterValue_" + index]}
                      style={{
                        paddingRight: textType === "date" ? "30px" : "",
                        appearance: textType === "date" ? "none" : "",
                        WebkitAppearance: textType === "date" ? "none" : "",
                        MozAppearance: textType === "date" ? "none" : "",
                        background: textType === "date" ? "none" : "", // Remove the background if necessary
                      }}
                    />
                }

                {/* {textType === "date" && (

                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    // icon="far fa-calendar-alt"
                    // icon="fa-regular fa-calendar"
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "10px", // Position the icon on the right side
                      transform: "translateY(-50%)",
                      color: "#616161",
                      pointerEvents: "none", // Prevent the icon from blocking the input
                    }}
                  />

                )} */}
              </div>

              {searchFormDataErros?.["fieldWiseFilterValue_" + index] && (
                <p className="text-danger errorMsg">
                  {searchFormDataErros?.["fieldWiseFilterValue_" + index]}
                </p>
              )}

              {index !== 1 && filterIndex === index && (
                <div className="removeBtnPopUpSearch">
                  <button
                    type="button"
                    className="filterBtn"
                    onClick={removeSearchFilter}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

          </div>
        </span>
      );
    }
    return filterHtml;
  };
  return (
    <div className="popupSearchContainerBG" style={{ zIndex: 9 }}>
      <div className="popupSearchContainer ">
        <h2 className="section_heading">
          Advanced Search
          <button
            onClick={() => setSearchby((prev) => !prev)}
            className="nonNativeButton2"
            aria-label="Close Button"
          >
            <i className="bi bi-x-lg h4" />
          </button>
        </h2>
        <h5>Filters</h5>
        {getSeachFildData()}

        {filterIndex <= 3 && (
          <button
            type="button"
            className="filterBtn"
            onClick={addMoreSearchFilter}
          >
            Add Filter
          </button>
        )}


        <div className="popupSearchButtonsContainer">
          <div className="popupSearchButtons">
            <button type="button" onClick={() => setSearchby((prev) => !prev)}>
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setisFilterBtnclicked(true);
                setSearchby((prev) => !prev);
                getAllListingData();
              }}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default popupSearch;
