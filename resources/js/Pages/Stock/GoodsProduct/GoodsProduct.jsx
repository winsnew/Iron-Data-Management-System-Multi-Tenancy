import React, { useState, useEffect } from 'react';
import Homepage from '../../Components/Homepage';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import { Button, Typography, Paper, MenuItem, Select } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { InertiaLink } from '@inertiajs/inertia-react';

const GoodsProduct = ({ warehouses }) => {

    const [formData, setFormData] = useState({
        warehouse_id: ''
    });

    const handleWarehouseChange = (event) => {
        const idWarehouse = event.target.value;
        setFormData((prevFromData) => ({
            ...prevFromData,
            warehouse_id: idWarehouse
        }));
    };

    const columns = [
        {
            field: 'no',
            headerName: 'No',
            width: 50,
            sortable: false,
            renderCell: (params) => (
                <strong>{params.rowIndex + 1}</strong>
            ),
        },
        {
            field: 'code',
            headerName: 'Code',
            width: 150,
        },
        {
            field: 'productName',
            headerName: 'Product Name',
            width: 200,
        },
        {
            field: 'material',
            headerName: 'Material',
            width: 150,
        },
        {
            field: 'quality',
            headerName: 'Quality',
            width: 100,
        },
        {
            field: 'size',
            headerName: 'Size',
            width: 100,
        },
        {
            field: 'cogs',
            headerName: 'COGS',
            width: 100,
        },
        {
            field: 'salePrice',
            headerName: 'Sale Price',
            width: 120,
        },
        {
            field: 'qty',
            headerName: 'Qty',
            width: 100,
        },
        {
            field: 'updateDate',
            headerName: 'Update Date',
            width: 150,
        },
        {
            field: 'setting',
            headerName: 'Setting',
            width: 150,
            renderCell: (params) => (
                <>
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        onClick={() => handleEditItem(params.row)}
                    />
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={() => handleDeleteItem(params.row.id)}
                    />
                </>
            ),
        },
    ];

    // Dummy rows, you should replace this with your actual data
    const rows = [];

    return (
        <Homepage>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                <Typography variant="h4" gutterBottom>
                    Goods Product Stock
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <InertiaLink href=''>
                        <Button variant="contained" size='small' style={{ marginRight: '20px' }}>
                            Import
                        </Button>
                    </InertiaLink>
                    <InertiaLink href=''>
                        <Button variant="contained" size='small'>
                            Export
                        </Button>
                    </InertiaLink>
                </div>
            </div>

            <hr style={{ color: 'white' }} />

            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                <Paper style={{ marginTop: '20px', padding: '10px', width: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Typography variant='h7' style={{ marginRight: '20px' }}>
                            Warehouse
                        </Typography>
                        <Select
                            labelId='warehouse-label'
                            id='warehouse-select'
                            size='small'
                            value={formData.warehouse_id}
                            onChange={handleWarehouseChange}
                            style={{ width: '350px' }}
                        >
                            {warehouses.length > 0 ? (
                                warehouses.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.name}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>
                                    None
                                </MenuItem>
                            )}
                        </Select>
                    </div>
                </Paper>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginTop: '10px' }}>
                <Typography></Typography>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Placeholder for search field */}
                </div>
            </div>

            <div>
                <div style={{ marginTop: '20px', overflowX: 'auto' }}>
                    <DataGrid
                        disableColumnSelector
                        disableDensitySelector
                        density="compact"
                        size="small"
                        rows={rows}
                        columns={columns}
                        slots={{ toolbar: GridToolbar }}
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                            },
                        }}
                        pagination
                        pageSize={5}
                        pageSizeOptions={[5, 10, 25]}
                    />
                </div>
            </div>
        </Homepage>
    );

};

export default GoodsProduct;
