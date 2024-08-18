import React, { useState, useEffect } from "react";
import {
    Button,
    TextField,
    Grid,
    Paper,
    Typography,
    Box,
    Modal,
    Snackbar,
    FormControl,
    MenuItem,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { Inertia } from '@inertiajs/inertia'
// import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
// import Box from "@mui/material/Box";
import Homepage from "../Components/Homepage";

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const Input = ({ inputs }) => {
    const [filteredItems, setFilteredItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
        useState(false);
    const [formData, setFormData] = useState({
        production_no: "",
        date: "",
        material_weight: "",
        material_qty: "",
        status: "",
    });
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [itemToDeleteId, setItemToDeleteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const [rowsPerPage, setRowsPerPage] = useState(5);
    const theme = useTheme();
    // const url = window.location.href;
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        const filtered = inputs.filter((item) =>
            item.production_no.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredItems(filtered);
    }, [inputs, searchTerm]);

    const refreshPage = async () => {
        window.location.reload(); 
    };

    const handleAddItem = async () => {
        try {
            await axios.post("/inputs", formData);
            closeAddItemModal();
            await refreshPage();
            openSnackbar("success", "Item added successfully");
        } catch (error) {
            console.error("Error adding item:", error);
            openSnackbar(
                "error",
                error.response?.data?.error || "Error adding item"
            );
        }
    };

    const handleDeleteItem = (id) => {
        setItemToDeleteId(id);
        openDeleteConfirmationModal();
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`/inputs/${itemToDeleteId}`);
            closeDeleteConfirmationModal();
            await refreshPage();
            openSnackbar("success", "Item deleted successfully.");
        } catch (error) {
            console.error("Error deleting item:", error);
            openSnackbar("error", "Error deleting item.");
        }
    };

    const handleEditItem = (item) => {
        setSelectedItemId(item.id);
        setFormData({
            production_no: item.production_no,
            date: item.date,
            material_weight: item.material_weight,
            material_qty: item.material_qty,
            status: item.status,
        });
        openAddItemModal();
    };

    const handleUpdateItem = async () => {
        try {
            await axios.put(`/inputs/${selectedItemId}`, formData);
            closeAddItemModal();
            setSelectedItemId(null);
            await refreshPage();
            openSnackbar("success", "Item updated successfully");
        } catch (error) {
            console.error("Error updating item:", error);
            openSnackbar(
                "error",
                error.response?.data?.error || "Error updating item"
            );
        }
    };

    const handleSaveItem = () => {
        if (selectedItemId) {
            handleUpdateItem();
        } else {
            handleAddItem();
        }
    };

    const handleCancel = () => {
        closeAddItemModal();
    };

    const openAddItemModal = () => {
        setIsModalOpen(true);
    };

    const closeAddItemModal = () => {
        setIsModalOpen(false);
        setFormData({
            production_no: "",
            date: "",
            material_weight: "",
            material_qty: "",
            status: "",
        });
        setSelectedItemId(null);
    };

    const openDeleteConfirmationModal = () => {
        setIsDeleteConfirmationOpen(true);
    };

    const closeDeleteConfirmationModal = () => {
        setIsDeleteConfirmationOpen(false);
        setItemToDeleteId(null);
    };

    const openSnackbar = (severity, message) => {
        setSnackbarSeverity(severity);
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const closeSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const columns = [
        { field: "no", headerName: "No", width: 50 },
        { field: "production_no", headerName: "Production No", width: 150 },
        { field: "date", headerName: "Date", width: 150 },
        { field: "material_weight", headerName: "Material Weight", width: 150 },
        { field: "material_qty", headerName: "Material Qty", width: 150 },
        {
            field: "status",
            headerName: "Status",
            width: 150,
            renderCell: (params) => (
                <span>{params.row.status === "0" ? "Active" : "Inactive"}</span>
            ),
        },
        {
            field: "setting",
            headerName: "Setting",
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

    const rows = filteredItems.map((item, index) => ({
        id: item.id,
        no: index + 1,
        production_no: item.production_no,
        date: item.date,
        material_weight: item.material_weight,
        material_qty: item.material_qty,
        status: item.status,
    }));

    return (
        <Homepage>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={closeSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                style={{ marginBottom: "30px", marginRight: "30px" }}
            >
                <Alert severity={snackbarSeverity} onClose={closeSnackbar}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                }}
            >
                <Typography variant="h4">Production</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={openAddItemModal}
                >
                    Add New
                </Button>
            </div>
            <hr style={{ color: "white" }} />
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "15px",
                }}
            >
                <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ marginBottom: "15px" }}
                />
            </div>
            <Paper style={{ height: 400, width: "100%" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={rowsPerPage} // <-- Pastikan ini menggunakan rowsPerPage
                    rowsPerPageOptions={[5, 10, 25]}
                    pagination
                    onPageSizeChange={(newPageSize) =>
                        setRowsPerPage(newPageSize)
                    }
                    paginationMode="server"
                    onPageChange={(newPage) => setPage(newPage)}
                    components={{ Toolbar: GridToolbar }}
                />
            </Paper>
            <Modal open={isModalOpen} onClose={closeAddItemModal}>
                <Box
                    sx={{
                        width: isSmallScreen ? "100%" : 600,
                        padding: 4,
                        margin: "auto",
                        bgcolor: "background.paper",
                        borderRadius: 1,
                    }}
                >
                    <Typography variant="h6" component="h2" gutterBottom>
                        {selectedItemId
                            ? "Edit Production"
                            : "Add New Production"}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Production No"
                                name="production_no"
                                value={formData.production_no}
                                onChange={handleFormChange}
                                variant="outlined"
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Date"
                                name="date"
                                value={formData.date}
                                onChange={handleFormChange}
                                variant="outlined"
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Material Weight"
                                name="material_weight"
                                value={formData.material_weight}
                                onChange={handleFormChange}
                                variant="outlined"
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Material Qty"
                                name="material_qty"
                                value={formData.material_qty}
                                onChange={handleFormChange}
                                variant="outlined"
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    select
                                    label="Status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleFormChange}
                                >
                                    <MenuItem value="0">Active</MenuItem>
                                    <MenuItem value="1">Inactive</MenuItem>
                                </TextField>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: 2,
                        }}
                    >
                        <Button
                            onClick={handleCancel}
                            variant="outlined"
                            color="secondary"
                            style={{ marginRight: 10 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveItem}
                            variant="contained"
                            color="primary"
                        >
                            {selectedItemId ? "Update" : "Save"}
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Modal
                open={isDeleteConfirmationOpen}
                onClose={closeDeleteConfirmationModal}
            >
                <Box
                    sx={{
                        width: 400,
                        padding: 4,
                        margin: "auto",
                        bgcolor: "background.paper",
                        borderRadius: 1,
                    }}
                >
                    <Typography variant="h6" component="h2" gutterBottom>
                        Confirm Deletion
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Are you sure you want to delete this item?
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: 2,
                        }}
                    >
                        <Button
                            onClick={closeDeleteConfirmationModal}
                            variant="outlined"
                            color="secondary"
                            style={{ marginRight: 10 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmDelete}
                            variant="contained"
                            color="primary"
                        >
                            Delete
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Homepage>
    );
};

export default Input;
