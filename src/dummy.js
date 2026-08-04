import React, { useEffect, useState } from 'react'
import { baseUrl } from '../../api/apiConfig';
import axios from 'axios';
import ReactSelect from '../../ReactSelect';

const CompanySettings = () => {
    const[comData,setComData]=useState([])
    const[value,setValue]=useState(null)
    const [preferences, setPreferences] = useState({
    otp: false,
    deliveryProof: false
    });
    const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    
    // Update only the specific checkbox that was clicked
    setPreferences((prev) => ({
      ...prev,
      [name]: checked,
    }));
    };
    const handleSelectedOption = (selected) => {
    console.log("Selected ID:",selected );
    setValue(selected)
  };
    const customStyles = {
    control: (provided) => ({
      ...provided,
      width: '300px',  // Set the width
      scrollbarColor:"pink"
    }),
    menu: (provided) => ({
      ...provided,
      width: '300px',  // Set the width of the dropdown menu
    }),
    
    };
   console.log(value)
    const url=`${baseUrl}/users/getAllCompanies`;
        async function getCompaniesData(){
          const response=await axios.post(url,{limit:500,offset:0});
          const data = response.data.data;
          const reData=data.map((item)=>
            ({
              label:item.company_name,
              value:`${item.id}`
            })
          )
          console.log("reData",reData)
          setComData(reData);
        }

        useEffect(()=>{
          getCompaniesData()
        },[]);

       
  return (
    <div style={{padding: "10px"}}>
        <div style={{width:"400px",marginBottom: "40px"}}>
            {/* <ReactSelect
            value={value}
            options={comData}
            menuPortalTarget={document.body}
            // styles={customStyles}
            isSearchable
            onChange={handleSelectedOption}
            /> */}
            <ReactSelect
  value={value}
  options={comData}
  onChange={handleSelectedOption}
  isSearchable={true}
  // Remove styles temporarily to test
  menuPortalTarget={document.body}
  styles={{
    menuPortal: base => ({ ...base, zIndex: 9999 })
  }}
/>
        </div>
        
        <div>
         <input type="checkbox" name="otp" id="otp" checked={preferences.otp} onChange={handleCheckboxChange} />
         <label htmlFor="otp">OTP</label>
       </div>
       <div>
         <input type="checkbox" name="deliveryProof" id="deliveryProof"  checked={preferences.deliveryProof} onChange={handleCheckboxChange}/>
         <label htmlFor="deliveryProof">Delivery Proof</label>
       </div>
     
     </div>
  )
}

export default CompanySettings