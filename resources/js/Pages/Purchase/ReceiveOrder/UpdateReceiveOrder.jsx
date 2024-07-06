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
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

const UpdateReceiveOrder = ({updatereceiveorders, warehouses}) => {
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
    price: '',
    delivery_cost: '',
    qty_rcv: ''
  });
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [warehouseId, setWarehouseId] = useState('');

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
    const filtered = updatereceiveorders.filter((item) =>
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
    fetchWarehouseOption();
  }, []);

  // function refreshPage(){
  //     window.location.reload();
  // }

  const fetchWarehouseOption = async () => {
    try {
        setWarehouseOptions(warehouses);
    } catch (error) {
        console.error('Error fetching Warehouse Option:', error);
    }
  };


  const handleAddItem = async () => {
    try {
      await axios.post('/receive-order', formData);
      // fetchItems();
      closeAddItemModal();
      setFormData({
        pc_recieve_raw_id: '',
        pc_order_raw_detail_id: '',
        reff_po: '',
        code: '',
        size: '',
        weight: '',
        price: '',
        delivery_cost: '',
        qty_rcv: ''
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
      axios.delete(`/receive-order/${itemToDeleteId}`).then(() => {
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
        pc_recieve_raw_id: item.pc_recieve_raw_id,
        pc_order_raw_detail_id: item.pc_order_raw_detail_id,
        reff_po: item.reff_po,
        code: item.code,
        size: item.size,
        weight: item.weight,
        price: item.price,
        delivery_cost: item.delivery_cost,
        qty_rcv: item.qty_rcv
    });
    openAddItemModal();
  };

  const handleUpdateItem = async () => {
    try {
      await axios.put(`/receive-order/${selectedItemId}`, formData);
      // fetchItems();
      closeAddItemModal();
      setFormData({
        pc_recieve_raw_id: '',
        pc_order_raw_detail_id: '',
        reff_po: '',
        code: '',
        size: '',
        weight: '',
        price: '',
        delivery_cost: '',
        qty_rcv: ''
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
        pc_recieve_raw_id: '',
        pc_order_raw_detail_id: '',
        reff_po: '',
        code: '',
        size: '',
        weight: '',
        price: '',
        delivery_cost: '',
        qty_rcv: ''
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

  const handleWarehouseChange = (event) => {
    setWarehouseId(event.target.value);
  };

  return (
    <Homepage>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant='h4'>
          Update Receive Order
        </Typography>
      </div>
      <hr />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant='h7' style={{ marginRight: '40px' }}>
                Trx No.
            </Typography>
            <TextField
                label=""
                variant="outlined"
                style={{ width: '350px' }}
                size="small"
                disabled
            />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant='h7' style={{ marginRight: '25px' }}>
                Date
            </Typography>
            <TextField
                label=""
                variant="outlined"
                style={{ width: '350px' }}
                size="small"
                disabled
            />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0%' }}>
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between', marginTop: '1%' }}>
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography variant='h7' style={{ marginRight: '56px' }}>
                    Type
                </Typography>
                <TextField
                    label=""
                    variant="outlined"
                    style={{ width: '350px' }}
                    size="small"
                    disabled
                />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px' }}>
                <Typography variant='h7' style={{ marginRight: '32px' }}>
                    Supplier
                </Typography>
                <TextField
                    label=""
                    variant="outlined"
                    style={{ width: '350px' }}
                    size="small"
                    disabled
                />
            </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '5px', flexDirection: 'row' }}>
            <Typography variant='h7' style={{ marginRight: '25px', marginBottom: '14%' }}>
                Note
            </Typography>
            <TextField
                label=""
                variant="outlined"
                multiline
                style={{ width: '350px' }}
                size="small"
                rows={3}
            />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <Typography variant='h7' style={{ marginRight: '10px' }}>
          Warehouse
        </Typography>
        <InputLabel id='warehouse-label'></InputLabel>
        <Select
          labelId='warehouse-label'
          id='warehouse-select'
          value={warehouseId}
          onChange={handleWarehouseChange}
          style={{ width: '350px' }}
          size="small"
        >
          {warehouses.map((warehouse) => (
            <MenuItem key={warehouse.id} value={warehouse.id}>
              {warehouse.name}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
        <Typography variant='h4'>
          Item
        </Typography>
        <Button variant="contained" color="primary" onClick={openAddItemModal}>
          Add Item
        </Button>
      </div>
      <hr />

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
            {selectedItemId ? 'Update Item' : 'Add Item'}
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body1" style={{ marginRight: '10px' }}>
                  Item Name
                </Typography>
                <InputLabel id="itemName-label"></InputLabel>
                <Select
                    labelId="itemName-label"
                    id="itemName"
                    name="itemName"
                    value={formData.name}
                    onChange={handleFormChange}
                    sx={{ width: '300px'}}
                >
                    <MenuItem value="">Nama 1</MenuItem>
                    <MenuItem value="">Nama 2</MenuItem>
                </Select>
              </div>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2}}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body1" style={{ marginRight: '10px' }}>
                  Dimention
                </Typography>
                <TextField
                  label=""
                  variant="outlined"
                  name="size"
                  value={formData.size}
                  onChange={handleFormChange}
                  sx={{
                    width: '300px',
                    backgroundColor: 'gray',
                    // borderRadius: '10px',
                  }}
                  InputProps={{
                        readOnly:true,
                        style: {
                            // color: 'green'
                        }
                   }}
                   disabled
                />
              </div>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2}}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body1" style={{ marginRight: '10px' }}>
                  Weight
                </Typography>
                <TextField
                  label=""
                  variant="outlined"
                  name="weight"
                  value={formData.weight}
                  onChange={handleFormChange}
                  sx={{
                    width: '300px',
                    backgroundColor: 'gray',
                    // borderRadius: '10px',
                  }}
                  InputProps={{
                        readOnly:true,
                        style: {
                            // color: 'green'
                        }
                   }}
                   disabled
                />
              </div>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2}}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body1" style={{ marginRight: '10px' }}>
                  Price
                </Typography>
                <TextField
                  label=""
                  variant="outlined"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  sx={{
                    width: '300px',
                    // backgroundColor: 'gray',
                    // borderRadius: '10px',
                  }}
                  InputProps={{
                        // readOnly:true,
                        style: {
                            // color: 'green'
                        }
                   }}
                //    disabled
                />
              </div>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2}}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body1" style={{ marginRight: '10px' }}>
                  Order Qty
                </Typography>
                <TextField
                  label=""
                  variant="outlined"
                  name="amount_order_total"
                  value={formData.amount_order_total}
                  onChange={handleFormChange}
                  sx={{
                    width: '300px',
                    backgroundColor: 'gray',
                    // borderRadius: '10px',
                  }}
                  InputProps={{
                        readOnly:true,
                        style: {
                            // color: 'green'
                        }
                   }}
                   disabled
                />
              </div>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2}}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body1" style={{ marginRight: '10px' }}>
                  Received Qty
                </Typography>
                <TextField
                  label=""
                  variant="outlined"
                  name="qty_rcv"
                  value={formData.qty_rcv}
                  onChange={handleFormChange}
                  sx={{
                    width: '300px',
                    // backgroundColor: 'gray',
                    // borderRadius: '10px',
                  }}
                  InputProps={{
                        // readOnly:true,
                        style: {
                            // color: 'green'
                        }
                   }}
                //    disabled
                />
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
              <TableCell>Material Name</TableCell>
              <TableCell>Dimention Weight</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Order Qty</TableCell>
              <TableCell>Receive Qty</TableCell>
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
                <TableCell>{item.code.name}</TableCell>
                <TableCell>{item.size}</TableCell>
                <TableCell>{item.weight}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.pc_order_raw_detail_id.qty}</TableCell>
                <TableCell>{item.qty_rcv}</TableCell>
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
      <hr />
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredItems.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <Button variant="contained" color="secondary" href='/receive-order' style={{ marginRight: '50px', padding: '5px 30px' }}>
              Close
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveItem} style={{ padding: '5px 30px' }}>
              {selectedItemId ? <UpdateIcon /> : 'Save'}
            </Button>
          </div>
      </div>
    </Homepage>
  );
};

export default UpdateReceiveOrder;

{/* <Modal
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
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant='h6' gutterBottom>
            {selectedItemId ? 'Edit Product' : 'Add Product'}
          </Typography>
          <hr />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
            <Typography>
            </Typography>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant='h7' style={{ marginRight: '10px' }}>
                    {/* <SearchIcon/> */}
    //                 Search
    //             </Typography>
    //             <TextField
    //                 label="Search.."
    //                 variant="outlined"
    //                 value={searchTerm}
    //                 onChange={handleSearch}
    //                 style={{ width: '150px' }}
    //                 size="small"
    //             />
    //         </div>
    //       </div>
    //       <FormControl fullWidth sx={{ mb: 2 }}>
    //         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    //          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
    //             <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
    //             <Checkbox
    //             style={{ marginRight: '20px' }}
    //             value="checkedA"
    //             inputProps={{
    //                 'aria-label': 'Checkbox A',
    //                 // style: {
    //                 //     marginRight: '20px'
    //                 // }
    //             }} />
    //             <Typography variant="body1" style={{ marginRight: '30px' }}>
    //               Qty
    //             </Typography>
    //             <Typography variant="body1" style={{ marginRight: '50px' }}>
    //               Reff PO
    //             </Typography>
    //             <Typography variant="body1" style={{ marginRight: '50px' }}>
    //               Reff RC
    //             </Typography>
    //             <Typography variant="body1" style={{ marginRight: '50px' }}>
    //               Code
    //             </Typography>
    //             <Typography variant="body1" style={{ marginRight: '20px' }}>
    //               Material
    //             </Typography>
    //             <Typography variant="body1" style={{ marginRight: '20px' }}>
    //               Size
    //             </Typography>
    //             <Typography variant="body1" style={{ marginRight: '20px' }}>
    //               Supplier
    //             </Typography>
    //             <Typography variant="body1" style={{ marginRight: '20px' }}>
    //               Weight(kg)
    //             </Typography>
    //             <Typography variant="body1" style={{ marginRight: '20px' }}>
    //               Price/kg
    //             </Typography>
    //             </div>
    //          </div>
    //         </div>
    //       </FormControl>
    //       <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
    //         <Button variant="contained" color="primary" onClick={handleSaveItem} >
    //           {selectedItemId ? <UpdateIcon /> : 'Save'}
    //         </Button>
    //         <Button variant="contained" color="secondary" onClick={handleCancel} style={{ marginLeft: '10px' }}>
    //           Cancel
    //         </Button>
    //       </div>
    //     </Box>
    //   </Modal> */}
