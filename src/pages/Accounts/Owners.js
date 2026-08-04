import React,{useState,useEffect} from 'react';
import { Search} from "react-bootstrap-icons";
import{Table,Modal,ModalHeader,ModalBody} from "reactstrap";
import "../../styles/Accounts/owner.css";
import {MdAdd} from "react-icons/md";
import axios from 'axios';
import Pagination from '../../Pagination';
import{BiEditAlt} from "react-icons/bi"
import {RiDeleteBin5Line} from "react-icons/ri";
import { baseUrl } from '../../api/apiConfig';
import { MdClose } from "react-icons/md";

const Owners = () => {

  const[owners,setOwners]=useState([]);
  const[ownerModal,setOwnerModal]=useState(false)
  const[search,setSearch]=useState("")
  const[pageNumber,setPageNumber]=useState(0)
  const[name,setName]=useState("")
  const[mobile_number,setMobile_number]=useState("")
  const[editModal,setEditModal]=useState(false)
  const[deleteModal,setDeleteModal]=useState(false)
  const[deleteId,setDeleteId]=useState(null)
  const[editData,setEditData]=useState(null)
  const[total,setTotal]=useState(null)
  const [paginationShow, setPaginationShow] = useState(true);
  const[searchResult_Text,setSearchResult_Text]=useState(false)
  const[searchResult_Count,setSearchResult_Count]=useState(null)


  const handleDeleteModalClose=()=>{
    setDeleteModal(false)
  }
  const deleteSelectedOwners=(id)=>{
    setDeleteId(id)
  }
  const deleteSelectedOwnersFromList=async()=>{
    console.log(deleteId);
    try {
      const deleteRequest=await axios.post(`${baseUrl}/driver/deleteOwner/${deleteId}`)
      if(deleteRequest.data.success){
        alert("Deleted Successfully.")
        setDeleteModal(false)
        getOwnersData()

      }
      
    } catch (error) {
      console.log(error,"Failed to Delete ?");
      alert("Failed to Delete ?")
      
    }
  }
  


  const handleOwnersEditModalOpen=(elem)=>{
    setEditModal(true)
    setEditData(elem)
  }

  const saveChanges=async(e)=>{
    // console.log(editData);
    e.preventDefault()
    const editPayload={
      name:editData.name,
      mobile_number:editData.mobile
    }
    // console.log(editPayload);
    // console.log(`${baseUrl}/driver/updateOwner/${editData.id}`);
    try {
      const editRequest=axios.post(`${baseUrl}/driver/updateOwner/${editData.id}`,editPayload)
      if((await editRequest).data.success){
        setEditModal(false)
        alert("Updated Successfully.")
        getOwnersData()
        
      }
      
    } catch (error) {
      console.log(error,"Failed to Updated ?");
      alert("Failed to Updated ?")
    }

  }

  const cancelChanges=()=>{
    setEditModal(false)

  }

  
  const handleOwnersEditModalClose=()=>{
    setEditModal(false)

  }

    const changeownerModal=()=>{
      setOwnerModal(!ownerModal)
    }

    const handleSearch=(e)=>{
      let value=e.target.value.trim()
      setSearch(value)
      if(value.length !=0){
        setPageNumber(0)
        getAllOwnersData()
      }
      if(value.length ==0 ){
        getClearData()
        setPageNumber(0)

      }
      const searchResult_Arr=owners.filter((item)=>
                (
                  item.name.toLowerCase().includes(search.toLowerCase())||
                  item.mobile.includes(search)
                ))

                console.log("searchResult_Arr",searchResult_Arr.length)
      // setSearchResult_Text(true)
    }


    let showDataPerPage=10;
    const handlePageChange=({selected})=>{
      setPageNumber(selected)
    }
    // let pageCount=Math.ceil(owners.length/showDataPerPage)
    let pageCount=Math.ceil(total/showDataPerPage)
    let pagesVisited=pageNumber*showDataPerPage
    let offset=pageNumber*showDataPerPage

    const handleAddingnewOwner=async()=>{
      console.log(name,mobile_number);
      try {
        const request=await axios.post(`${baseUrl}/driver/addOwner`,{name:name,mobile_number:mobile_number})
        if(request.data.success == true){
          setOwnerModal(false)
          getOwnersData()

        }
        
      } catch (error) {
        console.log(error,"Something Went Wrong ??");
        
      }
     

    }

    // Api calling 
    const url=`${baseUrl}/driver/getOwners`;

    async function getOwnersData(){
      const response=await axios.post(url,{limit:showDataPerPage,offset:offset});
      setOwners(response.data.data.owners);
      setTotal(response.data.data.count);
    }

    // get All OwnersData.....

    const getAllOwnersData=async()=>{
      const response=await axios.post(url,{limit:total,offset:offset});
      setOwners(response.data.data.owners);
      setPaginationShow(false)
    }

    // Get Cleardata ...

    const getClearData=()=>{
      getOwnersData()
      setPaginationShow(true)
      setSearch("")
      setSearchResult_Text(false)

    }


    useEffect(()=>{
      getOwnersData()
    },[offset])
    useEffect(()=>{setEditData(editData)},[editData])
    // console.log(owners,"owners...");

  return (
    <div style={{padding: "10px" }}>
        <section className="searchBar-section">
        <div className="session-Top-Input" style={{position:"relative"}}>
        <MdClose size={18} style={{position:"absolute",left:"420px",top:"10px",cursor:"pointer"}} onClick={()=>{
          getClearData()
          setPageNumber(0)
        }}/>
          <input  type="text" value={search} onChange={handleSearch} 
          placeholder="Search by name or Mobno ..." />
        </div>
        <div className="vehicle-btns" style={{display:"flex"}}>
          <button className="btn-big" onClick={changeownerModal}> <MdAdd color="white" size={23}/>Add Owner</button>
        </div>
      </section>
        {
          // (search.length >=2 && searchResult_Text) && <span> records matching.. </span>
        }
      <section className='addOwner-Modal'>
        <Modal isOpen={ownerModal} className='owners-add-modal-mobile'>
          <ModalHeader toggle={changeownerModal} style={{border:"none"}}>
          <p style={{position:"relative",top:"10px"}}>Add New Owner Details:</p>
          </ModalHeader>
          <ModalBody>
            {/* onSubmit={handleAddingnewOwner} */}
            
            <div className='addowner-form' >
              <label htmlFor="name">Name :</label>
              <input type="text" id='name' autoComplete='off' value={name} onChange={(e)=>setName(e.target.value)} placeholder='Owner name' name='name' />
              <label htmlFor="phone no">Phone No :</label>
              <input type="text" id='phone no' autoComplete='off' value={mobile_number} onChange={(e)=>setMobile_number(e.target.value)} name='phone no' maxLength={10} placeholder='Owner phone no' />
              <div className="ownerBtn" style={{display:"flex",gap:"15px"}}>
                  <button type='button' onClick={handleAddingnewOwner} className="btn-small">Create Owner</button>
                  {/* <input type="submit"className='btn-small' value="Submit" /> */}
                  <button type='reset' className='btn-small'>Clear</button>
              </div>
            </div>

          </ModalBody>
        </Modal>

      </section>

      <section id='ownersEditModal'>
        <Modal isOpen={editModal} className='owners-edit-modal-mobile'>
          <ModalHeader toggle={handleOwnersEditModalClose}>
            <span style={{fontSize:"15px"}}>Owners Edit :</span>
          </ModalHeader>
          <ModalBody>
            <form action="#" onSubmit={saveChanges} id='ownersEditModalBody'>
              <label htmlFor="">Owner Name :</label>
              <input type="text" value={editData?.name} onChange={(e)=>setEditData({...editData,name:e.target.value})}/>
              <label htmlFor="">Owner Mobile :</label>
              <input type="text" value={editData?.mobile} readOnly/>
              <div style={{display:"flex", gap:"10px",marginTop:"15px"}}>
                <button className='btn-small' type='submit'>SAVE</button>
                <button  className='btn-small' type='button' onClick={cancelChanges}>CANCEL</button>
              </div>
            </form>

          </ModalBody>
        </Modal>
      </section>

      {/* Delete Modal */}
      <section id="DeleteModal">
      <Modal isOpen={deleteModal} size='sm' style={{marginTop:"5%"}} className='delete-modal-mobile'>
                <ModalHeader toggle={handleDeleteModalClose}style={{ border: "none" }} >
                </ModalHeader>
                <ModalBody>
                    <div id='deleteModalBody' >
                        <p>Are you sure you want to delete?</p>
                        <div className='confirm-cancel-button'>
                        <button onClick={deleteSelectedOwnersFromList}>Confirm</button>
                        <button onClick={handleDeleteModalClose}>Cancel</button>
                        </div>
                    </div>
        
                </ModalBody>
      </Modal>

      </section>

      <section style={{marginTop:"50px"}}>
          <Table>
            <thead>
              <tr style={{fontSize:"12px",borderBottom:"1px solid black"}}>
                <th>EDIT</th>
                <th>DELETE</th>
                <th>ID</th>
                <th>NAME</th>
                <th>MOBILE NUMBER</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {
                owners.filter((item)=>
                (
                  item.name.toLowerCase().includes(search.toLowerCase())||
                  item.mobile.includes(search)
                ))
                .map((elem)=>{
                  return(
                    <tr key={elem.id} style={{borderBottom:"1px solid lightgrey"}}>
                      <td><BiEditAlt size={16} onClick={()=>handleOwnersEditModalOpen(elem)}/></td>
                      <td><RiDeleteBin5Line size={16}
                      className="deleteIcon" 
                      onClick={()=>
                        {
                          setDeleteModal(true)
                          deleteSelectedOwners(elem.id)
                        }}/></td>
                      <td>{elem.id}</td>
                      <td>{elem.name}</td>
                      <td>{elem.mobile}</td>
                      <td>{elem.status}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
      </section>
      <section id='ownerPagination' style={{position:"relative",marginBottom:"30px",marginTop:"30px"}}>
        {
          paginationShow && <Pagination
          pageCount={pageCount}
          handlePageChange={handlePageChange}
          pageNumber={pageNumber}
          paginationcontrol="pagenoCounts"
          />
        }
      </section>

    </div>
    
  )
}

export default Owners

//.slice(pagesVisited,pagesVisited+showDataPerPage)

{/* <button className="btn-big" onClick={getAllOwnersData}>Select All</button>
<button className="btn-big" style={{marginLeft:"-20px"}} onClick={getClearData}>Clear</button> */}