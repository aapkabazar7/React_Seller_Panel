import React, { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import logo from "../../assets/logo.jpg";
import UserSvg from "../../assets/avatar.svg";
import dashboardSvg from "../../assets/dashboard.svg";
import orderSvg from "../../assets/order.svg";
import categorySvg from "../../assets/category.svg";
import productSvg from "../../assets/product.svg";
import bulkOrderSvg from "../../assets/bulkOrder.svg";
import customerSvg from "../../assets/customer.svg";
import deliveryBoySvg from "../../assets/deliveryBoy.svg";
import deliverySlotSvg from "../../assets/deliverySlot.svg";
import deliveryCharge from "../../assets/deliveryCharge.svg";
import addNewProduct from "../../assets/addNewProduct.svg";
import Orders from "../../screens/Orders/Orders";
import Products from "../../screens/Products/Products";
import Customers from "../../screens/Customers/Customers";
import { Route, Router, Routes, useLocation, useNavigate } from "react-router-dom";
import BulkOrders from "../../screens/BulkOrders/BulkOrders";
import DeliverySlot from "../../screens/DeliverySlot/DeliverySlot";
import DeliveryBoy from "../../screens/DeliveryBoy/DeliveryBoy";
import CustomerDetails from "../../screens/CustomerDetails/CustomerDetails";
import Category from "../../screens/Category/Category";
import OrderDetails from "../../screens/OrderDetails/OrderDetails";
import Dashboard from "../../screens/Dashboard/Dashboard";
import DeliveryCharge from "../../screens/DeliveryCharges/DeliveryCharge";
import NewProduct from "../../screens/NewProduct/NewProduct";
import NewDeliveryCharge from "../../screens/New_Delivery_Charge/NewDeliveryCharge";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// Get today's date
const today = new Date();
const todayDay = today.getDate().toString().padStart(2, "0");
const todayMonth = (today.getMonth() + 1).toString().padStart(2, "0");
const todayYear = today.getFullYear().toString();
const formattedToday = `${todayYear}-${todayMonth}-${todayDay}`;

// Get yesterday's date
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayDay = yesterday.getDate().toString().padStart(2, "0");
const yesterdayMonth = (yesterday.getMonth() + 1).toString().padStart(2, "0");
const yesterdayYear = yesterday.getFullYear().toString();
const formattedYesterday = `${yesterdayYear}-${yesterdayMonth}-${yesterdayDay}`;
const menuItems = [
  { title: "Dashboard", icon: dashboardSvg, route: "/" },
  { title: "Orders", icon: orderSvg, route: "/orders" },
  { title: "Products", icon: productSvg, route: "/products" },
  { title: "New Product", icon: addNewProduct, route: "/newProduct" },
  { title: "Category", icon: categorySvg, route: "/category" },
  { title: "Customers", icon: customerSvg, route: "/customers" },
  { title: "Bulk Orders", icon: bulkOrderSvg, route: "/bulkorders" },
  { title: "Delivery Boy", icon: deliveryBoySvg, route: "/deliveryboy" },
  { title: "Delivery Slots", icon: deliverySlotSvg, route: "/deliveryslot" },
  { title: "Delivery Charges", icon: deliveryCharge, route: "/deliverycharges" },
];

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer() {
  const location = useLocation();
  const [selectedContent, setSelectedContent] = useState(location.pathname);
  console.log(location.pathname);
  const navigate = useNavigate();
  const renderContent = () => {
    return (
      <Routes>
        <Route path="/customerdetails" element={<CustomerDetails />} />
        <Route path="/deliverycharges" element={<NewDeliveryCharge />} />
        <Route path="/deliveryslot" element={<DeliverySlot />} />
        <Route path="/orderdetails" element={<OrderDetails />} />
        <Route path="/deliveryboy" element={<DeliveryBoy />} />
        <Route path="/newProduct" element={<NewProduct />} />
        <Route path="/bulkorders" element={<BulkOrders />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/products" element={<Products />} />
        <Route path="/category" element={<Category />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    );
  };
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* <CssBaseline /> */}
      <AppBar elevation={0} position="fixed" open={open}>
        <Toolbar style={{ backgroundColor: "white" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              color: "#696969",
              boxShadow: "none",
              ...(open && { display: "none" }),
            }}>
            <MenuIcon />
          </IconButton>
          <img style={{ height: 40, width: 40, borderRadius: "50%" }} src={logo} id="logo" alt="AkbLogo" />
          <div style={{ width: 20 }} />
          <Typography color={"black"} variant="h6" noWrap component="div">
            Seller Panel <strong>AKB</strong>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer style={{ borderRight: "none" }} variant="permanent" open={open}>
        <DrawerHeader sx={{ backgroundColor: "white", display: "flex", borderRight: "none", justifyContent: "center", alignItems: "center", gap: 2 }}>
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <img style={{ height: 40, width: 40, borderRadius: "50%" }} src={UserSvg} alt="user" id="profileImage" />
          </div>
          <div>
            <div style={{ fontSize: 14 }}>Subodh Avasthi</div>
            <div style={{ fontSize: 12 }}>Store Manager</div>
          </div>
          <IconButton onClick={handleDrawerClose}>{theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}</IconButton>
        </DrawerHeader>
        <List style={{ borderRight: "none" }}>
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              disablePadding
              sx={{
                display: "block",
                paddingBottom: 1,
              }}>
              <ListItemButton
                onClick={() => {
                  setSelectedContent(item.route);
                  navigate(item.route, { state: { page: 1, snf: { sortField: "totalOrders", sortOrder: -1 } } });
                }}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,

                  backgroundColor: item.route === selectedContent ? "#ccc" : "transparent",
                  "&:hover": {
                    backgroundColor: item.route !== selectedContent ? "rgba(0,0,0,0.2)    " : "#ccc",
                  },
                }}>
                <img
                  alt="hello"
                  style={{
                    width: "24px",
                    height: "24px",
                  }}
                  src={item.icon}
                />
                <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0, paddingLeft: 1 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 1000,
        }}>
        <DrawerHeader />
        {renderContent()}
      </Box>
    </Box>
  );
}
