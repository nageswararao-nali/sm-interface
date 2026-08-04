import React, { useState, useEffect } from "react";
import { Search } from "react-bootstrap-icons";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { BiEditAlt, BiChevronDown } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaArrowRight } from "react-icons/fa6";
import DatePicker from "react-datepicker";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import axios from "axios";
import moment from "moment";
import { baseUrl } from "../../api/apiConfig";
import TripEditModal from "../../components/editModals/TripEditModal";
import Pagination from "../../Pagination";
import "../../styles/Tours/trips.css";

const Trips = () => {
  const [tripData, setTripData] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [inputPageNumber, setInputPageNumber] = useState("");
  const [tripPayload, setTripPayload] = useState({
    offset: 0,
    limit: 10,
    status: localStorage.getItem("tripStatus") ? localStorage.getItem("tripStatus") : "",
    trip_id: localStorage.getItem("tripId") ? localStorage.getItem("tripId") : "",
    booking_id: localStorage.getItem("tripBookingId") ? localStorage.getItem("tripBookingId") : "",
    tour_id: localStorage.getItem("triptourId") ? localStorage.getItem("triptourId") : "",
    pickup_location: "",
    dropoff_location: "",
    pickup_time: localStorage.getItem("pickupDate") ? localStorage.getItem("pickupDate") : "",
    dropoff_time: localStorage.getItem("dropoffDate") ? localStorage.getItem("dropoffDate") : "",
    booking_type: localStorage.getItem("trip_booking_type") ? localStorage.getItem("trip_booking_type") : "",
  });
  const [totalCount, setTotalCount] = useState(0);
  const [tourModal, setTourModal] = useState(false);
  const [pickup_time, setPickup_time] = useState();
  const [dropoff_time, setDropoff_time] = useState();
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [doneTrips, setDoneTrips] = useState([]);
  const [driverList, setDriverList] = useState([]);
  const [driverSelect, setDriverSelect] = useState("");
  const [driverId, setDriverId] = useState(0);
  const [bookingid, setBookingid] = useState([]);
  const [tripStatus, setTripStatus] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [tripEditModal, setTripEditModal] = useState(false);
  const [editObj, setEditObj] = useState({});
  const [check, setCheck] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);
  const [loading, setLoading] = useState();
  const [expandedId, setExpandedId] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const statusColor = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "pending") return "bg-yellow-100 text-yellow-700";
    if (s.includes("completed pickup")) return "bg-blue-100 text-blue-700";
    if (s.includes("completed drop")) return "bg-green-100 text-green-700";
    if (s.includes("reached pickup")) return "bg-orange-100 text-orange-700";
    if (s.includes("reached drop")) return "bg-purple-100 text-purple-700";
    return "bg-gray-100 text-gray-600";
  };

  const handlePageNumber = (e) => {
    setInputPageNumber(e.target.value);
    if (e.target.value === "") setPageNumber(0);
  };

  const handleGoToPage = () => {
    const page = parseInt(inputPageNumber);
    if (!isNaN(page) && page >= 1 && page <= pageCount) {
      setPageNumber(page - 1);
    }
  };

  const handleTripEditModalChanges = (item) => {
    setTripEditModal(!tripEditModal);
    setEditObj(item);
  };

  const changetourModal = () => {
    setTourModal(!tourModal);
    setDriverSelect("");
    setBtnDisable(false);
    if (tourModal) setDoneTrips([]);
  };

  const showDataPerPage = 10;
  const offset = pageNumber * showDataPerPage;
  const pageCount = Math.ceil(totalCount / showDataPerPage);
  const handlePageChange = ({ selected }) => setPageNumber(selected);

  async function getTrips() {
    try {
      const request = await fetch(`${baseUrl}/booking/getTrips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...tripPayload, limit: showDataPerPage, offset }),
      });
      const response = await request.json();
      setTripData(response.data.trips);
      setTotalCount(response.data.count);
    } catch (error) {
      console.error("Trip Post request failed", error.message);
    }
  }

  const handleCheckBoxChange = (id, item) => {
    setBookingid([...new Set([...bookingid, item.booking_id])]);
    const selectedObj = tripData.find((obj) => obj.id === id);
    const x = { ...selectedObj, transType: "pickup", transport_type: "pickup", location_address: item.pickup_location };
    const y = { ...selectedObj, transType: "drop", transport_type: "drop", location_address: item.dropoff_location };
    if (selectedObj) {
      setSelectedObjects((prevObj) => {
        const isSelected = prevObj.some((obj) => obj.id === selectedObj.id);
        return isSelected ? prevObj.filter((obj) => obj.id !== selectedObj.id) : [...prevObj, x, y];
      });
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const sourceList = result.source.droppableId === "droppable-1" ? selectedObjects : doneTrips;
    const destinationList = result.destination.droppableId === "droppable-1" ? selectedObjects : doneTrips;
    const [removed] = sourceList.splice(result.source.index, 1);
    destinationList.splice(result.destination.index, 0, removed);
    setSelectedObjects([...selectedObjects]);
    setDoneTrips([...doneTrips]);
  };

  const handleSelectDriver = (selectedOption) => {
    setDriverSelect(selectedOption);
    setDriverId(selectedOption.value);
  };

  const getDriverList = async (url) => {
    try {
      const response = await axios.post(url, { limit: 100, offset: 0 });
      if (response.data.success) {
        const drivers = response.data.data.drivers
          .filter((e) => e.available_status === true)
          .map((e) => ({ label: e.name + "-" + e.mobile_number, value: e.user_id }));
        setDriverList(drivers);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTripStatus = (e) => {
    const value = e.target.value;
    setTripStatus(value);
    setTripPayload({ ...tripPayload, status: value });
    localStorage.setItem("tripStatus", value);
  };

  const handlePickupTime = (date) => {
    const pickupTime = moment(date).format("YYYY-MM-DD");
    setPickup_time(pickupTime);
    setTripPayload({ ...tripPayload, pickup_time: pickupTime });
    localStorage.setItem("pickupDate", pickupTime);
  };

  const handleDropoffTime = (date) => {
    const dropoffTime = moment(date).format("YYYY-MM-DD");
    setDropoff_time(dropoffTime);
    setTripPayload({ ...tripPayload, dropoff_time: dropoffTime });
    localStorage.setItem("dropoffDate", dropoffTime);
  };

  const handleClearFilter = () => {
    window.location.reload();
    localStorage.removeItem("tripId");
    localStorage.removeItem("tripBookingId");
    localStorage.removeItem("triptourId");
    localStorage.removeItem("pickupDate");
    localStorage.removeItem("dropoffDate");
    localStorage.removeItem("tripStatus");
    localStorage.removeItem("trip_booking_type");
  };

  const handleTriptoTour = async () => {
    setLoading(true);
    const doneTripsData = doneTrips.map((t, i) => { t["sequence_number"] = i + 1; return t; });
    const tourreqObj = {
      booking_id: bookingid,
      driver_id: driverId,
      engaged_consolidation_manager: "1",
      is_closed_tour: check,
      sequence: doneTripsData,
      tour_fare: 100,
    };
    try {
      const response = await axios.post(`${baseUrl}/tours/addTour`, tourreqObj);
      if (response.data.success === true) {
        setBookingid([]);
        setTourModal(false);
        getTrips();
        setDoneTrips([]);
        setLoading(false);
        alert("Your Tour added successfully.");
      }
    } catch (error) {
      console.error("Tour Api error", error);
    }
  };

  const handleDeleteModal = (id) => {
    setDeleteModal(!deleteModal);
    setDeleteId(id);
  };

  const deleteSelectedTrip = async (tripId) => {
    try {
      const request = await axios.post(`${baseUrl}/booking/deleteTrip/${tripId}`);
      if (request.data.success) {
        getTrips();
        alert(request.data.message);
        setDeleteModal(false);
      }
    } catch (error) {
      alert("Failed to Delete!");
      console.error(error.message);
    }
  };

  const handleSaveEdit = (editedData) => console.log(editedData);

  useEffect(() => { getDriverList(`${baseUrl}/driver/getDrivers`); }, []);
  useEffect(() => { getTrips(); }, [offset, pageNumber]);

  return (
    <div className="space-y-4 pb-6">

      {/* ── Create Tour Modal ── */}
      <Modal isOpen={tourModal} size="xl" scrollable>
        <ModalHeader toggle={changetourModal} className="border-b border-gray-100 px-4 py-3">
          <span className="text-base font-semibold text-gray-800">Create Tour</span>
        </ModalHeader>
        <ModalBody className="p-4">
          <DragDropContext onDragEnd={handleDragEnd}>
            {/* Stacks vertically on mobile, 3 columns on desktop */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">

              {/* Panel 1 — Unassigned Trips (drag from here) */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-700">Unassigned Trips</p>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{selectedObjects.length}</span>
                </div>
                <div className="border border-dashed border-gray-300 rounded-xl bg-gray-50 p-2" style={{ minHeight: "120px", maxHeight: "320px", overflowY: "auto" }}>
                  <Droppable droppableId="droppable-1" direction="vertical">
                    {(provided) => (
                      <ul className="space-y-2 list-none p-0 m-0" ref={provided.innerRef} {...provided.droppableProps}>
                        {selectedObjects.map((item, index) => (
                          <Draggable key={item.trip_id.toString() + index} draggableId={item.trip_id + index} index={index}>
                            {(provided) => (
                              <li ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}
                                className="bg-white border border-green-100 rounded-xl px-3 py-2 shadow-sm cursor-grab active:cursor-grabbing">
                                <p className="text-xs font-semibold text-green-700 mb-1">Bk #{item.booking_id} · {item.transType}</p>
                                <div className="flex items-start gap-1.5">
                                  <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-0.5 ${item.transType === "pickup" ? "bg-green-500" : "bg-red-500"}`} />
                                  <p className="text-xs text-gray-700 leading-snug">
                                    {item.transType === "pickup" ? item.pickup_location : item.dropoff_location}
                                  </p>
                                </div>
                              </li>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {selectedObjects.length === 0 && (
                          <p className="text-xs text-gray-400 text-center py-6">No trips selected</p>
                        )}
                      </ul>
                    )}
                  </Droppable>
                </div>
              </div>

              {/* Panel 2 — Tour Sequence (drag to here) */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-700">Tour Sequence</p>
                  <span className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full">{doneTrips.length}</span>
                </div>
                <div className="border border-dashed border-brand-300 rounded-xl bg-brand-50/30 p-2" style={{ minHeight: "120px", maxHeight: "320px", overflowY: "auto" }}>
                  <Droppable droppableId="droppable-2" direction="vertical">
                    {(provided) => (
                      <ul className="space-y-2 list-none p-0 m-0" ref={provided.innerRef} {...provided.droppableProps}>
                        {doneTrips.map((item, index) => (
                          <Draggable key={item?.id.toString() + index} draggableId={item.id.toString() + index} index={index}>
                            {(provided) => (
                              <li ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}
                                className="bg-white border border-brand-100 rounded-xl px-3 py-2 shadow-sm cursor-grab active:cursor-grabbing">
                                <p className="text-xs font-semibold text-brand-600 mb-1">#{index + 1} · Bk #{item.booking_id} · {item.transType}</p>
                                <div className="flex items-start gap-1.5">
                                  <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-0.5 ${item.transType === "pickup" ? "bg-green-500" : "bg-red-500"}`} />
                                  <p className="text-xs text-gray-700 leading-snug">
                                    {item.transType === "pickup" ? item.pickup_location : item.dropoff_location}
                                  </p>
                                </div>
                              </li>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {doneTrips.length === 0 && (
                          <p className="text-xs text-gray-400 text-center py-6">Drag trips here to sequence</p>
                        )}
                      </ul>
                    )}
                  </Droppable>
                </div>
              </div>

              {/* Panel 3 — Driver + Submit */}
              <div className="sm:w-52 flex-shrink-0">
                <p className="text-sm font-semibold text-gray-700 mb-2">Choose Driver</p>
                <Select
                  options={driverList}
                  value={driverSelect}
                  onChange={handleSelectDriver}
                  isSearchable
                  placeholder="Search driver..."
                  noOptionsMessage={() => "No drivers"}
                />
                {/* <label className="flex items-center gap-2 mt-4 text-sm text-gray-600 cursor-pointer select-none">
                  <input type="checkbox" onClick={(e) => setCheck(e.target.checked)} className="w-4 h-4 cursor-pointer rounded" />
                  Closed Tour
                </label> */}
                <button onClick={handleTriptoTour} style={{width:"auto"}}
                  className="mt-4 w-full py-2.5 text-sm font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors">
                  {loading
                    ? <div className="loading-addTour-spinner-container"><div className="loading-addTour-spinner"></div></div>
                    : "Submit Tour"}
                </button>
              </div>

            </div>
          </DragDropContext>
        </ModalBody>
      </Modal>

      {/* ── Delete Modal ── */}
      <Modal isOpen={deleteModal} size="sm" centered>
        <ModalHeader toggle={handleDeleteModal} style={{ border: "none" }} />
        <ModalBody>
          <div className="flex flex-col items-center text-center px-2 pb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
              <RiDeleteBin5Line size={22} className="text-red-500" />
            </div>
            <p className="text-base font-semibold text-gray-800 mb-1">Delete Trip</p>
            <p className="text-sm text-gray-500 mb-4">Are you sure you want to delete this trip?</p>
            <div className="flex gap-2 w-full">
              <button onClick={() => handleDeleteModal()} style={{width:"auto"}}
                className="flex-1 px-4 py-2 text-sm font-semibold border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => deleteSelectedTrip(deleteId)} style={{width:"auto"}}
                className="flex-1 px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {/* ── Edit Modal ── */}
      <TripEditModal
        tripEditModal={tripEditModal}
        handleTripEditModalChanges={handleTripEditModalChanges}
        editObj={editObj}
        onSave={handleSaveEdit}
      />

      {/* ── Top bar ── */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input type="text" placeholder="Search trips..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
        </div>
        <button onClick={() => setFiltersOpen(o => !o)}
          className="sm:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-gray-200 text-gray-600 rounded-xl"
          style={{width:"auto", background:"white"}}>
          Filters <BiChevronDown size={14} className={`transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
        </button>
        <button onClick={changetourModal} style={{width:"auto"}}
          className="px-4 py-2 text-sm font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors whitespace-nowrap">
          + Create Tour
        </button>
      </div>

      {/* ── Filter panel ── */}
      <div className={`sm:block ${filtersOpen ? "block" : "hidden"}`}>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-card">
          {/* Mobile: 2-col grid */}
          <div className="grid grid-cols-2 gap-2 sm:hidden">
            <input type="text" placeholder="Trip ID" value={tripPayload.trip_id}
              onChange={(e) => { setTripPayload({ ...tripPayload, trip_id: e.target.value }); localStorage.setItem("tripId", e.target.value); }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <input type="text" placeholder="Booking ID" value={tripPayload.booking_id}
              onChange={(e) => { setTripPayload({ ...tripPayload, booking_id: e.target.value }); localStorage.setItem("tripBookingId", e.target.value); }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <input type="text" placeholder="Tour ID" value={tripPayload.tour_id}
              onChange={(e) => { setTripPayload({ ...tripPayload, tour_id: e.target.value }); localStorage.setItem("triptourId", e.target.value); }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <select value={tripPayload.booking_type}
              onChange={(e) => { const v = e.target.value.trim(); setTripPayload(p => ({ ...p, booking_type: v })); localStorage.setItem("trip_booking_type", v); }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value="">Booking Type</option>
              <option value="GoodMove">GoodMove</option>
              <option value="ONDC">ONDC</option>
            </select>
            <select value={tripPayload.status} onChange={handleTripStatus}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value="">Choose status</option>
              <option value="Pending">Pending</option>
              <option value="Reached drop">Reached drop</option>
              <option value="Completed pickup">Completed pickup</option>
              <option value="Completed drop">Completed drop</option>
              <option value="Reached pickup">Reached pickup</option>
            </select>
            <DatePicker value={tripPayload.pickup_time} onChange={handlePickupTime}
              dateFormat="yyyy-MM-dd" placeholderText="Pickup Date"
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 w-full" />
            <DatePicker value={tripPayload.dropoff_time} onChange={handleDropoffTime}
              dateFormat="yyyy-MM-dd" placeholderText="Dropoff Date"
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 w-full" />
            <button onClick={() => getTrips()} style={{width:"auto"}}
              className="px-4 py-2 text-sm font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors">
              Apply
            </button>
            <button onClick={handleClearFilter} style={{width:"auto", background:"white"}}
              className="px-4 py-2 text-sm font-semibold border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
              Clear
            </button>
          </div>
          {/* Desktop: labeled grid */}
          <div className="hidden sm:grid grid-cols-4 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Trip ID</label>
              <input type="text" placeholder="Trip ID" value={tripPayload.trip_id}
                onChange={(e) => { setTripPayload({ ...tripPayload, trip_id: e.target.value }); localStorage.setItem("tripId", e.target.value); }}
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Booking ID</label>
              <input type="text" placeholder="Booking ID" value={tripPayload.booking_id}
                onChange={(e) => { setTripPayload({ ...tripPayload, booking_id: e.target.value }); localStorage.setItem("tripBookingId", e.target.value); }}
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Tour ID</label>
              <input type="text" placeholder="Tour ID" value={tripPayload.tour_id}
                onChange={(e) => { setTripPayload({ ...tripPayload, tour_id: e.target.value }); localStorage.setItem("triptourId", e.target.value); }}
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Booking Type</label>
              <select value={tripPayload.booking_type}
                onChange={(e) => { const v = e.target.value.trim(); setTripPayload(p => ({ ...p, booking_type: v })); localStorage.setItem("trip_booking_type", v); }}
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="">All types</option>
                <option value="GoodMove">GoodMove</option>
                <option value="ONDC">ONDC</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Pickup Date</label>
              <DatePicker value={tripPayload.pickup_time} onChange={handlePickupTime}
                dateFormat="yyyy-MM-dd" placeholderText="Pickup Date"
                wrapperClassName="w-full"
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Dropoff Date</label>
              <DatePicker value={tripPayload.dropoff_time} onChange={handleDropoffTime}
                dateFormat="yyyy-MM-dd" placeholderText="Dropoff Date"
                wrapperClassName="w-full"
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Status</label>
              <select value={tripPayload.status} onChange={handleTripStatus}
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Reached drop">Reached drop</option>
                <option value="Completed pickup">Completed pickup</option>
                <option value="Completed drop">Completed drop</option>
                <option value="Reached pickup">Reached pickup</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button onClick={() => getTrips()} style={{width:"auto"}}
                className="flex-1 px-4 py-2 text-sm font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors">
                Filter
              </button>
              <button onClick={handleClearFilter} style={{width:"auto", background:"white"}}
                className="flex-1 px-4 py-2 text-sm font-semibold border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Trip count ── */}
      {totalCount > 0 && (
        <p className="text-xs text-gray-400">{totalCount} trips found</p>
      )}

      {/* ── Cards ── */}
      <div className="space-y-2">
        {tripData.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div key={item.id}
              className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${
                isExpanded ? "border-brand-300 shadow-card-md" : "border-gray-200 hover:border-gray-300 hover:shadow-card"
              }`}>

              {/* Summary row */}
              <div className="px-4 py-3 cursor-pointer select-none" onClick={() => setExpandedId(isExpanded ? null : item.id)}>

                {/* ── MOBILE ── */}
                <div className="sm:hidden">
                  {/* Row 1: IDs + status + actions */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                      <span className="text-sm font-bold text-gray-900">#{item.trip_id}</span>
                      <span className="text-xs text-gray-400">· Bk #{item.booking_id}</span>
                      {item.tour_id && <span className="text-xs text-gray-400">· Tour #{item.tour_id}</span>}
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor(item.status)}`}>{item.status}</span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!item.tour_id && (
                        <input type="checkbox"
                          checked={selectedObjects.some(o => o.id === item.id)}
                          onChange={() => handleCheckBoxChange(item.id, item)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 cursor-pointer" />
                      )}
                      <button onClick={(e) => { e.stopPropagation(); handleTripEditModalChanges(item); }}
                        className="p-1.5 text-gray-400 hover:text-brand-500 rounded-lg transition-colors" style={{width:"auto",background:"transparent"}}>
                        <BiEditAlt size={15} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteModal(item.trip_id); }}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors" style={{width:"auto",background:"transparent"}}>
                        <RiDeleteBin5Line size={15} />
                      </button>
                      <BiChevronDown size={17} className={`text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </div>
                  {/* Pickup — full address on mobile */}
                  <div className="flex items-start gap-1.5 mb-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-0.5"></span>
                    <p className="text-xs font-semibold text-gray-800 leading-snug">{item.pickup_location || "—"}</p>
                  </div>
                  {/* Drop — full address on mobile */}
                  <div className="flex items-start gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-0.5"></span>
                    <p className="text-xs font-semibold text-gray-800 leading-snug">{item.dropoff_location || "—"}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{moment(item.pickup_time).format("MMM D, YYYY HH:mm")}</p>
                </div>

                {/* ── DESKTOP ── */}
                <div className="hidden sm:flex items-center gap-4">
                  {/* Checkbox */}
                  <div className="w-5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    {!item.tour_id && (
                      <input type="checkbox"
                        checked={selectedObjects.some(o => o.id === item.id)}
                        onChange={() => handleCheckBoxChange(item.id, item)}
                        className="w-4 h-4 cursor-pointer" />
                    )}
                  </div>
                  {/* IDs */}
                  <div className="flex-shrink-0 w-28">
                    <p className="text-sm font-bold text-gray-900">#{item.trip_id}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Bk #{item.booking_id}</p>
                    {item.tour_id && <p className="text-xs text-gray-400">Tour #{item.tour_id}</p>}
                  </div>
                  {/* Pickup + Drop columns — truncated with title on desktop */}
                  <div className="flex-1 grid grid-cols-2 gap-4 min-w-0">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 mb-1">Pickup</p>
                      <div className="flex items-start gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1"></span>
                        <p className="text-sm font-semibold text-gray-800 truncate" title={item.pickup_location}>{item.pickup_location || "—"}</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 ml-3.5">{moment(item.pickup_time).format("MMM D, HH:mm")}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 mb-1">Dropoff</p>
                      <div className="flex items-start gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1"></span>
                        <p className="text-sm font-semibold text-gray-800 truncate" title={item.dropoff_location}>{item.dropoff_location || "—"}</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 ml-3.5">{item.dropoff_time || "—"}</p>
                    </div>
                  </div>
                  {/* Right: status + actions + chevron */}
                  <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${statusColor(item.status)}`}>{item.status}</span>
                    <div className="flex gap-0.5">
                      <button onClick={(e) => { e.stopPropagation(); handleTripEditModalChanges(item); }}
                        className="p-1.5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-colors" style={{width:"auto",background:"transparent"}}>
                        <BiEditAlt size={16} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteModal(item.trip_id); }}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" style={{width:"auto",background:"transparent"}}>
                        <RiDeleteBin5Line size={16} />
                      </button>
                    </div>
                    <BiChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                </div>
              </div>

              {/* ── Expanded detail panel ── */}
              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50/40 px-4 py-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Trip ID</p>
                      <p className="font-medium text-gray-800">{item.trip_id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Booking ID</p>
                      <p className="font-medium text-gray-800">{item.booking_id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Tour ID</p>
                      <p className="font-medium text-gray-800">{item.tour_id || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Status</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor(item.status)}`}>{item.status}</span>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-400 mb-1">Pickup Location</p>
                      <div className="flex items-start gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1"></span>
                        <p className="text-sm font-medium text-gray-800">{item.pickup_location || "—"}</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 ml-3.5">{moment(item.pickup_time).format("MMM D, YYYY HH:mm")}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-400 mb-1">Dropoff Location</p>
                      <div className="flex items-start gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1"></span>
                        <p className="text-sm font-medium text-gray-800">{item.dropoff_location || "—"}</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 ml-3.5">{item.dropoff_time || "—"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Pagination ── */}
      {Boolean(tripData.length) && (
        <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-card flex flex-col gap-2">
          <div className="flex justify-center overflow-x-auto">
            <Pagination pageNumber={pageNumber} handlePageChange={handlePageChange} pageCount={pageCount} />
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <input type="text" onChange={handlePageNumber} placeholder="Page #"
                className="w-16 px-2.5 py-1.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500" />
              <button onClick={handleGoToPage} style={{width:"auto"}}
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

export default Trips;
