import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import './leftPanel.css'
import UserSvg from "./assets/user.svg";
import dashboardSvg from "./assets/dashboard.svg";
import orderSvg from "./assets/order.svg";
import categorySvg from "./assets/category.svg";
import productSvg from "./assets/product.svg";
import bulkOrderSvg from "./assets/bulkOrder.svg";
import customerSvg from "./assets/customer.svg";
import deliveryBoySvg from "./assets/deliveryBoy.svg";
import deliverySlotSvg from "./assets/deliverySlot.svg";

const LeftPanel = () => {
    return (
        <div id="LeftPanelContainer">
            <div className="row center" style={{ height: 80, border: 3, borderColor: 'black' }}>
                <img src={UserSvg} alt="user Image" id="profileImage" />
                <div className="center">
                    <div style={{ fontSize: 14 }}>Subodh Avasthi</div>
                    <div style={{ fontSize: 12 }}>Store Manager</div>
                </div>
            </div>
            <div id="MenuOption">
                <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
                    <li><NavLink exact activeClassName="active" className="NavText" to="/"><img src={dashboardSvg} className="NavLinkLogo" />Dashboard</NavLink></li>
                    <li><NavLink activeClassName="active" className="NavText" to="/orders"><img src={orderSvg} className="NavLinkLogo" />Orders</NavLink></li>
                    <li><NavLink activeClassName="active" className="NavText" to="/products"><img src={productSvg} className="NavLinkLogo" />Products</NavLink></li>
                    <li><NavLink activeClassName="active" className="NavText" to="/category"><img src={categorySvg} className="NavLinkLogo" />Category</NavLink></li>
                    <li><NavLink activeClassName="active" state={{ page: 1, snf: { sortField: "totalOrders", sortOrder: -1 } }} className="NavText" to="/customers"><img src={customerSvg} className="NavLinkLogo" />Customers</NavLink></li>
                    <li><NavLink activeClassName="active" className="NavText" to="/bulkorders"><img src={bulkOrderSvg} className="NavLinkLogo" />Bulk Orders</NavLink></li>
                    <li><NavLink activeClassName="active" className="NavText" to="/deliveryboy"><img src={deliveryBoySvg} className="NavLinkLogo" />Delivery Boy</NavLink></li>
                    <li><NavLink activeClassName="active" className="NavText" to="/deliveryslot"><img src={deliverySlotSvg} className="NavLinkLogo" />Delivery Slot/Charges</NavLink></li>
                </ul>
            </div>
        </div>
    );
}

export { LeftPanel }