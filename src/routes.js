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
import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import createContainerComponent from "views/createContainerComponent";
import CreateCompany from "views/examples/CreateCompany";
import CreateVaccine from "views/examples/CreateVaccine";
import CreateContainer from "views/examples/CreateContainer";


import ViewCompany from "views/examples/ViewCompany";
import ViewContainer from "views/examples/ViewContainer";
import ViewVaccine from "views/examples/ViewVaccine";
import ViewIOT from "views/examples/ViewIOT";
import SupplyChainFlow from "views/examples/SupplyChainFlow";
import AdminPanel from "views/examples/AdminPanel";
import EntityAdminPanel from "views/examples/EntityAdminPanel";

let createRoutes = [
  {
    path: "/CreateContainer",
    name: "Create Container",
    icon: "fas fa-plus-square text-red",
    component: CreateContainer,
    layout: "/admin"
  },
  {
    path: "/CreateCompany",
    name: "Create Company",
    icon: "fas fa-plus-square text-red",
    component: CreateCompany,
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
    path: "/ViewCompany",
    name: "View Company",
    icon: "fas fa-building text-blue",
    component: ViewCompany,
    layout: "/admin"
  },
  {
    path: "/ViewContainer",
    name: "View Container",
    icon: "fas fa-box text-blue",
    component: ViewContainer,
    layout: "/admin"
  },
  {
    path: "/ViewVaccine",
    name: "View Vaccine",
    icon: "fas fa-syringe text-blue",
    component: ViewVaccine,
    layout: "/admin"
  },

  {
    path: "/ViewIOT",
    name: "View IOT",
    icon: "fas fa-temperature-low text-blue",
    component: ViewIOT,
    layout: "/admin"
  },
  {
    path: "/tables",
    name: "View Tables",
    icon: "fas fa-table text-blue",
    component: Tables,
    layout: "/admin"
  },


]
let adminRoutes =[
  {
    path: "/SupplyChainFlow",
    name: "Supply Chain Flow",
    icon: "fas fa-parachute-box text-green",
    component: SupplyChainFlow,
    layout: "/admin"
  },
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
let routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "fas fa-tv text-primary",
    component: Index,
    layout: "/admin"
  },
//   // {
//   //   path: "/icons",
//   //   name: "Containers",
//   //   icon: "ni ni-planet text-blue",
//   //   component: Icons,
//   //   layout: "/admin"
//   // },
//
//
//   {/*
//   {
//     path: "/maps",
//     name: "Maps",
//     icon: "ni ni-pin-3 text-orange",
//     component: Maps,
//     layout: "/admin"
//   },
//   {
//     path: "/user-profile",
//     name: "User Profile",
//     icon: "ni ni-single-02 text-yellow",
//     component: Profile,
//     layout: "/admin"
//   },
// */},
//   {/*
//   {
//     path: "/login",
//     name: "Login",
//     icon: "ni ni-key-25 text-info",
//     component: Login,
//     layout: "/auth"
//   },
//   {
//     path: "/register",
//     name: "Register",
//     icon: "ni ni-circle-08 text-pink",
//     component: Register,
//     layout: "/auth"
//   }
//   */}
];

export {
  createRoutes,
  routes,
  viewRoutes,
    adminRoutes
}
