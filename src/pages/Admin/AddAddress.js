import React, { useState } from 'react';
import "../../styles/Admin/AddAddress.css"
import { Button } from 'reactstrap';
import SearchableDropdown from '../../searchableDropdown';

const data=[
  {label:"8778620133",value:"8778620133"},
  {label:"8778620133",value:"8778620133"},
  {label:"8778620133",value:"8778620133"},
  {label:"8778620133",value:"8778620133"},
  {label:"8778620133",value:"8778620133"},
];

const AddAddress = () => {

  const[add_state,setAdd_state]=useState()
  return (
    <div style={{padding:"5px",margin:"5px"}}>
      
      <div className='form-Div'>
      <p style={{fontWeight:"bold"}}>Add Address :</p>
      <SearchableDropdown state={add_state} setState={setAdd_state} data={data}/>
          <form className='forms'>
            <label htmlFor='street'>Street :</label>
            <input type="text" placeholder='Enter street name' id='street'/>
            <label htmlFor='landmark'>Landmark :</label>
            <input type="text" placeholder='Enter Landmork' id='landmark'/>
            <label htmlFor='city'>City :</label>
            <input type="text" placeholder='Enter City' id='city'/>
            <label htmlFor='pincode'>Pincode :</label>
            <input type="text" placeholder='Enter Pincode' id='pincode'/>
            <label htmlFor='name'>Receiver Name :</label>
            <input type="text" placeholder='Enter Receiver Name' id='name'/>
            <label htmlFor='contact'>Receiver Contact :</label>
            <input type="text" placeholder='Enter Receiver Contact Number' id='contact'/>
            <label htmlFor='latti'>Latitude :</label>
            <input type="text" placeholder='Enter Latitude ' id='latti'/>
            <label htmlFor='longit'>Longitude :</label>
            <input type="text" placeholder='Enter Longitude' id='longit'/>
            <button className='addAddress-Btn'>Add Address</button>
          </form>
      </div>

    </div>
  )
}

export default AddAddress