import React, { useState, useEffect } from 'react';
import Homepage from '../../Components/Homepage';
import Modal from '@mui/material/Modal';
import { Button, IconButton, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination, Hidden, Grid, Snackbar, Box, useTheme, MenuItem, Select, InputLabel, useMediaQuery, Checkbox, createTheme, ThemeProvider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import { InertiaLink } from '@inertiajs/inertia-react';

const GoodsProduct = ({warehouses}) => {

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [formData, setFormData] = useState({
        warehouse_id: '',
        note: ''
    });

    const handleWarehouseChange = (event) => {
        const idWarehouse = event.target.value;
        setFormData((prevFromData) => ({
            ...prevFromData,
            warehouse_id: idWarehouse
        }));
    };

    const handleNoteChange = (event) => {
        const noteValue = event.target.value;
        setFormData((prevFormData) => ({
            ...prevFormData,
            note: noteValue
        }));
    };

    const openAddItemModal = () => {
        setIsModalAddOpen(true);
    }

    const closeAddItemModal = () => {
        setIsModalAddOpen(false);
    }

    return (
        <Homepage>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                }}
            >
                <Typography
                    variant='h4'
                    component='div'
                    gutterBottom
                >
                    Stock Opname Goods Product
                </Typography>
            </div>

            <hr style={{ color: 'white' }} />

            <div
                style={{
                    display: 'flex',
                    justifyContent: isSmallScreen ? 'center' : 'space-between',
                    flexGrow: 1,
                    padding: '10px',
                }}
            >
                <TableContainer
                    component={Paper}
                    style={{
                        marginTop: '20px',
                        overflowX: 'auto',
                        padding: '10px',
                        width: isSmallScreen ? 'auto' : '100%'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: isSmallScreen ? 'column' : 'row',
                            justifyContent: isSmallScreen ? 'center' : 'space-between',
                         }}
                    >
                        <div
                            style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: isSmallScreen ? 'column' : 'row',
                                    justifyContent: 'space-between',
                            }}
                        >
                            <Typography
                                variant='h7'
                                style={{
                                    marginRight: '20px'
                                }}
                            >
                                Warehouse
                            </Typography>
                            <InputLabel id='warehouse-label'></InputLabel>
                            <Select
                                labelId='warehouse-label'
                                id='warehouse-select'
                                size='small'
                                value={formData.warehouse_id}
                                onChange={handleWarehouseChange}
                                style={{
                                    width: isSmallScreen ? '100%' : '350px',
                                }}
                            >
                                {warehouses.length > 0 ? (
                                    warehouses.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>
                                            <em>{item.name}</em>
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem>
                                        <em>None</em>
                                    </MenuItem>
                                )}
                            </Select>
                        </div>
                        <div
                            style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: isSmallScreen ? 'column' : 'row',
                                    justifyContent: 'space-between',
                                    marginLeft: isSmallScreen ? '0px' : '75px',
                                    marginTop: isSmallScreen ? '20px' : '0px'
                            }}
                        >
                            <Typography
                                variant='h7'
                                style={{
                                    marginRight: '20px'
                                }}
                            >
                                Note
                            </Typography>
                            <TextField
                                label='Note'
                                variant='outlined'
                                name='note'
                                value={formData.note}
                                onChange={handleNoteChange}
                                style={{
                                    width: isSmallScreen ? '100%' : '350px'
                                 }}
                                size='small'
                            />
                        </div>
                    </div>
                </TableContainer>
            </div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '20px'
                 }}
            >
                <Typography
                    variant='h4'
                >
                    Product
                </Typography>
                <div>
                    <Button
                        variant='contained'
                        color='primary'
                        style={{
                            // backgroundColor: 'primary'
                        }}
                        onClick={openAddItemModal}
                        size='small'
                    >
                        Add New
                    </Button>
                </div>
            </div>

            <div
                style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: isSmallScreen ? 'column' : 'row',
                        marginTop: '10px'
                }}
            >
                <Typography></Typography>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                     }}
                >
                    <TextField
                        label="Search..."
                        variant='outlined'
                        value={''}
                        onChange={() => {}}
                        style={{
                            width: '150px'
                        }}
                        size='small'
                    />
                </div>
            </div>

            <Modal
                open={isModalAddOpen}
                onClose={closeAddItemModal}
                aria-labelledby='add-item-goods-product-opname-modal'
                aria-describedby='form-for-modal-modal-adding-item'
            >
                <Box
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: theme.palette.background.paper,
                        width: '80%',
                        boxShadow: 24,
                        borderRadius: 20,
                        padding: 10
                     }}
                >
                    <Typography
                        variant='h6'
                        component='div'
                        gutterBottom
                    >
                        Add Product
                    </Typography>

                    <hr />

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignContent: 'center',
                            flexDirection: 'row'
                        }}
                    >
                        <Typography></Typography>
                        <TextField
                            label='Search..'
                            variant='outlined'
                            value={''}
                            onChange={() => {}}
                            style={{
                                width: '150px'
                            }}
                            size='small'
                        />
                    </div>

                    <TableContainer
                        component={Paper}
                        style={{
                            marginTop: '10px',
                            overflowX: 'auto'
                        }}
                    >
                        <Table
                            size='small'
                        >
                            <TableHead
                                style={{
                                    height: '3em'
                                }}
                            >
                                <TableRow>
                                    <TableCell>
                                        <Checkbox
                                            indeterminate={false}
                                            checked={true}
                                            value=''
                                            onChange={() => {}}
                                            style={{
                                                // marginRight: '-40px'
                                            }}
                                            inputProps={{
                                                'aria-label': 'Checkbox A'
                                             }}
                                        />
                                    </TableCell>
                                    <TableCell><b>Qty</b></TableCell>
                                    <TableCell><b>Code</b></TableCell>
                                    <TableCell><b>Product Name</b></TableCell>
                                    <TableCell><b>Material</b></TableCell>
                                    <TableCell><b>Grade</b></TableCell>
                                    <TableCell><b>Size</b></TableCell>
                                    <TableCell><b>Type</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody></TableBody>
                        </Table>
                    </TableContainer>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginTop: '20px'
                         }}
                    >
                        <Button
                            variant='contained'
                            color='error'
                            onClick={closeAddItemModal}
                            style={{

                            }}
                            size='small'
                        >
                            Close
                        </Button>
                        <Button
                            variant='contained'
                            color='success'
                            onClick={() => {}}
                            style={{
                                marginLeft: '10px'
                             }}
                             size='small'
                        >
                            Save
                        </Button>
                    </div>
                </Box>
            </Modal>

            <div>
                <TableContainer
                    component={Paper}
                    style={{
                        marginTop: '20px',
                        overflowX: 'auto'
                    }}
                >
                    <Table
                        size='small'
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell><b>No.</b></TableCell>
                                <TableCell><b>Code</b></TableCell>
                                <TableCell><b>Product Name</b></TableCell>
                                <TableCell><b>Material</b></TableCell>
                                <TableCell><b>Quality</b></TableCell>
                                <TableCell><b>Dimention</b></TableCell>
                                <TableCell><b>Type</b></TableCell>
                                <TableCell><b>Qty</b></TableCell>
                                <TableCell><b>Setting</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell
                                    colSpan={11}
                                    style={{ textAlign: 'center' }}
                                >
                                    No Data Available
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    marginTop: '20px'
                }}
            >
                <InertiaLink
                    href='/opname'
                >
                    <Button
                        variant='contained'
                        color='error'
                        style={{
                            // backgroundColor: '#FF6868',
                            marginRight: '10px'
                         }}
                         size='small'
                    >
                        Close
                    </Button>
                </InertiaLink>
                <Button
                    variant='contained'
                    color='success'
                    style={{
                        // backgroundColor: '#99BC85'
                     }}
                     size='small'
                >
                    Save
                </Button>
            </div>
        </Homepage>
    );

};

export default GoodsProduct;
