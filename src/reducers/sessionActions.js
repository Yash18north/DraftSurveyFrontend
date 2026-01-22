const SET_SESSION = "SET_SESSION";
const CLEAR_SESSION = "CLEAR_SESSION";
export const setSession = (sessionData, expiryTime,expdatetime) => ({
  type: SET_SESSION,
  payload: { sessionData, expiryTime, expdatetime },
});

export const clearSession = () => ({
  type: CLEAR_SESSION,
});

export const setSessionAsync = (sessionData) => {
  return (dispatch) => {
    let expiryTimeInSeconds =
      Math.round(parseFloat(sessionData.expiry_time)) || 7200;
    const expiryTime = expiryTimeInSeconds;
    const expdatetime  = Date.now() + (expiryTimeInSeconds * 1000);
    dispatch(setSession(sessionData, expiryTime, expdatetime));
  };
};

export const clearSessionAsync = () => {
  return (dispatch) => {
    dispatch(clearSession());
  };
};


export const refreshSession = (access, expiryTime, expdatetime) => ({
  type: 'REFRESH_SESSION',
  payload: { access, expiryTime , expdatetime},
});

export const logout = () => (dispatch) => {
  dispatch(clearSession());
};