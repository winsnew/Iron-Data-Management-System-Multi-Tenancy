import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import Dashboard from "./Dashboard";

import React, { useState } from "react";
import Navbar from "./Component/Navbar";
import Sidebar from "./Component/Sidebar";
import { ColorModeContext, useMode } from "./Style/theme";
import { ThemeProvider, CssBaseline } from "@mui/material";


function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Gingerbread", 356, 16.0, 49, 3.9),
];

function TenantTable() {
    return (
        <Dashboard>

        </Dashboard>
    );
}

export default TenantTable;
