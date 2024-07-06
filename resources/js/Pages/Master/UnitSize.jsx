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
import { Inertia } from '@inertiajs/inertia'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import { InertiaLink, Head } from '@inertiajs/inertia-react';


const UnitSize = ({unit}) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [formData, setFormData] = useState({
    unit: '',
    status: '',
  });
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Add the isLoading declaration and set its initial value
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const url = window.location.href;
  //fitur notif
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  const openSnackbar = (severity, message) => {
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const filtered = unit.filter((item) =>
      item.unit.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [unit, searchTerm]);

  const refreshPage = async () => {
    try {
        const response = await Inertia.visit(url, { method: 'get', data: {}, replace: false, preserveState: true, preserveScroll: false });
        setItems(response);
    } catch (error) {
        console.error('Error fetching items:', error);
    }
  };


const handleAddItem = async () => {
  try {
    await axios.post('/unit-size', formData);
    closeAddItemModal();
    setFormData({
      unit: '',
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

  const confirmDelete = async () => {
    try {
      await axios.delete(`/unit-size/${itemToDeleteId}`);
      closeDeleteConfirmationModal();
      refreshPage();
      openSnackbar('success', 'Item deleted successfully.');
    } catch (error) {
      console.error('Error deleting item:', error);
      openSnackbar('error', 'Error deleting item.');
    }
  };

  const handleEditItem = (item) => {
    setSelectedItemId(item.value.id);
    setFormData({
      unit: item.value.unit,
      status: item.value.status,
    });
    openAddItemModal();
  };

  const handleUpdateItem = async () => {
    try {
      await axios.put(`/unit-size/${selectedItemId}`, formData);
      closeAddItemModal();
      setFormData({
        unit: '',
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
      refreshPage();
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
        unit: '',
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

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  //set data grid variable

  const columns = [
    {
      field: 'no',
      headerName: 'No',
      editable: false,
      width: 50,
    },
    {
      field: 'unit',
      headerName: 'Unit',
      editable: false,
      width: 150,
    },
    {
      field: 'status',
      headerName: 'Status',
      editable: false,
      width: 375,
    },
    {
      field: 'setting',
      headerName: 'Setting',
      editable: false,
      width: 375,
      renderCell: (item) => {
        return (
          <>
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              onClick={() => handleEditItem(item)}
            />
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => handleDeleteItem(item.id)}
            />
          </>
        );
      }
    },
  ];

  const rows = unit.map((item, index) => ({
    id: item.id,
    no: index + 1,
    unit: item.unit,
    status: item.status == 0 ? 'Active' : item.status == 1 ? 'Inactive' : '',
    setting: item
  }));

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Homepage>
    <Head title="Data Master - Unit Size" />
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000} // Durasi notifikasi dalam milidetik (misalnya, 3000 = 3 detik)
          onClose={() => setSnackbarOpen(false)}
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
            onClose={() => setSnackbarOpen(false)}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Typography variant='h4'>
          Unit Size
        </Typography>
        <Button variant="contained" size='small' color="primary" onClick={openAddItemModal}>
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
            width: isSmallScreen ? '90%' : '70%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 5
          }}
        >
          <Typography variant='h6' gutterBottom>
            {selectedItemId ? 'Edit Unit Size' : 'Add Unit Size'}
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column'}}>
          <div style={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', gap: '10px'}}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={4} alignItems="center" justifyContent="flex-start" style={{ display: 'grid', placeItems: 'center', textAlign: 'left' }}>
                    <Typography variant="body1">
                        Unit
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        label="Unit"
                        variant="outlined"
                        name="unit"
                        value={formData.unit}
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
            <Button variant="contained" color="primary" size='small' onClick={handleSaveItem}>
              {selectedItemId ? <UpdateIcon fontSize="small" /> : 'Save'}
            </Button>
            <Button variant="contained" color="secondary" onClick={handleCancel} size='small' style={{ marginLeft: '10px' }}>
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
          <Button variant="contained" color="primary" small='size' onClick={confirmDelete}>
            Yes
          </Button>
          <Button variant="contained" color="secondary" small='size' onClick={closeDeleteConfirmationModal} style={{ marginLeft: '10px' }}>
            Cancel
          </Button>
        </Box>
      </Modal>

      {/* Tabel untuk menampilkan item */}
      {/* <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table size="small">
          <TableHead style={{height: '3em'}}>
            <TableRow>
              <TableCell><b>No.</b></TableCell>
              <TableCell><b>Unit</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Setting</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.length > 0 ? (
              filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
              const overallIndex = page * rowsPerPage + index + 1;
              return (
              <TableRow key={item.id}>
                <TableCell>{overallIndex}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{item.status == '0' ? 'Active' : item.status == '1' ? 'Inactive' : ''}</TableCell>
                <TableCell>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteItem(item.id)}
                    size="small"
                  >
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditItem(item)}
                    size="small"
                  >
                    <EditIcon fontSize="inherit" />
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
      </TableContainer> */}
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
              ...unit.initialState?.columns,
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

export default UnitSize;
