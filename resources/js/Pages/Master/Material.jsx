import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Modal from '@mui/material/Modal';
import { Button, TextField, Paper, Typography, useTheme, useMediaQuery, Grid } from '@mui/material';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import Homepage from '../Components/Homepage';
import Box from '@mui/material/Box';
import { Inertia } from '@inertiajs/inertia'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Head } from '@inertiajs/inertia-react';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';

const Material = ({ materials }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    status: '',
  });
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const url = window.location.href;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

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
      await axios.post('/materials', formData);
      closeAddItemModal();
      setFormData({
        code: '',
        name: '',
        status: '',
      });
      refreshPage();
      setSnackbarSeverity('success');
      setSnackbarMessage('Item added successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding item:', error);
      const errorMessage = error.response?.data?.error || 'Error adding item';
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
      await axios.delete(`/materials/${itemToDeleteId}`);
      closeDeleteConfirmationModal();
      refreshPage();
      setSnackbarSeverity('success');
      setSnackbarMessage('Item deleted successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting item:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Error deleting item');
      setSnackbarOpen(true);
    }
  };

  const handleEditItem = (item) => {
    console.log(item.value);
    setSelectedItemId(item.value.id);
    setFormData({
      code: item.value.code,
      name: item.value.name,
      status: item.value.status,
    });
    openAddItemModal();
  };

  const handleUpdateItem = async () => {
    try {
      await axios.put(`/materials/${selectedItemId}`, formData);
      closeAddItemModal();
      setFormData({
        code: '',
        name: '',
        status: '',
      });
      setSelectedItemId(null);
      refreshPage();
      setSnackbarSeverity('success');
      setSnackbarMessage('Item added successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding item:', error);
      const errorMessage = error.response?.data?.error || 'Error adding item';
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
      code: '',
      name: '',
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

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const columns = [
    {
      field: 'no',
      headerName: 'No',
      editable: false,
      width: 150,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'code',
      headerName: 'Code',
      editable: false,
      width: 150,
      headerAlign: 'center',
      description: 'The identification used by the person with access to the online service.',
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'name',
      headerName: 'Name',
      editable: false,
      width: 400,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'action',
      headerName: 'Actions',
      editable: false,
      width: 400,
      headerClassName: 'super-app-theme--header',
      renderCell: (material) => {
        return (
          <>
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              onClick={() => handleEditItem(material)}
            />
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => handleDeleteItem(material.id)}
            />
          </>
        );
      }
    },
  ];

  const rows = materials.map((material, index) => ({
    id: material.id,
    no: index + 1,
    code: material.code,
    name: material.name,
    action: material
  }));

  return (
    <Homepage>
      <Head title="Data Master - Material" />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000} // Durasi notifikasi dalam milidetik (misalnya, 3000 = 3 detik)
        onClose={closeSnackbar}
        anchorOrigin={{
          vertical: 'bottom', // atau 'bottom'
          horizontal: 'right', // atau 'left' atau 'center'
        }}
        style={{ marginBottom: '30px', marginRight: '30px' }} // Sesuaikan nilai marginTop sesuai keinginan Anda
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={snackbarSeverity}
          onClose={closeSnackbar}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Typography variant='h4'>
          Material
        </Typography>
        <Button variant="contained" color="primary" size='small' onClick={openAddItemModal}>
          Add New
        </Button>
      </div>
      <hr style={{ color: 'white' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
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
            width: isSmallScreen ? '90%' : '540px',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 5
          }}
        >
          <Typography variant='h6' gutterBottom>
            {selectedItemId ? 'Edit Material' : 'Add Material'}
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={2} alignItems="center" justifyContent="flex-start" style={{ display: 'grid', placeItems: 'center', textAlign: 'left' }}>
                <Typography variant="body1">
                  Code
                </Typography>
              </Grid>
              <Grid item xs={10}>
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
              <Grid item xs={2} alignItems="center" justifyContent="flex-start" style={{ display: 'grid', placeItems: 'center', textAlign: 'left' }}>
                <Typography variant="body1">
                  Name
                </Typography>
              </Grid>
              <Grid item xs={10}>
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
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={2} alignItems="center" justifyContent="flex-start" style={{ display: 'grid', placeItems: 'center', textAlign: 'left' }}>
                <Typography variant="body1">
                  Status
                </Typography>
              </Grid>
              <Grid item xs={10}>
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <Button variant="contained" color="primary" size='small' onClick={handleSaveItem} >
              {selectedItemId ? <UpdateIcon fontSize="small" /> : 'Save'}
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
          <Button variant="contained" color="secondary" size='small' onClick={closeDeleteConfirmationModal} style={{ marginLeft: '10px' }}>
            Cancel
          </Button>
        </Box>
      </Modal>
      {/* Data grid untuk menampilkan item */}
      <Paper container>
        <Box
          sx={{
            width: '100%',
            '& .super-app-theme--header': {
              backgroundColor: '#fff',
            },
          }}>
          <DataGrid
            disableColumnSelector
            disableDensitySelector
            density="compact"
            size="small"
            sx={{ '--DataGrid-overlayHeight': '300px', boxShadow: 2 }}
            rows={rows}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
              columns: {
                ...materials.initialState?.columns,
                id: { hide: true }, // Hide the id column
              },
            }}
            pageSizeOptions={[10, 25]}
          />
        </Box>
      </Paper>
    </Homepage>
  );
}

export default Material;
