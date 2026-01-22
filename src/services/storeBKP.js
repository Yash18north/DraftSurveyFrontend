import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../reducers/authReducer";

/*
Use : Use for save all redux data into localStorage bcz of when we reload the page then clear store from redux
Author : sufiyan Patel
Date:30-04-2024
*/
const saveStateToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("reduxState", serializedState);
  } catch (error) {
    console.error("Could not save state", error);
  }
};
const store = configureStore({
  reducer: authReducer,
});
store.subscribe(() => {
  saveStateToLocalStorage(store.getState());
});

export default store;
