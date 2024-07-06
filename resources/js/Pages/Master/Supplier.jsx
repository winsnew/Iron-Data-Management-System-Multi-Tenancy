import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import Modal from '@mui/material/Modal';
import { Button, IconButton, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination, useTheme, useMediaQuery, Grid } from '@mui/material';
import axios from 'axios';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { DataGrid, GridToolbar, GridActionsCellItem, GridCell } from '@mui/x-data-grid';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress } from '@mui/material';
import Homepage from '../Components/Homepage';
import Box from '@mui/material/Box';
import { Inertia } from '@inertiajs/inertia'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { InertiaLink, Head } from '@inertiajs/inertia-react';


const Supplier = ({supplier}) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: '',
    address: '',
    phone: '',
    pic: '',
    payment_due: '',
    status: '',
  });
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const url = window.location.href;

  // Add the isLoading declaration and set its initial value
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // or 'error' for delete
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const openSnackbar = (severity, message) => {
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

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

  const refreshPage = async () => {
    try {
        const response = await Inertia.visit(url, { method: 'get', data: {}, replace: false, preserveState: true, preserveScroll: false });
        setItems(response);
    } catch (error) {
        console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const filtered = supplier.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [supplier, searchTerm]);

  const fetchItems = async () => {
    try {
      // Set isLoading to true before making the request
      // setIsLoading(true);
      setItems(supplier);
      // Set isLoading to false after successfully fetching data
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      // setIsLoading(false);
    }
  };

  const handleAddItem = async () => {
    try {
      await axios.post('/supplier', formData);
      // fetchItems();
      closeAddItemModal();
      setFormData({
        code: '',
        name: '',
        type: '',
        address: '',
        phone: '',
        pic: '',
        payment_due: '',
        status: '',
      });
      refreshPage();
      // Show success notification
      setSnackbarSeverity('success');
      setSnackbarMessage('Item added successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding item:', error);

      // Extract and display the error message from the response
      const errorMessage = error.response?.data?.error || 'Error adding item';

      // Show error notification
      setSnackbarSeverity('error');
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };

  const handleDeleteItem = (id) => {
    setItemToDeleteId(id);
    openDeleteConfirmationModal();
  };

  const confirmDelete = () => {
    try {
      axios.delete(`/supplier/${itemToDeleteId}`).then(() => {
        // fetchItems();
        closeDeleteConfirmationModal();
        refreshPage();
        openSnackbar('error', 'Item deleted successfully.');
      });
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleEditItem = (item) => {
    setSelectedItemId(item.value.id);
    setFormData({
      code: item.value.code,
      name: item.value.name,
      type: item.value.type,
      address: item.value.address,
      phone: item.value.phone,
      pic: item.value.pic,
      payment_due: item.value.payment_due,
      status: item.value.status,
    });
    openAddItemModal();
  };

  const handleUpdateItem = async () => {
    try {
      await axios.put(`/supplier/${selectedItemId}`, formData);
      // fetchItems();
      closeAddItemModal();
      setFormData({
        code: '',
        name: '',
        type: '',
        address: '',
        phone: '',
        pic: '',
        payment_due: '',
        status: '',
      });
      setSelectedItemId(null);
      refreshPage();
      // Show success notification
      setSnackbarSeverity('success');
      setSnackbarMessage('Item added successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding item:', error);

      // Extract and display the error message from the response
      const errorMessage = error.response?.data?.error || 'Error adding item';

      // Show error notification
      setSnackbarSeverity('error');
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };

  const handleSaveItem = () => {
    if (selectedItemId) {
      handleUpdateItem();
    } else {
      handleAddItem();
    }
  };

  const handleCancel = () => {
    closeAddItemModal();
  };

  const openAddItemModal = () => {
    setIsModalOpen(true);
  };

  const closeAddItemModal = () => {
    setIsModalOpen(false);
    setFormData({
        code: '',
        name: '',
        type: '',
        address: '',
        phone: '',
        pic: '',
        payment_due: '',
        status: '',
    });
    setSelectedItemId(null);
  };

  const openDeleteConfirmationModal = () => {
    setIsDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmationModal = () => {
    setIsDeleteConfirmationOpen(false);
    setItemToDeleteId(null);
  };


  const getTypeLabel = (value) => {
    // Define the mapping of integer values to string labels
    const typeMap = {
      1: 'Raw Product',
      0: 'Goods Product',
      // Add more mappings as needed
    };

    // Use the mapping to get the corresponding label
    return typeMap[value] || '';
  };

  const getStatusLabel = (value) => {
      const statusMap = {
          1: 'Active',
          0: 'Inactive',
          // Add more mappings as needed
      };
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // if (isLoading) {
  //   return (
  //     <div
  //       style={{
  //         display: 'flex',
  //         flexDirection: 'column',
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //         height: '100vh', // Adjust as needed
  //       }}
  //     >
  //       <Typography variant="h6" style={{ marginBottom: '10px' }}>
  //         Loading...
  //       </Typography>
  //       <CircularProgress />
  //     </div>
  //   );
  // }

  // data grid 
  const columns = [
    {
      field: 'no',
      headerName: 'No',
      editable: false,
      width: 50,
    },
    {
      field: 'code',
      headerName: 'Code',
      editable: false,
      width: 150,
    },
    {
      field: 'name',
      headerName: 'Name',
      editable: false,
      width: 375,
    },
    {
      field: 'type',
      headerName: 'Type',
      editable: false,
      width: 375,
      
    },
    {
      field: 'pic',
      headerName: 'PIC',
      editable: false,
      width: 375,
    },
    {
      field: 'address',
      headerName: 'Address',
      editable: false,
      width: 375,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      editable: false,
      width: 375,
    },
    {
      field: 'payment_due',
      headerName: 'Payment Due',
      editable: false,
      width: 375,
    },
    {
      field: 'status',
      headerName: 'Status',
      editable: false,
      width: 375,
      renderCell: (params) => (
        <span>{params.row.status == '0' ? 'Active' : params.row.status == '1' ? 'Inactive' : ''}</span>
      )
    },
    {
      field: 'setting',
      headerName: 'Setting',
      width: 150,
      renderCell: (item) => (
        <><IconButton color="primary" onClick={() => handleEditItem(item)} size="small">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDeleteItem(item.id)} size="small">
            <DeleteIcon fontSize="small" />
          </IconButton>
          
        </>
      ),
    },
  ];
  
  const rows = supplier.map((item, index) => ({
    id: item.id,
    no: index + 1,
    code: item.code,
    name: item.name,
    type: getTypeLabel(item.type),
    address: item.address,
    phone: item.phone,
    payment_due: item.payment_due,
    pic: item.pic,
    status: item.status,
    setting: item
  }));

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Homepage>
    <Head title="Data Master - Supplier" />
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={4000}
      onClose={closeSnackbar}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      style={{ marginBottom: '30px', marginRight: '30px' }}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        severity={snackbarSeverity}
        onClose={closeSnackbar}
        sx={{
          backgroundColor: snackbarSeverity === 'success' ? '#4CAF50' : '#FF3232',
          color: '#fff', // Set text color to white for better visibility
        }}
      >
        {snackbarMessage}
      </MuiAlert>
    </Snackbar>
      <div style={{display: 'flex',alignItems: 'center',justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Typography variant='h4'>
          Supplier
        </Typography>
        <Button variant="contained" color="primary" size='small' onClick={openAddItemModal}>
          Add new
        </Button>
      </div>
      <hr style={{color: 'white'}} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
        <Typography>

        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <TextField
            label="Search.."
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
            style={{ width: '150px' }}
            size="small"
            autoComplete="off"
          />
        </div>
      </div>
      {/* Modal untuk menambah atau mengedit item */}
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
            width: isSmallScreen ? '90%' : '80%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 5
          }}
        >
          <Typography variant='h6' gutterBottom>
            {selectedItemId ? 'Edit Supplier' : 'Add Supplier'}
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', flexWrap: isSmallScreen ? 'wrap' : 'nowrap' }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={4} alignItems="center" justifyContent="flex-start" style={{ display: 'grid', placeItems: 'center', textAlign: 'left' }}>
                        <Typography variant="body1">
                            Code
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            label="Code"
                            variant="outlined"
                            name="code"
                            value={formData.code}
                            onChange={handleFormChange}
                            sx={{ width: '100%' }}
                            size='small'
                            autoComplete="off"
                        />
                    </Grid>
                </Grid>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={4} alignItems="center" justifyContent="flex-start" style={{ display: 'grid', placeItems: 'center', textAlign: 'left' }}>
                        <Typography variant="body1">
                            Name
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            label="Name"
                            variant="outlined"
                            name="name"
                            value={formData.name}
                            onChange={handleFormChange}
                            sx={{ width: '100%' }}
                            size='small'
                            autoComplete="off"
                        />
                    </Grid>
                </Grid>
            </FormControl>
          </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column'}}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', flexWrap: isSmallScreen ? 'wrap' : 'nowrap' }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={4} alignItems="center" justifyContent="flex-start" style={{ display: 'grid', placeItems: 'center', textAlign: 'left' }}>
                        <Typography variant="body1">
                            Type
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            select
                            label="Type"
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleFormChange}
                            sx={{ width: '100%' }}
                            size='small'
                            autoComplete="off"
                        >
                            <MenuItem value="1">Raw Product</MenuItem>
                            <MenuItem value="0">Goods Product</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={4} alignItems="center" justifyContent="flex-start" style={{ display: 'grid', placeItems: 'center', textAlign: 'left' }}>
                        <Typography variant="body1">
                            Address
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            label="Address"
                            variant="outlined"
                            name="address"
                            value={formData.address}
                            onChange={handleFormChange}
                            sx={{ width: '100%' }}
                            size='small'
                            autoComplete="off"
                        />
                    </Grid>
                </Grid>
          </FormControl>
          </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column'}}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', flexWrap: isSmallScreen ? 'wrap' : 'nowrap' }}>
          <FormControl fullWidth sx={{ mb: 2}}>
            <Grid container spacing={2}>
                <Grid item xs={4} alignItems="center" justifyContent="flex-start" style={{ display: 'grid', placeItems: 'center', textAlign: 'left' }}>
                    <Typography variant="body1">
                        Phone
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        label="Phone"
                        variant="outlined"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        sx={{ width: '100%' }}
                        size='small'
                        autoComplete="off"
                    />
                </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={4} alignItems="center" justifyContent="flex-start" style={{ display: 'grid', placeItems: 'center', textAlign: 'left' }}>
                        <Typography variant="body1">
                            Payment Due (day)
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            label="Payment Due"
                            variant="outlined"
                            name="payment_due"
                            value={formData.payment_due}
                            onChange={handleFormChange}
                            sx={{ width: '100%' }}
                            size='small'
                            autoComplete="off"
                        />
                    </Grid>
                </Grid>
          </FormControl>
          </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column'}}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', flexWrap: isSmallScreen ? 'wrap' : 'nowrap' }}>
          <FormControl fullWidth sx={{ mb: 2}}>
                 <Grid container spacing={2}>
                    <Grid item xs={4} alignItems="center" justifyContent="flex-start" style={{ display: 'grid', placeItems: 'center', textAlign: 'left' }}>
                        <Typography variant="body1">
                            PIC
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            label="PIC"
                            variant="outlined"
                            name="pic"
                            value={formData.pic}
                            onChange={handleFormChange}
                            sx={{ width: '100%' }}
                            size='small'
                            autoComplete="off"
                        />
                    </Grid>
                </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2}}>
                <Grid container spacing={2}>
                    <Grid item xs={4} alignItems="center" justifyContent="flex-start" style={{ display: 'grid', placeItems: 'center', textAlign: 'left' }}>
                        <Typography variant="body1">
                            Status
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            select
                            label="Status"
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleFormChange}
                            sx={{ width: '100%' }}
                            size='small'
                        >
                            <MenuItem value="0">Active</MenuItem>
                            <MenuItem value="1">Inactive</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </FormControl>
          </div>
          </div>



          <div style={{ display:'flex', justifyContent:'flex-end', marginTop:'20px' }}>
            <Button variant="contained" color="primary" size='small' onClick={handleSaveItem}>
              {selectedItemId ? 'Update' : 'Save'}
            </Button>
            <Button variant="contained" color="secondary" size='small' onClick={handleCancel} style={{ marginLeft: '10px' }}>
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
      {/* Modal konfirmasi penghapusan */}
      <Modal
        open={isDeleteConfirmationOpen}
        onClose={closeDeleteConfirmationModal}
        aria-labelledby="delete-confirmation-modal"
        aria-describedby="confirmation-dialog-for-deleting-item"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 370,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            textAlign: 'center',
            borderRadius: 5
          }}
        >
          <Typography variant="h6" gutterBottom>
            Are you sure you want to delete this item?
          </Typography>
          <Button variant="contained" color="primary" size='small' onClick={confirmDelete}>
            Yes
          </Button>
          <Button variant="contained" size='small' color="secondary" onClick={closeDeleteConfirmationModal} style={{ marginLeft: '10px' }}>
            Cancel
          </Button>
        </Box>
      </Modal>

      {/* Tabel untuk menampilkan item */}
      <Box style={{ width: '100%' }}>
        <DataGrid
          disableColumnSelector
          disableDensitySelector
          density="compact"
          size="small"
          sx={{ '--DataGrid-overlayHeight': '300px', boxShadow: 2 }}
          component={Paper}
          rows={rows}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
            columns: {
              ...supplier.initialState?.columns,
              id: { hide: true }, // Hide the id column
            },
          }}
          
        />
      </Box>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredItems.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Homepage>
  );
};

export default Supplier;
