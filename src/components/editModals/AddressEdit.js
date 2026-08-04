import React, { useEffect, useState } from 'react'
import "../../styles/Admin/addressEdit.css";
import axios from 'axios';
import { baseUrl } from '../../api/apiConfig';

const AddressEdit = ({editData,id,checking,setEditAddress}) => {
    const[editedData,setEditedData]=useState({})
    console.log(editData);

useEffect(()=>{
    setEditedData(editData)
},[editData])

const saveChanges=async(e)=>{
    e.preventDefault()
    console.log(editedData,"ooo");
    const payload={
        address:editedData.address,
        address_type:editedData.address_type,
        city:editedData.city,
        country:editedData.country,
        customer_id:editedData.customer_id,
        latitude:editedData.latitude,
        longitude:editedData.longitude,
        mobile:editedData.mobile,
        pincode:editedData.pincode,
        receiver_contact:editedData.receiver_contact,
        receiver_name:editedData.receiver_name,
        state:editedData.state
    }
    console.log("payload");

    try {
        const resp=await axios.post(`${baseUrl}/users/updateAddress/${editData.id}`,payload)
        console.log(resp);
        if(resp.data.success){
            alert("Address updated Successfully.✅")
            setEditAddress(false)
            checking(id)
        }
        
    } catch (error) {
        console.error(error)
        alert("Failed to update ?")
        
    }

}

// cancel Button 
const cancelSaveChanges=()=>[
    setEditAddress(false)
]


  return (
    <div>
        
        <form action="#" className='adressEditForm' onSubmit={saveChanges}>
            <label htmlFor="">Address :</label>
            <input type="text" value={editedData?.address} onChange={(e)=>setEditedData({...editedData,address:e.target.value})} />
            <label htmlFor="">City :</label>
            <input type="text" value={editedData?.city} onChange={(e)=>setEditedData({...editedData,city:e.target.value})} />
            <label htmlFor="">State :</label>
            <input type="text" value={editedData?.state} onChange={(e)=>setEditedData({...editedData,state:e.target.value})}/>
            <label htmlFor="">Country :</label>
            <input type="text" value={editedData?.country} onChange={(e)=>setEditedData({...editedData,country:e.target.value})} />
            <label htmlFor="">Pincode :</label>
            <input type="text" value={editedData?.pincode} onChange={(e)=>setEditedData({...editedData,pincode:e.target.value})} />
            <label htmlFor="">Latitude :</label>
            <input type="text" value={editedData?.latitude} onChange={(e)=>setEditedData({...editedData,latitude:e.target.value})} />
            <label htmlFor="">Longitude :</label>
            <input type="text" value={editedData?.longitude} onChange={(e)=>setEditedData({...editedData,longitude:e.target.value})}/>
            <label htmlFor="">Receiver Contact :</label>
            <input type="text" value={editedData?.receiver_contact} 
            onChange={(e)=>setEditedData({...editedData,receiver_contact:e.target.value})} />
            <label htmlFor="">Receiver Name :</label>
            <input type="text" value={editedData?.receiver_name}
            onChange={(e)=>setEditedData({...editedData,receiver_name:e.target.value})}
            />
            <div style={{display:"flex",gap:"10px"}}>
            <button type='submit' className='btn-small'>Save</button>
            <button type='button'  onClick={cancelSaveChanges} className='btn-small'>Cancel</button>
            </div>
        </form>

    </div>
  )
}

export default AddressEdit