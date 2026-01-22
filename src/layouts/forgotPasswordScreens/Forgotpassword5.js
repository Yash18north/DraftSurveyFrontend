import React from "react";
import tick from "../../assets/images/logos/red_tick.png";
import { useNavigate } from "react-router-dom";

const Forgotpassword5 = () => {
  const navigate = useNavigate();
  return (
    <form
      className="login_container"
      onSubmit={() => navigate('/login')}
    >
      <img src={tick} alt="tick" />
      <h1 className="forgot_password_successfully">Successfully</h1>

      <h3 className="forgot_password_sub_title_successfully">
        Your password has been reset successfully
      </h3>

      <button type="submit">Continue</button>
    </form>
  );
};

export default Forgotpassword5;
