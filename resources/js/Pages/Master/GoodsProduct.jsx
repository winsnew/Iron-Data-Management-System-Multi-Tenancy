import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import Modal from '@mui/material/Modal';
import { DataGrid, GridToolbar, GridActionsCellItem, GridCell } from '@mui/x-data-grid';
import {
  Button,
  IconButton,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  TablePagination,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
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
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { InertiaLink, Head } from '@inertiajs/inertia-react';


const GoodsProduct = ({goodsproduct, materials, unit}) => {
  const [goodsProducts, setGoodsProducts] = useState([]);
  const [filteredGoodsProducts, setFilteredGoodsProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    material_id: '',
    quality: '',
    size: '',
    status: '',
    size1: '',
    size2: '',
    size3: '',
    unit1: '',
    unit2: '',
    unit3: '',
  });
  const [selectedGoodsProductId, setSelectedGoodsProductId] = useState(null);
  const [goodsProductToDeleteId, setGoodsProductToDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [materialOptions, setMaterialOptions] = useState([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [materialName, setMaterialName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  // appear size for edit
  const [size1, setSize1] = useState('');
  const [size2, setSize2] = useState('');
  const [size3, setSize3] = useState('');
  const [prevSize1, setPrevSize1] = useState('');
  const [prevSize2, setPrevSize2] = useState('');
  const [prevSize3, setPrevSize3] = useState('');
  const [sizes, setSizes] = useState({
    size1: '',
    size2: '',
    size3: '',
  });

  const [unit1, setUnit1] = useState('');
  const [unit2, setUnit2] = useState('');
  const [unit3, setUnit3] = useState('');
  const [prevUnit1, setPrevUnit1] = useState('');
  const [prevUnit2, setPrevUnit2] = useState('');
  const [prevUnit3, setPrevUnit3] = useState('');
  const [unites, setUnites] = useState({
    unit1: '',
    unit2: '',
    unit3: '',
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const url = window.location.href;
  //notif
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // or 'error' for example
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const openSnackbar = (severity, message) => {
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

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

  useEffect(() => {
      const filtered = goodsproduct.filter(
      (goodsProduct) =>
        goodsProduct.size &&
        goodsProduct.size.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredGoodsProducts(filtered);
  }, [goodsproduct, searchTerm]);

  // Add an additional useEffect to update the code when the form data changes
  // useEffect(() => {
  //       updateCode();
  // }, [formData, sizes]);

  const refreshPage = async () => {
    try {
      const response = await Inertia.visit(url, { method: 'get', data: {}, replace: false, preserveState: true, preserveScroll: false });
      setGoodsProducts(response);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

    useEffect(() => {
    // fetchGoodsProducts().finally(() => setIsLoading(false));
        fetchMaterialOptions();
    }, []);


  const fetchMaterialOptions = async () => {
    try {
      // const response = await axios.get('/materials');
      setMaterialOptions(materials);
    } catch (error) {
      console.error('Error fetching material options:', error);
    }
  };

  const handleAddGoodsProduct = async () => {
    try {
      await axios.post('/goods-product', formData);
      closeAddGoodsProductModal();
      setFormData({
        code: '',
        name: '',
        material_id: '',
        quality: '',
        size: '',
        status: '',
      });
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

  const handleDeleteGoodsProduct = (id) => {
    setGoodsProductToDeleteId(id);
    openDeleteConfirmationModal();
  };

  const confirmDeleteGoodsProduct = () => {
    try {
      axios.delete(`/goods-product/${goodsProductToDeleteId}`).then(() => {
        closeDeleteConfirmationModal();
      });
    //   refreshPage();
      Inertia.reload();
      openSnackbar('success', 'Goods product deleted successfully');
    } catch (error) {
      console.error('Error deleting goods product:', error);
      openSnackbar('error', 'Failed to delete goods product');
    }
  };

  const handleEditGoodsProduct = (goodsProduct) => {
    setSelectedGoodsProductId(goodsProduct.value.id);
    const [size1, unit1, size2, unit2, size3, unit3] = explodeSizeString2(goodsProduct.value.size);

    setFormData({
      code: goodsProduct.value.code,
      name: goodsProduct.value.name,
      material_id: goodsProduct.value.material_id,
      quality: goodsProduct.value.quality,
      size1: size1 || '', // Assign the values from explodeSizeString
      size2: size2 || '',
      size3: size3 || '',
      unit1: unit1 || '',
      unit2: unit2 || '',
      unit3: unit3 || '',
      status: goodsProduct.value.status,
    });
    openAddGoodsProductModal();
    updateCode();
  };

  const handleUpdateGoodsProduct = async () => {
    try {
      const goodsProductID = selectedGoodsProductId || 'new';
      const updatedSize = `${formData.size1 || ''} x ${formData.size2 || ''} x ${formData.size3 || ''} mm`;
      await axios.put(`/goods-product/${selectedGoodsProductId}`, {
        ...formData,
        size: updatedSize,
      });
      closeAddGoodsProductModal();
      setFormData({
        code: '',
        name: '',
        material_id: '',
        quality: '',
        size: '',
        status: '',
        size1: '',
        size2: '',
        size3: '',
        unit1: '',
        unit2: '',
        unit3: '',
      });
      setSelectedGoodsProductId(null);
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

  const handleSaveGoodsProduct = () => {
    if (selectedGoodsProductId) {
      handleUpdateGoodsProduct();
    //   refreshPage();
     Inertia.reload();
    } else {
      handleAddGoodsProduct();
    }
  };

  const handleCancel = () => {
    closeAddGoodsProductModal();
  };

  const openAddGoodsProductModal = () => {
    setIsModalOpen(true);
  };

  const closeAddGoodsProductModal = () => {
    setIsModalOpen(false);
    setFormData({
      code: '',
      name: '',
      material_id: '',
      quality: '',
      size: '',
      status: '',
      size1: '',
      size2: '',
      size3: '',
      unit1: '',
      unit2: '',
      unit3: '',
    });
    setSize1('');
    setSize2('');
    setSize3('');
    setSizes({
      size1: '',
      size2: '',
      size3: '',
    });
    setSelectedGoodsProductId(null);
  };


  const openDeleteConfirmationModal = () => {
    setIsDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmationModal = () => {
    setIsDeleteConfirmationOpen(false);
    setGoodsProductToDeleteId(null);
  };

  const getStatusLabel = (value) => {
    // Define the mapping of integer values to string labels
    const statusMap = {
      0: 'Active',
      1: 'Inactive',
      // Add more mappings as needed
    };

    // Use the mapping to get the corresponding label
    return statusMap[value] || '';
  };

  const getQualityLabel = (value) => {

    // Define the mapping of varchar values to string labels
    const statusMap = {
        'A': 'Grade A',
        'B': 'Grade B',
        'C': 'Broken',
    };

    // use the mapping to get the corresponding label
    return statusMap[value] || '';

  };

  const handleFormChange = (e, field) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (name === 'name' || name === 'material_id' || name === 'quality' || name === 'status') {
      updateCode();
    } else if (name.startsWith('size')) {
      handleSizeChange(name, value);
      updateCode();
    } else if (field === 'size1' || field === 'size2' || field === 'size3') {
      handleSizeChange(field, value);
      updateCode();
    }
  };

  const handleSizeChange = (fieldName, fieldValue) => {
    const trimmedValue = fieldValue.trim();

    if (/^\d*$/.test(trimmedValue) || trimmedValue === '') {
      setSizes((prevSizes) => ({
        ...prevSizes,
        [fieldName]: trimmedValue,
      }));
      updateCode();
    }
  };

  const updateCode = () => {
    const newCode = generateCode();
    setFormData((prevFormData) => ({
      ...prevFormData,
      code: newCode,
    }));
  };

  const generateCode = () => {
    const materialCode = materialOptions.find((material) => material.id === formData.material_id)?.code || '';
    const xSeparator = (sizes.size1 !== '' && sizes.size2 !== '') ? 'X' : '';
    const xSeparator2 = (sizes.size2 !== '' && sizes.size3 !== '') ? 'x' : '';

    return `${formData.name || ''}${materialCode}${formData.quality}${sizes.size1 || ''}${xSeparator}${sizes.size2 || ''}${xSeparator2}${sizes.size3 || ''}`;
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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

  // Join the explodedNumbers array with 'x'
  const glue = [' ', ' x '];
  const resultString = explodedNumbers.reduce((a, b, i) => [a, b].join(glue[(i - 1) % glue.length]));

  return resultString;
}

//grid item style
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
    field: 'name',
    headerName: 'Name',
    editable: false,
    width: 375,
  },
  {
    field: 'materials',
    headerName: 'Materials',
    editable: false,
    width: 375,
    renderCell: (goodsproduct) => (
      <span>
        {goodsproduct.material_id
          ? materialOptions.find((material) => material.id === goodsproduct.material_id)?.name || 'Material Telah Dihapus'
          : 'Material Telah Dihapus'}
      </span>
    ),
  },
  {
    field: 'quality',
    headerName: 'Quality',
    editable: false,
    width: 375,
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
    renderCell: (params) => {
      <span>{params.row.status == '0' ? 'Active' : params.row.status == '1' ? 'inactive' : ''}</span>
    }  
  },
  {
    field: 'action',
    headerName: 'Actions',
    editable: false,
    width: 375,
    renderCell: (goodsproduct) => {
      return (
        <>
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => handleEditGoodsProduct(goodsproduct)}
          />
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteGoodsProduct(goodsproduct.id)}
          />
        </>
      );
    }
  },
];


const rows = goodsproduct.map((goodsProduct, index) => ({
  id: goodsProduct.id,
  no: index + 1,
  code: goodsProduct.code,
  name: goodsProduct.name,
  material_id: goodsProduct.material_id,
  quality: goodsProduct.quality,
  size: goodsProduct.size,
  status: goodsProduct.status == '0' ? 'Active' : goodsProduct.status == '1' ? 'inactive' : '' ,
  action: goodsProduct,
}));



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

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Homepage>
    <Head title="Data Master - Goods Product" />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
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
        <Typography variant="h4">Goods Products</Typography>
        <Button variant="contained" color="primary" size='small' onClick={openAddGoodsProductModal}>
          Add new
        </Button>
      </div>
      <hr style={{color: 'white'}} />
      {/* Add search functionality */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
        <Typography></Typography>
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

      {/* Add goods products table */}
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
              ...goodsproduct.initialState?.columns,
              id: { hide: true }, // Hide the id column
            },
          }}
          
        />
      </Box>
    
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredGoodsProducts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Modal for adding or editing goods product */}
      <Modal
        open={isModalOpen}
        onClose={handleCancel}
        aria-labelledby="add-goods-product-modal"
        aria-describedby="form-for-adding-or-editing-goods-product"
      >
        <Box
          sx={{
            position: 'absolute',
            bgcolor: 'background.paper',
            border: '2px solid #fff',
            boxShadow: 24,
            p: 4,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isSmallScreen ? '90%' : '70%',
            borderRadius: 5
          }}
        >
          <Typography variant="h6">{selectedGoodsProductId ? 'Edit' : 'Add'} Goods Product</Typography>
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
                        size='small'
                        display
                        autoComplete="off"
                    />
                </Grid>
            </Grid>
          </FormControl>
          {/*<FormControl fullWidth sx={{ mb: 2 }}>
             <Grid container spacing={2}>
                <Grid item xs={4} alignItems="center" justifyContent="flex-start" style={{ display: 'grid', placeItems: 'center', textAlign: 'left' }}>
                    <Typography variant="body1">
                        Address
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        label="Address"
                        variant="outlined"
                        name="address"
                        value={formData.address}
                        onChange={handleFormChange}
                        sx={{ width: '100%' }}
                        size='small'
                        autoComplete="off"
                    />
                </Grid>
            </Grid>
          </FormControl>*/}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={4} alignItems="center" justifyContent="flex-start" style={{ display: 'grid', placeItems: 'center', textAlign: 'left' }}>
                    <Typography variant="body1">
                        Name
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        label="Name"
                        variant="outlined"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        sx={{ width: '100%' }}
                        size='small'
                        autoComplete="off"
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
                        select
                        label="Material"
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
                        Quality
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        select
                        label="Quality"
                        id="quality"
                        name="quality"
                        value={formData.quality}
                        onChange={handleFormChange}
                        sx={{ width: '100%' }}
                        size='small'
                        autoComplete="off"
                    >
                        <MenuItem value="A">A</MenuItem>
                        <MenuItem value="B">B</MenuItem>
                        <MenuItem value="C">C</MenuItem>
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
                <FormControl fullWidth sx={{ mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                <Grid item xs={isSmallScreen ? 6 : 1.7}>
                    <TextField
                    label="Size"
                    variant="outlined"
                    name="size1"
                    value={formData.size1 || ''}
                    onChange={(e) => handleFormChange(e, 'size1')}
                    sx={{ width: '100%' }}
                    size='small'
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={isSmallScreen ? 6 : 1.7}>
                    <TextField
                    label="Unit"
                    select
                    name='unit1'
                    value={formData.unit1 || ''}
                    onChange={(e) => handleUnitChange(e, 'unit1')}
                    sx={{ width: '100%' }}
                    size='small'
                    autoComplete="off"
                    >
                    {unit.map((item) => (
                        <MenuItem key={item.id} value={item.unit}>
                        {item.unit}
                        </MenuItem>
                    ))}
                    </TextField>
                </Grid>
                <Grid item xs={isSmallScreen ? 12 : 0.9 } style={{ textAlign: 'center' }}>
                    X
                </Grid>
                <Grid item xs={isSmallScreen ? 6 : 1.7}>
                    <TextField
                    size='small'
                    label="Size"
                    variant="outlined"
                    name="size2"
                    value={formData.size2 || ''}
                    onChange={(e) => handleFormChange(e, 'size2')}
                    sx={{ width: '100%' }}
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={isSmallScreen ? 6 : 1.7}>
                    <TextField
                    select
                    label="Unit"
                    name='unit2'
                    value={formData.unit2 || ''}
                    onChange={(e) => handleUnitChange(e, 'unit2')}
                    sx={{ width: '100%' }}
                    size='small'
                    autoComplete="off"
                    >
                    {unit.map((item) => (
                        <MenuItem key={item.id} value={item.unit}>
                        {item.unit}
                        </MenuItem>
                    ))}
                    </TextField>
                </Grid>
                <Grid item xs={isSmallScreen ? 12 : 0.9} style={{ textAlign: 'center' }}>
                    X
                </Grid>
                <Grid item xs={isSmallScreen ? 6 : 1.7}>
                    <TextField
                    label="Size"
                    variant="outlined"
                    name="size3"
                    value={formData.size3 || ''}
                    onChange={(e) => handleFormChange(e, 'size3')}
                    sx={{ width: '100%' }}
                    size='small'
                    autoComplete="off"
                    />
                </Grid>
                <Grid item xs={isSmallScreen ? 6 : 1.7}>
                    <TextField
                    select
                    label="Unit"
                    name='unit3'
                    value={formData.unit3 || ''}
                    onChange={(e) => handleUnitChange(e, 'unit3')}
                    sx={{ width: '100%' }}
                    size='small'
                    autoComplete="off"
                    >
                    {unit.map((item) => (
                        <MenuItem key={item.id} value={item.unit}>
                        {item.unit}
                        </MenuItem>
                    ))}
                    </TextField>
                </Grid>
                </Grid>
            </FormControl>
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
                        label='status'
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleFormChange}
                        sx={{ width: '100%' }}
                        select
                        size='small'
                        autoComplete="off"
                    >
                        <MenuItem value="0">Active</MenuItem>
                        <MenuItem value="1">Inactive</MenuItem>
                    </TextField>
                </Grid>
            </Grid>
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" color="primary" size='small' onClick={handleSaveGoodsProduct} sx={{ mr: 1 }}>
              {selectedGoodsProductId ? 'Update' : 'Save'}
            </Button>
            <Button variant="contained" color="secondary" size='small' onClick={handleCancel} sx={{ mr: 1 }}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal confirmation for deleting goods product */}
      <Modal
        open={isDeleteConfirmationOpen}
        onClose={closeDeleteConfirmationModal}
        aria-labelledby="delete-confirmation-modal"
        aria-describedby="confirmation-dialog-for-deleting-goods-product"
      >
        <Box
          sx={{
            position: 'absolute',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: 5
          }}
        >
          <Typography variant="h6">Confirm Deletion</Typography>
          <Typography>Are you sure you want to delete this goods product?</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button color="primary" size='small' onClick={closeDeleteConfirmationModal} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" color="secondary" size='small' onClick={confirmDeleteGoodsProduct}>
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </Homepage>
  );
};
export default GoodsProduct;
