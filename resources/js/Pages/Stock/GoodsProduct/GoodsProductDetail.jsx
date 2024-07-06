import React, { useState, useEffect } from 'react';
import Homepage from '../../Components/Homepage';
import Modal from '@mui/material/Modal';
import { Button, IconButton, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination, Hidden, Grid, Snackbar, Box, useTheme, MenuItem, Select, InputLabel, useMediaQuery } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import { InertiaLink } from '@inertiajs/inertia-react';

const GoodsProductDetail = ({}) => {

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
                    variant="h4"
                    component="div"
                    gutterBottom
                >
                    Stock Detail
                </Typography>
            </div>

            <hr />

            <TableContainer
                component={Paper}
                style={{
                    marginTop: '20px'
                 }}
            >
                {/* <Table
                    size='small'
                >
                    <TableHead></TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>

                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table> */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                             }}
                        >
                            <Typography
                                variant='body-lg'
                            >
                                Code
                            </Typography>
                            <TextField
                                label='Code'
                                variant='outlined'
                                name='code'
                                value={''}
                                onChange={() => {}}
                                sx={{
                                    width: '300px'
                                }}
                                size='small'
                                disabled
                            />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                             }}
                        >
                            <Typography
                                variant='body-lg'
                            >
                                Product Name
                            </Typography>
                            <TextField
                                label='Product Name'
                                variant='outlined'
                                name='product_name'
                                value={''}
                                onChange={() => {}}
                                sx={{
                                    width: '300px'
                                }}
                                size='small'
                                disabled
                            />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                             }}
                        >
                            <Typography
                                variant='body-lg'
                            >
                                Material
                            </Typography>
                            <TextField
                                label='Material'
                                variant='outlined'
                                name='material'
                                value={''}
                                onChange={() => {}}
                                sx={{
                                    width: '300px'
                                }}
                                size='small'
                                disabled
                            />
                        </div>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                             }}
                        >
                            <Typography
                                variant='body-lg'
                            >
                                Quality
                            </Typography>
                            <TextField
                                label='Quality'
                                variant='outlined'
                                name='quality'
                                value={''}
                                onChange={() => {}}
                                sx={{
                                    width: '300px'
                                }}
                                size='small'
                                disabled
                            />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                             }}
                        >
                            <Typography
                                variant='body-lg'
                            >
                                Size
                            </Typography>
                            <TextField
                                label='Size'
                                variant='outlined'
                                name='size'
                                value={''}
                                onChange={() => {}}
                                sx={{
                                    width: '300px'
                                }}
                                size='small'
                                disabled
                            />
                        </div>
                    </div>
                </div>
            </TableContainer>

            <div>
                <TextField
                    label="Search..."
                    variant='outlined'
                    value={''}
                    onChange={() => {}}
                    style={{
                        width: '350px'
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
                                <TableCell><b>Transaction</b></TableCell>
                                <TableCell><b>Date</b></TableCell>
                                <TableCell><b>Reff</b></TableCell>
                                <TableCell><b>Qty In</b></TableCell>
                                <TableCell><b>Qty Out</b></TableCell>
                                <TableCell><b>Qty Remaining</b></TableCell>
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
                    alignItems: 'center'
                 }}
            >
                <InertiaLink
                    href=''
                >
                    <Button
                        variant='contained'
                        color='danger'
                        size='small'
                    >
                        Close
                    </Button>
                </InertiaLink>
            </div>
        </Homepage>
    );

};

export default GoodsProductDetail;
