import axios from "axios";
import { getToken } from "./localStorageServices";
import {
  decryptData,
  decryptDataForURL,
  encryptData,
} from "../utills/useCryptoUtils";
import { store } from "./store";
export const isDevelopments = "DEV";
const isEncryption = "FALSE";
// export const developmentURL = process.env.REACT_APP_API_DEV_URL;
export const developmentURL = "http://192.168.1.2:8000";
export const MainUrl = developmentURL

const BASE_URL = MainUrl + "/api/v1";
/*
Use : Use for calling get Api
Author : sufiyan Patel
Date:25-04-2024
*/
const successStatus = [200, 201, 202];
const encryptionData = (payloadData) => {
  // if (isEncryption === "TRUE") {
  //   payloadData = {
  //     body: encryptData(payloadData),
  //   };
  // }

  return payloadData;
};
const decryptedData = (resData) => {
  // if (isEncryption === "TRUE") {
  //   resData = decryptData(resData);
  //   return resData
  // }

  return resData;
};
export const getDataFromApi = (getUrl, model = {}, isTenantUrl = "", isNoEncrypt,isPDFDownload) => {
  let accessToken = getToken();
  accessToken = accessToken || "";
  let finalUrl;

  if (getUrl.indexOf("mocky") !== -1) {
    finalUrl = getUrl;
  } else if (getUrl.startsWith("/")) {
    finalUrl = `${BASE_URL}${getUrl}`;
  } else {
    finalUrl = `${BASE_URL}/${getUrl}`;
  }
  getUrl = finalUrl;
  if (isTenantUrl) {
    if (getUrl.indexOf("?") !== -1) {
      getUrl = getUrl + "&tenant_url=" + GetTenantDetails();
    } else {
      getUrl = getUrl + "?tenant_url=" + GetTenantDetails();
    }
  } else {
    if (getUrl.indexOf("?") !== -1) {
      getUrl = getUrl + "&tenant=" + GetTenantDetails(1);
    } else {
      getUrl = getUrl + "?tenant=" + GetTenantDetails(1);
    }
  }
  let config = {
    method: "get",
    url: getUrl,
    data: model,
  };
  if (accessToken) {
    config["headers"] = {
      Authorization: "Bearer " + accessToken,
    };
  }
  if (isPDFDownload) {
    config["responseType"] = "blob";
  }
  const resp = axios(config)
    .then((res) => {
      if (!isNoEncrypt) {
        res.data = decryptedData(res.data);
        if (successStatus.includes(res?.status)) {
          res.data.status = 200;
        }
      }

      return res;
    })
    .catch((err) => {
      if (err?.response?.data) {
        err.response.data = decryptedData(err?.response?.data);
        err.response.data = err.response.data
          ? err.response.data
          : {
            status: 500,
            data: {},
          };
      }
      return {
        code: 0,
        status: false,
        data: err.response.data,
        message: err?.response?.data?.message
          ? err?.response?.data?.message
          : "Oops! Something went wrong while trying to access the service. Please try again later.",
      };
    });
  return resp;
};
/*
Use : Use for calling PUT Api
Author : sufiyan Patel
Date:25-04-2024
*/
export const putDataFromApi = (putUrl, model, is_formdata, isTenantUrl) => {
  let accessToken = getToken();
  accessToken = accessToken || "";
  putUrl = putUrl.startsWith("/")
    ? `${BASE_URL}${putUrl}`
    : `${BASE_URL}/${putUrl}`;
  if (!model) {
    model = {};
  }
  if (isTenantUrl) {
    model.tenant_url = GetTenantDetails();
  } else {
    model.tenant = GetTenantDetails(1);
  }
  let config = {
    method: "put",
    url: putUrl,
    data: encryptionData(model),
  };
  if (accessToken) {
    config["headers"] = {
      Authorization: "Bearer " + accessToken,
    };
  }
  const resp = axios(config)
    .then((res) => {
      res.data = decryptedData(res.data);
      if (successStatus.includes(res?.status)) {
        res.data.status = 200;
      }
      return res;
    })
    .catch((err) => {
      if (err?.response?.data) {
        err.response.data = decryptedData(err?.response?.data);
        err.response.data = err.response.data
          ? err.response.data
          : {
            status: 500,
            data: {},
          };
      }
      return {
        code: 0,
        status: false,
        data: err.response.data,
        message: err?.response?.data?.message
          ? err?.response?.data?.message
          : "Oops! Something went wrong while trying to access the service. Please try again later.",
      };
    });
  return resp;
};

/*
Use : Use for calling POST Api
Author : sufiyan Patel
Date:25-04-2024
*/
export const postDataFromApi = async (
  postUrl,
  model,
  is_formdata = "",
  isPDFDownload = "",
  isTenantUrl = ""
) => {
  let accessToken = getToken();
  accessToken = accessToken || "";
  postUrl = postUrl.startsWith("/")
    ? `${BASE_URL}${postUrl}`
    : `${BASE_URL}/${postUrl}`;
  if (!model) {
    model = {};
  }
  if (isTenantUrl) {
    model.tenant_url = GetTenantDetails();
  } else {
    model.tenant = GetTenantDetails(1);
  }
  let config = {
    method: "post",
    url: postUrl,
  };

  if (is_formdata) {
    config.data = model;
  }
  else {
    config.data = encryptionData(model);
  }

  if (accessToken) {
    config["headers"] = {
      Authorization: "Bearer " + accessToken,
    };
  }
  if (isPDFDownload) {
    config["responseType"] = "blob";
  }
  const resp = axios(config)
    .then((res) => {
      if (isPDFDownload) {
        res.data = res.data;
      } else {
        res.data = decryptedData(res.data);
      }
      if (successStatus.includes(res?.status)) {
        res.data.status = 200;
      }
      return res;
    })
    .catch((err) => {
      if (err?.response?.data) {
        err.response.data = decryptedData(err?.response?.data);
        err.response.data = err?.response?.data
          ? err?.response?.data
          : {
            status: 500,
            data: {},
          };
      }
      return {
        code: 0,
        status: false,
        data: err?.response?.data
          ? err?.response?.data
          : {
            status: 500,
            data: {},
          },
        message: err?.response?.data?.message
          ? err?.response?.data?.message
          : "Oops! Something went wrong while trying to access the service. Please try again later.",
      };
    });
  return resp;
};

/*
Use : Use for calling DELETE Api
Author : sufiyan Patel
Date:25-04-2024
*/
export const deleteDataFromApi = (deleteUrl, model, isTenantUrl) => {
  let accessToken = getToken();
  accessToken = accessToken || "";
  deleteUrl = deleteUrl.startsWith("/")
    ? `${BASE_URL}${deleteUrl}`
    : `${BASE_URL}/${deleteUrl}`;
  if (!model) {
    model = {};
  }
  if (isTenantUrl) {
    model.tenant_url = GetTenantDetails();
  } else {
    model.tenant = GetTenantDetails(1);
  }
  let config = {
    method: "delete",
    url: deleteUrl,
    data: encryptionData(model),
  };
  if (accessToken) {
    config["headers"] = {
      Authorization: "Bearer " + accessToken,
    };
  }
  const resp = axios
    .request(config)
    .then((res) => {
      res.data = decryptedData(res.data);
      if (successStatus.includes(res?.status)) {
        res.data.status = 200;
      }
      return res;
    })
    .catch((err) => {
      if (err?.response?.data) {
        err.response.data = decryptedData(err?.response?.data);
        err.response.data = err.response.data
          ? err.response.data
          : {
            status: 500,
            data: {},
          };
      }
      return {
        code: 0,
        status: false,
        data: err.response.data,
        message: err?.response?.data?.message
          ? err?.response?.data?.message
          : "Oops! Something went wrong while trying to access the service. Please try again later.",
      };
    });
  return resp;
};

export function GetTenantDetails(isTenantId, isTenantcode = "",isPetroJRF="") {
  // return "test"
  if (isTenantId) {
    const state = store.getState();
    const userData = state.session.user;
    if (isTenantcode) {
      if(isPetroJRF){
        return "TPBPL"
      }
      return userData?.logged_in_user_info?.tenant_code;
    }
    if (userData?.logged_in_user_info?.tenant_id) {
      return userData?.logged_in_user_info?.tenant_id;
    } else {
      return decryptDataForURL(localStorage.getItem("tenantId"));
    }
  } else {
    const hostname = window.location.origin;
    // return developmentURL;
    return "https://tcrc-uatops.tayadigital.com";
    return hostname;
  }
}