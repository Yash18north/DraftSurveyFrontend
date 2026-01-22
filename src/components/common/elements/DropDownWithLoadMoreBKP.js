import React, { useState, useEffect, useRef } from "react";
import {
  getDataFromApi,
  postDataFromApi,
} from "../../../services/commonServices";
import { Dropdown } from "react-bootstrap";
import PropTypes from "prop-types";
import {
  decryptDataForURL
} from "../../../utills/useCryptoUtils";

const DropDownWithLoadMore = ({ field }) => {
  let {
    name,
    label,
    value,
    onChange,
    required,
    options,
    fieldWidth,
    masterOptions,
    customname,
    from,
    placeholder,
    actionClicked,
    isSearchable,
    readOnly,
    model_name,
    apiendpoint,
    apimethod,
    optionData,
    labelWidth,
    isCustomPayload,
    formData,
    setFormData,
    customPayload,
    queryString,
    moduleType,
    isEditMode,
    upperClass,
    allProps
  } = field;


  const [items, setItems] = useState([]);
  const [nextPage, setNextPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [defaultValue, setDefaultValue] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [totalPage, setTotalPage] = useState(10);

  const [isCalled, setISCalled] = useState(false);
  const [defaultOptions, setDefaultOption] = useState(null);
  const dropdownMenuRef = useRef(null);
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setNextPage(1);
  };
  useEffect(() => {
    if (isCustomPayload) {
      if (formData[0]?.[customPayload?.value] || customPayload.defaultValue) {
        // if (!(isEditMode)) {
        // if (!(isEditMode && ['operationCertificate', 'jobinstruction', 'vesselJICertificate', 'consortiumorder'].includes(moduleType))) {
        fetchData(searchQuery.length > 2 || searchQuery.length === 0);
        // }
      }
    }
    else {
      if (searchQuery) {
        if (searchQuery.length > 2) {
          fetchData(true);
        }
      }
      else {
        // if (!(isEditMode && ['operationCertificate', 'jobinstruction', 'vesselJICertificate', 'consortiumorder'].includes(moduleType))) {
        // if (!(isEditMode)) {
        fetchData(true);


        // }
      }
    }
  }, [formData[0]?.[customPayload?.value], searchQuery])
  const fetchData = async (reset = false, forDefaulrshow = "") => {
    try {
      let tempBody = {
        model_name: model_name,
        load_more: true,
        is_dropdown: true,
        is_search_dropdowm: true,
      };
      if (forDefaulrshow) {
        tempBody.pre_selected_id = value;
      }
      if (name == "fk_invoice_branchid") {
        tempBody.is_invoice_state = true;
      }

      let res;

      let newEndPoint =
        nextPage > 0
          ? `${apiendpoint}?${queryString ? queryString + '&' : ''}page=${nextPage}&search=${searchQuery}`
          : `${apiendpoint}?${queryString ? queryString + '&' : ''}search=${searchQuery}`;
      if (allProps?.isIncludes) {
        if (apimethod === "GET") {
          newEndPoint = newEndPoint + "&default_data=" + allProps?.includesData
        }
        else {
          tempBody.default_data = allProps?.includesData;
        }
      }

      let customBody = {
        // cmd_id: 1,
        is_dropdown: true,
        search_text: searchQuery,
        model_name: model_name,
      }
      if (isCustomPayload) {
        if (apimethod === "GET") {
          newEndPoint = newEndPoint + `&${customPayload?.name}=${formData[0]?.[customPayload?.value] || customPayload.defaultValue}`
        } else {
          customBody[customPayload?.name] = formData[0]?.[customPayload?.value] || customPayload.defaultValue
        }

      }
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.split("?")[1]);
      const Type = decryptDataForURL(params.get("type"));



      if (apimethod === "GET") {
        newEndPoint =
          newEndPoint + "&is_dropdown=" + true + "&load_more=" + true;
        if (forDefaulrshow) {
          if (value != "NA") {
            newEndPoint = newEndPoint + "&pre_selected_id=" + value;
          }
        }
        res = await getDataFromApi(newEndPoint, tempBody, "");
      } else if (apimethod === "POST") {
        if (isCustomPayload) {
          res = await postDataFromApi(newEndPoint, customBody);
        }
        else {
          res = await postDataFromApi(newEndPoint, tempBody);
        }
      }

      if (res.data.status === 200) {
        setISCalled(true);
        setTotalPage(res.data.total_pages || 10);
        // if (name == "fk_invoice_branchid") {
        //   setFormData((prevFormData) => {
        //     return {
        //       ...prevFormData,
        //       [0]: {
        //         ...prevFormData[0],
        //         "fk_im_state": res.data.data?.[0]?.fk_br_state__state_name,
        //         // "im_billtoplace": res.data.data?.[0]?.fk_br_state__state_name,
        //         // "im_shiptoplace": res.data.data?.[0]?.fk_br_state__state_name,
        //       },
        //     };
        //   });
        // }
        if (forDefaulrshow) {
          const preSeleOpt = res?.data?.data?.find((singleVal, i) => singleVal[optionData.id] == value)
          setDefaultOption(preSeleOpt)
        }
        if (reset) {
          setItems(res?.data?.data);
        } else {
          setItems((prevItems) => [...prevItems, ...res.data.data]);
        }
        setHasMore(res?.data?.links?.next !== null);
        if (!reset) {
          // setNextPage((prevPage) => prevPage + 1);
        }
        else {
          setNextPage(1);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [newOptions, setNewOptions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemName, setSelectedItemName] = useState(value || null);
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const toggleOption = (e, value, option) => {
    // if (name == "fk_invoice_branchid") {
    //   setFormData((prevFormData) => {
    //     return {
    //       ...prevFormData,
    //       [0]: {
    //         ...prevFormData[0],
    //         "fk_im_state": option?.fk_br_state__state_name,
    //         "im_billtoplace": option?.fk_br_state__state_name,
    //         "im_shiptoplace": option?.fk_br_state__state_name,
    //       },
    //     };
    //   });
    // }
    setIsToggleOpen(!isToggleOpen);
    onChange(value, 1, option);
  };
  useEffect(() => {
    masterOptions?.map((model, index) => {
      if (model.model === name || model.model === customname) {
        setNewOptions(model.data);
      }
    });
  }, [options, newOptions, name, masterOptions]);

  const [errorMsg, setErrorMsg] = useState("");
  useEffect(() => {
    if ((value === undefined || value === "") && required) {
      setErrorMsg(label + " is required");
    } else {
      checkDefaultSelected();
      setErrorMsg("");
    }
    if(value && !actualOptData()?.find((item, index)=>item[optionData.id]===value)){
      fetchData(true, 1);
    }
    // if (!defaultValue && value) {
    //   setDefaultValue(value);
    //   if (['operationCertificate', 'jobinstruction', 'vesselJICertificate'].includes(moduleType)) {
    //     if (formData[0]?.ji_id) {
    //       fetchData(true, 1);
    //     }
    //   }
    //   else {
    //     fetchData(true, 1);
    //   }
    // }
  }, [value]);
  useEffect(() => {
    checkDefaultSelected();
  }, [items]);
  const checkDefaultSelected = () => {
    const filterData = actualOptData()?.filter((item) => {
      return item[optionData.id] === value;
    });

    if (filterData.length > 0) {
      setSelectedItem(filterData[0][optionData.id]);
      setSelectedItemName(
        filterData[0][optionData.label] + ((optionData?.label3 && filterData[0][optionData?.label3]) ?
          ` ${filterData[0][optionData?.label3]} ` : '') +
        ((optionData?.label2 && filterData[0][optionData?.label2]) ?
          `(${filterData[0][optionData?.label2]})` : '')
      );
      if (name == "fk_invoice_branchid") {
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            [0]: {
              ...prevFormData[0],
              "fk_im_state": filterData[0]?.fk_br_state__state_name,
              // "im_billtoplace": filterData[0]?.fk_br_state__state_name,
              // "im_shiptoplace": filterData[0]?.fk_br_state__state_name,
            },
          };
        });
      }
    }

    else {
      setSelectedItem(null);
      setSelectedItemName(null);
    }
  };
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (isOpen) { 
      const element = dropdownMenuRef.current;
      if (element) {
        element.addEventListener('scroll', handleScroll);
        return () => {
          element.removeEventListener('scroll', handleScroll);
        }
      }
    }
  }, [isOpen]);

  // Your handleScroll function
  useEffect(() => {
    if (nextPage > 1 && nextPage <= totalPage) {
      if (isCustomPayload) {
        if (formData[0]?.[customPayload?.value] || customPayload.defaultValue) {
          fetchData();
        }
      }
      else {
        fetchData();
      }

    }
  }, [nextPage, totalPage]);

  const handleScroll = () => {
    const element = dropdownMenuRef.current;
    if (element) {
      if (element?.scrollTop + element.clientHeight >= element.scrollHeight - 10) {
        setNextPage((prevPage) => prevPage + 1); // Increment page here
      }
    }
  };
  const searchInputRef = useRef(null);
  const actualOptData = () => {
    if (defaultOptions) {
      if (!items.find((singleVal, i) => singleVal[optionData.id] == value)) {
        return [defaultOptions, ...items]
      }
    }
    return items
  }

  return (
    <div className={"form-group my-2 " + upperClass} id={name || label} style={{ position: "relative" }}>
      {from !== "Table" && label && (
        <label htmlFor={name} style={{ width: labelWidth || `${25}%` }}>
          {label}
          <span className="required_mark"> {required ? ` *` : null}</span>
        </label>
      )}
      <div className={"w-" + (fieldWidth ?? "75") + " d-inline-block mx-2"}>
        <Dropdown className={"w-100" + " d-inline-block  specialInnerSelect " + (readOnly && "labelInput")}
          onToggle={(isOpen) => {
            setIsOpen(isOpen)
            if (isOpen) {
              setTimeout(() => {
                if (searchInputRef.current) {
                  searchInputRef.current.focus();
                }
              }, 300);
            }
          }}>
          <Dropdown.Toggle id="dropdown-basic" disabled={readOnly}  >
            {" "}
            <span className="multipleSelectHeader">
              {selectedItemName || (placeholder ? placeholder : "Select " + (label || ""))}
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu className="loadmore_dropdown_menu"  >
            {isSearchable && (
              <input
                type="text"
                ref={searchInputRef}
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
                className="loadMoreInput"
              />
            )}
            <br />
            <div className="loadMoreOptions" ref={dropdownMenuRef}>

              {actualOptData()?.map((item, index) => (

                <Dropdown.Item
                  value={item[optionData.id]}
                  key={"Dropdown-" + index}
                  onClick={(e) => toggleOption(e, item[optionData.id], item)}
                  active={selectedItem === item[optionData.id]}
                  title={item[optionData.label] + (item?.[optionData?.label3] ? ` ${item[optionData?.label3]} ` : '') + (optionData?.label2 && item?.[optionData?.label2] ? ` (${item[optionData?.label2]})` : "")}
                >
                  {item[optionData.label]}{" "} {item?.[optionData?.label3] ? `${item[optionData?.label3]} ` : ''}

                  {optionData?.label2 && (item?.[optionData?.label2]) ? `(${item[optionData?.label2]})` : ""}

                </Dropdown.Item>
              ))}
            </div>
            {/* {hasMore && !isCustomPayload && (
              <button
                onClick={() => fetchData(false)}
                className="load_more_btn"
                type="button"
              >
                Load More...
              </button>
            )} */}
          </Dropdown.Menu>
        </Dropdown>
        {errorMsg && actionClicked && (
          <p className="text-danger errorMsg">{errorMsg}</p>
        )}
      </div>
    </div >
  );
};

DropDownWithLoadMore.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.array,
    ]),
    onChange: PropTypes.func,
    required: PropTypes.bool,
    options: PropTypes.array,
    error: PropTypes.string,
    fieldWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    multiple: PropTypes.bool,
    placeholder: PropTypes.string,
    masterOptions: PropTypes.array,
    customname: PropTypes.string,
    actionClicked: PropTypes.func,
    specialClass: PropTypes.string,
    from: PropTypes.string,
    viewOnly: PropTypes.bool,
    staticOptions: PropTypes.bool,
  }),
};

export default DropDownWithLoadMore;
