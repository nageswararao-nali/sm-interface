import React from 'react';
import Select from "react-select"

const ReactSelect = ({options,handleSelectedOption,placeholder,isClearable,value,isMulti}) => {

  const customStyle = {
    option: (provided, state) => ({
      ...provided,
      padding:"5px",
      margin:"5px",
      backgroundColor: state.isSelected ? '#30A46C' : 'white',
      color: state.isSelected ? 'white' : 'black',
      ':hover': {
        backgroundColor: '#30A46C',
        color:"white",
        
      },
    }),
    control:(provided,state)=>({
      ...provided,
      // height:"32px"
      // minHeight:"32px",
      // height:"auto",
      // overflow:"visible",
      // marginBottom:"10px"
    }),
    input: (provided, state) => ({
      ...provided,
      margin: '0px',
      padding:"0px"
    })
  };
  
  return (
    <div>
        <Select 
        isSearchable
        value={value}
        styles={customStyle}
        options={options}
        // placeholder={"checck"}
        placeholder={placeholder}
        isClearable={isClearable}
        onChange={handleSelectedOption}
        isMulti={isMulti}
        
        />
    </div>
  )
}

export default ReactSelect