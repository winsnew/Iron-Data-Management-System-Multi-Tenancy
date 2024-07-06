import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import Modal from '@mui/material/Modal';
import { Button, IconButton, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination, Grid } from '@mui/material';
import axios from 'axios';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import SearchIcon from '@mui/icons-material/Search';
import Homepage from '../../Components/Homepage';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import { Inertia } from '@inertiajs/inertia'
import { InertiaLink } from '@inertiajs/inertia-react';
import { NumericFormat } from 'react-number-format';

const RawProductStockDetail = ({data}) => {
  // console.log(data);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    function explodeSizeString(sizeString) {
        if (sizeString === '') {
        return ''; // or some other default value
      }
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

    const formatCurrency = (value) => {
        return 'Rp ' + Number(value).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    };

    const formatThousand = (value) => {
        return '' + Number(value).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    };

    console.log(data);
  return (
    <Homepage>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>
              <Typography variant='h4'>
                Stock Detail
              </Typography>
            </div>

            <hr />

            <TableContainer component={Paper} style={{ marginTop: '10px', marginBottom: '10px' }}>
                <Grid container spacing={2} sx={{ padding: '10px' }}>
                    <Grid item xs={12} sm={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={5} sm={3} lg={2} alignItems="center" justifyContent="flex-start" style={{ display: 'grid', placeItems: 'center', textAlign: 'left' }}>
                                <Typography variant="body1">
                                    Code
                                </Typography>
                            </Grid>
                            <Grid item xs={7} sm={9} lg={10}>
                                <TextField
                                    label=""
                                    variant="outlined"
                                    name="code"
                                    value={data ? data[0].code : 'None'}
                                    sx={{ width: '100%' }}
                                    disabled
                                    size='small'
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={5} sm={3} lg={2} alignItems="center" justifyContent="flex-start" style={{ display: 'grid', placeItems: 'center', textAlign: 'left' }}>
                                <Typography variant="body1">
                                    Supplier
                                </Typography>
                            </Grid>
                            <Grid item xs={7} sm={9} lg={10}>
                                <TextField
                                    label=""
                                    variant="outlined"
                                    name="supplier"
                                    value={data ? data[0].name : 'None'}
                                    sx={{ width: '100%' }}
                                    disabled
                                    size='small'
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={5} sm={3} lg={2} alignItems="center" justifyContent="flex-start" style={{ display: 'grid', placeItems: 'center', textAlign: 'left' }}>
                                <Typography variant="body1">
                                    Material
                                </Typography>
                            </Grid>
                            <Grid item xs={7} sm={9} lg={10}>
                                <TextField
                                    label=""
                                    variant="outlined"
                                    name="material"
                                    value={data ? data[0].material : 'None'}
                                    sx={{ width: '100%' }}
                                    size='small'
                                    disabled
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={5} sm={3} lg={2} alignItems="center" justifyContent="flex-start" style={{ display: 'grid', placeItems: 'center', textAlign: 'left' }}>
                                <Typography variant="body1">
                                    Weight(kg)
                                </Typography>
                            </Grid>
                            <Grid item xs={7} sm={9} lg={10}>
                                <TextField
                                    label=""
                                    variant="outlined"
                                    name="weight"
                                    value={data ? formatThousand(data[0].weight) + ' kg' : 'None'}
                                    sx={{ width: '100%' }}
                                    disabled
                                    size='small'
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={5} sm={3} lg={2} alignItems="center" justifyContent="flex-start" style={{ display: 'grid', placeItems: 'center', textAlign: 'left' }}>
                                <Typography variant="body1">
                                    Size
                                </Typography>
                            </Grid>
                            <Grid item xs={7} sm={9} lg={10}>
                                <TextField
                                    label=""
                                    variant="outlined"
                                    name="size"
                                    value={data ? explodeSizeString(data[0].size) : 'None'}
                                    sx={{ width: '100%' }}
                                    size='small'
                                    disabled
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={5} sm={3} lg={2} alignItems="center" justifyContent="flex-start" style={{ display: 'grid', placeItems: 'center', textAlign: 'left' }}>
                                <Typography variant="body1">
                                    Price/kg
                                </Typography>
                            </Grid>
                            <Grid item xs={7} sm={9} lg={10}>
                                <TextField
                                    label=""
                                    variant="outlined"
                                    name="price"
                                    value={data ? formatCurrency(data[0].cogs) : 'None'}
                                    sx={{ width: '100%' }}
                                    disabled
                                    size='small'
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </TableContainer>

        {/* tabel untuk menampilkan item */}



        <div>
          <TableContainer component={Paper} style={{ marginTop: '50px' }}>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell><b>No</b></TableCell>
                  <TableCell><b>Transaction</b></TableCell>
                  <TableCell><b>Date</b></TableCell>
                  <TableCell><b>Reff</b></TableCell>
                  <TableCell><b>Qty In</b></TableCell>
                  <TableCell><b>Qty Out</b></TableCell>
                  <TableCell><b>Qty Remaining</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data ? (data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
                    const overallIndex = page * rowsPerPage + index + 1;
                    return (
                        <TableRow>
                            <TableCell>{overallIndex}</TableCell>
                            <TableCell>{item.tr_no}</TableCell>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>{item.code}</TableCell>
                            <TableCell>{item.qty_in}</TableCell>
                            <TableCell>{item.qty_out}</TableCell>
                            <TableCell>{item.qty_in - item.qty_out}</TableCell>
                        </TableRow>
                    );
                })) : (
                  <TableRow>
                    <TableCell colSpan={7} textAlign="center">No data available</TableCell>
                  </TableRow>
                )}
                {/* Add more static rows as needed */}
              </TableBody>
            </Table>
          </TableContainer>
          <hr />
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data ? parseInt(data.length) : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={() => {}}
            onRowsPerPageChange={() => {}}
          />
        </div>

        <div
            style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
             }}
        >
            <InertiaLink
                href='/rawproductstock'
            >
                <Button
                    color="error"
                    variant="contained"
                    size='small'
                >
                    Close
                </Button>
            </InertiaLink>
        </div>

    </Homepage>
  )
}

export default RawProductStockDetail;
