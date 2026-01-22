export const loginRequest = () => ({
    type: 'LOGIN_REQUEST',
  });
  
  export const loginSuccess = (user) => ({
    type: 'LOGIN_SUCCESS',
    payload: user,
  });
  
  export const loginFailure = (error) => ({
    type: 'LOGIN_FAILURE',
    payload: error,
  });
  

  export const logout = () => ({
    type: 'LOGOUT',
  });
  export const historyData = (entityData) => ({
    type: 'HISTORY_DATA',
    payload: entityData,
  });

  export const selectedSingleRow = (row) => ({
    type: 'SELECTED_ROW',
    payload: row,
  });