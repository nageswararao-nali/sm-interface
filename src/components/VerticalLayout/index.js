import PropTypes from 'prop-types'
import React, { Component } from "react"
import { connect } from "react-redux"
import {
  changeLayout,
  changeSidebarTheme,
  changeSidebarThemeImage,
  changeSidebarType,
  changeTopbarTheme,
  changeLayoutWidth,
} from "../../store/actions"

import Sidebar from "./Sidebar"
import Footer from "./Footer"
import RightSidebar from "../CommonForBoth/RightSidebar"
import Logo from "../../images/light_- horizontal.png"

class Layout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
      sidebarOpen: false,
    }
    this.toggleSidebar = this.toggleSidebar.bind(this)
  }

  toggleSidebar() {
    this.setState(s => ({ sidebarOpen: !s.sidebarOpen }))
  }

  componentDidMount() {
    if (this.props.isPreloader === true) {
      document.getElementById("preloader").style.display = "block"
      document.getElementById("status").style.display = "block"
      setTimeout(() => {
        document.getElementById("preloader").style.display = "none"
        document.getElementById("status").style.display = "none"
      }, 2500)
    } else {
      document.getElementById("preloader").style.display = "none"
      document.getElementById("status").style.display = "none"
    }
    window.scrollTo(0, 0)
    if (this.props.leftSideBarTheme) this.props.changeSidebarTheme(this.props.leftSideBarTheme)
    if (this.props.leftSideBarThemeImage) this.props.changeSidebarThemeImage(this.props.leftSideBarThemeImage)
    if (this.props.layoutWidth) this.props.changeLayoutWidth(this.props.layoutWidth)
    if (this.props.leftSideBarType) this.props.changeSidebarType(this.props.leftSideBarType)
    if (this.props.topbarTheme) this.props.changeTopbarTheme(this.props.topbarTheme)
  }

  render() {
    const { sidebarOpen } = this.state
    return (
      <React.Fragment>
        <div id="preloader">
          <div id="status">
            <div className="spinner-chase">
              <div className="chase-dot" /><div className="chase-dot" />
              <div className="chase-dot" /><div className="chase-dot" />
              <div className="chase-dot" /><div className="chase-dot" />
            </div>
          </div>
        </div>

        <div id="layout-wrapper">
          <Sidebar
            theme={this.props.leftSideBarTheme}
            type={this.props.leftSideBarType}
            isMobile={this.state.isMobile}
            sidebarOpen={sidebarOpen}
            onClose={this.toggleSidebar}
          />

          {/* Dim overlay — tapping closes sidebar on mobile */}
          {sidebarOpen && (
            <div className="sidebar-overlay" onClick={this.toggleSidebar} />
          )}

          <div className="main-content">
            {/* Mobile top bar */}
            <div
              className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-50 md:hidden"
              style={{ marginLeft: "-12px", marginRight: "-12px", marginBottom: "12px" }}
            >
              <button
                onClick={this.toggleSidebar}
                style={{ background: "transparent", width: "auto", border: "none", padding: "6px", cursor: "pointer" }}
                className="rounded-xl hover:bg-gray-100 transition-colors"
                aria-label="Open menu"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect y="3"  width="20" height="2" rx="1" fill="#374151"/>
                  <rect y="9"  width="20" height="2" rx="1" fill="#374151"/>
                  <rect y="15" width="20" height="2" rx="1" fill="#374151"/>
                </svg>
              </button>
              <img src={Logo} alt="GoodMove" style={{ height: "30px", objectFit: "contain" }} />
              <div style={{ width: "32px" }} />
            </div>

            {this.props.children}
          </div>
        </div>

        {this.props.showRightSidebar ? <RightSidebar /> : null}
      </React.Fragment>
    )
  }
}

Layout.propTypes = {
  changeLayoutWidth: PropTypes.func,
  changeSidebarTheme: PropTypes.func,
  changeSidebarThemeImage: PropTypes.func,
  changeSidebarType: PropTypes.func,
  changeTopbarTheme: PropTypes.func,
  children: PropTypes.object,
  isPreloader: PropTypes.any,
  layoutWidth: PropTypes.any,
  leftSideBarTheme: PropTypes.any,
  leftSideBarThemeImage: PropTypes.any,
  leftSideBarType: PropTypes.any,
  location: PropTypes.object,
  showRightSidebar: PropTypes.any,
  topbarTheme: PropTypes.any,
}

const mapStatetoProps = state => ({ ...state.Layout })

export default connect(mapStatetoProps, {
  changeLayout,
  changeSidebarTheme,
  changeSidebarThemeImage,
  changeSidebarType,
  changeTopbarTheme,
  changeLayoutWidth,
})(Layout)
