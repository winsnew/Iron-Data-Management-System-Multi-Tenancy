import React, { useState, useEffect } from 'react';
import Homepage from '../../Components/Homepage';
import Modal from '@mui/material/Modal';
import { Button, IconButton, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination, Hidden, Grid, Snackbar, Box, useTheme, MenuItem, Select, InputLabel, useMediaQuery, Checkbox, createTheme, ThemeProvider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import { InertiaLink } from '@inertiajs/inertia-react';

const RawProduct = ({}) => {
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);

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
                    Stock Opname Raw Product
                </Typography>
            </div>

            <hr style={{ color: 'white' }} />

            <div>
                <TableContainer
                    component={Paper}
                    style={{
                        marginTop: '20px',
                        overflowX: 'auto'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignContent: 'center',
                            padding: '10px'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignContent: 'center',
                                flexDirection: 'row'
                            }}
                        >
                            <Typography
                                variant='h7'
                                style={{
                                    marginRight: '20px',
                                    marginTop: '10px',
                                }}
                            >
                                Warehouse
                            </Typography>
                            <InputLabel id='warehouse-label'></InputLabel>
                            <Select
                                labelId='warehouse-label'
                                id='warehouse-select'
                                size='small'
                                value={''}
                                onChange={() => {}}
                                style={{
                                    width: '350px',
                                }}
                            >
                                <MenuItem>
                                    <em>None</em>
                                </MenuItem>
                            </Select>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignContent: 'center',
                                flexDirection: 'row'
                            }}
                        >
                            <Typography
                                variant='h7'
                                style={{
                                    marginRight: '20px',
                                    marginTop: '10px',
                                }}
                            >
                                Note
                            </Typography>
                            <TextField
                                label="Note"
                                variant='outlined'
                                name='note'
                                value={''}
                                onChange={() => {}}
                                sx={{
                                    width: '350px',
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
                <Button
                    onClick={() => setIsModalAddOpen(true)}
                    variant='contained'
                    color='primary'
                    style={{
                        // backgroundColor: 'primary'
                     }}
                     size='small'
                >
                    Add New
                </Button>
            </div>

            <Modal
                open={isModalAddOpen}
                onClose={closeAddItemModal}
                aria-labelledby='modal-modal-add-item'
                aria-describedby='modal-modal-adding-item'
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        width: '80%',
                        boxShadow: 24,
                        p: 4,
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
                            marginTop: '20px',
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
                                    <TableCell><b>Material</b></TableCell>
                                    <TableCell><b>Size</b></TableCell>
                                    <TableCell><b>Supplier</b></TableCell>
                                    <TableCell><b>Weight</b></TableCell>
                                    <TableCell><b>Price/Kg</b></TableCell>
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
                            color='secondary'
                            onClick={closeAddItemModal}
                            style={{
                                
                            }}
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
                            <TableRow></TableRow>
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
                        style={{
                            backgroundColor: '#fd0100',
                            marginRight: '10px'
                         }}
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
                >
                    Save
                </Button>
            </div>
        </Homepage>
    );

};

export default RawProduct;
