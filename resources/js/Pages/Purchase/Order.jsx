import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import Modal from '@mui/material/Modal';
import { Button, IconButton, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination } from '@mui/material';
import axios from 'axios';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import SearchIcon from '@mui/icons-material/Search';
import Homepage from '../Components/Homepage';
import Box from '@mui/material/Box';
import { Inertia } from '@inertiajs/inertia'

const ReceiveOrder = ({receiveorders}) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [formData, setFormData] = useState({
    recieve_raw_no: '',
    warehouse_id: '',
    weight_recieve_total: '',
    amount_recieve_total: '',
    note: '',
    status: '',
  });
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  //pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const url = window.location.href;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const filtered = receiveorders.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [items, searchTerm]);

  const refreshPage = async () => {
    try {
      const response = await Inertia.visit(url, { method: 'get', data: {}, replace: false, preserveState: false, preserveScroll: false });
      setItems(response);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    // refreshPage();
  }, []);

  // function refreshPage(){
  //     window.location.reload();
  // }


  const handleAddItem = async () => {
    try {
      await axios.post('/order', formData);
      // fetchItems();
      closeAddItemModal();
      setFormData({
        order_raw_no: '',
        date: '',
        weight_recieve_total: '',
        amount_recieve_total: '',
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
      axios.delete(`/order/${itemToDeleteId}`).then(() => {
        // fetchItems();
        closeDeleteConfirmationModal();
      });
      refreshPage();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleEditItem = (item) => {
    setSelectedItemId(item.id);
    setFormData({
      recieve_raw_no: item.recieve_raw_no,
        warehouse_id: item.warehouse_id,
        weight_recieve_total: item.weight_recieve_total,
        amount_recieve_total: item.amount_recieve_total,
        note: item.note,
        status: item.status,
    });
    openAddItemModal();
  };

  const handleUpdateItem = async () => {
    try {
      await axios.put(`/order/${selectedItemId}`, formData);
      // fetchItems();
      closeAddItemModal();
      setFormData({
        recieve_raw_no: '',
        warehouse_id: '',
        weight_recieve_total: '',
        amount_recieve_total: '',
        note: '',
        status: '',
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

  const openAddItemModal = () => {
    setIsModalOpen(true);
  };

  const closeAddItemModal = () => {
    setIsModalOpen(false);
    setFormData({
        recieve_raw_no: '',
        warehouse_id: '',
        weight_recieve_total: '',
        amount_recieve_total: '',
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

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Homepage>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant='h4'>
          Receive Order
        </Typography>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
        <Typography>

        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='h4'>
            <SearchIcon/>
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
            width: 540,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant='h6' gutterBottom>
            {selectedItemId ? 'Edit Material' : 'Add Material'}
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body1" style={{ marginRight: '10px' }}>
                  Code
                </Typography>
                <TextField
                  label="Code"
                  variant="outlined"
                  name="code"
                  value={formData.code}
                  onChange={handleFormChange}
                  sx={{ width: '300px'}}
                />
              </div>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2}}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body1" style={{ marginRight: '10px' }}>
                  Name
                </Typography>
                <TextField
                  label="Name"
                  variant="outlined"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  sx={{ width: '300px'}}
                />
              </div>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body1" style={{ marginRight: '10px' }}>
                Status
              </Typography>
              <InputLabel id="status-label"></InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                sx={{ width: '300px'}}
              >
                <MenuItem value="1">Active</MenuItem>
                <MenuItem value="0">Inactive</MenuItem>
              </Select>
            </div>
          </FormControl>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <Button variant="contained" color="primary" onClick={handleSaveItem} >
              {selectedItemId ? <UpdateIcon /> : 'Save'}
            </Button>
            <Button variant="contained" color="secondary" onClick={handleCancel} style={{ marginLeft: '10px' }}>
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
          <Button variant="contained" color="primary" onClick={confirmDelete}>
            Yes
          </Button>
          <Button variant="contained" color="secondary" onClick={closeDeleteConfirmationModal} style={{ marginLeft: '10px' }}>
            Cancel
          </Button>
        </Box>
      </Modal>

      {/* Tabel untuk menampilkan item */}
      <div>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Setting</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
             {filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
              const overallIndex = page * rowsPerPage + index + 1;
              return (
              <TableRow key={item.id}>
                <TableCell>{overallIndex}</TableCell>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  {item.status == '1' ? 'Active' : item.status == '0' ? 'Inactive' : ''}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditItem(item)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredItems.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      </div>
    </Homepage>
  );
};

export default ReceiveOrder;
