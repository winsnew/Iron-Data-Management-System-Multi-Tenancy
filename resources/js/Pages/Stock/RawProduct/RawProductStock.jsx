import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Typography, Paper, TableContainer, MenuItem, TextField } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { InertiaLink, Head } from '@inertiajs/inertia-react';
import Homepage from '../../Components/Homepage';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';

const RawProductStock = ({ stock, warehouse }) => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  const handleChangePage = (params) => {
    setPage(params.page);
  };

  const handleChangeRowsPerPage = (params) => {
    setRowsPerPage(params.pageSize);
    setPage(0);
  };

  useEffect(() => {
    // Set the initial data when stock prop changes
    setFilteredItems(stock);
  }, [stock]);

  useEffect(() => {
    // Filter items based on the selected warehouse
    if (selectedWarehouse !== null) {
      const filteredStock = stock.filter(item => item.warehouseid === selectedWarehouse);
      setFilteredItems(filteredStock);
    } else {
      setFilteredItems(stock);
    }
  }, [selectedWarehouse, stock]);

  const handleWarehouseChange = (event) => {
    setSelectedWarehouse(event.target.value);
  };

  const columns = [
    { field: 'id', headerName: 'ID', hide: true },
    { field: 'no', headerName: 'No', width: 50 },
    { field: 'raw_code', headerName: 'Code', width: 150 },
    { field: 'material', headerName: 'Material', width: 200 },
    { field: 'size', headerName: 'Size', width: 120 },
    { field: 'name', headerName: 'Supplier', width: 200 },
    { field: 'weight', headerName: 'Weight (kg)', width: 120 },
    { field: 'cogs', headerName: 'Price/Kg', width: 120 },
    { field: 'qty', headerName: 'Qty', width: 100 },
    { field: 'updated_at', headerName: 'Update Date', width: 150 },
    {
      field: 'action',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <InertiaLink href={`/stock-raw-detail/${params.row.id}`}>
          <VisibilityIcon style={{ color: 'gray' }} />
        </InertiaLink>
      ),
    },
  ];

  const rows = filteredItems.map((item, index) => ({
    id: item.id,
    no: index + 1 + page * rowsPerPage,
    raw_code: item.raw_code,
    material: item.material,
    size: item.size.split('x').join(' x '), // Explode and join the size string
    name: item.name,
    weight: Number(item.weight).toLocaleString() + ' kg', // Format weight
    cogs: 'Rp ' + Number(item.cogs).toLocaleString(), // Format currency
    qty: item.qty,
    updated_at: item.updated_at,
  }));

  return (
    <Homepage>
      <Head title="Raw Product Stock" />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant='h4'>
          Raw Product Stock
        </Typography>
        <Button variant="contained" color="primary" size='small' href='/rawproductstockdetail'>
          Export
        </Button>
      </div>
      <hr />

      <TableContainer component={Paper} style={{ marginTop: '10px', overflowX: 'auto', padding: '10px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', marginBottom: '20px' }}>
          <Typography variant='h7' style={{ marginRight: '15px' }}>
            Warehouse
          </Typography>
          <TextField
            select
            label="Warehouse"
            id='warehouse-select'
            style={{ width: '337px' }}
            size="small"
            inputProps={{
              style: {
                position: 'absolute',
              },
            }}
            value={selectedWarehouse}
            onChange={handleWarehouseChange}
          >
            {warehouse && warehouse.map((item, index) => (
              <MenuItem key={index} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </TableContainer>

      <div>
        <Box style={{ width: '100%' }}>
          <DataGrid
            disableColumnSelector
            disableDensitySelector
            density="compact"
            size="small"
            rows={rows}
            columns={columns}
            components={{
              Toolbar: GridToolbar,
            }}
            pageSize={rowsPerPage}
            onPageChange={handleChangePage}
            onPageSizeChange={handleChangeRowsPerPage}
            pagination
            paginationMode="server"
            rowCount={filteredItems.length}
          />
        </Box>
      </div>
    </Homepage>
  );
};

export default RawProductStock;
