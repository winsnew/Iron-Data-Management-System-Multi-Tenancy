import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import { Button, TextField, TableContainer, Paper, Typography, Grid, Snackbar } from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import Homepage from '../../Components/Homepage';
import Box from '@mui/material/Box';
import { Inertia } from '@inertiajs/inertia'
import { InertiaLink } from '@inertiajs/inertia-react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MuiAlert from '@mui/material/Alert';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';

const ReturnOrderDetails = ({ returnorderdetails, return_id, dataNew }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [selectedRaw, setSelectedRaw] = useState([]);
  const [dataDatabase, setDataDatabase] = useState([]);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [note, setNote] = useState(return_id ? return_id.note : '');
  const [codeToDelete, setCodeToDelete] = useState();
  const [reffRcvToDelete, setReffRcvToDelete] = useState();
  const [idToUpdateSaved, setIdToUpdateSaved] = useState(return_id ? return_id.id : 0);
  const [dataTemp, setDataTemp] = useState([]);
  const statusDataDatabaseDelete = 'deleted';
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [postingModal, setPostingModal] = useState(false);

  const closingPostingModal = () => {
    setPostingModal(false);
  }

  const openPostingModal = () => {
    setPostingModal(true);
  };

  const theme = useTheme();

  useEffect(() => {
    if (return_id && return_id.note !== undefined && return_id.note !== null && note === '') {
      if (note === '') {
        setSnackbarSeverity('warning');
        setSnackbarMessage('Jika tidak segera diisi note akan kembali seperti semula dalam 15 detik');
        setSnackbarOpen(true);
      }
      const timeoutId = setTimeout(() => {
        setNote(return_id.note);
      }, 15000);
      return () => clearTimeout(timeoutId);
    }
  }, [return_id, note]);

  useEffect(() => {
    if (return_id) {
      const mappedData = returnorderdetails.map(item => ({
        id: item.id,
        pc_return_raw_id: item.pc_return_raw_id,
        pc_recieve_raw_detail_id: item.pc_recieve_raw_detail_id,
        supplier_id: item.supplier_id,
        reff_rcv: item.reff_rcv,
        code: item.code,
        material: item.material,
        size: item.size,
        weight: item.weight,
        price: item.price,
        qty_rtn: item.qty_rtn,
        status: '',
      }));
      setDataDatabase(mappedData);
    }
  }, [])

  const handleDeleteItem = (item) => {
    setItemToDeleteId(item);
    setCodeToDelete(item);
    setReffRcvToDelete(item);
    openDeleteConfirmationModal();
  };

  const confirmDelete = () => {
    try {
      let updatedDataTemp = [...dataTemp];
      updatedDataTemp = dataTemp.filter((item) => item.id !== itemToDeleteId);
      if (return_id) {
        let updateDataDatabase = [...dataDatabase];
        updateDataDatabase = dataDatabase.filter((item) => item.id !== itemToDeleteId);
      }

      if (!return_id) {
        updatedDataTemp = dataTemp.filter((item) => item.code !== codeToDelete || item.reff_rcv != reffRcvToDelete);
        const deletedDataTemp = dataTemp.filter((item) => item.code === codeToDelete && item.reff_rcv === reffRcvToDelete);
      } else {
        if (return_id) {
          updateDataDatabase = dataDatabase.filter((item) => item.code !== codeToDelete || item.reff_rcv != reffRcvToDelete);
        }
      }

      setDataTemp(updatedDataTemp);
      if (return_id) {
        setDataDatabase(updateDataDatabase);
      }
      setSnackbarSeverity('success');
      setSnackbarMessage('Item removed successfully');
      setSnackbarOpen(true);
      setIsDeleteConfirmationOpen(false);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error removing item';
      setSnackbarSeverity('error');
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };

  const confirmDeleteData = async () => {
    try {
      let updateDataDatabase = [...dataDatabase];
      if (return_id) {
        updateDataDatabase = dataDatabase.map((item) => {
          if (item.id === itemToDeleteId) {
            return {
              ...item,
              status: statusDataDatabaseDelete,
            };
          }
          return item;
        });
        const deleteDataDatabase = dataDatabase.filter((item) => item.id === itemToDeleteId);
      }
      setDataDatabase(updateDataDatabase);
      Inertia.reload();
      setSnackbarSeverity('success');
      setSnackbarMessage('Item removed successfully');
      setSnackbarOpen(true);
      setIsDeleteConfirmationOpen(false);
    } catch (error) {
      console.error('Error removing item:', error);
      const errorMessage = error.response?.data?.error || 'Error removing item';
      setSnackbarSeverity('error');
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };

  const handleSaveItem = async () => {
    try {
      data = await axios.post('/save-return-order-raw', { dataTemp, note });
      setSnackbarSeverity('success');
      setSnackbarMessage('Saved successfully');
      setSnackbarOpen(true);

      Inertia.visit('/return-order');
    } catch (error) {
      const errorMessage = error.response?.data?.data || 'Error saving item';
      setSnackbarSeverity('error');
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
      Inertia.reload();
    }
  };

  const handleSaveUpdateItem = async () => {
    try {
      const data = await axios.put(`/update-return-order-raw/${idToUpdateSaved}`, { dataDatabase, note });
      setSnackbarSeverity('success');
      setSnackbarMessage('Update saved successfully');
      setSnackbarOpen(true);
      setIdToUpdateSaved(0);
      Inertia.visit('/return-order');
    } catch (error) {
      console.error('Error saving item:', error);
      const errorMessage = error.response?.data?.data || 'Error update saving item';
      setSnackbarSeverity('error');
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);

      Inertia.reload();
    }
  };

  const closeAddItemModal = () => {
    setIsModalOpen(false);
  };

  const handleAddSelectedItems = (selection) => {
    setDataDatabase(selection);
    closeAddItemModal();
  };

  const handleCancel = () => {
    closeAddItemModal();
  };

  const handleCancelEdit = () => {
    setCodeToEdit('');
    setReffRcvToEdit('');
    closeEditItemModal();
  };

  const openAddItemModal = () => {
    setIsModalOpen(true);
  };

  const openDeleteConfirmationModal = () => {
    setIsDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmationModal = () => {
    setIsDeleteConfirmationOpen(false);
    setCodeToDelete();
    setReffRcvToDelete();
    setItemToEditId(null);
    setItemToDeleteId(null);
  };


  const buttonSaveColor = '#00a152';
  const buttonCancelColor = '#c62828';

  const formatCurrency = (value) => {
    return 'Rp ' + Number(value).toFixed(0).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatThousand = (value) => {
    return '' + Number(value).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  };

  const calculateTotalAmount = () => {
    let total = 0;

    if (return_id) {
      total = dataDatabase.length > 0 ?
        dataDatabase
          .filter((item) => item.status !== statusDataDatabaseDelete)
          .reduce((acc, item) =>
            acc +
            parseFloat(item.qty_rtn) *
            parseFloat(item.price) *
            parseFloat(item.weight), 0)
        : 0;
    } else {
      total = dataTemp ?
        dataTemp.reduce((acc, item) =>
          acc +
          parseFloat(item.qty_rtn) *
          parseFloat(item.price) *
          parseFloat(item.weight), 0)
        : 0;
    }
    total = formatCurrency(total);
    return total;
  };

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const updateNote = (newNote) => {
    setNote(newNote);
  };

  const updateItemReceiveRawPosting = async () => {
    try {
      const data = await axios.put(`/posting-return-order/${idToUpdateSaved}`, { dataDatabase, note });
      setSnackbarSeverity('success');
      setSnackbarMessage('Update saved successfully');
      setSnackbarOpen(true);

      setIdToUpdateSaved(0);
      Inertia.visit('/return-order');
    } catch (error) {
      console.error('Error saving item:', error);
      const errorMessage = error.response?.data?.data || 'Error update saving item';
      setSnackbarSeverity('error');
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
      Inertia.reload();
    }
  };

  function explodeSizeString(sizeString) {
    const explodedArray = sizeString.split('x');

    const explodedNumbers = explodedArray.map(part => {
      const trimmedPart = part.trim();
      return /^\d*\.?\d*$/.test(trimmedPart) ? parseFloat(trimmedPart) : trimmedPart;
    });
    const glue = [' ', ' x '];
    const resultString = explodedNumbers.reduce((a, b, i) => [a, b].join(glue[(i - 1) % glue.length]));
    return resultString;
  }

  /* Data grid untuk menampilkan item yang sudah di tambahkan */
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
      field: 'code',
      headerName: 'code',
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'material',
      headerName: 'material',
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'size',
      headerName: 'size',
      editable: false,
      headerClassName: 'super-app-theme--header',
      valueFormatter: (size) => {
        return `${explodeSizeString(size)}`;
      }
    },
    {
      field: 'weight',
      headerName: 'weight',
      editable: false,
      headerClassName: 'super-app-theme--header',
      valueFormatter: (weight) => {
        return `${formatThousand(weight)} Kg`;
      }
    },
    {
      field: 'price',
      headerName: 'price',
      editable: false,
      headerClassName: 'super-app-theme--header',
      valueFormatter: (price) => {
        return `${formatCurrency(price)}`;
      }
    },
    {
      field: 'data',
      headerName: 'data',
      editable: false,
      headerClassName: 'super-app-theme--header',
      renderCell: (returns) => {
        return (
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Edit"
            onClick={() => handleDeleteItem(returns.id)}
          />
        );
      }
    },
    {
      field: 'qty_rtn',
      headerName: 'qty_rtn',
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
  ];

  const row = dataDatabase?.map((data, index) => ({
    id: data.id,
    no: index + 1,
    reff_po: data.reff_po,
    recieve_raw_no: data.recieve_raw_no,
    code: data.code,
    material: data.material,
    size: data.size,
    weight: data.weight,
    price: data.price,
    qty_rtn: data.qty_rtn,
  }));

  function explodeSizeString(sizeString) {
    const explodedArray = sizeString.split('x');
    const explodedNumbers = explodedArray.map(part => {
      const trimmedPart = part.trim();
      return /^\d*\.?\d*$/.test(trimmedPart) ? parseFloat(trimmedPart) : trimmedPart;
    });
    const glue = [' ', ' x '];
    const resultString = explodedNumbers.reduce((a, b, i) => [a, b].join(glue[(i - 1) % glue.length]));
    return resultString;
  }

  /* Data grid untuk menampilkan item yang akan di tambahkan */
  const columnsAdd = [
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
      field: 'code',
      headerName: 'code',
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'material',
      headerName: 'material',
      editable: false,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'size',
      headerName: 'size',
      editable: false,
      headerClassName: 'super-app-theme--header',
      valueFormatter: (size) => {
        return `${explodeSizeString(size)}`;
      }
    },
    {
      field: 'weight',
      headerName: 'weight',
      editable: false,
      headerClassName: 'super-app-theme--header',
      valueFormatter: (weight) => {
        return `${formatThousand(weight)} Kg`;
      }
    },
    {
      field: 'price',
      headerName: 'price',
      editable: false,
      headerClassName: 'super-app-theme--header',
      valueFormatter: (price) => {
        return `${formatCurrency(price)}`;
      }
    },
  ];

  const rowAdd = dataNew?.map((data, index) => ({
    id: data.id,
    no: index + 1,
    reff_po: data.reff_po,
    recieve_raw_no: data.recieve_raw_no,
    code: data.code,
    material: data.material,
    size: data.size,
    weight: data.weight,
    price: data.price,
    qty_rtn: data.qty_rtn,
  }));

  console.log(rowAdd);

  const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) => rowAdd.find((row) => row.id === id));
    setSelectedRaw(selectedRowsData);
  };

  return (
    <ThemeProvider theme={createTheme()}>
      <Homepage>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
          <Modal
            open={postingModal}
            onClose={closingPostingModal}
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
                borderRadius: 5,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Are you sure you want posting?
              </Typography>
              <Button variant="contained" color="success" onClick={updateItemReceiveRawPosting}>
                Yes
              </Button>
              <Button variant="contained" color="error" onClick={closingPostingModal} sx={{ ml: '10px' }}>
                Cancel
              </Button>
            </Box>
          </Modal>
          <Typography variant='h4'>
            Return Order Raw Product
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          </div>
        </div>
        <hr />
        <TableContainer component={Paper} style={{ marginTop: '20px', overflowX: 'auto', padding: '10px' }}>
          <Grid container spacing={isSmallScreen ? 2 : 3}>
            <Grid item xs={12} sm={6}>
              {/* Note Section */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant='h7' style={{ marginRight: '10px' }}>
                  Note
                </Typography>
                <TextField
                  label="Note"
                  variant="outlined"
                  value={note}
                  onChange={(e) => updateNote(e.target.value)}
                  style={{ width: '100%' }}
                  size="small"
                  multiline
                />
              </div>
            </Grid>
          </Grid>
        </TableContainer>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', flexWrap: 'wrap' }}>
          <Typography
            variant='h4'
          >
            Product
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <Button
              variant="contained"
              onClick={openAddItemModal}
              size='small'
            >
              Add New
            </Button>
          </div>
        </div>
        <hr style={{ color: '#fff' }} />
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
              bgcolor: 'background.paper',
              width: '80%',
              boxShadow: 24,
              p: 4,
              maxHeight: '100vh',
              overflow: 'auto',
              borderRadius: 5,
            }}
          >
            <Typography variant='h6' gutterBottom>
              Add Product
            </Typography>
            <hr style={{ color: 'white' }} />
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
                  checkboxSelection
                  density="compact"
                  size="small"
                  sx={{ '--DataGrid-overlayHeight': '300px', boxShadow: 2 }}
                  rows={rowAdd}
                  columns={columnsAdd}
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{
                    toolbar: {
                      showQuickFilter: true,
                    },
                  }}
                  disableSelectionOnClick
                  onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                    columns: {
                      ...dataNew.initialState?.columns,
                      id: { hide: true },
                    },
                  }}
                  pageSizeOptions={[10, 25]}
                />
              </Box>
            </Paper>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="contained" color="primary" size='small' onClick={() => handleAddSelectedItems(selectedRaw)}>
                Save
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
            }}
          >
            <Typography variant="h6" gutterBottom>
              Are you sure you want to delete this item?
            </Typography>
            <Button variant="contained" color="primary" size='small' onClick={itemToDeleteId ? confirmDeleteData : confirmDelete}>
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
                  ...dataDatabase.initialState?.columns,
                  id: { hide: true },
                },
              }}
              pageSizeOptions={[10, 25]}
            />
          </Box>
        </Paper>
        {return_id ? (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={openPostingModal}
            >
              Posting
            </Button>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <InertiaLink href='/return-order'>
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ backgroundColor: buttonCancelColor || 'secondary', color: 'white' }}
                  onClick={handleCancel}
                  size="small"
                >
                  Cancel
                </Button>
              </InertiaLink>
              <Button
                variant="contained"
                color="primary"
                style={{ backgroundColor: buttonSaveColor || 'primary', color: 'white', marginLeft: '10px' }}
                size="small"
                onClick={handleSaveUpdateItem}
              >
                Update
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <InertiaLink href='/return-order'>
              <Button
                variant="contained"
                color="secondary"
                style={{ backgroundColor: buttonCancelColor || 'secondary', color: 'white' }}
                onClick={handleCancel}
                size="small"
              >
                Cancel
              </Button>
            </InertiaLink>
            <Button
              variant="contained"
              color="primary"
              style={{ backgroundColor: buttonSaveColor || 'primary', color: 'white', marginLeft: '10px' }}
              onClick={handleSaveItem}
              size="small"
            >
              Save
            </Button>
          </div>
        )}
      </Homepage>
    </ThemeProvider >
  );
};

export default ReturnOrderDetails;

