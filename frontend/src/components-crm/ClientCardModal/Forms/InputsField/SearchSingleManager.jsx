import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import people from '../../../../assets/icons/people.svg';
import { fetchManagersWithToken } from '../../../../http/client-cards/getManagers';

const SearchSingleManager = ({ onSelect, name, initialManager, userRole }) => {
  const access = localStorage.getItem('access'); // Get access token

  const [manager, setManager] = useState(initialManager || ''); // Initialize with initialManager
  const [managerResults, setManagerResults] = useState([]);
  const [fetchTriggered, setFetchTriggered] = useState(false);

  const handleManager = (e) => {
    const { value } = e.target;
    setManager(value);
    setFetchTriggered(true); // Trigger fetch when typing
  };

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await fetchManagersWithToken({
          access,
          name: manager, // Pass the current input value for filtering
        });
        if (response.ok) {
          const data = await response.json();
          const filteredResults = data.filter((item) =>
            item.full_name.toLowerCase().includes(manager.toLowerCase()) // Case-insensitive filtering
          );
          setManagerResults(filteredResults.slice(0, 5)); // Limit to top 5 results
        } else {
          console.error('Failed to fetch managers');
        }
      } catch (error) {
        console.error('Error fetching managers:', error);
      }
    };

    if (fetchTriggered && manager) {
      fetchManagers();
    } else {
      setManagerResults([]);
    }
  }, [manager, access, fetchTriggered]);

  const handleManagerSelect = (selectedManager) => {
    setManager(selectedManager.full_name); // Update the input field
    setManagerResults([]); // Clear the dropdown list
    setFetchTriggered(false); // Stop further fetching
    if (onSelect) onSelect(selectedManager); // Pass the selected manager
  };

  return (
    <Form.Group className="mb-3" style={{ position: 'relative' }}>
      <div className="form-control-wrap">
        <Form.Label className="text-secondary">{name}</Form.Label>
        <Form.Control
          name="manager"
          className="shadow-none"
          placeholder="Не указано"
          value={manager}
          onChange={handleManager}
          disabled={userRole === 2}
        />
        <div className="control-img">
          <img src={people} alt="" />
        </div>
      </div>
      {managerResults.length > 0 && (
        <ul
          className="kindergarten-suggestions"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            zIndex: 1000,
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {managerResults.map((item, index) => (
            <li key={index}>
              <button
                type="button"
                onClick={() => handleManagerSelect(item)} // Select manager and close dropdown
                style={{
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: '10px',
                  textAlign: 'left',
                  width: '100%',
                  display: 'block',
                  color: 'black',
                }}
              >
                {item.full_name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Form.Group>
  );
};

export default SearchSingleManager;