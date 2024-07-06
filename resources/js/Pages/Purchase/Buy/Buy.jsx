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
import Checkbox from '@mui/material/Checkbox';
import { Inertia } from '@inertiajs/inertia'
import VisibilityIcon from '@mui/icons-material/Visibility';
import { InertiaLink } from '@inertiajs/inertia-react';



const Buy = ({buy, Receive, Supplier, ReceiveRaw, OrderRawDetail, OrderRaw}) => {
  
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const [searchTerm, setSearchTerm] = useState('');
  //pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const url = window.location.href;
  const [selectedItems, setSelectedItems] = useState('');
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [isBuyConfirmationOpen, setIsBuyConfirmationOpen] = useState(false);
  const [itemBuy, setItemBuy] = useState([]);

  // fitur checkbox tabel
  const handleSelectAllItems = (event) => {
    const isChecked = event.target.checked;
  
    // Update the state of the header checkbox
    setSelectAllChecked(isChecked);
  
    // Select or deselect all items based on the state of the header checkbox
    const allItemIds = Receive.map((item) => item.id);
    setSelectedItems(isChecked ? allItemIds :  [] );
  };
  
  const handleSelectItem = (event, itemId) => {
    if (event.target.checked) {
      // Clear the selected items array and add the newly selected item
      setSelectedItems([itemId]);
    } else {
      // If the item is unchecked, clear the selected items array
      setSelectedItems([]);
    }
  };


  // fitur checkbox selesai disini

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const filtered = buy.filter((item) => {
      // Check if 'item' is truthy before accessing properties
      if (item && item.order_raw_no) {
        return item.order_raw_no.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false; // Or true, depending on your logic for null items
    });
  
    // Set filtered items to state
    setFilteredItems(filtered);
  }, [buy, searchTerm]);
  

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
      await axios.post('/receive-order', formData);
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
        order_raw_no: item.receive_raw_no,
        date: item.date,
        supplier_id: item.supplier_id,
        weight_order_total: item.weight_order_total,
        amount_order_total: item.amount_order_total,
        note: item.note,
        status: item.status,
    });
    history.push('/BuyDetail');
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

  const handleSaveItem = () => {
    if (selectedItemId) {
      handleUpdateItem();
    //   refreshPage();
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

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Modify the openBuyConfirmationModal function to accept an array of item IDs
const openBuyConfirmationModal = (selectedItems) => {
  // Extract additional details of selected items, if needed
  const selectedItemsDetails = selectedItems.map(itemId => {
    // Add logic to retrieve item details based on the item ID
    const selectedItem = Receive.find(item => item.id === itemId);
    return selectedItem;
  });

  // Logic to open the modal with combined details
  setIsBuyConfirmationOpen((prevOpenModals) => ({
    ...prevOpenModals,
    combinedData: {
      isOpen: true,
      selectedItems: selectedItemsDetails,
    },
  }));
};

  const closeBuyConfirmationModal = () => {
    setIsBuyConfirmationOpen(false)
  };

  console.log(selectedItems);

  const confirmBuy = async (selectedItems) => {
    try {
    const selectedItemsDetails = selectedItems.map(itemId => {
      // Add logic to retrieve item details based on the item ID
      const selectedItem = Receive.find(item => item.id === itemId);
      return selectedItem;
    });
    setItemBuy(selectedItemsDetails);

    
      // Use the selected items directly as the data parameter
      await axios.post('/buy', {selectedItemsDetails});
      closeBuyConfirmationModal();
      refreshPage();
    } catch (error) {
      // Handle error as needed
      console.error('Error during buy confirmation:', error);
    }
  }

  console.log(selectedItems)

  return (
    <Homepage>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant='h4'>
          Buy
        </Typography>
      </div>
      <hr style={{color: "white"}} />

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
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>
                </TableCell>
                <TableCell><b>RC No.</b></TableCell>
                <TableCell><b>Date</b></TableCell>
                <TableCell><b>Warehouse</b></TableCell>
                <TableCell><b>Note</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Setting</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Receive.length > 0 ?
                Receive.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
                const overallIndex = page * rowsPerPage + index + 1;
                let tanggal = new Date(item.updated_at);
                let tahun = tanggal.getFullYear();
                let bulan = String(tanggal.getMonth() + 1).padStart(2, '0'); // Menambahkan leading zero jika perlu
                let hari = String(tanggal.getDate()).padStart(2, '0'); // Menambahkan leading zero jika perlu
                // Mendapatkan komponen waktu
                let jam = String(tanggal.getHours()).padStart(2, '0'); // Menambahkan leading zero jika perlu
                let menit = String(tanggal.getMinutes()).padStart(2, '0'); // Menambahkan leading zero jika perlu
                let detik = String(tanggal.getSeconds()).padStart(2, '0'); // Menambahkan leading zero jika perlu

                // Membuat string dalam format yang diinginkan
                let formattedDate = `${tahun}-${bulan}-${hari} ${jam}:${menit}:${detik}`;
                return (
                  <>
                   <Modal
                      open={isBuyConfirmationOpen.combinedData?.isOpen}
                      onClose={() => closeBuyConfirmationModal()}
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
                          Are you sure you want to Buy this?
                          {/* Display details of each selected item */}
                            {isBuyConfirmationOpen.combinedData?.selectedItems.map(item => (
                              <div key={item.id}>
                                {/* Display item details as needed */}
                                {item.recieve_raw_no},
                              </div>
                            ))}
                        </Typography>
                        <Button variant="contained" color="primary" onClick={() => confirmBuy(selectedItems)}>
                          Yes
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => closeBuyConfirmationModal()} style={{ marginLeft: '10px' }}>
                          Cancel
                        </Button>
                      </Box>
                    </Modal>

                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(item.id)} 
                        onChange={(event) => handleSelectItem(event, item.id)}
                      />
                    </TableCell>
                    <TableCell>{item.recieve_raw_no}</TableCell>
                    <TableCell>{formattedDate}</TableCell>

                    <TableCell>{item.name}</TableCell> {/* assuming there is a 'name' property in supplier */}
                    <TableCell>{item.note}</TableCell>
                    <TableCell>{item.status == 1 ? 'Received' : 'Draft'}</TableCell>
                    <TableCell>
                      <InertiaLink href={'/detail-buy/' + item.id}>
                        <VisibilityIcon style={{color: "grey"}} />
                      </InertiaLink>
                    </TableCell>
                  </TableRow>
                  </>
                );
              }) : (
              <TableRow>
                <TableCell align="center" colSpan={7}>No data available</TableCell>
              </TableRow>
            )}
            </TableBody>

          </Table>
        </TableContainer>
      <hr style={{color: "white"}}/>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={Receive.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
              {/*<Button size='small' variant="contained" color="error" href='#' style={{ marginRight: '10px', width : '100px' }}>
              Close
              </Button>*/}
             <Button size='small' variant="contained" color="success" onClick = {() => openBuyConfirmationModal(selectedItems)} style={{ marginRight: '10px', width : '100px'}}>
              Save
              </Button>
      </div>
    </Homepage>
  );
};

export default Buy;
