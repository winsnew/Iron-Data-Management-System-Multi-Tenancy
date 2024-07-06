import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import Modal from '@mui/material/Modal';
import { Button, IconButton, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination, useTheme, useMediaQuery, Grid } from '@mui/material';
import axios from 'axios';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress } from '@mui/material';
import Homepage from '../Components/Homepage';
import Box from '@mui/material/Box';
import { Inertia } from '@inertiajs/inertia';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { InertiaLink, Head } from '@inertiajs/inertia-react';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';

const Warehouse = ({warehouse}) => {
  const [warehouses, setWarehouses] = useState([]);
  const [filteredWarehouses, setFilteredWarehouses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    address: '',
    pic: '',
    desc: '',
    status: '',
  });
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);
  const [warehouseToDeleteId, setWarehouseToDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const url = window.location.href;

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');


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

  useEffect(() => {
    const filtered = warehouse.filter((warehouse) =>
      warehouse.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWarehouses(filtered);
  }, [warehouse, searchTerm]);

  const refreshPage = async () => {
    try {
      const response = await Inertia.visit(url, { method: 'get', data: {}, replace: false, preserveState: true, preserveScroll: false });
      setWarehouses(response);

      // Show success notification
      setSnackbarSeverity('success');
      setSnackbarMessage('Warehouse data updated successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error fetching items:', error);
      // Show error notification
      setSnackbarSeverity('error');
      setSnackbarMessage('Error fetching warehouse data');
      setSnackbarOpen(true);
    }
  };

const handleAddWarehouse = async () => {
  try {
    await axios.post('/warehouse', formData);
    closeAddWarehouseModal();
    setFormData({
      code: '',
      name: '',
      address: '',
      pic: '',
      desc: '',
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

  const handleDeleteWarehouse = (id) => {
    setWarehouseToDeleteId(id);
    openDeleteConfirmationModal();
  };

  const confirmDeleteWarehouse = async () => {
    try {
      await axios.delete(`/warehouse/${warehouseToDeleteId}`);
      closeDeleteConfirmationModal();
      refreshPage();
      // Show success notification
      setSnackbarSeverity('success');
      setSnackbarMessage('Warehouse deleted successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting warehouse:', error);
      // Show error notification
      setSnackbarSeverity('error');
      setSnackbarMessage('Error deleting warehouse');
      setSnackbarOpen(true);
    }
  };

  const handleEditWarehouse = (warehouse) => {
    setSelectedWarehouseId(warehouse.value.id);
    setFormData({
      code: warehouse.value.code,
      name: warehouse.value.name,
      address: warehouse.value.address,
      pic: warehouse.value.pic,
      desc: warehouse.value.desc,
      status: warehouse.value.status,
    });
    openAddWarehouseModal();
  };

  const handleUpdateWarehouse = async () => {
    try {
      await axios.put(`/warehouse/${selectedWarehouseId}`, formData);
      closeAddWarehouseModal();
      setFormData({
        code: '',
        name: '',
        address: '',
        pic: '',
        desc: '',
        status: '',
      });
      setSelectedWarehouseId(null);
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

  const handleSaveWarehouse = () => {
    if (selectedWarehouseId) {
      handleUpdateWarehouse();
      refreshPage();
    } else {
      handleAddWarehouse();
    }
  };

  const handleCancel = () => {
    closeAddWarehouseModal();
  };

  const openAddWarehouseModal = () => {
    setIsModalOpen(true);
  };

  const closeAddWarehouseModal = () => {
    setIsModalOpen(false);
    setFormData({
      code: '',
      name: '',
      address: '',
      pic: '',
      desc: '',
      status: '',
    });
    setSelectedWarehouseId(null);
  };

  const openDeleteConfirmationModal = () => {
    setIsDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmationModal = () => {
    setIsDeleteConfirmationOpen(false);
    setWarehouseToDeleteId(null);
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

  // set data grid variable
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
      field: 'address',
      headerName: 'Address',
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
      field: 'desc',
      headerName: 'Description',
      editable: false,
      width: 375,
    },
    {
      field: 'status',
      headerName: 'Status',
      editable: false,
      width: 375,
      renderCell: (params) => {
        <span>{params.row.status = '0' ? 'Active' : params.row.status = '1' ? 'Inactive' : ''}</span>
      }
    },
    {
      field: 'setting',
      headerName: 'Setting',
      editable: false,
      width: 375,
      renderCell: (warehouse) => {
        return (
          <>
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              onClick={() => handleEditWarehouse(warehouse)}
            />
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => handleDeleteWarehouse(warehouse.id)}
            />
          </>
        );
      }
    },
  ];

  const rows = warehouse.map((warehouse, index) => ({
    id: warehouse.id,
    no: index + 1,
    code: warehouse.code,
    name: warehouse.name,
    address: warehouse.address,
    pic: warehouse.pic,
    desc: warehouse.desc,
    status: warehouse.status,
    setting: warehouse
  }));
  console.log(rows)

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Homepage>
    <Head title="Data Master - Warehouse" />
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Typography variant='h4'>
          Warehouse
        </Typography>
        <Button variant="contained" color="primary" size='small' onClick={openAddWarehouseModal}>
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
          />
        </div>
      </div>

      {/* Modal for adding or editing warehouse */}
      <Modal
        open={isModalOpen}
        onClose={handleCancel}
        aria-labelledby="add-warehouse-modal"
        aria-describedby="form-for-adding-or-editing-warehouse"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isSmallScreen ? '90%' : '70%',
            height: 'auto',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            overflowY: 'auto',
            borderRadius: 5
          }}
        >
          <Typography variant='h6' gutterBottom>
            {selectedWarehouseId ? 'Edit Warehouse' : 'Add Warehouse'}
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column'}}>
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
            <FormControl fullWidth sx={{ mb: 2 }}>
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
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column'}}>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', flexWrap: isSmallScreen ? 'wrap' : 'nowrap' }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={4} alignItems="center" justifyContent="flex-start" style={{ display: 'grid', placeItems: 'center', textAlign: 'left' }}>
                        <Typography variant="body1">
                            Description
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            label="Description"
                            variant="outlined"
                            name="desc"
                            value={formData.desc}
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
                            autoComplete="off"
                        >
                            <MenuItem value="0">Active</MenuItem>
                            <MenuItem value="1">Inactive</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </FormControl>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <Button variant="contained" color="primary" size='small' onClick={handleSaveWarehouse}>
              {selectedWarehouseId ? 'Update' : 'Save'}
            </Button>
            <Button variant="contained" color="secondary" size='small' onClick={handleCancel} style={{ marginLeft: '10px' }}>
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={isDeleteConfirmationOpen}
        onClose={closeDeleteConfirmationModal}
        aria-labelledby="delete-confirmation-modal"
        aria-describedby="confirmation-dialog-for-deleting-warehouse"
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
            Are you sure you want to delete this warehouse?
          </Typography>
          <Button variant="contained" color="primary" size='small' onClick={confirmDeleteWarehouse}>
            Yes
          </Button>
          <Button variant="contained" color="secondary" size='small' onClick={closeDeleteConfirmationModal} style={{ marginLeft: '10px' }}>
            Cancel
          </Button>
        </Box>
      </Modal>

      {/* Table for displaying warehouses */}
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
              ...warehouse.initialState?.columns,
              id: { hide: true }, // Hide the id column
            },
          }}
          
        />
      </Box>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredWarehouses.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Homepage>
  );
};

export default Warehouse;
