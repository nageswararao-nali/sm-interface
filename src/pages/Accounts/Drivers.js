import React,{useState,useEffect,useCallback} from "react";
import { ClockHistory, Search} from "react-bootstrap-icons";
import{BiEditAlt} from "react-icons/bi"
import {RiDeleteBin5Line} from "react-icons/ri";
import {LuFilter} from "react-icons/lu"
import "../../styles/Accounts/Drivers.css";
import{Table} from "reactstrap";
import{Modal,ModalHeader,ModalBody,ModalFooter} from "reactstrap";
import {MdAdd} from "react-icons/md";
import SearchableDropdown from "../../searchableDropdown"
import axios from "axios";
import ReactPaginate from "react-paginate";
import Pagination from "../../Pagination";
import ReactSelect from "../../ReactSelect";
import Switch from "react-switch"
import { baseUrl } from "../../api/apiConfig";
import DriversCount from "../counts/DriversCount";

import {fetchData }from "../../store/initial/action"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { MdClose } from "react-icons/md";


const Drivers = () => {
  const dispatch=useDispatch()
  const myName=useSelector(state=>state.initial.myName)
  const [driver_data,setDriver_data]=useState([])
  const[ownersList,setOwnersList]=useState([])
  const[ownersListEdit,setOwnersListEdit]=useState([])
  const[trucks,setTrucks]=useState([])
  const[vehicles,setVehicles]=useState([])
  const[addOwner,setAddOwner]=useState({
    name:"",
    mobile_number: "",
    license_number: "",
    truck_owner_id: "",
    truck_id:"",
    scheme_name:""

  })
  const [add_driver,setAdd_driver]=useState(false)
  const[hide,setHide]=useState(false)
  const [add_new,setAdd_new]=useState(null)
  const[pageNumber,setPageNumber]=useState(0)
  const[search,setSearch]=useState("")
  const[status,setStatus]=useState(null)
  const[driverEditModal,setDriverEditModal]=useState(false)
  const[editData,setEditData]=useState({})
  const[ownerName,setOwnerName]=useState("")
  const[editPayload,setEditPayload]=useState({})
  const[deleteModal,setDeleteModal]=useState(false)
  const[driverstatus,setDriverStatus]=useState(false)
  const[deleteId,setDeleteId]=useState()
  const[total,setTotal]=useState()
  const[driversCount,setDriversCount]=useState(0)
  const[paginationShow,setPaginationShow]=useState(true)
  const[searchResultCount,SetSearchResultCount]=useState(null)
  const[searchCount,setSearchCount]=useState(false)


  // Drivers Edit 
    const handledriverEditModalClose=()=>{
      setDriverEditModal(false)
    }
    const handledriverEditModalOpen=(elem)=>{
      setDriverEditModal(true)
      setEditData(elem)
    }
    useEffect(()=>{setEditPayload(editData)},[editData])


    const changeDriverName=(selected)=>{
      const inputString=selected.label;
      let name = inputString.slice(0,-11);
      setOwnerName(name)
      let ownerId=selected.value
      setEditPayload({...editPayload,truck_owner_id:ownerId})
      filterVehicle(ownerId)
      setHide(true)
  }
  const handleTruckIdSelectionEdit=(e)=>{
    setEditPayload({...editPayload,truck_id:e.target.value})
  }

  const handleSchemeSelectionEdit=(e)=>{
    setEditPayload({...editPayload,scheme_name:e.target.value})
  }

  const saveChanges=async(e)=>{
    e.preventDefault();
    const editedData={
       name:editPayload.name,
      mobile_number: editPayload.mobile_number,
      license_number: editPayload.license_number,
      truck_owner_id:editPayload.truck_owner_id,
      truck_id:editPayload.truck_id,
      scheme_name:editPayload.scheme_name
    }
    try {
      const editRequest=await axios.post(`${baseUrl}/driver/updateDriver/${editPayload.user_id}`,editedData)
      alert("Your Changes Saved.")
      setDriverEditModal(false)
      getDriversData()
      
      
    } catch (error) {
      console.log(error);
      alert("Failed to Edit ?")
      
    }
  }

  const toggleDarkRoomStatus=async()=>{
    console.log(editData,"kkko");
    let driverPayload;
      if(editData.is_darkroom === false){
        setDriverStatus(true)
        driverPayload={
          mobile:editData.mobile_number,
          status:"DarkRoom"
        }
      }else if(editData.is_darkroom === true){
        setDriverStatus(false)
        driverPayload={
          mobile:editData.mobile_number,
          status:"Active"
        }

      }

      console.log(driverPayload);

        try {

          console.log(driverPayload);
          const statusRequest=await axios.post(`${baseUrl}/users/updateStatus`,driverPayload)
          console.log("DarkRoom reqeuset",statusRequest);
          if(statusRequest.data.success){
            alert(statusRequest.data.message)
            getDriversData()
            
          }
          
        } catch (error) {
          console.log(error,"status changed failed ?");
        }
  }

  // Delete..
   const handleDeleteModalClose=()=>{
    setDeleteModal(false)
   }

   const deleteSelectedDriversFromList=async()=>{
      try {
        const deleteReq=await axios.post(`${baseUrl}/driver/deleteDriver/${deleteId}`)
        if(deleteReq.data.success){
          alert("Deleted Successfully .")
          getDriversData()
          setDeleteModal(false)
        }
        
      } catch (error) {
        console.log(error);
        alert("Failed to Delete ?")
        
      }

   }

    const change_addDriver=()=>{
      setAdd_driver(!add_driver)
      setHide(false)
    }

    let showDataPerPage=10;
    let pageCount=Math.ceil(total/showDataPerPage)
    const handlePageChange=({selected})=>{
      setPageNumber(selected)

    }

    let pagesVisited=pageNumber*showDataPerPage
    let offset=pageNumber*showDataPerPage

    
    // Select All Button to getAll Drivers Data...
    
    const getAllDriversData=async()=>{
      const response=await axios.post(url,{limit:total,offset:offset});
      setDriver_data(response.data.data.drivers);
      setPaginationShow(false)
    }




      const handleSearch=(e)=>{
        let value=e.target.value.trim()
        setSearch(value)
        if(value.length !=0){
          setPageNumber(0)
          getAllDriversData()
        }
        if(value.length ==0){
          getDriversData()
          setPaginationShow(true)

        } 
       
     
    }


    // Api calling 
    const url=`${baseUrl}/driver/getDrivers`;

    async function getDriversData(){
      const response=await axios.post(url,{limit:showDataPerPage,offset:offset});
      setDriver_data(response.data.data.drivers);
      setTotal(response.data.data.count);
      let totalDrivers=response.data.data.count
      localStorage.setItem("totalDrivers",totalDrivers)
    }


    // const  debouncedGetAllDriversData = useCallback(debounce(getAllDriversData, 300), []);


    const getOwnersData=async()=>{
    try {
      const response=await axios.post(`${baseUrl}/driver/getOwners`,{limit:1000,offset:0})
      if(response.data.success){
        const ownersList=response.data.data.owners;
        const data=ownersList.map((item,index)=>({
            label:`${item.name}-${item.mobile}`,
            value:`${item.id}`
        }))
        const data1=ownersList.map((item,index)=>({
          label:`${item.name}-${item.mobile}`,
          value:`${item.id}`
      }))
        setOwnersList(data)
        setOwnersListEdit(data1)

      }
    } catch (error) {
      console.log("getOwnersApi Failed ?",error);
  
}
    }

    const getVehiclesData=async()=>{
      const response=await axios.post(`${baseUrl}/trucks/getTrucks`,{limit:1000,offset:0})
      console.log(response.data.data.trucks,"trucks");
      setTrucks(response.data.data.trucks)
    }
    const filterVehicle=(id)=>{
      const vehicles=trucks.filter((item,index)=>{return item.truck_owner_id == id})
      console.log(vehicles,"ve");
      setVehicles(vehicles)

    }
    const handleTruckIdSelection=(e)=>{
      setAddOwner({...addOwner,truck_id:e.target.value})

    }
    // Add drivers fn...
    const handleSelection=(selected)=>{
      setAddOwner({...addOwner,truck_owner_id:Number(selected.value),truck_id:""})
      setHide(true)
    }
    const handleSchemeSelection=(e)=>{
      setAddOwner({...addOwner,scheme_name:e.target.value})
    }
    const handleAddingNewDriver=async(e)=>{
      e.preventDefault();
      console.log(addOwner);
      console.log("addOwner");
      try {
        const response=await axios.post(`${baseUrl}/driver/addDriver`,addOwner)
      console.log(response);
      if(response.data.success){
        alert("Driver Added!")
        getDriversData()
        setAdd_driver(false)
        
        
      }else{
        alert(response.data.message)
      }
        
      } catch (error) {
        console.log(error);
        
      }

    }

    

    // React Switch Fn,,,, 
    const toggleStatus=async (userId,id,status)=>{

      if(status===true){
        const response=await axios.post(`${baseUrl}/driver/updateDriverSession`,{userId:userId})
        const updatedResponse=await axios.post(`${baseUrl}/users/updateAvailableById`,{
          user_id:userId,
          is_available:!status
      })
      if(response.data.success && updatedResponse.data.success){
        getDriversData()
      }else{
        console.log("somethong Error ?");
      }
      }
      else{
        console.log("sttatus,",status);
          const updateResponse=await axios.post(`${baseUrl}/users/updateAvailableById`,{
          user_id:userId,
          is_available:!status
      })
      if(updateResponse.data.success){
        getDriversData()
      }
      }

    }

    // No of Available Drivers Count to Showed in page
    
    const getLiveDriversCount=async()=>{
      try {
        const request=await axios.post(`${baseUrl}/location/getDriversLocations`,{limit:200,offset:0})
        if(request.data.success){
          let liveDriversCount=request.data.data?.count
          setDriversCount(liveDriversCount)
        }
        
      } catch (error) {
        console.error("Failed to count Live Drivers ",error)
        
      }

    }
    

    

    
    useEffect(()=>{
      // dispatch(fetchData("venkatachalam"))

    },[])

    useEffect(()=>{
      getOwnersData()
      getLiveDriversCount()
    },[])
    useEffect(()=>{
      getDriversData()
    },[offset,showDataPerPage])
    useEffect(()=>{
      filterVehicle(addOwner.truck_owner_id)
      getVehiclesData()

    },[addOwner.truck_owner_id])

    console.log("%c total","color:green",total)
    console.log("%c search","color:green",search.length)
  
  return ( 
      <div style={{padding: "10px" }}>
        {/* <DriversCount driverCount={driversCount}/> */}
        <section className="searchBar-section">
          <div className="session-Top-Input" style={{position:"relative"}}>
            <MdClose size={18} style={{position:"absolute",left:"420px",top:"10px",cursor:"pointer"}} onClick={()=>{
              getDriversData()
              setPaginationShow(true)
              setSearch("")
              setPageNumber(0)
            }}/>
            <input  type="text" className="drivers-search" value={search} onChange={handleSearch} placeholder="Search by Name , Phone or Truck No" />
          </div>
          <div className="driver-three-btns">
            <button className="btn-small" onClick={change_addDriver}><MdAdd size={22} color='white'/>&nbsp;
            Add Driver</button>
            <select name="" id=""> 
            <option value="Filter Status" selected>Filtered Status</option>
            <option value="Filter Status" >Available</option>
            <option value="Filter Status">Engaged</option>
            <option value="Filter Status">UnAvailable</option>
            
            </select>
            <select name="" id=""> 
            <option value="Filter Status" selected>Filtered Driver Status</option>
            <option value="Filter Status" >Available</option>
            <option value="Filter Status">UnAvailable</option>
            
            </select>
            
            <div>
            
            </div>
          </div>
        </section>
          {
            // (Boolean(search.length)  && total == 0) &&  <span style={{marginLeft:"300px"}}>No records are matching..</span> 
          }

        <section>
          <Modal isOpen={add_driver} size="lg" id="add-driver-modal-mobile" >
            <ModalHeader toggle={change_addDriver} style={{border:"none"}} className="modalHeader">
              <p>Add New Driver Details :</p>
            </ModalHeader>
            <ModalBody>
              <div id="addDriverModal">
                  <div style={{flex:0.6}} >
                    <form className="addDriverForm" onSubmit={handleAddingNewDriver}>
                      <label htmlFor="driver_name">Driver Name :</label>
                      <input type="text" id="driver_name" autoComplete="off" name="driver_name" onChange={(e)=>setAddOwner({...addOwner,name:e.target.value})} 
                      placeholder="Driver Name" />
                      <label htmlFor="driver_phone_no">Driver Phone No :</label>
                      <input type="text" id="driver_phone_no" autoComplete="off" name="driver_phone_no" onChange={(e)=>setAddOwner({...addOwner,mobile_number:e.target.value})} 
                       placeholder="Driver Phone no" maxLength={10}/>
                      <label htmlFor="license-no">License No :</label>
                      <input type="text" id="license-no" autoComplete="off" name="license-no" onChange={(e)=>setAddOwner({...addOwner,license_number:e.target.value})} 
                       placeholder="License no" />
                      <div className="driverBtn">
                      <button className="btn-small" type="submit">Create Driver</button>
                      </div>
                    </form>
                  </div>

                  <div className="right">
                  <label htmlFor="owner_name">Owner Name :</label>
                  <ReactSelect
                  isMulti={false}
                  options={ownersList}
                  placeholder={"Choose Drivers Name.."}
                  handleSelectedOption={handleSelection}/>
                  <br />
                  
                  {hide && (<>
                    <label htmlFor="">Choose Vehicle:</label>&nbsp;
                    <select name="" id="" onChange={handleTruckIdSelection}>
                    <option value="" defaultValue>select</option>
                  {vehicles.map((item,index)=>(<option value={item.id} key={index}>{item.registration_number}</option>))}
                  </select> </>)} <br /> <br />
                  <label htmlFor="scheme">Choose Scheme :</label> &nbsp;
                  <select name="scheme" id="scheme" value={addOwner.scheme_name}  onChange={handleSchemeSelection}>
                      <option value="">select</option>
                      <option value="Fixed Rate">Scheme 1</option>
                      <option value="Variable Rate">Scheme 2</option>
                      <option value="Scheme3">Scheme 3</option>
                    </select>
                    

                  </div>
              </div>

            </ModalBody>
          </Modal>
        </section>

        <section id="editDriverModalSection">
          <Modal isOpen={driverEditModal} size="lg" className="edit-driver-modal-mobile">
            <ModalHeader toggle={handledriverEditModalClose}>
                    <span style={{fontSize:"16px"}}>Edit Driver :</span>
            </ModalHeader>
            <ModalBody>
            <div id="editDriverModal">
                  <div style={{flex:0.6}} >
                    <form className="addDriverForm" onSubmit={saveChanges}>
                      <label htmlFor="driver_name">Driver Name :</label>
                      <input type="text" id="driver_name" autoComplete="off" name="driver_name" 
                      value={editPayload?.name} onChange={(e)=>setEditPayload({...editPayload,name:e.target.value})}
                      placeholder="Driver Name" />
                      <label htmlFor="driver_phone_no">Driver Phone No :</label>
                      <input type="text" id="driver_phone_no" autoComplete="off" name="driver_phone_no"  
                       value={editPayload?.mobile_number} onChange={(e)=>setEditPayload({...editPayload,mobile_number:e.target.value})}
                       placeholder="Driver Phone no" maxLength={10}/>
                       <label>Truck Owner Name :</label>
                       <input type="text" placeholder="truck owner name" value={ownerName} readOnly />
                      <label htmlFor="license-no">License No :</label>
                      <input type="text" id="license-no" autoComplete="off" name="license-no"  
                       value={editPayload?.license_number}
                       onChange={(e)=>setEditPayload({...editPayload,license_number:e.target.value})}
                       placeholder="License no" />
                      <div style={{display:"flex",gap:"15px",marginTop:"20px"}}>
                      <button className="btn-small" type="submit">SAVE</button>
                      <button className="btn-small" type="button" onClick={handledriverEditModalClose}>CANCEL</button>
                      </div>
                    </form>
                  </div>

                  <div className="right">
                  <label htmlFor="owner_name">Owner Name :</label>
                  <ReactSelect
                  isMulti={false}
                  options={ownersListEdit}
                  placeholder={"choose Owners Name.."}
                  handleSelectedOption={changeDriverName}/>
                  <br />
                  
                  {hide && (<>
                    <label htmlFor="">Choose Vehicle:</label>&nbsp;
                    <select name="" id="" onChange={handleTruckIdSelectionEdit}>
                    <option value="" defaultValue>select</option>
                  {vehicles.map((item,index)=>(<option value={item.id}key={index}>{item.registration_number}</option>))}
                  </select> </>)} <br /> <br />
                  <label htmlFor="scheme">Choose Scheme :</label> &nbsp;
                  <select name="scheme" id="scheme" value={editPayload?.scheme_name}  
                  onChange={(e)=>setEditPayload({...editPayload,scheme_name:e.target.value})}>
                      <option value="" defaultValue>select</option>
                      <option value="scheme1">Fixed Rate</option>
                      <option value="sheme2">Variable Rate</option>
                  </select>
                  <div style={{display:"flex",gap:"20px",marginTop:"30px",alignItems:"center"}}>
                    <label htmlFor="">Put Driver in Darkroom:</label>
                    <Switch
                    onChange={toggleDarkRoomStatus}
                    // checked={ !editData.is_darkroom }
                    checked={driverstatus }
                    />
                  </div>

                  </div>
              </div>

            </ModalBody>
          </Modal>

        </section>
         {/* Delete Modal */}
      <section id="DeleteModal">
        <Modal isOpen={deleteModal} size='sm' style={{marginTop:"5%"}} className="delete-modal-mobile">
                  <ModalHeader toggle={handleDeleteModalClose}style={{ border: "none" }} >
                  </ModalHeader>
                  <ModalBody>
                      <div id='deleteModalBody' >
                          <p>Are you sure you want to delete?</p>
                          <div className='confirm-cancel-button'>
                          <button onClick={deleteSelectedDriversFromList}>Confirm</button>
                          <button onClick={handleDeleteModalClose}>Cancel</button>
                          </div>
                      </div>
          
                  </ModalBody>
        </Modal>
      </section>

        <section>
          <Table responsive className="driverTable">
            <thead>
              <tr>
                <th>EDIT</th>
                <th>DELETE</th>
                <th>ID</th>
                <th>TRUCK OWNER NAME</th>
                <th>TRUCK NO</th>
                <th>DRIVER NAME</th>
                <th>MOBILE NUMBER</th>
                <th>AVAILABLE</th>
                {/* <th></th> */}
                <th>STATUS</th>
                <th>BASE LOCATION <br/> LAT & LONG</th>
                <th>BASE LOCATION ADDRESS</th>
                <th>EARNINGS</th>
              </tr>
            </thead>
            <tbody>
              {driver_data.filter((item)=>
              item.truck_owner_name?.toLowerCase().includes(search.toLowerCase())||
              item.vehicle_number?.toLowerCase().includes(search.toLowerCase())||
              item.name?.toLowerCase().includes(search.toLowerCase())||
              item.mobile_number?.toLowerCase().includes(search.toLowerCase())
              )
              .map((elem,index)=>{      
                return(
                  <tr key={elem.id}  >
                    <td><BiEditAlt size={16}  onClick={()=>{
                      handledriverEditModalOpen(elem)
                      setDriverStatus(elem.is_darkroom)
                    }}/></td>
                    <td><RiDeleteBin5Line size={16} className="deleteIcon" onClick={()=>{
                      setDeleteId(elem.id)
                      setDeleteModal(true)
                    }} /></td>
                    <td className={elem.available_status?"":"disabled"}>{elem.id}</td>
                    <td className={elem.available_status?"":"disabled"}>{elem.truck_owner_name}</td>
                    <td className={elem.available_status?"":"disabled"}>{elem.vehicle_number}</td>
                    <td className={elem.available_status?"":"disabled"}>{elem.name}</td>
                    <td className={elem.available_status?"":"disabled"}>{elem.mobile_number}</td>
                    {/* <td>{elem.available_status ? "True" : "False"}</td> */}
                    <td><Switch
                    onChange={()=>{
                      toggleStatus(elem.user_id,elem.id,elem.available_status)
                      setStatus(elem.available_status)
                    }}
                    checked={elem.available_status}
                    /></td>
                    <td className={elem.available_status?"":"disabled"}>{elem.status}</td>
                    <td className={elem.available_status?"":"disabled"}>{(elem.baseLocation == null)? "- NA ":`${elem.baseLocation.latitude} ${elem.baseLocation.longitude}`}</td>
                    <td className={elem.available_status?"":"disabled"}>{(elem.baseLocation == null)? "- NA":`${elem.baseLocation.address}`}</td>
                    <td className={elem.available_status?"":"disabled"}>{elem.wallet.toLocaleString("en-IN",{style:"currency",currency:"INR"})}</td>
                  </tr>
                )

              })}
              
            </tbody>

          </Table>

        </section>

        <section style={{position:"relative",marginBottom:"30px",marginTop:"10px"}}>
          <div >
          {
            paginationShow && <Pagination pageCount={pageCount} handlePageChange={handlePageChange} pageNumber={pageNumber}/>
          }
          </div>

        </section>

      </div>
  )
  
};

// export default Drivers;

const mapStateToProps = (state) => {
console.log(state.initial.myName)
 

};


export default connect(mapStateToProps,{fetchData} )(Drivers);



