// redux/actions/formActions.js
export const SET_FORM_CONFIG = "SET_FORM_CONFIG";
export const REMOVE_FIELDS_FROM_FORM_CONFIG = "REMOVE_FIELDS_FROM_FORM_CONFIG";
export const ADD_FIELDS_TO_FORM_CONFIG = "ADD_FIELDS_TO_FORM_CONFIG";

export const setFormConfig = (formConfig,formData) => ({
  type: SET_FORM_CONFIG,
  payload: {formConfig,formData},
});


export const removeFieldsFromFormConfig = (fieldsToRemove) => ({
  type: REMOVE_FIELDS_FROM_FORM_CONFIG,
  payload: fieldsToRemove, 
});

export const addFieldsToFormConfig = (sectionIndex = 0) => ({
    type: ADD_FIELDS_TO_FORM_CONFIG,
    payload:  sectionIndex,
  });
