import React, { useState, useEffect } from 'react';
import { Button, IconButton, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination, Grid, useMediaQuery, useTheme, ThemeProvider, createTheme, Modal } from '@mui/material';
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
import { CheckBox } from '@mui/icons-material';


const InputDetail = () => {
  const [filteredProductions, setFilteredProductions] = useState([]);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [productionToDeleteId, setProductionToDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);


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

  // Modal
  const openAddItemModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    closeAddItemModal();
  }

  const closeAddItemModal = () => {
    setIsModalOpen(false);
    setSelectedItems(null);
  }

  // responsive display
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // color for button
  const buttonSaveColor = '#00a152';
  const buttonCancelColor = '#c62828';

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
          New Input
        </Typography>
      </div>
      <hr style={{color: 'white'}} />

{/* inputan tanggal dan note  */}
    <TableContainer component={Paper} style={{ overflowX: 'auto', overflowY: 'auto', display: 'flex', justifyContent: 'center', padding: '20px' }}>
    <Grid container spacing={isSmallScreen ? 1 : 2}>
    {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: '20px', marginBottom: '60px' }}> */}
          {/* Input Date */}
          <Grid item xs={12} sm={6}>
          <div style={{display: 'flex', justifyContent: 'center'}} >
            <Typography variant='h7' style={{marginRight: '40px', marginTop: '10px'}}>
              Date
            </Typography>
            <TextField
              type="date"
            //   value={selectedDate}
            //   onChange={handleDateChange}
              InputLabelProps={{
                shrink: true,
              }}
              size="small"
              style={{width: '300px', }}
            />
          </div>
          </Grid>


          {/* Input Note */}
          <Grid item xs={12} sm={6}>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Typography variant='h7' style={{marginRight: '40px', marginTop: '10px'}}>
              Note
            </Typography>
            <TextField
              label="Note"
            //   value={note}
            //   onChange={handleNoteChange}
            size="small"
            style={{width: '300px'}}
            />
          </div>
          </Grid>

    {/* </div> */}
    </Grid>
    </TableContainer>
    <br />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant='h4'>
          Raw Product
        </Typography>
        <Button
            variant="contained"
            color="primary"
            onClick={openAddItemModal}
            size="small"
        >
          Add new
        </Button>
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

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleCancel}
        aria-labelledby="add-item-modal"
        aria-describedby="form-for-adding-or-editing-item"
      >

          <Box
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 5
             }}
          >

            <Typography variant='h6' gutterBottom>

              Add Product

            </Typography>

            <hr style={{color:'white'}} />

            {/* Table for displaying item */}
            <TableContainer component={Paper}>
                <Table size='small'>

                    <TableHead>

                        <TableRow>
                            <TableCell>
                                <CheckBox />
                            </TableCell>
                            <TableCell>
                                <b>
                                    Qty
                                </b>
                            </TableCell>
                            <TableCell>
                                <b>
                                    Code
                                </b>
                            </TableCell>
                            <TableCell>
                                <b>
                                    Material
                                </b>
                            </TableCell>
                            <TableCell>
                                <b>
                                    Size
                                </b>
                            </TableCell>
                            <TableCell>
                                <b>
                                    Supplier
                                </b>
                            </TableCell>
                            <TableCell>
                                <b>
                                    Weight (kg)
                                </b>
                            </TableCell>
                            <TableCell>
                                <b>
                                    Price/kg
                                </b>
                            </TableCell>
                        </TableRow>

                    </TableHead>

                    <TableBody>

                    </TableBody>

                </Table>
            </TableContainer>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>

                <Button
                    variant='contained'
                    color='secondary'
                    onClick={handleCancel}
                    style={{ marginRight: '10px' }}
                    size='small'
                >
                    Cancel
                </Button>

                <Button
                    variant='contained'
                    color='success'
                    size='small'
                >
                    Save
                </Button>

            </div>

          </Box>

      </Modal>


      {/* Your table */}
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table size='small'>
          <TableHead style={{ height: '3em' }}>
            <TableRow>
              <TableCell><b>No.</b></TableCell>
              <TableCell><b>Code</b></TableCell>
              <TableCell><b>Material</b></TableCell>
              <TableCell><b>Supplier</b></TableCell>
              <TableCell><b>Weighth (kg)</b></TableCell>
              <TableCell><b>Price/kg</b></TableCell>
              <TableCell><b>Qty</b></TableCell>
              <TableCell><b>We. Amount(kg)</b></TableCell>
              <TableCell><b>Amount</b></TableCell>
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
            ))}
            <TableRow>
                    <TableCell colSpan={6} style={{ textAlign: 'left', paddingLeft: '5%' }}>
                        Total
                    </TableCell>
                    <TableCell colSpan={1} style={{ textAlign: 'left', paddingLeft: '2%' }}>
                        {/* {Number.isInteger(totalWeight) ? totalWeight : totalWeight.toFixed(2)} Kg */}
                        10
                    </TableCell>
                    <TableCell colSpan={1} style={{ textAlign: 'left', paddingLeft: '2%' }}>
                        {/* {Number.isInteger(totalWeight) ? totalWeight : totalWeight.toFixed(2)} Kg */}
                        5.000
                    </TableCell>
                    <TableCell colSpan={2} style={{ textAlign: 'left', paddingLeft: '1%' }}>
                        {/* {formattedTotalAmount} */}
                        52.000.000
                    </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Your pagination component */}
      {/* <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredProductions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
      {/* <hr />
      <div style={{display: 'flex', justifyContent: 'space-around'}}>
        <Typography variant='h7'>
          Total
        </Typography>

        <div style={{display: 'flex', justifyContent: 'space-between', marginLeft: '250px'}}>
            <Typography variant='h7' style={{paddingRight: '50px'}}>
                10
            </Typography>

            <Typography variant='h7' style={{paddingRight: '50px'}}>
                5.000
            </Typography>

            <Typography variant='h7' style={{paddingLeft: '60px'}}>
                52.000.000
            </Typography>
        </div>
      </div> */}


      {/* Your delete confirmation modal */}
      <Box>
        {/* Your delete confirmation modal content */}
      </Box>
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
    </div>
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <InertiaLink href='/input'>
            <Button
            variant="contained"
            color="secondary"
            size='small'
            style={{ backgroundColor: buttonCancelColor || 'secondary', color: 'white' }}
            // onClick={handleCancel}
            >
            Cancel
            </Button>
        </InertiaLink>
        <InertiaLink href='/input'>
        <Button
        variant="contained"
        color="primary"
        size='small'
        style={{ backgroundColor: buttonSaveColor || 'primary', color: 'white', marginLeft: '10px' }}
        // onClick={handleAddItem}
        >
          Save
        </Button>
        </InertiaLink>
      </div>
    </Homepage>
  );
};

export default InputDetail;
