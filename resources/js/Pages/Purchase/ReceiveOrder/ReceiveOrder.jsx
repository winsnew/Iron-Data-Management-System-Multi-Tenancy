import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import { Button, Paper, Typography } from '@mui/material';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Homepage from '../../Components/Homepage';
import Box from '@mui/material/Box';
import { Inertia } from '@inertiajs/inertia'
import { InertiaLink, Head } from '@inertiajs/inertia-react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';


const ReceiveOrder = ({ receiveorders, successMessage }) => {
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const theme = useTheme();

  useEffect(() => {
    if (successMessage) {
      setSnackbarSeverity('success');
      setSnackbarMessage('Item added successfully');
      setSnackbarOpen(true);
    }
  }, [successMessage]);

  const handleDeleteItem = (id) => {
    setItemToDeleteId(id);
    openDeleteConfirmationModal();
  };

  const confirmDelete = () => {
    try {
      axios.delete(`/receive-order/${itemToDeleteId}`).then(() => {
        closeDeleteConfirmationModal();
      });
      Inertia.reload();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const openDeleteConfirmationModal = () => {
    setIsDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmationModal = () => {
    setIsDeleteConfirmationOpen(false);
    setItemToDeleteId(null);
  };

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const formatCurrency = (value) => {
    return 'Rp ' + Number(value).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatThousand = (value) => {
    return '' + Number(value).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  };

  const columns = [
    {
      field: 'no',
      headerName: 'No',
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'recieve_raw_no',
      headerName: 'recieve_raw_no',
      editable: false,
      headerAlign: 'center',
      description: 'The identification used by the person with access to the online service.',
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'weight_recieve_total',
      headerName: 'weight_recieve_total',
      editable: false,
      headerClassName: 'super-app-theme--header',
      valueFormatter: (weight_recieve_total) => {
        return `${formatThousand(weight_recieve_total)} Kg`;
      }
    },
    {
      field: 'amount_recieve_total',
      headerName: 'amount_recieve_total',
      editable: false,
      headerClassName: 'super-app-theme--header',
      valueFormatter: (amount_recieve_total) => {
        return `${formatCurrency(amount_recieve_total)}`;
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
      field: 'action',
      headerName: 'Actions',
      editable: false,
      headerClassName: 'super-app-theme--header',
      renderCell: (receive) => {
        return (
          <>
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Edit"
              onClick={() => handleDeleteItem(receive.id)}
            />
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Delete"
              href={'/edit-receive-order-raw/' + receive.id}
            />
          </>
        );
      }
    },
  ];

  const row = receiveorders.map((receive, index) => ({
    id: receive.id,
    no: index + 1,
    recieve_raw_no: receive.recieve_raw_no,
    weight_recieve_total: receive.weight_recieve_total,
    amount_recieve_total: receive.amount_recieve_total,
    note: receive.note,
    status: receive.status,
    action: receive
  }));

  return (
    <ThemeProvider theme={createTheme()}>
      <Homepage>
        <Head title="Receive Order" />
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: isSmallScreen ? 'column' : 'row' }}>
          <Typography variant={isSmallScreen ? 'h5' : 'h4'}>
            Receive Order
          </Typography>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: isSmallScreen ? 'column' : 'row' }}>
            <InertiaLink
              href="/receive-order-detail"
              style={{
                marginBottom: isSmallScreen ? '10px' : '0'
              }}
            >
              <Button variant="contained" style={{ marginRight: '10px' }} size="small">
                Raw Product
              </Button>
            </InertiaLink>
            <Button variant='contained' size="small">Goods Product</Button>
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
                  ...receiveorders.initialState?.columns,
                  id: { hide: true },
                },
              }}
              pageSizeOptions={[10, 25]}
            />
          </Box>
        </Paper>
      </Homepage>
    </ThemeProvider>
  );
};

export default ReceiveOrder;