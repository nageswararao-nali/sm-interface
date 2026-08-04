import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import SimpleBar from "simplebar-react";
import { withTranslation } from "react-i18next";

import { FaTruckArrowRight } from "react-icons/fa6";
import { PiUsersFill } from "react-icons/pi";
import { BiCurrentLocation } from "react-icons/bi";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { RiAdminFill } from "react-icons/ri";
import { MdOutlineHistory, MdDashboard, MdSummarize, MdNotifications } from "react-icons/md";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";

import { logoutUserSuccess } from "../../store/actions";

const NAV_ITEMS = [
  { to: "/dashboard/tours",        icon: FaTruckArrowRight,         label: "Tours",           sub: "Manage trips and tours" },
  { to: "/dashboard/accounts",     icon: PiUsersFill,               label: "Accounts",        sub: "Owners, drivers & vehicles" },
  { to: "/dashboard/liveLocation", icon: BiCurrentLocation,         label: "Live Locations",  sub: "View live driver locations" },
  { to: "/dashboard/sessionInfo",  icon: IoChatboxEllipsesOutline,  label: "Session Info",    sub: "View session info" },
  { to: "/dashboard/summary",      icon: MdSummarize,               label: "Summary",         sub: "Summary details" },
  { to: "/dashboard/admin",        icon: RiAdminFill,               label: "Admin",           sub: "Admin workspace" },
  { to: "/dashboard/history",      icon: MdOutlineHistory,          label: "Driver History",  sub: "Location history" },
  { to: "/dashboard/invoice",      icon: FaFileInvoiceDollar,       label: "Invoice",         sub: "Customer invoices" },
  { to: "/dashboard/charts",       icon: MdDashboard,               label: "Dashboard",       sub: "Analytics overview" },
  { to: "/dashboard/notification", icon: MdNotifications,           label: "Notifications",   sub: "View notifications" },
];

const SidebarContent = (props) => {
  const ref = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    ref.current.recalculate();
  });

  useEffect(() => {
    const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
    if (isLoggedIn !== true) navigate("/");
  }, []);

  const handleLogout = () => {
    if (props.onClose) props.onClose();
    props.logoutUserSuccess();
    localStorage.setItem("isLoggedIn", JSON.stringify(false));
    navigate("/");
  };

  return (
    <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
      <nav className="sidebar-nav flex flex-col h-full px-3 py-4">
        <ul className="flex-1 space-y-1 list-none p-0 m-0">
          {NAV_ITEMS.map(({ to, icon: Icon, label, sub }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={props.onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                    isActive
                      ? "bg-brand-500 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`flex-shrink-0 ${isActive ? "text-white" : "text-gray-400 group-hover:text-brand-500"}`}>
                      <Icon size={18} />
                    </span>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold leading-tight truncate ${isActive ? "text-white" : "text-gray-800"}`}>
                        {label}
                      </p>
                      <p className={`text-xs leading-tight truncate mt-0.5 ${isActive ? "text-brand-100" : "text-gray-400"}`}>
                        {sub}
                      </p>
                    </div>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="px-3 mb-3">
            <p className="text-xs text-gray-400">Logged in as</p>
            <p className="text-sm font-semibold text-gray-700 truncate">Manager</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors duration-150"
          >
            <AiOutlineLogout size={16} />
            Logout
          </button>
        </div>
      </nav>
    </SimpleBar>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
  logoutUserSuccess: PropTypes.func,
  onClose: PropTypes.func,
};

const mapStateToProps = (state) => {
  const { error, isUserFound, message } = state.Login;
  return { error, isUserFound, message };
};

export default connect(mapStateToProps, { logoutUserSuccess })(SidebarContent);
