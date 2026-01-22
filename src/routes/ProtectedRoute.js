import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from "react-redux";
import UnAuthenticateAccessPopup from '../components/common/UnAuthenticateAccessPopup';



const ProtectedRoute = ({ component: Component, isOperationJRF,ops_code, ...rest }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isValidate, setIsValidate] = useState(false)
  const [isShow, setIsShow] = useState(false)
  const [isPathChanged, setIsPathChanged] = useState(true);
  /*
  Author: Yash
  Date: 01/09/2021
  Use: Added Depedency array to useEffect 
  */
  const session = useSelector((state) => state.session);
  useEffect(() => {
      // setIsPathChanged(false);
  
      // const timer = setTimeout(() => {
      //   setIsPathChanged(true);
      // }, 1000); // or 10ms, depending on your need
  
      // return () => clearTimeout(timer);
    }, [location.pathname]);
  useEffect(() => {
    let isLoggedIn = session?.accessToken;
    if (!isLoggedIn) {
      navigate('/login');
    }
    else if (session?.user?.role === "ADMIN") {
      setIsShow(true)
      setTimeout(() => [
        handleFunction()
      ], 3000)
    }
    else {
      setIsValidate(true)
    }
  }, [navigate]);
  const handleFunction = () => {
    let adminurl = window.location.origin
    window.location.href = adminurl + '/master'
  }
  return (
    <span>
      <UnAuthenticateAccessPopup isShow={isShow} setIsShow={setIsShow} handleFunction={handleFunction} />
      {isValidate && isPathChanged ? <Component isOperationJRF={isOperationJRF} ops_code={ops_code} /> : null}
    </span>
  );
};


ProtectedRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
};
export default ProtectedRoute;