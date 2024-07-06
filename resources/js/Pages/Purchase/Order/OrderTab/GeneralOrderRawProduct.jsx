import { Head } from '@inertiajs/inertia-react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Checkbox, MenuItem, Modal, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Grid from '@mui/material/Unstable_Grid2';
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import Homepage from '../../../Components/Homepage';
import { render } from 'react-dom';

const GeneralOrderRawProduct = ({ orderdetailraw, data, supplier, order_id, id, dataRc, orderDetailId, dataRecieve }) => {
    const [items, setItems] = useState([]);
    const [dataDatabase, setDataDatabase] = useState([]);
    const [dataTemp, setDataTemp] = useState([]);
    const [isModalAdd, setIsModalAdd] = useState(false);
    const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedData, setSelectedData] = useState([]);
    const [itemToDeleteId, setItemToDeleteId] = useState(null);
    const [postingModal, setPostingModal] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);
    const [openEditOrderDetail, setOpenEditOrderDetail] = useState(false);
    const [pageRc, setPageRc] = useState(0);
    const [rowsPerPageRc, setRowsPerPageRc] = useState(5);
    const [dataRcState, setDataRcState] = useState([]);
    const [dataRcStateDetail, setDataRcStateDetail] = useState([]);
    const [dataExistData, setDataExistData] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
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
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');


    const handleCancel = () => {
        closeAddItemModal();
    };

    const openAddItemModal = () => {
        setIsModalAdd(true);
    };

    const closeAddItemModal = () => {
        setIsModalAdd(false);
        setSelectedItemId(null);
    };

    const closeDeleteConfirmationModal = () => {
        setIsDeleteConfirmationOpen(false);
        setItemToDeleteId(null);
    };

    const closingPostingModal = () => {
        setPostingModal(false);
    }

    const openPostingModal = () => {
        setPostingModal(true);
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

    useEffect(() => {
        const filtered = orderdetailraw.filter((item) =>
          item.material.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredItems(filtered);
    }, [items, searchTerm]);



    const formDataEditDetailOrder = (event, itemId, index) => {
        const { name, value } = event.target;

        setFormDataEditDetail((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    };

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
        Inertia.reload()
        setSnackbarSeverity('success');
        setSnackbarMessage('Item deleted successfully');
        setSnackbarOpen(true);
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
          if(order_id) {
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


    const url = window.location.href;
    const splitPathname = url.split("/")
    const itemId = splitPathname[splitPathname.length - 1]
    const fullpilihan = <Checkbox
        indeterminate={selectedItems.length > 0 && selectedItems.length < data.length}
        checked={selectedItems.length === data.length}
        onChange={handleSelectAllItems}
    />;

    const itemsColumn = [
        {
            field: 'no',
            headerName: 'No',
            editable: false,
        },
        {
            field: 'code',
            headerName: 'Code',
            editable: false,
        },
        {
            field: 'material',
            headerName: 'Material',
            editable: false,
        },
        {
            field: 'size',
            headerName: 'Size',
            editable: false,
        },
        {
            field: 'status',
            headerName: 'Status',
            editable: false,
        },
        {
            field: 'note',
            headerName: 'Note',
            editable: false,
        },
        {
            field: 'action',
            headerName: 'Actions',
            editable: false,
            renderCell: (dataTemp) => {
              return (
                <>
                  <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    onClick={() => {}}
                  />
                  <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => {}}
                  />
                </>
              );
            }
        },
    ];

    const itemsRow = dataTemp.map((item, index) => ({
        no: index + 1,
        id: item.raw_product_id,
        material: item.material,
        code: item.code,
        size: item.size,
        status: item.status,
        note: '-'
    }));

    const columns = [
        {
          field: 'pilih',
          headerName: fullpilihan,
          editable: false,
          flex: 0.05,
          renderCell: (data) => {
            return (
                <>
                    <Checkbox
                        checked={selectedItems.includes(data.id)}
                        onChange={() => handleToggleItem(data.id)}
                    />
                </>
            );
          }
        },
        {
          field: 'no',
          headerName: 'No',
          editable: false,
        },
        {
          field: 'code',
          headerName: 'Code',
          editable: false,
        },
        {
          field: 'name',
          headerName: 'Name',
          editable: false,
        },
        {
          field: 'size',
          headerName: 'Size',
          editable: false,
        },
        {
          field: 'action',
          headerName: 'Actions',
          editable: false,
          renderCell: (data) => {
            return (
              <>
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="Edit"
                  onClick={() => {}}
                />
                <GridActionsCellItem
                  icon={<DeleteIcon />}
                  label="Delete"
                  onClick={() => {}}
                />
              </>
            );
          }
        },
      ];

    const rows = data.map((data, index) => ({
    id: data.id,
    no: index + 1,
    code: data.code,
    name: data.name,
    size: data.size,
    pilih: data,
    action: data
    }));

    const emptyRow = [{
        id: '0',
        no: '-',
        code: '-',
        material: '-',
        size: '-',
        status: '-',
        note: '-'
    }]

    return (
        <Homepage>
            <Head title="General Order Raw Product" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant='h4'>
                General Order Raw Product
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                </div>
            </div>
            <hr style={{color:'white'}}/>

            <TableContainer component={Paper} style={{ padding: '10px' }}>
                <Grid
                    container
                    spacing={2}
                    columns={{ xs: 4, sm: 8, md: 10, lg: 12 }}
                    sx={{ flexGrow: 1}}
                >
                    <Grid xs={4} sm={4} md={5} lg={6}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Typography variant="h7">
                                Supplier
                            </Typography>
                            <TextField
                                select
                                label="Supplier"
                                variant="outlined"
                                value={formData.supplier_id}
                                onChange={handleFormChange}
                                style={{width: '60%'}}
                                size="small"
                                name="supplier_id"
                            >
                                {supplier.map((supplier) => (
                                    <MenuItem key={supplier.id} value={supplier.id}>
                                    {supplier.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                    </Grid>
                    <Grid xs={4} sm={4} md={5} lg={6}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Typography variant="h7">
                                Weight (kg)
                            </Typography>
                            <TextField
                                label="Weight"
                                variant="outlined"
                                value={formData.weight_order_total}
                                onChange={handleFormChange}
                                size="small"
                                name="weight_order_total"
                                style={{width: '60%'}}
                                InputProps={{
                                    inputComponent: NumericFormatCustom2,
                                }}
                            />
                        </div>
                    </Grid>
                    <Grid xs={4} sm={4} md={5} lg={6}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Typography variant="h7">
                                Note
                                &nbsp;
                            </Typography>
                            <TextField
                                label="Note"
                                variant="outlined"
                                name="note"
                                value={formData.note}
                                onChange={handleFormChange}
                                sx={{ width: '60%'}}
                                size='small'
                                rows={3}
                                multiline
                            />
                        </div>
                    </Grid>
                    <Grid xs={4} sm={4} md={5} lg={6}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '1.5%'
                            }}
                        >
                            <Typography variant="h7">
                                Price/kg
                            </Typography>
                            <TextField
                                label="Price/kg"
                                variant="outlined"
                                value={formData.price_order_total}
                                onChange={handleFormChangePrice}
                                size="small"
                                name="price_order_total"
                                style={{width: '60%'}}
                                InputProps={{
                                    inputComponent: NumericFormatCustom,
                                }}
                            />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Typography variant="h7">
                                Amount
                            </Typography>
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
                                style={{width: '60%'}}
                            />
                        </div>
                    </Grid>
                </Grid>
            </TableContainer>

            <hr style={{color:'white'}}/>

            <Grid container columnSpacing={10} rowSpacing={5}>
                <div
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        width: '100%'
                    }}
                >
                    <Grid lg={6}>
                        <Typography variant='h4'>
                            Product
                        </Typography>
                    </Grid>
                    <Grid lg={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant='contained'
                            onClick={openAddItemModal}
                            size='small'
                        >
                            Add New
                        </Button>
                    </Grid>
                </div>
            </Grid>

            <hr style={{color:'white'}}/>

            {/* Data grid untuk menampilkan item */}
            <Box style={{ width: '100%' }}>
                <DataGrid
                    disableColumnSelector
                    disableDensitySelector
                    density="compact"
                    size="small"
                    sx={{ '--DataGrid-overlayHeight': '300px', boxShadow: 2 }}
                    component={Paper}
                    rows={itemsRow.length > 0 ? itemsRow : emptyRow}
                    columns={itemsColumn}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: {
                        showQuickFilter: true,
                        },
                    }}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 5 } },
                        columns: {
                        ...dataTemp.initialState?.columns,
                        id: { hide: true }, // Hide the id column
                        },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                />
            </Box>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px'}}>
              <Button variant="contained" color="error" href='/order' size='small' style={{ marginRight: '10px' }}>
              Close
              </Button>
            </div>

            {/* Modal */}

            <Modal
                open={isModalAdd}
                onClose={handleCancel}
                aria-labelledby="add-item-modal"
                aria-describedby="form-for-adding-or-editing-item"
            >

                {/* Data grid untuk menampilkan item */}
                <Box
                    sx={{
                        top: '50%',
                        left: '50%',
                        position: 'absolute',
                        bgcolor: 'background.paper',
                        transform: 'translate(-50%, -50%)',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 5
                    }}
                >
                    <DataGrid
                    disableColumnSelector
                    disableDensitySelector
                    density="compact"
                    size="small"
                    sx={{ '--DataGrid-overlayHeight': '300px', boxShadow: 2 }}
                    component={Paper}
                    rows={rows}
                    columns={columns}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: {
                        showQuickFilter: true,
                        },
                    }}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 5 } },
                        columns: {
                        ...data.initialState?.columns,
                        id: { hide: true }, // Hide the id column
                        },
                    }}
                    pageSizeOptions={[5, 10, 25]}
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
        </Homepage>
    );
};

export default GeneralOrderRawProduct;
