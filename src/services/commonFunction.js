/*
Use : Use for check permission available for perticular functionaliy
Author : sufiyan Patel
Date:28-04-2024
*/
import moment from "moment";
import {
  decryptDataForURL,
  encryptData,
  encryptDataForURL,
} from "../utills/useCryptoUtils";
import { use } from "i18next";
import { store } from "./store";
import { GetTenantDetails } from "./commonServices";
import { handleCalibrationCreateUpdate } from "../components/common/commonHandlerFunction/Purchase/Calibration/CalibrationHandler";
import { handleCalibrationCreateUpdate as stubHandleCalibrationCreateUpdate } from "../utils/stubFunctions";
export const rolesDetails = [
  { role: "BU", label: "Operation Executive" },
  { role: "LR", label: "Lab Receptionist" },
  { role: "TM", label: "Technical Manager" },
  { role: "DTM", label: "Deputy Technical Manager" },
  { role: "LC", label: "Chemist" },
  { role: "OPS_ADMIN", label: "Admin" },
  { role: "STM", label: "Senior Technical Manager" },
  { role: "QM", label: "Quality Manager" },
  { role: "SQM", label: "Senior Technical Manager" },
  { role: "SLC", label: "Senior Chemist" },
  { role: "BH", label: "Branch Head" },
  { role: "CP", label: "Branch Captain" },
  { role: "AUDIT", label: "AUDIT" },
  { role: "PM", label: "Purchase Manager" },
];
export const CommonTMRoles = ["TM", "STM", "QM", "SQM", "SLC"];
/*
Use : Use for check permission available for module and showing in sidebar
Author : sufiyan Patel
Date:28-04-2024
*/

export const formatDate = (dateString) => {
  if (!dateString) return "";
  const [datePart] = dateString.split("T");
  const [year, month, day] = datePart.split("-");
  return `${day}/${month}/${year}`;
};

export const isModuelePermission = (
  allPermissions,
  module,
  permission,
  isMainPrmission,
  iscustom,
  userDetails,
  subItem
) => {
  const state = store.getState();
  const userData = state.session.user;

  if (isMainPrmission) {
    if (module === "operations") {
      return ["BU", "OPS_ADMIN", "BH", 'CP', 'SU'].includes(userData?.role)
    }
    else if (module === "LMS") {
      return !["OPS_ADMIN", "BH", "CP", "AUDIT", 'PM', 'CU'].includes(userData?.role)
    }
    else if (module === "audit") {
      return ["AUDIT"].includes(userData?.role)
    }
    else if (module === "purchase") {
      return ["PM", "SU", 'BH', 'AUDIT'].includes(userData?.role)
    }
    else if (module === "tender") {
      return ["P10076", "P10234", "P10235"].includes(userData?.all_roles?.usr_emp_id_orig)
    }
    else if (module === "stocks") {
      return ["PM", 'BH', ...CommonTMRoles].includes(userData?.role)
    }
    else if (module === "feedback") {
      //"PM","BU"
      return ["PM", "BU"].includes(userData?.role)
    }
    else if (module === "incentives") {
      //"PM","BU"
      return ["BU", 'LR', 'CU'].includes(userData?.role)
    }
    else if (module === "analytics") {
      return [...CommonTMRoles, 'SU', 'BH', 'CU', 'LM'].includes(userData?.role)
    }
    else if (module === "collections") {
      return ['CU'].includes(userData?.role)
    }
    return true;
  }
  // return true
  if (iscustom) {
    if (module === "analytics") {
      if (["SU"].includes(userData?.role)) {
        return !['overall_analytics'].includes(subItem?.subModuleType)
      } else {
        const roleWiseData = {
          ['lms_analytics']: [...CommonTMRoles, 'LM'],
          ['ops_analytics']: ["BH"],
          ['other_analytics']: ["BH"],
          ['credit_analytics']: ["CU"],
          ['overall_analytics']: ["CU"],
        }
        return roleWiseData[subItem?.subModuleType].includes(userData?.role);
      }
    }
    else if (module === "dashboard") {
      return ['BU', 'LR', 'SU', 'BH', 'OPS_ADMIN'].includes(userData?.role)
    }
    else if (module === "lms dashboard") {
      return ['SU'].includes(userData?.role)
    }
    else if (module === "collection dashboard") {
      return ['CU'].includes(userData?.role)
    }
    else if (module === "statistics") {
      return ['SU'].includes(userData?.role)
    }
    return true;
  }
  if (GetTenantDetails(1, 1) === "TPBPL" && module === "sampleverification") {
    return false;
  }
  else if (module === "internalcertificate" && userDetails?.all_roles?.main_role_id && userDetails?.all_roles?.other_roles?.length) {
    // if (["LR","TM"]userData?.role != "LR") {
    //   return false;
    // }

  }
  else if (module === "auditBranchExpenses" || module === "auditOutstanding" || module === "auditSalesRegister" || module === "jobCosting") {
    return true
  }
  // else if (module === "purchaseReq") {
  //   if (['BH', 'SU', 'AUDIT', "PM"].includes(userData?.role)) {
  //     return ["T10075", "T10249", "SU2005", "P10115"].includes(userData?.all_roles?.usr_emp_id_orig)
  //   }
  // }
  // else if (module === "purchase") {
  //   if (['AUDIT'].includes(userData?.role)) {
  //     return ["T10249"].includes(userData?.all_roles?.usr_emp_id_orig)
  //   }
  //   return true
  // }
  module = permission + "_" + module;
  if (allPermissions) {
    let allPermissionsArrray = allPermissions;
    let isValideData = allPermissionsArrray.filter((per, i) => {
      let spPer = per.split(".");
      let spValue = "";
      if (spPer.length > 1) {
        spValue = spPer[1];
      } else {
        spValue = spPer[0];
      }
      return spValue === module;
    });
    if (isValideData.length > 0) {
      return true;
    }
  }

  return false;
};

/*
Use : Use for Check Validation of password field
Author : sufiyan Patel
Date:08-04-2024
*/
export const checkPasswordValidation = (password = "") => {
  const passAuth = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,15}$/
  );
  return password.match(passAuth) !== null ? true : false;
};
/*
Use : use for get proper date format
Author : sufiyan Patel
Date:08-04-2024
*/
export const getFormatedDate = (
  date,
  isListing,
  idDownLoad = "",
  isShowColorifPassed,
  isDateTime
) => {
  if (!date) {
    return "--";
  }
  let actualDate = new Date(date);
  let formattedDate = "";
  if (isListing || idDownLoad) {
    if (isDateTime) {
      formattedDate = moment(actualDate).format("DD/MM/YYYY HH:mm");
    }
    else {
      formattedDate = moment(actualDate).format("DD/MM/YYYY");
    }
  } else {
    formattedDate = moment(actualDate).format("MMMM DD,YY kk:mm");
  }
  if (isShowColorifPassed) {
    const currentDate = new Date();
    if (currentDate > actualDate) {
      return (<span style={{ color: 'red' }}>{formattedDate}</span>);
    }
  }
  return formattedDate;
};
export const getFormatedDateWithtime = (date, isListing) => {
  if (!date) {
    return "--";
  }
  let actualDate = new Date(date);
  if (isListing) {
    return moment(actualDate).format("DD/MM/YYYY H:mm:ss");
  } else {
    return moment(actualDate).format("MMMM DD,YY kk:mm");
  }
};
export const getPDFFormattedDateWithTime = (date) => {
  let formattedDate = ''
  if (date) {
    const newdate = moment(date).format("DD.MM.YYYY");
    const Time = moment(date).format("HHMM");
    formattedDate = Time + " HRS ON " + newdate
  }
  return formattedDate
}

export const getDateFromCreatedAt = (date) => {
  return getCellData(getFormatedDate(date, true));
};


export const verifyPassword = (password) => {
  const result = [];
  result.push(password.length >= 8 && password.length <= 15);
  result.push(/[A-Z]/.test(password));
  result.push(/[a-z]/.test(password));
  result.push(/\d/.test(password));
  result.push(/[@$!%*?&]/.test(password));
  return result;
};

export const getPasswordVerificationHint = (password) => {
  const passwordVerificationResult = verifyPassword(password);
  return (
    <ul className="passwordPlolicyhint">
      <p style={{ color: "green", fontSize: "0.875rem", lineHeight: 1 }}>
        {passwordVerificationResult.map((verification, index) => (
          <li
            className="errorMsg"
            key={"index" + index}
            style={{ color: verification ? "green" : "$danger" }}
          >
            {verification ? "✓" : "✗"}&nbsp;
            {index === 0
              ? "Password should be minimum 8 and maximum 15 characters"
              : ""}
            {index === 1 ? "At least one uppercase letter" : ""}
            {index === 2 ? "One lowercase letter" : ""}
            {index === 3 ? "One number" : ""}
            {index === 4 ? "One special character" : ""}
          </li>
        ))}
      </p>
    </ul>
  );
  return "";
};
export const redirectPageAfterLogin = (navigate, role, isReload) => {
  const jrfRoles = [];
  const allotRoles = ["TM", "STM", "QM", "SQM", "SLC", "DTM"];
  const verificationRoles = ["LC", "SLC"];
  const operations = [];
  const audit = ["AUDIT"]
  const Analytics = []
  const supplier = ["PM"]
  const dashboard = ["BU", "LR", 'SU', 'BH', 'OPS_ADMIN']
  const certificatePage = ['CP']
  const creditControl = []
  const collectionUser = ['CU']
  if (role !== undefined) {
    if (jrfRoles.includes(role)) {
      navigate("/jrfListing");
    } else if (allotRoles.includes(role)) {
      navigate("/testmemoList");
    } else if (verificationRoles.includes(role)) {
      navigate("/allotmentList");
    } else if (operations.includes(role)) {
      navigate("/operation/jrfInstructionListing");
    } else if (certificatePage.includes(role)) {
      navigate("/operation/commercial-certificate-list");
    } else if (audit.includes(role)) {
      navigate("/audit/job-costing-list");
    }
    else if (Analytics.includes(role)) {
      navigate("/analytics/laboratory");
    }
    else if (supplier.includes(role)) {
      navigate("/PurchRequistion");
    }
    else if (dashboard.includes(role)) {
      navigate("/dashboard-listing");
    }
    else if (creditControl.includes(role)) {
      navigate("/analytics/credit-control");
    }
    else if (collectionUser.includes(role)) {
      navigate("/collection-dashboard");
    }
    else {
      navigate("/jrfListing");
    }
    if (isReload) {
      setTimeout(() => {
        window.location.reload();
      }, 10);
    }
  }
};

export const getSelectedOptionName = (
  options = [],
  masterOptions = [],
  name = "",
  value,
  customname = "",
  isSingleValue,
  isArray,
  isCustomOption,
  customOptions
) => {
  let allOptions = [];
  let newOptions = [];
  let selectedOptions = [];
  if (isSingleValue) {
    if (typeof value !== "number") {
      selectedOptions.push(value);
    } else {
      selectedOptions.push(parseInt(value));
    }
  } else {
    selectedOptions = value;
  }
  if (!selectedOptions || !selectedOptions.length) {
    return [];
  }
  if (isCustomOption) {
    newOptions = customOptions;
  } else {
    masterOptions?.map((model, index) => {
      if (model.model === name || model.model === customname) {
        newOptions = model.data;
      }
    });
  }

  if (newOptions.length > 0) {
    newOptions.forEach((option) => {
      if (
        selectedOptions.includes(option.id) ||
        selectedOptions.includes(option.name) ||
        selectedOptions.includes(option.id.toString())
      ) {
        allOptions.push(option.name);
      }
    });
  } else {
    allOptions = options.filter((option) => {
      if (selectedOptions.includes(option)) {
        return option;
      }
      return false;
    });
  }

  if (isArray) {
    if (allOptions.length > 0) {
      return allOptions;
    } else {
      return selectedOptions;
    }
  }
  if (allOptions.length > 0) {
    return allOptions.join(", ") || '';
  } else {
    return selectedOptions.join(", ") || '';
  }
};
export const getComonCodeForCompany = (code) => {
  const companyCodes = {
    L: "TIPL",
    C: "TCRC",
    P: "TPBPL",
  };
  return companyCodes[code] || "";
};
export const getTotalValues = (formData, type, header) => {
  let count = 0;
  header.map((field) => {
    if (parseFloat(count) + parseFloat(formData[1][field.name + "-" + type] || 0)) {
      count =
        parseFloat(count) + parseFloat(formData[1][field.name + "-" + type] || 0);
    }

  });

  return count ? count.toFixed(3) : 0;
};
export const getDisplacementDifferenceCalc = (formData, interimCount, isFinal) => {
  let value1 = formData[1]?.["corrected_displacement-initial"] || 0;
  let value2 = 0
  // if (interimCount) {
  //   value2 = formData[1]?.["corrected_displacement-interim_0"] || 0;
  // }

  let value3 = 0
  if (isFinal) {
    value3 = formData[1]?.["corrected_displacement-final"] || 0;
  }
  else {
    value3 = formData[1]?.["corrected_displacement-interim_" + (interimCount - 1)] || 0;
  }
  let finalValue = 0
  if (formData[0].ji_is_loading !== "Loading") {
    // if (isFinal) {
    //   finalValue = parseFloat(value3) - ((parseFloat(value1) + parseFloat(value2)));
    // }
    // else {
    //   finalValue = ((parseFloat(value1) + parseFloat(value2))) - parseFloat(value3);
    // }
    finalValue = ((parseFloat(value1) + parseFloat(value2))) - parseFloat(value3);
  }
  else {
    // if (isFinal) {
    //   finalValue = ((parseFloat(value1) + parseFloat(value2))) - parseFloat(value3);
    // }
    // else {
    //   finalValue = parseFloat(value3) - ((parseFloat(value1) + parseFloat(value2)));

    // }
    finalValue = parseFloat(value3) - ((parseFloat(value1) + parseFloat(value2)));
  }
  return finalValue ? finalValue.toFixed(3) : 0;
};
export const getChangeOnShipsValue = (formData, initialTotal, finalTotal, isFinal) => {
  let finalValue = 0;
  if (formData[0].ji_is_loading !== "Loading") {
    finalValue = parseFloat(finalTotal) - parseFloat(initialTotal);
    // if (isFinal) {
    //   finalValue = parseFloat(finalTotal) - parseFloat(initialTotal);
    // }
    // else {
    //   finalValue = parseFloat(initialTotal) - parseFloat(finalTotal);
    // }
  } else {
    finalValue = parseFloat(initialTotal) - parseFloat(finalTotal);
    // if (isFinal) {
    //   finalValue = parseFloat(initialTotal) - parseFloat(finalTotal);
    // }
    // else {
    //   finalValue = parseFloat(finalTotal) - parseFloat(initialTotal);
    // }
  }
  return finalValue ? finalValue.toFixed(3) : 0;
};

export const shortArray = (array, fieldName, type = "asc") => {
  let sortArr = [];
  if (type === "asc") {
    sortArr = array.sort((a, b) => a[fieldName] - b[fieldName]);
  } else {
    sortArr = array.sort((a, b) => b[fieldName] - a[fieldName]);
  }
  return sortArr;
};

export const getDayCountFromDate = (fromDate, toDate, isColor = "", isReverse, isShowMinus = "") => {
  let diffDays = 0;
  if (fromDate || toDate) {
    const endDate = toDate ? moment(toDate) : moment();
    const startDate = fromDate ? moment(fromDate) : moment();
    if (endDate.isSame(startDate, "date")) {
    }
    diffDays = endDate.diff(startDate, "days");
    diffDays = diffDays + 1;
  }
  if (!isShowMinus) {
    diffDays = diffDays > 0 ? diffDays : 0;
  }
  return isColor ? getDaysColorCount(diffDays, isReverse) : diffDays;
};
export const getDaysColorCount = (count, isReverse) => {
  let color = "#CC1E29";
  if (isReverse) {
    color = "#008000";
    if (count >= 5 && count <= 10) {
      color = "#FFB701";
    } else if (count > 10) {
      // color = "#008000";
      color = "#CC1E29";
    }
  }
  else {
    if (count >= 5 && count <= 10) {
      color = "#FFB701";
    } else if (count > 10) {
      color = "#008000";
    }
  }

  return (
    <span style={{ color: color }}>
      {count + (count > 1 ? " Days" : " Day")}
    </span>
  );
};



// export const getCellData = (cellData) => {
//   if (!cellData) {
//     return "--";
//   }
//   const breakingLimit = 18
//   if (cellData.length > breakingLimit) {
//     const firstLine = cellData.substring(0, breakingLimit); // Get the first 20 characters
//     let secondLine
//     if (cellData.length < 2 * breakingLimit) {
//       secondLine = cellData.substring(breakingLimit, breakingLimit * 2); // Get the rest of the characters
//     }
//     else {
//       secondLine = cellData.substring(breakingLimit, breakingLimit * 2 - 3) + "..."; // Get the rest of the characters
//     }
//     return <span>{firstLine}<br />{secondLine}</span>; // Return as two lines
//   }

//   return cellData;
// };

export const getCellData = (cellData, field) => {
  if (!cellData) {
    return "--";
  }
  let breakingLimit = 20;
  if (field && field.isCustomWrap) {
    let charLength = 10
    if (field.wrapType === "charLength") {
      charLength = field.wrapLength || 10
      let firstLine = cellData.substring(0, charLength);
      let secondLine = cellData.substring(firstLine.length).trim();
      if (secondLine.length > 20) {
        secondLine = secondLine.substring(0, breakingLimit - 3).trim();
      }
      return (
        <span>
          {firstLine}
          <br />
          {secondLine}
        </span>
      );
    }
    else if (field.wrapType === "space") {
      let spValue = cellData.split(' ')
      breakingLimit = spValue[0].length

    }
  }

  if (cellData.length > breakingLimit) {
    // Find the last space within the first breakingLimit characters to avoid cutting words
    let firstLine = cellData.substring(0, breakingLimit);
    const lastSpaceIndex = firstLine.lastIndexOf(" ");

    // Adjust firstLine to end at the last space, if a space exists
    if (lastSpaceIndex !== -1) {
      firstLine = cellData.substring(0, lastSpaceIndex);
    }

    // The remaining text starts after the firstLine
    let secondLine = cellData.substring(firstLine.length).trim();

    // If the second line is too long, trim it and add ellipsis
    if (secondLine.length > breakingLimit) {
      secondLine = secondLine.substring(0, breakingLimit - 3).trim() + "...";
    }

    return (
      <span>
        {firstLine}
        <br />
        {secondLine}
      </span>
    );
  }

  return cellData;
};

export const numberToOrdinalWord = (num) => {
  const ordinals = [
    "Zeroth",
    "First",
    "Second",
    "Third",
    "Fourth",
    "Fifth",
    "Sixth",
    "Seventh",
    "Eighth",
    "Ninth",
    "Tenth",
    "Eleventh",
    "Twelfth",
    "Thirteenth",
    "Fourteenth",
    "Fifteenth",
    "Sixteenth",
    "Seventeenth",
    "Eighteenth",
    "Nineteenth",
    "Twentieth",
  ];
  if (num >= 0 && num <= 20) {
    return ordinals[num];
  } else {
    // For numbers > 20, we use a suffix approach.
    let suffix = ["th", "st", "nd", "rd"];
    let value = num % 100;
    let suffixWord = suffix[(value - 20) % 10] || suffix[value] || suffix[0];
    return num + suffixWord;
  }
};
export const getSvgAccordingToCondition = (action) => {
  if (action.text.toLowerCase() === "save" || action.icon === "bi bi-floppy2") {
    return (
      <svg
        className="svg-hover-effect"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.1667 17.5V10.8333H5.83333V17.5M5.83333 2.5V6.66667H12.5M15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H13.3333L17.5 6.66667V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5Z"
          // stroke="#151B25" /* Initial color */
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (action.text.toLowerCase() === "edit" || action.icon === "bi bi-pen") {
    // return <img src={EditSVG} alt="Edit" />;
    return (
      <svg
        className="svg-hover-effect"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4.536 18C4.1136 18 3.75213 17.8435 3.45158 17.5304C3.15053 17.2168 3 16.84 3 16.4V3.6C3 3.16 3.15053 2.7832 3.45158 2.4696C3.75213 2.15653 4.1136 2 4.536 2H10.68L15.288 6.8V10H13.752V7.6H9.912V3.6H4.536V16.4H9.144V18H4.536ZM13.9824 12.02L14.808 12.88L11.832 15.96V16.8H12.6384L15.6144 13.72L16.4208 14.56L13.1184 18H10.68V15.46L13.9824 12.02ZM16.4208 14.56L13.9824 12.02L15.096 10.86C15.2368 10.7133 15.416 10.64 15.6336 10.64C15.8512 10.64 16.0304 10.7133 16.1712 10.86L17.5344 12.28C17.6752 12.4267 17.7456 12.6133 17.7456 12.84C17.7456 13.0667 17.6752 13.2533 17.5344 13.4L16.4208 14.56Z"
          // fill="#151B25"
          strokeWidth="0"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="svg-hover-effect-path"

        />
      </svg>
    )
  }
  if (action.text.toLowerCase() === "delete" || action.icon === "bi bi-trash") {
    // return <img src={DeleteSVG} alt="Delete" />;
    return (

      <svg
        className="svg-hover-effect"
        width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.725 14L10 11.6889L12.275 14L13.5 12.7556L11.225 10.4444L13.5 8.13333L12.275 6.88889L10 9.2L7.725 6.88889L6.5 8.13333L8.775 10.4444L6.5 12.7556L7.725 14ZM5.625 18C5.14375 18 4.73192 17.8261 4.3895 17.4782C4.0465 17.1298 3.875 16.7111 3.875 16.2222V4.66667H3V2.88889H7.375V2H12.625V2.88889H17V4.66667H16.125V16.2222C16.125 16.7111 15.9538 17.1298 15.6114 17.4782C15.2684 17.8261 14.8562 18 14.375 18H5.625ZM14.375 4.66667H5.625V16.2222H14.375V4.66667Z"
          // fill="#151B25" 
          strokeWidth="0"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="svg-hover-effect-path"

        />
      </svg>
    )
  }
  return <i className={action.icon} title={action.text}></i>;
};
export const gettwoFieldsTotalValues = (firstName, secondName, currentName, value, formData, setFormData, setFieldName, sectionIndex) => {
  let totalValue = 0;
  if (firstName === currentName) {
    totalValue = formData?.[sectionIndex]?.[secondName] * value;
  }
  else {
    totalValue = formData?.[sectionIndex]?.[firstName] * value;
  }
  totalValue = totalValue ? totalValue : 0
  setFormData((prevFormData) => {
    return {
      ...prevFormData,
      [sectionIndex]: {
        ...prevFormData[sectionIndex],
        [setFieldName]: totalValue
      },
    };
  });
  return totalValue
}
export const getTotalCountForTable = (tableData, fieldName, sectionIndex, formatData) => {
  let total = 0;
  tableData.map((singletable, i) => {
    total += formatData?.[sectionIndex]?.[fieldName + '_' + i] ? parseFloat(formatData?.[sectionIndex]?.[fieldName + '_' + i]) : 0
  })
  // total += formatData?.[sectionIndex]?.[fieldName + '_' + tableData.length] ? parseFloat(formatData?.[sectionIndex]?.[fieldName + '_' + tableData.length]) : 0

  return total;
}
export const imageToDataURL = async (imageUrl) => {
  try {
    const response = await fetch("https://cors-anywhere.herokuapp.com/" + imageUrl, { mode: 'cors' }); // Ensure the server supports CORS
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); // Data URL
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
}
export const getLMSOperationActivity = () => {
  return [
    getVesselOperation('PSI'),
    getVesselOperation('QA'),
    getVesselOperation('TML'),
    getTruckOperations("QS"),
    getTruckOperations("DTM"),
    getRakeOperations('QA'),
    getStackOperations('PV'),
    getStackOperations(''),
    getPlantOperations('TR'),
    getPlantOperations('RK'),
    getPlantOperations('VL'),
    getPlantOperations('ST'),
    getOtherOperations('SS_QA'),
    getOtherOperations('CS_SSP'),
    getVesselOperation('VL_TML_M'),
    getOtherOperations('CR_QA'),
    getOtherOperations('CN_QA'),
    getVesselOperation('VL_BQA'),
    getPlantOperations('PL_CN'),
  ]
}
export const getNonLMSOperationActivity = () => {
  return [
    getVesselOperation('DS'),
    getVesselOperation('SV'),
    getVesselOperation('HH'),
    getVesselOperation('CS'),
    getVesselOperation('DM'),
    getTruckOperations('OS'),
    getTruckOperations('CS'),
    getRakeOperations('QAss'),
    getVesselOperation('BC'),
    getVesselOperation('bulk_crg'),
    getStackOperations('ST_SV'),
    getRakeOperations('RK_SV'),
  ]
}
export const getWithoutSizeAnalysisActivity = () => {
  return [
    // getVesselOperation('PSI'),
    getVesselOperation('TML'),
  ]
}
export const getSampleCollectionActivity = () => {
  // return [
  //   "Quality Analysis",
  // ]
  const notRequired = [getOtherOperations('SS_QA')]
  const sampleCollectionData = getLMSOperationActivity().filter((singleData) => !notRequired.includes(singleData))
  return sampleCollectionData
}
export const getLMSOperationTML = () => {
  return getVesselOperation('TML')
}

export const getOperationActivityUrl = (operationMode) => {
  const state = store.getState();
  const userData = state?.session?.user
  if (userData?.role === "OPS_ADMIN") {
    return "/operation/jrfInstructionListing/ji-details-list/"
  }
  if (operationMode === "RAKE" || operationMode === "RK") {
    return "/operation/rake-list/rake-details-list/"
  }
  else if (operationMode === "TRUCK" || operationMode === "TR") {
    return "/operation/truck-list/truck-details-list/"
  }
  else if (operationMode === "STACK" || operationMode === "ST") {
    return "/operation/stack-list/stack-details-list/"
  }
  else if (operationMode === "PLANT" || operationMode === "PL") {
    return "/operation/plant-list/plant-details-list/"
  }
  else if (operationMode === "VESSEL" || operationMode === "VL") {
    return "/operation/vessel-ji-list/vessel-list/"
  }
  else {
    return "/operation/other-list/other-details-list/"
  }
  // else {
  //   return "/operation/vessel-ji-list/vessel-list/"
  // }
}
export const getOperationActivityListPageUrl = (operationMode) => {
  const state = store.getState();
  const userData = state?.session?.user
  if (userData?.role === "OPS_ADMIN") {
    return "/operation/jrfInstructionListing/"
  }
  if (operationMode === "RAKE" || operationMode === "RK") {
    return "/operation/rake-list/"
  }
  else if (operationMode === "TRUCK" || operationMode === "TR") {
    return "/operation/truck-list/"
  }
  else if (operationMode === "STACK" || operationMode === "ST") {
    return "/operation/stack-list/"
  }
  else if (operationMode === "PLANT" || operationMode === "PL") {
    return "/operation/plant-list/"
  }
  else if (operationMode === "VESSEL" || operationMode === "VL") {
    return "/operation/vessel-ji-list/"
  }
  else {
    return "/operation/other-list/"
  }
  // else {
  //   return "/operation/vessel-ji-list/"
  // }
}
//getPlantOperations("TR")
export const getPlantOperations = (type = "") => {
  let operationName = ""
  if (type == "TR") {
    operationName = "PL_TR"
  }
  else if (type == "RK") {
    operationName = "PL_RK"
  }
  else if (type == "ST") {
    operationName = "PL_ST"
  }
  else if (type == "VL") {
    operationName = "PL_VL"
  }
  else if (type == "PL_CN") {
    operationName = "PL_CN"
  }
  return Array.isArray(operationName) ? operationName : operationName.toLowerCase()
}
//

export const getOtherOperations = (type = "") => {
  let operationName = ""
  if (type == "SS_QA") {
    operationName = "SS_QA"
  }
  else if (type == "CS_SSP") {
    operationName = "CS_SSP"
  }
  else if (type == "CR_QA") {
    operationName = "CR_QA"
  }
  else if (type == "CN_QA") {
    operationName = "CN_QA"
  }
  return Array.isArray(operationName) ? operationName : operationName.toLowerCase()
}
//
export const getStackOperations = (type = "") => {
  let operationName = ""
  if (type == "PV") {
    operationName = "PV"
  }
  else if (type == "ST_SV") {
    operationName = "ST_SV"
  }
  else {
    operationName = "ST_QA"
  }
  return Array.isArray(operationName) ? operationName : operationName.toLowerCase()
}

export const getRakeOperations = (type = "") => {
  let operationName = ""
  if (type == "QAss") {
    operationName = "RK_QASS"
  }
  else if (type == "RK_SV") {
    operationName = "RK_SV"
  }
  else {
    operationName = "RK_QA"
  }
  return Array.isArray(operationName) ? operationName : operationName.toLowerCase()
}

export const getTruckOperations = (type = "") => {
  let operationName = ""
  if (type == "OS") {
    operationName = "TR_OS"
  }
  else if (type == "CS") {
    operationName = "TR_CS"
  }
  else if (type == "DTM") {
    operationName = "TR_DTM"
  }
  else if (type == "QS") {
    operationName = "TR_QS"
  }
  return Array.isArray(operationName) ? operationName : operationName.toLowerCase()
}
export const getVesselOperation = (type = "") => {
  let operationName = ""
  if (type === "TML") {
    operationName = "VL_TML"
  }
  else if (type === "PSI") {
    operationName = "VL_PSI"
  }
  else if (type === "QA") {
    operationName = "VL_QA"
  }
  else if (type === "DS") {
    operationName = "VL_DS"
  }
  else if (type === "SV") {
    operationName = "VL_SV"
  }
  else if (type == "CS") {
    operationName = "VL_CS"
  }
  else if (type === "HH") {
    operationName = "VL_H&H"
  }
  else if (type === "DM") {
    operationName = "VL_DM"
  }
  else if (type === "bulk_crg") {
    operationName = "VL_BC"
  }
  else if (type === "VL_TML_M") {
    operationName = "VL_TML_M"
  }
  else if (type === "VL_BQA") {
    operationName = "VL_BQA"
  }
  else if (type === "TMLPSI") {
    operationName = [
      getVesselOperation('PSI'),
      getVesselOperation('TML')
    ]
  }
  else {
    operationName = [
      getVesselOperation('PSI'),
      getVesselOperation('QA'),
      getVesselOperation('TML')
    ]
  }
  return Array.isArray(operationName) ? operationName : operationName.toLowerCase()
}
export const getLogoCondition = (companyCode) => {
  // if (companyCode === "L") {
  //   return "https://tcrc-nonprod-bucket.s3.ap-south-1.amazonaws.com/18north_masterdata/image_2024_12_25T12_14_08_643Z.png"
  // }
  // else if (companyCode === "P") {
  //   return "https://tcrc-nonprod-bucket.s3.ap-south-1.amazonaws.com/18north_masterdata/image_2024_12_25T12_14_08_644Z.png"
  // }
  // else {
  //   return "https://tcrc-nonprod-bucket.s3.ap-south-1.amazonaws.com/18north_masterdata/image_2024_12_25T12_14_08_642Z.png"
  // }
  if (companyCode === "L") {
    return "https://tcrc-prod-bucket.s3.ap-south-1.amazonaws.com/masterdata/image_13_29092025_2138.png"
  }
  else if (companyCode === "P") {
    return "https://tcrc-prod-bucket.s3.ap-south-1.amazonaws.com/masterdata/image_2024_12_25T12_14_08_644Z_1_1_29092025_2145.png"
  }
  else {
    return "https://tcrc-prod-bucket.s3.ap-south-1.amazonaws.com/masterdata/image_12_29092025_2139.png"
  }
}
export const getLMSActivityHeaderTab = (TMLType) => {
  let headerTabs = [
    { Text: "Sample Information", opsNo: 2, isClick: true },
    { Text: "Groups & Parameters", opsNo: 1, isClick: true },
    { Text: "Assign Parameters", opsNo: 3, isClick: true },
  ];
  if (getSampleCollectionActivity().includes(TMLType)) {
    headerTabs = [{ Text: "Sample Collection", opsNo: 6, isClick: true }, ...headerTabs]
  }
  if (getRakeCollectionActivity().includes(TMLType)) {
    headerTabs = [{ Text: "Rake Details", opsNo: 7, isClick: true }, ...headerTabs]
  }
  if (!getWithoutSizeAnalysisActivity().includes(TMLType)) {
    headerTabs.push({ Text: "Physical Analysis", opsNo: 4, isClick: true })
  }
  if (TMLType === getOtherOperations('SS_QA')) {
    headerTabs = headerTabs.map((singleData) => {
      if (singleData.opsNo === 2) {
        singleData.Text = "Sample Receipt Details"
      }
      return singleData
    })
  }
  return headerTabs
}
export function getTotalHoursInTimeFormat(startTime, endTime) {
  if (!startTime | !endTime) {
    return ""
  }
  // Split time into hours and minutes
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  // Convert start and end times to total minutes
  let startMinutes = startHour * 60 + startMinute;
  let endMinutes = endHour * 60 + endMinute;

  // Handle times crossing midnight
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60; // Add 24 hours in minutes
  }

  // Calculate the difference in minutes
  const diffMinutes = endMinutes - startMinutes;

  // Convert total minutes to hours and minutes
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  // Format as HH:MM
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
}

export const getTotalCountBasedOnField = (tableData, field, isCustomChanged, value, index) => {
  let total = 0
  tableData.filter((singleVal, i) => {
    if (isCustomChanged && i == index) {
      if (value) {
        total = total + parseFloat(value)
      }
    }
    else if (singleVal[field]) {
      total = total + parseFloat(singleVal[field])
    }
    return
  })
  return total;
}

export const getActivityCode = (amCode) => {
  if (amCode.toLowerCase() != "othertpi") {
    amCode = amCode ? amCode.toUpperCase() : amCode
  }
  if (['VL_DS', 'DS', 'CS_DS'].includes(amCode)) {
    return 'VL_DS'
  }
  else if (['VL_SV', 'SV', 'CS_SV', 'CS_VL_SV', 'PL_VL_SV', 'DS_SV'].includes(amCode)) {
    return 'VL_SV'
  }
  else if (['VL_PSI', 'PSI', 'CS_PSI'].includes(amCode)) {
    return 'VL_PSI'
  }
  else if (['VL_TML', 'TML', 'CS_TML'].includes(amCode)) {
    return 'VL_TML'
  }
  else if (['VL_H&H', 'H&H', 'VL_H&H'].includes(amCode)) {
    return 'VL_H&H'
  }
  else if (['VL_QA', 'QA', 'CS_QA'].includes(amCode)) {
    return 'VL_QA'
  }
  else if (['TR_OS', 'CS_TS', 'PL_TR_SV'].includes(amCode)) {
    return 'TR_OS'
  }
  else if (['ST_SV', 'PL_ST_SV', 'ST_SV', 'MI_SV'].includes(amCode)) {
    return 'ST_SV'
  }
  else if (['RK_SV', 'PL_RK_SV'].includes(amCode)) {
    return 'RK_SV'
  }
  else if (['VL_BC', 'TL_BC'].includes(amCode)) {
    return 'VL_BC'
  }
  else if (['TR_CS', 'VL_CS'].includes(amCode)) {
    return 'TR_CS'
  }
  else if (['ST_QA', 'MI_QA'].includes(amCode)) {
    return 'ST_QA'
  }
  return amCode
}
export const getActivityName = (amCode) => {
  if (amCode.toLowerCase() != "othertpi") {
    amCode = amCode ? amCode.toUpperCase() : amCode
  }
  if (['VL_DS', 'DS', 'CS_DS'].includes(amCode)) {
    return 'Draft Survey'
  }
  else if (['VL_SV', 'SV', 'CS_SV'].includes(amCode)) {
    return 'Supervision'
  }
  else if (['VL_PSI', 'PSI', 'CS_PSI'].includes(amCode)) {
    return 'PreShipment'
  }
  else if (['VL_TML', 'TML', 'CS_TML'].includes(amCode)) {
    return 'Transportable moisture limit'
  }
  else if (['VL_H&H', 'H&H', 'CS_H&H'].includes(amCode)) {
    return 'Hatch & Hold'
  }
  else if (['VL_QA', 'QA', 'CS_QA'].includes(amCode)) {
    return 'Quality Analysis'
  }
  return amCode
}
export const getOperationNameByCode = (operationMode) => {
  if (operationMode === "RAKE" || operationMode === "RK") {
    return "Rake"
  }
  else if (operationMode === "TRUCK" || operationMode === "TR") {
    return "Truck"
  }
  else if (operationMode === "STACK" || operationMode === "ST") {
    return "Stack"
  }
  else if (operationMode === "PLANT" || operationMode === "PL") {
    return "Plant"
  }
  else if (operationMode === "VESSEL" || operationMode === "VL") {
    return "Vessel"
  }
  else {
    return "Other"
  }
  // else {
  //   return "Vessel"
  // }
}
export const getRakeCollectionActivity = (isFromCertificate = "") => {
  if (isFromCertificate) {
    return [
      getRakeOperations("QA"),
      getPlantOperations("RK"),
    ]
  }
  else {
    return []
  }

}
export const getMonthOptions = (setMasterResponse, fieldName = "") => {
  const months = [
    { id: "January", name: "January" },
    { id: "February", name: "February" },
    { id: "March", name: "March" },
    { id: "April", name: "April" },
    { id: "May", name: "May" },
    { id: "June", name: "June" },
    { id: "July", name: "July" },
    { id: "August", name: "August" },
    { id: "September", name: "September" },
    { id: "October", name: "October" },
    { id: "November", name: "November" },
    { id: "December", name: "December" },
  ]
  if (setMasterResponse) {
    const bodyToPass = {
      model: fieldName ? fieldName : "month",
      data: months,
    };
    setMasterResponse((prev) => [...prev, bodyToPass]);
  }
  return months
}
export const getAllYearsOptions = (setMasterResponse, fieldName = "", isOnlyOpt) => {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 25 }, (_, index) => {
    const startYear = currentYear - index;
    const endYear = startYear + 1;
    return isOnlyOpt ? startYear : { id: `${startYear}-${endYear}`, name: `${startYear}-${endYear}` };
  });
  if (setMasterResponse) {
    const bodyToPass = {
      model: fieldName ? fieldName : "year",
      data: yearOptions,
    };
    setMasterResponse((prev) => [...prev, bodyToPass]);
  }
  return yearOptions
};

export const getUniqueData = (data) => {
  if (!Array.isArray(data)) {
    data = [data]; // Convert to an array
  }
  return [...new Set(data)];
};


export const getDefaultActivityMode = () => {
  // return []
  return ['VL', 'TR', 'ST', 'PL', 'RK', 'DS', 'SU', 'PR', 'RANSPORTABLE MOISTURE LIMIT', 'SS', 'MI']
}
export const getVoucherTypes = (code) => {
  let TCRC = [
    "Sales",
    "Barbil-Credit Note",
    "Barbil - Sales",
    "Bhu-Credit Note",
    "Bhu - Sales",
    "Che-Credit Note",
    "Che - Sales",
    "Dha-Credit Note",
    "Dha - Sales",
    "DHB- Credit Note",
    "DHB - Sales",
    "Gan-Credit Note",
    "Gan - Sales",
    "GDM-Sales OS",
    "Goa-Credit Note",
    "Goa-Sales",
    "Hal-Credit Note",
    "Hal - Sales",
    "Haz-Credit Note",
    "Haz - Sales",
    "HPT - Credit Note",
    "HPT-Sales",
    "Kak-Credit Note",
    "Kak - Sales",
    "Kar - Sales",
    "Kri-Credit Note",
    "Kri - Sales",
    "Ktn - Credit Note",
    "Ktn - Sales",
    "Mang-Credit Note",
    "Mang - Sales",
    "Mum-Sales OS",
    "Para-Credit Note",
    "Para - Sales",
    "PDP-Sales OS",
    "Rai-Credit Note",
    "Rai - Sales",
    "Tut-Credit Note",
    "Tut - Sales",
    "Viz-Credit Note",
    "Viz - Sales"
  ];

  let TIPL = [
    "Sales",
    "BBSR - Credit Note",
    "BBSR-Debit Note",
    "BBSR-Sales",
    "BBSR-Sales OS",
    "DHB - SALES",
    "Goa-Credit Note",
    "Goa - Sales",
    "HLD-Sales",
    "HPT-Sales",
    "Ktn - Sales",
    "Mang-Credit Note",
    "Mang - Sales",
    "RAG- SALES",
    "Rai-Credit Note",
    "Rai - Sales"
  ]

  if (code === "C") {
    return TCRC
  }
  else if (code === "L") {
    return TIPL
  }
  else if (code === "P") {
    return []
  }
  return []
}

export const formatCurrency = (value, isQuantity = false) => {
  if (value == null || isNaN(value)) return '';

  const absValue = Math.abs(value);

  const formatNumber = (num, suffix) => `${Math.floor(num)}${suffix}`;

  if (absValue < 1_0000) return `${value}`;                                // Less than 10,000 → show as is
  if (absValue < 1_00_000) return formatNumber(value / 1_000, 'K');        // Thousand
  if (absValue < 1_00_00_000) return formatNumber(value / 1_00_000, 'L');  // Lakh
  if (absValue < 1_00_00_00_000) return formatNumber(value / 1_00_00_000, 'Cr'); // Crore
  if (absValue < 1_000_000_000) return formatNumber(value / 1_000_000, 'M');     // Million
  if (absValue < 1_000_000_000_000) return formatNumber(value / 1_000_000_000, 'B'); // Billion
  return formatNumber(value / 1_000_000_000_000, 'T');                            // Trillion
};

export function formatIndianNumber(num) {
  if (num === null || num === undefined || num === "") return "";
  return new Intl.NumberFormat("en-IN").format(num);
}



export const getColoredDate = (submissionData, status) => {
  const todaysDate = new Date().toISOString().split('T')[0]

  if (submissionData && submissionData === todaysDate) {
    return <span style={{ color: "red" }}>{getFormatedDate(submissionData, true)}</span>
  }


  else if (submissionData) {
    switch (status) {
      case 1:
        return <span style={{ color: "#07A535" }}>{getFormatedDate(submissionData, true)}</span>;

      case 3:
        return <span style={{ color: "orange" }}>{getFormatedDate(submissionData, true)}</span>;

      default:
        return <span style={{ color: "#61676d" }}>{getFormatedDate(submissionData, true)}</span>;
    }
  }

}

/**
 * get maxmimum parameter sequance no from grp and parameter json data
 * @param {*} finalParamDataSort 
 * @returns 
 */
export const getMaxParamSeqAssing = (finalParamDataSort) => {
  let maxParamSeq = -Infinity;
  if (finalParamDataSort) {
    finalParamDataSort.forEach(innerArr => {
      innerArr.forEach(item => {
        if (item.param_type === "Group" && Array.isArray(item.parameters)) {
          item.parameters.forEach(p => {
            maxParamSeq = Math.max(maxParamSeq, p.set_wise_param_sequence ?? -Infinity);
          });
        } else {
          maxParamSeq = Math.max(maxParamSeq, item.set_wise_param_sequence ?? -Infinity);
        }
      });
    });
  }
  if (maxParamSeq === -Infinity) {
    maxParamSeq = 0; // fallback
  }
  return maxParamSeq
}

export const handleCommonDownloadFile = async (url, fileName = "download") => {
  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) throw new Error("File download failed");

    const blob = await response.blob();
    let ext = "";
    const cleanUrl = url.split("?")[0];
    const lastDot = cleanUrl.lastIndexOf(".");
    if (lastDot !== -1) {
      ext = cleanUrl.substring(lastDot);
    }
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName + ext;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download error:", error);
  }
};

export const getPurchaseManager = (moduleType,permission) => {
  if (['purchaseItems'].includes(moduleType)) {
    moduleType = "itemmaster"
  }
  else if (moduleType === "stocks") {
    moduleType = "stock"
  }
  else if (moduleType === "purchaseReq") {
    moduleType = "purchaserequisition"
  }
  else if (moduleType === "purchase") {
    moduleType = "purchaseorder"
  }
  const state = store.getState();
  const userData = state.session.user;
  const allPermissions = state.session.rolePermissions
  const module = permission + "_" + moduleType;
  if (allPermissions) {
    let allPermissionsArrray = allPermissions;
    let isValideData = allPermissionsArrray.filter((per, i) => {
      let spPer = per.split(".");
      let spValue = "";
      if (spPer.length > 1) {
        spValue = spPer[1];
      } else {
        spValue = spPer[0];
      }
      return spValue === module;
    });
    if (isValideData.length > 0) {
      return true;
    }
  }
  return false;
}

export const handleCommonCustomConfirmHandler = ({ formData, setFormData, setIsOverlayLoader, moduleType, setIsCustomPopup, fields }) => {
  if (['stocks', 'purchaseItems'].includes(moduleType)) {
    handleCalibrationCreateUpdate(formData, null, setIsOverlayLoader, null, 1, 1, setIsCustomPopup, setFormData, fields)
  }
}
export const getMailSubjectDetails = (formData, docs) => {
  if (!Array.isArray(docs)) {
    docs = [docs]
  }
  let subjectLine = "";
  if (formData?.[0]?.ji_id && ['VL'].includes(formData[0]?.fk_operationtypetid_code)) {
    let VesselName = formData?.[0]?.ji_nameofoperationmode + '/'
    let clientName = formData?.[0]?.ji_client_name + '/'
    let portName = formData?.[0]?.ji_place_of_work_name + '/'
    let Qty = formData?.[0]?.ji_totalqty + ' ' + formData?.[0]?.ji_total_qty_unit + '/'
    let commodityName = formData?.[0]?.ji_commodity_name + '/'
    let jiDate = moment().format("DD/MM/YYYY")
    subjectLine = VesselName + clientName + portName + Qty + commodityName + jiDate
    if (docs.length > 1) {
      const checkInvMail = docs.find((singledoc) => {
        return ['Invoice'].includes(docs?.[0]?.['dl_file_type'])
      })
      const checkCertMail = docs.find((singledoc) => {
        return ['commercial_certificate'].includes(docs?.[0]?.['dl_file_type'])
      })
      if (checkInvMail && checkCertMail) {
        subjectLine = "FINAL SCAN COPY CERTIFICATE & INVOICE OF " + subjectLine
      }
      else {
        subjectLine = "JOINT REPORT OF " + subjectLine
      }
    }
    else if (['Supervision_Daily Report', 'Daily Report', "Only Seal Daily Report"].includes(docs?.[0]?.['dl_file_type'])) {
      subjectLine = subjectLine
    }
    else if (['Invoice'].includes(docs?.[0]?.['dl_file_type'])) {
      subjectLine = "FINAL SCAN COPY INVOICE OF " + subjectLine
    }
    else if (['commercial_certificate'].includes(docs?.[0]?.['dl_module'])) {
      subjectLine = "FINAL SCAN COPY CERTIFICATE OF " + subjectLine
    }
  }
  return subjectLine ? subjectLine.toUpperCase() : ''
}

export const getMailBodyDetails = (formData, docs) => {
  if (!Array.isArray(docs)) {
    docs = [docs]
  }
  let bodyLine = ""
  if (formData?.[0]?.ji_id && ['VL'].includes(formData[0]?.fk_operationtypetid_code)) {
    if (docs.length > 1) {
      const checkInvMail = docs.find((singledoc) => {
        return ['Invoice'].includes(docs?.[0]?.['dl_file_type'])
      })
      const checkCertMail = docs.find((singledoc) => {
        return ['commercial_certificate'].includes(docs?.[0]?.['dl_file_type'])
      })
      if (checkInvMail && checkCertMail) {
        bodyLine = "As per your nomination, please find attached final scan copy of Certificate & Invoice for the subject vessel for your reference."
      }
      else {
        bodyLine = "As per your nomination, please find attached the joint report for the subject vessel for your reference."
      }
    }
    else if (['Supervision_Daily Report', 'Daily Report'].includes(docs?.[0]?.['dl_file_type'])) {
      bodyLine = "As per your nomination please find below the attached updated reporting sheet for the subject vessel for your reference."
    }
    else if (['Invoice'].includes(docs?.[0]?.['dl_file_type'])) {
      bodyLine = "As per your nomination, please find attached final scan copy of invoice for the subject vessel for your reference."
    }
    else if (['commercial_certificate'].includes(docs?.[0]?.['dl_module'])) {
      bodyLine = "As per your nomination, please find attached final scan copy of certificate for the subject vessel for your reference."
    }
  }
  return bodyLine;
}

export const getTextWithouHtml = (singleText) => {
  if (!singleText) return "";

  const text = String(singleText); // convert to string

  return text
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
};