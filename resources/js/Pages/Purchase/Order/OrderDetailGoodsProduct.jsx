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
import Homepage from '../../Components/Homepage';
import Box from '@mui/material/Box';
import { Inertia } from '@inertiajs/inertia'
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';


const OrderDetailGoodsProduct = ({orderdetail}) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [formData, setFormData] = useState({
    pc_recieve_raw_id: '',
    pc_order_raw_detail_id: '',
    reff_po: '',
    code: '',
    size: '',
    weight: '',
    weightPerKg: '',
    pricePerKg: '',
    price: '',
    delivery_cost: '',
    qty_rcv: ''
  });
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  //pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const url = window.location.href;
  const [selectedItems, setSelectedItems] = useState([]);



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [checkedItems, setCheckedItems] = useState([]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const filtered = orderdetail.filter((item) =>
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
      // Calculate the amount based on Weight/kg and Price/kg
      const amount = formData.weightPerKg * formData.pricePerKg;

      // Filter checked items
      const itemsToAdd = orderdetail.filter((item) =>
        checkedItems.includes(item.id)
      );

      // Send request to add items
      await axios.post('/order-detail', { ...formData, amount, itemsToAdd });

      closeAddItemModal();
      setFormData({
        pc_order_raw_id: '',
        raw_product_id: '',
        code: '',
        material: '',
        size: '',
        status: '',
        note: '',
        weightPerKg: '',
        pricePerKg: '',
      });
      setCheckedItems([]);

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
      axios.delete(`/order-detail/${itemToDeleteId}`).then(() => {
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
      pc_order_raw_id: item.pc_order_raw_id,
      raw_product_id: item.raw_product_id,
      code: item.code,
      material: item.material,
      size: item.size,
      status: item.status,
      note: item.note,
    });
    openAddItemModal();
  };

  const handleUpdateItem = async () => {
    try {
      await axios.put(`/order-detail/${selectedItemId}`, formData);
      // fetchItems();
      closeAddItemModal();
      setFormData({
        pc_order_raw_id: '',
        raw_product_id: '',
        code: '',
        material: '',
        size:'',
        status:'',
        note:'',
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
    const itemsToAdd = orderdetail.filter((item) =>
    selectedItems.includes(item.id)
  );
  axios.post('/order-detail', { ...formData, amount, itemsToAdd });
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
      pc_order_raw_id: '',
      raw_product_id: '',
      code: '',
      material: '',
      size:'',
      status:'',
      note:'',
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

  const handleToggleSelect = (itemId) => {
    const updatedSelectedItems = selectedItems.includes(itemId)
      ? selectedItems.filter((id) => id !== itemId)
      : [...selectedItems, itemId];
    setSelectedItems(updatedSelectedItems);
  };

  return (
    <Homepage>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant='h4'>
          Update Order Raw Product
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        </div>
      </div>
      <hr />

      {/* add raw product */}
            <div style={{ display: 'flex', justifyContent: 'center'}}>
        <div style={{ display: 'table-column' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant='h7' style={{ marginRight: '10px' }}>
              Supplier
            </Typography>
            <Select
              label="Supplier"
              variant="outlined"
              value={formData.supplier}
              onChange={handleFormChange}
              style={{ width: '300px' }}
              size="small"
              name="supplier"
            >
              <MenuItem value="supplier1">Supplier 1</MenuItem>
              <MenuItem value="supplier2">Supplier 2</MenuItem>
              {/* Tambahkan opsi sesuai dengan supplier yang ada */}
            </Select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <Typography variant='h7' style={{ marginRight: '32px' }}>
              Note
            </Typography>
            <TextField
              label="Note"
              variant="outlined"
              value={formData.note}
              onChange={handleFormChange}
              style={{ width: '300px' }}
              size="small"
              name="note"
              multiline
              rows={4}
            />
          </div>
        </div>

        {/* sebelah */}

        <div style={{ display: 'table-column' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant='h7' style={{ marginRight: '16px' }}>
              Weight
            </Typography>
            <TextField
              label="Weight"
              variant="outlined"
              value={formData.weight}
              onChange={handleFormChange}
              style={{ width: '270px' }}
              size="small"
              name="weight"
            />
            <Typography variant='h7' style={{ marginLeft: '5px', marginTop: '7px' }}>
              Kg
            </Typography>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
            <Typography variant='h7' style={{ marginRight: '10px' }}>
              Price/kg
            </Typography>
            <TextField
              label="Price/kg"
              variant="outlined"
              value={formData.pricePerKg}
              onChange={handleFormChange}
              style={{ width: '300px' }}
              size="small"
              name="pricePerKg"
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
            <Typography variant='h7' style={{ marginRight: '10px' }}>
              Amount
            </Typography>
            <TextField
              label="Amount"
              variant="outlined"
              value={formData.amount}
              onChange={handleFormChange}
              style={{ width: '300px' }}
              size="small"
              name="amount"
            />
          </div>
        </div>
      </div>




      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '15px'}}>
        <Typography variant='h4'>
          Product
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <Button
            variant="contained"
            onClick={openAddItemModal}
          >
            Add New
          </Button>
        </div>
      </div>
      <hr />


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
              width: 840,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant='h6' gutterBottom>
              Add Product
            </Typography>
            <hr />


            {/* Table for displaying items */}
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Material</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Select</TableCell> {/* Add this line */}
              </TableRow>
            </TableHead>
            <TableBody>
              {orderdetail.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.material}</TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleToggleSelect(item.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
          </TableContainer>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="contained" color="primary" onClick={handleSaveItem}>
                Save
              </Button>
              <Button variant="contained" color="secondary" onClick={handleCancel} style={{ marginLeft: '10px' }}>
                Cancel
              </Button>
            </div>
          </Box>
        </Modal>
      <Typography variant='h4' style={{ marginTop: '20px' }}>

      </Typography>
      {/* Tabel untuk menampilkan item */}
      <div>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table size="small">
          <TableHead style={{height: '3em'}}>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Material</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Setting</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
             {filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
              const overallIndex = page * rowsPerPage + index + 1;
              return (
              <TableRow key={item.id}>
                <TableCell>{overallIndex}</TableCell>
                <TableCell>{item.order_raw_no}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.note}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  {item.status == '1' ? 'Active' : item.status == '0' ? 'Inactive' : ''}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteItem(item.id)}
                    size='small'
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditItem(item)}
                    size='small'
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <hr/>
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

            <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
              <Button variant="contained" color="error" href='/order' style={{ marginRight: '10px' }}>
              Close
              </Button>

             <Button variant="contained" color="primary" href='/order' style={{ marginRight: '10px' }}>
              Clear
              </Button>

            <Button variant="contained" color="success" href='/order' style={{ marginRight: '10px' }}>
              Save
            </Button>
            </div>



    </Homepage>
  );
};

export default OrderDetailGoodsProduct;
