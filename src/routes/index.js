import React from "react";
import { Navigate } from "react-router-dom";

// Authentication related pages

import Login from "../pages/Admin/Authentication/Login";
import Register from "../pages/Customer/Authentication/Register";
import Dashboard from "../pages/Admin/Dashboard/index";

// Products
import Products from "../pages/Admin/Products/ProductLists";
import AddProduct from "../pages/Admin/Products/AddProducts";
import UpdateProduct from "../pages/Admin/Products/update-product";

// Warranty
import AllWarrantyList from "../pages/Admin/Warranty/AllWarrantyList";
import AddWarranty from "../pages/Admin/Warranty/AddWarranty";
import AddWarrantyUser from "../pages/Customer/Warranty/AddWarranty";

// Roles
import RolesLists from "../pages/Admin/Roles/RoleLists"
import AddRoles from "../pages/Admin/Roles/AddRoles";

// Users
import Users from "../pages/Admin/Users/Other";
import Customer from "../pages/Admin/Users/Customer";

// Customer
import CustomerProductList from "../pages/Customer/Warranty/CustomerProductList";
import CustLogin from "../pages/Customer/Authentication/CustLogin";
import ResetPassword from "../pages/Admin/Authentication/ForgetPassword";
import AddProductExternalLink from "../pages/ExternalLink/AddProductExternalLink";
import EditRole from "../pages/Admin/Roles/EditRole";
import EmailVerification from "../pages/Admin/Authentication/EmailVerification";
import ComplaintList from "../pages/Admin/Complaints/ComplaintList";

const authProtectedRoutes = [
		// For Admin
		{ path: "/auth/dashboard", component: <Dashboard /> },

		// Products
		{ path: "/products/all-products", component : <Products /> },
		{ path: "/products/add-products", component : <AddProduct /> },
		{ path: "/products/update-product/:product_id", component : <UpdateProduct /> },

		// Warranty
		{ path: "/warranty/all-warranties-list", component : <AllWarrantyList /> },
		{ path: "/warranty/add-warranty", component : <AddWarranty /> },
		{ path: "/warranty/add-product-warranty", component : <AddWarrantyUser /> },

		// Roles
		{path : "/roles/all-roles" , component : <RolesLists /> },
		{path : "/roles/add-roles" , component : <AddRoles /> },
		{path : "/roles/update-role/:role_id" , component : <EditRole /> },

		// Complaints
		{path : "/complaints/all-complaints" , component : <ComplaintList /> },

		// Users
		{path : "/users/all-users" , component : <Users /> },
		{path : "/users/all-customers" , component : <Customer /> },




	//Customer side
	{ path: "/products/all-warranties", component : <CustomerProductList /> },
];

const publicRoutes = [
	
	{ path: "/auth/login", component: <Login /> },
	{ path: "/auth/email-verification", component: <EmailVerification /> },
	{ path: "/auth/register", component: <Register /> },
	{ path: "/auth/login-otp", component: <CustLogin /> },
	{ path: "/auth/reset-password", component: <ResetPassword /> },
	{ path: "/", component: <Navigate to="/auth/dashboard" /> },

	//External Link
	{ path: "link/products/add-product", component : <AddProductExternalLink /> },
	
];


export { authProtectedRoutes, publicRoutes };
