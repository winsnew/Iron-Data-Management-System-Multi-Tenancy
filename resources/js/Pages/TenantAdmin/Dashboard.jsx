import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Component/Navbar";
import Sidebar from "./Component/Sidebar";
import {useMode } from "./Style/theme";
import { ThemeProvider, CssBaseline } from "@mui/material";


function Dashboard({children}) {
    return (      
                <div className="app">
                    hello
                </div>
    );
}

export default Dashboard;
