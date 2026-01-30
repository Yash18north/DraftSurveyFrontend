import { Collapse, Nav, NavItem } from "reactstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NavbarBrand } from "react-bootstrap";
import { useEffect, useState } from "react";
import { getLogoCondition, isModuelePermission, useScreenSize } from "../services/commonFunction";
import { useDispatch, useSelector } from "react-redux";


// Sub Icon Images
import jiIcon from "../assets/images/icons/jiIcon.svg";
import ccIcon from "../assets/images/icons/ccIcon.svg";

// Sub Icon Hover Images
import jiIconHover from "../assets/images/icons/jiIconHover.svg";
import plantIconHover from "../assets/images/icons/plantIconHover.svg";
import ccIconHover from "../assets/images/icons/ccIconHover.svg";

import { toast } from "react-toastify";
import { postDataFromApi } from "../services/commonServices";
import { LogOutApi } from "../services/api";
import { clearSessionAsync, logout } from "../reducers/sessionActions";
import { removeToken } from "../services/localStorageServices";

const navigation = [
  {
    title: "Operations",
    href: "/operation",
    icon: "bi bi-gear ",
    permission: "custom",
    isMainPrmission: 1,
    submenu: [
      
      {
        title: "Draught Survey",
        href: "/operation/other-list",
        icon: "bi bi-info-circle",
        hoverImage: plantIconHover,
        permission: "shipment",
      },
      {
        title: "Certificates",
        href: "/operation/commercial-certificate-list",
        icon: "bi bi-clipboard-check ",
        image: ccIcon,
        hoverImage: ccIconHover,
        permission: "shipment",
      },
    ],
  },
  {
    title: "Shipment",
    href: "/shipment",
    icon: "bi bi-box-seam ",
    permission: "shipment",
    type: "custom",
  },
  {
    title: "Marketplace",
    href: "/market",
    icon: "bi bi-shop ",
    permission: "marketplace",
    type: "custom",
  },
  {
    title: "Logout",
    href: "#",
    isLogout: 1,
    icon: "bi bi-box-arrow-right",
    type: "custom",
  },
];

const Sidebar = ({ changePassword, setChangePassword, setShowSidebar, showSidebar }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const session = useSelector((state) => state.session);
  const sessionData = useSelector((state) => state.session.sessionData);
  const rolePermissions = session?.sessionData?.permissions;
  const user = session.user;
  const { width } = useScreenSize()

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isHovered, setIsHovered] = useState(-1);

  const handleSubMenuClick = (index, navi) => {
    if (navi.isLogout) {
      handleLogout();
    } else if (navi.name === "change_password") {
      setChangePassword((prev) => !prev);
    } else {
      setOpenSubMenu(openSubMenu === index ? null : index);
    }
  };

  const checkActiveMenu = () => {
    navigation.forEach((navi, i) => {
      if (location.pathname.indexOf(navi.href) !== -1) {
        setOpenSubMenu(i);
        return;
      }
      if (navi.submenu) {
        navi.submenu.forEach((subnavi) => {
          if (location.pathname.indexOf(subnavi.href) !== -1) {
            setOpenSubMenu(i);
          }
        });
      }
    });
  };

  useEffect(() => {
    checkActiveMenu();
  }, []);

  const handleMenuClick = (path, event) => {
    if (location.pathname === path) {
      event.preventDefault();
      window.location.reload();
    }
  };

  const handleLogout = async () => {
    if (sessionData === "loggedout") return;

    const res = await postDataFromApi(LogOutApi, {
      refresh_token: user?.refresh_token,
    });

    if (res?.data?.status === 200) {
      toast.success("You have successfully Logged Out");
      dispatch(logout());
      removeToken();
      localStorage.clear();
      dispatch(clearSessionAsync());
      setTimeout(() => {
        localStorage.setItem("user-logged-out", Date.now().toString());
        navigate("/login");
      }, 250);
    } else {
      toast.error(res?.message || "Logout failed");
    }
  };


  return (
    <span>
      <Nav vertical className="sidebarNav">
        {/* <NavbarBrand className="tcrcLogo">
          <img
            src={getLogoCondition(
              user?.logged_in_user_info?.lab_or_branch?.company_code
            )}
            width="181"
            height="48"
            className="responsive"
            alt="logo"
          />
        </NavbarBrand> */}

        {navigation.map(
          (navi, index) =>
            isModuelePermission(
              rolePermissions,
              navi.permission,
              "view",
              navi.isMainPrmission,
              navi.type
            ) && (
              <NavItem key={index} className="sidenav-bg ">
                <Link
                  className={`nav-link py-3 ${openSubMenu === index ||
                    location.pathname.indexOf(navi.href) !== -1
                    ? "active"
                    : ""
                    } ${!navi.submenu ? "mainMenu" : ""}`}
                  to={navi.submenu ? null : navi.href}
                  onClick={() => {
                    handleSubMenuClick(index, navi);
                    if (width <= 1024) {
                      console.log("1024")
                      setShowSidebar(false)
                    }
                  }}
                  title={navi.title}
                >
                  <i className={`${navi.icon} sidebar_icon SidebarMainItemIcon`} />
                  <span className="ms-3 d-inline-block SidebarMainItemText">
                    {navi.title}
                  </span>

                  {navi.submenu && (
                    <i
                      className={
                        openSubMenu === index
                          ? "bi bi-caret-down-fill ms-auto subMenuIcon"
                          : "bi bi-caret-right-fill ms-auto subMenuIcon"
                      }
                    />
                  )}
                </Link>

                {navi.submenu && (
                  <Collapse isOpen={openSubMenu === index} className="sidebav-container">
                    <Nav className="flex-column sub_menu">
                      {navi.submenu.map(
                        (subItem, subIndex) =>
                          isModuelePermission(
                            rolePermissions,
                            subItem.permission,
                            "view"
                          ) && (
                            <NavItem key={subIndex} className="sidenav-bg">
                              <Link
                                to={subItem.href}
                                onClick={(e) =>
                                  handleMenuClick(subItem.href, e)
                                }
                                className={
                                  location.pathname.indexOf(subItem.href) !== -1
                                    ? "nav-link active sidebarItem"
                                    : "nav-link sidebarItem"
                                }
                                onMouseEnter={() => setIsHovered(subIndex)}
                                onMouseLeave={() => setIsHovered(-1)}
                                title={subItem.title}
                              >
                                {subItem.image ? (
                                  <img
                                    src={
                                      location.pathname.indexOf(subItem.href) !==
                                        -1 || isHovered === subIndex
                                        ? subItem.hoverImage
                                        : subItem.image
                                    }
                                    className="sub_menu_icon sidebar_icon"
                                    alt="Sidebar Icon"
                                  />
                                ) : (
                                  <i
                                    className={`${subItem.icon} sub_menu_icon sidebar_icon`}
                                  />
                                )}
                                <span className="ms-3 d-inline-block">
                                  {subItem.title}
                                </span>
                              </Link>
                            </NavItem>
                          )
                      )}
                    </Nav>
                  </Collapse>
                )}
              </NavItem>
            )
        )}
      </Nav>
    </span>
  );
};

export default Sidebar;
