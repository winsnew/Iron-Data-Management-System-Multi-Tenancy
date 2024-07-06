import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import Modal from '@mui/material/Modal';
import { Button, IconButton, Grid, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination } from '@mui/material';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Homepage from '../../Components/Homepage';
import Box from '@mui/material/Box';
import { Inertia } from '@inertiajs/inertia'
import { Head } from '@inertiajs/inertia-react';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { Checkbox } from '@mui/material';
import { NumericFormat } from 'react-number-format';

const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(
  props,
  ref,
) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
      prefix="Rp "
    />
  );
});
const NumericFormatCustom2 = React.forwardRef(function NumericFormatCustom(
  props,
  ref,
) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
      prefix=""
    />
  );
});


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const OrderDetailRawProduct = ({ orderdetailraw, data, supplier, order_id, id, dataRc, orderDetailId, dataRecieve }) => {
  const [items, setItems] = useState([]);
  const [dataDatabase, setDataDatabase] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [postingModal, setPostingModal] = useState(false);
  const [formData, setFormData] = useState({
    order_raw_no: '',
    date: '',
    supplier_id: '',
    weight_order_total: '',
    price_order_total: '',
    amount_order_total: '',
    note: '',
    status: '',
  });
  const [formDataEditDetail, setFormDataEditDetail] = useState({
    code: '',
    material: '',
    size: '',
    status: '',
    note: '',
  });

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  //pagination
  // For the first TablePagination component
  const [page1, setPage1] = useState(0);
  const [rowsPerPage1, setRowsPerPage1] = useState(5);

  // For the second TablePagination component
  const [page2, setPage2] = useState(0);
  const [rowsPerPage2, setRowsPerPage2] = useState(5);
  const url = window.location.href;
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedDataOrder, setSelectedDataOrder] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  //comnined data from database and state
  const [dataTemp, setDataTemp] = useState([]);
  const filteredArray = dataTemp ? Object.values(dataTemp) : [];
  const dataArray = orderdetailraw || [];
  const combinedData = [...dataArray, ...filteredArray];
  const [sessionData, setSessionData] = useState([]);
  const [idItem, setIdItem] = useState([]);

  // const [calculatedAmount, setCalculatedAmount] = useState('');
  const [closeNote, setCloseNote] = useState(false);

  const [checkedItems, setCheckedItems] = useState([]);
  const [openEditOrderDetail, setOpenEditOrderDetail] = useState(false);
  //fitur notif
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [pageRc, setPageRc] = useState(0);
  const [rowsPerPageRc, setRowsPerPageRc] = useState(5);

  const [dataRcState, setDataRcState] = useState([]);
  const [dataRcStateDetail, setDataRcStateDetail] = useState([]);
  const [dataExistData, setDataExistData] = useState(false);

  console.log(dataRc);

  const handleChangePage = (event, newPage) => {
    setPageRc(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPageRc(parseInt(event.target.value, 10));
    setPageRc(0);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  const closingPostingModal = () => {
    setPostingModal(false);
  }

  const openPostingModal = () => {
    setPostingModal(true);
  };

  const handleChangePage1 = (event, newPage) => {
    setPage1(newPage);
  };

  const handleChangeRowsPerPage1 = (event) => {
    setRowsPerPage1(parseInt(event.target.value, 10));
  };

  const handleChangePage2 = (event, newPage) => {
    setPage2(newPage);
  };

  const handleChangeRowsPerPage2 = (event) => {
    setRowsPerPage2(parseInt(event.target.value, 10));
  };

  const openEditOrderDetailModal = (itemId, itemCode) => {
    const existData = dataRc.flatMap((item) => item.order_detail.map((data) => data)).some((data) => data.id === itemId);
    const matchingDataRecieveDetail = dataRc.filter((item) =>
      item.reff_po === orderDetailId
    );
    // const dataIds = dataRecieve.map((data) => data.id);
    const matchingDataRecieve = matchingDataRecieveDetail.map((item) =>
      item.pc_recieve_raw_id
    );
    const matchingData = dataRecieve?.filter((data) =>
      matchingDataRecieve.includes(data.id)
    );
    const matchingDataDetail = dataRc?.filter((data) =>
      matchingData.some((item) => item.id === data.pc_recieve_raw_id)
    );

    const dataRecieveDetail = matchingDataDetail?.filter((data) =>
      data.code == itemCode
    );

    console.log('test', matchingDataRecieveDetail);
    console.log('test', dataRecieveDetail);
    setDataRcStateDetail(dataRecieveDetail);
    setDataRcState(matchingData);
    setDataExistData(existData);
    // Find the item based on itemId
    const selectedItem = combinedData.find(item => item.id === itemId);

    // Update the formDataEditDetail state with the selected item's data
    setFormDataEditDetail({
      code: selectedItem.code,
      material: selectedItem.material,
      size: selectedItem.size,
      status: selectedItem.status,
      note: selectedItem.note,
    });

    setOpenEditOrderDetail(() => ({
      [itemId]: true, // Set the specific item's modal to open
    }));
  }

  const closeEditOrderDetailModal = (itemId, index) => {
    setOpenEditOrderDetail(() => ({
      [itemId]: false, // Set the specific item's modal to open
    }));
  }

  useEffect(() => {
    // Check if id exists
    if (order_id) {
      // Update formData state with the fetched data
      setFormData({
        ...formData,
        order_raw_no: order_id.order_raw_no,
        date: order_id.date,
        supplier_id: order_id.supplier_id,
        weight_order_total: order_id.weight_order_total,
        price_order_total: order_id.price_order_total,
        amount_order_total: order_id.amount_order_total,
        note: order_id.note,
        status: order_id.status,
      });
    }
  }, [order_id]);

  useEffect(() => {
    // Check if id exists
    if (order_id) {
      const mappedData = orderdetailraw.map(item => ({
        id: item.id,
        pc_order_raw_id: item.pc_order_raw_id,
        raw_product_id: item.raw_product_id,
        code: item.code,
        material: item.material,
        size: item.size,
        status: item.status,
        note: item.note,
      }));

      setDataDatabase(mappedData);
    }
  }, [order_id, orderdetailraw]);

  console.log(dataDatabase);

  useEffect(() => {
    const filtered = orderdetailraw.filter((item) =>
      item.material.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [items, searchTerm]);

  const handleRemoveItemMaterialTemp = (itemId, itemCode) => {
    // Check if there is at least one item in idItem

    const itemToDelete = dataDatabase.find(item => item.code === itemCode);
    const itemToDelete2 = dataTemp.find(item => item.code === itemCode);
    if (itemToDelete) {
      // If itemCode exists in dataDatabase, filter out the item and update the state
      const updatedData = dataDatabase.filter(item => item.code !== itemCode);
      setDataDatabase(updatedData);

      setSnackbarSeverity('success');
      setSnackbarMessage('Item deleted successfully');
      setSnackbarOpen(true);
    } else {
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    if (itemToDelete2) {
      // If itemCode exists in dataDatabase, filter out the item and update the state
      const updatedData = dataTemp.filter(item => item.code !== itemCode);
      setDataTemp(updatedData);

      setSnackbarSeverity('success');
      setSnackbarMessage('Item deleted successfully');
      setSnackbarOpen(true);
    } else {
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    // Show success notification
    setSnackbarSeverity('success');
    setSnackbarMessage('Item deleted successfully');
    setSnackbarOpen(true);
  };

  const handleRemoveItemMaterialData = async (itemId, itemCode) => {
    await axios.delete(`/order-detail-raw/${itemId}`);
    refreshPage();
    setSnackbarSeverity('success');
    setSnackbarMessage('Item deleted successfully');
    setSnackbarOpen(true);
  };

  const handleAddItemMaterialTemp = (index) => {
    const selectedItem = data[index];

    const newItem = {
      id: selectedItem.id,
      raw_product_id: selectedItem.id,
      code: selectedItem.code,
      material: selectedItem.name,
      size: selectedItem.size,
      status: selectedItem.status,
      note: '',
    };

    const newData = [...dataTemp, newItem];
    setDataTemp(newData);
    closeAddItemModal();
    setSnackbarSeverity('success');
    setSnackbarMessage('Item added successfully');
    setSnackbarOpen(true);
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
      // Send request to add items
      data = await axios.post('/add-order-raw', { ...formData, dataTemp });
      closeAddItemModal();
      setCheckedItems([]);

      // Show success notification
      setSnackbarSeverity('success');
      setSnackbarMessage('Item added successfully');
      setSnackbarOpen(true);

      // Visit another page after showing the success notification
      Inertia.visit('/order')
    } catch (error) {
      console.error('Error adding item:', error);

      // Extract and display the error message from the response
      const errorMessage = error.response?.data?.data || 'Error adding item';

      // Show error notification
      setSnackbarSeverity('error');
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);

      // Reload the page if there is an error
      Inertia.reload();
    }
  };

  const confirmDelete = () => {
    try {
      axios.delete(`/order-detail-raw'/${itemToDeleteId}`).then(() => {
        closeDeleteConfirmationModal();
      });
      refreshPage();
      // Show success notification
      setSnackbarSeverity('success');
      setSnackbarMessage('Item deleted successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding item:', error);

      // Extract and display the error message from the response
      const errorMessage = error.response?.data?.error || 'Error adding item';

      // Show error notification
      setSnackbarSeverity('error');
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };

  const handleEditItem = (item) => {
    setSelectedItemId(item.id);
    openAddItemModal();
    refreshPage();
  };

  const splitPathname = url.split("/")
  const itemId = splitPathname[splitPathname.length - 1]

  const handleUpdateItem = async () => {
    try {
      // Save the order raw first
      await axios.post('/add-order-raw', formData);
      closeAddItemModal();
      setSelectedItemId(null);
      Inertia.reload();
      // Show success notification
      setSnackbarSeverity('success');
      setSnackbarMessage('Item added successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding item:', error);

      // Extract and display the error message from the response
      const errorMessage = error.response?.data?.error || 'Error adding item';

      // Show error notification
      setSnackbarSeverity('error');
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };

  //update order raw
  const handleUpdateItemIdMaterial = async () => {
    try {
      // Send request to add items
      await axios.put('/update-order-raw/' + itemId, { ...formData, dataDatabase });
      closeAddItemModal();
      setSelectedItemId(null);
      // Show success notification
      setSnackbarSeverity('success');
      setSnackbarMessage('Item updated successfully');
      setSnackbarOpen(true);

      // Visit another page after showing the success notification
      Inertia.visit('/order')
    } catch (error) {
      console.error('Error adding item:', error);

      // Extract and display the error message from the response
      const errorMessage = error.response?.data?.data || 'Error adding item';

      // Show error notification
      setSnackbarSeverity('error');
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);

      // Reload the page if there is an error
    }
  };

  const updateItemReceiveRawPosting = async () => {
    try {
      // Send request to add items
      await axios.put('/posting-order-raw/' + itemId, { ...formData, combinedData });
      closeAddItemModal();
      setSelectedItemId(null);
      // Show success notification
      setSnackbarSeverity('success');
      setSnackbarMessage('Item updated successfully');
      setSnackbarOpen(true);

      // Visit another page after showing the success notification
      Inertia.visit('/order')
    } catch (error) {
      console.error('Error adding item:', error);

      // Extract and display the error message from the response
      const errorMessage = error.response?.data?.data || 'Error adding item';

      // Show error notification
      setSnackbarSeverity('error');
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);

      // Reload the page if there is an error
    }
  };

  const handleAddItemId = async () => {
    try {
      const selectedData = data
        .filter((item) => selectedItems.includes(item.id))
        .map((item) => ({
          raw_product_id: item.material_id,
          code: item.code,
          material: item.name,
          size: item.size,
          status: item.status,
          note: item.status,
        }));

      setSelectedData(selectedData);
      // Send request to add items
      await axios.post('/save-order-detail-raw/' + itemId, { selectedData });
      closeAddItemModal();
      setFormData({
        pc_order_raw_id: '',
        raw_product_id: '',
        code: '',
        material: '',
        size: '',
        status: '',
        note: '',
      });
      setSelectedItemId(null);
      Inertia.reload();
    } catch (error) {
      console.error('Error updating item:', error);
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
    setSelectedItemId(null);
  };

  const openDeleteConfirmationModal = () => {
    setIsDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmationModal = () => {
    setIsDeleteConfirmationOpen(false);
    setItemToDeleteId(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleToggleSelect = (itemId) => {
    // Check if the item is already in the selectedItems array
    const isSelected = selectedItems.includes(itemId);

    // If it's selected, remove it; otherwise, add it to the array
    if (isSelected) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleToggleItem = (itemId) => {
    const isSelected = selectedItems.includes(itemId);
    let newSelected = [];

    if (!isSelected) {
      newSelected = [...selectedItems, itemId];
    } else {
      newSelected = selectedItems.filter((selectedId) => selectedId !== itemId);
    }

    setSelectedItems(newSelected);
  };

  const handleSelectAllItems = () => {
    if (selectedItems.length === data.length) {
      // Deselect all items
      setSelectedItems([]);
    } else {
      // Select all items by adding their IDs to selectedItems
      const allItemIds = data.map((item) => item.id);
      setSelectedItems(allItemIds);
    }
  };


  const handleAddItemMaterial = async () => {
    try {
      const selectedData = data
        .filter((item) => selectedItems.includes(item.id))
        .map((item) => ({
          raw_product_id: item.id,
          code: item.code,
          material: item.name,
          size: item.size,
          status: item.status,
          note: item.status,
        }));

      setSelectedData(selectedData);
      // Send request to add items
      await axios.post('/save-order-detail-raw', { selectedData });
      closeAddItemModal();
      setCheckedItems([]);
      //   refreshPage();
      Inertia.reload();
      // Show success notification
      setSnackbarSeverity('success');
      setSnackbarMessage('Item added successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding item:', error);

      // Extract and display the error message from the response
      const errorMessage = error.response?.data?.error || 'Error adding item';

      // Show error notification
      setSnackbarSeverity('error');
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };

  const openDeleteConfirmationModalRemove = (itemId, index) => {
    setConfirmationModalOpen((prevOpenModals) => ({
      ...prevOpenModals,
      [index]: true, // Set the specific item's modal to open
    }));
  };

  const closeDeleteConfirmationModalRemove = (itemId) => {
    setConfirmationModalOpen((prevOpenModals) => ({
      ...prevOpenModals,
      [itemId]: false, // Set the specific item's modal to close
    }));
  };

  const handleConfirmationDelete = (itemId, itemCode) => {
    // Close the confirmation modal
    setConfirmationModalOpen(false);

    // Call your functions
    handleRemoveItemMaterialTemp(itemId, itemCode);
    // handleRemoveItemMaterialData(itemId, itemCode);
  };

  const handleAddSelectedItems = (index, itemId) => {
    try {
      // Assuming selectedItems is an array of item ids
      const selectedIds = [...selectedItems];

      // Add the new itemId to selectedIds
      if (itemId !== undefined && !selectedIds.includes(itemId)) {
        selectedIds.push(itemId);
      }

      const selectedData = data
        .filter((item) => selectedIds.includes(item.id))
        .map((selectedItem) => ({
          raw_product_id: selectedItem.id,
          code: selectedItem.code,
          material: selectedItem.name,
          size: selectedItem.size,
          status: selectedItem.status,
          note: '-',
        }));

      // Remove items with the same id from dataTemp
      const newDataTemp = dataTemp.filter((item) => !selectedIds.includes(item.raw_product_id));

      // Add newly selected data to newDataTemp
      setDataTemp([...newDataTemp, ...selectedData]);
      if (order_id) {
        setDataDatabase((prevData) => [...prevData, ...newDataTemp, ...selectedData]);
      }

      // Clear selected items
      setSelectedItems([]);

      // Close the modal or perform other actions
      closeAddItemModal();

      // Update IdItem if needed
      setIdItem(selectedIds);
      // Show success notification
      setSnackbarSeverity('success');
      setSnackbarMessage('Item added successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding item:', error);

      // Extract and display the error message from the response
      const errorMessage = error.response?.data?.error || 'Error adding item';

      // Show error notification
      setSnackbarSeverity('error');
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };



  const handleUnitChange = (e, field) => {
    const value = e.target.value.trim();

    setFormData((prevFormData) => {
      const newFormData = {
        ...prevFormData,
        [field]: value,
      };

      // Perform any additional logic you need with the new value

      return newFormData;
    });
  };

  function explodeSizeString(sizeString) {
    // Split the sizeString using "x" as the delimiter
    const explodedArray = sizeString.split('x');

    // Trim each component and convert numerical parts to numbers
    const explodedNumbers = explodedArray.map(part => {
      const trimmedPart = part.trim();
      return /^\d*\.?\d*$/.test(trimmedPart) ? parseFloat(trimmedPart) : trimmedPart;
    });

    return explodedNumbers;
  }

  function formatSizeString(sizeArray) {
    // Filter out non-numeric parts and join them with 'X'
    const numericParts = sizeArray.filter(part => typeof part === 'number');
    const formattedString = numericParts.join('mmX');

    return formattedString + 'mm';
  }

  const filteredData2 = data.filter((item) => {
    return (
      (order_id &&
        !combinedData.some((tempItem) => tempItem.code === item.code)) ||
      (!order_id && !dataTemp.some((tempItem) => tempItem.code === item.code))
    );
  });

  function explodeSizeString(sizeString) {
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

  const handleFormChangeDetail = (event) => {
    const { name, value } = event.target;

    // Update form state
    setFormDataEditDetail({ ...formDataEditDetail, [name]: value });

    // Your logic based on the selected value
    if (name === 'status') {
      if (value === '0') {
        // Do something when '-' is selected
        console.log('Status is -');
      } else if (value === '1') {
        // Do something when 'Recieved' is selected
        console.log('Status is Recieved');
      }
    }
  };

  const formDataEditDetailOrder = (event, itemId, index) => {
    const { name, value } = event.target;

    setFormDataEditDetail((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //old code
  // // await axios.put('/order-detail-raw/' + itemId, { formDataEditDetail });
  // const newDataFromForm = formDataEditDetail;

  // if (order_id) {
  //   // Check if there is an item in dataDatabase with the same itemCode
  //   const isItemCodeExists = dataDatabase.some((item) => item.code === itemCode);

  //   if (isItemCodeExists) {
  //     // Update the data only if the itemCode exists in the current dataDatabase
  //     setDataDatabase((prevData) =>
  //       prevData.map((item) =>
  //         item.code === itemCode ? { ...item, ...newDataFromForm } : item
  //       )
  //     );
  //   } else {
  //     // If the itemCode does not exist, you might want to add it to the dataDatabase
  //     setDataDatabase((prevData) => [...prevData, newDataFromForm]);
  //   }
  // }
  //   closeEditOrderDetailModal();
  //   // setFormDataEditDetail({
  //   //   code: '',
  //   //   material: '',
  //   //   size: '',
  //   //   status: '',
  //   //   note: '',
  //   // });
  //   // Inertia.reload();
  //   // Show success notification
  //   setSnackbarSeverity('success');
  //   setSnackbarMessage('Item updated successfully');
  //   setSnackbarOpen(true);



  const handleFormDataEditDetailOrder = async (itemId, itemCode) => {
    const newDataFromForm = formDataEditDetail;

    if (order_id) {
      const isItemCodeExists = dataDatabase.some((item) => item.code === itemCode);

      if (isItemCodeExists) {
        setDataDatabase((prevData) =>
          prevData.map((item) =>
            item.code === itemCode ? { ...item, ...newDataFromForm } : item
          )
        );
      } else {
        setDataDatabase((prevData) => [...prevData, newDataFromForm]);
      }
    }

    closeEditOrderDetailModal();
    setSnackbarSeverity('success');
    setSnackbarMessage('Item updated successfully');
    setSnackbarOpen(true);
  }
  const handleFormChange = (e) => {
    if (e.target.name === 'weight_order_total' || e.target.name === 'price_order_total') {
      // Calculate the amount based on weight and price
      const weight = parseFloat(formData.weight_order_total) || 0;
      const price = parseFloat(formData.price_order_total) || 0;
      const amount = (weight * price); // Format dengan pemisah desimal "."

      setFormData({
        ...formData,
        amount_order_total: amount,
        [e.target.name]: e.target.value,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };


  const handleFormChangePrice = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, price_order_total: value });
  };

  function currencyFormat(num) {
    return 'Rp ' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  return (
    <Homepage>
      <Head title="Order Detail Raw Product" />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000} // Durasi notifikasi dalam milidetik (misalnya, 3000 = 3 detik)
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
          Order Raw Product
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        </div>
      </div>
      <hr style={{ color: 'white' }} />

      {/* add raw product */}
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell style={{ borderBottom: "none" }}>
                {/*<div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'table-column' }}>*/}
                <Typography variant='h7'>
                  Supplier
                </Typography>
              </TableCell>
              <TableCell style={{ borderBottom: "none" }}>
                <FormControl >
                  <TextField
                    select
                    label="Supplier"
                    variant="outlined"
                    value={formData.supplier_id}
                    onChange={handleFormChange}
                    style={{ width: '300px' }}
                    size="small"
                    name="supplier_id"
                  >
                    {supplier.map((supplier) => (
                      <MenuItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </MenuItem>
                    ))}
                    {/* Tambahkan opsi sesuai dengan supplier yang ada */}
                  </TextField>
                </FormControl>
              </TableCell>
              <TableCell style={{ borderBottom: "none" }}>
                {/*<div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>*/}
                <Typography variant='h7' style={{ marginRight: '16px' }}>
                  Weight (kg)
                </Typography>
              </TableCell>
              <TableCell style={{ borderBottom: "none" }}>
                <TextField
                  label="Weight"
                  variant="outlined"
                  value={formData.weight_order_total}
                  onChange={handleFormChange}
                  size="small"
                  name="weight_order_total"
                  style={{ width: '300px' }}
                  InputProps={{
                    inputComponent: NumericFormatCustom2,
                  }}
                />
                {/*</div>*/}
                {/*</div>*/}
              </TableCell>
            </TableRow>
            <TableCell rowSpan={2}>
              {/*    <div style={{ display: 'table-column' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>*/}
              <Typography variant='h7'>
                Note
              </Typography>
            </TableCell>
            <TableCell rowSpan={2}>
            <TextField
              label="Note"
              variant="outlined"
              value={formData.note}
              onChange={handleFormChange}
              size="small"
              name="note"
              multiline
              rows={4}
              style={{width: '300px'}}

            />
            </TableCell>
            <TableCell style={{ borderBottom: "none" }}>
              {/*</div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>*/}
              <Typography variant='h7' style={{ marginRight: '10px' }}>
                Price/kg
              </Typography>
            </TableCell>
            <TableCell style={{ borderBottom: "none" }}>
              <TextField
                label="Price/kg"
                variant="outlined"
                value={formData.price_order_total}
                onChange={handleFormChangePrice}
                size="small"
                name="price_order_total"
                style={{ width: '300px' }}
                InputProps={{
                  inputComponent: NumericFormatCustom,
                }}
              />
            </TableCell>
            <TableRow>
              <TableCell>
                {/*</div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>*/}
            <Typography variant='h7' style={{ marginRight: '10px' }}>
              Amount
            </Typography>
            </TableCell>
            <TableCell>
            <TextField
              label="Amount"
              variant="outlined"
              value={formData.price_order_total * formData.weight_order_total}
              onChange={handleFormChange}
              size="small"
              name="amount_order_total"
              disabled
              InputProps={{
                inputComponent: NumericFormatCustom
              }}
              style={{width: '300px'}}

            />
         {/*} </div>
        </div>*/}
                {/*</div>*/}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '15px' }}>
        <Typography variant='h4'>
          Product
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <Button
            variant="contained"
            onClick={openAddItemModal}
            size="small"
          >
            Add New
          </Button>
        </div>
      </div>
      <hr style={{ color: "white" }} />

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
            width: 840,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 5
          }}
        >
          <Typography variant='h6' gutterBottom>
            Add Raw Product
          </Typography>
          <hr style={{ color: 'white' }} />

          {/* Table for displaying items */}
          <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Checkbox
                      indeterminate={selectedItems.length > 0 && selectedItems.length < data.length}
                      checked={selectedItems.length === data.length}
                      onChange={handleSelectAllItems}
                    />
                  </TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Material</TableCell>
                  <TableCell>Size</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data
                  .filter(item =>
                    (order_id && !dataDatabase.some(tempItem => tempItem.code === item.code)) ||
                    (!order_id && !dataTemp.some(tempItem => tempItem.code === item.code))
                  )
                  .slice(page2 * rowsPerPage2, (page2 + 1) * rowsPerPage2)
                  .map((item, index) => {
                    const actualIndex = page2 * rowsPerPage2 + index;
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleToggleItem(item.id)}
                          />
                        </TableCell>
                        <TableCell>{item.code}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{explodeSizeString(item.size)}</TableCell>
                      </TableRow>
                    );
                  })}

                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={
                 data
                  .filter(item =>
                    (order_id && !combinedData.some(tempItem => tempItem.code === item.code)) ||
                    (!order_id && !dataTemp.some(tempItem => tempItem.code === item.code))
                  )
                  .length
              }
              rowsPerPage={rowsPerPage2}
              page={page2}
              onPageChange={handleChangePage2}
              onRowsPerPageChange={handleChangeRowsPerPage2}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>

                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleCancel}
                    style={{ marginRight: '10px' }}
                    size='small'
                  >
                    Cancel
                  </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleAddSelectedItems}
              size="small"
            >
              Add
            </Button>


          </div>
        </Box>
      </Modal>
      <Typography variant='h4' style={{ marginTop: '20px' }}>
      </Typography>
      {/* Tabel untuk menampilkan item */}
      <div>
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>No.</b></TableCell>
                <TableCell><b>Code</b></TableCell>
                <TableCell><b>Material</b></TableCell>
                <TableCell><b>Size</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Note</b></TableCell>
                <TableCell><b>Setting</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order_id ? (
                dataDatabase.length > 0 ? (
                  dataDatabase.slice(page1 * rowsPerPage1, page1 * rowsPerPage1 + rowsPerPage1).map((item, index) => {
                    const overallIndex = page1 * rowsPerPage1 + index + 1;
                    return (
                      <>

                        <Modal
                          open={openEditOrderDetail[item.id]}
                          onClose={() => closeEditOrderDetailModal(item.id)}
                          sx={{ overflow: 'auto' }}
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
                              textAlign: 'center',
                              borderRadius: 5,
                            }}
                          >
                            <Grid container spacing={1}>
                              {/* Code */}
                              <Grid item xs={5}>
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography variant="body1" style={{ marginRight: '10px' }}>
                                      Code
                                    </Typography>
                                    <TextField
                                      label="Code"
                                      variant="outlined"
                                      name="code"
                                      value={formDataEditDetail.code}
                                      onChange={(e) => formDataEditDetailOrder(e)}
                                      sx={{ width: '300px' }}
                                      disabled
                                      size='small'
                                    />
                                  </div>
                                </FormControl>
                              </Grid>

                              {/* Material */}
                              <Grid item xs={6}>
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography variant="body1" style={{ marginRight: '50px' }}>
                                      Material
                                    </Typography>
                                    <TextField
                                      label="Material"
                                      variant="outlined"
                                      name="material"
                                      value={formDataEditDetail.material}
                                      onChange={(e) => formDataEditDetailOrder(e)}
                                      sx={{ width: '300px' }}
                                      disabled
                                      size='small'
                                    />
                                  </div>
                                </FormControl>
                              </Grid>

                              {/* Size */}
                              <Grid item xs={5}>
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography variant="body1" style={{ marginRight: '10px' }}>
                                      Size
                                    </Typography>
                                    <TextField
                                      label="Size"
                                      variant="outlined"
                                      name="size"
                                      value={explodeSizeString(item.size)}
                                      onChange={(e) => formDataEditDetailOrder(e)}
                                      sx={{ width: '300px' }}
                                      disabled
                                      size='small'
                                    />
                                  </div>
                                </FormControl>
                              </Grid>

                              {/* Status and Note */}
                              <Grid item xs={6}>
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                  {/* Status */}
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography variant="body1" style={{ marginRight: '60px' }}>
                                      Status
                                    </Typography>
                                    <TextField
                                      select
                                      label="Status"
                                      variant="outlined"
                                      name="status"
                                      value={formDataEditDetail.status}
                                      onChange={(e) => formDataEditDetailOrder(e)}
                                      sx={{ width: '300px' }}
                                      size='small'
                                    >
                                      <MenuItem value="0">-</MenuItem>
                                      <MenuItem value="1">Received</MenuItem>
                                    </TextField>
                                  </div>

                          {/* Note */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
                            <Typography variant="body1" style={{ marginRight: '70px' }}>
                              Note
                            </Typography>
                            <TextField
                              label="Note"
                              variant="outlined"
                              name="note"
                              value={formDataEditDetail.note}
                              onChange={(e) => formDataEditDetailOrder(e)}
                              sx={{ width: '300px' }}
                              size='small'
                            />
                          </div>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <TableContainer component={Paper} style={{ display: dataExistData ? 'block' : 'none' }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell>Reff RCV</TableCell>
                            <TableCell>Code</TableCell>
                            <TableCell>Weight (kg)</TableCell>
                            <TableCell>Price/Kg</TableCell>
                            <TableCell>Qty</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dataRcState
                            .slice(pageRc * rowsPerPageRc, (pageRc + 1) * rowsPerPageRc)
                            .map((item, index) => {
                              const actualIndex = pageRc * rowsPerPageRc + index;

                              return (
                                <>
                                  {dataRcStateDetail.map((data, index) => {
                                    if (item.id == data.pc_recieve_raw_id) {
                                      return (
                                        <TableRow key={index} style={{ display: item.code == data.code ? 'none' : '' }}>
                                        <TableCell>{index + 1}</TableCell>
                                          <TableCell>{item.recieve_raw_no}</TableCell>
                                          <TableCell>{data.code}</TableCell>
                                          <TableCell>{data.weight}</TableCell>
                                          <TableCell>{data.price}</TableCell>
                                          <TableCell>{data.qty_rcv}</TableCell>
                                        </TableRow>
                                      );
                                    }
                                    return null;
                                  })}

                                </>
                              );
                            })}

                                </TableBody>
                              </Table>
                            </TableContainer>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                              <Button variant="contained" color="secondary" size='small' onClick={() => closeEditOrderDetailModal(item.id)} style={{ marginRight: '10px' }}>
                                Close
                              </Button>
                              <Button variant="contained" color="primary" size='small' onClick={() => handleFormDataEditDetailOrder(item.id, item.code)} style={{ marginRight: '10px' }}>
                                update
                              </Button>
                            </div>
                          </Box>
                        </Modal>

                        <Modal
                          open={isConfirmationModalOpen[item.id] || false}
                          onClose={() => closeDeleteConfirmationModalRemove(item.id)}
                          aria-labelledby={`delete-confirmation-modal-${item.id}`}
                          aria-describedby={`confirmation-dialog-for-deleting-item-${item.id}`}
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
                              Are you sure you want to delete this item {item.code}?
                            </Typography>
                            <Button variant="contained" color="primary" size='small' onClick={() => handleConfirmationDelete(item.id, item.code)}>
                              Yes
                            </Button>
                            <Button variant="contained" color="secondary" size='small' onClick={() => closeDeleteConfirmationModalRemove(item.id)} style={{ marginLeft: '10px' }}>
                              Cancel
                            </Button>
                          </Box>
                        </Modal>

                        <TableRow key={item.id}>
                          {/* ... other TableCell components */}
                          <TableCell>{overallIndex}</TableCell>
                          <TableCell>{item.code}</TableCell>
                          <TableCell>{item.material}</TableCell>
                          <TableCell>{explodeSizeString(item.size)}</TableCell>
                          <TableCell>{item.status == 0 ? '-' : 'Recieved'}</TableCell>
                          <TableCell>
                            <div
                              key={index}
                            >
                              {item.note}
                            </div>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              color="secondary"
                              onClick={() => openDeleteConfirmationModalRemove(item.id, index)}
                              size='small'
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              color="primary"
                              onClick={() => openEditOrderDetailModal(item.id, item.code)}
                              size='small'
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={7}>No data available</TableCell>
                  </TableRow>
                )
              ) : (
                dataTemp && dataTemp.length > 0 ? (
                  dataTemp.slice(page1 * rowsPerPage1, page1 * rowsPerPage1 + rowsPerPage1).map((item, index) => {
                    const overallIndex = page1 * rowsPerPage1 + index + 1;
                    return (
                      <>
                        <Modal
                          open={isConfirmationModalOpen[index] || false}
                          onClose={() => closeDeleteConfirmationModalRemove(index)}
                          aria-labelledby={`delete-confirmation-modal-${index}`}
                          aria-describedby={`confirmation-dialog-for-deleting-item-${index}`}
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
                              Are you sure you want to delete this item {item.code}?
                            </Typography>
                            <Button variant="contained" color="primary" size='small' onClick={() => handleConfirmationDelete(item.id, item.code)}>
                              Yes
                            </Button>
                            <Button variant="contained" color="secondary" size='small' onClick={() => closeDeleteConfirmationModalRemove(index)} style={{ marginLeft: '10px' }}>
                              Cancel
                            </Button>
                          </Box>
                        </Modal>

                        <TableRow key={item.id}>
                          {/* ... other TableCell components */}
                          <TableCell>{overallIndex}</TableCell>
                          <TableCell>{item.code}</TableCell>
                          <TableCell>{item.material}</TableCell>
                          <TableCell>{explodeSizeString(item.size)}</TableCell>
                          <TableCell>{item.status == 0 ? '-' : 'recieved'}</TableCell>
                          <TableCell>
                            <div
                              key={index}
                            >
                              {item.note}
                            </div>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              color="secondary"
                              onClick={() => openDeleteConfirmationModalRemove(item.id, index)}
                              size='small'
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>

                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={7}>No data available</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <hr style={{ color: 'white' }} />
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={(order_id ? combinedData : dataTemp || []).length}
          rowsPerPage={rowsPerPage1}
          page={page1}
          onPageChange={handleChangePage1}
          onRowsPerPageChange={handleChangeRowsPerPage1}
        />
      </div>
      {order_id ? (
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
            <Button variant="contained" color="error" href='/order' size='small' style={{ marginRight: '10px' }}>
              Close
            </Button>
            <Button variant="contained" color="primary" href='/order' size='small' style={{ marginRight: '10px' }}>
              Clear
            </Button>
            <Button variant="contained" color="success" onClick={handleUpdateItemIdMaterial} size='small' style={{ marginRight: '10px' }}>
              update
            </Button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="error" href='/order' size='small' style={{ marginRight: '10px' }}>
            Close
          </Button>
          <Button variant="contained" color="primary" href='/order' size='small' style={{ marginRight: '10px' }}>
            Clear
          </Button>
          <Button variant="contained" color="success" onClick={handleAddItem} size='small' style={{ marginRight: '10px' }}>
            Save
          </Button>
        </div>
      )}
    </Homepage>
  );
};

export default OrderDetailRawProduct;
