const initialState = {
  isAuthenticated: false,
  user: null,
  rolePermissions: null,
  accessToken: null,
  loading: false,
  error: null,
  historyData: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_REQUEST":
      return {
        ...state,
        loading: true,
      };
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

    case "MAIN_SCOPE_WORK":
      return {
        ...state,
        loading: false,
        isMainScopeWork: action?.isMainScopeWork,
      };

    case "SELECTED_ROW":
      return {
        ...state,
        loading: false,
        selectedSingleRow: action.payload,
      };


    default:
      return state;
  }
};

export default authReducer;
