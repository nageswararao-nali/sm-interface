import React, { useState } from 'react';
import "../../styles/Admin/EditAddress.css"
import SearchableDropdown from '../../searchableDropdown';
const data=[
  {label:"8778620133",value:"8778620133"},
  {label:"8778620133",value:"8778620133"},
  {label:"8778620133",value:"8778620133"},
  {label:"8778620133",value:"8778620133"},
  {label:"8778620133",value:"8778620133"},
];

const EditAddress = () => {
  const[edit_add_state,setEdit_add_state]=useState()
  return (
    <div style={{padding:"5px",margin:"5px"}}>
        <div className='editForm-Div'>
              <SearchableDropdown state={edit_add_state} setState={setEdit_add_state} data={data}/>
              
            <div className='editReset-Btn'>
            <button>Reset</button>
            </div>
        </div>
    </div>
  )
}

export default EditAddress