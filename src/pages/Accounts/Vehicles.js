import React, { useState, useEffect } from "react";
import { Search } from "react-bootstrap-icons";
import { BiEditAlt } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Table, Modal, ModalHeader, ModalBody } from "reactstrap";
import "../../styles/Accounts/vehicle.css";
import { MdAdd } from "react-icons/md";
import SearchableDropdown from "../../searchableDropdown";
import axios from "axios";
import Pagination from "../../Pagination";
import ReactSelect from "../../ReactSelect";
import { baseUrl } from "../../api/apiConfig";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";

const Vehicles = () => {
  const myName = useSelector((state) => state.initial.myName);
  const [veh_data, setVeh_data] = useState([]);
  const [ownersData, setOwnersData] = useState([]);
  const [add_vehicle, setAdd_vehicle] = useState(false);
  const [add_new_veh, setAdd_new_veh] = useState(null);
  const [search, setSearch] = useState("");
  const [filtervalue, setFilterValue] = useState("all");
  const [pageNumber, setPageNumber] = useState(0);

  // add form
  const [vehno, setVehno] = useState(0);
  // Only 4-wheeler trucks are used in practice, so vehicle type is no longer a form field.
  const veh_type = "4wheeler";
  const [veh_Capacity, setVeh_Capacity] = useState(0);
  const [status, setStatus] = useState("");
  const [ownerId, setOwnerId] = useState(null);
  const [vehEditModal, setVehEditModal] = useState(false);
  const [editObj, setEditObj] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [total, setTotal] = useState(null);
  const [pagedataperPage, setPagedataperPage] = useState(10);
  const [paginationShow, setPaginationShow] = useState(true);
  const[searchResult_Text,setSearchResult_Text]=useState(false)
  const[searchResult_Count,setSearchResult_Count]=useState(null)

  // Delete
  const handleDeleteModalClose = () => {
    setDeleteModal(false);
  };
  const handleVehiclesDelete = (id) => {
    setDeleteId(id);
  };
  const deleteSelectedVehiclesFromList = async () => {
    try {
      const deleteRequest = await axios.post(
        `${baseUrl}/trucks/deleteTruck/${deleteId}`
      );
      if (deleteRequest.data.success) {
        alert("Deleted Successfully.");
        getVehiclesData();
        handleDeleteModalClose();
      }
    } catch (error) {
      alert("Failed to Deleted ?");
    }
  };

  const handleVehEditModal = (elem) => {
    setVehEditModal(true);
    setEditObj(elem);
  };
  const VehEditModalClose = () => {
    setVehEditModal(false);
  };

  const changeAddVehicle = () => {
    setAdd_vehicle(!add_vehicle);
    setOwnerId("");
  };
  // pagination....
  // let showDataPerPage = 20;
  let showDataPerPage = pagedataperPage;
  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
  };
  // showDataPerPage
  let pageCount = Math.ceil(total / pagedataperPage);
  let pagesVisited = pageNumber * pagedataperPage;
  let offset = pageNumber * pagedataperPage;

  // Open/closed Filter fn..
  const Data = veh_data.filter((elem) => {
    if (filtervalue === "open") {
      return elem.opened_closed.toLowerCase() === "open";
    } else if (filtervalue === "closed") {
      return elem.opened_closed.toLowerCase() === "closed";
    } else {
      return elem;
    }
  });

  // Serach fn....

  const handleSearch = (e) => {
    let value=e.target.value.trim()
    setSearch(value);
    if(value.length != 0){
      setPageNumber(0)
      getAllTruckersDetails()
    }
    if(value.length == 0){
      getClearData()
      setPageNumber(0)
    }
    const searchValueArr=veh_data.filter(
                (item) =>
                  item?.truck_owner_id
                    ?.toString()
                    .includes(search?.toLowerCase()) ||
                  item?.registration_number
                  ?.toString().toLowerCase()
                    .includes(search?.toLowerCase()) ||
                  item?.capacity.toString().includes(search?.toLowerCase()))
      if(searchValueArr.length){
        setSearchResult_Count(searchValueArr.length)
        setSearchResult_Text(true)
      }


  };

  const getVehicleStatus = (event) => {
    setFilterValue(event.target.value);
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    const addVehiclePayload = {
      truck_owner_id: ownerId,
      registration_number: vehno,
      vehicle_type: veh_type,
      capacity: veh_Capacity,
      capacity_unit: "TON",
      opened_closed: status,
    };
    try {
      const response = await axios.post(
        `${baseUrl}/trucks/addTruck`,
        addVehiclePayload
      );
      if (response.data.success == true) {
        alert("Added successfully");
        setAdd_vehicle(false);
        getVehiclesData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectedOption = (selected) => {
    setOwnerId(selected.value);
  };

  const getOwnersDetails = async () => {
    const request = await axios.post(`${baseUrl}/driver/getOwners`, {
      limit: 200,
      offset: 0,
    });
    if (request.data.success == true) {
      const data = request.data.data.owners;
      const ownersData = data.map((item) => ({
        label: `${item.name}-${item.mobile}`,
        value: item.id,
      }));
      setOwnersData(ownersData);
    }
  };

  // Api calling
  const url = `${baseUrl}/trucks/getTrucks`;

  async function getVehiclesData() {
    const response = await axios.post(url, {
      offset: offset,
      limit: pagedataperPage,
    });
    setVeh_data(response.data.data.trucks);
    setTotal(response.data.data.count);
  }

  // getAllTrckersDetails.....

  const getAllTruckersDetails = async () => {
    const response = await axios.post(`${baseUrl}/trucks/getTrucks`, {
      limit: total,
      offset: offset,
    });
    setVeh_data(response.data.data.trucks);
    setPaginationShow(false);
  };

  // Clear Button...
  const getClearData=()=>{
    getVehiclesData()
    setPaginationShow(true);
    setSearch("")
    setSearchResult_Text(false)
  }


  useEffect(() => {
    getOwnersDetails();
  }, []);
  useEffect(() => {
    getVehiclesData();
  }, [offset, pagedataperPage]);
  // for Edit purpose...
  useEffect(() => {
    setEditedData(editObj);
  }, [editObj]);

  const saveChanges = async (e) => {
    e.preventDefault();
    const payload = {
      truck_owner_id: editObj?.truck_owner_id,
      registration_number: editedData.registration_number,
      vehicle_type: editedData.vehicle_type,
      capacity: editedData.capacity,
      capacity_unit: "TON",
      opened_closed: editedData.opened_closed,
    };
    try {
      const request = await axios.post(
        `${baseUrl}/trucks/updateTruck/${editObj.id}`,
        payload
      );
      if (request.data.success) {
        alert("Updates Successfully.");
        getVehiclesData();
        setVehEditModal(false);
      }
    } catch (error) {
      console.error(error);
      alert(" Failed Update ?");
    }
  };

  const cancelChanges = () => {
    setVehEditModal(false);
  };


  return (
    <div style={{ padding: "10px" }} id="vehicles">
      <section className="searchBar-section">
        <div className="session-Top-Input" style={{ position: "relative" }}>
        <MdClose size={18} style={{position:"absolute",left:"420px",top:"10px",cursor:"pointer"}} onClick={()=>{
          getClearData()
          setPageNumber(0)
        }}/>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search by owner id,Reg No or capacity"
          />
        </div>
        <div className="vehicle-btns" style={{ display: "flex" }}>
          <button className="btn-big" onClick={changeAddVehicle}>
            <MdAdd size={23} color="white" />
            Add Vehicle
          </button>
        </div>
      </section>
      {
        // ( ) ? <span>no Result..</span>:""
      }

      <section className="vehicle-modal">
        <Modal isOpen={add_vehicle} size="" id="add-vehicles-modal-mobile">
          <ModalHeader
            toggle={changeAddVehicle}
            style={{ border: "none" }}
            className="addVeh-header"
          >
            <p>Add New - Vehicle Details :</p>
          </ModalHeader>
          <ModalBody>
            <div className="addVeh-form">
              <form className="form1" onSubmit={handleAddVehicle}>
                <label htmlFor="regNo">Vehicle reg no :</label>
                <input
                  type="text"
                  placeholder="Vehicle Reg No"
                  onChange={(e) => setVehno(e.target.value)}
                />
                <label htmlFor="veh_Capacity">Capacity of Vehicle :</label>
                <input
                  type="text"
                  onChange={(e) => setVeh_Capacity(e.target.value)}
                  placeholder="Enter Capacity Vehicle"
                />
                <label htmlFor="status">Status :</label>
                <input
                  type="text"
                  onChange={(e) => setStatus(e.target.value)}
                  placeholder="Enter Open / Closed"
                />
                <div className="owner">
                  <label htmlFor="ownerId">Owner Id :</label>
                  <input
                    type="text"
                    value={ownerId}
                    placeholder="Enter owner Id"
                  />
                </div>
                {/* <button type='submit' className='btn-small'>Create Vehicle</button> */}
                <div style={{ display: "flex", gap: "15px" }}>
                  <button type="submit" className="btn-small">
                    Create Vehicle
                  </button>
                  <button type="reset" className="btn-small">
                    Clear
                  </button>
                </div>
              </form>
              <div className="form2">
                <label htmlFor="owner_name">Owner Name :</label> &nbsp;
                <div style={{}}>
                  <ReactSelect
                    options={ownersData}
                    isMulti={false}
                    placeholder="Select or Search owner name"
                    handleSelectedOption={handleSelectedOption}
                  />
                </div>
                {/* <SearchableDropdown state={add_new_veh} setState={setAdd_new_veh} data={data}/> */}
              </div>
            </div>
          </ModalBody>
        </Modal>
      </section>

      {/* EDIT MODAL .... */}

      <section>
        <Modal isOpen={vehEditModal} id="vehicleEditModal">
          <ModalHeader toggle={VehEditModalClose}>
            <span>Vehicles Edit :</span>
          </ModalHeader>
          <ModalBody className="vehicleEditModal-body">
            <form action="#" onSubmit={saveChanges} id="vehicleEditModalBody">
              <label htmlFor="">Vehicle Number :</label>
              <input
                type="text"
                value={editedData?.registration_number}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    registration_number: e.target.value,
                  })
                }
              />

              <label htmlFor="">Vehicle Type :</label>
              <select
                name=""
                id=""
                value={editedData?.vehicle_type}
                onChange={(e) =>
                  setEditedData({ ...editedData, vehicle_type: e.target.value })
                }
              >
                <option value="Tata ace">Tata ace</option>
                <option value="Dost">Dost</option>
                <option value="2W">2W</option>
              </select>

              <label htmlFor="">Capacity :</label>
              <input
                type="text"
                value={editedData?.capacity}
                onChange={(e) =>
                  setEditedData({ ...editedData, capacity: e.target.value })
                }
              />

              <label htmlFor="">Open/Closed :</label>
              <select
                name=""
                id=""
                value={editedData?.opened_closed}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    opened_closed: e.target.value,
                  })
                }
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>

              <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                <button type="submit" className="btn-small">
                  SAVE
                </button>
                <button
                  type="button"
                  className="btn-small"
                  onClick={cancelChanges}
                >
                  CANCEL
                </button>
              </div>
            </form>
          </ModalBody>
        </Modal>
      </section>
      {/* Delete Modal */}
      <section id="DeleteModal">
        <Modal
          isOpen={deleteModal}
          size="sm"
          style={{ marginTop: "5%" }}
          className="delete-modal-mobile"
        >
          <ModalHeader
            toggle={handleDeleteModalClose}
            style={{ border: "none" }}
          ></ModalHeader>
          <ModalBody>
            <div id="deleteModalBody">
              <p>Are you sure you want to delete?</p>
              <div className="confirm-cancel-button">
                <button onClick={deleteSelectedVehiclesFromList}>
                  Confirm
                </button>
                <button onClick={handleDeleteModalClose}>Cancel</button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </section>

      <section style={{ marginTop: "50px" }}>
        <Table style={{ maxWidth: "900px" }}>
          <thead>
            <tr style={{ fontSize: "12px", borderBottom: "1px solid black" }}>
              <th>EDIT</th>
              <th>DELETE</th>
              <th>ID</th>
              <th>TRUCK OWNER ID</th>
              <th>REGISTRATION NUMBER</th>
              <th>CAPACITY</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {veh_data
              .filter(
                (item) =>
                  item?.truck_owner_id
                    ?.toString()
                    .includes(search?.toLowerCase()) ||
                  item?.registration_number
                  ?.toString().toLowerCase()
                    .includes(search?.toLowerCase()) ||
                  item?.capacity.toString().includes(search?.toLowerCase())
              )

              .map((elem) => {
                return (
                  <tr
                    key={elem.id}
                    style={{ borderBottom: "1px solid lightgrey" }}
                  >
                    <td>
                      <BiEditAlt
                        size={16}
                        onClick={() => handleVehEditModal(elem)}
                      />
                    </td>
                    <td>
                      <RiDeleteBin5Line
                        size={16}
                        className="deleteIcon"
                        onClick={() => {
                          handleVehiclesDelete(elem.id);
                          setDeleteModal(true);
                        }}
                      />
                    </td>
                    <td>{elem.id}</td>
                    <td>{elem.truck_owner_id}</td>
                    <td>{elem.registration_number}</td>
                    <td>{elem.capacity}</td>
                    <td>{elem.opened_closed}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </section>

      <section
        id="VehiclesPagination"
        style={{
          position: "relative",
          marginBottom: "30px",
          marginTop: "30px",
          left: "-100px",
        }}
      >
        {paginationShow && (
          <Pagination
            pageCount={pageCount}
            handlePageChange={handlePageChange}
            pageNumber={pageNumber}
            paginationcontrol="pagenoCounts"
          />
        )}
      </section>
    </div>
  );
};

export default Vehicles;

{/* <button className="btn-big" onClick={getAllTruckersDetails}>
            Select All
          </button>
          <button
            className="btn-big"
            onClick={getClearData}
            style={{ marginLeft: "-20px" }}
          >
            Clear
          </button> */}
