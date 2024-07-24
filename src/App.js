import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, Button, IconButton, Box, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const [testcases, setTestcases] = useState([]);
  const [filteredTestcases, setFilteredTestcases] = useState([]);
  const [newTestcase, setNewTestcase] = useState({
    estimate_time: '',
    module: '',
    priority: '',
    status: ''
  });
  const [editingTestcase, setEditingTestcase] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTestcases();
  }, []);

  const fetchTestcases = async () => {
    try {
      const response = await axios.get('http://localhost:5000/testcases');
      setTestcases(response.data);
      setFilteredTestcases(response.data);
    } catch (error) {
      console.error('There was an error fetching the data!', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTestcase({ ...newTestcase, [name]: value });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      if (editingTestcase) {
        await axios.put(`http://localhost:5000/testcases/${editingTestcase[0]}`, newTestcase);
      } else {
        await axios.post('http://localhost:5000/testcases', newTestcase);
      }
      fetchTestcases();
      setNewTestcase({ estimate_time: '', module: '', priority: '', status: '' });
      setEditingTestcase(null);
      setShowForm(false);
    } catch (error) {
      console.error('There was an error saving the data!', error);
    }
  };

  const handleEdit = (testcase) => {
    setNewTestcase({
      estimate_time: testcase[1],
      module: testcase[2],
      priority: testcase[3],
      status: testcase[4]
    });
    setEditingTestcase(testcase);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/testcases/${id}`);
      fetchTestcases();
    } catch (error) {
      console.error('There was an error deleting the data!', error);
    }
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    setFilteredTestcases(testcases.filter(testcase => {
      return testcase[0].toString().toLowerCase().includes(searchTerm); // Assuming the ID is in the first column
    }));
  };

 
  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Cases</h1>
      <TextField
        label="Search"
        value={searchTerm}
        onChange={handleSearch}
        fullWidth
        margin="normal"
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Estimate Time</TableCell>
              <TableCell>Module</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTestcases.map((testcase, index) => (
              <TableRow key={index}>
                <TableCell>{testcase[0]}</TableCell>
                <TableCell>{testcase[1]}</TableCell>
                <TableCell>{testcase[2]}</TableCell>
                <TableCell>{testcase[3]}</TableCell>
                <TableCell>{testcase[4]}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(testcase)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(testcase[0])}>
                    <FontAwesomeIcon icon={faTrash} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {!showForm && (
        <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setNewTestcase({ estimate_time: '', module: '', priority: '', status: '' });
          setEditingTestcase(null);
          setShowForm(true); // Display the form for adding new test cases
        }}
        style={{ marginTop: '20px' }}
      >
        Add Test Case
      </Button>
      )}
      {showForm && (
        <Dialog open={showForm} onClose={() => setShowForm(false)}>
          <DialogTitle>{editingTestcase ? 'Edit Test Case' : 'Add Test Case'}</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSave}>
              <TextField
                label="Estimate Time"
                name="estimate_time"
                value={newTestcase.estimate_time}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Module"
                name="module"
                value={newTestcase.module}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Priority"
                name="priority"
                value={newTestcase.priority}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Status"
                name="status"
                value={newTestcase.status}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <DialogActions>
                <Button onClick={() => setShowForm(false)} color="secondary">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Save
                </Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default App;