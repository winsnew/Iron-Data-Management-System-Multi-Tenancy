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
import { InertiaLink, Head } from '@inertiajs/inertia-react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
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

const ReceiveOrderDetails = ({receiveorderdetails, warehouses, data, receiveId}) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenTemp, setIsModalOpenTemp] = useState(false);
  const [isModalOpenId, setIsModalOpenId] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [isDeleteTempConfirmationOpen, setIsDeleteTempConfirmationOpen] = useState(false);
  const [postingModal, setPostingModal] = useState(false);
  const [formData, setFormData] = useState({
    warehouse_id: '',
    weight_recieve_total: 0,
    amount_recieve_total: 0,
    note: '',
  });
  const [dataDatabase, setDataDatabase] = useState({
    id: '',
    pc_order_raw_detail_id: '',
    reff_po: '',
    code: '',
    size: '',
    weight: '',
    price: '',
    qty_rcv: '',
    delivery_cost: ''
  });
  const [otherInput, setOtherInput] = useState('');
  const [otherInputMaterial, setOtherInputMaterial] = useState('');
  const [otherInputSize, setOtherInputSize] = useState('');
  const [otherInputId, setOtherInputId] = useState('');
  const [otherInputIdCode, setOtherInputIdCode] = useState('');
  const [reffPo, setReffPo] = useState('');
  const [weight, setWeight] = useState('');
  const [price, setPrice] = useState('');
  const [qtyRcv, setQtyRcv] = useState('');
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
   //comnined data from database and state
  const [dataTemp, setDataTemp] = useState([]);
  const filteredArray = dataTemp ? Object.values(dataTemp) : [];
  // const dataArray = receiveorderdetails || [];
  // const combinedData = [...dataArray, ...filteredArray];
  // const [refreshTable, setRefreshTable] = useState(false);
  //pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const url = window.location.href;
  //fitur notif
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  //responsive
  // Ensure that `query` function (if used) receives the theme
  const theme = useTheme();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const closingPostingModal = () => {
    setPostingModal(false);

    setOtherInput('')
    setOtherInputMaterial('')
    setOtherInputSize('')
    setOtherInputId('')
    setOtherInputIdCode('')
    setReffPo('')
    setWeight('')
    setPrice('')
    setQtyRcv('')
    setDeliveryCost('')
    setSelectedItemId(null)
  }

  const openPostingModal = () => {
    setPostingModal(true);
  };

  useEffect(() => {
    // Check if id exists
    if (receiveId) {
        // Update formData state with the fetched data
        setFormData({
          ...formData,
          warehouse_id: receiveId.werehouse_id,
          note: receiveId.note,
          weight_recieve_total: receiveId.weight_recieve_total,
          amount_recieve_total: receiveId.amount_recieve_total,
      });
    }
  }, [receiveId]);

  useEffect(() => {
    // Check if id exists
    if (receiveId) {
          const mappedData = receiveorderdetails.map(item => ({
          id: item.id,
          pc_order_raw_detail_id: item.pc_order_raw_detail_id,
          reff_po: item.reff_po,
          code: item.code,
          size: item.size,
          weight: item.weight,
          price: item.price,
          qty_rcv: item.qty_rcv,
          delivery_cost: item.delivery_cost
        }));

        setDataDatabase(mappedData);
        }
  }, [receiveId, receiveorderdetails]);

  useEffect(() => {
    // Calculate total weight when dataTemp changes
    const totalWeight = calculateTotalWeight(dataTemp, receiveId);

    // Update formData with the calculated total weight
    setFormData((prevFormData) => ({
      ...prevFormData,
      weight_recieve_total: totalWeight,
    }));
  }, [dataTemp, receiveId]);

  useEffect(() => {
    // Calculate total amount when dataTemp changes
    const totalAmount = calculateTotalAmount(dataTemp, receiveId);

    // Update formData with the calculated total amount
    setFormData((prevFormData) => ({
      ...prevFormData,
      amount_recieve_total: totalAmount,
    }));
  }, [dataTemp, receiveId]);

  useEffect(() => {
    // Calculate total weight when dataTemp changes
    const totalWeight = calculateTotalWeightFromReceiveDetails(dataDatabase, receiveId);

    // Update formData with the calculated total weight
    setFormData((prevFormData) => ({
      ...prevFormData,
      weight_recieve_total: totalWeight,
    }));
  }, [dataDatabase, receiveId]);

  useEffect(() => {
    // Calculate total amount when dataTemp changes
    const totalAmount = calculateTotalAmountFromReceiveDetails(dataDatabase, receiveId);

    // Update formData with the calculated total amount
    setFormData((prevFormData) => ({
      ...prevFormData,
      amount_recieve_total: totalAmount,
    }));
  }, [dataDatabase, receiveId]);

  useEffect(() => {
    const filtered = receiveorderdetails.filter((item) => {
      const matchesGeneralSearch = item.reff_po.toLowerCase().includes(searchTerm.toLowerCase());

      // Return true if either the general search or note search matches
      return matchesGeneralSearch;
    });

    setFilteredItems(filtered);
  }, [searchTerm]);

  const confirmDelete = () => {
    try {
      axios.delete(`/delete-receive-order-raw/${itemToDeleteId}`).then(() => {
        setSnackbarDeleteOpen(true);
        closeDeleteConfirmationModal();
      });
      Inertia.reload();
    } catch (error) {
    }
  };

  const handleCancel = () => {
    closeAddItemModal();
    setOtherInput('')
    setOtherInputMaterial('')
    setOtherInputSize('')
    setOtherInputId('')
    setOtherInputIdCode('')
    setReffPo('')
    setWeight('')
    setPrice('')
    setQtyRcv('')
    setDeliveryCost('')
    setSelectedItemId(null)
  };

  const handleCancelId = (itemId) => {
    setIsModalOpenId(() => ({
      [itemId]: false, // Set the specific item's modal to open
    }));

    setOtherInput('')
    setOtherInputMaterial('')
    setOtherInputSize('')
    setOtherInputId('')
    setOtherInputIdCode('')
    setReffPo('')
    setWeight('')
    setPrice('')
    setQtyRcv('')
    setDeliveryCost('')
    setSelectedItemId(null)
  };

  const openAddItemModal = () => {
    setIsModalOpen(true);
  };

  const closeAddItemModal = () => {
    setIsModalOpen(false);
    // setSelectedItemId(null);
  };

  const openAddItemModalTemp = (index) => {
    setIsModalOpenTemp((prevOpenModals) => ({
      ...prevOpenModals,
      [index]: true, // Set the specific item's modal to open
    }));
  };

  const closeAddItemModalTemp = (index) => {
    setIsModalOpenTemp((prevOpenModals) => ({
      ...prevOpenModals,
      [index]: false, // Set the specific item's modal to open
    }));
  };

  const openDeleteConfirmationModal = () => {
    setIsDeleteConfirmationOpen(true);
  };

  const openDeleteTempConfirmationModal = () => {
    setIsDeleteTempConfirmationOpen(true);
  }

  const closeDeleteConfirmationModal = () => {
    setIsDeleteConfirmationOpen(false);
    setItemToDeleteId(null);
  };

  const closeDeleteTempConfirmationModal = () => {
    setIsDeleteTempConfirmationOpen(false);
    setItemToDeleteId(null);
  }

  const handleWeightChange = (e) => {
    const weight = e.target.value;
    setWeight(weight);
  };
  const handlePriceChange = (e) => {
    const price = e.target.value;
    setPrice(price);
  };

  const handleQtyChange = (e) => {
    const qtyRcv = e.target.value;
    setQtyRcv(qtyRcv);
  };

  const handleDeliveryChange = (e) => {
    const delivery = e.target.value;
    setDeliveryCost(delivery);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleWarehouseChange = (event) => {
    const selectedWarehouseId = event.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      warehouse_id: selectedWarehouseId,
    }));
  };

  const handleNoteChange = (event) => {
    const noteValue = event.target.value;
    // setNote(noteValue);
    setFormData((prevFormData) => ({
      ...prevFormData,
      note: noteValue,
    }));
  };

  // const handleReffPoChange = (e, selectedValue) => {
  //   const reffPo = e.target.value;
  //   setReffPo(reffPo);
  // };
  const handleReffPoChange = (newValue) => {
      setReffPo(newValue.order_raw_no);
  };

  const handleReffPoChange2 = (code) => {
  const selectedItem = otherInput.find(item => item.code === code.code);
  
  // If the item is found, set its values to the state variables
  if (selectedItem) {
    setOtherInputIdCode(selectedItem.code);
    setOtherInputMaterial(selectedItem.material);
    setOtherInputSize(selectedItem.size);
    setOtherInputId(selectedItem.id);
  } else {
    // Handle the case where the item is not found, reset the state variables if needed
    setOtherInputIdCode('');
    setOtherInputMaterial('');
    setOtherInputSize('');
    setOtherInputId('');
  }
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

  const handleMenuItemClick = (selectedValue) => {
    // const dataSelect = selectedValue.order.filter(item =>
    //   (!dataTemp.some(tempItem => tempItem.otherInputIdCode === item.code))
    // );

    // if (receiveId && dataDatabase.length > 0) {
    //   const dataSelect2 = selectedValue.order.filter(item =>
    //     (!dataDatabase.some(tempItem => tempItem.code === item.code))
    //   );
    //   setOtherInput(dataSelect2)
    // } else {
    //   setOtherInput(dataSelect)
    // }
    console.log(selectedValue);
    setOtherInput(selectedValue.order)
  };
  const handleMenuItemClick2 = (selectedValue2) => {
    setOtherInputIdCode(selectedValue2.code);
    setOtherInputMaterial(selectedValue2.material);
    setOtherInputSize(selectedValue2.size);
    setOtherInputId(selectedValue2.id);
  };

  // color for button
  const buttonSaveColor = '#00a152';
  const buttonCancelColor = '#c62828';

  // responsive display
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between(600, 1280));

  // data temp
  const handleRemoveItemOrderTemp = (index) => {
    setDataTemp(prevDataTemp => {
      const updatedDataTemp = [...prevDataTemp];
      updatedDataTemp.splice(index, 1); // Remove the item at the specified index
      return updatedDataTemp;
    });
  };

  const handleFormSubmit = () => {
    if(receiveId) {
      const newItem = {
        id: '', // Replace with the actual variable holding the id value
        pc_order_raw_detail_id: otherInputId, // Replace with the actual variable holding the pc_order_raw_detail_id value
        reff_po: reffPo, // Replace with the actual variable holding the reff_po value
        code: otherInputIdCode, // Replace with the actual variable holding the code value
        size: otherInputSize, // Replace with the actual variable holding the size value
        weight: weight, // Replace with the actual variable holding the weight value
        price: price, // Replace with the actual variable holding the price value
        qty_rcv: qtyRcv, // Replace with the actual variable holding the qty_rcv value
        delivery_cost: '' // Replace with the actual variable holding the delivery_cost value
      };

      // Update the dataDatabase state with the new item
      // const newData = [...dataDatabase, newItem];
      // setDataDatabase(newData);
      // Check if newItem is already present in dataDatabase
      // Check if newItem is already present in dataDatabase
          const isDuplicateInDatabase = dataDatabase.some(item => 
          item.reff_po.toLowerCase() === newItem.reff_po.toLowerCase() &&
          item.code.toLowerCase() === newItem.code.toLowerCase() &&
          item.size.toLowerCase() === newItem.size.toLowerCase() &&
          item.weight.toLowerCase() === newItem.weight.toLowerCase() &&
          item.price.toLowerCase() === newItem.price.toLowerCase() &&
          item.qty_rcv.toLowerCase() === newItem.qty_rcv.toLowerCase()
        );

        if (isDuplicateInDatabase) {
          // Handle error for duplicate data in dataDatabase
          setSnackbarSeverity('error');
          setSnackbarMessage('Error: Item already exists in dataDatabase');
        } else {
          // Update the dataDatabase state with the new item
          const newData = [...dataDatabase, newItem];
          setDataDatabase(newData);

          // Set success Snackbar
          setSnackbarSeverity('success');
          setSnackbarMessage('Item added successfully');
        }
      } else {
        // You can access each state variable here and perform your logic
        const newItem = {
          otherInputMaterial,
          otherInputSize,
          otherInputId,
          otherInputIdCode,
          reffPo,
          weight,
          price,
          qtyRcv,
          deliveryCost,
        };
        console.log(newItem);
        // const newData = [...dataTemp, newItem];
        // setDataTemp(newData);
        const isDuplicateInDatabase = dataTemp.some(item => 
          item.reffPo.toLowerCase() === newItem.reffPo.toLowerCase() &&
          item.otherInputIdCode.toLowerCase() === newItem.otherInputIdCode.toLowerCase() &&
          item.otherInputSize.toLowerCase() === newItem.otherInputSize.toLowerCase() &&
          item.weight.toLowerCase() === newItem.weight.toLowerCase() &&
          item.price.toLowerCase() === newItem.price.toLowerCase() &&
          item.qtyRcv.toLowerCase() === newItem.qtyRcv.toLowerCase()
        );

        if (isDuplicateInDatabase) {
          // Handle error for duplicate data in dataDatabase
          setSnackbarSeverity('error');
          setSnackbarMessage('Error: Item already exists in dataDatabase');
        } else {
          // Update the dataDatabase state with the new item
          const newData = [...dataTemp, newItem];
          setDataTemp(newData);

          // Set success Snackbar
          setSnackbarSeverity('success');
          setSnackbarMessage('Item added successfully');
        }
      }

      setOtherInput('')
      setOtherInputMaterial('')
      setOtherInputSize('')
      setOtherInputId('')
      setOtherInputIdCode('')
      setReffPo('')
      setWeight('')
      setPrice('')
      setQtyRcv('')
      setDeliveryCost('')
      setSelectedItemId(null)

      closeAddItemModal();
      // setSnackbarSeverity('success');
      // setSnackbarMessage('Item added successfully');
      setSnackbarOpen(true);
    };

    const handleFormSubmitEdit = (e, itemId, item) => {
      e.preventDefault();
      console.log(item);
      if(receiveId) {
      const newItem = {
        id: '', // Replace with the actual variable holding the id value
        pc_order_raw_detail_id: otherInputId, // Replace with the actual variable holding the pc_order_raw_detail_id value
        reff_po: reffPo, // Replace with the actual variable holding the reff_po value
        code: otherInputIdCode, // Replace with the actual variable holding the code value
        size: otherInputSize, // Replace with the actual variable holding the size value
        weight: weight, // Replace with the actual variable holding the weight value
        price: price, // Replace with the actual variable holding the price value
        qty_rcv: qtyRcv, // Replace with the actual variable holding the qty_rcv value
        delivery_cost: '' // Replace with the actual variable holding the delivery_cost value
      };

      // Update the dataDatabase state with the new item
      const newData = [...dataDatabase, newItem];
      setDataDatabase(newData);
      } else {
        // You can access each state variable here and perform your logic
        const newItem = {
          otherInputMaterial: item.otherInputMaterial,
          otherInputSize: item.otherInputSize,
          otherInputId: item.otherInputId,
          otherInputIdCode: item.otherInputIdCode,
          reffPo: item.reffPo,
          weight: weight || item.weight,
          price: price || item.price,
          qtyRcv: qtyRcv || item.qtyRcv,
          deliveryCost: item.deliveryCost,
        };
        // const newData = [...dataTemp, newItem];
        setDataTemp((prevData) =>
          prevData.map((item, index) =>
            index === itemId
              ? {
                  ...item,  // Spread the existing properties of the current item
                  ...newItem  // Spread the properties of the new item to update
                }
              : item
          )
        );
      }
      setOtherInput('')
      setOtherInputMaterial('')
      setOtherInputSize('')
      setOtherInputId('')
      setOtherInputIdCode('')
      setReffPo('')
      setWeight('')
      setPrice('')
      setQtyRcv('')
      setDeliveryCost('')
      closeAddItemModalTemp(itemId);
      setSnackbarSeverity('success');
      setSnackbarMessage('Item added successfully');
      setSnackbarOpen(true);
    };

    const handleFormSubmitEditData = (e, indexId, itemId, item) => {
      e.preventDefault();
      console.log(item);
      if(receiveId) {
      const newItem = {
        id: item.id, // Replace with the actual variable holding the id value
        pc_order_raw_detail_id: item.pc_order_raw_detail_id, // Replace with the actual variable holding the pc_order_raw_detail_id value
        reff_po: item.reff_po, // Replace with the actual variable holding the reff_po value
        code: item.code, // Replace with the actual variable holding the code value
        size: item.size, // Replace with the actual variable holding the size value
        weight: weight || item.weight, // Replace with the actual variable holding the weight value
        price: price || item.price, // Replace with the actual variable holding the price value
        qty_rcv: qtyRcv || item.qty_rcv, // Replace with the actual variable holding the qty_rcv value
        delivery_cost: '' // Replace with the actual variable holding the delivery_cost value
      };

      // Update the dataDatabase state with the new item
      // const newData = [...dataDatabase, newItem];
      setDataDatabase((prevData) =>
          prevData.map((item, index) =>
            item.id === itemId
              ? {
                  ...item,  // Spread the existing properties of the current item
                  ...newItem  // Spread the properties of the new item to update
                }
              : item
          )
        );
      } else {
        // You can access each state variable here and perform your logic
        const newItem = {
          id: item.id, // Replace with the actual variable holding the id value
          pc_order_raw_detail_id: item.pc_order_raw_detail_id, // Replace with the actual variable holding the pc_order_raw_detail_id value
          reff_po: item.reff_po, // Replace with the actual variable holding the reff_po value
          code: item.code, // Replace with the actual variable holding the code value
          size: item.size, // Replace with the actual variable holding the size value
          weight: weight || item.weight, // Replace with the actual variable holding the weight value
          price: price || item.price, // Replace with the actual variable holding the price value
          qty_rcv: qtyRcv || item.qty_rcv, // Replace with the actual variable holding the qty_rcv value
          delivery_cost: '' // Replace with the actual variable holding the delivery_cost value
        };
        // const newData = [...dataTemp, newItem];
        setDataDatabase((prevData) =>
          prevData.map((item, index) =>
            index === indexId
              ? {
                  ...item,  // Spread the existing properties of the current item
                  ...newItem  // Spread the properties of the new item to update
                }
              : item
          )
        );
      }
      setOtherInput('')
      setOtherInputMaterial('')
      setOtherInputSize('')
      setOtherInputId('')
      setOtherInputIdCode('')
      setReffPo('')
      setWeight('')
      setPrice('')
      setQtyRcv('')
      setDeliveryCost('')
      handleCancelId(itemId);
      setSnackbarSeverity('success');
      setSnackbarMessage('Item added successfully');
      setSnackbarOpen(true);
    };

    // const handleWeightChangeTemp = (e, itemId) => {
    //   const weight = e.target.value;
    //   setDataTemp((prevData) =>
    //     prevData.map((item, index) =>
    //       index === itemId
    //         ? {
    //             ...item,
    //             weight: weight // Assuming pc_order_raw_detail_id comes from selectedValue2.id
    //           }
    //         : item
    //     )
    //   );
    // };
    // const handlePriceChangeTemp = (e, itemId) => {
    //   const price = e.target.value;
    //   setDataTemp((prevData) =>
    //     prevData.map((item, index) =>
    //       index === itemId
    //         ? {
    //             ...item,
    //             price: price // Assuming pc_order_raw_detail_id comes from selectedValue2.id
    //           }
    //         : item
    //     )
    //   );
    // };

    // const handleQtyChangeTemp = (e, itemId) => {
    //   const qtyRcv = e.target.value;
    //   setDataTemp((prevData) =>
    //     prevData.map((item, index) =>
    //       index === itemId
    //         ? {
    //             ...item,
    //             qtyRcv: qtyRcv // Assuming pc_order_raw_detail_id comes from selectedValue2.id
    //           }
    //         : item
    //     )
    //   );
    // };


  const saveItemReceiveRaw = async () => {
    try {
      // Send request to add items
      data = await axios.post('/receive-order', { ...formData, dataTemp });
      closeAddItemModal();

      // Show success notification
      setSnackbarSeverity('success');
      setSnackbarMessage('Item added successfully');
      setSnackbarOpen(true);

      // Visit another page after showing the success notification
      Inertia.visit('/receive-order')
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
  }

  const updateItemReceiveRaw = async () => {
    try {
    // Send request to add items
      data = await axios.put('/receive-order/' + receiveId.id, { ...formData, dataDatabase });
      closeAddItemModal();

      // Show success notification
      setSnackbarSeverity('success');
      setSnackbarMessage('Item added successfully');
      setSnackbarOpen(true);

      // Visit another page after showing the success notification
      Inertia.visit('/receive-order')
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
  }

  const updateItemReceiveRawPosting = async () => {
    try {
    // Send request to add items
      data = await axios.put('/posting-receive-order/' + receiveId.id, { ...formData, dataDatabase });
      closeAddItemModal();

      // Show success notification
      setSnackbarSeverity('success');
      setSnackbarMessage('Item Posting successfully');
      setSnackbarOpen(true);

      // Visit another page after showing the success notification
      Inertia.visit('/receive-order')
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
  }

  const updateItemReceiveRawDetail = async (itemId) => {
    try {
      closingPostingModal();

      // setOtherInput('')
      // setOtherInputMaterial('')
      // setOtherInputSize('')
      // setOtherInputId('')
      // setOtherInputIdCode('')
      // setReffPo('')
      // setWeight('')
      // setPrice('')
      // setQtyRcv('')
      // setDeliveryCost('')
      // setSelectedItemId(null)

      // Show success notification
      setSnackbarSeverity('success');
      setSnackbarMessage('Item updated successfully');
      setSnackbarOpen(true);

      // Visit another page after showing the success notification
      setIsModalOpenId(() => ({
        [itemId]: false, // Set the specific item's modal to open
      }));
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
  }

  const calculateTotalWeight = (dataTemp, receiveId) => {
     if (dataTemp.length === 0 && receiveId && receiveId.weight_recieve_total) {
        const calculatedTotal = 0;
        return calculatedTotal;
      }

    const totalWeight = dataTemp.reduce((accumulator, currentItem) => {
      const itemWeight = parseFloat(currentItem.weight) || 0;
      const itemQtyRcv = parseInt(currentItem.qtyRcv, 10) || 1; // Default to 1 if qtyRcv is not a valid number

      return accumulator + itemWeight * itemQtyRcv;
    }, 0);

      return totalWeight

  };

  const formatCurrency = (value) => {
    return 'Rp ' + Number(value).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatThousand = (value) => {
    return '' + Number(value).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  };

  const calculateTotalAmount = (dataTemp) => {
    if (dataTemp.length === 0 && receiveId && receiveId.amount_recieve_total) {
    const calculatedTotal = 0;
    return calculatedTotal;
  }
    const totalAmount = dataTemp.reduce((accumulator, currentItem) => {
      const itemPrice = parseFloat(currentItem.price) || 0;
      const itemWeight = parseFloat(currentItem.weight) || 0;
      const itemQtyRcv = parseInt(currentItem.qtyRcv, 10) || 1; // Default to 1 if qtyRcv is not a valid number

      return accumulator + itemPrice * itemQtyRcv * itemWeight;
    }, 0);

      return totalAmount
  };

  const calculateTotalAmountFromReceiveDetails = (receiveorderdetails) => {
  if (!Array.isArray(receiveorderdetails) || receiveorderdetails.length === 0) {
    return 0;
  }

  const totalAmount = dataDatabase.reduce((accumulator, currentItem) => {
    const itemPrice = parseFloat(currentItem.price) || 0;
    const itemWeight = parseFloat(currentItem.weight) || 0;
    const itemQtyRcv = parseInt(currentItem.qty_rcv, 10) || 1;

    return accumulator + itemWeight * itemQtyRcv * itemPrice;
  }, 0);

  return totalAmount;
};

const calculateTotalWeightFromReceiveDetails = (receiveorderdetails) => {
  if (!Array.isArray(receiveorderdetails) || receiveorderdetails.length === 0) {
    return 0;
  }

  const totalWeight = dataDatabase.reduce((accumulator, currentItem) => {
    const itemWeight = parseFloat(currentItem.weight) || 0;
    const itemQtyRcv = parseInt(currentItem.qty_rcv, 10) || 1;

    return accumulator + itemWeight * itemQtyRcv;
  }, 0);

  return totalWeight;
};

  const handleEditItemOpenModal = (itemId) => {
    // Find the item based on itemId
    const selectedItem = dataDatabase.find(item => item.id === itemId);
    data.map((item, index) => (
    handleMenuItemClick(item)))

    setOtherInputIdCode(selectedItem.code)
    setOtherInputSize(selectedItem.size)
    setOtherInputId(selectedItem.pc_order_raw_detail_id)
    setReffPo(selectedItem.reff_po)
    setWeight(selectedItem.weight)
    setPrice(selectedItem.price)
    setQtyRcv(selectedItem.qty_rcv)
    // setDeliveryCost(selectedItem.delivery_cost)
    // setSelectedItemId(selectedItem)

    setIsModalOpenId(() => ({
      [itemId]: true, // Set the specific item's modal to open
    }));
  }

  const openDeleteConfirmationModalRemove = (itemId) => {
    setIsDeleteConfirmationOpen((prevOpenModals) => ({
      ...prevOpenModals,
      [itemId]: true, // Set the specific item's modal to open
    }));
  };

  const closeDeleteConfirmationModalRemove = (itemId) => {
    setIsDeleteConfirmationOpen((prevOpenModals) => ({
      ...prevOpenModals,
      [itemId]: false, // Set the specific item's modal to close
    }));
  };

  // const handleConfirmationDelete = (index) => {
  //   // Close the confirmation modal
  //   setIsDeleteConfirmationOpen(false);

  //   // Call your functions
  //   handleRemoveItemMaterialTemp(index);
  // };
  // const handleConfirmationDeleteData = (itemId, index) => {
  //   // Close the confirmation modal
  //   setIsDeleteConfirmationOpen(false);
  //   handleRemoveItemMaterialData(itemId);
  // };

  const handleRemoveItemMaterialTemp = (itemCode, indexId) => {
    // Check if there is at least one item in idItem
    const itemToDelete = dataTemp.find((item, index) => item.otherInputIdCode+index === itemCode+indexId);
    if (itemToDelete) {
      // If itemCode exists in dataDatabase, filter out the item and update the state
      const updatedData = dataTemp.filter((item, index) => item.otherInputIdCode+index !== itemCode+indexId);
      setDataTemp(updatedData);

      closeDeleteConfirmationModalRemove(indexId)

      setSnackbarSeverity('success');
      setSnackbarMessage('Item deleted successfully');
      setSnackbarOpen(true);
    } else {
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
};

const handleRemoveItemMaterialData = (itemCode, itemId) => {
  const itemToDelete = dataDatabase.find((item, index) => item.code+index === itemCode+itemId);
  console.log(itemToDelete);
  if (itemToDelete) {
    // If itemCode exists in dataDatabase, filter out the item and update the state
    const updatedData = dataDatabase.filter((item, index) => item.code+index !== itemCode+itemId);
    setDataDatabase(updatedData);
    closeDeleteConfirmationModalRemove(itemCode)

    // Show success message using Snackbar
    setSnackbarSeverity('success');
    setSnackbarMessage('Item deleted successfully');
    setSnackbarOpen(true);
  } else {
    // Show an error message using Snackbar if itemCode doesn't exist in dataDatabase
    setSnackbarSeverity('error');
    setSnackbarMessage('Item not found');
    setSnackbarOpen(true);
  }
};

const handleReffPoChangeId = (e, itemId) => {
    const reffPo = e.target.value;
    setDataDatabase((prevData) => {
      const updatedData = prevData.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            reff_po: reffPo,
          };
        }
        return item;
      });
      return updatedData;
    });
  };

  const handleReffPoChange2Id = (e, selectedValue2, itemId) => {
    const code = e.target.value;
    const selectedItem = otherInput.find(item => item.code === code);

    // If the item is found, set its values to the state variables
    if (selectedItem) {
        setDataDatabase((prevData) =>
          prevData.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  code: selectedItem.code,
                  size: selectedItem.size,
                  pc_order_raw_detail_id: selectedItem.id, // Assuming pc_order_raw_detail_id comes from selectedItem.id
                }
              : item
          )
        );
    } else {
        // Handle the case where the item is not found, reset the state variables if needed
        setOtherInputIdCode('');
        setOtherInputMaterial('');
        setOtherInputSize('');
        setOtherInputId('');
    }
  };

  const handleMenuItemClick3 = (selectedValue2, itemId) => {
      setDataDatabase((prevData) =>
      prevData.map((item) =>
        item.id === itemId
          ? {
              ...item,
              code: selectedValue2.code,
              size: selectedValue2.size,
              pc_order_raw_detail_id: selectedValue2.id, // Assuming pc_order_raw_detail_id comes from selectedValue2.id
            }
          : item
      )
    );
  };

  // const handleWeightChangeId = (e, itemId) => {
  //   const weight = e.target.value;
  //   setDataDatabase((prevData) =>
  //     prevData.map((item) =>
  //       item.id === itemId
  //         ? {
  //             ...item,
  //             weight: weight // Assuming pc_order_raw_detail_id comes from selectedValue2.id
  //           }
  //         : item
  //     )
  //   );
  // };
  // const handlePriceChangeId = (e, itemId) => {
  //   const price = e.target.value;
  //   setDataDatabase((prevData) =>
  //     prevData.map((item) =>
  //       item.id === itemId
  //         ? {
  //             ...item,
  //             price: price // Assuming pc_order_raw_detail_id comes from selectedValue2.id
  //           }
  //         : item
  //     )
  //   );
  // };

  // const handleQtyChangeId = (e, itemId) => {
  //   const qtyRcv = e.target.value;
  //   setDataDatabase((prevData) =>
  //     prevData.map((item) =>
  //       item.id === itemId
  //         ? {
  //             ...item,
  //             qty_rcv: qtyRcv // Assuming pc_order_raw_detail_id comes from selectedValue2.id
  //           }
  //         : item
  //     )
  //   );
  // };

  console.log(dataDatabase);
  return (
    <ThemeProvider theme={createTheme()}>
    <Homepage>
    <Head title="Receive Order Detail Raw Product" />
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
              <Button variant="contained" color="error" onClick={closingPostingModal} sx={{ml: '10px'}}>
                Cancel
              </Button>
            </Box>
          </Modal>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant='h4'>
          Receive Order (Raw Product)
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        </div>
      </div>
      <hr style={{color: "white"}} />
      {/* Use Grid to create a responsive layout for Warehouse and Note sections */}
      <TableContainer component={Paper} style={{ marginTop: '20px', overflowX: 'auto', padding: '10px' }}>
      <Grid container spacing={isSmallScreen ? 2 : 3}>
        <Grid item xs={12} sm={6}>
          {/* Warehouse Section */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant='h7' style={{ marginRight: '10px' }}>
              Warehouse
            </Typography>
            <TextField
              select
              label="Warehouse"
              id='warehouse-select'
              value={formData.warehouse_id}
              onChange={handleWarehouseChange}
              style={{ width: '100%' }}
              size="small"
              inputProps={{
                style: {
                  position: 'absolute',
                },
              }}
            >
              {warehouses.map((warehouse, index) => (
                <MenuItem key={index} value={warehouse.id}>
                  {warehouse.name}
                </MenuItem>
              ))}
            </TextField>
          </div>
        </Grid>

        <Grid item xs={12} sm={6}>
          {/* Note Section */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant='h7' style={{ marginRight: '10px' }}>
              Note
            </Typography>
            <TextField
              label="Note"
              variant="outlined"
              value={formData.note}
              onChange={handleNoteChange}
              style={{ width: '100%' }}
              size="small"
              multiline
            />
          </div>
        </Grid>
      </Grid>
      </TableContainer>

      <br />
      <br />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
            inputProps={{
                name: 'searchTerm'
             }}
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
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 5,
            width: 525
          }}
        >
          <Typography variant='h6' gutterBottom>
            {selectedItemId ? 'Edit Product' : 'Add Product'}
          </Typography>
          <form onSubmit={handleFormSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '450px'}}>
                        <Typography variant="body1">
                        Reff PO No.
                        </Typography>

                        <Autocomplete
                          required
                          options={data}
                          getOptionLabel={(option) => (option && option.order_raw_no) || reffPo}
                          // getOptionLabel={(option) => (option && option.order_raw_no) ? option.order_raw_no : reffPo}
                          renderOption={(props, option) => (
                              <MenuItem {...props} onMouseDown={() => handleMenuItemClick(option)}>
                                  {option.order_raw_no}
                              </MenuItem>
                          )}
                          renderInput={(params) => <TextField {...params} label="Reff PO No." />}
                          size="small"
                          label="Reff PO No"
                          id="reffPo"
                          name="reffPo"
                          value={reffPo}
                          onChange={(e, newValue) => {
                              handleReffPoChange(newValue);
                              handleMenuItemClick(newValue);
                          }}  // Updated to pass the new value directly
                          sx={{ width: '300px' }}
                      />

                        {/*{data.map((receiveorderdetail, index) => (
                            <MenuItem key={index} value={receiveorderdetail.order_raw_no} onClick={() => handleMenuItemClick(receiveorderdetail)}>
                                {receiveorderdetail.order_raw_no}
                            </MenuItem>
                        ))}*/}
                        {/*</Autocomplete>*/}
                    </div>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2}}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '450px' }}>
                        <Typography variant="body1" style={{ marginRight: '10px' }}>
                        Code
                        </Typography>
                        <Autocomplete
                        required
                        options={otherInput || []}
                        getOptionLabel={(option) => (option && option.code) || otherInputIdCode}
                        renderOption={(props, option) => (
                              <MenuItem {...props} onMouseDown={() => handleMenuItemClick2(option)}>
                                  {option.code}
                              </MenuItem>
                          )}
                        renderInput={(params) => <TextField {...params} label="Code" />}
                        size="small"
                        label="Code"
                        id="code"
                        name="code"
                        value={otherInputIdCode}
                        onChange={(e, newValue) => {
                              handleReffPoChange2(newValue);
                              handleMenuItemClick2(newValue);
                          }}
                        sx={{ width: '300px'}}
                        />
                        {/*{Array.isArray(otherInput) && otherInput.length > 0 ? (
                          otherInput
                          .map((receiveorderdetails, index) => (
                          <MenuItem key={index} value={receiveorderdetails.code} onClick={() => handleMenuItemClick2(receiveorderdetails)}>
                              {receiveorderdetails.code}
                          </MenuItem>
                        ))
                        ) : (
                            <MenuItem disabled>Select an option</MenuItem>
                        )}*/}
                        {/*</TextField>*/}
                    </div>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2, display: 'none'}}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '450px' }}>
                <Typography variant="body1" style={{ marginRight: '10px' }}>
                  Id
                </Typography>
                <TextField
                required
                size="small"
                label="Id"
                variant="outlined"
                name="materialId"
                value={otherInputId}
                onChange={handleReffPoChange2}
                sx={{
                    width: '300px',
                    borderRadius: '20px',
                }}
                disabled
                />
              </div>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '450px' }}>
                <Typography variant="body1" style={{ marginRight: '10px' }}>
                  Material
                </Typography>
                <TextField
                required
                size="small"
                label="Material"
                variant="outlined"
                name="material"
                value={otherInputMaterial}
                onChange={handleReffPoChange2}
                sx={{
                    width: '300px',
                    borderRadius: '20px',
                }}
                disabled
                />
              </div>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '450px' }}>
                <Typography variant="body1" style={{ marginRight: '10px' }}>
                  Size
                </Typography>
                {/* <Select
                {/* <Select
                  label=""
                  variant="outlined"
                  name="size"
                  value={otherInput2}
                  onChange={handleReffPoChange}
                  sx={{
                    width: '300px',
                    backgroundColor: 'gray',
                    // borderRadius: '10px',
                  }}
                  inputProps={{
                        readOnly:true,
                        style: {
                            // color: 'green'
                        }
                   }}
                   disabled
                >
                <MenuItem value={otherInput2}>
                    {otherInput2}
                </MenuItem>
                </Select> */}
                <TextField
                required
                size="small"
                label="Size"
                variant="outlined"
                name="size"
                value={explodeSizeString(otherInputSize)}
                onChange={handleReffPoChange2}
                sx={{
                    width: '300px',
                    borderRadius: '20px',
                }}
                disabled
                />
              </div>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '450px' }}>
                <Typography variant="body1" style={{ marginRight: '10px' }}>
                  Weight (kg)
                </Typography>
                <TextField
                  required
                  size="small"
                  label="Weight"
                  variant="outlined"x
                  name="weight"
                  value={weight}
                  onChange={(e) => handleWeightChange(e)}
                  sx={{
                    width: '300px',
                  }}
                  InputProps={{
                    inputComponent: NumericFormatCustom2,
                  }}
                  autoComplete="off"
                />
              </div>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '450px' }}>
                <Typography variant="body1" style={{ marginRight: '10px' }}>
                   Price/kg
                </Typography>
                <TextField
                  required
                  size="small"
                  label="Prize"
                  variant="outlined"
                  name="price"
                  value={price}
                  onChange={(e) => handlePriceChange(e)}
                  sx={{
                    width: '300px',
                  }}
                  InputProps={{
                    inputComponent: NumericFormatCustom,
                  }}
                  autoComplete="off"
                />
              </div>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '450px' }}>
              <Typography variant="body1" style={{ marginRight: '10px' }}>
                Quantity
              </Typography>
              <TextField
                  required
                  size="small"
                  label="Quantity"
                  variant="outlined"
                  name="qtyRcv"
                  value={qtyRcv}
                  onChange={handleQtyChange}
                  sx={{
                    width: '300px',
                  }}
                  InputProps={{
                    inputComponent: NumericFormatCustom2,
                  }}
                  autoComplete="off"
                />
            </div>
          </FormControl>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', width: '450px' }}>
                    <Button variant="contained" color="primary" type="submit" size="small">
                        Save
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleCancel} style={{ marginLeft: '10px' }} size="small">
                        Cancel
                    </Button>
                </div>
            </form>
        </Box>
      </Modal>
      {/* Tabel untuk menampilkan item */}
      <div>
      <TableContainer component={Paper} style={{ marginTop: '20px', overflowX: 'auto' }}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ m: 0, p:1 }}><b>No.</b></TableCell>
              <TableCell sx={{ m: 0, p:1 }}><b>Reff PO</b></TableCell>
              <TableCell sx={{ m: 0, p:1 }}><b>Code</b></TableCell>
              <TableCell sx={{ m: 0, p:1 }}><b>Size</b></TableCell>
              <TableCell sx={{ m: 0, p:1 }}><b>Weight (kg)</b></TableCell>
              <TableCell sx={{ m: 0, p:1 }}><b>Price/kg</b></TableCell>
              <TableCell sx={{ m: 0, p:1 }}><b>Qty</b></TableCell>
              <TableCell sx={{ m: 0, p:1 }}><b>Weight Total</b></TableCell>
              <TableCell sx={{ m: 0, p:1 }}><b>Amount</b></TableCell>
              <TableCell sx={{ m: 0, p:1 }}><b>Setting</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {receiveId ? (
             dataDatabase && dataDatabase.length > 0 ? (
              dataDatabase.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
              const overallIndex = page * rowsPerPage + index + 1;
              return (
                <>

                <Modal
                  open={isDeleteConfirmationOpen[item.code]}
                  onClose={() => closeDeleteConfirmationModalRemove(item.code)}
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
                      Are you sure you want to delete this {item.code}?
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => handleRemoveItemMaterialData(item.code, index)}>
                      Yes
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => closeDeleteConfirmationModalRemove(item.code)} style={{ marginLeft: '10px' }}>
                      Cancel
                    </Button>
                  </Box>
                </Modal>

                {/* Modal untuk mengedit item */}
                <Modal
                  open={isModalOpenId[item.id]}
                  onClose={() => handleCancelId(item.id)}
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
                      borderRadius: 5,
                      width: 525
                    }}
                  >
                    <Typography variant='h6' gutterBottom>
                      {selectedItemId ? 'Edit Product' : 'Add Product'}
                    </Typography>
                    <form onSubmit={(e) => handleFormSubmitEditData(e, index, item.id, item)}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '450px'}}>
                                  <Typography variant="body1">
                                  Reff PO No.
                                  </Typography>
                                  <TextField
                                  disabled
                                  select
                                  size="small"
                                  label="Reff PO No"
                                  id="reffPo"
                                  name="reffPo"
                                  value={item.reff_po}
                                  onChange={(e) => handleReffPoChangeId(e, item.id)}
                                  sx={{ width: '300px'}}
                                  >
                                  {data.map((receiveorderdetail, index) => (
                                      <MenuItem key={index} value={receiveorderdetail.order_raw_no} onClick={() => handleMenuItemClick(receiveorderdetail)}>
                                          {receiveorderdetail.order_raw_no}
                                      </MenuItem>
                                  ))}
                                  </TextField>
                              </div>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2}}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '450px' }}>
                                  <Typography variant="body1" style={{ marginRight: '10px' }}>
                                  Code
                                  </Typography>
                                  <TextField
                                  disabled
                                  size="small"
                                  select
                                  label="Code"
                                  id="code"
                                  name="code"
                                  value={item.code}
                                  onChange={(e) => handleReffPoChange2Id(e, item.id)}
                                  sx={{ width: '300px'}}
                                  >
                                  {Array.isArray(receiveorderdetails) && receiveorderdetails.length > 0 ? (
                                    receiveorderdetails?.map((receiveorderdetails, index) => (
                                    <MenuItem value={receiveorderdetails.code} onClick={() => handleMenuItemClick3(receiveorderdetails, item.id)}>
                                        {receiveorderdetails.code}
                                    </MenuItem>
                                  )) 
                                  ) : (
                                    <MenuItem disabled>Select an option</MenuItem>
                                    )}
                                  {/* Conditionally render data from combinedData if receiveId exists */}
                                  </TextField>
                              </div>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2, display: 'none'}}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '450px' }}>
                          <Typography variant="body1" style={{ marginRight: '10px' }}>
                            Id
                          </Typography>
                          <TextField
                          size="small"
                          label="Id"
                          variant="outlined"
                          name="materialId"
                          value={dataDatabase.pc_order_raw_detail_id}
                          onChange={handleReffPoChange2}
                          sx={{
                              width: '300px',
                              borderRadius: '20px',
                          }}
                          disabled
                          />
                        </div>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '450px' }}>
                          <Typography variant="body1" style={{ marginRight: '10px' }}>
                            Size
                          </Typography>
                          <TextField
                          size="small"
                          label="Size"
                          variant="outlined"
                          name="size"
                          value={explodeSizeString(item.size)}
                          onChange={handleReffPoChange2}
                          sx={{
                              width: '300px',
                              borderRadius: '20px',
                          }}
                          disabled
                          />
                        </div>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '450px' }}>
                          <Typography variant="body1" style={{ marginRight: '10px' }}>
                            Weight (kg)
                          </Typography>
                          <TextField
                            size="small"
                            label="Weight"
                            variant="outlined"
                            name="weight"
                            value={item.weight}
                            onChange={(e) => setWeight(e.target.value)}
                            sx={{
                              width: '300px',
                            }}
                            InputProps={{
                              inputComponent: NumericFormatCustom2,
                            }}
                          />
                        </div>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '450px' }}>
                          <Typography variant="body1" style={{ marginRight: '10px' }}>
                             Price/kg
                          </Typography>
                          <TextField
                            size="small"
                            label="Prize"
                            variant="outlined"
                            name="price"
                            value={item.price}
                            onChange={(e) => setPrice(e.target.value)}
                            sx={{
                              width: '300px',
                            }}
                            InputProps={{
                              inputComponent: NumericFormatCustom,
                            }}
                          />
                        </div>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '450px' }}>
                        <Typography variant="body1" style={{ marginRight: '10px' }}>
                          Quantity
                        </Typography>
                        <TextField
                            size="small"
                            label="Quantity"
                            variant="outlined"
                            name="qtyRcv"
                            value={item.qty_rcv}
                            onChange={(e) => setQtyRcv(e.target.value)}
                            sx={{
                              width: '300px',
                            }}
                            InputProps={{
                              inputComponent: NumericFormatCustom2,
                            }}
                          />
                      </div>
                    </FormControl>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', width: '450px' }}>
                          <Button variant="contained" color="primary" type="submit" size="small" >
                              Update
                          </Button>
                          <Button variant="contained" color="secondary" onClick={() => handleCancelId(item.id)} style={{ marginLeft: '10px' }} size='small'>
                              Cancel
                          </Button>
                      </div>
                      </form>
                  </Box>
                </Modal>

              <TableRow key={item.id}>
                <TableCell>{overallIndex}</TableCell>
                <TableCell>{item.reff_po}</TableCell>
                <TableCell>{item.code}</TableCell>
                <TableCell>{explodeSizeString(item.size)}</TableCell>
                <TableCell>{formatThousand(item.weight)} kg</TableCell>
                <TableCell>{formatCurrency(item.price)}</TableCell>
                <TableCell>{item.qty_rcv}</TableCell>
                <TableCell>{formatThousand(item.weight * item.qty_rcv)} kg</TableCell>
                <TableCell>{formatCurrency(
                    item.price * item.qty_rcv * item.weight
                  )}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditItemOpenModal(item.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => openDeleteConfirmationModalRemove(item.code, index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
              </>
              );
            })) : (
              <TableRow>
                <TableCell align="center" colSpan={10}>No data available</TableCell>
              </TableRow>
            )
            ) : (
            dataTemp && dataTemp.length > 0 ? (
              dataTemp.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
              const overallIndex = page * rowsPerPage + index + 1;
              return (
                <>

                {/* Modal untuk menambah atau mengedit item */}
                  <Modal
                    open={isModalOpenTemp[index]}
                    onClose={() => closeAddItemModalTemp(index)}
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
                        borderRadius: 5,
                        width: 525
                      }}
                    >
                      <Typography variant='h6' gutterBottom>
                        {selectedItemId ? 'Edit Product' : 'Add Product'}
                      </Typography>
                      <form onSubmit={(e) => handleFormSubmitEdit(e, index, item)}>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '450px'}}>
                                    <Typography variant="body1">
                                    Reff PO No.
                                    </Typography>
                                    <TextField
                                    required
                                    select
                                    size="small"
                                    label="Reff PO No"
                                    id="reffPo"
                                    name="reffPo"
                                    value={item.reffPo}
                                    onChange={handleReffPoChange}
                                    sx={{ width: '300px'}}
                                    disabled
                                    >
                                    {data.map((receiveorderdetail, index) => (
                                        <MenuItem key={index} value={receiveorderdetail.order_raw_no} onClick={() => handleMenuItemClick(receiveorderdetail)}>
                                            {receiveorderdetail.order_raw_no}
                                        </MenuItem>
                                    ))}
                                    </TextField>
                                </div>
                      </FormControl>

                      <FormControl fullWidth sx={{ mb: 2}}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '450px' }}>
                                    <Typography variant="body1" style={{ marginRight: '10px' }}>
                                    Code
                                    </Typography>
                                    <TextField
                                    required
                                    size="small"
                                    select
                                    label="Code"
                                    id="code"
                                    name="code"
                                    value={item.otherInputIdCode}
                                    onChange={handleReffPoChange2}
                                    sx={{ width: '300px'}}
                                    disabled
                                    >
                                    {Array.isArray(receiveorderdetails) && receiveorderdetails.length > 0 ? (
                                      receiveorderdetails
                                      .map((receiveorderdetails, index) => (
                                      <MenuItem key={index} value={receiveorderdetails.code} onClick={() => handleMenuItemClick2(receiveorderdetails)}>
                                          {receiveorderdetails.code}
                                      </MenuItem>
                                    ))
                                    ) : (
                                        <MenuItem disabled>Select an option</MenuItem>
                                    )}
                                    </TextField>
                                </div>
                      </FormControl>
                      <FormControl fullWidth sx={{ mb: 2, display: 'none'}}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '450px' }}>
                            <Typography variant="body1" style={{ marginRight: '10px' }}>
                              Id
                            </Typography>
                            <TextField
                            required
                            size="small"
                            label="Id"
                            variant="outlined"
                            name="materialId"
                            value={item.otherInputId}
                            onChange={handleReffPoChange2}
                            sx={{
                                width: '300px',
                                borderRadius: '20px',
                            }}
                            disabled
                            />
                          </div>
                      </FormControl>

                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '450px' }}>
                            <Typography variant="body1" style={{ marginRight: '10px' }}>
                              Material
                            </Typography>
                            <TextField
                            required
                            size="small"
                            label="Material"
                            variant="outlined"
                            name="material"
                            value={item.otherInputMaterial}
                            onChange={handleReffPoChange2}
                            sx={{
                                width: '300px',
                                borderRadius: '20px',
                            }}
                            disabled
                            />
                          </div>
                      </FormControl>

                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '450px' }}>
                            <Typography variant="body1" style={{ marginRight: '10px' }}>
                              Size
                            </Typography>
                            <TextField
                            required
                            size="small"
                            label="Size"
                            variant="outlined"
                            name="size"
                            value={explodeSizeString(item.otherInputSize)}
                            onChange={handleReffPoChange2}
                            sx={{
                                width: '300px',
                                borderRadius: '20px',
                            }}
                            disabled
                            />
                          </div>
                      </FormControl>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '450px' }}>
                            <Typography variant="body1" style={{ marginRight: '10px' }}>
                              Weight (kg)
                            </Typography>
                            <TextField
                              required
                              size="small"
                              label="Weight"
                              variant="outlined"
                              name="weight"
                              value={item.weight}
                              onChange={(e) => setWeight(e.target.value)}
                              sx={{
                                width: '300px',
                              }}
                              InputProps={{
                                inputComponent: NumericFormatCustom2,
                              }}
                            />
                          </div>
                      </FormControl>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '450px' }}>
                            <Typography variant="body1" style={{ marginRight: '10px' }}>
                               Price/kg
                            </Typography>
                            <TextField
                              required
                              size="small"
                              label="Prize"
                              variant="outlined"
                              name="price"
                              value={item.price}
                              onChange={(e) => setPrice(e.target.value)}
                              sx={{
                                width: '300px',
                              }}
                              InputProps={{
                                inputComponent: NumericFormatCustom,
                              }}
                            />
                          </div>
                      </FormControl>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '450px' }}>
                          <Typography variant="body1" style={{ marginRight: '10px' }}>
                            Quantity
                          </Typography>
                          <TextField
                              required
                              size="small"
                              label="Quantity"
                              variant="outlined"
                              name="qtyRcv"
                              value={item.qtyRcv}
                              onChange={(e) => setQtyRcv(e.target.value)}
                              sx={{
                                width: '300px',
                              }}
                              InputProps={{
                                inputComponent: NumericFormatCustom2,
                              }}
                            />
                        </div>
                      </FormControl>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', width: '450px' }}>
                                <Button variant="contained" color="primary" type="submit" size="small">
                                    Update
                                </Button>
                                <Button variant="contained" color="secondary" onClick={() => closeAddItemModalTemp(index)} style={{ marginLeft: '10px' }} size="small">
                                    Cancel
                                </Button>
                            </div>
                          </form>
                    </Box>
                  </Modal>

                {/* Modal konfirmasi penghapusan */}
                  <Modal
                    open={isDeleteConfirmationOpen[index]}
                    onClose={() => closeDeleteConfirmationModalRemove(index)}
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
                        Are you sure you want to delete this {item.otherInputIdCode}?
                      </Typography>
                      <Button variant="contained" color="primary" onClick={() => handleRemoveItemMaterialTemp(item.otherInputIdCode, index)}>
                        Yes
                      </Button>
                      <Button variant="contained" color="secondary" onClick={() => closeDeleteConfirmationModalRemove(index)} style={{ marginLeft: '10px' }}>
                        Cancel
                      </Button>
                    </Box>
                  </Modal>

              <TableRow key={item.id}>
                <TableCell>{overallIndex}</TableCell>
                <TableCell>{item.reffPo}</TableCell>
                <TableCell>{item.otherInputIdCode}</TableCell>
                <TableCell>{explodeSizeString(item.otherInputSize)}</TableCell>
                <TableCell>{formatThousand(item.weight)} kg</TableCell>
                <TableCell>{formatCurrency(item.price)}</TableCell>
                <TableCell>{item.qtyRcv}</TableCell>
                <TableCell>{formatThousand(item.weight * item.qtyRcv)} kg</TableCell>
                <TableCell>{formatCurrency(
                    item.price * item.qtyRcv * item.weight
                  )}</TableCell>
                <TableCell>
                <IconButton
                    color="primary"
                    onClick={() => openAddItemModalTemp(index)}
                  >
                    <EditIcon />
                    </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => openDeleteConfirmationModalRemove(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
              </>
              );
            })) : (
              <TableRow>
                <TableCell align="center" colSpan={10}>No data available</TableCell>
              </TableRow>
            )
            )}
            <TableRow>
                    <TableCell colSpan={7} style={{ textAlign: 'center' }}>
                        Total
                    </TableCell>
                    <TableCell colSpan={1}>
                        {formatThousand(formData.weight_recieve_total)} Kg
                    </TableCell>
                    <TableCell colSpan={1}>
                        {formatCurrency(formData.amount_recieve_total)}
                    </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
        {/* <div style={{ display: 'flex', alignItems: 'center', flexDirection: isSmallScreen || isMediumScreen ? 'column' : 'row' }}> */}
    </div>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={receiveId ? dataDatabase ? dataDatabase.length : 0 : dataTemp ? dataTemp.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
        <hr style={{color: "white"}}/>

      {receiveId ? (
        <div style={{ display: 'flex', justifyContent: 'space-between'}}>
        <Button
            variant="contained"
            color="success"
            size="small"
            onClick={openPostingModal}
            >
            Posting
            </Button>
        <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
        <InertiaLink href='/receive-order'>
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
        {/* <InertiaLink href='/receive-order'> */}
        <Button
        variant="contained"
        color="primary"
        style={{ backgroundColor: buttonSaveColor || 'primary', color: 'white', marginLeft: '10px' }}
        size="small"
        onClick={updateItemReceiveRaw}
        >
          Update
        </Button>
        {/* </InertiaLink> */}
      </div>
      </div>
        ) : (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <InertiaLink href='/receive-order'>
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
        onClick={saveItemReceiveRaw}
        size="small"
        >
          Save
        </Button>
      </div>
      )}
    </Homepage>
    </ThemeProvider>
  );
};

export default ReceiveOrderDetails;