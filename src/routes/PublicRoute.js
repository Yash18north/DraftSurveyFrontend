import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getToken } from "../services/localStorageServices";
import { redirectPageAfterLogin } from "../services/commonFunction";
import PropTypes from "prop-types";

export const selectUser = (state) => state.user;
const PublicRoute = ({ component: Component, ...rest }) => {
  
  let user = useSelector(selectUser);
  const session = useSelector((state) => state.session);

  user = session.user;
  
  const navigate = useNavigate();
  /*
  Create by Yash 
  Added Dependency to Fix errors of sonarqube

  */
  useEffect(() => {
    let isLoggedIn = getToken();
    if (isLoggedIn) {
      redirectPageAfterLogin(navigate, user?.role);
    }
  }, [navigate, user?.role]);

  return <Component />;
};
PublicRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
};
export default PublicRoute;
