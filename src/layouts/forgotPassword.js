import React, { useState } from "react";

import Screen1 from "./forgotPasswordScreens/Forgotpassword1";
import Screen2 from "./forgotPasswordScreens/Forgotpassword2";
import Screen3 from "./forgotPasswordScreens/Forgotpassword3";
import Screen4 from "./forgotPasswordScreens/Forgotpassword4";
import Screen5 from "./forgotPasswordScreens/Forgotpassword5";
import Sliders from "./Sliders";
import { ToastContainer } from "react-toastify";

const ForgotPassword = () => {
  const [screen, setScreen] = useState(1);

  const [data, setData] = useState("");
  const [userName, setUserName] = useState("");
  const inputType = (data) => {
    const mobileRegex = /^\d{10}$/;

    const idRegex = /^[A-Za-z]{4}\d{3}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (mobileRegex.test(data)) {
      return "Mobile";
    } else if (emailRegex.test(data)) {
      return "Email";
    } else if (idRegex.test(data)) {
      return "ID";
    } else {
      return "Invalid Input";
    }
  };
  function renderScreen(screen, setScreen, data, setData, inputType) {
    switch (screen) {
      case 1:
        return (
          <Screen1
            setScreen={setScreen}
            data={data}
            setData={setData}
            inputType={inputType}
          />
        );
      case 2:
        return <Screen2 setScreen={setScreen} />;
      case 3:
        return (
          <Screen3 setScreen={setScreen} data={data} inputType={inputType} setUserName={setUserName}/>
        );
      case 4:
        return <Screen4 setScreen={setScreen} userName={userName}/>;
      case 5:
        return <Screen5 setScreen={setScreen} />;
      default:
        return null;
    }
  }

  return (
    <div className="login_page">
      {/* <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      /> */}

      <Sliders />

      {renderScreen(screen, setScreen, data, setData, inputType)}
    </div>
  );
};

export default ForgotPassword;
