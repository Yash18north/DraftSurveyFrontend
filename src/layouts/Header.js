import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Container,
  Nav,
  NavDropdown,
  Navbar,
  NavbarBrand,
  Tab,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../services/localStorageServices";
import { ToastContainer, toast } from "react-toastify";
import { getDataFromApi, postDataFromApi } from "../services/commonServices";
import { LogOutApi, notificationListApi, announementListApi, getWorkAnniversary, getBirthday } from "../services/api";
import ChangePasswordModal from "./forgotPasswordScreens/changePasswordModal";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/authActions";
import PropTypes from "prop-types";

import { ReactComponent as Lock } from "../assets/images/icons/lock.svg";
import LogoutPopup from "../components/common/LogoutPopup";
import {
  // changeSystemConfigDynamic,
  getComonCodeForCompany,
  getFormatedDateWithtime,
  getLogoCondition,
  rolesDetails,
  useScreenSize,
} from "../services/commonFunction";
import { clearSessionAsync } from "../reducers/sessionActions";
import OtherRolesButtons from "./OtherRolesButtons";
import OccassionsTabs from "../components/common/BirthdayNotification/OccassionsTabs"
import moment from "moment";
// import OccassionsTabs from "../components/common/BirthdayNotification/OccassionsTabs"

export const selectUser = (state) => state.user;
export const selectIsAuthenticated = (state) => state.isAuthenticated;

const Header = ({ showSidebar, setShowSidebar, setIsLoggedInUser, changePassword, setChangePassword, showShadow }) => {
  let user = useSelector(selectUser);
  const session = useSelector((state) => state.session);

  user = session.user;
  const systemConfigData = session.configurationData;
  const sessionData = useSelector((state) => state.session.sessionData);
  let expiryTime = useSelector((state) => state.session.expiryTime);
  let expdatetime = useSelector((state) => state.session.expdatetime);

  const dispatch = useDispatch();
  let navigate = useNavigate();
  const { width } = useScreenSize()
  // const [changePassword, setChangePassword] = useState(false);
  const [allNotifications, setAllNotifications] = useState([]);
  const [nextPage, setNextPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [allAnnouncements, setAllAnnouncements] = useState([]);
  const [birthdays, setBirthdays] = useState({})
  const [wkanniversary, setWkanniversary] = useState({})

  /*

  Author : Yash Darshankar
  Date : 05-07-2024
  Use : I have commented this code because it is of no use for us now
  */
  // useEffect(() => {
  //   /*
  //   will check logout from other tab
  //   */
  //   const handleStorageChange = (event) => {
  //     if (event.key === "user-logged-out") {
  //       localStorage.removeItem("user-logged-out");
  //       setTimeout(() => {
  //         window.location.reload();
  //       }, 1000);
  //     }
  //   };
  //   window.addEventListener("storage", handleStorageChange);

  //   return () => {
  //     window.removeEventListener("storage", handleStorageChange);
  //   };
  // }, [dispatch]);
  /*
  Author : Yash Darshankar
  Date : 05-07-2024
  Use : I have commented this code because it is of no use for us now
  */
  /*
  for logout user function
  */
  const handleLogout = async () => {
    if (sessionData === "loggedout") return;
    let res = await postDataFromApi(LogOutApi, {
      refresh_token: user?.refresh_token,
    });
    if (res.data.status === 200) {
      toast.success("You have successfully Logged Out", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      dispatch(logout());
      removeToken();
      localStorage.clear();
      dispatch(clearSessionAsync());
      setTimeout(() => {
        localStorage.setItem("user-logged-out", Date.now().toString());
        navigate("/login");
      }, 250);
    } else {
      toast.error(res.message, {
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
  };
  /*use for click on notification then get all notifications */
  const getAllNotificationList = async (isNext = "") => {
    try {
      let endPoint = notificationListApi;
      if (isNext) {
        endPoint = endPoint + `?page=${nextPage}`;
      }
      let res = await getDataFromApi(endPoint);
      if (res?.status === 200) {
        let responseData = res.data;
        setAllNotifications(responseData.results);
        setHasMore(responseData.next !== null);
        if (isNext) {
          setNextPage((prevPage) => prevPage + 1);
        } else {
          setNextPage(1);
        }
      }
    } catch (error) {
    }
  };
  /*
  use for set each notification color
  */
  const getNotificationColor = (status) => {
    if (status === "completed") {
      return "notification_complete";
    } else if (status === "rejected") {
      return "notification_rejected";
    } else {
      return "notification_none";
    }
  };
  /* user for grt branch name */
  const showBranchName = (user, title = false) => {
    let FirstPartHeader = "";

    // --- Company ---
    if (user?.logged_in_user_info?.user_companies?.length > 0) {
      const companyCodes = user?.logged_in_user_info?.user_companies.map(
        (item) => item.company.company_code
      );
      FirstPartHeader = companyCodes
        .map((item) => getComonCodeForCompany(item))
        .filter((name) => name.trim() !== "")
        .join(" , ");
    } else {
      FirstPartHeader = getComonCodeForCompany(
        user?.logged_in_user_info?.lab_or_branch?.company_code
      );
    }

    // --- Branch ---
    let branchToShow = "";
    let tooltipBranches = "";

    if (user?.logged_in_user_info?.user_branches?.length > 0) {
      const branches = user?.logged_in_user_info?.user_branches.map(
        (item) => item.branch.branch_name
      );

      branchToShow = branches[0] || "";
      if (branches.length > 1) {
        tooltipBranches = branches.slice(1).join(" , ");
      }
    } else {
      branchToShow = user?.logged_in_user_info?.lab_or_branch?.branch_name || "";
    }

    const text = `${FirstPartHeader} ${branchToShow}`.trim();

    const maxLength = 50;
    if (text.length > maxLength) {
      const truncatedText = text.substring(0, maxLength - 3) + "...";
      return title ? text : truncatedText;
    }

    // ✅ if `title=true`, always return a plain string
    if (title) {
      return tooltipBranches ? `${text} (${tooltipBranches})` : text;
    }

    // ✅ if rendering inside UI, allow tooltip with JSX
    if (tooltipBranches) {
      return (
        // <span title={tooltipBranches}>
        //   {text}
        // </span>
        <marquee behavior="scroll" direction="left" className="">
          <span title={tooltipBranches}>
            {tooltipBranches}
          </span>
        </marquee>
      );
    }

    return text;
  };

  /*
  all anouncement show in marques
  */
  const getAllAnnouncementList = async (isNext = "") => {
    try {
      let endPoint = announementListApi;
      let res = await getDataFromApi(endPoint);

      if (res?.status === 200) {
        let responseData = res.data;
        const today = moment().startOf('day'); // Only date part, time = 00:00:00
        const filteredAnnouncements = responseData.data.filter((announcement) => {
          const lastDate = moment(announcement.announcement_last_date).endOf('day'); // Ensure full day included
          return lastDate.isSameOrAfter(today, 'day') && announcement.announcement_status === "Active";
        });

        setAllAnnouncements(filteredAnnouncements);
      }
    } catch (error) {
      // console.log("Error in Announcement: ", error);
    }
  };

  useEffect(() => {
    getAllAnnouncementList();
  }, []);
  /**
   * get birthday and work anniversary data
   * @param {*} key 
   * @param {*} pageNumber 
   * @returns 
   */
  const getBirthdayWorkAnniversary = async (key, pageNumber = 1) => {

    try {
      let endPoint = "";
      let newEndPoint = "";

      if (key === "wkanniversary") {

        endPoint = getWorkAnniversary;
        newEndPoint = `${endPoint}?page_size=50&page=${pageNumber}`;
      }
      else if (key === "birthday") {

        endPoint = getBirthday;
        newEndPoint = `${endPoint}?page_size=50&page=${pageNumber}`;

      }

      if (!newEndPoint) return;

      const res = await getDataFromApi(newEndPoint);

      if (res?.status === 200) {

        // if(key === "wkanniversary") {
        //   setWkanniversary(prev => ({
        //     ...prev,
        //     ...res,
        //     data: {
        //       ...res.data,
        //       data: [...(prev?.data?.data || []), ...res.data.data]
        //     }
        //   }));
        // } else if (key === "birthday") {
        //   setBirthdays(prev => ({
        //     ...prev,
        //     ...res,
        //     data: {
        //       ...res.data,
        //       data: [...(prev?.data?.data || []), ...res.data.data]
        //     }
        //   }));
        // }

        if (key === "wkanniversary") {
          setWkanniversary(prev => ({
            ...prev,
            ...res,
            data: {
              ...res.data,
              data: res.current_page > 1
                ? [...(prev?.data?.data || []), ...res.data.data] // append
                : res.data.data // replace
            }
          }));
        } else if (key === "birthday") {
          setBirthdays(prev => ({
            ...prev,
            ...res,
            data: {
              ...res.data,
              data: res.current_page > 1
                ? [...(prev?.data?.data || []), ...res.data.data]
                : res.data.data
            }
          }));
        }


      }
    } catch (error) {
      console.error("API call failed:", error);
    }
  };




  return (
    <Navbar
      color="white"
      className={`web-header my-0 py-0 ${showShadow ? 'navbar-with-border' : ''}`}
      style={{ zIndex: 2 }}
    >
      <LogoutPopup
        handleLogout={handleLogout}
        sessionData={sessionData}
        expiryTime={expiryTime}
        setIsLoggedInUser={setIsLoggedInUser}
        expdatetime={expdatetime}
      />
      <Container fluid className="bg-white">

        <div className="d-flex justify-content-between w-100">
          {/* {showSidebar && ( */}
          <NavbarBrand className={`${width <= 1024 ? "tcrcLogoMobile" :"tcrcLogo"}`}>
            <Nav.Item aria-label="List Icon">
              <Nav>
                <button
                  onClick={() => setShowSidebar((prev) => !prev)}
                  className="nonNativeButton2"
                  aria-label="Header Button"
                >

                  <i
                    className={
                      // "bi bi-list header_icon header_list_icon"
                      showSidebar ? "bi bi-x-lg header_icon header_list_icon" : "bi bi-list header_icon header_list_icon"

                    }
                  ></i>
                </button>
              </Nav>
            </Nav.Item>
            <img
              src={getLogoCondition(user?.logged_in_user_info?.lab_or_branch?.company_code)}
              width="181"
              height="48"
              className="responsive "
              alt="logo"
            />

          </NavbarBrand>
          {/* )} */}
          <div className="header_location_container">
            <img
              src={getLogoCondition(user?.logged_in_user_info?.lab_or_branch?.company_code)}
              width="96"
              height="24"
              className="mobile_logo"
              alt="logo"
            />
            <div className="d-flex branchDetailsSection header_location">

              {(user?.logged_in_user_info?.lab_or_branch ||
                user?.logged_in_user_info?.user_companies?.length > 0 ||
                user?.logged_in_user_info?.user_branches?.length > 0) && (
                  <span
                    className="header_loc"
                    title={
                      ['BU', 'BH', 'CP'].includes(user?.role)
                        ? "Branch : " + showBranchName(user, true) // ✅ plain string
                        : "Lab : " +
                        getComonCodeForCompany(
                          user?.logged_in_user_info?.lab_or_branch?.company_code
                        ) +
                        " " +
                        (user?.logged_in_user_info?.lab_or_branch?.lab_name || "")
                    }
                  >
                    <i className="bi bi-geo-alt"></i>
                    {['BU', 'BH', 'CP'].includes(user?.role) ? (
                      <>Branch: {showBranchName(user)}</>
                    ) : (
                      <>Lab : {getComonCodeForCompany(user?.logged_in_user_info?.lab_or_branch?.company_code)}{" "}
                        {user?.logged_in_user_info?.lab_or_branch?.lab_name || ""}
                      </>
                    )}
                  </span>
                )}

            </div>
          </div>
          <div className="marquee_and_roles_container">
            {allAnnouncements.length > 0 && (
              <marquee behavior="scroll" direction="left" className="Announcement">
                {allAnnouncements.map((a, index) => (
                  <span key={index}>
                    • {a.announcement_name.trim()}
                  </span>
                ))}
              </marquee>
            )}

            {/* {user?.all_roles?.main_role_id && user?.all_roles?.other_roles?.length > 0 && (
              <OtherRolesButtons
                roleDetails={user?.all_roles}
                loginRole={user?.role}
              />
            ) || ""} */}
          </div>

          <Nav className="align-items-center right_header_icons">

            <NavDropdown

              title={
                <span>
                  <span className="visually-hidden">Birthday</span>
                  <i className="bi bi-gift fs-4" aria-hidden="true" title="Birthday and Anniversary"></i>
                </span>
              }
              id="navbarDropdown"
              align="end"
              className="profileImgBg birthday-section"
            >
              {/* <div > */}

              <OccassionsTabs
                birthdays={birthdays}
                wkanniversary={wkanniversary}
                getBirthdayWorkAnniversary={getBirthdayWorkAnniversary}

              />
              {/* </div> */}
              <div>

              </div>
            </NavDropdown>
            <Nav.Link href="https://www.myshiptracking.com/vessels" className="profileImgBg birthday-section" target="_blank">
              <i className="bi bi-geo-alt fs-4" aria-hidden="true" title="Vessel ETA"></i>
            </Nav.Link>
            {user?.role !== "SU" &&
              <NavDropdown
                title={
                  <span>
                    <span className="visually-hidden">Notifications</span>
                    <i className="bi bi-bell header_icon" aria-hidden="true" title="Notifications"></i>
                  </span>
                }
                id="navbarDropdown"
                align="end"
                className="profileImgBg notification-section"
                onToggle={(isOpen) => {
                  // Call the function only when the dropdown is closed (isOpen will be false)
                  if (isOpen) {
                    getAllNotificationList();
                  }
                }}
              >
                <>
                  {allNotifications.map((notification, notificationIndex) => (
                    <NavDropdown.Item
                      href="#"
                      aria-label="Logout"
                      className={
                        "notification_item " +
                        getNotificationColor(notification.status)
                      }
                      key={"Notification Index : " + notificationIndex}
                    >
                      {notification.message}
                    </NavDropdown.Item>
                  ))}
                </>
                {hasMore && (
                  <div className="load_more_btn">
                    <Button
                      onClick={() => getAllNotificationList(1)}
                      className="submitBtn"
                    >
                      Load More
                    </Button>
                  </div>
                )}
              </NavDropdown>}
            <NavDropdown
              title={
                <span>
                  <span className="visually-hidden">Profile Menu</span>
                  {user?.logged_in_user_info?.usr_profile_url ? <img src={user?.logged_in_user_info?.usr_profile_url} className="header_icon_profile profielExists" alt="" title="Profile Menu" /> : <i
                    className="bi bi-person-circle header_icon_profile"
                    aria-hidden="true" title="Profile Menu"
                  />
                  }
                </span>
              }
              id="navbarDropdown"
              align="end"
              className="profileImgBg profile-menu"
            >
              <NavDropdown.Item aria-label="Lock"
                onClick={() => setChangePassword((prev) => !prev)}
              >

                <span className="visually-hidden">Change Password</span>Change Password

              </NavDropdown.Item>
              {user?.all_roles?.main_role_id && user?.all_roles?.other_roles?.length > 0 && (
                <OtherRolesButtons
                  roleDetails={user?.all_roles}
                  loginRole={user?.role}
                />
              )}

            </NavDropdown>

            {changePassword && (
              <ChangePasswordModal
                setChangePassword={setChangePassword}
                style={{ zIndex: 7 }}
              />
            )}

            <div className="header_urs_and_branch_label">
              <p className="header_urs_label">
                <p>{user?.logged_in_user_info?.contact_person_name}</p>
                <span>Designation : {user?.logged_in_user_info?.usr_designation}</span>
                <br />
                <span className="last_login_span">Last Login : {getFormatedDateWithtime(user?.logged_in_user_info?.usr_last_login, 1)}</span>
              </p>

            </div>
            <NavDropdown
              title={
                <span>
                  <span className="visually-hidden">Profile Menu</span>
                  <i
                    className="bi bi-person-circle "
                    aria-hidden="true"
                  ></i>
                </span>
              }
              id="navbarDropdown"
              align="end"
              className="header_profile_2"
            >
              <NavDropdown.Item aria-label="Lock"
                onClick={() => setChangePassword((prev) => !prev)}
              >

                <span className="visually-hidden">Change Password</span>Change Password

              </NavDropdown.Item>
              <NavDropdown.Item
                href="#"
                onClick={() => {
                  handleLogout();
                }}
                aria-label="Logout"
              >
                <span className="visually-hidden">Logout</span>Logout
              </NavDropdown.Item>

            </NavDropdown>

          </Nav>

        </div>
      </Container>
    </Navbar >
  );
};

Header.propTypes = {
  showSidebar: PropTypes.bool,
  setShowSidebar: PropTypes.func,
  setIsLoggedInUser: PropTypes.func,
};

export default Header;
