import React from "react"
import PropTypes from "prop-types"
import { Route, Navigate } from "react-router-dom"

const Authmiddleware = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      console.log(isAuthProtected, "test ...")
      console.log(localStorage.getItem("authUser"))
      if (isAuthProtected && !localStorage.getItem("authUser")) {
        return (
          <Navigate
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }

      return (
        <Layout>
          <Component {...props} />
        </Layout>
      )
    }}
  />
)

Authmiddleware.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
}

export default Authmiddleware;
