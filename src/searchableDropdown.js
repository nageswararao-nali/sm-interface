import Searchable from "react-searchable-dropdown";
import "./styles/Tours/tours.css";

import React from 'react'

const SearchableDropdown = ({data,state,setState}) => {
  return (
    <div>
        <Searchable 
        
        value={"state"}
        
        onSelect={(value)=>setState(value)}
        placeholder="Search name - phone"
        options={data}
        listMaxHeight={160}
        />
    </div>
  )
}

export default SearchableDropdown