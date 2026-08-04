import { combineReducers } from "redux"

// Front
import Layout from "./layout/reducer"

// Authentication
import Login from "./auth/login/reducer"
import Account from "./auth/register/reducer"
import ForgetPassword from "./auth/forgetpwd/reducer"
import Profile from "./auth/profile/reducer"


//Calendar
import calendar from "./calendar/reducer"

//chat
import chat from "./chat/reducer"




//contacts
import contacts from "./contacts/reducer"

//dashboard
import dashboard from "./dashboard/reducer"

import initial from "./initial/reducer"
import bookingsReducer from "./bookings/reducer"


const rootReducer = combineReducers({
  // public
  Layout,
  Login,
  Account,
  ForgetPassword,
  Profile,
  calendar,
  chat,
  contacts,
  dashboard,
  initial,
  bookingsReducer
})


export default rootReducer
