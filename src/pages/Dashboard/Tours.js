import React, { useEffect, useState } from "react";
import { Search } from "react-bootstrap-icons";
import { BiEditAlt, BiChevronDown } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { FaArrowRight } from "react-icons/fa6";
import "../../styles/Tours/tours.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactSelect from "../../ReactSelect";
import moment from "moment";
import { CSVLink } from "react-csv";
import { baseUrl } from "../../api/apiConfig";
import TourCount from "../counts/TourCount";
import Pagination from "../../Pagination";

const Tours = () => {
  const [tourData, setTourData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setTotalCount] = useState(0);
  const [org_tour, setOrg_Tour] = useState(0);
  const [driver, setDriver] = useState(false);
  const [driverIndividual, setDriverIndividual] = useState([]);
  const [tourdata, setTourdata] = useState(false);
  const [btn_view_modal, setBtn_view_modal] = useState(false);
  const [reportDate, setReportDate] = useState(null);
  const [intial_tour_date, setInitial_tour_date] = useState(null);
  const [tourdate, setTourdate] = useState(null);
  const [tourdate1, setTourdate1] = useState(null);
  const [value, setValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tourDetails, setTourDetails] = useState([]);
  const [tourId, setTourId] = useState("");
  const [view, setView] = useState(false);
  const [tourStatus, setTourStatus] = useState({});
  const [success, setSuccess] = useState(false);
  const [search, setSearch] = useState("");
  // Pause Auto Allocation setting
  const PAUSE_AUTO_ALLOCATION_SETTING = "pause_auto_allocation";
  const [pauseAutoAllocationId, setPauseAutoAllocationId] = useState(null);
  const [pauseAutoAllocation, setPauseAutoAllocation] = useState(false);
  const [pauseAutoAllocationLoading, setPauseAutoAllocationLoading] = useState(false);
  const [name, setName] = useState({});
  const [mobileNo, setMobieNo] = useState({});
  const [user_id, setUser_id] = useState("");
  const [downloadBtn, setDownloadBtn] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const [result, setResult] = useState([]);
  const [params, setParams] = useState({
    limit: 10,
    offset: 0,
    driver_id: localStorage.getItem("tour_driverId") ? localStorage.getItem("tour_driverId") : "",
    driver_mobile: "",
    id: localStorage.getItem("tourId") ? localStorage.getItem("tourId") : "",
    status: localStorage.getItem("tourStatus") ? localStorage.getItem("tourStatus") : "",
    tour_date: localStorage.getItem("tourDate") ? localStorage.getItem("tourDate") : "",
    tour_status: localStorage.getItem("tourCurStatus") ? localStorage.getItem("tourCurStatus") : "",
    booking_type: localStorage.getItem("tour_booking_type") ? localStorage.getItem("tour_booking_type") : "",
  });
  const [driversDetails, setdriversDetails] = useState([]);
  const [driverId, setDriverId] = useState(null);
  const [tourReport, setTourReport] = useState([]);
  const [isClearable, setIsClearable] = useState(true);
  const [dateMessage, setDateMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [tourEditModal, setTourEditModal] = useState(false);
  const [editdriverId, seteditDriverId] = useState(null);
  const [buttonShow, setButtonShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nameFilter, setNameFilter] = useState([]);
  const [mobileFilter, setMobileFilter] = useState([]);
  const [toursDetail, setToursDetail] = useState(false);
  const [tour_info_Date, setTour_info_Date] = useState("");
  const [tourinfo_driver_Details, setTourinfo_driver_Details] = useState({});
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [inputPageNumber, setInputPageNumber] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const statusColor = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "assigned") return "bg-blue-100 text-blue-700";
    if (s === "accepted") return "bg-brand-50 text-brand-700";
    if (s === "completed") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-600";
  };

  const tourStatusColor = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("completed")) return "bg-green-100 text-green-700";
    if (s.includes("cancelled")) return "bg-red-100 text-red-600";
    if (s.includes("pending")) return "bg-yellow-100 text-yellow-700";
    if (s.includes("reached")) return "bg-orange-100 text-orange-700";
    if (s.includes("accepted") || s.includes("confirmed")) return "bg-brand-50 text-brand-700";
    return "bg-gray-100 text-gray-600";
  };

  const handlePageNumber = (e) => setInputPageNumber(e.target.value);
  const handleGoToPage = () => {
    const page = parseInt(inputPageNumber);
    if (!isNaN(page) && page >= 1 && page <= pageCount) setPageNumber(page - 1);
  };

  const handleChangesTourEditModal = (id) => {
    setTourEditModal(!tourEditModal);
    seteditDriverId(id);
  };

  const updateTourDetails = async () => {
    try {
      const request = await axios.post(`${baseUrl}/tours/updateTourTrips`, { tour_id: editdriverId });
      if (request.data.success) {
        alert("Trips Reverted Successfully ✅");
        setTourEditModal(false);
        getToursData(params);
        if (!pauseAutoAllocation) {
          updatePauseAutoAllocation(true);
        }
      }
    } catch (error) {
      console.error(error.message);
      alert("Something went wrong");
    }
  };

  const driverReport = () => {
    setDriver(!driver);
    setDateMessage(false);
    setDownloadBtn(false);
    setReportDate(null);
    setNoResult(false);
  };

  const changeTourdata = () => {
    setTourdata(!tourdata);
    setValue(null);
    setDateMessage(false);
    setDownloadBtn(false);
    setTourdate(null);
    setTourdate1(null);
  };

  const getTourDetails = () => setToursDetail(true);

  const openModal = () => setBtn_view_modal(true);
  const closeModal = () => {
    setBtn_view_modal(!btn_view_modal);
    setButtonShow(false);
    setTourStatus({});
    setIsLoading(false);
  };

  const changeButtonView = (index) => {
    openModal();
    setTourId(tourData[index].tour.id);
    const tourDetailsRaw = tourData[index].sequenceData;
    let tourMap = [];
    let i = 0;
    for (let seqNum of tourDetailsRaw) {
      let isSamePoint = false;
      if (tourDetailsRaw[i - 1]) {
        if (tourMap[tourMap?.length - 1].transport_type === seqNum.transport_type &&
          tourMap[tourMap?.length - 1].location_address === seqNum.location_address &&
          tourMap[tourMap?.length - 1].status === seqNum.status) {
          isSamePoint = true;
        }
      }
      if (isSamePoint) {
        tourMap[tourMap?.length - 1].seqIds.push(seqNum.id);
        tourMap[tourMap?.length - 1].tripIds.push(seqNum.trip_id);
      } else {
        tourMap.push({ ...seqNum, seqIds: [seqNum.id], tripIds: [seqNum.trip_id] });
      }
      i++;
    }
    setTourDetails(tourMap);
  };

  const handleStatusChange = (value, type, index) => {
    setSelectedIndex(index);
    setButtonShow(true);
    setView(true);
    setTourStatus((prev) => ({ ...prev, [index]: value }));
  };

  const getUniqueTourData = (data) => {
    let tourMap = [];
    let i = 0;
    for (let seqNum of data) {
      let isSamePoint = false;
      if (data[i - 1]) {
        if (tourMap[tourMap?.length - 1].transport_type === seqNum.transport_type &&
          tourMap[tourMap?.length - 1].location_address === seqNum.location_address &&
          tourMap[tourMap?.length - 1].status === seqNum.status) {
          isSamePoint = true;
        }
      }
      if (isSamePoint) {
        tourMap[tourMap?.length - 1].seqIds.push(seqNum.id);
        tourMap[tourMap?.length - 1].tripIds.push(seqNum.trip_id);
      } else {
        tourMap.push({ ...seqNum, seqIds: [seqNum.id], tripIds: [seqNum.trip_id] });
      }
      i++;
    }
    setTourDetails(tourMap);
  };

  const tourStatusUpdate = async (elem, index) => {
    const payload = { seqNum: elem.seqIds, status: tourStatus[index], is_from_manager: true };
    try {
      const statusResponse = await axios.post(`${baseUrl}/tours/updateSequence`, payload);
      let lastId = tourDetails[tourDetails.length - 1].id;
      if (statusResponse.data.success) {
        const respo = await axios.post(`${baseUrl}/tours/toursLIst`, { id: tourId });
        getUniqueTourData(respo.data.data.tours[0].sequenceData);
        setButtonShow(false);
      }
      if (statusResponse.data.success && lastId === elem.id && tourStatus[index] === "Completed") {
        await axios.post(`${baseUrl}/tours/completeTour`, { tour_id: tourId });
        setBtn_view_modal(false);
        toast.success("Tour Completed. ✅", { position: "top-center", autoClose: 1000 });
      }
    } catch (error) {
      console.log(error);
      const respo = await axios.post(`${baseUrl}/tours/toursLIst`, { id: tourId });
      getUniqueTourData(respo.data.data.tours[0].sequenceData);
      setButtonShow(false);
    }
    getToursData(params);
  };

  const [pageNumber, setPageNumber] = useState(0);
  const showDataPerPage = 10;
  const offset = pageNumber * showDataPerPage;
  const pageCount = Math.ceil(count / showDataPerPage);
  const handlePageChange = ({ selected }) => setPageNumber(selected);

  const allDriverList = async () => {
    const response = await axios.post(`${baseUrl}/driver/getDrivers`, { limit: 1000, offset: 0 });
    const driverList = response.data.data.drivers;
    setDriverIndividual(driverList);
    setdriversDetails(driverList.map((e) => ({ label: `${e.name} - ${e.mobile_number}`, value: e.user_id })));
    setNameFilter(driverList.map((e) => ({ label: e.name, value: e.user_id })));
    setMobileFilter(driverList.map((e) => ({ label: e.mobile_number, value: e.user_id })));
  };

  const handleTourid = (e) => {
    setPageNumber(0);
    setParams({ ...params, id: e.target.value });
    localStorage.setItem("tourId", e.target.value);
  };

  const handleSelectedDriver = (selected) => {
    setName(selected);
    setParams({ ...params, driver_id: selected.value });
    localStorage.setItem("tour_driverId", selected.value);
    localStorage.setItem("tour_driverObj", JSON.stringify(selected));
  };

  const handleSelectedDrivermobile = (selected) => {
    setMobieNo(selected);
    setParams({ ...params, driver_id: selected.value });
    localStorage.setItem("tour_driverId", selected.value);
    localStorage.setItem("tour_driver_MobObj", JSON.stringify(selected));
  };

  const filter_tour_date = (date) => {
    const selectedDate = moment(date).format("YYYY-MM-DD");
    setInitial_tour_date(selectedDate);
    setParams({ ...params, tour_date: selectedDate });
    localStorage.setItem("tourDate", selectedDate);
  };

  const handleTourStatus = (e) => {
    setParams({ ...params, status: e.target.value });
    localStorage.setItem("tourStatus", e.target.value);
  };

  const handleTourCurrentStatus = (e) => {
    setParams({ ...params, tour_status: e.target.value });
    localStorage.setItem("tourCurStatus", e.target.value);
  };

  const getClear = () => {
    setLoading(true);
    ["tourId","tourStatus","tourCurStatus","tourDate","tour_driverId","tour_driverObj","tour_driver_MobObj","tourCount","tour_booking_type"]
      .forEach((k) => localStorage.removeItem(k));
    const cleared = { ...params, driver_id: "", id: "", status: "", tour_date: "", tour_status: "", booking_type: "" };
    setParams(cleared);
    getTourCount({ ...cleared, tour_date: moment().format("YYYY-MM-DD"), limit: 200, offset: 0 });
    getToursData({ limit: 10, offset: 0, driver_id: "", driver_mobile: "", id: "", status: "", tour_date: "", tour_status: "", booking_type: "" });
    setLoading(false);
  };

  const getDailyDriversReport = async () => {
    const payload = { start_date: moment(reportDate).format("YYYY-MM-DD") };
    if (payload.start_date === "Invalid date") {
      setDateMessage(true);
    } else {
      setDateMessage(false);
      try {
        const request = await axios.post(`${baseUrl}/location/driverReports`, payload);
        if (request.data.success) {
          setNoResult(false);
          setDownloadBtn(true);
          setResult(request.data.data.locations);
        } else {
          setNoResult(true);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const handleSelectedOption = (selected) => {
    setValue(selected);
    setDriverId(selected.value);
  };

  const getExportTourReport = async () => {
    const payload = {
      start_date: moment(tourdate).format("YYYY-MM-DD"),
      end_date: moment(tourdate1).format("YYYY-MM-DD"),
      driver_id: driverId,
      limit: 1000,
    };
    if (payload.start_date === "Invalid date" || payload.end_date === "Invalid date" || payload.driver_id == null) {
      setDateMessage(true);
      setErrorMessage(false);
    } else {
      setDateMessage(false);
      try {
        const request = await axios.post(`${baseUrl}/booking/getBookingsDetails`, payload);
        if (request.data.success) {
          setDownloadBtn(true);
          setTourReport(request.data.data.bookings);
        } else {
          setErrorMessage(true);
        }
      } catch (error) {
        setErrorMessage(true);
        console.log(error);
      }
    }
  };

  const handleDeleteModal = (id) => {
    setDeleteModal(!deleteModal);
    setDeleteId(id);
  };

  const deleteSelectedTour = async (id) => {
    try {
      const request = await axios.post(`${baseUrl}/tours/deleteTour/${id}`);
      if (request.data.success) {
        getToursData(params);
        alert("Tour Deleted.");
        setDeleteModal(false);
      }
    } catch (error) {
      alert("Failed to Delete!");
      console.error(error.message);
    }
  };

  async function getToursData(p) {
    setLoading(true);
    const request = await fetch(`${baseUrl}/tours/toursList`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, limit: showDataPerPage, offset }),
    });
    const response = await request.json();
    setTotalCount(response.data.count);
    setTourData(response.data.tours);
    setLoading(false);
  }

  const driverDetails = {};
  const getTourCount = async (p) => {
    setLoading(true);
    try {
      const countRequest = await axios.post(`${baseUrl}/tours/toursList`, {
        ...p,
        tour_date: p.tour_date ? p.tour_date : moment().format("YYYY-MM-DD"),
        limit: 200,
        offset: 0,
      });
      const resp = countRequest.data.data.tours;
      const tourCount = resp;
      setOrg_Tour(tourCount.length);
      tourCount.forEach((entry) => {
        const driverName = entry.truck.driver_name;
        const tourId = entry.tour.id;
        const driverMobile = entry.truck.driver_mobile;
        setTour_info_Date(entry.tour.tour_date);
        if (!driverDetails[driverName]) {
          driverDetails[driverName] = { name: driverName, count: 1, tourIds: [tourId], mobile: driverMobile };
        } else {
          driverDetails[driverName].count++;
          if (!driverDetails[driverName].tourIds.includes(tourId)) driverDetails[driverName].tourIds.push(tourId);
        }
      });
      setTourinfo_driver_Details(driverDetails);
      setLoading(false);
    } catch (error) {
      console.log("Failed to count tours");
    }
  };

  const getPauseAutoAllocationSetting = async () => {
    try {
      const response = await axios.post(`${baseUrl}/admin/getPortalSettings`, { limit: 500, offset: 0 });
      if (response.data.success) {
        const setting = response.data.data.portalSettings.find(
          (item) => item.setting_name === PAUSE_AUTO_ALLOCATION_SETTING
        );
        if (setting) {
          setPauseAutoAllocationId(setting.id);
          setPauseAutoAllocation(!!setting.setting_value);
        }
      }
    } catch (error) {
      console.log("Failed to fetch Pause Auto Allocation setting", error);
    }
  };

  const updatePauseAutoAllocation = async (newValue) => {
    setPauseAutoAllocationLoading(true);
    try {
      if (pauseAutoAllocationId) {
        const response = await axios.post(`${baseUrl}/admin/editPortalSetting`, {
          id: pauseAutoAllocationId,
          setting_value: newValue,
        });
        if (response.data.success) {
          setPauseAutoAllocation(newValue);
        } else {
          toast.error(response.data.message, { position: "top-center", theme: "light" });
        }
      } else {
        const response = await axios.post(`${baseUrl}/admin/addPortalSetting`, {
          setting_name: PAUSE_AUTO_ALLOCATION_SETTING,
          setting_value: newValue,
        });
        if (response.data.success) {
          setPauseAutoAllocationId(response.data.data.id);
          setPauseAutoAllocation(newValue);
        } else {
          toast.error(response.data.message, { position: "top-center", theme: "light" });
        }
      }
    } catch (error) {
      console.log("Failed to update Pause Auto Allocation setting", error);
      toast.error("Failed to update Pause Auto Allocation setting", { position: "top-center", theme: "light" });
    } finally {
      setPauseAutoAllocationLoading(false);
    }
  };

  const handlePauseAutoAllocationToggle = (e) => {
    updatePauseAutoAllocation(e.target.checked);
  };

  useEffect(() => { allDriverList(); getTourCount({ ...params }); getPauseAutoAllocationSetting(); }, []);
  useEffect(() => { getToursData(params); }, [offset, params.tour_status]);

  return (
    <div className="space-y-4 pb-6">
      <ToastContainer position="top-center" pauseOnHover draggable />

      {/* ── Delete Modal ── */}
      <Modal isOpen={deleteModal} size="sm" centered>
        <ModalHeader toggle={handleDeleteModal} style={{ border: "none" }} />
        <ModalBody>
          <div className="flex flex-col items-center text-center px-2 pb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
              <RiDeleteBin5Line size={22} className="text-red-500" />
            </div>
            <p className="text-base font-semibold text-gray-800 mb-1">Delete Tour</p>
            <p className="text-sm text-gray-500 mb-4">Are you sure you want to delete this tour?</p>
            <div className="flex gap-2 w-full">
              <button onClick={() => handleDeleteModal()} style={{ width: "auto" }}
                className="flex-1 px-4 py-2 text-sm font-semibold border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => deleteSelectedTour(deleteId)} style={{ width: "auto" }}
                className="flex-1 px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {/* ── Revert Trips Modal ── */}
      <Modal isOpen={tourEditModal} size="sm" centered>
        <ModalHeader toggle={handleChangesTourEditModal} style={{ border: "none" }} />
        <ModalBody>
          <div className="flex flex-col items-center text-center px-2 pb-4">
            <p className="text-base font-semibold text-gray-800 mb-1">Revert Trips</p>
            <p className="text-sm text-gray-500 mb-4">Confirm reverting trips for this tour?</p>
            <div className="flex gap-2 w-full">
              <button onClick={() => setTourEditModal(false)} style={{ width: "auto" }}
                className="flex-1 px-4 py-2 text-sm font-semibold border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={updateTourDetails} style={{ width: "auto" }}
                className="flex-1 px-4 py-2 text-sm font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors">
                Confirm
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {/* ── Daily Drivers Report Modal ── */}
      <Modal isOpen={driver} centered>
        <ModalHeader toggle={driverReport} className="border-b border-gray-100 px-4 py-3">
          <span className="text-base font-semibold text-gray-800">Daily Drivers Report</span>
        </ModalHeader>
        <ModalBody className="p-4 space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-400">Choose Date</label>
            <DatePicker selected={reportDate} onChange={(date) => setReportDate(date)}
              placeholderText="Select date" dateFormat="yyyy-MM-dd"
              wrapperClassName="w-full"
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          {dateMessage && <p className="text-xs text-red-500">Please select a date.</p>}
          {noResult && <p className="text-xs text-gray-500">No records found.</p>}
          <div className="flex gap-2">
            <button onClick={getDailyDriversReport} style={{ width: "auto" }}
              className="flex-1 px-4 py-2 text-sm font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors">
              Generate
            </button>
            {downloadBtn && (
              <CSVLink data={result} filename="Daily Report" target="_blank" style={{ textDecoration: "none" }}>
                <button style={{ width: "auto" }}
                  className="px-4 py-2 text-sm font-semibold border border-brand-500 text-brand-500 rounded-xl hover:bg-brand-50 transition-colors">
                  Download CSV
                </button>
              </CSVLink>
            )}
          </div>
        </ModalBody>
      </Modal>

      {/* ── Export Tour Data Modal ── */}
      <Modal isOpen={tourdata} centered>
        <ModalHeader toggle={changeTourdata} className="border-b border-gray-100 px-4 py-3">
          <span className="text-base font-semibold text-gray-800">Export Tour Data</span>
        </ModalHeader>
        <ModalBody className="p-4 space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-400">Driver Name</label>
            <ReactSelect value={value} isClearable={isClearable} options={driversDetails}
              placeholder="Select Driver" handleSelectedOption={handleSelectedOption} isMulti={false} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Start Date</label>
              <DatePicker selected={tourdate} dateFormat="dd-MM-yyyy" onChange={(date) => setTourdate(date)}
                placeholderText="Start Date" wrapperClassName="w-full"
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">End Date</label>
              <DatePicker selected={tourdate1} dateFormat="dd-MM-yyyy" onChange={(date) => setTourdate1(date)}
                placeholderText="End Date" wrapperClassName="w-full"
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>
          {dateMessage && <p className="text-xs text-red-500">Please fill all fields.</p>}
          {errorMessage && <p className="text-xs text-red-500">No records found.</p>}
          <div className="flex gap-2">
            <button onClick={getExportTourReport} style={{ width: "auto" }}
              className="flex-1 px-4 py-2 text-sm font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors">
              Generate
            </button>
            {downloadBtn && (
              <CSVLink data={tourReport} filename="Tour Report" target="_blank" style={{ textDecoration: "none" }}>
                <button style={{ width: "auto" }}
                  className="px-4 py-2 text-sm font-semibold border border-brand-500 text-brand-500 rounded-xl hover:bg-brand-50 transition-colors">
                  Download CSV
                </button>
              </CSVLink>
            )}
          </div>
        </ModalBody>
      </Modal>

      {/* ── Tour Info Details Modal ── */}
      <Modal isOpen={toursDetail} scrollable size="lg">
        <ModalHeader toggle={() => setToursDetail(false)} className="border-b border-gray-100 px-4 py-3">
          <span className="text-base font-semibold text-gray-800">Tour Info · {tour_info_Date}</span>
        </ModalHeader>
        <ModalBody className="p-4">
          <div className="space-y-2">
            {Object.keys(tourinfo_driver_Details)
              .map((driverName) => ({ driverName, ...tourinfo_driver_Details[driverName] }))
              .sort((a, b) => b.count - a.count)
              .map(({ driverName, count, tourIds, mobile }, index) => (
                <div key={driverName} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-3 py-2.5">
                  <span className="text-xs text-gray-400 w-6 flex-shrink-0">{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{driverName}</p>
                    <p className="text-xs text-gray-400">{mobile}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-brand-500">{count} tours</p>
                    <p className="text-xs text-gray-400 max-w-[140px] truncate">{tourIds.join(", ")}</p>
                  </div>
                </div>
              ))}
          </div>
          <p className="mt-3 text-right text-sm font-semibold text-green-600">
            Total: {Object.values(tourinfo_driver_Details).reduce((acc, curr) => acc + curr.count, 0)} tours
          </p>
        </ModalBody>
      </Modal>

      {/* ── View Tour Modal ── */}
      <Modal isOpen={btn_view_modal} size="lg" scrollable>
        <ModalHeader toggle={closeModal} className="border-b border-gray-100 px-4 py-3">
          <span className="text-base font-semibold text-gray-800">Tour #{tourId}</span>
        </ModalHeader>
        <ModalBody className="p-4">
          {tourDetails.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-8">No trips in this tour.</p>
          ) : (
            <div className="space-y-3">
              {tourDetails.map((elem, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-3">
                  {/* Location header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start gap-2 min-w-0 flex-1">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${elem.transport_type === "pickup" ? "bg-green-500" : "bg-red-500"}`} />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-400 mb-0.5">
                          {elem.transport_type === "pickup" ? "Pickup" : "Drop"} · Trip #{(elem.tripIds || [elem.trip_id]).join(", #")}
                        </p>
                        <p className="text-sm font-semibold text-gray-800 leading-snug">{elem.location_address}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                      elem.status === "Completed" ? "bg-green-100 text-green-700" :
                      elem.status === "Reached" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>{elem.status || "Pending"}</span>
                  </div>
                  {/* Times */}
                  <div className="flex items-center gap-2 mb-3 ml-5 text-xs">
                    <span className="estimate-time text-gray-500">{elem.estimated_time}</span>
                    <span className="text-gray-300">→</span>
                    <span className={
                      ((!elem.completed_time && elem.estimated_time < moment().tz('Asia/Calcutta').format('YYYY-MM-DD HH:mm:ss')) ||
                        (elem.completed_time && elem.estimated_time < elem.completed_time))
                        ? "delay-time" : "estimated-time"
                    }>{elem.completed_time || "—"}</span>
                  </div>
                  {/* Action */}
                  <div className="flex items-center gap-2 ml-5">
                    <select value={tourStatus[index] || ""}
                      onChange={(e) => handleStatusChange(e.target.value, elem.transport_type, index)}
                      className="flex-1 px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500">
                      <option value="">Update status</option>
                      <option value="Reached">Reached</option>
                      <option value="Completed">Completed</option>
                    </select>
                    {buttonShow && selectedIndex === index && (
                      <button onClick={() => tourStatusUpdate(elem, index)} style={{ width: "auto" }}
                        className="px-3 py-1.5 text-sm font-semibold bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors">
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ModalBody>
      </Modal>

      {/* ── Top bar ── */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Tour count chip */}
        {org_tour > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 border border-brand-100 rounded-xl">
            <span className="text-sm font-bold text-brand-600">{org_tour}</span>
            <span className="text-xs text-brand-500">tours today</span>
          </div>
        )}
        {/* Pause Auto Allocation */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${pauseAutoAllocation ? "bg-red-50 border-red-200" : "bg-white border-gray-200"}`}>
          <label htmlFor="pauseAutoAllocationSwitch" className={`text-xs font-medium whitespace-nowrap ${pauseAutoAllocation ? "text-red-600" : "text-gray-500"}`}>
            Pause Auto Allocation
          </label>
          <input
            id="pauseAutoAllocationSwitch"
            type="checkbox"
            role="switch"
            checked={pauseAutoAllocation}
            disabled={pauseAutoAllocationLoading}
            onChange={handlePauseAutoAllocationToggle}
          />
        </div>
        {/* Search */}
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input type="text" onChange={(e) => setSearch(e.target.value)} placeholder="Search ID, name, mobile..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
        </div>
        {/* Mobile: Reports dropdown */}
        <div className="relative sm:hidden">
          <button onClick={() => setReportsOpen(o => !o)} style={{ width: "auto" }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-brand-500 text-white rounded-xl">
            Reports <BiChevronDown size={14} className={`transition-transform ${reportsOpen ? "rotate-180" : ""}`} />
          </button>
          {reportsOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-[180px] py-1">
              {[
                { label: "Daily Drivers Report", fn: driverReport },
                { label: "Export Tour Data", fn: changeTourdata },
                ...(org_tour !== 0 ? [{ label: "Tour Info Details", fn: getTourDetails }] : []),
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
        {/* Desktop: all report buttons */}
        <div className="hidden sm:flex gap-2">
          <button onClick={driverReport} style={{ width: "auto" }}
            className="px-3 py-2 text-xs font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors whitespace-nowrap">
            Daily Report
          </button>
          <button onClick={changeTourdata} style={{ width: "auto" }}
            className="px-3 py-2 text-xs font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors whitespace-nowrap">
            Export Data
          </button>
          {org_tour !== 0 && (
            <button onClick={getTourDetails} style={{ width: "auto" }}
              className="px-3 py-2 text-xs font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors whitespace-nowrap">
              Tour Info
            </button>
          )}
        </div>
      </div>

      {/* ── Filter panel ── */}
      <div className={`sm:block ${filtersOpen ? "block" : "hidden"}`}>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-card">
          {/* Mobile: 2-col grid */}
          <div className="grid grid-cols-2 gap-2 sm:hidden">
            <input type="text" placeholder="Tour ID" value={params.id} onChange={handleTourid}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <select value={params.status} onChange={handleTourStatus}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value="">Tour status</option>
              <option value="Assigned">Assigned</option>
              <option value="Accepted">Accepted</option>
              <option value="Completed">Completed</option>
            </select>
            <select value={params.booking_type}
              onChange={(e) => { const v = e.target.value.trim(); setParams(p => ({ ...p, booking_type: v })); localStorage.setItem("tour_booking_type", v); }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value="">Booking type</option>
              <option value="GoodMove">GoodMove</option>
              <option value="ONDC">ONDC</option>
            </select>
            <select value={params.tour_status} onChange={handleTourCurrentStatus}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value="">Current status</option>
              <option value="Accepted">Accepted</option>
              <option value="Cancelled By Manager">Cancelled By Manager</option>
              <option value="Completed drop">Completed drop</option>
              <option value="Completed pickup">Completed pickup</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Created">Created</option>
              <option value="Pending">Pending</option>
              <option value="Reached drop">Reached drop</option>
              <option value="Reached pickup">Reached pickup</option>
              <option value="Tour Completed">Tour Completed</option>
              <option value="Tour Created">Tour Created</option>
              <option value="Trip Created">Trip Created</option>
            </select>
            <DatePicker value={params.tour_date} onChange={filter_tour_date}
              dateFormat="yyyy-MM-dd" placeholderText="Tour Date"
              wrapperClassName="w-full"
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <div>
              <ReactSelect options={nameFilter} isMulti={false} handleSelectedOption={handleSelectedDriver}
                value={localStorage.getItem("tour_driverObj") ? JSON.parse(localStorage.getItem("tour_driverObj")) : ""}
                placeholder="Driver name" />
            </div>
            <div className="col-span-2">
              <ReactSelect options={mobileFilter} isMulti={false} handleSelectedOption={handleSelectedDrivermobile}
                value={localStorage.getItem("tour_driver_MobObj") ? JSON.parse(localStorage.getItem("tour_driver_MobObj")) : ""}
                placeholder="Mobile No" />
            </div>
            <button onClick={() => { getToursData({ ...params }); getTourCount({ ...params, driver_id: params.driver_id }); }}
              style={{ width: "auto" }}
              className="px-4 py-2 text-sm font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors">
              Apply
            </button>
            <button onClick={getClear} style={{ width: "auto", background: "white" }}
              className="px-4 py-2 text-sm font-semibold border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
              Clear
            </button>
          </div>

          {/* Desktop: labeled 4-col grid */}
          <div className="hidden sm:grid grid-cols-4 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Tour ID</label>
              <input type="text" placeholder="Tour ID" value={params.id} onChange={handleTourid}
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Tour Status</label>
              <select value={params.status} onChange={handleTourStatus}
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="">All statuses</option>
                <option value="Assigned">Assigned</option>
                <option value="Accepted">Accepted</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Booking Type</label>
              <select value={params.booking_type}
                onChange={(e) => { const v = e.target.value.trim(); setParams(p => ({ ...p, booking_type: v })); localStorage.setItem("tour_booking_type", v); }}
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="">All types</option>
                <option value="GoodMove">GoodMove</option>
                <option value="ONDC">ONDC</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Current Status</label>
              <select value={params.tour_status} onChange={handleTourCurrentStatus}
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="">All</option>
                <option value="Accepted">Accepted</option>
                <option value="Cancelled By Manager">Cancelled By Manager</option>
                <option value="Completed drop">Completed drop</option>
                <option value="Completed pickup">Completed pickup</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Created">Created</option>
                <option value="Pending">Pending</option>
                <option value="Reached drop">Reached drop</option>
                <option value="Reached pickup">Reached pickup</option>
                <option value="Tour Completed">Tour Completed</option>
                <option value="Tour Created">Tour Created</option>
                <option value="Trip Created">Trip Created</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Tour Date</label>
              <DatePicker value={params.tour_date} onChange={filter_tour_date}
                dateFormat="yyyy-MM-dd" placeholderText="Tour Date"
                wrapperClassName="w-full"
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Driver Name</label>
              <ReactSelect options={nameFilter} isMulti={false} handleSelectedOption={handleSelectedDriver}
                value={localStorage.getItem("tour_driverObj") ? JSON.parse(localStorage.getItem("tour_driverObj")) : ""}
                placeholder="Driver name" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Driver Mobile</label>
              <ReactSelect options={mobileFilter} isMulti={false} handleSelectedOption={handleSelectedDrivermobile}
                value={localStorage.getItem("tour_driver_MobObj") ? JSON.parse(localStorage.getItem("tour_driver_MobObj")) : ""}
                placeholder="Mobile No" />
            </div>
            <div className="flex items-end gap-2">
              <button onClick={() => { getToursData({ ...params }); getTourCount({ ...params, driver_id: params.driver_id }); }}
                style={{ width: "auto" }}
                className="flex-1 px-4 py-2 text-sm font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors">
                Filter
              </button>
              <button onClick={getClear} style={{ width: "auto", background: "white" }}
                className="flex-1 px-4 py-2 text-sm font-semibold border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Record count ── */}
      {count > 0 && !loading && (
        <p className="text-xs text-gray-400">{count} tours found</p>
      )}

      {/* ── Loading ── */}
      {loading && (
        <p className="text-center text-sm text-brand-500 py-8">Loading...</p>
      )}

      {/* ── Empty ── */}
      {count === 0 && !loading && (
        <p className="text-center text-sm text-gray-400 py-8">No records found.</p>
      )}

      {/* ── Cards ── */}
      {!loading && (
        <div className="space-y-2">
          {tourData
            .sort((a, b) => new Date(a.tour_date) - new Date(b.tour_date))
            .map((item, index) => {
              const isDummy = item.tour.tour_type === "Dummy" || item.tour.tour_type === "dummy";
              const isDelay = item.tour.is_delay;
              const isExpanded = expandedId === item.tour.id;

              return (
                <div key={item.tour.id}
                  className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${
                    isDummy ? "opacity-50 border-gray-100" :
                    isDelay ? "border-red-300" :
                    isExpanded ? "border-brand-300 shadow-card-md" :
                    "border-gray-200 hover:border-gray-300 hover:shadow-card"
                  }`}>

                  {/* Summary row */}
                  <div className="px-4 py-3 cursor-pointer select-none"
                    onClick={() => setExpandedId(isExpanded ? null : item.tour.id)}>

                    {/* ── MOBILE ── */}
                    <div className="sm:hidden">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                          <span className="text-sm font-bold text-gray-900">#{item.tour.id}</span>
                          {isDelay && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Delay</span>}
                          {isDummy && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Dummy</span>}
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor(item.tour.status)}`}>{item.tour.status}</span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={(e) => { e.stopPropagation(); changeButtonView(index); closeModal(); }}
                            style={{ width: "auto", background: "transparent" }}
                            className="px-2.5 py-1 text-xs font-semibold bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 transition-colors">
                            View
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleChangesTourEditModal(item.tour.id); }}
                            className="p-1.5 text-gray-400 hover:text-brand-500 rounded-lg transition-colors" style={{ width: "auto", background: "transparent" }}>
                            <BiEditAlt size={15} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteModal(item.tour.id); }}
                            className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors" style={{ width: "auto", background: "transparent" }}>
                            <RiDeleteBin5Line size={15} />
                          </button>
                          <BiChevronDown size={17} className={`text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-gray-800">{item.truck.driver_name}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-xs text-gray-500">{item.truck.driver_mobile}</span>
                        <span className="text-xs text-gray-400">· {item.tour.tour_date}</span>
                        {item.tour.tour_status && (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tourStatusColor(item.tour.tour_status)}`}>{item.tour.tour_status}</span>
                        )}
                      </div>
                    </div>

                    {/* ── DESKTOP ── */}
                    <div className="hidden sm:flex items-center gap-4">
                      {/* ID + badges */}
                      <div className="flex-shrink-0 w-24">
                        <p className="text-sm font-bold text-gray-900">#{item.tour.id}</p>
                        <div className="flex gap-1 mt-0.5 flex-wrap">
                          {isDelay && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">Delay</span>}
                          {isDummy && <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">Dummy</span>}
                        </div>
                      </div>
                      {/* Driver + date + statuses */}
                      <div className="flex-1 grid grid-cols-3 gap-4 min-w-0">
                        <div className="min-w-0">
                          <p className="text-xs text-gray-400 mb-0.5">Driver</p>
                          <p className="text-sm font-medium text-gray-800 truncate">{item.truck.driver_name}</p>
                          <p className="text-xs text-gray-500">{item.truck.driver_mobile}</p>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-400 mb-0.5">Tour Date</p>
                          <p className="text-sm font-medium text-gray-800">{item.tour.tour_date || "—"}</p>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-400 mb-0.5">Current Status</p>
                          {item.tour.tour_status
                            ? <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tourStatusColor(item.tour.tour_status)}`}>{item.tour.tour_status}</span>
                            : <span className="text-xs text-gray-400">—</span>}
                        </div>
                      </div>
                      {/* Right: status + actions */}
                      <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${statusColor(item.tour.status)}`}>{item.tour.status}</span>
                        <button onClick={(e) => { e.stopPropagation(); changeButtonView(index); closeModal(); }}
                          style={{ width: "auto" }}
                          className="px-3 py-1.5 text-xs font-semibold bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 transition-colors">
                          View
                        </button>
                        <div className="flex gap-0.5">
                          <button onClick={(e) => { e.stopPropagation(); handleChangesTourEditModal(item.tour.id); }}
                            className="p-1.5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-colors" style={{ width: "auto", background: "transparent" }}>
                            <BiEditAlt size={16} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteModal(item.tour.id); }}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" style={{ width: "auto", background: "transparent" }}>
                            <RiDeleteBin5Line size={16} />
                          </button>
                        </div>
                        <BiChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                      </div>
                    </div>
                  </div>

                  {/* ── Expanded: sequence preview ── */}
                  {isExpanded && item.sequenceData && item.sequenceData.length > 0 && (
                    <div className="border-t border-gray-100 bg-gray-50/40 px-4 py-3">
                      <p className="text-xs font-semibold text-gray-400 mb-2">Route sequence</p>
                      <div className="space-y-1.5">
                        {item.sequenceData.map((seq, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${seq.transport_type === "pickup" ? "bg-green-500" : "bg-red-500"}`} />
                            <div className="min-w-0">
                              <span className="text-xs text-gray-400 mr-1">{seq.transport_type === "pickup" ? "Pickup" : "Drop"}</span>
                              <span className="text-xs font-medium text-gray-700">{seq.location_address}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {/* ── Pagination ── */}
      {Boolean(tourData.length) && (
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
            <p className="text-xs text-gray-400">{count} total</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tours;
