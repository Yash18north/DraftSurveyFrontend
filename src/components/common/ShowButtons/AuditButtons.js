import React from 'react';
import { Button } from "react-bootstrap";
import { handleCreationOfBranchExpense, handleUpdationOfBranchExpense } from '../commonHandlerFunction/Audit/BranchExpenseHandler';
import { useNavigate } from 'react-router-dom';


const AuditButtons = ({ moduleType, formData, formConfig, viewOnly, setFormData, EditRecordId,handleSubmit }) => {
  const navigate = useNavigate();

  return (
    <div className="auditBtns">
      <Button
        type="button"
        className="cancelBtn"
        onClick={() => {
          navigate("/audit/branch-expense-list");
        }}
      >
        Back
      </Button>

      {!viewOnly && (
        <>

          <Button type="button" className="submitBtn"
            onClick={() => {
              if (moduleType === "auditBranchExpenses") {
                handleCreationOfBranchExpense(formData, formConfig, setFormData,navigate,"posted",handleSubmit);
                // navigate("/audit/branch-expense-list");
              }
            }}
          >Post</Button>
         {!formData[0]?.id && (
          <Button
            type="button"
            className="saveBtn"
            onClick={() => {
              if (moduleType === "auditBranchExpenses") {
                handleCreationOfBranchExpense(formData, formConfig, setFormData,navigate,"saved",handleSubmit);
                // navigate("/audit/branch-expense-list");
              }
            }}
          >
            Save
          </Button>
         )}
          </>
      )}
    </div>
  );
};

export default AuditButtons;
