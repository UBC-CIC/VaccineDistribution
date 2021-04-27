/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "views/HomePage.js";
import ViewProfile from "views/ViewProfile.js";
import ViewContainerStatus from "views/ViewContainerStatus.js";
import CreateCompany from "views/CreateCompany";
import CreateVaccine from "views/CreateVaccine";
import CreateContainer from "views/CreateContainer";


import ViewCompany from "views/ViewCompany";
import ViewContainer from "views/ViewContainer";
import ViewVaccine from "views/ViewVaccine";
import ViewIOT from "views/ViewIOT";
import SupplyChainFlow from "views/ViewSupplyChainFlow";
import AdminPanel from "views/AdminPanel";
import EntityAdminPanel from "views/EntityAdminPanel";
import ViewProduct from "./views/ViewProduct";

let createRoutes = [
  {
    path: "/CreateCompany",
    name: "Create Company",
    icon: "fas fa-plus-square text-red",
    component: CreateCompany,
    layout: "/admin"
  },
  {
    path: "/CreateContainer",
    name: "Create Container",
    icon: "fas fa-plus-square text-red",
    component: CreateContainer,
    layout: "/admin"
  },

  {
    path: "/CreateVaccine",
    name: "Create Vaccine",
    icon: "fas fa-plus-square  text-red",
    component: CreateVaccine,
    layout: "/admin"
  },
]


    let viewRoutes =[
  {
    path: "/Companies",
    name: "Companies",
    icon: "fas fa-building text-blue",
    component: ViewCompany,
    layout: "/admin"
  },
  {
    path: "/Containers",
    name: "Containers",
    icon: "fas fa-box text-blue",
    component: ViewContainer,
    layout: "/admin"
  },

      {
        path: "/container-status",
        name: "Container Status",
        icon: "fas fa-table text-blue",
        component: ViewContainerStatus,
        layout: "/admin"
      },
      {
        path: "/Products",
        name: "Products",
        icon: "fas fa-box text-blue",
        component: ViewProduct,
        layout: "/admin"
      },

      {
    path: "/Vaccines",
    name: "Vaccines",
    icon: "fas fa-syringe text-blue",
    component: ViewVaccine,
    layout: "/admin"
  },

  {
    path: "/IOT",
    name: "IOT",
    icon: "fas fa-temperature-low text-blue",
    component: ViewIOT,
    layout: "/admin"
  },
      {
        path: "/ViewSupplyChainFlow",
        name: "Supply Chain Flow",
        icon: "fas fa-parachute-box text-blue",
        component: SupplyChainFlow,
        layout: "/admin"
      },



    ]
let adminRoutes =[
    {
    path: "/EntityAdminPanel",
    name: "Entity Admin Panel",
    icon: "fas fa-user-shield text-green",
    component: EntityAdminPanel,
    layout: "/admin"
  },

]

let superAdminRoutes =[
  {
    path: "/AdminPanel",
    name: "Admin Panel",
    icon: "fas fa-user-shield text-green",
    component: AdminPanel,
    layout: "/admin"
  },

  {
    path: "/EntityAdminPanel",
    name: "Entity Admin Panel",
    icon: "fas fa-user-shield text-green",
    component: EntityAdminPanel,
    layout: "/admin"
  },

]

let authRoutes = [
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "fas fa-home text-yellow",
    component: ViewProfile,
    layout: "/admin"
  },

]
let routes = [
  {
    path: "/index",
    name: "Home",
    icon: "fas fa-home text-green",
    component: Index,
    layout: "/admin"
  },

];

export {
  createRoutes,
  routes,
  viewRoutes,
    adminRoutes,
    authRoutes,
  superAdminRoutes
}
