import { Collapse, Nav, NavItem } from "reactstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NavbarBrand } from "react-bootstrap";
import { useEffect, useState } from "react";
import { getLogoCondition, isModuelePermission } from "../services/commonFunction";
import { useDispatch, useSelector } from "react-redux";
import Operations from "../assets/images/icons/Operations.svg";

//Sub Icon Images
import jiIcon from "../assets/images/icons/jiIcon.svg";
import ccIcon from "../assets/images/icons/ccIcon.svg";
import jrfIcon from "../assets/images/icons/jrfIcon.svg";
import sampleInwardIcon from "../assets/images/icons/sampleInwardIcon.svg";
import testmemoIcon from "../assets/images/icons/testmemoIcon.svg";
import allotmentIcon from "../assets/images/icons/allotmentIcon.svg";
import sampleVerificationIcon from "../assets/images/icons/sampleVerificationIcon.svg";
import sfmIcon from "../assets/images/icons/sfmIcon.svg";
import testReportIcon from "../assets/images/icons/testReportIcon.svg";
import otherTpiIcon from "../assets/images/icons/otherTpiIcon.svg";



//Sub Icon Hovered or Active Image
import jiIconHover from "../assets/images/icons/jiIconHover.svg";
import plantIconHover from "../assets/images/icons/plantIconHover.svg";
import ccIconHover from "../assets/images/icons/ccIconHover.svg";

import jrfIconHover from "../assets/images/icons/jrfIconHover.svg";
import sampleInwardIconHover from "../assets/images/icons/sampleInwardIconHover.svg";
import testmemoIconHover from "../assets/images/icons/testmemoIconHover.svg";
import allotmentIconHover from "../assets/images/icons/allotmentIconHover.svg";
import sampleVerificationIconHover from "../assets/images/icons/sampleVerificationIconHover.svg";
import sfmIconHover from "../assets/images/icons/sfmIconHover.svg";
import testReportIconHover from "../assets/images/icons/testReportIconHover.svg";
import otherTpiIconHover from "../assets/images/icons/otherTpiIconHover.svg";
// import ChangePasswordModal from "./forgotPasswordScreens/changePasswordModal";

// Srushti 
import AuditIcon from "../assets/images/icons/AuditIcon.png";
import OutstandingIcon from "../assets/images/icons/Outstanding.png";
import OutstandingHover from "../assets/images/icons/OutstandingHover.png";
import BranchExpense from "../assets/images/icons/BranchExpense.png";
import BranchExpenseHover from "../assets/images/icons/BranchExpenseHover.png";
import SalesRegister from "../assets/images/icons/Invoicing.png";
import SalesRegisterHover from "../assets/images/icons/InvoiceHover.png"
import jobCostingIcon from "../assets/images/icons/jobCostingIcon.png";
import jobCostingHoverIcon from "../assets/images/icons/jobCostingHoverIcon.png";
import PurchaseListHover from "../assets/images/icons/PurchaseListHover.png";
import PurchaseList from "../assets/images/icons/PurchaseList.png";
import SupplierListHover from "../assets/images/icons/SupplierListHover.png";
import SupplierList from "../assets/images/icons/SupplierList.png";
import PurchaseHover from "../assets/images/icons/PurchaseHover.png";
import Purchase from "../assets/images/icons/Purchase.png";
import CalibrationHover from "../assets/images/icons/CalibrationHover.png";
import Calibration from "../assets/images/icons/Calibration.png";
import Tender from "../assets/images/icons/Tender.png";
import TenderHoverIcon from "../assets/images/icons/TenderHoverIcon.png";
import TenderIcon from "../assets/images/icons/TenderIcon.png";
import FeedbackHoverIcon from "../assets/images/icons/FeedbackHover.png";
import FeedbackIcon from "../assets/images/icons/Feedback.png";
import IncentiveHoverIcon from "../assets/images/icons/incentiveHover.png";
import IncentiveIcon from "../assets/images/icons/incentive.png";
import CategoryIcon from "../assets/images/icons/categoryIcon.png"
import CategoryHoverIcon from "../assets/images/icons/categoryHoverIcon.png"
// ----------------------------------------------------------------

import { toast } from "react-toastify";
import { postDataFromApi } from "../services/commonServices";
import { LogOutApi } from "../services/api";
import { clearSessionAsync, logout } from "../reducers/sessionActions";
import { removeToken } from "../services/localStorageServices";
import Feedback from "react-bootstrap/esm/Feedback";
export const selectUser = (state) => state.rolePermissions;

const navigation = [
  {
    title: "Dashboard",
    href: "/dashboard-listing",
    icon: "bi bi-house-door-fill ",
    permission: "dashboard",
    type: "custom",
  },
  {
    title: "LMS Dash.",
    href: "/lms-dashboard-listing",
    icon: "bi bi-journal-bookmark-fill",
    permission: "lms dashboard",
    type: "custom",
  },
  {
    title: "Dashboard",
    href: "/collection-dashboard",
    icon: "bi bi-journal-bookmark-fill",
    permission: "collection dashboard",
    type: "custom",
  },
  {
    title: "Daily Stat",
    href: "/statistics",
    icon: "bi bi-bar-chart-fill ",
    permission: "statistics",
    type: "custom",
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: "bi bi-bar-chart",
    type: "custom",
    permission: "analytics",
    isMainPrmission: 1,
    submenu: [
      {
        title: "LMS Analytics",
        href: "/analytics/laboratory",
        icon: "bi bi-graph-up",
        type: "custom",
        subModuleType: "lms_analytics",
        permission: "analytics",

      },
      {
        title: "Operation Analytics",
        href: "/analytics/ops-analytics",
        icon: "bi bi-gear",
        type: "custom",
        subModuleType: "ops_analytics",
        permission: "analytics",
      },
      {
        title: "Other Analytics",
        href: "/analytics/other-analytics",
        icon: "bi bi-question-circle",
        type: "custom",
        subModuleType: "other_analytics",
        permission: "analytics",

      },
      {
        title: "Credit Control",
        href: "/analytics/credit-control",
        icon: "bi bi-cash-coin",
        type: "custom",
        subModuleType: "credit_analytics",
        permission: "analytics",
      },
      {
        title: "Overall Analytics",
        href: "/analytics/overall-analytics",
        icon: "bi bi-graph-up-arrow",
        type: "custom",
        subModuleType: "overall_analytics",
        permission: "analytics"
      },
    ],
  },
  // {
  //   title: "Master Data",
  //   href: "/users",
  //   icon: "bi bi-bar-chart",
  //   type: "custom",
  //   permission: "analytics",
  //   isMainPrmission: 1,
  //   submenu: [
  //     {
  //       title: "Users",
  //       href: "/users/list",
  //       icon: "bi bi-graph-up",
  //       type: "custom",
  //       permission: "analytics",

  //     }
  //   ],
  // },
  {
    title: "Operations",
    href: "/operation",
    icon: "bi bi-gear ",
    // image: Operations,
    permission: "operations",
    isMainPrmission: 1,
    submenu: [
      {
        title: "Job Instructions",
        href: "/operation/jrfInstructionListing",
        icon: "bi bi-clipboard-check ",
        image: jiIcon,
        hoverImage: jiIconHover,
        permission: "jobinstruction",
        // permission: "commercialcertificate",
      },
      {
        title: "Draught Survey",
        href: "/operation/other-list",
        icon: "bi bi-info-circle",
        hoverImage: plantIconHover,
        permission: "jioperationjsonb",
      },
      {
        title: "Certificates",
        href: "/operation/commercial-certificate-list",
        icon: "bi bi-clipboard-check ",
        image: ccIcon,
        hoverImage: ccIconHover,
        permission: "commercialcertificate",
      },
      {
        title: "Invoice",
        href: "/operation/invoice-listing",
        icon: "bi bi-receipt",
        permission: "invoice",
        name: "invoice_operation"
      }
    ],
  },
  {
    title: "Audit",
    href: "/audit",
    icon: "bi bi-building ",
    image: AuditIcon,
    permission: "audit",
    isMainPrmission: 1,
    submenu: [
      // Srushti
      {
        title: "Job Costing",
        href: "/audit/job-costing-list",
        icon: "bi bi-clipboard-check",
        image: jobCostingIcon,
        hoverImage: jobCostingHoverIcon,
        permission: "jobcosting",
      },
      {
        title: "Sales Register",
        href: "/audit/sales-register-list",
        icon: "bi bi-clipboard-check ",
        image: SalesRegister,
        hoverImage: SalesRegisterHover,
        permission: "saleregister",
      },
      {
        title: "Outstanding",
        href: "/audit/outstanding-list",
        icon: "bi bi-clipboard-check ",
        image: OutstandingIcon,
        hoverImage: OutstandingHover,
        permission: "outstanding",
      },
      {
        title: "Branch Expenses",
        href: "/audit/branch-expense-list",
        icon: "bi bi-clipboard-check ",
        image: BranchExpense,
        hoverImage: BranchExpenseHover,
        permission: "expense",
      },
      // ----------------------------------------------------------------
    ]
  },
  // {
  //   title: "Dashboard",

  //   icon: "bi bi-house-door-fill ",
  //   permission: "dashboard",
  // },

  {
    title: "LMS",
    href: "/jrfListing",
    icon: "bi bi-building ",
    permission: "LMS",
    isMainPrmission: 1,
    submenu: [
      {
        title: "Job Request Form",
        href: "/jrfListing",
        icon: "bi bi-clipboard-check ",
        image: jrfIcon,
        hoverImage: jrfIconHover,
        permission: "jrf",
      },
      {
        title: "Sample Inward",
        href: "/inwardList",
        icon: "bi bi-box-seam",
        image: sampleInwardIcon,
        hoverImage: sampleInwardIconHover,
        permission: "sampleinward",
      },
      {
        title: "Test Memo",
        href: "/testmemoList",
        icon: "bi bi-file-earmark-text",
        image: testmemoIcon,
        hoverImage: testmemoIconHover,
        permission: "testmemomain",
      },
      {
        title: "Allotment",
        href: "/allotmentList",
        icon: "bi bi-clipboard-check ",
        image: allotmentIcon,
        hoverImage: allotmentIconHover,
        permission: "allotment",
      },
      {
        title: "Sample Verification ",
        href: "/verificationList",
        icon: "bi bi-patch-check",
        image: sampleVerificationIcon,
        hoverImage: sampleVerificationIconHover,
        permission: "sampleverification",
      },
      {
        title: "SFM",
        href: "/SFMList",
        icon: "bi bi-envelope-check-fill",
        image: sfmIcon,
        hoverImage: sfmIconHover,
        permission: "sfm",
      },
      {
        title: "Test Report",
        href: "/testReport",
        icon: "bi bi-list-check",
        image: testReportIcon,
        hoverImage: testReportIconHover,
        permission: "internalcertificate",
      },
      {
        title: "Invoice",
        href: "/operation/invoice-listing",
        icon: "bi bi-receipt",
        permission: "invoice",
        name: "invoice_testreport"
      },
      {
        title: "External Results",
        href: "/operation/other-tpi",
        icon: "bi bi-list-check",
        image: otherTpiIcon,
        hoverImage: otherTpiIconHover,
        permission: "jioperationjsonb",
      },
    ],
  },
  // Srushti
  {
    title: "Purchase",
    href: "/purchase",
    icon: "bi bi-currency-exchange",
    permission: "purchase",
    isMainPrmission: 1,
    submenu: [
      {
        title: "Purchase Requistion",
        href: "/PurchRequistion",
        icon: "bi bi-clipboard-check",
        image: PurchaseList,
        hoverImage: PurchaseListHover,
        permission: "purchaserequisition"
      },
      {
        title: "Purchase Order",
        href: "/purchase",
        icon: "bi bi-file-earmark-text",
        image: Purchase,
        hoverImage: PurchaseHover,
        permission: "purchaseorder"
      },
      {
        title: "Supplier ",
        href: "/supplierList",
        icon: "bi bi-box-seam",
        image: SupplierList,
        hoverImage: SupplierListHover,
        permission: "supplier"
      },
      {
        title: "Calibration ",
        href: "/calibrationList",
        icon: "bi bi-clipboard-check ",
        image: Calibration,
        hoverImage: CalibrationHover,
        permission: "calibration"
      },
      {
        title: "Items",
        href: "/itemlist",
        icon: "bi bi-clipboard-check ",
        image: FeedbackIcon,
        hoverImage: FeedbackHoverIcon,
        permission: "itemmaster"
      },
      {
        title: "Category",
        href: "/categoriesList",
        icon: "bi bi-clipboard-check ",
        image: CategoryIcon,
        hoverImage: CategoryHoverIcon,
        permission: "category"
      }
    ],
  },
  {
    title: "Tender",
    href: "/tender",
    icon: "bi bi-cash-stack",
    permission: "tender",
    isMainPrmission: 1,
    submenu: [
      {
        title: "Tender List",
        href: "/tenderList",
        icon: "bi bi-clipboard-check",
        image: TenderIcon,
        hoverImage: TenderHoverIcon,
        permission: "tender"
      }
    ],
  },
  {
    title: "Stocks",
    href: "/chemicalStocks",
    icon: "bi bi-cash-stack",
    permission: "stocks",
    isMainPrmission: 1,
    submenu: [
      {
        title: "Chemical Stocks List",
        href: "/chemicalStocks",
        icon: "bi bi-clipboard-check",
        image: TenderIcon,
        hoverImage: TenderHoverIcon,
        permission: "stock"
      }
    ],
  },
  {
    title: "Incentives",
    href: "/incentives",
    icon: "bi bi-trophy",
    permission: "incentives",
    isMainPrmission: 1,
    submenu: [
      {
        title: "Incentives",
        href: "/incentivesList",
        icon: "bi bi-clipboard-check",
        image: IncentiveIcon,
        hoverImage: IncentiveHoverIcon,
        permission: "incentive"
      }
    ],
  },
  {
    title: "Collections",
    href: "/collections",
    icon: "bi bi-cash-stack",
    permission: "collections",
    isMainPrmission: 1,
    submenu: [
      {
        title: "Payment Details",
        href: "/collections/payment-list",
        icon: "bi bi-receipt",
        permission: "invoice",
        name: "invoice_operation"
      },
      {
        title: "Client Details",
        href: "/collections/client-list",
        icon: "bi bi-receipt",
        permission: "invoice",
        name: "invoice_operation"
      }
    ],
  },
  // {
  //   title: "Feedback",invoices
  //   href: "/feedback",
  //   icon: "bi bi-envelope-open",
  //   permission: "feedback",
  //   isMainPrmission: 1,
  //   submenu: [
  //     {
  //       title: "Feedback",
  //       href: "/feedbackList",
  //       icon: "bi bi-clipboard-check",
  //       image: FeedbackIcon,
  //       hoverImage: FeedbackHoverIcon,
  //       permission: "feedback"
  //     },
  //   ]
  // },

  // -------------------------------------------
  {
    title: "Support",
    href: "/support",
    icon: "bi bi-question-circle-fill ",
    type: "custom",
  },
  // {
  //   title: "Releases",
  //   href: "/release-notes",
  //   icon: "bi bi-rocket-takeoff-fill",
  //   type: "custom",
  // },
  {
    title: "Logout",
    href: "#",
    isLogout: 1,
    icon: "bi bi-box-arrow-right",
    type: "custom",
  }

];

const Sidebar = ({ changePassword, setChangePassword, setShowSidebar, showSidebar }) => {
  const session = useSelector((state) => state.session);
  const sessionData = useSelector((state) => state.session.sessionData);
  let user = session.user;
  const rolePermissions = session?.sessionData?.permissions;
  const dispatch = useDispatch();
  const location = useLocation();
  let navigate = useNavigate();
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isHovered, setIsHovered] = useState(-1);

  const handleSubMenuClick = (index, navi) => {
    if (navi.isLogout) {
      handleLogout()
    }
    else if (navi.name === "change_password") {
      setChangePassword((prev) => !prev)
    }
    else {
      setOpenSubMenu(openSubMenu === index ? null : index);
    }
  };
  /**
   * check for menu active
   */
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
  /**
   * Check current url and clicked menu url
   * @param {*} path 
   * @param {*} event 
   */
  const handleMenuClick = (path, event) => {
    if (location.pathname === path) {
      event.preventDefault(); // Prevent the default link behavior
      window.location.reload();
    }
  };

  /**
   * Handle Logout 
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
  /**
   * Show invoice menu for LR or BU
   * @param {*} subItem 
   * @returns 
   */
  const InvoiceConditions = (subItem) => {
    const userRole = session.user?.role;
    const restrictedItems = {
      invoice_operation: ["LR"],
      invoice_testreport: ["BU", "SU"]
    };
    return !(restrictedItems[subItem.name]?.includes(userRole));
  };
  return (
    <span>
      {/* {changePassword && (
        <ChangePasswordModal
          setChangePassword={setChangePassword}
          style={{ zIndex: 7 }}
        />
      )} */}
      <Nav vertical className="sidebarNav">
        <NavbarBrand className="tcrcLogo">
          <img
            src={getLogoCondition(user?.logged_in_user_info?.lab_or_branch?.company_code)}
            width="181"
            height="48"
            className="responsive"
            alt="logo"
          />
        </NavbarBrand>
        {/* <button
          onClick={() => setShowSidebar((prev) => !prev)}
          className="nonNativeButton2 list_icon_container"
          aria-label="Header Button"
        >
          <i
            className={
              // showSidebar ? "bi bi-arrow-left-circle-fill header_icon header_list_icon" : "bi bi-arrow-right-circle-fill header_icon header_list_icon"
              showSidebar ? "bi bi-x-lg header_icon header_list_icon" : "bi bi-list header_icon header_list_icon"

            }
          ></i>
        </button> */}
        {navigation.map(
          (navi, index) => {
            if (navi.href === "/dashboard-listing") {
              if (['SU', 'CU'].includes(user?.role)) {
                navi.title = "OPS. Dash."
              }
              else {
                navi.title = "Dashboard"
              }
            }
            return isModuelePermission(
              rolePermissions,
              navi.permission,
              "view",
              navi.isMainPrmission,
              navi.type
            ) && (
                <NavItem key={"Sub-Index" + index} className="sidenav-bg">
                  <Link
                    className={`nav-link py-3 ${openSubMenu === index || location.pathname.indexOf(navi.href) !== -1 ? "active" : ""
                      } ${!navi.submenu ? "mainMenu" : ''}`}
                    to={navi.submenu ? null : navi.href}
                    onClick={() =>
                      handleSubMenuClick(index, navi)
                    }
                    title={navi.title}
                  >
                    {navi.image ? (
                      <img
                        src={navi.image}
                        className={" sidebar_icon"}
                        alt="Sidebar Icon"
                      />
                    ) : (
                      <i
                        className={
                          navi.icon + " sidebar_icon SidebarMainItemIcon"
                        }
                      ></i>
                    )}

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
                      ></i>
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
                              "view",
                              "",
                              navi.type,
                              user,
                              subItem

                            ) && InvoiceConditions(subItem)
                            && (
                              <NavItem
                                key={"SubItem - Index" + subIndex}
                                className="sidenav-bg"
                              >
                                <Link
                                  to={subItem.href}
                                  onClick={(event) =>
                                    handleMenuClick(subItem.href, event)
                                  }
                                  className={
                                    location.pathname.indexOf(subItem.href) !== -1
                                      ? " nav-link  active sidebarItem"
                                      : "nav-link  sidebarItem"
                                  }
                                  onMouseEnter={() => setIsHovered(subIndex)}
                                  onMouseLeave={() => setIsHovered(-1)}
                                  title={subItem.title}
                                >
                                  {subItem.image ? (
                                    <img
                                      src={(location.pathname.indexOf(subItem.href) !== -1 || isHovered === subIndex) ? subItem.hoverImage : subItem.image} // Show hover image if hovered
                                      className="sub_menu_icon sidebar_icon"
                                      alt="Sidebar Icon"
                                    />
                                  ) : (
                                    <i
                                      className={
                                        subItem.icon +
                                        "  sub_menu_icon" +
                                        " sidebar_icon"
                                      }
                                    ></i>
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
          }
        )}
      </Nav>
    </span>
  );
};

export default Sidebar;
