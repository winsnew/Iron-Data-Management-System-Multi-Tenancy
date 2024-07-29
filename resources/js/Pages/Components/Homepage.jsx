import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { ListItemButton, ListItemIcon, ListItemText, Collapse, ListItem } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import CustomToolbar from './Dashboard/CustomToolbar';
import OutputIcon from '@mui/icons-material/Output';
import InventoryTwoToneIcon from '@mui/icons-material/InventoryTwoTone';
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

export default function Homepage({ children }) {
  const drawerWidth = 240;
  const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      }),
      ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      }),
    }),
  );

  const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  });

  const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));

  const defaultTheme = createTheme({
    palette: {
      background: {
        default: "#fafafa"
      }
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
  });

  const [openDrawer, setOpenDrawer] = React.useState(true);
  const [isSubMasterOpen, setIsSubMasterOpen] = React.useState(false);
  const [isSubPurchaseOpen, setIsSubPurchaseOpen] = React.useState(false);
  const [isSubProductionOpen, setIsSubProductionOpen] = React.useState(false);
  const [isSubStockOpen, setIsSubStockOpen] = React.useState(false);
  const [isSubSalesOpen, setIsSubSalesOpen] = React.useState(false);
  const [isSubFinanceOpen, setIsSubFinanceOpen] = React.useState(false);
  const [isSubReportOpen, setIsSubReportOpen] = React.useState(false);
  const current = usePage().url;
  const { component } = usePage();

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const toggleSubMaster = () => {
    setIsSubMasterOpen(!isSubMasterOpen);
  };

  const toggleSubPurchase = () => {
    setIsSubPurchaseOpen(!isSubPurchaseOpen);
  }

  const toggleSubProduction = () => {
    setIsSubProductionOpen(!isSubProductionOpen);
  }

  const toggleSubStock = () => {
    setIsSubStockOpen(!isSubStockOpen);
  }

  const toggleSubSales = () => {
    setIsSubSalesOpen(!isSubSalesOpen);
  }

  const toggleSubFinance = () => {
    setIsSubFinanceOpen(!isSubFinanceOpen);
  }

  const toggleSubReport = () => {
    setIsSubReportOpen(!isSubReportOpen);
  }
  React.useEffect(() => {
    // Runs after the first render() lifecycle
    if (current == '/') {
      return;
    }
    if (component.startsWith('Master')) {
      setIsSubMasterOpen(!isSubMasterOpen);
    } else if (component.startsWith('Purchase')) {
      setIsSubPurchaseOpen(!isSubPurchaseOpen);
    } else if (component.startsWith('Production')) {
      setIsSubProductionOpen(!isSubProductionOpen);
    } else if (component.startsWith('Stock')) {
      setIsSubStockOpen(!isSubStockOpen);
    } else if (component.startsWith('Sales')) {
      setIsSubSalesOpen(!isSubSalesOpen);
    } else if (component.startsWith('Finance')) {
      setIsSubFinanceOpen(!isSubFinanceOpen);
    } else if (component.startsWith('Report')) {
      setIsSubReportOpen(!isSubReportOpen);
    }
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box component="nav" sx={{ display: 'flex' }}>
        <CssBaseline />
        <CustomToolbar drawerWidth={drawerWidth} toggleDrawer={toggleDrawer} openDrawer={openDrawer} />
        <Drawer
          variant="permanent"
          open={openDrawer}
        >
          <DrawerHeader />
          <Divider />
          <List component="nav">
            {/* Dashboard  */}
            <ListItem
              className={component.startsWith('Master/Dashboard') ?
                'Mui-selected' :
                ''}
              button
              component={InertiaLink}
              href="/"
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            {/* Data Master */}
            {/* <ListItemButton> */}
            <ListItemButton onClick={toggleSubMaster}>
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary="Data Master" />
              {isSubMasterOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
            {/* Submenu for Data Master */}
            <Collapse in={isSubMasterOpen} timeout="auto" unmountOnExit>
              <List
                component="div"
                disablePadding
                sx={{
                  backgroundColor: '#1111'
                }}
              >
                <ListItem
                  className={component.startsWith('Master/Material') ?
                    'Mui-selected' :
                    ''}
                  button
                  component={InertiaLink}
                  href="/materials"
                >
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Material" />
                </ListItem>

                <ListItem
                  className={component.startsWith('Master/UnitSize') ?
                    'Mui-selected' :
                    ''}
                  button
                  component={InertiaLink}
                  href="/unit-size"
                >
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Unit Size" />
                </ListItem>

                <ListItem
                  className={component.startsWith('Master/RawProduct') ?
                    'Mui-selected' :
                    ''}
                  button
                  component={InertiaLink}
                  href="/raw-product"
                >
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Raw Product" />
                </ListItem>

                <ListItem
                  className={component.startsWith('Master/GoodsProduct') ?
                    'Mui-selected' :
                    ''}
                  button
                  component={InertiaLink}
                  href="/goods-product"
                >
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Goods Product" />
                </ListItem>

                <ListItem
                  className={component.startsWith('Master/Supplier') ?
                    'Mui-selected' :
                    ''}
                  button
                  component={InertiaLink}
                  href="/supplier"
                >
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Supplier" />
                </ListItem>

                <ListItem
                  className={component.startsWith('Master/Customer') ?
                    'Mui-selected' :
                    ''}
                  button
                  component={InertiaLink}
                  href="/customers"
                >
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Customers" />
                </ListItem>

                <ListItem
                  className={component.startsWith('Master/Warehouse') ?
                    'Mui-selected' :
                    ''}
                  button
                  component={InertiaLink}
                  href="/warehouse"
                >
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Warehouse" />
                </ListItem>

                {/* <ListItem
                 button
                 component={InertiaLink}
                 href='/receive-order'
                >
                    <ListItemIcon>
                        <ArrowRightIcon />
                    </ListItemIcon>
                    <ListItemText primary="Receive Order" />
                </ListItem> */}
              </List>
            </Collapse>
            {/* BAGIAN PURCHASE */}
            {/* <ListItemButton> */}
            <ListItemButton onClick={toggleSubPurchase}>
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Purchase" />
              {isSubPurchaseOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
            {/* Submenu for Purchase */}
            <Collapse in={isSubPurchaseOpen} timeout="auto" unmountOnExit>
              <List
                component="div"
                disablePadding
                sx={{
                  backgroundColor: '#1111'
                }}
              >
                <ListItem
                  className={component.startsWith('Purchase/Order/Order') ?
                    'Mui-selected' :
                    ''}
                  button
                  component={InertiaLink}
                  href="/order"
                >
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Order" />
                </ListItem>
                <ListItem
                  className={component.startsWith('Purchase/ReceiveOrder/ReceiveOrder') ?
                    'Mui-selected' :
                    ''}
                  button
                  component={InertiaLink}
                  href="/receive-order"

                >
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Receive Order" />
                </ListItem>

                <ListItem
                  className={component.startsWith('Purchase/ReturnOrder/ReturnOrder') ?
                    'Mui-selected' :
                    ''}
                  button
                  component={InertiaLink}
                  href="/return-order"
                >
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Return Order" />
                </ListItem>

                <ListItem
                  className={component.startsWith('Purchase/Buy/Buy') ?
                    'Mui-selected' :
                    ''}
                  button
                  component={InertiaLink}
                  href="/buy"
                >
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Buy" />
                </ListItem>
              </List>
            </Collapse>
            <ListItemButton onClick={toggleSubStock}>
              <ListItemIcon>
                <InventoryTwoToneIcon />
              </ListItemIcon>
              <ListItemText primary="Stock" />
              {isSubStockOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
            {/* Submenu for Stock */}
            <Collapse in={isSubStockOpen} timeout="auto" unmountOnExit>
              <List
                component="div"
                disablePadding
                sx={{
                  backgroundColor: '#1111'
                }}
              >
                <ListItem
                  className={component.startsWith('Stock/RawProduct/RawProductStock') ?
                    'Mui-selected' :
                    ''}
                  button
                  component={InertiaLink}
                  href="/rawproductstock"
                >
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Raw Product" />
                </ListItem>

                <ListItem
                  className={component.startsWith('Stock/GoodsProduct/GoodsProduct') ?
                    'Mui-selected' :
                    ''}
                  button
                  component={InertiaLink}
                  href="/goods-product-stock"
                >
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Goods Product" />
                </ListItem>

                <ListItem
                  className={component.startsWith('Stock/Opname/Opname') ?
                    'Mui-selected' :
                    ''}
                  button
                  component={InertiaLink}
                  href="/opname"
                >
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Opname" />
                </ListItem>
              </List>
            </Collapse>
            <ListItemButton onClick={toggleSubProduction}>
              <ListItemIcon>
                <OutputIcon />
              </ListItemIcon>
              <ListItemText primary="Production" />
              {isSubProductionOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>


            {/* Submenu for Production */}
            <Collapse in={isSubProductionOpen} timeout="auto" unmountOnExit>
              <List
                component="div"
                disablePadding
                sx={{
                  backgroundColor: '#1111'
                }}
              >
                <ListItem
                  className={component.startsWith('Production/Input') ?
                    'Mui-selected' :
                    ''}
                  button
                  component={InertiaLink}
                  href="/input"
                >
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Input" />
                </ListItem>

                <ListItem
                  className={component.startsWith('Production/Result') ?
                    'Mui-selected' :
                    ''}
                  button
                  component={InertiaLink}
                  href="/result"
                >
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Result" />
                </ListItem>

              </List>
            </Collapse>
            {/* sales sidebar*/}
            {/* <ListItemButton onClick={toggleSubSales}>
              <ListItemIcon>
                <PointOfSaleRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Sales" />
              {isSubSalesOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton> */}

            {/* Submenu for Sales */}
            {/* <Collapse in={isSubSalesOpen} timeout="auto" unmountOnExit>
              <List
                component="div"
                disablePadding
                sx={{
                  backgroundColor: '#1111'
                }}
              >
                <ListItem
                  button
                  component={InertiaLink}
                  href="/product-sales"
                >
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Product Sales" />
                </ListItem>

                <ListItem
                  button
                  component={InertiaLink}
                  href="/product-return"
                >
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Product Return" />
                </ListItem>

              </List>
            </Collapse> */}

            {/* <ListItemButton onClick={toggleSubFinance}>
              <ListItemIcon>
                <AccountBalanceIcon />
              </ListItemIcon>
              <ListItemText primary="Finance" />
              {isSubFinanceOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton> */}


            {/* Submenu for Finance */}
            {/* <Collapse in={isSubFinanceOpen} timeout="auto" unmountOnExit>
              <List
                component="div"
                disablePadding
                sx={{
                  backgroundColor: '#1111'
                }}
              >
                <ListItem
                  button
                  component={InertiaLink}
                  href="#"
                >
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Cash" />
                </ListItem>

                <ListItem
                  button
                  component={InertiaLink}
                  href="#"
                >
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Account Payable" />
                </ListItem>

                <ListItem
                  button
                  component={InertiaLink}
                  href="#"
                >
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Account Receivable" />
                </ListItem>
              </List>
            </Collapse> */}
            {/* <ListItemButton onClick={toggleSubReport}>
              <ListItemIcon>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary="Report" />
              {isSubReportOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton> */}
          </List>
          {/* Submenu for Report */}
          <Collapse in={isSubReportOpen} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{
                backgroundColor: '#1111'
              }}
            >
              <ListItem
                button
                component={InertiaLink}
                href="#"
              >
                <ListItemIcon>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText primary="Purchase (Order)" />
              </ListItem>

              <ListItem
                button
                component={InertiaLink}
                href="#"
              >
                <ListItemIcon>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText primary="Purchase (Receive)" />
              </ListItem>

              <ListItem
                button
                component={InertiaLink}
                href="#"
              >
                <ListItemIcon>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText primary="Purchase (Return)" />
              </ListItem>

              <ListItem
                button
                component={InertiaLink}
                href="#"
              >
                <ListItemIcon>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText primary="Purchase (Result)" />
              </ListItem>

              <ListItem
                button
                component={InertiaLink}
                href="#"
              >
                <ListItemIcon>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText primary="Stock (Opname)" />
              </ListItem>

              <ListItem
                button
                component={InertiaLink}
                href="#"
              >
                <ListItemIcon>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText primary="Sales (Product)" />
              </ListItem>
              <ListItem
                button
                component={InertiaLink}
                href="#"
              >
                <ListItemIcon>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText primary="Sales (Return)" />
              </ListItem>
            </List>
          </Collapse>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[50]
                : theme.palette.grey[900],
            flexGrow: 1,
            overflow: 'auto',
            marginTop: '48px',
            padding: '25px'
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={5}>
              <Grid item xs={12}>
                {children}
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
