import React, { useState, useEffect } from 'react';
import Homepage from '../../Components/Homepage';
import { Button, IconButton, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination, Hidden, Grid, Snackbar, Box, useTheme, MenuItem, Select, InputLabel, useMediaQuery, Checkbox, createTheme, ThemeProvider, TableFooter, Modal } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import { InertiaLink } from '@inertiajs/inertia-react';
import { Translate } from '@mui/icons-material';

const ProductSalesDetail = ({}) => {

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
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
                    New Sales
                </Typography>
            </div>

            <hr />

            <div
                style={{
                    display: 'flex',
                    flexGrow: 1,
                    alignItems: 'center',
                    marginTop: '20px'
                 }}
            >
                <TableContainer
                    component={Paper}
                    style={{
                        overflowX: 'auto',
                        width: isSmallScreen ? 'auto' : '100%',
                        padding: isSmallScreen ? '5px' : '10px',
                        flexGrow: 1
                     }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: isSmallScreen ? 'center' : 'space-between',
                            alignItems: 'center',
                            marginBottom: isSmallScreen ? '5px' : '20px',
                            flexGrow: 1,
                            flexDirection: isSmallScreen ? 'column' : 'row'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection: isSmallScreen ? 'column' : 'row',
                            }}
                        >
                            <Typography
                                variant='h7'
                                component='div'
                                gutterBottom
                                style={{
                                    marginRight: isSmallScreen ? '0px' : '20px'
                                }}
                            >
                                Customer
                            </Typography>
                            <InputLabel id='customer-label'></InputLabel>
                            <Select
                                labelId='customer-label'
                                id='customer-select'
                                size='small'
                                value={''}
                                onChange={() => {}}
                                style={{
                                    width: isSmallScreen ? '200px' : '350px'
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
                                alignItems: 'center',
                                flexDirection: isSmallScreen ? 'column' : 'row'
                            }}
                        >
                            <Typography
                                variant='h7'
                                component='div'
                                gutterBottom
                                style={{
                                    marginRight: isSmallScreen ? '0px' : '20px'
                                }}
                            >
                                Adm Cost
                            </Typography>
                            <TextField
                                label=''
                                variant='outlined'
                                name='adm_cost'
                                value={''}
                                onChange={() => {}}
                                size='small'
                                style={{
                                    width: isSmallScreen ? '200px' : '350px'
                                }}
                            />
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: isSmallScreen ? 'center' : 'space-between',
                            alignItems: 'center',
                            marginBottom: isSmallScreen ? '5px' : '20px',
                            flexGrow: 1,
                            flexDirection: isSmallScreen ? 'column' : 'row'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection: 'column',
                                justifyContent: 'center'
                             }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: isSmallScreen ? 'column' : 'row',
                                }}
                            >
                                <Typography
                                    variant='h7'
                                    component='div'
                                    gutterBottom
                                    style={{
                                        marginRight: isSmallScreen ? '0px' : '30px'
                                    }}
                                >
                                    Address
                                </Typography>
                                <TextField
                                label=''
                                variant='outlined'
                                name='address'
                                value={''}
                                onChange={() => {}}
                                size='small'
                                style={{
                                    width: isSmallScreen ? '200px' : '350px'
                                }}
                                disabled
                            />
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: isSmallScreen ? 'column' : 'row',
                                    marginTop: isSmallScreen ? '0px' : '10px',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography
                                    variant='h7'
                                    component='div'
                                    gutterBottom
                                    style={{
                                        marginRight: isSmallScreen ? '0px' : '42px'
                                    }}
                                >
                                    Phone
                                </Typography>
                                <TextField
                                label=''
                                variant='outlined'
                                name='phone'
                                value={''}
                                onChange={() => {}}
                                size='small'
                                style={{
                                     width: isSmallScreen ? '200px' : '350px'
                                }}
                                disabled
                            />
                            </div>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection: isSmallScreen ? 'column' : 'row',
                                justifyContent: 'center',
                            }}
                        >
                            <Typography
                                variant='h7'
                                component='div'
                                gutterBottom
                                style={{
                                    marginRight: isSmallScreen ? '0px' : '20px'
                                }}
                            >
                                Note
                            </Typography>
                            <TextField
                                label=''
                                variant='outlined'
                                name='note'
                                value={''}
                                onChange={() => {}}
                                size='small'
                                style={{
                                    width: isSmallScreen ? '200px' : '350px'
                                }}
                                multiline
                                rows={isSmallScreen ? 2 : 3}
                            />
                        </div>
                    </div>
                </TableContainer>
            </div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '20px'
                 }}
            >
                <Typography
                    variant='h4'
                    component='div'
                    gutterBottom
                >
                    Product
                </Typography>
                <div>
                    <Button
                        variant='contained'
                        color='primary'
                        size='small'
                        onClick={openAddItemModal}
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
                aria-labelledby="modal-modal-add-item"
                aria-describedby="modal-modal-adding-item"
            >
                <Box
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: theme.palette.background.paper,
                        width: isSmallScreen ? '90%' : '50%',
                        boxShadow: 24,
                        borderRadius: 20,
                        padding: 10
                     }}
                >
                    <Typography
                        variant='h6'
                        component={'div'}
                        gutterBottom
                    >
                        New Product
                    </Typography>

                    <hr />

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '10px'
                         }}
                    >
                        <Typography
                            variant='h7'
                            component={'div'}
                            gutterBottom
                        >
                            Warehouse
                        </Typography>
                        <div
                            style={{
                                width: '60%',
                            }}
                        >
                            <InputLabel id='warehouse-label'></InputLabel>
                            <Select
                                labelId='warehouse-label'
                                id='warehouse-select'
                                size='small'
                                value={''}
                                onChange={() => {}}
                                style={{
                                    width: '100%',
                                }}
                            >
                                <MenuItem>
                                    <em>
                                        None
                                    </em>
                                </MenuItem>
                            </Select>
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '10px'
                         }}
                    >
                        <Typography
                            variant='h7'
                            component={'div'}
                            gutterBottom
                        >
                            Product Name
                        </Typography>
                        <div
                            style={{
                                width: '60%',
                            }}
                        >
                            <InputLabel id='productName-label'></InputLabel>
                            <Select
                                labelId='productName-label'
                                id='productName-select'
                                size='small'
                                value={''}
                                onChange={() => {}}
                                style={{
                                    width: '100%',
                                }}
                            >
                                <MenuItem>
                                    <em>
                                        None
                                    </em>
                                </MenuItem>
                            </Select>
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '10px'
                         }}
                    >
                        <Typography
                            variant='h7'
                            component={'div'}
                            gutterBottom
                        >
                            Category
                        </Typography>
                        <TextField
                            label=''
                            variant='outlined'
                            value={''}
                            onChange={() => {}}
                            style={{
                                width: '60%'
                            }}
                            size='small'
                            disabled
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '10px'
                         }}
                    >
                        <Typography
                            variant='h7'
                            component={'div'}
                            gutterBottom
                        >
                            Quality
                        </Typography>
                        <TextField
                            label=''
                            variant='outlined'
                            value={''}
                            onChange={() => {}}
                            style={{
                                width: '60%'
                            }}
                            size='small'
                            disabled
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '10px'
                         }}
                    >
                        <Typography
                            variant='h7'
                            component={'div'}
                            gutterBottom
                        >
                            Dimension
                        </Typography>
                        <TextField
                            label=''
                            variant='outlined'
                            value={''}
                            onChange={() => {}}
                            style={{
                                width: '60%'
                            }}
                            size='small'
                            disabled
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '10px'
                         }}
                    >
                        <Typography
                            variant='h7'
                            component={'div'}
                            gutterBottom
                        >
                            Price
                        </Typography>
                        <TextField
                            label=''
                            variant='outlined'
                            value={''}
                            onChange={() => {}}
                            style={{
                                width: '60%'
                            }}
                            size='small'
                            disabled
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '10px'
                         }}
                    >
                        <Typography
                            variant='h7'
                            component={'div'}
                            gutterBottom
                        >
                            Weight (kg)
                        </Typography>
                        <TextField
                            label=''
                            variant='outlined'
                            value={''}
                            onChange={() => {}}
                            style={{
                                width: '60%'
                            }}
                            size='small'
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '10px'
                         }}
                    >
                        <Typography
                            variant='h7'
                            component={'div'}
                            gutterBottom
                        >
                            Qty
                        </Typography>
                        <TextField
                            label=''
                            variant='outlined'
                            value={''}
                            onChange={() => {}}
                            style={{
                                width: '60%'
                            }}
                            size='small'
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: isSmallScreen ? 'center' : 'space-between',
                            width: '100%'
                         }}
                    >
                        {isSmallScreen ? null : <div></div>}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: isSmallScreen ? 'row' : 'column',
                                marginTop: '10px',
                                width: isSmallScreen ? '100%' : '30%',
                                size: 'small'
                            }}
                        >
                            <div
                                style={{
                                    size: 'small',
                                    display: 'flex',
                                    justifyContent: isSmallScreen ? 'flex-start' : 'flex-end',
                                    marginRight: isSmallScreen ? '12%' : '0px'
                                 }}
                            >
                                <Button
                                    variant='contained'
                                    color='success'
                                    size='small'
                                >
                                    Save
                                </Button>
                            </div>
                            <div
                                style={{
                                    marginTop: '10px',
                                    size: 'small',
                                    display: 'flex',
                                    justifyContent: isSmallScreen ? 'center' : 'flex-end',
                                    marginRight: isSmallScreen ? '12%' : '0px'
                                }}
                            >
                                <Button
                                    variant='contained'
                                    color='success'
                                    size='small'
                                >
                                    Save & Add Other
                                </Button>
                            </div>
                            <div
                                style={{
                                    marginTop: '10px',
                                    size: 'small',
                                    display: 'flex',
                                    justifyContent: 'flex-end'
                                }}
                            >
                                <Button
                                    variant='contained'
                                    color='error'
                                    size='small'
                                    onClick={closeAddItemModal}
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>

                </Box>
            </Modal>

            <div
                style={{
                    marginTop: '20px'
                 }}
            >
                <TableContainer
                    component={Paper}
                    style={{
                        overflowX: 'auto',
                        width: '100%',
                     }}
                >
                    <Table
                        size='small'
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell><b>No.</b></TableCell>
                                <TableCell><b>Warehouse</b></TableCell>
                                <TableCell><b>Code</b></TableCell>
                                <TableCell><b>Item Name</b></TableCell>
                                <TableCell><b>Category</b></TableCell>
                                <TableCell><b>Quality</b></TableCell>
                                <TableCell><b>Dimention</b></TableCell>
                                <TableCell><b>Price</b></TableCell>
                                <TableCell><b>Kg</b></TableCell>
                                <TableCell><b>Qty</b></TableCell>
                                <TableCell><b>Amount</b></TableCell>
                                <TableCell><b>Setting</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell
                                    colSpan={12}
                                    style={{ textAlign: 'center' }}
                                >
                                    No Data Available
                                </TableCell>
                            </TableRow>
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell
                                    colSpan={10}
                                    style={{
                                        textAlign: 'right',
                                        fontWeight: 'bold',
                                        fontSize: '30px',
                                        paddingRight: '10px',
                                        color: '#000000'
                                    }}
                                >
                                    <b>Total Amount</b>
                                </TableCell>
                                <TableCell
                                    colSpan={2}
                                    style={{
                                        textAlign: 'left',
                                        fontWeight: 'bold',
                                        fontSize: '30px',
                                        color: '#000000'
                                     }}
                                >
                                    <b>10.000.000</b>
                                </TableCell>
                            </TableRow>
                        </TableFooter>
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
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <InertiaLink
                        href='/product-sales'
                    >
                        <Button
                            variant='contained'
                            color='error'
                            size='small'
                            style={{
                                marginRight: '10px',
                             }}
                        >
                            Close
                        </Button>
                    </InertiaLink>
                    <Button
                        variant='contained'
                        color='primary'
                        size='small'
                        onClick={() => {}}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </Homepage>
    );

};

export default ProductSalesDetail;
