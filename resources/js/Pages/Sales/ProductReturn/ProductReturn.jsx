import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import Modal from '@mui/material/Modal';
import { Button, IconButton, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination } from '@mui/material';
import axios from 'axios';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import { Inertia } from '@inertiajs/inertia'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { InertiaLink, Head } from '@inertiajs/inertia-react';
import Homepage from '../../Components/Homepage';

function ProductReturn() {
  // Assuming you have some state variables like rowsPerPage, page, and filteredItems
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [filteredItems, setFilteredItems] = useState([]); // Make sure to initialize with the appropriate data

  // Assuming you have some functions like handleChangePage and handleChangeRowsPerPage
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Homepage>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant='h4'>
          Product Return
        </Typography>
        <Button variant="contained" color="primary" size='small' href='/rawproductstockdetail'>
          Export
        </Button>
      </div>
      <hr />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
        <Typography></Typography>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <TextField
            label="Search.."
            variant="outlined"
            style={{ width: '150px' }}
            size="small"
          />
        </div>
      </div>

      <div>
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table size="small">
            <TableHead style={{ height: '3em' }}>
              <TableRow>
                <TableCell><b>No.</b></TableCell>
                <TableCell><b>PR No.</b></TableCell>
                <TableCell><b>Date</b></TableCell>
                <TableCell><b>Costumer</b></TableCell>
                <TableCell><b>Address</b></TableCell>
                <TableCell><b>Phone</b></TableCell>
                <TableCell><b>Note</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Setting</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.length > 0 ? (
                filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
                  const overallIndex = page * rowsPerPage + index + 1;
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{overallIndex}</TableCell>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        {item.status == '0' ? 'Active' : item.status == '1' ? 'Inactive' : ''}
                      </TableCell>
                      <TableCell>
                        {/* Add your icons or buttons here if needed */}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={5}>No data available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredItems.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </Homepage>
  );
}

export default ProductReturn;
