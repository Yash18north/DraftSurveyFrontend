import { store } from '../services/store';

export const getToken = () => {
  const state = store.getState();
  const accessToken = state.session?.accessToken;
  return accessToken;
};

export const removeToken = () => {
  localStorage.removeItem("accessToken");
};

export const getForgotPWDToken = () => {
  const accessToken = localStorage.getItem("forgotToken");
  return accessToken;
};

export const setForgotPWDToken = (token) => {
  const accessToken = localStorage.setItem("forgotToken", token);
  return accessToken;
};
export const removeForgotPWDToken = () => {
  localStorage.removeItem("forgotToken");
};

export const getResetToken = () => {
  const accessToken = localStorage.getItem("resetToken");
  return accessToken;
};

export const setResetToken = (token) => {
  const accessToken = localStorage.setItem("resetToken", token);
  return accessToken;
};
export const removeResetToken = () => {
  localStorage.removeItem("resetToken");
};
