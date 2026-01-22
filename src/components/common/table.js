import React, { useState, useEffect } from 'react';

const Table = () => {
  const [allData, setAllData] = useState([]);
  const [editableRows, setEditableRows] = useState({});

  useEffect(() => {
    const storedData = localStorage.getItem('allData');
    if (storedData) {
      setAllData(JSON.parse(storedData));
    }
  }, []); 

  const handleDelete = (index) => {
    const newData = allData.filter((_, i) => i !== index);
    setAllData(newData);
    localStorage.setItem('allData', JSON.stringify(newData));
  }

  const handleEdit = (index) => {
    setEditableRows(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  }

  const handleSave = (index) => {
    setEditableRows(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
    localStorage.setItem('allData', JSON.stringify(allData));
  }

  const handleInputChange = (event, index, key) => {
    const newData = [...allData];
    newData[index][key] = event.target.value;
    setAllData(newData);
  }

  return (
    <div className="table-container"> {/* Apply the table container className */}
      <table>
        <thead>
          <tr>
            <th>Samples</th>
            <th>Groups</th>
            <th>Parameters</th>
            <th className="Action-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {allData.map((dataItem, index) => (
            <tr key={"All data"+index}>
              <td>
                {editableRows[index] ? 
                  <input type="text" value={Array.isArray(dataItem.samples) ? dataItem.samples.join(', ') : dataItem.samples} onChange={(e) => handleInputChange(e, index, 'samples')} /> 
                  : 
                  dataItem.samples
                }
              </td>
              <td>
                {editableRows[index] ? 
                  <input type="text" value={Array.isArray(dataItem.groups) ? dataItem.groups.join(', ') : dataItem.groups} onChange={(e) => handleInputChange(e, index, 'groups')} /> 
                  : 
                  dataItem.groups
                }
              </td>
              <td>
                {editableRows[index] ? 
                  <input type="text" value={Array.isArray(dataItem.parameters) ? dataItem.parameters.join(', ') : dataItem.parameters} onChange={(e) => handleInputChange(e, index, 'parameters')} /> 
                  : 
                  dataItem.parameters
                }
              </td>
              <td>
                {editableRows[index] ? 
                  <button className='saveBtn' onClick={() => handleSave(index)}>Save</button>
                  :
                  <button className='saveBtn' onClick={() => handleEdit(index)}>Edit</button>
                }
                <button className='saveBtn' onClick={() => {handleDelete(index); window.location.reload()}}>Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table;
