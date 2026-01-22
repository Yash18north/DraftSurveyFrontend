import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Loading from "../components/common/Loading";
import { Container } from "reactstrap";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";


const FullLayout = () => {
  const navigate = useNavigate();
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);
  const session = useSelector((state) => state.session);

  const [changePassword, setChangePassword] = useState(false);



  useEffect(() => {
    let isLoggedIn = session.isAuthenticated
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, []);

  /*
Author : Yash Darshankar
Date : 01/09/2024
Description: Added This below code to restrict right click
*/
  // useEffect(() => {
  //   const handleContextMenu = (event) => {
  //     event.preventDefault();
  //   };

  //   document.addEventListener('contextmenu', handleContextMenu);

  //   return () => {
  //     document.removeEventListener('contextmenu', handleContextMenu);
  //   };
  // }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 44) { // Key code for Print Screen
        alert('Print Screen is not allowed!');
        // Optionally, blur or hide sensitive content here
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth >= 992);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const mainBodyRef = useRef(null);

  const [showShadow, setShowShadow] = useState(false);

  const handleScroll = () => {
    if (mainBodyRef.current?.scrollTop > 80) { // Adjust threshold as needed
      setShowShadow(true);
      // console.log("Scroll Value is More than 50")
    } else {
      setShowShadow(false);
    }
  };

  useEffect(() => {
    const container = mainBodyRef.current;
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [mainBodyRef]);
  return (
    <main className="main-body" ref={mainBodyRef}>
      {/********header**********/}
      <Header
        setShowSidebar={setShowSidebar}
        showSidebar={showSidebar}
        // style={{ zIndex: 9999 }}
        // mainBodyRef={mainBodyRef}
        setIsLoggedInUser={setIsLoggedInUser}
        changePassword={changePassword}
        setChangePassword={setChangePassword}
        showShadow={showShadow}
      />
      <div className="pageWrapper d-lg-flex">
        {/********Sidebar**********/}
        {/* {showSidebar && ( */}
        <aside className={"sidebarArea bg-danger" + (showSidebar ? " " : " hideSidebar")} id="sidebarArea">
          {/* <aside className="sidebarArea shadow bg-danger" id="sidebarArea"> */}
          <Sidebar
            changePassword={changePassword}
            setChangePassword={setChangePassword}
            setShowSidebar={setShowSidebar}
            showSidebar={showSidebar}
          />
        </aside>
        {/* )} */}
        {/********Content Area**********/}
        {/* Author : Yash Darshankar
        Date : 10/10/2021
        Desription: Removed Content without Sidebar
        
        */}
        <div className={showSidebar ? "contentArea" : " hideContentArea"}>
          {/********Middle Content**********/}
          <Container className="p-4" fluid style={{ zIndex: 0 }}>
            {isLoggedInUser ? <Outlet /> : <Loading />}
          </Container>
        </div>

      </div>
      <footer className="page-footer">
        <p>Copyright &copy; tcrcgroup.com</p>
      </footer>

    </main>
  );
};

export default FullLayout;
