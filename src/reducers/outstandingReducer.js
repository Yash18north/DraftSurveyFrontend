const SET_FORM_CONFIG = "SET_FORM_CONFIG";
const REMOVE_FIELDS_FROM_FORM_CONFIG = "REMOVE_FIELDS_FROM_FORM_CONFIG";
const ADD_FIELDS_TO_FORM_CONFIG = "ADD_FIELDS_TO_FORM_CONFIG";

const initialState = {
    formConfig: null,
    formData: [],
    allNewFields:[]
}

 const outstandingReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case SET_FORM_CONFIG:
//             console.log("Setting", action)
//             return {
//                 ...state,
//                 formConfig: action.payload.formConfig,
//                 formData: action.payload.formData,
//             };
//         case REMOVE_FIELDS_FROM_FORM_CONFIG:
//             return {
//                 ...state,
//                 formConfig: {
//                     ...state.formConfig,
//                     sections: state.formConfig?.sections.map(section => ({
//                         ...section,
//                         fields: section.fields.filter(
//                             field => !action.payload.find(tempField => tempField.name === field.name)
//                         ),
//                     })),
//                 },
//             };
//         case ADD_FIELDS_TO_FORM_CONFIG:
//             if (!state.formConfig || !state.formData[0]?.branch_name) {
//                 return state; 
//             }
//             console.log("object", state.formConfig.sections[0]);
//             const newFields = state.formData[0]?.branch_name.map(branchInputName => ({
//                 width: 6,
//                 name: branchInputName,
//                 label: branchInputName,
//                 value: state.formData[0]?.[branchInputName] || "",
//                 type: "text",
//                 placeholder: "Enter Amount"
//             }));
//              state.allNewFields([...newFields])
//             return {
//                 ...state,
//                 formConfig: {
//                     ...state.formConfig,
//                      fields:state.formConfig?.sections[0].fields.filter((field)=> {  
//                         !state.allNewFields.find(tempField => tempField.name === field.name)
    
//                      }),
//                      :state.formConfig?.sections[0].fields.splice(7, 0, ...newFields)
//                 }
//             };

//         default:
//             return state;

//     }
}

export default outstandingReducer;