import React, { useState } from "react";

function DropdownWithCheckboxes() {
  const options = ["One", "Two", "Three"];
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionValue) => {
    const selectedIndex = selectedOptions.indexOf(optionValue);
    const newSelectedOptions = [...selectedOptions];

    if (selectedIndex === -1) {
      newSelectedOptions.push(optionValue);
    } else {
      newSelectedOptions.splice(selectedIndex, 1);
    }

    setSelectedOptions(newSelectedOptions);
  };

  const handleSelectAll = () => {
    setSelectedOptions(options);
  };

  const handleClearSelection = () => {
    setSelectedOptions([]);
  };
  return (
    <div className="dropdown" id={name}>
      <button
        className="dropdown-toggle"
        onClick={toggleDropdown}
        aria-haspopup="true"
      >
        Select Options
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div>
            <label htmlFor="selectall">
              <input
                type="checkbox"
                checked={selectedOptions.length === options.length}
                onChange={handleSelectAll}
              />Select All
            </label>
          </div>
          {options.map((option) => (
            <label key={option} htmlFor="checkbox">
              <input
                type="checkbox"
                value={option}
                checked={selectedOptions.includes(option)}
                onChange={() => handleOptionClick(option)}
              />
              {option}
            </label>
          ))}
          <div>
            <button onClick={handleClearSelection}>Clear Selection</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DropdownWithCheckboxes;
