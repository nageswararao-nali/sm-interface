import React from 'react'

const MultiDeleteBtn = ({selectedIds,deleteMultipleAddresses}) => {
  return (
    <div>
        {
            Boolean(selectedIds.length) && <button 
            className="card-btn-pickup" 
            style={{position:"relative",left:"260px",top:"30px", width:"140px"}}
            onClick={deleteMultipleAddresses}
            >Multi-Delete</button>
        }
    </div>
  )
}

export default MultiDeleteBtn