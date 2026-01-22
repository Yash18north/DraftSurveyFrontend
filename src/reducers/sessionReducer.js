const SET_SESSION = "SET_SESSION";
const CLEAR_SESSION = "CLEAR_SESSION";

const initialState = {
  isAuthenticated: false,
  user: null,
  rolePermissions: null,
  accessToken: null,
  loading: false,
  error: null,
  historyData: null,
  sessionData: "temp",
  expiryTime: "temp",
  expdatetime: "temp",
};
const clearedState = {
  sessionData: null,
  expiryTime: null,
  expdatetime: null,
  historyData: null,
};

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SESSION:
      return {
        ...state,
        sessionData: action.payload.sessionData,
        expiryTime: action.payload.expiryTime,
        expdatetime: action.payload.expdatetime,
        isAuthenticated: true,
        user: action.payload.sessionData,
        rolePermissions: action.payload.sessionData["permissions"],
        accessToken: action.payload.sessionData["Access_Token"],
        loading: false,
        error: null,
      };

    case CLEAR_SESSION:
      return clearedState;

    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        rolePermissions: action.payload["permissions"],
        accessToken: action.payload["Access_Token"],
        loading: false,
        error: null,
      };
    case "LOGIN_REQUEST":
      return {
        ...state,
        loading: true,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        rolePermissions: null,
        accessToken: null,
        loading: false,
        error: null,
        historyData: null,
      };
    case "HISTORY_DATA":
      return {
        ...state,
        loading: false,
        historyData: action.payload,
      };


    case "SELECTED_ROW":
      return {
        ...state,
        loading: false,
        selectedSingleRow: action.payload,
      };

    case "SHARED_FILES":
      return {
        ...state,
        loading: false,
        selectedMultiDocs: action?.selectedMultiDocs,
        shareFileModule: action?.shareFileModule,
        ccEmails: action?.ccEmails,
        clientEmails: action?.clientEmails,
        ccMailSubject: action?.ccMailSubject,
        ccMailBody: action?.ccMailBody,
      };

    case "MAIN_SCOPE_WORK":
      return {
        ...state,
        loading: false,
        isMainScopeWork: action?.isMainScopeWork,
      };

    case 'REFRESH_SESSION':

      return {
        ...state,
        accessToken: action.payload.access,
        expiryTime: action.payload.expiryTime,
        expdatetime: action.payload.expdatetime,
      };
    case "CC_IDS":
      return {
        ...state,
        loading: false,
        cc_ids: action?.cc_ids,
      };
    case "REF_NUMS":
      return {
        ...state,
        loading: false,
        ref_nos: action?.ref_nos,
      };
    case "CC_Activities":
      return {
        ...state,
        loading: false,
        activities: action?.activities,
      };
    case "currentPageNo":
      return {
        ...state,
        loading: false,
        currentPageNo: action?.pageNo,
        moduleType: action?.moduleType,
        OPSCode: action?.OPSCode,
      };
    case "LOGIN_OTP_DATA":
      return {
        ...state,
        loading: false,
        OTPData: action?.OTPData
      };
    case "SIZE_ANALYSIS_DATA":
      return {
        ...state,
        loading: false,
        analysisData: action?.analysisData,
      };
    default:
      return state;
  }
};

export default sessionReducer;
