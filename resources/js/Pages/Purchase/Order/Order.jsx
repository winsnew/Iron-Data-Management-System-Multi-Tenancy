import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import { Button, Menu, MenuItem, Paper, Typography } from '@mui/material';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Homepage from '../../Components/Homepage';
import Box from '@mui/material/Box';
import { Inertia } from '@inertiajs/inertia'
import { InertiaLink, Head } from '@inertiajs/inertia-react';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';


const Order = ({ orders, successMessage }) => {
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [formData, setFormData] = useState({
    order_raw_no: '',
    date: '',
    supplier_id: '',
    weight_order_total: '',
    amount_order_total: '',
    note: '',
    status: '',
  });
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const url = window.location.href;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isMenuRawProduct, setMenuRawProduct] = useState(null);
  const isMenuRawProdcutOpen = Boolean(isMenuRawProduct);

  const formatCurrency = (value) => {
    return 'Rp ' + Number(value).toFixed(0).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatThousand = (value) => {
    return '' + Number(value).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    if (successMessage) {
      setSnackbarSeverity('success');
      setSnackbarMessage('Item added successfully');
      setSnackbarOpen(true);
    }
  }, [successMessage]);

  const refreshPage = async () => {
    try {
      const response = await Inertia.visit(url, { method: 'get', data: {}, replace: false, preserveState: false, preserveScroll: false });
      setItems(response);
    } catch (error) {
      console.error('Error fetching items:', error);
    }

  };

  const handleOrderRawProductMenuOpen = (event) => {
    setMenuRawProduct(event.currentTarget);
  };

  const handleOrderRawProductMenuClose = (event) => {
    setMenuRawProduct(null);
  }

  const handleAddItem = async () => {
    try {
      await axios.post('/receive-order', formData);
      closeAddItemModal();
      setFormData({
        order_raw_no: '',
        date: '',
        supplier_id: '',
        weight_order_total: '',
        amount_order_total: '',
        note: '',
        status: '',
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
      axios.delete(`/order/${itemToDeleteId}`)
      closeDeleteConfirmationModal();
      setSnackbarSeverity('success');
      setSnackbarMessage('Item deleted successfully');
      setSnackbarOpen(true);
      Inertia.reload();
    } catch (error) {
      console.error('Error adding item:', error);
      const errorMessage = error.response?.data?.error || 'Error adding item';
      setSnackbarSeverity('error');
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
      Inertia.reload();
    }
  };

  const handleUpdateItem = async () => {
    try {
      await axios.put(`/receive-order/${selectedItemId}`, formData);
      // fetchItems();
      closeAddItemModal();
      setFormData({
        order_raw_no: '',
        date: '',
        supplier_id: '',
        weight_order_total: '',
        amount_order_total: '',
        note: '',
        status: '',
      });
      setSelectedItemId(null);
      refreshPage();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const closeAddItemModal = () => {
    setIsModalOpen(false);
    setFormData({
      order_raw_no: '',
      date: '',
      supplier_id: '',
      weight_order_total: '',
      amount_order_total: '',
      note: '',
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

  const renderMenuRawProduct = (
    <Menu
        anchorEl={isMenuRawProduct}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'left'
        }}
        id={'primary-search-order-rawproduct-menu'}
        keepMounted
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        open={isMenuRawProdcutOpen}
        onClose={handleOrderRawProductMenuClose}
    >
        <InertiaLink
            href='/generalorder'
            style={{
                textDecoration: 'none',
                color: 'inherit', // Menurunkan warna teks dari induknya
                '&:hover': {
                    backgroundColor: '#e0e0e0', // Menambahkan latar belakang saat dihover
                    cursor: 'pointer', // Mengubah kursor saat dihover
                },
            }}
        >
            <MenuItem>General Item</MenuItem>
        </InertiaLink>
        <MenuItem>Open Order</MenuItem>
    </Menu>
  );

  const columns = [
    {
      field: 'no',
      headerName: 'No',
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'order_raw_no',
      headerName: 'Order Raw No',
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
    },
    {
      field: 'weight_order_total',
      headerName: 'weight_order_total',
      editable: false,
      headerClassName: 'super-app-theme--header',
      valueFormatter: (weight_order_total) => {
        return `${formatThousand(weight_order_total)} Kg`;
      }
    },
    {
      field: 'price_order_total',
      headerName: 'price_order_total',
      editable: false,
      headerClassName: 'super-app-theme--header',
      valueFormatter: (price_order_total) => {
        return `${formatCurrency(price_order_total)}`;
      }
    },
    {
      field: 'amount_order_total',
      headerName: 'amount_order_total',
      editable: false,
      headerClassName: 'super-app-theme--header',
      valueFormatter: (amount_order_total) => {
        return `${formatCurrency(amount_order_total)}`;
      }
    },
    {
      field: 'note',
      headerName: 'note',
      editable: false,
      headerClassName: 'super-app-theme--header',
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
      field: 'type',
      headerName: 'type',
      editable: false,
      headerClassName: 'super-app-theme--header',
      valueGetter: (type) => {
        if (type == 0) {
          return 'Goods Product';
        }
        return 'Raw Product';
      },
    },
    {
      field: 'action',
      headerName: 'Actions',
      editable: false,
      headerClassName: 'super-app-theme--header',
      renderCell: (order) => {
        return (
          <>
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Edit"
              onClick={() => handleDeleteItem(order.id)}
            />
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Delete"
              href={'/edit-order-raw/' + order.id}
            />
          </>
        );
      }
    },
  ];

  const row = orders.map((order, index) => ({
    id: order.id,
    no: index + 1,
    order_raw_no: order.order_raw_no,
    date: order.date,
    weight_order_total: order.weight_order_total,
    price_order_total: order.price_order_total,
    amount_order_total: order.amount_order_total,
    note: order.note,
    type: order.type,
    status: order.status,
    action: order
  }));

  return (
    <Homepage>
      <Head title="Order" />
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
          Order
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <InertiaLink href='/order-detail-raw'>
          </InertiaLink>
            <Button variant="contained" color="primary" size='small' style={{ marginRight: '10px' }} aria-controls='primary-search-order-rawproduct-menu' aria-haspopup="true" onClick={handleOrderRawProductMenuOpen}>
                Raw Product
            </Button>
            {renderMenuRawProduct}
          <Button variant="contained" color="primary" href='/order-detail-goods' size='small' style={{ marginRight: '10px' }}>
            Goods Product
          </Button>
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
            borderRadius: 5
          }}
        >
          <Typography variant="h6" gutterBottom>
            Are you sure you want to delete this item?
          </Typography>
          <Button variant="contained" size='small' color="primary" onClick={confirmDelete}>
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
                ...orders.initialState?.columns,
                id: { hide: true }, // Hide the id column
              },
            }}
            pageSizeOptions={[10, 25]}
          />
        </Box>
      </Paper>
    </Homepage>
  );
};

export default Order;
