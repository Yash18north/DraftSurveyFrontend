import React, { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { GetTenantDetails, postDataFromApi } from "../services/commonServices";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../actions/authActions";
import { setSessionAsync } from "../reducers/sessionActions";
import { redirectPageAfterLogin, rolesDetails } from "../services/commonFunction";
import { SwitchRoleLoginApi } from "../services/api";
import {
  NavDropdown,

} from "react-bootstrap";

const OtherRolesButtons = ({ roleDetails, loginRole }) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [roles, setRoles] = useState(roleDetails?.other_roles);
  const [currentRole, setCurrent] = useState({
    role_id: roleDetails?.main_role_id,
    role_name: roleDetails?.main_role_name,
    usr_emp_id_orig: roleDetails?.usr_emp_id_orig,
  });
  const getRoleButton = (singleRole, isCurrentRole = "") => {
    return (
      // <Col sm={3} className="">
      // <Button
      //   type="button"
      //   className="roleBaseBtn"
      //   onClick={() => handleSwitchRole(singleRole)}
      //   disabled={isCurrentRole}
      // >
      //   {rolesDetails.find((role) => role.role === singleRole.role_name)?.label || singleRole.role_name}
      // </Button>
      <NavDropdown.Item
        onClick={() => handleSwitchRole(singleRole)}
        aria-label={`Switch to ${rolesDetails.find((role) => role.role === singleRole.role_name)?.label || singleRole.role_name}`}
        disabled={isCurrentRole} // works if you're using react-bootstrap >=2

      >
        <span className={isCurrentRole ? "active_role":"unactive_role"}>{isCurrentRole ? "Active Role : " : "Switch Role to "}{rolesDetails.find((role) => role.role === singleRole.role_name)?.label || singleRole.role_name}</span>
      </NavDropdown.Item>

    );
  };
  const handleSwitchRole = async (role) => {
    try {
      const bodyJson = {
        usr_emp_id: role.usr_emp_id,
        usr_emp_id_orig: currentRole.usr_emp_id_orig,
        role_id: role.role_id,
        switching_role: true,
      };
      const response = await postDataFromApi(
        SwitchRoleLoginApi,
        bodyJson,
        "",
        "",
        1
      );

      if (response?.data && response?.data?.status === 200) {
        let actualResonse = response.data.data;
        const role = actualResonse?.logged_in_user_info.role;
        actualResonse.role = role;
        const received_access_token = actualResonse.Access_Token;

        let currentDate = new Date();
        dispatch(loginSuccess(actualResonse));
        dispatch(setSessionAsync(actualResonse));
        localStorage.setItem("user-logged-in", Date.now().toString());
        redirectPageAfterLogin(navigate, role, 1);
      } else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      setTimeout(() => {
        toast.error(translate("loginPage.unExpectedError"), {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }, 500);
    } finally {
    }
  };
  return (
    <React.Fragment>
      {/* <div className="active-role"> */}
      {/* <span>Active Role</span> */}
      {
        getRoleButton({ role_name: loginRole }, 1)
      }
      {/* </div> */}
      <div className="selectable-role">
        {/* <span>Select Role To Activate</span> */}
        {/* <div className="all-selectable-role"> */}
        {roles.map((singleRole, i) => getRoleButton(singleRole))}
        {/* </div> */}

      </div>
      {/* </Row> */}
    </React.Fragment>
  );
};

export default OtherRolesButtons;
