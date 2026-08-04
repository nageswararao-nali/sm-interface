import React, { useState, useEffect } from "react";
import { BiSolidMap, BiEditAlt, BiChevronDown } from "react-icons/bi";
import { Search } from "react-bootstrap-icons";
import { FaArrowRight } from "react-icons/fa6";
import axios from "axios";
import { Modal, ModalHeader, ModalBody, NavLink } from "reactstrap";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import moment from "moment";
import SearchableDropdown from "../../searchableDropdown";
import ReactSelect from "../../ReactSelect";
import Select from "react-select";
import { CSVLink } from "react-csv";
import { baseUrl } from "../../api/apiConfig";
import { RiDeleteBin5Line } from "react-icons/ri";
import ClosedBookingsEditModal from "../../components/editModals/ClosedBookingsEditModal";
import FareEditModal from "../../FareEditModal";
import WaitingChargeEditModal from "../../WaitingChargeEditModal";
import TimeEditModal from "../../TimeEditModal";
import VegamEditModal from "../../VegamEditModal";
import Pagination from "../../Pagination";
import "../../styles/Tours/bookingModal.css";
import "../../styles/closedBooking/closedBooking.css";

const data = [
  { value: "Divya-9962062282", label: "Divya-9962062282" },
  { value: "Prakash-9789460828", label: "Prakash-9789460828" },
  { value: "Suby-9605432304", label: "Suby-9605432304" },
];
const data1 = [
  { value: "Divya-null-9962062282", label: "Divya-null-9962062282" },
  { value: "Prakash-Test-9789460828", label: "Prakash-Test-9789460828" },
  { value: "Suby-IIT Madras-9605432304", label: "Suby-IIT Madras-9605432304" },
];

const ClosedBookings = () => {
  const [closedBookData, setClosedBookData] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerId, setCustomerId] = useState(0);
  const [driverList, setDriverList] = useState("");
  const [driverName, setDriverName] = useState("");
  const [params, setParams] = useState({
    id: localStorage.getItem("closedBooking_Id") ? localStorage.getItem("closedBooking_Id") : "",
    customer_id: localStorage.getItem("Closed_booking_cusId") ? localStorage.getItem("Closed_booking_cusId") : "",
    driver_name: localStorage.getItem("Closed_booking_driverId") ? localStorage.getItem("Closed_booking_driverId") : "",
    pickup_time: localStorage.getItem("Closed_booking_PickupTime") ? localStorage.getItem("Closed_booking_PickupTime") : "",
    reached_pickup: localStorage.getItem("Closed_booking_ReachedTime") ? localStorage.getItem("Closed_booking_ReachedTime") : "",
    created_at: localStorage.getItem("Closed_booking_CreatedAt") ? localStorage.getItem("Closed_booking_CreatedAt") : "",
    status: localStorage.getItem("Closed_booking_Status") ? localStorage.getItem("Closed_booking_Status") : "",
    booking_status: localStorage.getItem("Closed_booking_TourStatus") ? localStorage.getItem("Closed_booking_TourStatus") : "",
    booking_type: localStorage.getItem("closed_booking_type") ? localStorage.getItem("closed_booking_type") : "",
    customer_name: "",
    offset: 0,
    limit: 10,
    from_manager_app: true,
  });
  const [pickupTime, setPickupTime] = useState("");
  const [createdTime, setCreatedTime] = useState("");
  const [reachedPickupTime, setReachedPickupTime] = useState("");
  const [status, setStatus] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [home_delv, setHome_delv] = useState(false);
  const [charge, setCharge] = useState(false);
  const [bookData, setBookData] = useState(false);
  const [booking, setBooking] = useState(false);
  const [addbooking, setAddBooking] = useState(false);
  const [pickup_location, setPickup_location] = useState(false);
  const [date1, setDate1] = useState(null);
  const [date2, setDate2] = useState(null);
  const [date3, setDate3] = useState(null);
  const [date4, setDate4] = useState(null);
  const [date5, setDate5] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [newFare, setNewFare] = useState(false);
  const [pickup_time, setPickup_time] = useState(null);
  const [goods_time, setGoods_time] = useState(null);
  const [dropoff_time, setDropoff_time] = useState(null);
  const [deliver_time, setDeliver_time] = useState(null);
  const [exp_book_modalstate, setExp_book_modalstate] = useState("");
  const [book_modal_drivState, setBook_modal_drivState] = useState("");
  const [book_modal_cusState, setBook_modal_cusState] = useState("");
  const [customerDetails, setCustomerDetails] = useState([]);
  const [bookingReport, setBookingReport] = useState([]);
  const [value, setValue] = useState(null);
  const [isClearable, setIsClearable] = useState(true);
  const [homeDelBtn, setHomeDelBtn] = useState(false);
  const [dateMessage, setDateMessage] = useState(false);
  const [exporturl, setExportUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(false);
  const [downloadBtn, setDownloadBtn] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [closedBookingModal, setClosedBookingModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [cusId, setCusId] = useState(null);
  const [pickupAddress, setPickupAddress] = useState([]);
  const [dropoffAddress, setDropoffAddress] = useState([]);
  const [editfare, setEditfare] = useState(false);
  const [waitingCharges, setWaitingCharges] = useState(false);
  const [editTime, setEditTime] = useState(false);
  const [isVegamEdit, setIsVegamEdit] = useState(false);
  const [obj, setObj] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [inputPageNumber, setInputPageNumber] = useState("");

  // ── Helpers ──
  const statusColor = (s) => {
    const v = (s || "").toLowerCase();
    if (v === "pending") return "bg-yellow-100 text-yellow-700";
    if (v === "confirmed") return "bg-blue-100 text-blue-700";
    if (v === "accepted") return "bg-green-100 text-green-700";
    if (v.includes("cancel")) return "bg-red-100 text-red-600";
    if (v.includes("complet")) return "bg-brand-50 text-brand-700";
    return "bg-gray-100 text-gray-600";
  };

  const getFare = (elem) => {
    if (elem.booking_type === "ONDC" && elem.multi_booking_id) return elem.estimated_fare;
    if (elem.booking_type === null && elem.multi_booking_id) return elem.fare;
    return elem.total_booking_fare;
  };

  const getAmountCollected = (elem) => {
    if (elem.booking_type === "ONDC" && elem.multi_booking_id) return elem.requestInfo?.collection_amount;
    if (elem.booking_type === null && elem.multi_booking_id) return elem.fare;
    return elem.total_booking_fare;
  };

  const getPaymentLabel = (elem) => {
    const payType = (elem.is_regular === true && elem.payment_status === "Pending") ? "TBE" : elem.payment_type;
    let payBy = "";
    if (elem.payment_made_by === "other_party_pay") {
      if (elem.trip_type === "oneway" && elem.booking_for === "pickup") payBy = elem.payment_status?.toLowerCase() !== "completed" ? "Receiver will pay" : "Receiver paid";
      else if (elem.trip_type === "oneway" && elem.booking_for === "drop") payBy = elem.payment_status?.toLowerCase() !== "completed" ? "Sender will pay" : "Sender paid";
      else if (elem.trip_type === "round" && elem.booking_for === "pickup") payBy = elem.payment_status?.toLowerCase() !== "completed" ? "Receiver will pay" : "Receiver paid";
      else if (elem.trip_type === "round" && elem.booking_for === "drop") payBy = elem.payment_status?.toLowerCase() !== "completed" ? "Sender will pay" : "Sender paid";
    } else if (elem.payment_made_by === "pay_at_pickup") {
      payBy = elem.payment_status?.toLowerCase() !== "completed" ? "Sender will pay" : "Sender paid";
    } else if (elem.payment_made_by === "pay_at_drop") {
      payBy = elem.payment_status?.toLowerCase() !== "completed" ? "Receiver will pay" : "Receiver paid";
    } else if (elem.payment_made_by === "ill_pay") {
      payBy = elem.payment_status?.toLowerCase() !== "completed" ? "Customer choose to pay" : "Customer paid";
    } else {
      payBy = elem.payment_made_by || "";
    }
    return `${payType || ""}${payBy ? " · " + payBy : ""}`;
  };

  const handlePageNumber = (e) => setInputPageNumber(e.target.value);
  const handleGoToPage = () => {
    const page = parseInt(inputPageNumber);
    if (!isNaN(page) && page >= 1 && page <= pageCount) setPageNumber(page - 1);
  };

  // ── Existing handlers ──
  const handleEditFare = () => setEditfare(!editfare);
  const getObj = (o) => setObj(o);
  const handle_waitingCharges = () => setWaitingCharges(!waitingCharges);
  const handleChangeEditTime = () => setEditTime(!editTime);
  const handleVegam = () => setIsVegamEdit(!isVegamEdit);

  const openClosedBookModal = (elem) => { setClosedBookingModal(true); setEditData(elem); };
  const closeClosedBookModal = () => { setClosedBookingModal(false); setEditData(null); };

  const changehome_delv = () => { setHome_delv(!home_delv); setDate1(null); setDate2(null); setHomeDelBtn(false); setDateMessage(false); setErrorMessage(false); };
  const changeCharge = () => { setCharge(!charge); setDate3(null); setDateMessage(false); };
  const changeBookData = () => { setBookData(!bookData); setDate4(null); setDate5(null); setValue(null); setDateMessage(false); setErrorMessage(false); setDownloadBtn(false); };
  const changeBooking = () => setBooking(!booking);
  const changeAddBooking = () => setAddBooking(!addbooking);
  const changePickupLocation = () => setPickup_location(!pickup_location);

  const showDataPerPage = 10;
  const offset = pageNumber * showDataPerPage;
  const pageCount = Math.ceil(totalCount / showDataPerPage);
  const handlePageChange = ({ selected }) => { setPageNumber(selected); setLoading(true); };

  const getClosedBookingsData = async (p) => {
    try {
      setLoading(true);
      const response = await axios.post(`${baseUrl}/booking/getBookings`, { ...p, limit: showDataPerPage, offset });
      setClosedBookData(response.data.data.bookings);
      setTotalCount(response.data.data.count);
      localStorage.setItem("totalBookings", response.data.data.count);
    } catch (error) {
      console.log("Error in getClosedBookingsData:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAllCustomersList = async () => {
    const request = await axios.post(`${baseUrl}/users/getAllCustomers`, { limit: 600, offset: 0 });
    setCustomerList(request.data.data.customers.map((i) => ({ label: i.name, value: i.id })));
  };

  const getAllDriversList = async () => {
    const request = await axios.post(`${baseUrl}/driver/getDrivers`, { limit: 1000, offset: 0 });
    setDriverList(request.data.data.drivers.map((i) => ({ label: i.name, value: i.name })));
  };

  const handleClosedBookingId = (e) => { setParams({ ...params, id: e.target.value }); localStorage.setItem("closedBooking_Id", e.target.value); };
  const handlePickupTime = (date) => { const v = moment(date).format("YYYY-MM-DD"); setPickupTime(v); setParams({ ...params, pickup_time: v }); localStorage.setItem("Closed_booking_PickupTime", v); };
  const handleCreatedTime = (date) => { const v = moment(date).format("YYYY-MM-DD"); setCreatedTime(v); setParams({ ...params, created_at: v }); localStorage.setItem("Closed_booking_CreatedAt", v); };
  const handleReachedPickupTime = (date) => { const v = moment(date).format("YYYY-MM-DD"); setReachedPickupTime(v); setParams({ ...params, reached_pickup: v }); localStorage.setItem("Closed_booking_ReachedTime", v); };
  const handleStatus = (e) => { setStatus(e.target.value); setParams({ ...params, status: e.target.value }); localStorage.setItem("Closed_booking_Status", e.target.value); };
  const handleBookingStatus = (e) => { setBookingStatus(e.target.value); setParams({ ...params, booking_status: e.target.value }); localStorage.setItem("Closed_booking_TourStatus", e.target.value); };
  const handleCustomerSelect = (sel) => { setCustomerId(sel.value); setParams({ ...params, customer_id: sel.value }); localStorage.setItem("Closed_booking_cusId", sel.value); localStorage.setItem("Closed_booking_cusObj", JSON.stringify(sel)); };
  const handleDriverSelect = (sel) => { setParams({ ...params, driver_name: sel.value }); localStorage.setItem("Closed_booking_driverId", sel.value); localStorage.setItem("Closed_booking_driverObj", JSON.stringify(sel)); };

  const clearAllFilters = () => {
    ["closedBooking_Id","Closed_booking_PickupTime","Closed_booking_CreatedAt","Closed_booking_ReachedTime",
     "Closed_booking_Status","Closed_booking_TourStatus","Closed_booking_cusId","Closed_booking_cusObj",
     "Closed_booking_driverId","Closed_booking_driverObj","closed_booking_type"].forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  };

  const getHomeDeliveryData = async () => {
    const payload = { start_date: moment(date1).format("YYYY-MM-DD"), end_date: moment(date2).format("YYYY-MM-DD") };
    if (payload.start_date === "Invalid date" || payload.end_date === "Invalid date") { setDateMessage(true); return; }
    setDateMessage(false);
    try {
      const request = await axios.post(`${baseUrl}/booking/exportInvoiceHomeDeliveryBookingsCsv`, payload);
      if (request.data.success) { setHomeDelBtn(true); setExportUrl(request.data.data); }
      else setErrorMessage(true);
    } catch (error) {}
  };

  const getEstimateChargeReport = async () => {
    const payload = { calc_date: moment(date3).format("YYYY-MM-DD") };
    if (payload.calc_date === "Invalid date") { setDateMessage(true); return; }
    setDateMessage(false);
    const request = await axios.post(`${baseUrl}/location/revenueCalculation`, payload);
    if (request.data.success) alert("Done");
  };

  const getAllCustomers = async () => {
    try {
      const request = await axios.post(`${baseUrl}/users/getAllCustomers`, { limit: 600, offset: 0 });
      if (request.data.success) setCustomerDetails(request.data.data.customers.map((e) => ({ label: `${e.name}-${e.mobile}`, value: `${e.id}` })));
    } catch (error) { console.log(error, "getAllCustomers"); }
  };

  const newRevenueCalculation = async () => {
    try {
      const response = await axios.post(`${baseUrl}/location/revenueCalculationDateRange`, { from_date: moment(fromDate).format("YYYY-MM-DD"), to_date: moment(toDate).format("YYYY-MM-DD") });
      if (response.data.success) { setFromDate(""); setToDate(""); alert("Done"); }
    } catch (error) { console.log(error.message); }
  };

  const handleSelectedOption = (selected) => { setValue(selected); setCustomerId(selected.value); };

  const getExportBookingReport = async () => {
    const payload = { start_date: moment(date4).format("YYYY-MM-DD"), end_date: moment(date5).format("YYYY-MM-DD"), customer_id: customerId, limit: 5000 };
    if (payload.start_date === "Invalid date" || payload.end_date === "Invalid date" || payload.customer_id == null) { setDateMessage(true); setErrorMessage(false); return; }
    setDateMessage(false);
    try {
      const request = await axios.post(`${baseUrl}/booking/getBookingsDetails`, payload);
      if (request.data.success) { setDownloadBtn(true); setBookingReport(request.data.data.bookings); }
      else setErrorMessage(true);
    } catch (error) { setErrorMessage(true); console.log(error); }
  };

  const handleDeleteModal = (id) => { setDeleteModal(!deleteModal); setDeleteId(id); };
  const deleteSelectedBooking = async (id) => {
    try {
      const request = await axios.post(`${baseUrl}/booking/deleteBooking/${id}`);
      if (request.data.success) { getClosedBookingsData(params); alert(request.data.message); setDeleteModal(false); }
    } catch (error) { alert("Failed to Delete!"); console.error(error.message); }
  };

  const getAddressofcustomer = async (id) => {
    try {
      const resp = await axios.post(`${baseUrl}/users/getAddress`, { customer_id: id });
      if (resp.data.success) { setPickupAddress(resp.data.data.Pickup_address); setDropoffAddress(resp.data.data.Dropoff_address); }
    } catch (error) { setPickupAddress(""); setDropoffAddress(""); }
  };

  useEffect(() => { getAddressofcustomer(cusId); }, [cusId]);
  useEffect(() => { getClosedBookingsData({ ...params }); }, [offset]);
  useEffect(() => { getAllCustomersList(); getAllDriversList(); }, []);

  const customStyle = {
    option: (provided, state) => ({
      ...provided, padding: "5px", margin: "5px",
      backgroundColor: state.isSelected ? "#30A46C" : "white",
      color: state.isSelected ? "white" : "black",
      ":hover": { backgroundColor: "green", color: "white" },
    }),
    input: (provided) => ({ ...provided, margin: "0px", height: "30px" }),
  };

  return (
    <div className="space-y-4 pb-6">

      {/* ── Delete Modal ── */}
      <Modal isOpen={deleteModal} size="sm" centered>
        <ModalHeader toggle={handleDeleteModal} style={{ border: "none" }} />
        <ModalBody>
          <div className="flex flex-col items-center text-center px-2 pb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
              <RiDeleteBin5Line size={22} className="text-red-500" />
            </div>
            <p className="text-base font-semibold text-gray-800 mb-1">Delete Booking</p>
            <p className="text-sm text-gray-500 mb-4">Are you sure you want to delete this booking?</p>
            <div className="flex gap-2 w-full">
              <button onClick={() => handleDeleteModal()} style={{ width: "auto" }}
                className="flex-1 px-4 py-2 text-sm font-semibold border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => deleteSelectedBooking(deleteId)} style={{ width: "auto" }}
                className="flex-1 px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {/* ── Export Home Delivery Modal ── */}
      <Modal isOpen={home_delv} centered>
        <ModalHeader toggle={changehome_delv} className="border-b border-gray-100 px-4 py-3">
          <span className="text-base font-semibold text-gray-800">Export Home Delivery CSV</span>
        </ModalHeader>
        <ModalBody className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">From Date</label>
              <DatePicker selected={date1} onChange={(d) => setDate1(d)} dateFormat="yyyy-MM-dd" placeholderText="From"
                wrapperClassName="w-full" className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">To Date</label>
              <DatePicker selected={date2} onChange={(d) => setDate2(d)} dateFormat="yyyy-MM-dd" placeholderText="To"
                wrapperClassName="w-full" className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>
          {dateMessage && <p className="text-xs text-red-500">Please choose dates.</p>}
          {errorMessage && <p className="text-xs text-red-500">No records found.</p>}
          <div className="flex gap-2">
            <button onClick={getHomeDeliveryData} style={{ width: "auto" }}
              className="flex-1 px-4 py-2 text-sm font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors">
              Generate
            </button>
            {homeDelBtn && (
              <a href={exporturl} target="_blank" download="Booking File.csv" style={{ textDecoration: "none" }}>
                <button style={{ width: "auto" }}
                  className="px-4 py-2 text-sm font-semibold border border-brand-500 text-brand-500 rounded-xl hover:bg-brand-50 transition-colors">
                  Download
                </button>
              </a>
            )}
          </div>
        </ModalBody>
      </Modal>

      {/* ── Estimate Charge Modal ── */}
      <Modal isOpen={charge} centered>
        <ModalHeader toggle={changeCharge} className="border-b border-gray-100 px-4 py-3">
          <span className="text-base font-semibold text-gray-800">Fare Estimate</span>
        </ModalHeader>
        <ModalBody className="p-4 space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-400">Choose Date</label>
            <DatePicker selected={date3} onChange={(d) => setDate3(d)} dateFormat="yyyy-MM-dd" placeholderText="Select date"
              wrapperClassName="w-full" className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          {dateMessage && <p className="text-xs text-red-500">Please choose a date.</p>}
          <button onClick={getEstimateChargeReport} style={{ width: "auto" }}
            className="w-full px-4 py-2 text-sm font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors">
            Estimate
          </button>
        </ModalBody>
      </Modal>

      {/* ── Export Booking Data Modal ── */}
      <Modal isOpen={bookData} centered>
        <ModalHeader toggle={changeBookData} className="border-b border-gray-100 px-4 py-3">
          <span className="text-base font-semibold text-gray-800">Export Booking Data</span>
        </ModalHeader>
        <ModalBody className="p-4 space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-400">Customer</label>
            <ReactSelect isClearable={isClearable} value={value} options={customerDetails}
              placeholder="Choose or Search customer" handleSelectedOption={handleSelectedOption} isMulti={false} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">From Date</label>
              <DatePicker selected={date4} onChange={(d) => setDate4(d)} dateFormat="yyyy-MM-dd" placeholderText="From"
                wrapperClassName="w-full" className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">To Date</label>
              <DatePicker selected={date5} onChange={(d) => setDate5(d)} dateFormat="yyyy-MM-dd" placeholderText="To"
                wrapperClassName="w-full" className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>
          {dateMessage && <p className="text-xs text-red-500">Please fill all fields.</p>}
          {errorMessage && <p className="text-xs text-red-500">No records found.</p>}
          <div className="flex gap-2">
            <button onClick={getExportBookingReport} style={{ width: "auto" }}
              className="flex-1 px-4 py-2 text-sm font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors">
              Generate
            </button>
            {downloadBtn && (
              <CSVLink data={bookingReport} filename="Bookings.csv" target="_blank" style={{ textDecoration: "none" }}>
                <button style={{ width: "auto" }}
                  className="px-4 py-2 text-sm font-semibold border border-brand-500 text-brand-500 rounded-xl hover:bg-brand-50 transition-colors">
                  Download CSV
                </button>
              </CSVLink>
            )}
          </div>
        </ModalBody>
      </Modal>

      {/* ── Fare Changes Modal ── */}
      <Modal isOpen={newFare} centered>
        <ModalHeader toggle={() => setNewFare(false)} className="border-b border-gray-100 px-4 py-3">
          <span className="text-base font-semibold text-gray-800">Fare Changes</span>
        </ModalHeader>
        <ModalBody className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">From Date</label>
              <DatePicker selected={fromDate} onChange={(d) => setFromDate(d)} dateFormat="yyyy-MM-dd" placeholderText="From"
                wrapperClassName="w-full" className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">To Date</label>
              <DatePicker selected={toDate} onChange={(d) => setToDate(d)} dateFormat="yyyy-MM-dd" placeholderText="To"
                wrapperClassName="w-full" className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>
          <button onClick={newRevenueCalculation} style={{ width: "auto" }}
            className="w-full px-4 py-2 text-sm font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors">
            Estimate
          </button>
        </ModalBody>
      </Modal>

      {/* ── Pickup Location Modal ── */}
      <Modal isOpen={pickup_location}>
        <ModalHeader toggle={changePickupLocation} style={{ border: "none" }}>
          <p>Choose Pickup Location</p>
        </ModalHeader>
        <ModalBody>
          <NavLink>Address List:</NavLink>
          <div>
            <Search size={14} style={{ position: "relative", left: "20px" }} />
            <input type="text" placeholder="Search Address" />
          </div>
        </ModalBody>
      </Modal>

      {/* ── Add Booking Modal ── */}
      <Modal isOpen={addbooking}>
        <ModalHeader toggle={changeAddBooking} style={{ border: "none" }}>
          <p>Choose Drop-off Location</p>
        </ModalHeader>
        <ModalBody>
          <NavLink>Address List:</NavLink>
          <div>
            <Search size={14} style={{ position: "relative", left: "20px" }} />
            <input type="text" placeholder="Search Address" />
          </div>
        </ModalBody>
      </Modal>

      <Modal isOpen={booking} size="lg">
        <ModalHeader toggle={changeBooking} style={{ border: "none" }}><p>Add Bookings:</p></ModalHeader>
        <ModalBody>
          <div style={{ padding: "2px", margin: "2px" }}>
            <div className="addbookform-Div">
              <form className="addbookforms">
                <label htmlFor="chooseCus">Choose Customer:</label>
                <div><SearchableDropdown state={book_modal_cusState} setState={setBook_modal_cusState} data={data1} /></div>
                <label htmlFor="commodity">Commodity Weight:</label>
                <input type="text" placeholder="Enter Commodity Weight" id="commodity" />
                <label htmlFor="pickup">Pickup Location:</label>
                <div className="pickup-Div">
                  <div><input type="text" placeholder="Choose Pickup Location" id="pickup" /></div>
                  <div><BiSolidMap onClick={changePickupLocation} size={50} color="green" style={{ cursor: "pointer" }} /></div>
                </div>
                <label htmlFor="location">Dropoff Location:</label>
                <div className="pickup-Div">
                  <div><input type="text" placeholder="Choose Dropoff Location" id="location" /></div>
                  <div><BiSolidMap onClick={changeAddBooking} size={50} color="green" style={{ cursor: "pointer" }} /></div>
                </div>
                <label htmlFor="choosedriver">Choose Driver:</label>
                <SearchableDropdown state={book_modal_drivState} setState={setBook_modal_drivState} data={data} />
                <label htmlFor="booking-type">Choose Booking Type:</label>
                <select name="" id="" style={{ width: "550px", padding: "3px", marginBottom: "15px" }}>
                  <option value="single">single</option>
                  <option value="combine">combine</option>
                </select>
                <label htmlFor="pickup-time">Reached Pickup Time:</label>
                <DatePicker placeholderText="Choose Time" selected={pickup_time} onChange={(d) => setPickup_time(d)} dateFormat="dd-MM-yyyy" showTimeSelect showTimeInput />
                <label htmlFor="goods-pickup-time">Pickedup Goods Time:</label>
                <DatePicker placeholderText="Choose Time" selected={goods_time} onChange={(d) => setGoods_time(d)} dateFormat="dd-MM-yyyy" showTimeSelect showTimeInput />
                <label htmlFor="drop-time">Reached Dropoff Time:</label>
                <DatePicker placeholderText="Choose Time" selected={dropoff_time} onChange={(d) => setDropoff_time(d)} dateFormat="dd-MM-yyyy" showTimeSelect showTimeInput />
                <label htmlFor="deliver-time">Delivered Time:</label>
                <DatePicker placeholderText="Choose Time" selected={deliver_time} onChange={(d) => setDeliver_time(d)} dateFormat="dd-MM-yyyy" showTimeSelect showTimeInput />
                <p style={{ padding: "2px", marginBottom: "30px" }}>
                  <span style={{ position: "absolute", right: "460px" }}><input type="checkbox" id="loading" /></span>
                  <span style={{ position: "absolute", left: "85px" }}>Loading/Unloading charges applicable?</span>
                </p>
                <label htmlFor="info">Additional Information:</label>
                <input type="text" placeholder="Enter Additional Information" id="info" />
                <div className="addbook-Btn"><button className="btn-small">ADD</button></div>
              </form>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {/* ── Edit modals (external components) ── */}
      <ClosedBookingsEditModal isOpen={closedBookingModal} toggle={closeClosedBookModal} editData={editData}
        getClosedBookingsData={getClosedBookingsData} pickupAddress={pickupAddress} dropoffAddress={dropoffAddress} />
      <TimeEditModal editTime={editTime} handleChangeEditTime={handleChangeEditTime} item={obj}
        initialFunction={getClosedBookingsData} params={params} />
      <FareEditModal editfare={editfare} handleEditFare={handleEditFare} item={obj}
        initialFunction={getClosedBookingsData} params={params} />
      <WaitingChargeEditModal waitingCharges={waitingCharges} handle_waitingCharges={handle_waitingCharges}
        item={obj} initialFunction={getClosedBookingsData} params={params} />
      <VegamEditModal isOpen={isVegamEdit} handleVegam={handleVegam} item={obj}
        initialFunction={getClosedBookingsData} params={params} />

      {/* ── Top bar ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input type="text" placeholder="Search by name or phone..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
        </div>
        {/* Mobile: Reports dropdown */}
        <div className="relative sm:hidden">
          <button onClick={() => setReportsOpen(o => !o)} style={{ width: "auto" }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-brand-500 text-white rounded-xl">
            Reports <BiChevronDown size={14} className={`transition-transform ${reportsOpen ? "rotate-180" : ""}`} />
          </button>
          {reportsOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-[190px] py-1">
              {[
                { label: "Add Bookings", fn: changeBooking },
                { label: "Estimate Charge", fn: changeCharge },
                { label: "Export Home Delivery", fn: changehome_delv },
                { label: "Export Booking Data", fn: () => { changeBookData(); getAllCustomers(); } },
                { label: "Fare Changes", fn: () => setNewFare(true) },
              ].map(({ label, fn }) => (
                <button key={label} onClick={() => { fn(); setReportsOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-brand-50">
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Mobile: Filters toggle */}
        <button onClick={() => setFiltersOpen(o => !o)} style={{ width: "auto", background: "white" }}
          className="sm:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-gray-200 text-gray-600 rounded-xl">
          Filters <BiChevronDown size={14} className={`transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
        </button>
        {/* Desktop: all buttons */}
        <div className="hidden sm:flex gap-2 flex-wrap">
          <button onClick={changeBooking} style={{ width: "auto" }}
            className="px-3 py-2 text-xs font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors">
            Add Booking
          </button>
          <button onClick={changeCharge} style={{ width: "auto" }}
            className="px-3 py-2 text-xs font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors">
            Estimate Charge
          </button>
          <button onClick={changehome_delv} style={{ width: "auto" }}
            className="px-3 py-2 text-xs font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors">
            Home Delivery CSV
          </button>
          <button onClick={() => { changeBookData(); getAllCustomers(); }} style={{ width: "auto" }}
            className="px-3 py-2 text-xs font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors">
            Export Bookings
          </button>
          <button onClick={() => setNewFare(true)} style={{ width: "auto" }}
            className="px-3 py-2 text-xs font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors">
            Fare Changes
          </button>
        </div>
      </div>

      {/* ── Filter panel ── */}
      <div className={`sm:block ${filtersOpen ? "block" : "hidden"}`}>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-card">
          {/* Mobile: 2-col grid */}
          <div className="grid grid-cols-2 gap-2 sm:hidden">
            <input type="text" placeholder="Booking ID" onChange={handleClosedBookingId} value={params.id}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <select value={params.booking_type}
              onChange={(e) => { const v = e.target.value.trim(); setParams(p => ({ ...p, booking_type: v })); localStorage.setItem("closed_booking_type", v); }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value="">Booking type</option>
              <option value="GoodMove">GoodMove</option>
              <option value="ONDC">ONDC</option>
            </select>
            <select value={params.status} onChange={handleStatus}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value="">Status</option>
              <option value="Accepted">Accepted</option>
              <option value="Canceled By Manager">Canceled By Manager</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
            </select>
            <select value={params.booking_status} onChange={handleBookingStatus}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value="">Booking status</option>
              <option value="Accepted">Accepted</option>
              <option value="Canceled By Manager">Canceled By Manager</option>
              <option value="Completed drop">Completed drop</option>
              <option value="Completed pickup">Completed pickup</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Created">Created</option>
              <option value="Fare">Fare</option>
              <option value="Pending">Pending</option>
              <option value="Reached drop">Reached drop</option>
              <option value="Reached pickup">Reached pickup</option>
              <option value="Tour Completed">Tour Completed</option>
              <option value="Tour Created">Tour Created</option>
              <option value="Trip Created">Trip Created</option>
            </select>
            <div className="col-span-2">
              <Select options={customerList}
                value={localStorage.getItem("Closed_booking_cusObj") ? JSON.parse(localStorage.getItem("Closed_booking_cusObj")) : ""}
                isSearchable placeholder="Customer name" onChange={handleCustomerSelect}
                menuPortalTarget={document.body} styles={customStyle} />
            </div>
            <div className="col-span-2">
              <Select options={driverList}
                value={localStorage.getItem("Closed_booking_driverObj") ? JSON.parse(localStorage.getItem("Closed_booking_driverObj")) : ""}
                onChange={handleDriverSelect} isSearchable placeholder="Driver name"
                menuPortalTarget={document.body} styles={customStyle} />
            </div>
            <DatePicker value={params.pickup_time} onChange={handlePickupTime} dateFormat="yyyy-MM-dd" placeholderText="Pickup Date"
              wrapperClassName="w-full" className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <DatePicker value={params.created_at} onChange={handleCreatedTime} dateFormat="yyyy-MM-dd" placeholderText="Created At"
              wrapperClassName="w-full" className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <DatePicker value={params.reached_pickup} onChange={handleReachedPickupTime} dateFormat="yyyy-MM-dd" placeholderText="Reached Pickup"
              wrapperClassName="w-full" className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <div />
            <button onClick={() => getClosedBookingsData(params)} style={{ width: "auto" }}
              className="px-4 py-2 text-sm font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors">
              Apply
            </button>
            <button onClick={clearAllFilters} style={{ width: "auto", background: "white" }}
              className="px-4 py-2 text-sm font-semibold border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
              Clear
            </button>
          </div>

          {/* Desktop: labeled 4-col grid */}
          <div className="hidden sm:grid grid-cols-4 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Booking ID</label>
              <input type="text" placeholder="Booking ID" onChange={handleClosedBookingId} value={params.id}
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Customer</label>
              <Select options={customerList}
                value={localStorage.getItem("Closed_booking_cusObj") ? JSON.parse(localStorage.getItem("Closed_booking_cusObj")) : ""}
                isSearchable placeholder="Customer name" onChange={handleCustomerSelect}
                menuPortalTarget={document.body} styles={customStyle} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Driver</label>
              <Select options={driverList}
                value={localStorage.getItem("Closed_booking_driverObj") ? JSON.parse(localStorage.getItem("Closed_booking_driverObj")) : ""}
                onChange={handleDriverSelect} isSearchable placeholder="Driver name"
                menuPortalTarget={document.body} styles={customStyle} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Booking Type</label>
              <select value={params.booking_type}
                onChange={(e) => { const v = e.target.value.trim(); setParams(p => ({ ...p, booking_type: v })); localStorage.setItem("closed_booking_type", v); }}
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="">All types</option>
                <option value="GoodMove">GoodMove</option>
                <option value="ONDC">ONDC</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Pickup Date</label>
              <DatePicker value={params.pickup_time} onChange={handlePickupTime} dateFormat="yyyy-MM-dd" placeholderText="Pickup Date"
                wrapperClassName="w-full" className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Created At</label>
              <DatePicker value={params.created_at} onChange={handleCreatedTime} dateFormat="yyyy-MM-dd" placeholderText="Created At"
                wrapperClassName="w-full" className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Reached Pickup</label>
              <DatePicker value={params.reached_pickup} onChange={handleReachedPickupTime} dateFormat="yyyy-MM-dd" placeholderText="Reached Pickup"
                wrapperClassName="w-full" className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Status</label>
              <select value={params.status} onChange={handleStatus}
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="">All statuses</option>
                <option value="Accepted">Accepted</option>
                <option value="Canceled By Manager">Canceled By Manager</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-xs font-medium text-gray-400">Booking Status</label>
              <select value={params.booking_status} onChange={handleBookingStatus}
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="">All booking statuses</option>
                <option value="Accepted">Accepted</option>
                <option value="Canceled By Manager">Canceled By Manager</option>
                <option value="Completed drop">Completed drop</option>
                <option value="Completed pickup">Completed pickup</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Created">Created</option>
                <option value="Fare">Fare</option>
                <option value="Pending">Pending</option>
                <option value="Reached drop">Reached drop</option>
                <option value="Reached pickup">Reached pickup</option>
                <option value="Tour Completed">Tour Completed</option>
                <option value="Tour Created">Tour Created</option>
                <option value="Trip Created">Trip Created</option>
              </select>
            </div>
            <div className="flex items-end gap-2 col-span-2">
              <button onClick={() => getClosedBookingsData(params)} style={{ width: "auto" }}
                className="flex-1 px-4 py-2 text-sm font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors">
                Filter
              </button>
              <button onClick={clearAllFilters} style={{ width: "auto", background: "white" }}
                className="flex-1 px-4 py-2 text-sm font-semibold border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Record count / loading / empty ── */}
      {loading && <p className="text-center text-sm text-brand-500 py-8">Loading...</p>}
      {!loading && totalCount > 0 && <p className="text-xs text-gray-400">{totalCount} bookings found</p>}
      {!loading && closedBookData.length === 0 && <p className="text-center text-sm text-gray-400 py-8">No records found.</p>}

      {/* ── Cards ── */}
      {!loading && (
        <div className="space-y-2">
          {closedBookData.map((elem) => {
            const isExpanded = expandedId === elem.id;
            const isCanceled = elem.booking_canceled_by_manager || elem.booking_canceled_by_customer;
            const fare = getFare(elem);

            return (
              <div key={elem.id}
                className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${
                  isCanceled ? "border-gray-100 opacity-60" :
                  isExpanded ? "border-brand-300 shadow-card-md" :
                  "border-gray-200 hover:border-gray-300 hover:shadow-card"
                }`}>

                {/* Summary row */}
                <div className="px-4 py-3 cursor-pointer select-none" onClick={() => setExpandedId(isExpanded ? null : elem.id)}>

                  {/* ── MOBILE ── */}
                  <div className="sm:hidden">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                        <span className="text-sm font-bold text-gray-900">#{elem.id}</span>
                        {elem.booking_type && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{elem.booking_type}</span>}
                        {elem.tour_id && <span className="text-xs text-gray-400">T#{elem.tour_id}</span>}
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor(elem.status)}`}>{elem.status}</span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-sm font-bold text-gray-900">₹{fare ?? "—"}</span>
                        <button onClick={(e) => { e.stopPropagation(); openClosedBookModal(elem); setCusId(elem.customer_id); }}
                          className="p-1.5 text-gray-400 hover:text-brand-500 rounded-lg transition-colors" style={{ width: "auto", background: "transparent" }}>
                          <BiEditAlt size={15} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteModal(elem.id); }}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors" style={{ width: "auto", background: "transparent" }}>
                          <RiDeleteBin5Line size={15} />
                        </button>
                        <BiChevronDown size={17} className={`text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 truncate mb-1">
                      {elem.customer_name || "—"}
                      {elem.driver_name && <span className="text-xs font-normal text-gray-500 ml-1">· {elem.driver_name}</span>}
                    </p>
                    {/* Pickup — full on mobile */}
                    <div className="flex items-start gap-1.5 mb-0.5">
                      <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs font-semibold text-gray-800 leading-snug">{elem.pickup_location || "—"}</p>
                    </div>
                    {/* Drop — full on mobile */}
                    <div className="flex items-start gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs font-semibold text-gray-800 leading-snug">{elem.dropoff_location || "—"}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{moment(elem.created_at).format("MMM D, YYYY HH:mm")}</p>
                  </div>

                  {/* ── DESKTOP ── */}
                  <div className="hidden sm:flex items-center gap-4">
                    <div className="flex-shrink-0 w-24">
                      <p className="text-sm font-bold text-gray-900">#{elem.id}</p>
                      {elem.booking_type && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full mt-0.5 inline-block">{elem.booking_type}</span>}
                      {elem.tour_id && <p className="text-xs text-gray-400 mt-0.5">T#{elem.tour_id}</p>}
                    </div>
                    <div className="flex-1 grid grid-cols-3 gap-4 min-w-0">
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 mb-0.5">Customer · Driver</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{elem.customer_name || "—"}</p>
                        <p className="text-xs text-gray-500 truncate">{elem.driver_name || "—"}</p>
                      </div>
                      {/* Pickup — truncated on desktop, full on hover */}
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 mb-1">Pickup</p>
                        <div className="flex items-start gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1" />
                          <p className="text-sm font-semibold text-gray-800 truncate" title={elem.pickup_location}>{elem.pickup_location || "—"}</p>
                        </div>
                      </div>
                      {/* Drop — truncated on desktop, full on hover */}
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 mb-1">Drop</p>
                        <div className="flex items-start gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1" />
                          <p className="text-sm font-semibold text-gray-800 truncate" title={elem.dropoff_location}>{elem.dropoff_location || "—"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
                      <div className="text-right">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor(elem.status)}`}>{elem.status}</span>
                        <p className="text-sm font-semibold text-gray-900 mt-1">₹{fare ?? "—"}</p>
                      </div>
                      <div className="flex gap-0.5">
                        <button onClick={(e) => { e.stopPropagation(); openClosedBookModal(elem); setCusId(elem.customer_id); }}
                          className="p-1.5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-colors" style={{ width: "auto", background: "transparent" }}>
                          <BiEditAlt size={16} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteModal(elem.id); }}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" style={{ width: "auto", background: "transparent" }}>
                          <RiDeleteBin5Line size={16} />
                        </button>
                      </div>
                      <BiChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </div>
                </div>

                {/* ── Expanded panel ── */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50/40 px-4 py-4 space-y-4">
                    {/* Time fields */}
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Timeline</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        {[
                          { label: "Created At", value: moment(elem.created_at).format("MMM D, YYYY HH:mm") },
                          { label: "Reached Pickup", value: elem.reached_pickup || "—" },
                          { label: "Completed Pickup", value: elem.completed_pickup || "—" },
                          { label: "Reached Drop", value: elem.reached_drop || "—" },
                          { label: "Completed Drop", value: elem.completed_drop || "—" },
                          { label: "Pickup Time", value: elem.pickup_time || "—" },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                            <p className="text-xs font-medium text-gray-700">{value}</p>
                          </div>
                        ))}
                        <div className="flex items-center">
                          <button onClick={(e) => { e.stopPropagation(); handleChangeEditTime(); getObj(elem); }}
                            className="flex items-center gap-1 text-xs font-semibold text-brand-500 hover:text-brand-600" style={{ background: "transparent" }}>
                            <BiEditAlt size={13} /> Edit Times
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Payment + fare */}
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Payment</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Payment Type</p>
                          <p className="text-xs font-medium text-gray-700">{getPaymentLabel(elem)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Payment Status</p>
                          <p className="text-xs font-medium text-gray-700">{elem.payment_status || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Estimate Fare</p>
                          <div className="flex items-center gap-1">
                            <p className="text-xs font-medium text-gray-700">₹{fare ?? "—"}</p>
                            <button onClick={(e) => { e.stopPropagation(); handleEditFare(); getObj(elem); }}
                              className="text-gray-400 hover:text-brand-500" style={{ background: "transparent" }}>
                              <BiEditAlt size={12} />
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Amount Collected</p>
                          <p className="text-xs font-medium text-gray-700">₹{getAmountCollected(elem) ?? "—"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Other details */}
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Details</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Weight</p>
                          <p className="text-xs font-medium text-gray-700">{elem.commodity_weight} {elem.weight_unit === 12 ? "Kg" : "Cu.ft"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Waiting Charges</p>
                          <div className="flex items-center gap-1">
                            <p className="text-xs font-medium text-gray-700">{elem.waiting_charge ?? "—"}</p>
                            <button onClick={(e) => { e.stopPropagation(); handle_waitingCharges(); getObj(elem); }}
                              className="text-gray-400 hover:text-brand-500" style={{ background: "transparent" }}>
                              <BiEditAlt size={12} />
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Data Validity</p>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${elem.is_manager_entered ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
                            {elem.is_manager_entered ? "INVALID" : "VALID"}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Vivegam</p>
                          <div className="flex items-center gap-1">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${elem.is_vivegam ? "bg-brand-50 text-brand-600" : "bg-gray-100 text-gray-500"}`}>
                              {elem.is_vivegam ? "Yes" : "No"}
                            </span>
                            <button onClick={(e) => { e.stopPropagation(); handleVegam(); getObj(elem); }}
                              className="text-gray-400 hover:text-brand-500" style={{ background: "transparent" }}>
                              <BiEditAlt size={12} />
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Invoice</p>
                          <p className="text-xs font-medium text-gray-700">{elem.invoice_number || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Loading</p>
                          <p className="text-xs font-medium text-gray-700">{elem.loading_charge_applicable ? "Yes" : "No"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Unloading</p>
                          <p className="text-xs font-medium text-gray-700">{elem.unloading_charge_applicable ? "Yes" : "No"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Both L&U</p>
                          <p className="text-xs font-medium text-gray-700">{elem.both_loading_unloading_charge_applicable ? "Yes" : "No"}</p>
                        </div>
                        {elem.instruction && (
                          <div className="col-span-2 sm:col-span-4">
                            <p className="text-xs text-gray-400 mb-0.5">Additional Info</p>
                            <p className="text-xs font-medium text-gray-700">{elem.instruction}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Booking status */}
                    {elem.booking_status && (
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-400">Booking Status:</p>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor(elem.booking_status)}`}>{elem.booking_status}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Pagination ── */}
      {Boolean(closedBookData.length) && (
        <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-card flex flex-col gap-2">
          <div className="flex justify-center overflow-x-auto">
            <Pagination pageNumber={pageNumber} handlePageChange={handlePageChange} pageCount={pageCount} />
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <input type="text" onChange={handlePageNumber} placeholder="Page #"
                className="w-16 px-2.5 py-1.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500" />
              <button onClick={handleGoToPage} style={{ width: "auto" }}
                className="p-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-colors">
                <FaArrowRight size={13} />
              </button>
            </div>
            <p className="text-xs text-gray-400">{totalCount} total</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClosedBookings;
