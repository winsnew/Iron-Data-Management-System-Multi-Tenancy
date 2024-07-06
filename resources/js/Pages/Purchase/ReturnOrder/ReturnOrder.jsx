import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import { Button, Paper, Typography, Snackbar } from '@mui/material';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Homepage from '../../Components/Homepage';
import Box from '@mui/material/Box';
import { Inertia } from '@inertiajs/inertia'
import { InertiaLink } from '@inertiajs/inertia-react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MuiAlert from '@mui/material/Alert';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';

const ReturnOrder = ({ returnorders, successMessage, deleteMessage }) => {
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [formData, setFormData] = useState({
    return_raw_no: '',
    date: '',
    note: '',
    status: ''
  });
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const url = window.location.href;
  const theme = useTheme();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    if (successMessage) {
      setSnackbarSeverity('success');
      setSnackbarMessage('Item added successfully');
      setSnackbarOpen(true);
    }
  }, [successMessage]);

  useEffect(() => {
    if (deleteMessage) {
      setSnackbarSeverity('warning');
      setSnackbarMessage('Item deleted successfully');
      setSnackbarOpen(true);
    }
  }, [deleteMessage]);

  const refreshPage = async () => {
    try {
      const response = await Inertia.visit(url, { method: 'get', data: {}, replace: false, preserveState: false, preserveScroll: false });
      setItems(response);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleAddItem = async () => {
    try {
      await axios.post('/receive-order', formData);
      closeAddItemModal();
      setFormData({
        return_raw_no: '',
        date: '',
        note: '',
        status: ''
      });
      refreshPage();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDeleteItem = (id) => {
    setItemToDeleteId(id);
    openDeleteConfirmationModal();
  };

  const confirmDelete = () => {
    try {
      axios.delete(`/delete-return-order-raw/${itemToDeleteId}`).then(() => {
      });
      closeDeleteConfirmationModal();
      Inertia.reload();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleUpdateItem = async () => {
    try {
      await axios.put(`/receive-order/${selectedItemId}`, formData);
      closeAddItemModal();
      setFormData({
        return_raw_no: '',
        date: '',
        note: '',
        status: ''
      });
      setSelectedItemId(null);
      refreshPage();
    } catch (error) {
      console.error('Error updating item:', error);
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

  const closeAddItemModal = () => {
    setIsModalOpen(false);
    setFormData({
      return_raw_no: '',
      date: '',
      note: '',
      status: ''
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

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const columns = [
    {
      field: 'no',
      headerName: 'No',
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'return_raw_no',
      headerName: 'return_raw_no',
      editable: false,
      headerAlign: 'center',
      description: 'The identification used by the person with access to the online service.',
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'date',
      headerName: 'date',
      editable: false,
      headerClassName: 'super-app-theme--header',
      valueFormatter: (date) => {
        return date;
      }
    },
    {
      field: 'note',
      headerName: 'note',
      editable: false,
      headerClassName: 'super-app-theme--header',
      valueFormatter: (note) => {
        return note;
      }
    },
    {
      field: 'status',
      headerName: 'status',
      editable: false,
      headerClassName: 'super-app-theme--header',
      valueGetter: (type) => {
        if (type == 0) {
          return 'Draft';
        }
        return 'Recieved';
      },
    },
    {
      field: 'action',
      headerName: 'Actions',
      editable: false,
      headerClassName: 'super-app-theme--header',
      renderCell: (returns) => {
        return (
          <>
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Edit"
              onClick={() => handleDeleteItem(returns.id)}
            />
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Delete"
              href={'/edit-return-order-raw/' + returns.id}
            />
          </>
        );
      }
    },
  ];

  const row = returnorders.map((returns, index) => ({
    id: returns.id,
    no: index + 1,
    return_raw_no: returns.return_raw_no,
    date: returns.date,
    note: returns.note,
    status: returns.status,
    action: returns
  }));

  return (
    <Homepage>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant='h4'>
          Return Order
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: isSmallScreen ? 'column' : 'row' }}>
          <InertiaLink
            href="/return-order-detail"
            style={{
              marginBottom: isSmallScreen ? '10px' : '0'
            }}
          >
            <Button variant="contained" size='small' style={{ marginRight: '20px' }}>
              Raw Product
            </Button>
          </InertiaLink>
          <InertiaLink
            href="/return-order-goods"
            style={{
              marginBottom: isSmallScreen ? '10px' : '0'
            }}
          >
            <Button variant='contained' size='small'>Goods Product</Button>
          </InertiaLink>
        </div>
      </div>
      <hr style={{ color: 'white' }} />
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
          }}
        >
          <Typography variant="h6" gutterBottom>
            Are you sure you want to delete this item?
          </Typography>
          <Button variant="contained" color="primary" onClick={confirmDelete}>
            Yes
          </Button>
          <Button variant="contained" color="secondary" onClick={closeDeleteConfirmationModal} style={{ marginLeft: '10px' }}>
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
            rows={row}
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
                ...returnorders.initialState?.columns,
                id: { hide: true },
              },
            }}
            pageSizeOptions={[10, 25]}
          />
        </Box>
      </Paper>
    </Homepage>
  );
};

export default ReturnOrder;
