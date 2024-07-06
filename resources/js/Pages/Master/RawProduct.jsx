import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import Modal from '@mui/material/Modal';
import { Button, IconButton, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination, Grid, useTheme, useMediaQuery } from '@mui/material';
import axios from 'axios';
import InputLabel from '@mui/material/InputLabel';
import { DataGrid, GridToolbar, GridActionsCellItem, GridCell } from '@mui/x-data-grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress } from '@mui/material';
import Homepage from '../Components/Homepage';
import Box from '@mui/material/Box';
import { Inertia } from '@inertiajs/inertia';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { InertiaLink, Head } from '@inertiajs/inertia-react';

const RawProduct = ({rawProducts, materials, unit, rawproduct}) => {
  const [rawProductss, setRawProducts] = useState([]);

  const [filteredRawProducts, setFilteredRawProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    material_id: '',
    size1: '',
    size2: '',
    unit1: '',
    unit2: '',
    status: '',
  });
  const [selectedRawProductId, setSelectedRawProductId] = useState(null);
  const [rawProductToDeleteId, setRawProductToDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [materialOptions, setMaterialOptions] = useState([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [materialName, setMaterialName] = useState('');
  //pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const url = window.location.href;
//notif
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // atau 'error' untuk notifikasi error

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

  // Helper function to split size into size1 and size2
  const splitSize = (size) => {
    const [size1, size2] = size.split('X').map(value => value.trim());
    return { size1, size2 };
  };

  useEffect(() => {
    // Check if id exists
    if (rawproduct) {
        // Update formData state with the fetched data
        setFormData({
          ...formData,
          unit1: rawproduct.unit,
          status: rawproduct.status,
      });
    }
  }, [rawproduct]);

    useEffect(() => {
      const filtered = rawProducts.filter((rawProduct) =>
        rawProduct.size && rawProduct.size.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setFilteredRawProducts(filtered);
    }, [rawProducts, searchTerm]);



  const refreshPage = async () => {
    try {
      const response = await Inertia.visit(url, { method: 'get', data: {}, replace: false, preserveState: true, preserveScroll: false });
      setRawProducts(response);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };


  const fetchRawProducts = async () => {
    try {
        const response = await axios.get('/raw-product');
        setRawProducts(response.data);
    } catch (error) {
        console.error('Error fetching raw products:', error);
        // Show an error message to the user
        // Set an error state if needed
    }
  };



    const handleAddRawProduct = async () => {
      try {
        await axios.post('/raw-product', formData);
        closeAddRawProductModal();
        setFormData({
          code: '',
          material_id: '',
          size: '',
          status: '',
        });
        // refreshPage();
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

  const handleDeleteRawProduct = (id) => {
    setRawProductToDeleteId(id);
    openDeleteConfirmationModal();
  };

  const confirmDelete = () => {
    try {
      axios.delete(`/raw-product/${rawProductToDeleteId}`).then(() => {
        closeDeleteConfirmationModal();
        // refreshPage();
        Inertia.reload();

        // Tampilkan notifikasi sukses
        setSnackbarSeverity('success');
        setSnackbarMessage('Raw product deleted successfully');
        setSnackbarOpen(true);
      });
    } catch (error) {
      console.error('Error deleting raw product:', error);

      // Tampilkan notifikasi error
      setSnackbarSeverity('error');
      setSnackbarMessage('Error deleting raw product');
      setSnackbarOpen(true);
    }
  };


  const handleEditRawProduct = (rawProduct) => {
    setSelectedRawProductId(rawProduct.value.id);
    console.log(rawProduct.size);

    // Use explodeSizeString to get size1, size2, unit1, and unit2
    const [size1, unit1, size2, unit2] = explodeSizeString2(rawProduct.value.size);

    setFormData({
      code: rawProduct.value.code,
      material_id: rawProduct.value.material_id,
      size1: size1 || '', // Assign the values from explodeSizeString
      size2: size2 || '',
      unit1: unit1 || '',
      unit2: unit2 || '',
      status: rawProduct.value.status,
    });
    openAddRawProductModal();
  };

  const handleUpdateRawProduct = async () => {
    try {
      const rawProductID = selectedRawProductId || 'new';
      const updatedSize = `${formData.size1 || ''} x ${formData.size2 || ''} mm`;
      await axios.put(`/raw-product/${selectedRawProductId}`, {
        ...formData,
        size: updatedSize,
      });
      closeAddRawProductModal();
      setFormData({
        code: '',
        material_id: '',
        size1: '',
        size2: '',
        status: '',
      });
      setSelectedRawProductId(null);
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

  const handleSaveRawProduct = () => {
    if (selectedRawProductId) {
      handleUpdateRawProduct();
    //   refreshPage();
      Inertia.reload();
    } else {
      handleAddRawProduct();
    }
  };

  const handleCancel = () => {
    closeAddRawProductModal();
  };

  const openAddRawProductModal = () => {
    setIsModalOpen(true);
  };

  const closeAddRawProductModal = () => {
    setIsModalOpen(false);
    setFormData({
      code: '',
      material_id: '',
      size: '',
      status: '',
      size1: '',
      size2: '',
    });
    setSelectedRawProductId(null);
  };

  const openDeleteConfirmationModal = () => {
    setIsDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmationModal = () => {
    setIsDeleteConfirmationOpen(false);
    setRawProductToDeleteId(null);
  };

  const handleFormChange = (e) => {
    // Update the form data as usual
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Check if the changed field is 'material_id'
    if (e.target.name === 'material_id') {
      // Fetch material information based on the selected material_id
      const selectedMaterial = materials.find((material) => material.id === e.target.value);

      // Update the 'code' field in the form data with the fetched material code and Size1 and Size2
      setFormData((prevFormData) => ({
        ...prevFormData,
        code: selectedMaterial ? `${selectedMaterial.code}${formData.size1 || ''}X${formData.size2 || ''}` : '', // Concatenate Size1 and Size2 to the code
      }));
    }
  };


  const handleCodeChange = async (event) => {
    const name = event.target.value;

    try {
      const response = await axios.get(`/getMaterialCodeByName/${name}`);
      const fetchedMaterial = response.data;

      setFormData({
        ...formData,
        code: fetchedMaterial.code, // Use fetchedMaterial.code instead of code
        material_id: fetchedMaterial.id,
      });
      setMaterialName(fetchedMaterial.name);
      setSelectedCode(name); // Use name instead of code
    } catch (error) {
      console.error('Error fetching material name:', error);
    }
  };

  const handleSizeChange = (e, field) => {
    const value = e.target.value.trim();

    // Check if the value is a valid number or an empty string
    if (/^-?\d*\.?\d*$/.test(value) || value === '') {
      setFormData((prevFormData) => {
        const newSizeData = {
          ...prevFormData,
          [field]: value,
        };

        const materialCode = materials.find(material => material.id === newSizeData.material_id)?.code || '';
        const updatedCode = `${materialCode}${newSizeData.size1 || ''}X${newSizeData.size2 || ''}`;

        // Update the 'code' field in the form data
        return {
          ...newSizeData,
          code: updatedCode,
        };
      });
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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

const columns = [
  {
    field: 'no',
    headerName: 'No',
    editable: false,
    width: 50,
  },
  {
    field: 'code',
    headerName: 'Code',
    editable: false,
    width: 150,
  },
  {
    field: 'material_id',
    headerName: 'Material',
    editable: false,
    width: 375,
    renderCell: (rawProduct) => {
      <span>{rawProduct.material_id ? rawProduct.material.name : ''}</span>
    }
  },
  {
    field: 'size',
    headerName: 'Size',
    editable: false,
    width: 375,
    
  },
  {
    field: 'status',
    headerName: 'Status',
    editable: false,
    width: 375,
  },
  {
    field: 'setting',
    headerName: 'Setting',
    width: 150,
    renderCell: (rawproduct) => (
      <><IconButton color="primary" onClick={() => handleDeleteRawProduct(rawproduct.id)} size="small">
          <DeleteIcon fontSize="small" />
        </IconButton>
        <IconButton color="secondary" onClick={() => handleEditRawProduct(rawproduct)} size="small">
          <EditIcon fontSize="small" />
        </IconButton>
        
      </>
    ),
  },
];

const rows = rawProducts.map((rawProduct, index) => ({
  id: rawProduct.id,
  no: index + 1,
  code: rawProduct.code,
  material_id: rawProduct.material_id ? rawProduct.material.name : '',
  size: explodeSizeString(rawProduct.size),
  status: rawProduct.status == '0' ? 'Active' : rawProduct.status == '1' ? 'Inactive' : '',
  setting: rawProduct,
 
}));

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Homepage>
    <Head title="Data Master - Raw Product" />
    <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000} // Durasi notifikasi dalam milidetik (misalnya, 3000 = 3 detik)
        onClose={closeSnackbar}
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
          onClose={closeSnackbar}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Typography variant='h4'>
          Raw Products
        </Typography>
        <Button variant="contained" color="primary" size='small' onClick={openAddRawProductModal}>
          Add new
        </Button>
      </div>

      <hr style={{color: 'white'}} />

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

      {/* Modal untuk menambah atau mengedit raw product */}
      <Modal
        open={isModalOpen}
        onClose={handleCancel}
        aria-labelledby="add-raw-product-modal"
        aria-describedby="form-for-adding-or-editing-raw-product"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isSmallScreen ? '90%' : '80%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 5
          }}
        >
          <Typography variant='h6' gutterBottom>
            {selectedRawProductId ? 'Edit Raw Product' : 'Add Raw Product'}
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={4} alignItems="center" justifyContent="flex-start" style={{ display: 'grid', placeItems: 'center', textAlign: 'left' }}>
                    <Typography variant="body1">
                        Code
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        label="Code"
                        variant="outlined"
                        name="code"
                        value={formData.code}
                        onChange={handleFormChange}
                        sx={{ width: '100%' }}
                        InputProps={{
                            readOnly:true,
                        }}
                        disabled
                        size='small'
                    />
                </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={4} alignItems="center" justifyContent="flex-start" style={{ display: 'grid', placeItems: 'center', textAlign: 'left' }}>
                    <Typography variant="body1">
                        Material
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        label="Material"
                        select
                        id="material_id"
                        name="material_id"
                        value={formData.material_id}
                        onChange={handleFormChange}
                        sx={{ width: '100%' }}
                        size='small'
                        >
                        {materials.map((material) => (
                            <MenuItem key={material.id} value={material.id}>
                            {material.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={4} alignItems="center" justifyContent="flex-start" style={{ display: 'grid', placeItems: 'center', textAlign: 'left' }}>
                    <Typography variant="body1">
                        Size
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <Grid container spacing={isSmallScreen ? 1 : 2} alignItems="center">
                        <Grid item xs={isSmallScreen ? 6 : 3}>
                            <TextField
                            label="Size"
                            variant="outlined"
                            name="size1"
                            value={formData.size1 || ''}
                            sx={{ width: '100%' }}
                            onChange={(e) => handleSizeChange(e, 'size1')}
                            size='small'
                            autoComplete="off"
                            />
                        </Grid>
                        <Grid item xs={isSmallScreen ? 6 : 2.5}>
                            <TextField
                            select
                            label='Unit'
                            name="unit1"
                            value={formData.unit1 || ''}
                            onChange={(e) => handleUnitChange(e, 'unit1')}
                            sx={{ width: '100%' }}
                            size='small'
                            >
                            {unit.map((item) => (
                                <MenuItem key={item.id} value={item.unit}>
                                {item.unit}
                                </MenuItem>
                            ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={isSmallScreen ? 12 : 1} style={{ textAlign: 'center' }}>
                            X
                        </Grid>
                        <Grid item xs={isSmallScreen ? 6 : 3}>
                            <TextField
                            label="Size"
                            variant="outlined"
                            name="size2"
                            value={formData.size2 || ''}
                            onChange={(e) => handleSizeChange(e, 'size2')}
                            sx={{ width: '100%' }}
                            size='small'
                            autoComplete="off"
                            />
                        </Grid>
                        <Grid item xs={isSmallScreen ? 6 : 2.5}>
                            <TextField
                            label='Unit'
                            select
                            name="unit2"
                            value={formData.unit2 || ''}
                            onChange={(e) => handleUnitChange(e, 'unit2')}
                            sx={{ width: '100%' }}
                            size='small'
                            >
                            {unit.map((item) => (
                                <MenuItem key={item.id} value={item.unit}>
                                {item.unit}
                                </MenuItem>
                            ))}
                            </TextField>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={4} alignItems="center" justifyContent="flex-start" style={{ display: 'grid', placeItems: 'center', textAlign: 'left' }}>
                    <Typography variant="body1">
                        Status
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        select
                        label="Status"
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleFormChange}
                        sx={{ width: '100%' }}
                        size='small'
                    >
                        <MenuItem value="0">Active</MenuItem>
                        <MenuItem value="1">Inactive</MenuItem>
                    </TextField>
                </Grid>
            </Grid>
          </FormControl>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <Button variant="contained" size='small' color="primary" onClick={handleSaveRawProduct}>
              {selectedRawProductId ? 'Update' : 'Save'}
            </Button>
            <Button variant="contained" size='small' color="secondary" onClick={handleCancel} style={{ marginLeft: '10px' }}>
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
        aria-describedby="confirmation-dialog-for-deleting-raw-product"
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
            Are you sure you want to delete this raw product?
          </Typography>
          <Button variant="contained" color="primary" size='small' onClick={confirmDelete}>
            Yes
          </Button>
          <Button variant="contained" color="secondary" size='small' onClick={closeDeleteConfirmationModal} style={{ marginLeft: '10px' }}>
            Cancel
          </Button>
        </Box>
      </Modal>

      {/* Tabel untuk menampilkan raw products */}
      <div>
      <Box style={{ width: '100%' }}>
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
              ...rawProducts.initialState?.columns,
              id: { hide: true }, // Hide the id column
            },
          }}
          
        />
      </Box>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRawProducts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      </div>
    </Homepage>
  );
};

export default RawProduct;
