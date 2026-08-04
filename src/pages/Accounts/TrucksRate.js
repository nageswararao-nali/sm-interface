import React, { useState } from 'react'
import { Search} from "react-bootstrap-icons";
import{Table,Modal,ModalHeader,ModalBody} from "reactstrap";
import "../../styles/Accounts/truckrate.css";
import {MdAdd} from "react-icons/md"
import SearchableDropdown from "../../searchableDropdown"

const TrucksRate = () => {
  const[truckModal,setTruckModal]=useState(false)
  const[addtruck,setAddtruck]=useState(null);
  const data=[
    {label:"venkat-8778620133",value:"venkat-8778620133"},
    {label:"venkat-8778620133",value:"venkat-8778620133"},
    {label:"venkat-8778620133",value:"venkat-8778620133"},
    {label:"venkat-8778620133",value:"venkat-8778620133"},
    {label:"venkat-8778620133",value:"venkat-8778620133"},
  ]

  const changetruckModal=()=>{
    setTruckModal(!truckModal)
  }

  // onClick={changetruckModal} -- Add Truck Rate Button 
  return (
    <div style={{padding: "10px" }}>
        <section className="searchBar-section">
        <div className="session-Top-Input">
          <Search className="searchIcon"/>
          <input  type="text" placeholder="Seach owner by name,phone or address" />
        </div>
        <div className="vehicle-btns">
          <button className="btn-big" ><MdAdd color="white" size={23}/> Add Truck Rate</button>
        </div>
      </section>
      <section className='truckRateModal'>
        <Modal isOpen={truckModal}>
          <ModalHeader toggle={changetruckModal} style={{border:"none"}}>
            <p style={{position:"relative",top:"10px"}}>Add Truck Rate </p>
          </ModalHeader>
          <ModalBody>
            <form className='baseRate-form'>
              <label htmlFor="choose driver">Choose Driver :</label>
              <SearchableDropdown state={addtruck} setState={setAddtruck} data={data}/>
              <label htmlFor="base distance">Base Distance :</label>
              <input type="number" placeholder='base distance in kms' id='base distance' name='base distance' min={0} />
              <label htmlFor="base duration">Base Duration :</label>
              <input type="number" placeholder='duration in Hrs' id='base duration' name='base duration' min={0} />
              <label htmlFor="base rate">Base Rate :</label>
              <input type="number" placeholder='rate' id='base rate' name='base rate' min={0} />
              <label htmlFor="extra rate">Extra Rate/km :</label>
              <input type="number" placeholder='extra rate/km' id='extra rate' name='extra rate' min={0} />
              <label htmlFor="extra rate-2">Extra Rate/km :</label>
              <input type="number" placeholder='extra rate/km' id='extra rate-2' name='extra rate-2' min={0} />
              <button type='submit' className='btn-small'>ADD</button>
            </form>

          </ModalBody>
        </Modal>

      </section>
      <section style={{marginTop:"50px"}}>
          <Table>
            <thead>
              <tr style={{fontSize:"12px",borderBottom:"1px solid black"}}>
                <th>ID</th>
                <th>DRIVER NAME</th>
                <th>MOBILE NO</th>
                <th>VEHICLE NO</th>
                <th>BASE DISTANCE</th>
                <th>DURATION</th>
                <th>RATE</th>
                <th>EXTRA RATE/KM</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </Table>
      </section>

    </div>
  )
}

export default TrucksRate