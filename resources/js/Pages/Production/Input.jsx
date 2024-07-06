import React, { useState, useEffect } from 'react';
import { Button, IconButton, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CircularProgress } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Homepage from '../Components/Homepage';
import SearchIcon from '@mui/icons-material/Search';
import { Inertia } from '@inertiajs/inertia'
import { InertiaLink } from '@inertiajs/inertia-react';

const Input = () => {
  const [filteredProductions, setFilteredProductions] = useState([]);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [productionToDeleteId, setProductionToDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Tambahkan logika filter sesuai kebutuhan Anda
    // Contoh: Ambil data dari sumber lain atau lakukan pemrosesan data
    const mockProductions = [
      // ... contoh data produksi
    ];

    const filtered = mockProductions.filter((production) =>
      production.productionNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProductions(filtered);
  }, [searchTerm]);

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteProduction = (id) => {
    setProductionToDeleteId(id);
    openDeleteConfirmationModal();
  };

  const confirmDeleteProduction = async () => {
    try {
      // Perform deletion logic here
      closeDeleteConfirmationModal();
      // Show success notification
      setSnackbarSeverity('success');
      setSnackbarMessage('Production deleted successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting production:', error);
      // Show error notification
      setSnackbarSeverity('error');
      setSnackbarMessage('Error deleting production');
      setSnackbarOpen(true);
    }
  };

  const handleEditProduction = (production) => {
    // Logic to handle editing
  };

  const openDeleteConfirmationModal = () => {
    setIsDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmationModal = () => {
    setIsDeleteConfirmationOpen(false);
    setProductionToDeleteId(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Homepage>
    <div>
      {/* Your Snackbar component */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        style={{ marginBottom: '30px', marginRight: '30px'}}
      >
        <MuiAlert elevation={6} variant="filled" onClose={closeSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant='h4'>
          Input
        </Typography>
        <InertiaLink
            href='/inputdetail'
            style={{
                size: 'small',
             }}
        >
            <Button variant="contained" color="primary" size="small" >
                Add new
            </Button>
        </InertiaLink>
      </div>
      <hr style={{color: 'white'}} />
      {/* Your search input */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
        <Typography>
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* <Typography variant='h4'>
            <SearchIcon />
          </Typography> */}
          <TextField
            label="Search.."
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
            style={{ width: '150px' }}
            size="small"
          />
        </div>
      </div>


      {/* Your table */}
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table size="small">
          <TableHead style={{ height: '3em' }}>
            <TableRow>
              <TableCell><b>No.</b></TableCell>
              <TableCell><b>Production No</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Material Weight (kg)</b></TableCell>
              <TableCell><b>Material Qty (coil)</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Setting</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProductions.length > 0 ? (
              filteredProductions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((production, index) => {
                // const overallIndex = page * rowsPerPage + index + 1;
                return (
              <TableRow key={production.id}>
                <TableCell>{index + 1}</TableCell>
                
                <TableCell>{production.productionNo}</TableCell>
                <TableCell>{production.date}</TableCell>
                <TableCell>{production.materialWeight}</TableCell>
                <TableCell>{production.materialQty}</TableCell>
                <TableCell>{production.status}</TableCell>
                <TableCell>
                  {/* Your edit and delete buttons */}
                  <IconButton
                    color="secondary"
                    size='small'
                    onClick={() => handleDeleteProduction(production.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    size='small'
                    onClick={() => handleEditProduction(production)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
                );
                })) : ( 
                  <TableRow>
                  <TableCell align="center" colSpan={7}>No data available</TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Your pagination component */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredProductions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        style={{
            size: 'small',
         }}
      />

      {/* Your delete confirmation modal */}
      <Box>
        {/* Your delete confirmation modal content */}
      </Box>
    </div>
    </Homepage>
  );
};

export default Input;
