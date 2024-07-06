import React, { useState, useEffect } from 'react';
import Homepage from '../../Components/Homepage';
import Modal from '@mui/material/Modal';
import { Button, IconButton, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination, Hidden, Grid, Snackbar, Box, useTheme, MenuItem, Select, InputLabel, useMediaQuery, Checkbox, createTheme, ThemeProvider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import { InertiaLink } from '@inertiajs/inertia-react';

const ProductSales = ({})  => {

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
                    variant='h4'
                    component='div'
                    gutterBottom
                >
                    Product Sales
                </Typography>
                <div>
                    <InertiaLink
                        href='/product-sales-detail'
                    >
                        <Button
                            variant='contained'
                            color='primary'
                            size='small'
                        >
                            Add New
                        </Button>
                    </InertiaLink>
                </div>
            </div>

            <hr />

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    marginTop: '20px'
                }}
            >
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
                                <TableCell><b>SP No.</b></TableCell>
                                <TableCell><b>Date</b></TableCell>
                                <TableCell><b>Customer</b></TableCell>
                                <TableCell><b>Address</b></TableCell>
                                <TableCell><b>Note</b></TableCell>
                                <TableCell><b>Total Price</b></TableCell>
                                <TableCell><b>Status</b></TableCell>
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
        </Homepage>
    );

};

export default ProductSales;
