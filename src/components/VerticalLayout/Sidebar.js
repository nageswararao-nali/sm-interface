import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import Logo from "../../images/light_- horizontal.png";
import SidebarContent from "./SidebarContent";

const Sidebar = (props) => {
  return (
    <div className={`vertical-menu flex flex-col bg-white border-r border-gray-100 h-screen${props.sidebarOpen ? " sidebar-open" : ""}`}>
      {/* Brand */}
      <div className="flex items-center justify-center px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <img src={Logo} alt="GoodMove" style={{ height: "42px", objectFit: "contain" }} />
      </div>

      {/* Nav */}
      <div data-simplebar className="flex-1 overflow-hidden">
        <SidebarContent onClose={props.onClose} />
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  type: PropTypes.string,
  sidebarOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

const mapStatetoProps = (state) => ({
  layout: state.Layout,
});

export default connect(mapStatetoProps, {})(withTranslation()(Sidebar));
