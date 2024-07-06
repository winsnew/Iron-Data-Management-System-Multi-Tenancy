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
import { InertiaLink } from '@inertiajs/inertia-react';

const ResultDetail = () => {
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
          Update Result
        </Typography>
        {/* <Button variant="contained" color="primary" href='/resultdetail' >
          Add new
        </Button> */}
      </div>
      <hr />

      <div style={{display:'flex', justifyContent: 'space-around', marginBottom: '50px'}}>

        <div style={{display:'table-column', justifyContent: 'center'}}>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Typography variant='h7' style={{marginRight: '20px', marginTop: '6px'}}>
                Production No.
                </Typography>
                <TextField
                label="PO-098383892"
                //   value={note}
                //   onChange={handleNoteChange}
                size="small"
                style={{width: '300px'}}
                disabled
                />
            </div>

            <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                <Typography variant='h7' style={{marginRight: '95px', marginTop: '6px'}}>
                Date
                </Typography>
                <TextField
                label="12-08-2023"
                //   value={note}
                //   onChange={handleNoteChange}
                size="small"
                style={{width: '300px'}}
                disabled
                />
            </div>
        </div>

            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Typography variant='h7' style={{marginRight: '20px', marginTop: '6px'}}>
                Note
                </Typography>
                <TextField
                label="Note"
                //   value={note}
                //   onChange={handleNoteChange}
                size="small"
                style={{width: '300px'}}
                multiline  // Menjadikan TextField menjadi multi-line
                rows={4}
                />
            </div>

        

      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant='h4'>
          Raw product
        </Typography>
        <Button variant="contained" color="primary" href='/resultdetail' size='small'>
          Add new
        </Button>
      </div>
      <hr />

      {/* Your search input */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
        <Typography>
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='h4'>
            <SearchIcon />
          </Typography>
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


      {/* raw table */}
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell><b>No.</b></TableCell>
              <TableCell><b>Code</b></TableCell>
              <TableCell><b>Material</b></TableCell>
              <TableCell><b>Size</b></TableCell>
              <TableCell><b>Supplier</b></TableCell>
              <TableCell><b>Weight (kg)</b></TableCell>
              <TableCell><b>Price/kg</b></TableCell>
              <TableCell><b>Qty</b></TableCell>
              <TableCell><b>Qty Used</b></TableCell>
              <TableCell><b>Setting</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProductions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((production, index) => (
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
                    onClick={() => handleDeleteProduction(production.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditProduction(production)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
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
      />

      <hr />

    <div style={{display:'flex', justifyContent: 'space-around'}}>
         <Typography variant='h7'>
          Total
        </Typography>

        <div style={{display:'flex', justifyContent:'space-around'}}>
            <Typography variant='h7' style={{paddingLeft: '180px'}}>
            5 
            </Typography> 
            {/* ganti pake function tambah total qty*/}

            <Typography variant='h7' style={{paddingLeft: '80px'}}>
            -
            </Typography>
        </div>        
    </div>

    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '50px' }}>
        <Typography variant='h4'>
          Goods Product
        </Typography>
        <Button variant="contained" color="primary" href='/resultdetail' size='small'>
          Add new
        </Button>

    </div>
      <hr />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
        <Typography>
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='h4'>
            <SearchIcon />
          </Typography>
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

      {/* goods table */}
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell><b>No.</b></TableCell>
              <TableCell><b>Code</b></TableCell>
              <TableCell><b>Product Name</b></TableCell>
              <TableCell><b>Material</b></TableCell>
              <TableCell><b>Quality</b></TableCell>
              <TableCell><b>Size</b></TableCell>
              <TableCell><b>Type</b></TableCell>
              <TableCell><b>Qty</b></TableCell>
              <TableCell><b>Setting</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProductions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((production, index) => (
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
                    onClick={() => handleDeleteProduction(production.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditProduction(production)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
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
      />

      <div style={{display:'flex', justifyContent:'flex-end'}}>
        <InertiaLink href='/input'>
                <Button
                variant="contained"
                color="error"
                // onClick={handleCancel}
                >
                Cancel
                </Button>
        </InertiaLink>

        <InertiaLink href='/input'>
                <Button
                variant="contained"
                color="success"
                // onClick={handleCancel}
                style={{marginLeft: '10px'}}
                >
                Save
                </Button>
        </InertiaLink>
      </div>
      
      {/* Your delete confirmation modal */}
      <Box>
        {/* Your delete confirmation modal content */}
      </Box>
    </div>
    </Homepage>
  );
};

export default ResultDetail;
