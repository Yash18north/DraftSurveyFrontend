import React from "react";
import PropTypes from 'prop-types';
const Forgotpassword2 = ({ setScreen }) => {
  return (
    <form className="login_container" onSubmit={() => setScreen(3)}>
      <h1 className="login_title">Forgot Password ?</h1>

      <h3 className="forgot_password_sub_title">
        Select which contact detail should we use to reset your password ?
      </h3>

      <div className="forgot_password_radio">
        <input type="radio" name="password_radio"/>
        <label htmlFor="error sms">
          Via SMS <br /> +91 xxxxx x7654
        </label>
      </div>

      <div className="forgot_password_radio">
        <input type="radio" name="password_radio"/>
        <label htmlFor="error Email">
          Via Email ID <br /> xxxxxx123@gmail.com
        </label>
      </div>
      

      <button type="submit">Continue</button>
    </form>
  );
};
Forgotpassword2.propTypes = {
  setScreen: PropTypes.func.isRequired,
};
export default Forgotpassword2;
