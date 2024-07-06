import React, { useState, useEffect } from 'react';
import Homepage from '../../Components/Homepage';
import Modal from '@mui/material/Modal';
import { Button, IconButton, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination, Hidden, Grid, Snackbar, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import { InertiaLink } from '@inertiajs/inertia-react';

const ReturnOrderGoods = ({}) => {

    // color for button
    const buttonSaveColor = '#00a152';
    const buttonCancelColor = '#c62828';

    return (
        <Homepage>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <Typography
                    variant="h4"
                    component="div"
                    gutterBottom
                >
                    Return Order Goods Product
                </Typography>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                </div>
            </div>

            <hr />

            <TableContainer
                component={Paper}
                style={{
                    padding: '20px'
                 }}
            >
                <div
                    style={{
                        alignItems: 'center'
                     }}
                >
                    <Typography
                        variant='h7'
                        style={{
                            marginRight : '20px', 
                         }}
                    >
                        Note
                    </Typography>
                    <TextField
                        label=""
                        variant='outlined'
                        value=''
                        onChange={() => {}}
                        style={{
                            width: '40%',
                        }}
                        size='small'
                    />
                </div>
            </TableContainer>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '20px',
                }}
            >
                <Typography
                    variant='h4'
                >
                    Product
                </Typography>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '10px',
                     }}
                >
                    <Button
                        variant='contained'
                        onClick={() => {}}
                        size='small'
                    >
                        Add New
                    </Button>
                </div>
            </div>

            <hr />

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '10px',
                 }}
            >
                <Typography></Typography>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                     }}
                >
                    <Typography></Typography>
                    <TextField
                        label="Search..."
                        variant='outlined'
                        value={''}
                        onChange={() => {}}
                        style={{
                            width: '150px',
                        }}
                        size='small'
                    />
                </div>
            </div>

            <dv>
                <TableContainer
                    component={Paper}
                    style={{
                        marginTop: '20px'
                    }}
                >
                    <Table
                        size='small'
                        stickyHeader
                    >
                        <TableHead
                            style={{
                                backgroundColor: '#F5F5F5',
                                height: '3em'
                            }}
                        >
                            <TableRow>
                                <TableCell style={{ textAlign: 'center' }}><b>No.</b></TableCell>
                                <TableCell style={{ textAlign: 'center' }}><b>Reff Po</b></TableCell>
                                <TableCell style={{ textAlign: 'center' }}><b>Reff Rc</b></TableCell>
                                <TableCell style={{ textAlign: 'center' }}><b>Code</b></TableCell>
                                <TableCell style={{ textAlign: 'center' }}><b>Material</b></TableCell>
                                <TableCell style={{ textAlign: 'center' }}><b>Size</b></TableCell>
                                <TableCell style={{ textAlign: 'center' }}><b>Supplier</b></TableCell>
                                <TableCell style={{ textAlign: 'center' }}><b>Weight(kg)</b></TableCell>
                                <TableCell style={{ textAlign: 'center' }}><b>Price/kg</b></TableCell>
                                <TableCell style={{ textAlign: 'center' }}><b>Qty</b></TableCell>
                                <TableCell style={{ textAlign: 'center' }}><b>Amount</b></TableCell>
                                <TableCell style={{ textAlign: 'center' }}><b>Setting</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    style={{
                                        textAlign: 'center',
                                    }}
                                >
                                    Total
                                </TableCell>
                                <TableCell
                                    colSpan={3}
                                    style={{
                                        textAlign: 'center',
                                    }}
                                >
                                    Total Weight
                                </TableCell>
                                <TableCell
                                    colSpan={1}
                                    style={{
                                        textAlign: 'center',
                                     }}
                                >
                                    Total Amount
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </dv>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '20px',
                 }}
            >
                <InertiaLink
                    href='/return-order'
                >
                    <Button
                        variant='contained'
                        color='secondary'
                        size='small'
                        style={{
                            backgroundColor: buttonCancelColor || 'secondary', color: 'white'
                         }}
                        onClick={() => {}}
                    >
                        Cancel
                    </Button>
                </InertiaLink>
                <Button
                    variant='contained'
                    color='primary'
                    size='small'
                    style={{
                        marginLeft: '10px',
                        backgroundColor: buttonSaveColor || 'primary', color: 'white'
                     }}
                    onClick={() => {}}
                >
                    Save
                </Button>
            </div>
        </Homepage>
    );

};

export default ReturnOrderGoods;
