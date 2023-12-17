import logout from './signOut.png';
import deleteIcon from './del.png';
import editIcon from './edit.png';
import logo from './logohcdc.png';
import addIcon from './add.png';
import './App.css';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"
import { useState, useEffect } from "react";
import * as React from 'react';
import { useNavigate } from 'react-router-dom';



axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const client = axios.create({
  baseURL: "http://127.0.0.1:3000"
});


const Home = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
  
    if (confirmed) {
      try {
        await axios.post('/api/logout');
    
        // Update the currentUser state to reflect logout
        setCurrentUser(false);
        
        // Navigate to the login page after logout
        navigate('/');
      } catch (error) {
        console.error('Error logging out:', error);
        // Handle logout error, if needed
      }
    }
  }; 

  const [dateInputValue, setDateInputValue] = useState('');
  const [timeInputValue, setTimeInputValue] = useState('');
  const [subjectInputValue, setSubjectInputValue] = useState('');
  const [labInputValue, setLabInputValue] = useState('');
  const [reasonInputValue, setReasonInputValue] = useState('');


  const handleSubjectChange = (event) => {
    setSubjectInputValue(event.target.value);
  };

  const handleLabChange = (event) => {
    setLabInputValue(event.target.value);
  };

  const handleReasonChange = (event) => {
    setReasonInputValue(event.target.value);
  };

  
  //Edit
  const [editInputValue, setEditInputValue] = useState('');
  const [editDateInputValue, setEditDateInputValue] = useState('');
  const [editTimeInputValue, setEditTimeInputValue] = useState('');
  const [editSubjectInputValue, setEditSubjectInputValue] = useState('');
  const [editLabInputValue, setEditLabInputValue] = useState('');
  const [editReasonInputValue, setEditReasonInputValue] = useState('');

  const [selectedItemId, setSelectedItemId] = useState(null); // State to hold the selected item ID
  
  const handleEditInputChange = (event) => {
    setEditInputValue(event.target.value);
  };  
  
  const handleEditDateChange = (event) => {
    setEditDateInputValue(event.target.value);
  };
  
  const handleEditTimeChange = (event) => {
    setEditTimeInputValue(event.target.value);
  };

  const handleEditSubjectChange = (event) => {
    setEditSubjectInputValue(event.target.value);
  };

  const handleEditLabChange = (event) => {
    setEditLabInputValue(event.target.value);
  };

  const handleEditReasonChange = (event) => {
    setEditReasonInputValue(event.target.value);
  };
  
  
  const [open, openchange] = useState(false);

  const functionopenpopup = () => {
    openchange(true);
  };

  const closepopup = () => {
    openchange(false);
  };

  const [openEdit, setOpenEdit] = useState(false); // State to manage edit dialog open/close

  const openEditDialog = (itemId) => {
    setSelectedItemId(itemId); // Set the selected item ID
    setOpenEdit(true); // Open the edit dialog
  };
  
  const closeEditDialog = () => {
    setOpenEdit(false); // Close the edit dialog
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  
  const [sanctions, setSanctions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await axios.get('/api/user');
        setCurrentUser(userResponse.data); // Assuming response.data holds user details

        // Fetch sanctions data
        const sanctionsResponse = await fetch('api/home');
        if (!sanctionsResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await sanctionsResponse.json();
        const response = await fetch('/api/home', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': 'X-CSRFToken', // Replace with your actual CSRF token value
          },
          body: JSON.stringify(data),
        });        
        console.log('Sanctions DATA:', data);
        setSanctions(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  const [inputValue, setInputValue] = useState('');

  const postData = async () => {
    try {
      const data = { 
        body: inputValue,
        date: dateInputValue,
        time: timeInputValue,
        subjectSection: subjectInputValue,
        lab: labInputValue,
        reason: reasonInputValue,
      };
  
      // Make the POST request to save the new data
      const response = await client.post('/api/home', data);
      
      if (response.status === 201) {
        console.log('Data posted successfully:', response.data);
  
        // Update the sanctions state with the newly added data
        setSanctions([...sanctions, response.data]);
  
        // Close the dialog
        closepopup();
      } else {
        console.error('Failed to post data:', response.data);
      }
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };
  
  const deleteData = async (idToDelete) => {
    try {
      await client.delete(`/api/home/${idToDelete}`);
      
    } catch (error) {
      console.error('Error deleting data:', error);
      // Handle errors, if needed
    }
  };  


  const updateData = async () => {
    try {
      const data = {
        // Ensure the correct association between state variables and data fields
        body: editInputValue, // Assuming 'name' field maps to 'editInputValue'
        date: editDateInputValue,
        time: editTimeInputValue,
        subjectSection: editSubjectInputValue,
        lab: editLabInputValue,
        reason: editReasonInputValue,
      };
  
      const response = await axios.put(`/api/home/${selectedItemId}`, data);
  
      if (response.status === 200) {
        console.log('Data updated successfully:', response.data);
        // Handle success, if needed
      } else {
        console.error('Failed to update data:', response.data);
        // Handle errors, if needed
      }
    } catch (error) {
      console.error('Error updating data:', error);
      // Handle errors, if needed
    }
  };
  
  //Search
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter the sanctions based on the search query
  const filteredSanctions = sanctions.filter((sanction) => {
    const searchValue = searchQuery.toLowerCase();
    return (
      (typeof sanction.body === 'string' && sanction.body.toLowerCase().includes(searchValue)) ||
      (typeof sanction.date === 'string' && sanction.date.toLowerCase().includes(searchValue)) ||
      (typeof sanction.time === 'string' && sanction.time.toLowerCase().includes(searchValue)) ||
      (typeof sanction.subjectSection === 'string' && sanction.subjectSection.toLowerCase().includes(searchValue)) ||
      (typeof sanction.lab === 'string' && sanction.lab.toLowerCase().includes(searchValue)) ||
      (typeof sanction.reason === 'string' && sanction.reason.toLowerCase().includes(searchValue))
    );
  });
  
  

  return (
    <main className="table" id="student_table">
      <section className="table__header">
        <img src={logo} alt="Logo" className="logo" />
        <h1 style={{ fontSize: '1rem',color: '#333' }}>List of Sanctioned Students</h1>

        <div className="input-group">
        <input
          type="search"
          placeholder="Search Data..."
          value={searchQuery}
          onChange={handleSearch} />
        </div>

        <button 
          style={{ width: '60px', height: '35px', borderRadius: '5px', marginLeft: '20px' }}
          onClick={handleLogout} // Call the handleLogout function on click
        >
          <img src={logout} alt="search" style={{ width: '100%', height: '100%', borderRadius: '5px' }} />
        </button>
      </section>

      <section className="table__body">
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Subject & Section</th>
                <th>Lab</th>
                <th>Reason</th>
                <th>Action</th>
                <th>
                  <button onClick={() => { functionopenpopup()}} color="primary" variant="contained">
                    <img src={addIcon} alt="Icon" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Your mapped data for sanctions */}
              {sanctions
                .filter((sanction) => {
                  const searchValue = searchQuery.toLowerCase();
                  return (
                    (typeof sanction.body === 'string' && sanction.body.toLowerCase().includes(searchValue)) ||
                    (typeof sanction.date === 'string' && sanction.date.toLowerCase().includes(searchValue)) ||
                    (typeof sanction.time === 'string' && sanction.time.toLowerCase().includes(searchValue)) ||
                    (typeof sanction.subjectSection === 'string' && sanction.subjectSection.toLowerCase().includes(searchValue)) ||
                    (typeof sanction.lab === 'string' && sanction.lab.toLowerCase().includes(searchValue)) ||
                    (typeof sanction.reason === 'string' && sanction.reason.toLowerCase().includes(searchValue))
                  );
                })
                .map((sanction, index) => (
                    <tr key={index}>
                    <td>{sanction.id}</td>
                    <td>{sanction.body}</td>
                    <td>{sanction.date}</td>
                    <td>{sanction.time}</td>
                    <td>{sanction.subjectSection}</td>
                    <td>{sanction.lab}</td>
                    <td>{sanction.reason}</td>
                    <td>
                    <button onClick={() => {
                      const confirmed = window.confirm('Are you sure you want to delete this item?');

                      if (confirmed) {
                        deleteData(sanction.id);
                        window.location.reload();
                      }
                    }}>
                      <img src={deleteIcon} alt="Icon" />
                    </button>

                    <button onClick={() => openEditDialog(sanction.id)}>
                      <img src={editIcon} alt="Edit Icon" />
                    </button>
                    </td>
                    <td> </td>
                  </tr>
                ))}
              
              {/* Repeat the above structure for each row */}
            </tbody>
          </table>
          {/* Your Dialog component */}
          <Dialog open={open} onClose={closepopup} fullWidth maxWidth="sm">
            <DialogTitle>Sanctioned Student Info
              <IconButton onClick={closepopup} style={{ float: 'right' }}>
                <CloseIcon color="primary" />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2} margin={2}>
                {/* Your form elements */}
                <TextField
                  onChange={(event) => handleInputChange(event)} // Assuming you have a function to handle input changes
                  value={inputValue} // Assuming inputValue holds the value from the TextField
                  variant="outlined"
                  label="Name"
                />
                <input
                  type="date"
                  value={dateInputValue}
                  onChange={(e) => setDateInputValue(e.target.value)}
                />
                
                <input
                  type="time"
                  value={timeInputValue}
                  onChange={(e) => setTimeInputValue(e.target.value)}
                />

                <TextField
                  onChange={(event) => handleSubjectChange(event)} // Function to handle subject input changes
                  value={subjectInputValue} // Subject input value
                  variant="outlined"
                  label="Subject & Section"
                />
                <TextField
                  onChange={(event) => handleLabChange(event)} // Function to handle lab input changes
                  value={labInputValue} // Lab input value
                  variant="outlined"
                  label="Lab"
                />
                <TextField
                  onChange={(event) => handleReasonChange(event)} // Function to handle reason input changes
                  value={reasonInputValue} // Reason input value
                  variant="outlined"
                  label="Reason"
                />
                {/* Other form fields */}
                <Button
                  onClick={() => {
                    postData();
                    window.location.reload();
                  }}
                  style={{
                    backgroundColor: '#2B3467',
                    color: '#f8f9fa',
                    fontSize: '1.5rem',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                  }}
                  variant="contained"
                >
                  Submit
                </Button>
              </Stack>
            </DialogContent>
            <DialogActions></DialogActions>
          </Dialog>

          <Dialog open={openEdit} onClose={closeEditDialog} fullWidth maxWidth="sm">
            <DialogTitle>Update Student Info
              <IconButton onClick={closepopup} style={{ float: 'right' }}>
                <CloseIcon color="primary" />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2} margin={2}>
                {/* Your form elements */}
                <TextField
                  onChange={(event) => handleEditInputChange(event)} // Function to handle subject input changes
                  value={editInputValue} // Subject input value
                  variant="outlined"
                  label="Name"
                />

                <input
                  type="date"
                  value={editDateInputValue}
                  onChange={handleEditDateChange}
                />

                <input
                  type="time"
                  value={editTimeInputValue}
                  onChange={handleEditTimeChange}
                />

                <TextField
                  onChange={(event) => handleEditSubjectChange(event)} // Function to handle subject input changes
                  value={editSubjectInputValue} // Subject input value
                  variant="outlined"
                  label="Subject & Section"
                />
                <TextField
                  onChange={(event) => handleEditLabChange(event)} // Function to handle lab input changes
                  value={editLabInputValue} // Lab input value
                  variant="outlined"
                  label="Lab"
                />
                <TextField
                  onChange={(event) => handleEditReasonChange(event)} // Function to handle reason input changes
                  value={editReasonInputValue} // Reason input value
                  variant="outlined"
                  label="Reason"
                />
                {/* Other form fields */}
                <Button
                  onClick={() => {
                    updateData();
                    window.location.reload();
                  }}
                  style={{
                    backgroundColor: '#2B3467',
                    color: '#f8f9fa',
                    fontSize: '1.5rem',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                  }}
                  variant="contained"
                >
                  Edit
                </Button>
              </Stack>
            </DialogContent>
            <DialogActions></DialogActions>
          </Dialog>
          
        </section>


      
    </main>
  );
};

export default Home;
