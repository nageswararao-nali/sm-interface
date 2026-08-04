import PropTypes from 'prop-types'
import React, {useEffect} from "react";
import Otpverify from './pages/Authentication/Otpverify';

import Dashboard from './pages/Dashboard/Dashboard';
import Charts from './pages/charts/Charts';
import Tourss from './pages/Dashboard/Tourss';
// import Bookings from './pages/Bookings/Bookings';
import Bookings from './pages/Dashboard/Bookings';
import TrackOrder from './pages/Dashboard/TrackOrder';
import ClosedBookings from './pages/Dashboard/ClosedBookings';
import Trips from './pages/Dashboard/Trips';
import Tours from './pages/Dashboard/Tours';
import ToursCopy from "./pages/Dashboard/ToursCopy"
// Accounts Tap Menus .......
import Accounts from './pages/Accounts/Accounts';
import Drivers from './pages/Accounts/Drivers';
import Vehicles from "./pages/Accounts/Vehicles";
import Owners from "./pages/Accounts/Owners";
import Customers from "./pages/Accounts/Customers";
import Companies from "./pages/Accounts/Companies";
import CompanySettings from "./pages/Accounts/CompanySettings";
import  TrucksRate from "./pages/Accounts/TrucksRate";
import {Shops} from "./pages/Accounts/Shops";

// Admin pages .....
import Admin from './pages/Admin/Admin';
import AddAddress from './pages/Admin/AddAddress';
import EditAddress from './pages/Admin/EditAddress';
import AddBookings from './pages/Admin/AddBookings';
import Invoice from './pages/Admin/Invoice';
import DriverPayments from './pages/Admin/DriverPayments';
import BaseLocation from './pages/Admin/BaseLocation';
import PortalSettings from './pages/Admin/PortalSettings';

import LiveLocation from './pages/LiveLocation/LiveLocation';
import SessionInfo from './pages/sessionInfo/SessionInfo';
import Summary from './pages/summary/Summary';
import DailySummary from './pages/summary/DailySummary';
import Transaction from './pages/summary/Transaction';


// Import Driver History ....
import History from "./pages/History/History";
import HistoryTable from "./pages/History/HistoryTable";
import TrackMap from './pages/History/TrackMap';
import Analysis from "./pages/History/Analysis"
import DriverTrackMap from './pages/DrivertrackMap/DriverTrackMap';
// Notifiacation ..
import Notification from './pages/notification/Notification';
// INVOICE SLIP...
import InvoiceSlip from "./pages/invoice/Invoice"
import BookingInvoice from "./pages/invoice/BookingInvoice"
import GeneratedInvoice from "./pages/invoice/GeneratedInvoice"
 

import { Routes, BrowserRouter as Router, Route, Navigate,Redirect,Switch } from "react-router-dom"
import { connect } from "react-redux"

// Import Routes all
import { userRoutes, authRoutes } from "./routes/allRoutes"

// Import all middleware
import Authmiddleware from "./routes/middleware/Authmiddleware"

// layouts Format
import VerticalLayout from "./components/VerticalLayout/"
import HorizontalLayout from "./components/HorizontalLayout/"
import Layout from "./components/Layout"
import NonAuthLayout from "./components/NonAuthLayout"
import Login from './pages/Authentication/Login'

import "./assets/scss/theme.scss";
import "./assets/scss/custom.scss";
import Home from './pages/Admin/HomePage';




const App = props => {

  function getLayout() {
    let layoutCls = VerticalLayout
    switch (props.layout.layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout
        break
      default:
        layoutCls = VerticalLayout
        break
    }
    return layoutCls
  }

  // const Layout = getLayout()
  return (
    <React.Fragment>  
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path='/otp/:mobileno' element={<Otpverify/>}/>
            {/* <Route path='/dashboard' element={<Dashboard/>}/> */}
            <Route path='/dashboard/charts' element={<Charts/>}/>
            <Route path="/dashboard/tours" element={<Tourss/>}>
              <Route index element={<Navigate to="bookings" replace/>}/>
              <Route path="bookings" element={<Bookings/>}/>
              <Route path="bookings/:id" element={<TrackOrder/>}/>
              <Route path="trips" element={<Trips/>}/>
              <Route path="tours" element={<Tours/>}/>
              <Route path="closedBookings" element={<ClosedBookings/>}/>
            </Route>
            <Route path="/dashboard/accounts" element={<Accounts/>}>
              <Route index element={<Navigate to="drivers" replace/>} />
              <Route path="drivers" element={<Drivers/>}/>
              <Route path="vehicles" element={<Vehicles/>}/>
              <Route path="owners" element={<Owners/>}/>
              <Route path="customers" element={<Customers/>}/>
              <Route path="companies" element={<Companies/>}/>
              <Route path="companySettings" element={<CompanySettings/>}/>
              <Route path="trucksRate" element={<TrucksRate/>}/>
              <Route path="shops" element={<Shops/>}/>
            </Route>
            <Route path="/dashboard/admin" element={<Admin/>}>
                <Route index element={<Navigate to="addBooking" replace/>}/>
                <Route path='addAddress' element={<AddAddress/>}/>
                <Route path="editAddress" element={<EditAddress/>}/>
                <Route path="addBooking" element={<AddBookings/>}/>
                {/* <Route path="addBooking" element={<AddBookings/>}/>
                <Route path="addBooking" element={<AddBookings/>}/> */}
                <Route path="invoiceGeneration" element={<Invoice/>}/>
                <Route path="driverPayments" element={<DriverPayments/>}/>
                <Route path="baseLocation" element={<BaseLocation/>}/>
                <Route path="portalSettings" element={<PortalSettings/>}/>
            </Route>
            <Route path="/dashboard/liveLocation" element ={<LiveLocation/>}/>
            <Route path="/dashboard/liveLocation/drivertrackMap/:id" element ={<DriverTrackMap/>}/>
            <Route path='/dashboard/sessionInfo' element={<SessionInfo/>}/>
             <Route path="/dashboard/summary" element={<Summary/>}>
                  <Route index element={<Navigate to="dailysummary" replace/>}/>
                 <Route path="dailysummary" element={<DailySummary/>}/> 
                 <Route path="transaction" element={<Transaction/>}/> 
             </Route>       
            <Route path='/dashboard/history' element={<History/>}>
              <Route index element={<Navigate to="historyTable" replace/>} />
              <Route path='historyTable' element={<HistoryTable/>}/>
              <Route path='trackHistoryMap' element={<TrackMap/>}/>
              <Route path='analysis' element={<Analysis/>}/>
            </Route>
            <Route path='/dashboard/notification' element={<Notification/>}/>
            <Route path='/dashboard/home' element={<Home/>}/>
            <Route path='/dashboard/invoice' element={<InvoiceSlip/>}>
              <Route index element={<Navigate to="bookings" replace/>} />
              <Route path='bookings' element={<BookingInvoice/>}/>
              <Route path='invoices' element={<GeneratedInvoice/>}/>
              <Route/>
            </Route>
        </Routes>
    </React.Fragment>
  )
}

App.propTypes = {
  layout: PropTypes.any
}

const mapStateToProps = state => {
  return {
    layout: state.Layout,
  }
}

export default connect(mapStateToProps, null)(App)
