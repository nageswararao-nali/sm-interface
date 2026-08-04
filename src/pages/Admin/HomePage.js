import React, { useState } from 'react';

const DynamicInputList = () => {
  const [addresses, setAddresses] = useState([]);

  const addInput = () => {
    if (addresses.length < 5) {
      setAddresses([...addresses, '']);
    }
  };

  const removeInput = (index) => {
    const newAddresses = [...addresses];
    newAddresses.splice(index, 1);
    setAddresses(newAddresses);
  };

  const handleChange = (value, index) => {
    const newAddresses = [...addresses];
    newAddresses[index] = value;
    setAddresses(newAddresses);
  };

  const handleSubmit = () => {
    // Handle form submission with addresses array
    console.log('Submitted Addresses:', addresses);
  };

  return (
    <div>
      {addresses.map((address, index) => (
        <div key={index}>
          <input
            type="text"
            value={address}
            onChange={(e) => handleChange(e.target.value, index)}
          />
          <button onClick={() => removeInput(index)}>Remove</button>
        </div>
      ))}
      <button onClick={addInput}>Add Address</button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default DynamicInputList;
