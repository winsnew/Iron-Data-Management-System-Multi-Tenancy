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
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink } from '@inertiajs/inertia-react';


const BuyDetail = ({buyrawdetail, reciveId, data, returnDetail}) => {
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
  const [selectedItems, setSelectedItems] = useState([]);

  // fitur checkbox tabel
//   const handleSelectAllItems = (event) => {
//     if (event.target.checked) {
//       const allItemIds = filteredItems.map((item) => item.id);
//       setSelectedItems(allItemIds);
//     } else {
//       setSelectedItems([]);
//     }
//   };

//   const handleSelectItem = (event, itemId) => {
//     if (event.target.checked) {
//       setSelectedItems((prevSelectedItems) => [...prevSelectedItems, itemId]);
//     } else {
//       setSelectedItems((prevSelectedItems) =>
//         prevSelectedItems.filter((selectedItemId) => selectedItemId !== itemId)
//       );
//     }
//   };

  // fitur checkbox selesai disini
console.log(reciveId);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const filtered = buyrawdetail.filter((item) => {
      // Check if 'item' is truthy before accessing properties
      if (item && item.order_raw_no) {
        return item.order_raw_no.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false; // Or true, depending on your logic for null items
    });

    // Rest of your code...
  }, [buyrawdetail, searchTerm]);

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
        order_raw_no: item.order_raw_no,
        date: item.date,
        supplier_id: item.supplier_id,
        weight_order_total: item.weight_order_total,
        amount_order_total: item.amount_order_total,
        note: item.note,
        status: item.status,
    });
    openAddItemModal();
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

  console.log(returnDetail);

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return date.toLocaleDateString('ID-id');
  };

    function explodeSizeString(sizeString) {
        if (sizeString === '') {
            return ''; // or some other default value
        }
        // Split the sizeString using "x" as the delimiter
        const explodedArray = sizeString.split('x');

        // Trim each component and convert numerical parts to numbers
        const explodedNumbers = explodedArray.map(part => {
            const trimmedPart = part.trim();
            return /^\d*\.?\d*$/.test(trimmedPart) ? parseFloat(trimmedPart) : trimmedPart;
        });

        // Join the explodedNumbers array with 'x'
        const glue = [' ', ' x '];
        const resultString = explodedNumbers.reduce((a, b, i) => [a, b].join(glue[(i - 1) % glue.length]));

        return resultString;
    }
    function explodeSizeString2(sizeString) {
        // Split the sizeString using "x" as the delimiter
        const explodedArray = sizeString.split('x');

        // Trim each component and convert numerical parts to numbers
        const explodedNumbers = explodedArray.map(part => {
            const trimmedPart = part.trim();
            return /^\d*\.?\d*$/.test(trimmedPart) ? parseFloat(trimmedPart) : trimmedPart;
        });

        // Join the explodedNumbers array with 'x'
        const resultString = explodedNumbers;

        return resultString;
    }

    const formatCurrency = (value) => {
        return 'Rp ' + Number(value).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    };

    const formatThousand = (value) => {
        return '' + Number(value).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    };

    const mergedData = [...data, ...returnDetail];

  return (
    <Homepage>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>
        <Typography variant='h4'>
          Update Buy
        </Typography>
      </div>


        {/* texfield buat update buy */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body1" style={{ width: '100px' }}>
                Po no.
                </Typography>
                <TextField
                label=""
                variant="outlined"
                name="poNo"
                value={reciveId.recieve_raw_no}
                onChange={handleFormChange}
                sx={{ width: '400px' }}
                disabled
                size='small'
                />
            </div>


            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body1" style={{width: '100px' }}>
                Date
                </Typography>
                <TextField
                label=""
                variant="outlined"
                name=""
                value={formatDateTime(reciveId.updated_at)}
                onChange={handleFormChange}
                sx={{ width: '400px' }}
                size='small'
                disabled
                />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body1" style={{ width: '100px' }}>
                Weight
                </Typography>
                <TextField
                label=""
                variant="outlined"
                name="poNo"
                value={formatThousand(reciveId.weight_recieve_total) + ' kg'}
                onChange={handleFormChange}
                sx={{ width: '400px' }}
                disabled
                size='small'
                />
            </div>
            </div>

        {/* kanan */}

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body1" style={{width: '100px' }}>
                Note
                </Typography>
                <TextField
                label=""
                variant="outlined"
                name="note"
                value={reciveId.note}
                onChange={handleFormChange}
                sx={{ width: '400px' }}
                disabled
                size='small'
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body1" style={{ width: '100px' }}>
                Amount
                </Typography>
                <TextField
                label=""
                variant="outlined"
                name=""
                value={formatCurrency(reciveId.amount_recieve_total)}
                onChange={handleFormChange}
                sx={{ width: '400px' }}
                disabled
                size='small'
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body1" style={{ width: '100px' }}>
                Warehouse
                </Typography>
                <TextField
                label=""
                variant="outlined"
                name="pricePerKg"
                value={reciveId.name}
                onChange={handleFormChange}
                sx={{ width: '400px' }}
                disabled
                size='small'
                />
            </div>

        </div>

    </div>

        <hr></hr>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>
        <Typography variant='h4'>
          Produk
        </Typography>
      </div>


      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
        <Typography>
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='h4'>
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

      {/* Tabel untuk menampilkan item */}
      <div>
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell><b>No</b></TableCell>
                <TableCell><b>No Transaction</b></TableCell>
                <TableCell><b>Material</b></TableCell>
                <TableCell><b>Size</b></TableCell>
                <TableCell><b>Supplier</b></TableCell>
                <TableCell><b>Weight (kg</b>)</TableCell>
                <TableCell><b>Price/kg</b></TableCell>
                <TableCell><b>Qty</b></TableCell>
                <TableCell><b>Amount</b></TableCell>
                <TableCell><b>Status</b></TableCell>
              </TableRow>
            </TableHead>
              <TableBody>
                {mergedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
                  const overallIndex = page * rowsPerPage + index + 1;
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{overallIndex}</TableCell>
                      <TableCell>{item.recieve_raw_no == null ? item.return_raw_no : item.recieve_raw_no}</TableCell>
                      <TableCell>{item.materialname == null ? item.material : item.materialname}</TableCell>
                      <TableCell>{explodeSizeString(item.size)}</TableCell>
                      <TableCell>{item.suppliername == null ? item.name : item.suppliername}</TableCell>
                      <TableCell>{formatThousand(item.weight)}</TableCell>
                      <TableCell>{formatCurrency(item.price)}</TableCell>
                      <TableCell>{item.qty_rcv == null ? item.qty_rtn : item.qty_rcv}</TableCell>
                      <TableCell>{formatCurrency(item.weight * item.price * (item.qty_rtn ?? item.qty_rcv))}</TableCell>
                      <TableCell>{item.qty_rcv == null ? (item.status == 1 ? 'Returned' : 'Draft') : (item.status == 1 ? 'Received' : 'Draft')}</TableCell>
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
        count={(data ? data.length : 0) + (returnDetail ? returnDetail.length : 0)}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
              <InertiaLink  href='/buy'>
              <Button size='small' variant="contained" color="error" style={{ marginRight: '10px', width : '100px' }}>
              Close
              </Button>
              </InertiaLink>
      </div>
    </Homepage>
  );
};

export default BuyDetail;
